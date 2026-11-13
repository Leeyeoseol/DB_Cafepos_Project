// 데이터 저장할 전역 변수
let allMenus = [];

//렌더링 함수
function renderMenus(menusToRender) {
  const menuGrid = document.getElementById("menu-grid");
  menuGrid.innerHTML = "";

  for (let item of menusToRender) {
    const imgSrc = "/assets/" + item.menu_id + ".jpg";
    const formattedPrice = item.price.toLocaleString() + "원";
    const className = "menu-img-" + item.menu_id;

    menuGrid.innerHTML += `
    <div onclick="handleClick(${item.menu_id})" class="menu-card">
      <div class="menu-img-box">
        <img src="${imgSrc}" alt="${item.name}" class="${className}">
      </div>
      <div class="menu-info">
        <span class="menu-name">${item.name}</span>
        <span class="menu-price">${formattedPrice}</span>
      </div>
    </div>
    `;
  }
}

//클릭시에
function handleClick(id) {
  const cartItem = Cartlist.find((item) => item.menu_id === id);

  if (cartItem) {
    cartItem.count++;
  } else {
    // 처음 담는 메뉴라면
    const selectedMenu = allMenus.find((item) => item.menu_id === id);

    Cartlist.push({
      ...selectedMenu,
      count: 1,
    });
  }

  loadCart(Cartlist);
}

//카테고리 탭 생성
function createTabs(menus) {
  const tabsContainer = document.getElementById("tabs");

  const categories = ["전체", ...new Set(menus.map((item) => item.category))];

  //생성
  tabsContainer.innerHTML = categories
    .map(
      (category, index) => `
    <button class="tab-btn ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>
  `,
    )
    .join("");

  //클릭 이벤트
  tabsContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("tab-btn")) return;

    const allTabs = tabsContainer.querySelectorAll(".tab-btn");
    allTabs.forEach((tab) => tab.classList.remove("active"));

    e.target.classList.add("active");

    const selectedCategory = e.target.dataset.category;

    if (selectedCategory === "전체") {
      renderMenus(allMenus);
    } else {
      const filtered = allMenus.filter(
        (item) => item.category === selectedCategory,
      );
      renderMenus(filtered);
    }
  });
}

//render 함수
function loadCart(list) {
  const cartContainer = document.getElementById("cart-list");
  cartContainer.innerHTML = "";

  for (let item of list) {
    const imgSrc = "/assets/" + item.menu_id + ".jpg";
    const formattedPrice = (item.price * item.count).toLocaleString() + "원";

    cartContainer.innerHTML += `
    <div class="cart-card">

      <div class="cart-img-box">
        <img src="${imgSrc}" alt="${item.name}" class="cart-img menu-img-${item.menu_id}">
      </div>

      <div class="cart-info">
        <span class="cart-name">${item.name}</span>
        <span class="cart-price">${formattedPrice}</span>
      </div>

      <div class="cart-right">
        <button onclick="deleteClick(${item.menu_id})" class="delete-btn" data-id="${item.menu_id}">✕</button>
        <div class="cart-count">
          <button onclick="minusClick(${item.menu_id})" class="minus" data-id="${item.menu_id}">-</button>
          <span class="count">${item.count}</span>  
          <button onclick="plusClick(${item.menu_id})" class="plus" data-id="${item.menu_id}">+</button>
        </div>
      </div>

    </div>
    `;
  }
  updateCount();
  updateTotal();
}

// - 갯수 빼기
function minusClick(id) {
  const item = Cartlist.find((item) => item.menu_id === id);

  if (item.count > 1) {
    item.count--;
  } else {
    //하나면 삭제
    deleteClick(id);
    return;
  }

  loadCart(Cartlist);
}

// + 갯수 더하기
function plusClick(id) {
  const item = Cartlist.find((item) => item.menu_id === id);

  item.count++;
  loadCart(Cartlist);
}

//주문 삭제
function deleteClick(id) {
  const index = Cartlist.findIndex((item) => item.menu_id === id);

  Cartlist.splice(index, 1);
  loadCart(Cartlist);
}

//전체 삭제
function allClear() {
  Cartlist.length = 0;
  loadCart(Cartlist);
}

//여기부분은 공통 부분인ㄷ 어떻게 전체 적용할지 고민하깅
const Cartlist = [];

//총 금액 합계
function getTotal() {
  return Cartlist.reduce((sum, item) => sum + item.price * item.count, 0);
}

//총 갯수 합계
function getCount() {
  return Cartlist.reduce((sum, item) => sum + item.count, 0);
}

//Cart 전체 가격
const CartPrice = 0;

function updateCount() {
  document.getElementById("cart-count").textContent =
    getCount().toLocaleString() + "개";
}

function updateTotal() {
  document.getElementById("cart-total").textContent =
    getTotal().toLocaleString() + "원";
}

//DB 확인용
async function init() {
  const res = await fetch("/api/menus");
  allMenus = await res.json();
  console.log("DB에서 가져온 메뉴 데이터:", allMenus);

  createTabs(allMenus);
  renderMenus(allMenus);
}

//실행
init();
