const products = [
  {id:1,name:"Wireless Headphones",price:59.99,cat:"Electronics",rating:4,emoji:"🎧"},
  {id:2,name:"Smart Watch",price:129.99,cat:"Electronics",rating:5,emoji:"⌚"},
  {id:3,name:"Laptop Backpack",price:34.5,cat:"Fashion",rating:4,emoji:"🎒"},
  {id:4,name:"Running Shoes",price:74.0,cat:"Fashion",rating:4,emoji:"👟"},
  {id:5,name:"JavaScript: The Good Parts",price:19.99,cat:"Books",rating:5,emoji:"📘"},
  {id:6,name:"Data Structures Handbook",price:24.99,cat:"Books",rating:4,emoji:"📚"},
  {id:7,name:"Coffee Maker",price:49.0,cat:"Home",rating:4,emoji:"☕"},
  {id:8,name:"Desk Lamp",price:22.75,cat:"Home",rating:5,emoji:"💡"},
  {id:9,name:"Bluetooth Speaker",price:39.99,cat:"Electronics",rating:4,emoji:"🔊"},
  {id:10,name:"Sunglasses",price:18.99,cat:"Fashion",rating:3,emoji:"🕶️"},
  {id:11,name:"Mechanical Keyboard",price:69.99,cat:"Electronics",rating:5,emoji:"⌨️"},
  {id:12,name:"Table Fan",price:29.99,cat:"Home",rating:4,emoji:"🌀"}
];
const categories = ["All", ...new Set(products.map(p => p.cat))];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentCat = "All", query = "";

const $ = id => document.getElementById(id);
const grid = $("productGrid"), cartEl = $("cart"), overlay = $("overlay");

function stars(n){ return "★".repeat(n) + "☆".repeat(5 - n); }

function renderCategories(){
  $("categorySelect").innerHTML = categories.map(c => `<option>${c}</option>`).join("");
  $("subnav").innerHTML = categories.map(c => `<a data-c="${c}" class="${c===currentCat?'active':''}">${c}</a>`).join("");
  document.querySelectorAll("#subnav a").forEach(a => a.onclick = () => { currentCat = a.dataset.c; $("categorySelect").value = currentCat; render(); renderCategories(); });
}

function render(){
  const list = products.filter(p =>
    (currentCat === "All" || p.cat === currentCat) &&
    p.name.toLowerCase().includes(query.toLowerCase()));
  $("sectionTitle").textContent = currentCat === "All" ? "Featured Products" : currentCat;
  grid.innerHTML = list.length ? list.map(p => `
    <div class="card">
      <div class="img">${p.emoji}</div>
      <h4>${p.name}</h4>
      <div class="rating">${stars(p.rating)}</div>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="add" data-id="${p.id}">Add to Cart</button>
    </div>`).join("") : `<p class="empty">No products found.</p>`;
  document.querySelectorAll(".add").forEach(b => b.onclick = () => addToCart(+b.dataset.id));
}

function save(){ localStorage.setItem("cart", JSON.stringify(cart)); renderCart(); }
function addToCart(id){
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({id, qty:1});
  save(); openCart();
}
function changeQty(id, d){
  const item = cart.find(i => i.id === id);
  item.qty += d;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  save();
}
function removeItem(id){ cart = cart.filter(i => i.id !== id); save(); }

function renderCart(){
  let total = 0, count = 0;
  $("cartItems").innerHTML = cart.length ? cart.map(ci => {
    const p = products.find(x => x.id === ci.id);
    total += p.price * ci.qty; count += ci.qty;
    return `<div class="item">
      <div class="e">${p.emoji}</div>
      <div class="info"><strong>${p.name}</strong><br>$${p.price.toFixed(2)}
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${ci.qty}<button onclick="changeQty(${p.id},1)">+</button></div>
      </div>
      <button class="remove" onclick="removeItem(${p.id})">Remove</button>
    </div>`;
  }).join("") : "<p class='empty'>Your cart is empty.</p>";
  $("cartTotal").textContent = "$" + total.toFixed(2);
  $("cartCount").textContent = count;
}

function openCart(){ cartEl.classList.add("open"); overlay.classList.add("show"); }
function closeCart(){ cartEl.classList.remove("open"); overlay.classList.remove("show"); }
$("cartBtn").onclick = openCart;
$("closeCart").onclick = closeCart;
overlay.onclick = closeCart;
$("checkout").onclick = () => {
  if(!cart.length) return alert("Your cart is empty.");
  alert("Order placed! (demo only)"); cart = []; save(); closeCart();
};

$("searchBtn").onclick = () => { query = $("searchInput").value; currentCat = $("categorySelect").value; render(); renderCategories(); };
$("searchInput").addEventListener("keydown", e => { if(e.key === "Enter") $("searchBtn").click(); });

// Hero slider
const slides = document.querySelectorAll(".slide");
let s = 0;
function show(n){ slides[s].classList.remove("active"); s = (n + slides.length) % slides.length; slides[s].classList.add("active"); }
$("next").onclick = () => show(s + 1);
$("prev").onclick = () => show(s - 1);
setInterval(() => show(s + 1), 4000);

renderCategories(); render(); renderCart();
