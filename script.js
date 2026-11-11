/* =====================================
   ADNOVA WEBSITE
   ===================================== */


/* CHANGE THIS TO YOUR WHATSAPP NUMBER

   Example:
   India number 9758632175

   Do NOT use + sign or spaces.
*/

const WHATSAPP_NUMBER = "919758632175";
const ORDER_MODE = "retail";


/* =====================================
   PRODUCTS
   =====================================

   To add a product:

   {
      id: 9,
      name: "Your Product",
      category: "Brass Decor",
      price: 499,
      image: "your-image.jpg",
      description: "Your product description"
   }

*/

let products = [];

// ADMIN PANEL
function openAdmin() {
  document.getElementById("adminPanel").style.display = "block";
}

function closeAdmin() {
  document.getElementById("adminPanel").style.display = "none";
}

// Load saved products
const savedProducts = JSON.parse(
  localStorage.getItem("adnovaProducts") || "[]"
);

products.push(...savedProducts);

// Save new product
document.getElementById("productForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const newProduct = {
    id: Math.max(0, ...products.map(p => Number(p.id))) + 1,
    name: document.getElementById("newName").value.trim(),
    category: document.getElementById("newCategory").value,
    price: Number(document.getElementById("newPrice").value),
    image: document.getElementById("newImage").value.trim(),
    description: document.getElementById("newDescription").value.trim()
  };

  if (
    !newProduct.name ||
    !newProduct.category ||
    !Number.isFinite(newProduct.price) ||
    newProduct.price <= 0 ||
    !newProduct.image ||
    !newProduct.description
  ) {
    alert("Please enter valid product details.");
    return;
  }

  // Mark as admin product first
newProduct.isAdminProduct = true;

// Add product
products.push(newProduct);

// Save admin products
localStorage.setItem(
  "adnovaProducts",
  JSON.stringify(
    products.filter(p => p.isAdminProduct)
  )
);

  displayProducts(products);
  document.getElementById("productForm").reset();
  closeAdmin();

  alert("Product added successfully!");
});


/* =====================================
   CART
   ===================================== */

let cart = JSON.parse(localStorage.getItem("adnovaCart")) || [];


/* =====================================
   LOAD PRODUCTS
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {

  displayProducts(products);

  updateCart();

  document.getElementById("whatsappLink").href =
    "https://wa.me/" + WHATSAPP_NUMBER;

});


/* =====================================
   DISPLAY PRODUCTS
   ===================================== */

function displayProducts(productList) {

  const grid = document.getElementById("productGrid");

  if (productList.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;

    return;
  }


  grid.innerHTML = productList.map(product => `

    <div class="product-card">

      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-info">

        <div class="product-category">
          ${product.category}
        </div>

        <h3 class="product-name">
          ${product.name}
        </h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="price">
          ₹${product.price.toLocaleString("en-IN")}
        </div>

        <div class="product-buttons">

          <button
            class="view-btn"
            onclick="viewProduct(${product.id})">
            View
          </button>

          <button
            class="add-btn"
            onclick="addToCart(${product.id})">
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  `).join("");

}


/* =====================================
   SEARCH
   ===================================== */

function searchProducts() {

  const search =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase()
      .trim();

  const category =
    document.getElementById("categoryFilter").value;


  let filtered = products.filter(product => {

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;

  });


  displayProducts(filtered);

}


/* =====================================
   CATEGORY FILTER
   ===================================== */

function filterProducts(category) {

  document.getElementById("categoryFilter").value = category;

  if (category === "All") {

    displayProducts(products);

  } else {

    const filtered =
      products.filter(
        product => product.category === category
      );

    displayProducts(filtered);

  }

  document
    .getElementById("products")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* =====================================
   ADD TO CART
   ===================================== */

function addToCart(productId) {

  const product =
    products.find(product => product.id === productId);

  if (!product) return;


  const existing =
    cart.find(item => item.id === productId);


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }


  saveCart();

  updateCart();

  alert(product.name + " added to cart.");

}


/* =====================================
   SAVE CART
   ===================================== */

function saveCart() {

  localStorage.setItem(
    "adnovaCart",
    JSON.stringify(cart)
  );

}


