const HEADER = `
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="index.html" aria-label="Cookies MJ, inicio"><span class="brand-mark">M</span><span>cookies MJ</span></a>
    <nav class="nav-links" id="main-navigation" aria-label="Navegación principal">
      <a href="index.html">Inicio</a><a href="productos.html">Productos</a><a href="nosotros.html">Nosotros</a><a href="pedidos.html">Pedidos</a><a href="contacto.html">Contacto</a>
    </nav>
    <div class="nav-actions"><a class="cart-link" href="pedidos.html" aria-label="Hacer un pedido">♧</a><button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-navigation">☰</button></div>
  </div>
</header>`;
const FOOTER = `
<footer class="site-footer"><div class="container">
  <div class="footer-main"><a class="footer-brand" href="index.html">Pequeños momentos,<span>grandes sabores.</span></a>
    <nav class="footer-links" aria-label="Enlaces del pie de página"><a href="productos.html">Productos</a><a href="nosotros.html">Nosotros</a><a href="pedidos.html">Hacer pedido</a><a href="contacto.html">Contacto</a></nav>
    <div class="social-links"><a href="https://www.instagram.com/cookies._mj/" target="_blank" rel="noopener" aria-label="Instagram">◎</a><a href="https://wa.me/59164878509" target="_blank" rel="noopener" aria-label="WhatsApp">◉</a></div>
  </div><div class="footer-bottom"><span>© <span id="current-year"></span> Cookies MJ</span><span>Hecho para compartir algo dulce.</span></div>
</div></footer>`;
document.querySelector("#site-header")?.insertAdjacentHTML("afterbegin", HEADER);
document.querySelector("#site-footer")?.insertAdjacentHTML("afterbegin", FOOTER);
const currentFile = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach(link => {
  if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
});
document.querySelector(".menu-toggle")?.addEventListener("click", event => {
  const button = event.currentTarget;
  const nav = document.querySelector("#main-navigation");
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  button.textContent = open ? "×" : "☰";
});
document.querySelector("#current-year")?.append(String(new Date().getFullYear()));

const productDetails = {
  "clasicas": {title:"Galletas clásicas", price:"Bs 8", description:"Galleta artesanal con chispas de chocolate, exterior ligeramente crujiente y centro suave.", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=85"},
  "red-velvet": {title:"Galletas red velvet", price:"Bs 9", description:"Una galleta suave con sabor especial y color intenso, ideal para darte un gusto.", image:"https://images.unsplash.com/photo-1590080877777-b7d7e9f1f5c3?auto=format&fit=crop&w=1000&q=85"},
  "rellenas": {title:"Galletas rellenas", price:"Bs 10", description:"Una masa suave con un centro cremoso que hace especial cada mordida.", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85"},
  "doble-chocolate": {title:"Galletas doble chocolate", price:"Bs 9", description:"Para quienes aman el chocolate: intenso, delicioso y perfecto para compartir.", image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85"},
  "oreo": {title:"Galletas Oreo", price:"Bs 10", description:"Una combinación divertida con trozos de galleta de chocolate.", image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85"},
  "limon": {title:"Galletas de limón", price:"Bs 8", description:"Un sabor fresco y aromático para variar tu antojo de siempre.", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=85"}
};
const type = new URLSearchParams(location.search).get("tipo") || "clasicas";
const detail = productDetails[type];
if (detail && document.querySelector("#detail-title")) {
  document.querySelector("#detail-title").textContent = detail.title;
  document.querySelector("#detail-price").textContent = detail.price;
  document.querySelector("#detail-description").textContent = detail.description;
  document.querySelector("#detail-image").src = detail.image;
  document.querySelector("#detail-image").alt = detail.title;
  document.querySelector("#detail-order").href = `pedidos.html?producto=${encodeURIComponent(detail.title)}`;
}
document.querySelectorAll("[data-qty]").forEach(button => button.addEventListener("click", () => {
  const input = document.querySelector("#detail-quantity");
  if (!input) return;
  input.value = Math.max(1, Number(input.value || 1) + Number(button.dataset.qty));
}));
const orderForm = document.querySelector("#order-form");
if (orderForm) {
  const dateInput = document.querySelector("#date");
  if (dateInput) dateInput.min = new Date().toISOString().slice(0,10);
  const requestedProduct = new URLSearchParams(location.search).get("producto");
  if (requestedProduct) {
    const select = document.querySelector("#product");
    [...select.options].forEach(option => { if (option.text.toLowerCase().includes(requestedProduct.toLowerCase().replace("galletas ",""))) select.value = option.value; });
  }
  orderForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!orderForm.reportValidity()) return;
    const data = new FormData(orderForm);
    const message = [
      "Hola, Cookies MJ. Quiero hacer un pedido:",
      `Producto: ${data.get("product")}`,
      `Cantidad: ${data.get("quantity")}`,
      `Personalización: ${data.get("custom") || "Sin personalización"}`,
      `Fecha: ${data.get("date")}`,
      `Hora: ${data.get("time")}`,
      `Nombre: ${data.get("name")}`,
      `Contacto: ${data.get("phone")}`,
      `Dirección: ${data.get("address")}`,
      `Pago: ${data.get("payment")}`,
      `Detalles: ${data.get("notes") || "Ninguno"}`
    ].join("\n");
    document.querySelector("#form-message").textContent = "Se abrirá WhatsApp con tu pedido listo para revisar y enviar.";
    window.open(`https://wa.me/59164878509?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}
