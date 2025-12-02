// Add to Cart simulation
function addToCart() {
    document.getElementById("cartMessage").textContent =
        "Item added to cart!";
}

// Basic search (client-side)
document.getElementById("searchInput").addEventListener("input", function () {
    console.log("User searched for:", this.value); // You can expand this later
});