/* =====================================
   UPDATE CART
   ===================================== */

function updateCart() {

  const count =
    cart.reduce(
      (total, item) => total + item.quantity,
      0
    );


  document.getElementById("cartCount").textContent = count;


  const cartItems =
    document.getElementById("cartItems");


  if (!cartItems) return;


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty">
        <h3>Your cart is empty</h3>
        <p>Add some products to continue.</p>
      </div>
    `;

    document.getElementById("cartTotal").textContent = "0";

    return;
  }


  cartItems.innerHTML = cart.map(item => `

    <div class="cart-item">

      <div>
        <h4>${item.name}</h4>

        <small>
          ₹${item.price.toLocaleString("en-IN")}
        </small>
      </div>


      <div class="quantity-controls">

        <button onclick="changeQuantity(${item.id}, -1)">
          −
        </button>

        <strong>
          ${item.quantity}
        </strong>

        <button onclick="changeQuantity(${item.id}, 1)">
          +
        </button>

      </div>


      <strong>
        ₹${(item.price * item.quantity)
          .toLocaleString("en-IN")}
      </strong>


      <button
        class="remove-btn"
        onclick="removeFromCart(${item.id})">
        Remove
      </button>

    </div>

  `).join("");


  const total =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );


  document.getElementById("cartTotal").textContent =
    total.toLocaleString("en-IN");

}


/* =====================================
   CHANGE QUANTITY
   ===================================== */

function changeQuantity(productId, amount) {

  const item =
    cart.find(item => item.id === productId);

  if (!item) return;


  item.quantity += amount;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        item => item.id !== productId
      );

  }


  saveCart();

  updateCart();

}


/* =====================================
   REMOVE PRODUCT
   ===================================== */

function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
    );

  saveCart();

  updateCart();

}


/* =====================================
   CLEAR CART
   ===================================== */

function clearCart() {

  if (cart.length === 0) return;


  const confirmClear =
    confirm("Are you sure you want to clear the cart?");


  if (confirmClear) {

    cart = [];

    saveCart();

    updateCart();

  }

}


/* =====================================
   OPEN CART
   ===================================== */

function openCart() {

  document.getElementById("cartModal").style.display = "block";

  updateCart();

}


/* =====================================
   CLOSE CART
   ===================================== */

function closeCart() {

  document.getElementById("cartModal").style.display = "none";

}


/* =====================================
   VIEW PRODUCT
   ===================================== */

function viewProduct(productId) {

  const product =
    products.find(
      product => product.id === productId
    );

  if (!product) return;


  document.getElementById("detailImage").src =
    product.image;

  document.getElementById("detailCategory").textContent =
    product.category;

  document.getElementById("detailName").textContent =
    product.name;

  document.getElementById("detailPrice").textContent =
    product.price.toLocaleString("en-IN");

  document.getElementById("detailDescription").textContent =
    product.description;


  document.getElementById("detailAddButton").onclick =
    function () {

      addToCart(product.id);

    };


  document.getElementById("productModal").style.display =
    "block";

}


/* =====================================
   CLOSE PRODUCT
   ===================================== */

function closeProduct() {

  document.getElementById("productModal").style.display =
    "none";

}


/* =====================================
   WHATSAPP CHECKOUT
   ===================================== */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;

  }


  let message =
    "Hello ADNOVA,%0A%0A" +
    "I want to place an order:%0A%0A";


  let total = 0;


  cart.forEach((item, index) => {

    const itemTotal =
      item.price * item.quantity;

    total += itemTotal;


    message +=
      `${index + 1}. ${item.name}%0A` +
      `Quantity: ${item.quantity}%0A` +
      `Price: ₹${item.price}%0A` +
      `Subtotal: ₹${itemTotal}%0A%0A`;

  });


  message +=
    `Total: ₹${total}%0A%0A` +
    "Please confirm availability and delivery details.";


  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message;


  window.open(url, "_blank");

}


/* =====================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ===================================== */

window.addEventListener("click", function (event) {

  const cartModal =
    document.getElementById("cartModal");

  const productModal =
    document.getElementById("productModal");


  if (event.target === cartModal) {

    closeCart();

  }


  if (event.target === productModal) {

    closeProduct();

  }

});