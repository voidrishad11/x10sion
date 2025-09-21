const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if(bar){
    bar.addEventListener('click',()=>{
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active');
    })
}


//Searching
// Function to load products from JSON file
function loadProducts(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', 'products.json', true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status == "200") {
          callback(JSON.parse(xhr.responseText));
      }
  };
  xhr.send(null);
}

// Function to populate datalist with product suggestions
function populateDatalist(products) {
  var datalist = document.getElementById('productSuggestions');
  datalist.innerHTML = '';
  products.forEach(function (product) {
      var option = document.createElement('option');
      option.value = product.name;
      datalist.appendChild(option);
  });
}

// Function to navigate to product page
function goToProduct(url) {
  window.location.href = url;
}

// Event listener for the search input field
document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
      searchInput.addEventListener('input', function (event) {
          var searchTerm = event.target.value.toLowerCase();
          loadProducts(function (products) {
              var filteredProducts = products.filter(function (product) {
                  return product.name.toLowerCase().includes(searchTerm);
              });
              populateDatalist(filteredProducts);
          });
      });

      // Add event listener for enter key press
      searchInput.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') {
              var searchTerm = searchInput.value.toLowerCase();
              loadProducts(function (products) {
                  var matchedProduct = products.find(function (product) {
                      return product.name.toLowerCase() === searchTerm;
                  });
                  if (matchedProduct) {
                      goToProduct(matchedProduct.url);
                  } else {
                      alert("Product not available");
                  }
              });
          }
      });
  }
});

// Event listener for the search button
var searchButton = document.getElementById('searchButton');
if (searchButton) {
  searchButton.addEventListener('click', function () {
      var searchTerm = document.getElementById('searchInput').value.toLowerCase();
      loadProducts(function (products) {
          var matchedProduct = products.find(function (product) {
              return product.name.toLowerCase() === searchTerm;
          });
          if (matchedProduct) {
              goToProduct(matchedProduct.url);
          } else {
              alert("Product not available");
          }
      });
  });
}


//add to cart
// Function to calculate subtotal
 function calculateSubtotal(cart) {
     var subtotal = 0;
     cart.forEach(function(item) {
         subtotal += item.price * item.quantity;
     });
     return subtotal;
 }

 document.addEventListener("DOMContentLoaded", function() {
     // Get cart items from local storage
     var cart = JSON.parse(localStorage.getItem('cart')) || [];

     // Get the tbody element to append cart items
     var cartItems = document.getElementById('cartItems');

     // Get the subtotal element
     var subtotalElement = document.getElementById('subtotal');

     // Clear existing content in cartItems
     cartItems.innerHTML = '';

     // Loop through each item in the cart and display it in the table
     cart.forEach(function(item) {
         var row = document.createElement('tr');
         row.innerHTML = `
             <td><img src="${item.image}" alt="${item.name}" width="50"></td>
             <td>${item.name}</td>
             <td>$${item.price}</td>
             <td>${item.quantity}</td>
             <td>$${item.price * item.quantity}</td>
             <td><button class="remove-product">Remove</button></td>
         `;
         cartItems.appendChild(row);
     });

     // Calculate and display subtotal
     var subtotal = calculateSubtotal(cart);
     subtotalElement.textContent = '$' + subtotal.toFixed(2);

     // Add event listener to remove product links
     const removeProductLinks = document.querySelectorAll('.remove-product');
     removeProductLinks.forEach(link => {
         link.addEventListener('click', (event) => {
             event.preventDefault();
             const row = event.target.closest('tr');
             row.remove();
             // Update the cart in local storage after removing the item
             updateLocalStorageCart();
             // Recalculate subtotal after removing item
             subtotal = calculateSubtotal(cart);
             subtotalElement.textContent = '$' + subtotal.toFixed(2);
         });
     });
 });

 // Function to update the cart in local storage
 function updateLocalStorageCart() {
     var cartItems = document.querySelectorAll('#cartItems tr');
     var cart = [];
     cartItems.forEach(function(row) {
         var productName = row.cells[1].textContent;
         var productPrice = parseFloat(row.cells[2].textContent.replace('$', ''));
         var quantity = parseInt(row.cells[3].textContent);
         var product = {
             name: productName,
             price: productPrice,
             quantity: quantity
         };
         cart.push(product);
     });
     // Update the cart in local storage
     localStorage.setItem('cart', JSON.stringify(cart));
 }


 document.addEventListener("DOMContentLoaded", function() {
    // Update total quantity in the header
    updateTotalQuantity();

    // Function to update total quantity in the header
    function updateTotalQuantity() {
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var totalQuantity = 0;
        cart.forEach(function(item) {
            totalQuantity += item.quantity;
        });
        document.getElementById('cartQuantity').textContent = totalQuantity;
        document.getElementById('mobileCartQuantity').textContent = totalQuantity;
    }

    // Add event listener for changes in the cart
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateTotalQuantity();
        }
    });
});



//login

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const authenticated = await authenticateUser(email, password);

  if (authenticated) {
    window.location.href = "index.html";
  } else {
    alert("Wrong email or password");
  }
});

// Function for authenticating user based on email and password
async function authenticateUser(email, password) {
  // Fetch user data from JSON file
  const response = await fetch('users.json');
  const users = await response.json();

  // Check if the entered email and password match any user's credentials
  const user = users.find(user => user.email === email && user.password === password);
  return !!user; // Returns true if a user is found, false otherwise
}
