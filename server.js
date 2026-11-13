const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/menus", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM menus WHERE is_deleted = FALSE",
  );
  res.json(rows);
});

// 주문 목록 조회
app.get("/api/orders", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT o.order_id, o.status, o.ordered_at,
           SUM(oi.quantity * oi.unit_price) AS total,
           GROUP_CONCAT(CONCAT(m.name, ' x', oi.quantity) SEPARATOR '<br>') AS items
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menus m ON oi.menu_id = m.menu_id
    GROUP BY o.order_id
    ORDER BY o.order_id DESC
  `);
  res.json(rows);
});

// 주문 상태 변경
app.patch("/api/orders/:id", async (req, res) => {
  await pool.query("UPDATE orders SET status = 'DONE' WHERE order_id = ?", [
    //?가 뭐게용? 설명 하기
    req.params.id,
  ]);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("http://localhost:3000"));

// 결제 후 주문 저장
app.post("/api/orders", async (req, res) => {
  const items = req.body.items;
  const paymentMethod = req.body.payment_method;

  // 주문 저장
  const [result] = await pool.query(
    "INSERT INTO orders (payment_method) VALUES (?)",
    [paymentMethod],
  );

  const orderId = result.insertId;

  // 주문 상세 저장
  for (let item of items) {
    await pool.query(
      "INSERT INTO order_items (order_id, menu_id, quantity, unit_price) VALUES (?, ?, ?, ?)", //?가 뭐게용? 설명 하기
      [orderId, item.menu_id, item.count, item.price],
    );
  }

  res.json({ order_id: orderId });
});
