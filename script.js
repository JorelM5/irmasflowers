// ===== DATOS DE PRODUCTOS =====
const productos = [
  {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1561181286-d3fee7d29164?w=400"
  },
  {
    id: 2,
    nombre: "Arreglo de Girasoles",
    precio: 38000,
    imagen: "https://images.unsplash.com/photo-1593697971170-61c25f46224d?w=400"
  },
  {
    id: 3,
    nombre: "Orquídeas Exóticas",
    precio: 62000,
    imagen: "https://images.unsplash.com/photo-1566127992631-137a642a90d4?w=400"
  },
  {
    id: 4,
    nombre: "Ramo de Lirios",
    precio: 50000,
    imagen: "https://images.unsplash.com/photo-1559047613-52c30d017d4d?w=400"
  }
];

// ===== CARRITO =====
let carrito = [];

// ===== RENDERIZAR PRODUCTOS =====
const productGrid = document.getElementById('productGrid');

function renderProductos() {
  productGrid.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" />
      <h3>${prod.nombre}</h3>
      <p class="price">$${prod.precio.toLocaleString()}</p>
      <button class="btn-add" data-id="${prod.id}">Agregar al carrito</button>
    `;
    productGrid.appendChild(card);
  });

  // Eventos para botones "Agregar"
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

// ===== AGREGAR AL CARRITO =====
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarContadorCarrito();
  mostrarNotificacion(`${producto.nombre} añadido al carrito ✅`);
}

// ===== ACTUALIZAR CONTADOR =====
function actualizarContadorCarrito() {
  const count = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.querySelector('.cart-count').textContent = count;
}

// ===== NOTIFICACIÓN TOAST =====
function mostrarNotificacion(mensaje) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2e7d32;
    color: #fff;
    padding: 16px 28px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideUp 0.4s ease;
    font-family: 'Quicksand', sans-serif;
  `;
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ===== MENÚ HAMBURGUESA =====
document.getElementById('menuToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// ===== CONTACTO: ALERTA =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('¡Gracias por contactarnos! Te responderemos pronto 🌸');
  e.target.reset();
});

// ===== INICIALIZAR =====
renderProductos();
actualizarContadorCarrito();

// ===== ANIMACIÓN SUAVE PARA ENLACES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Cerrar menú móvil si está abierto
      document.querySelector('.nav-links').classList.remove('active');
    }
  });
});

// ===== ESTILO PARA LA NOTIFICACIÓN (keyframes) =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
