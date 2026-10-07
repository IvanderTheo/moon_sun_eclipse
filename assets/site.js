const pages = [
  { id: "solar-system", label: "Tata Surya", href: "solar-system.html" },
  { id: "solar-eclipse", label: "Gerhana Matahari", href: "solar-eclipse.html" },
  { id: "lunar-eclipse", label: "Gerhana Bulan", href: "lunar-eclipse.html" },
  { id: "quiz", label: "Kuis", href: "quiz.html" }
];

const inPagesFolder = window.location.pathname.split("/").includes("pages");
const prefix = inPagesFolder ? "" : "pages/";
const activePage = document.body.dataset.page;
const navHost = document.querySelector("[data-site-nav]");

if (navHost) {
  const header = document.createElement("header");
  header.className = "site-header";

  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = inPagesFolder ? "../index.html" : "./index.html";
  brand.innerHTML = '<span class="brand-mark" aria-hidden="true">☼</span><span>Jelajah Antariksa</span>';

  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Navigasi utama");

  pages.forEach((page) => {
    const link = document.createElement("a");
    link.href = `${prefix}${page.href}`;
    link.textContent = page.label;
    if (page.id === activePage) link.setAttribute("aria-current", "page");
    nav.append(link);
  });

  header.append(brand, nav);
  navHost.replaceWith(header);
}
