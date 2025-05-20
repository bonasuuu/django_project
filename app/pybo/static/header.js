const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((menuItem) => {
  menuItem.addEventListener("click", (e) => {
    menuItems.forEach((item) => item.classList.remove("active"));
    if (e.target === e.currentTarget) {
      //   window.location.href = "/" + e.target.id;
      e.target.classList.add("active");
    }
  });
});
