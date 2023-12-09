const productSelect = document.querySelector(".productSelect"); //選取第一個 <select class="productSelect"> 元素
// const optionAll = productSelect.querySelector('option[value="全部"]');
// const optionBedStone = productSelect.querySelector('option[value="床架"]');
// const optionStorage = productSelect.querySelector('option[value="收納"]');
// const optionCurtain = productSelect.querySelector('option[value="窗簾"]');
const addCardBtn = document.querySelector(".addCardBtn"); //加入購物車按鈕
const productWrap = document.querySelector(".productWrap"); //選取第一個 <ul class="productWrap"> 元素
const productCard = document.querySelector(".productCard"); // 選取第一個 <li class="productCard"> 元素
const productNameElement = productCard.querySelector("h3"); // 從 productCard 元素中選取 <h3> 元素
const productName = productNameElement.textContent; // 獲取 <h3> 元素的文本內容
const discardBtn = document.querySelector(".discardBtn a"); //購物車內單一物品刪除icon
const discardAllBtn = document.querySelector(".discardAllBtn"); //刪除所有品項
const orderInfo = document.querySelector(".orderInfo-btn"); //送出預訂資料
const shoppingCartList = document.querySelector(".shoppingCartList");
//預設列出品項
let productData = [];
function init(){
  getProductList();
  getProductCartList();
}
init()//列出預設清單
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productData = response.data.products;
      productWrap.innerHTML = "";
      renderProductList();
    });
}
//渲染項目清單
function renderProductList() {
  let str = "";
  productData.forEach(function (item) {
    str += `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${item.images}" alt="">
  <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${item.origin_price}</del>
  <p class="nowPrice">NT$${item.price}</p>
  </li>`;
    productWrap.innerHTML = str;
  });
}
//刪除所有品項
function discardAll() {
  axios
  .delete(
    `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
  )
  .then(function(response){
    console.log(response);
    getProductCartList()
  })
  .catch(function(response){
    alert("購物車已經清空");
  })
  
  
  console.log("刪除所有品項");
}
//列出購物車清單
let cartData = [];
function getProductCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      console.log(response.data);
      cartData = response.data.carts;
      let str = "";
      let totalPrice = 0;
      cartData.forEach(function (item) {
        str += `
        <tr>
          <td>
          <div class="cardItem-title">
              <img src=${
                item.product.images
              } alt="" referrerpolicy="no-referrer">
              <p>${item.product.title}</p>
          </div>
          </td>
          <td>NT$${item.product.price}</td>
          <td>${item.quantity}</td>
          <td>NT$${item.product.price * item.quantity}</td>
          <td class="discardBtn">
            <a href="#" data-id="${item.id}" class="material-icons" >
              clear
            </a>
          </td>
        </tr>`;
        shoppingCartList.innerHTML = str;
        totalPrice += Number(item.product.price * item.quantity);
      });
      document.querySelector(".shoppingCartTotalPrice").innerHTML =
        "NT$" + totalPrice;
    });    
}
//點擊篩選清單
productSelect.addEventListener("change", function (e) {
  if (e.target.value == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (e.target.value == item.category) {
      str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`;
      productWrap.innerHTML = str;
    }
  });
});
//點擊加入購物車
productWrap.addEventListener("click", function (e) {
  e.preventDefault(); //阻止預設
  let numCheck = 1;
  let productId = e.target.getAttribute("data-id"); //產品id
  shoppingCartList.innerHTML = "";
  // let numCheck = 1; //購物車預設數量
  if (e.target.getAttribute("class") !== "addCardBtn") {
    return;
  }
  cartData.forEach(function (item) {
    if (productId !== item.product.id) {
      return;
    }
    numCheck = item.quantity+=1;   
    
  });
  axios
  .post(
    `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
      "data": {
        "productId": productId,
        "quantity": numCheck
      }
    }
  )
  .then(function (response) {
    // console.log(response.data);
    console.log(numCheck);
    getProductCartList()
  }); 
});
//點擊刪除該品項
shoppingCartList.addEventListener("click", function (e) {  
  e.preventDefault();
  let targetId = e.target.getAttribute("data-id")
  axios
  .delete(
    `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${targetId}`
  )
  .then(function (response) {
    console.log(response.data.finalTotal);  
    if(response.data.finalTotal==0){
      shoppingCartList.innerHTML=""; 
      getProductCartList();                 
    }
    getProductCartList();    
  }); 
});
// 點擊刪除所有品項
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  shoppingCartList.innerHTML="";
  discardAll();
});

orderInfo.addEventListener("click",function(e){
  
  e.preventDefault();  
  
  if(cartData.length==0){
    alert("請加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
  if(customerName==""|| customerPhone=="" || customerEmail=="" || customerAddress=="" || customerTradeWay==""){
    alert("請輸入訂單資訊");
    return;
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
    "data":{
      "user":{
        "name":customerName,
        "tel":customerPhone,
        "email":customerEmail,
        "address":customerAddress,
        "payment":customerTradeWay
      }
    }
  }).then(function(response){
    alert("訂單送出成功");
    console.log(response);
    getProductList();
    shoppingCartList.innerHTML="";
    document.querySelector(".shoppingCartTotalPrice").innerHTML = "NT$0" ;    
    document.querySelector("#customerName").value='';
    document.querySelector("#customerPhone").value='';
    document.querySelector("#customerEmail").value='';
    document.querySelector("#customerAddress").value='';
    document.querySelector("#tradeWay").value="ATM";

  })  

})



