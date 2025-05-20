const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      window.location.href = "/" + e.target.id;
    }
  });
});
