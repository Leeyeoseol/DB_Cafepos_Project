let payTotal = 0;
let payMethod = "";

//여기부분은 공통 부분인ㄷ 어떻게 전체 적용할지 고민하깅 => 계산 부분은 따로 만들까? 그러면 렌더링도 따로 뺄까..?
const Cartlist = [];

//총 금액 합계
function getTotal() {
  return Cartlist.reduce((sum, item) => sum + item.price * item.count, 0);
}

//총 갯수 합계
function getCount() {
  return Cartlist.reduce((sum, item) => sum + item.count, 0);
}

// 결제창 열기 🚨왜 안열리지??????
function openPay() {
  if (Cartlist.length === 0) {
    alert("장바구니가 비어 있습니다.");
    return;
  }

  payTotal = getTotal();
  payMethod = "";

  document.getElementById("pay-count").textContent = getCount() + "개";
  document.getElementById("pay-total").textContent =
    payTotal.toLocaleString() + "원";

  let html = "";
  for (let item of Cartlist) {
    html += `<div class="pay-item">${item.name} x${item.count} / ${(item.price * item.count).toLocaleString()}원</div>`;
  }
  document.getElementById("pay-items").innerHTML = html;

  for (let b of document.querySelectorAll(".pay-options button")) {
    b.classList.remove("selected");
  }
  document.getElementById("pay-received").value = "";

  checkPay();
  document.getElementById("pay").style.display = "flex";
}

// 결제창 닫기
function closePay() {
  document.getElementById("pay").style.display = "none";
}
