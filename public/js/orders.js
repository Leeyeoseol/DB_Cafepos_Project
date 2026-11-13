async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();

  let html = "";
  for (let o of orders) {
    const time = new Date(o.ordered_at).toLocaleString();
    const status =
      o.status === "DONE"
        ? "완료"
        : `준비중 <button onclick="doneClick(${o.order_id})">완료 처리</button>`;

    html += `
    <tr>
      <td>${o.order_id}</td>
      <td>${o.items}</td>
      <td>${Number(o.total).toLocaleString()}원</td>
      <td>${time}</td>
      <td>${status}</td>
    </tr>`;
  }
  document.getElementById("order-list").innerHTML = html;
}

async function doneClick(id) {
  await fetch("/api/orders/" + id, { method: "PATCH" });
  loadOrders();
}

loadOrders();
