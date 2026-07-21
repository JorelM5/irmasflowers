// ===== DATOS DE PRODUCTOS CON TUS IMÁGENES =====
const productos = [
  {
    id: 1,
    nombre: "Ramo de Rosas Rojas",
    precio: 45,
    imagen: "img/1irmas.jpeg"
  },
  {
    id: 2,
    nombre: "Arreglo de Girasoles",
    precio: 38,
    imagen: "img/2irmas.jpeg"
  },
  {
    id: 3,
    nombre: "Orquídeas Exóticas",
    precio: 62,
    imagen: "img/3irmas.jpeg"
  },
  {
    id: 4,
    nombre: "Ramo de Lirios",
    precio: 50,
    imagen: "img/4irmas.jpeg"
  },
  {
    id: 5,
    nombre: "Tulipanes Coloridos",
    precio: 55,
    imagen: "img/5irmas.jpeg"
  },
  {
    id: 6,
    nombre: "Arreglo de Rosas y Claveles",
    precio: 68,
    imagen: "img/6irmas.jpeg"
  }
];

// ===== CARRITO =====
let carrito = [];

// ===== ELEMENTOS DOM =====
const productGrid = document.getElementById('productGrid');
const cartModal = document.getElementById('cartModal');
const orderModal = document.getElementById('orderModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// ===== RENDERIZAR PRODUCTOS =====
function renderProductos() {
  productGrid.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" />
      <h3>${prod.nombre}</h3>
      <p class="price">$${prod.precio.toFixed(2)}</p>
      <button class="btn-add" data-id="${prod.id}">Agregar al carrito</button>
    `;
    productGrid.appendChild(card);
  });

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

  actualizarContador();
  mostrarNotificacion(`✅ ${producto.nombre} añadido al carrito`);
}

// ===== ACTUALIZAR CONTADOR =====
function actualizarContador() {
  const count = carrito.reduce((total, item) => total + item.cantidad, 0);
  cartCount.textContent = count;
}

// ===== MOSTRAR CARRITO =====
function mostrarCarrito() {
  if (carrito.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">🌿 El carrito está vacío</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  let html = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.nombre}</div>
          <div class="cart-item-price">$${item.precio.toFixed(2)} x ${item.cantidad}</div>
        </div>
        <div class="cart-item-actions">
          <button onclick="cambiarCantidad(${index}, -1)">−</button>
          <span style="font-weight:600; margin:0 8px;">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ===== CAMBIAR CANTIDAD =====
function cambiarCantidad(index, cambio) {
  const item = carrito[index];
  if (!item) return;

  item.cantidad += cambio;
  if (item.cantidad <= 0) {
    carrito.splice(index, 1);
  }

  actualizarContador();
  mostrarCarrito();
}

// ===== NOTIFICACIÓN =====
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

// ===== ABRIR CARRITO (click en el ícono) =====
document.querySelector('.cart-icon').addEventListener('click', () => {
  mostrarCarrito();
  cartModal.classList.add('active');
});

// ===== CERRAR MODALES =====
document.getElementById('cartClose').addEventListener('click', () => {
  cartModal.classList.remove('active');
});

document.getElementById('orderClose').addEventListener('click', () => {
  orderModal.classList.remove('active');
});

// Cerrar al hacer clic fuera
window.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('active');
  if (e.target === orderModal) orderModal.classList.remove('active');
});

// ===== FINALIZAR PEDIDO =====
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (carrito.length === 0) {
    mostrarNotificacion('⚠️ El carrito está vacío');
    return;
  }
  cartModal.classList.remove('active');
  mostrarResumenPedido();
  orderModal.classList.add('active');
});

// ===== MOSTRAR RESUMEN DEL PEDIDO =====
function mostrarResumenPedido() {
  const summary = document.getElementById('orderSummary');
  let html = '<strong>📦 Tu pedido:</strong><br><br>';
  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `• ${item.nombre} x ${item.cantidad} = $${subtotal.toFixed(2)}<br>`;
  });
  html += `<br><strong>Total: $${total.toFixed(2)}</strong>`;
  summary.innerHTML = html;
}

// ===== ENVIAR PEDIDO =====
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('orderName').value;
  const telefono = document.getElementById('orderPhone').value;
  const email = document.getElementById('orderEmail').value;
  const direccion = document.getElementById('orderAddress').value;
  const notas = document.getElementById('orderNotes').value;

  // Construir mensaje del pedido
  let mensaje = '🌷 *NUEVO PEDIDO - Irma\'s Flowers* 🌷\n\n';
  mensaje += `👤 *Cliente:* ${nombre}\n`;
  mensaje += `📱 *Teléfono:* ${telefono}\n`;
  mensaje += `📧 *Email:* ${email}\n`;
  mensaje += `📍 *Dirección:* ${direccion}\n\n`;
  mensaje += `📦 *Productos:*\n`;

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• ${item.nombre} x ${item.cantidad} = $${subtotal.toFixed(2)}\n`;
  });

  mensaje += `\n💰 *Total: $${total.toFixed(2)}*\n`;
  if (notas) mensaje += `\n📝 *Notas:* ${notas}`;

  // ========== ENVIAR POR CORREO ==========
  const asunto = encodeURIComponent(`Nuevo pedido de ${nombre} - Irma's Flowers`);
  const cuerpo = encodeURIComponent(mensaje);
  const mailtoLink = `mailto:info@irmasflowers.com?subject=${asunto}&body=${cuerpo}`;

  // ========== ENVIAR POR WHATSAPP ==========
  const telefonoWhatsApp = '19165591808';
  const whatsappLink = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  // Mostrar opciones al usuario
  const opcion = confirm(
    '📩 ¿Cómo quieres enviar tu pedido?\n\n' +
    '✅ Aceptar = Enviar por WhatsApp (RECOMENDADO)\n' +
    '❌ Cancelar = Enviar por correo electrónico'
  );

  if (opcion) {
    window.open(whatsappLink, '_blank');
  } else {
    window.open(mailtoLink, '_blank');
  }

  // Limpiar carrito
  carrito = [];
  actualizarContador();
  orderModal.classList.remove('active');

  mostrarNotificacion('🎉 ¡Pedido enviado! Te contactaremos pronto');
  document.getElementById('orderForm').reset();
});

// ============================================
// ===== GALERÍA DE IMÁGENES =====
// ============================================

// ===== GENERAR GALERÍA =====
const totalImagenes = 37;
const galleryGrid = document.getElementById('galleryGrid');
let imagenesCargadas = 0;
const imagenesPorCarga = 12;

function generarGaleria(cantidad) {
  const fragment = document.createDocumentFragment();
  const start = imagenesCargadas;
  const end = Math.min(start + cantidad, totalImagenes);

  for (let i = start; i < end; i++) {
    const num = i + 1;
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="img/${num}irmas.jpeg" alt="Arreglo floral ${num}" loading="lazy" />
      <div class="gallery-overlay">
        <span>🌸 Arreglo #${num}</span>
      </div>
    `;
    // Click para abrir lightbox
    item.addEventListener('click', () => {
      abrirLightbox(`img/${num}irmas.jpeg`);
    });
    fragment.appendChild(item);
  }

  galleryGrid.appendChild(fragment);
  imagenesCargadas = end;

  // Ocultar botón si ya cargamos todas
  if (imagenesCargadas >= totalImagenes) {
    document.getElementById('loadMoreBtn').style.display = 'none';
  }
}

// ===== CARGAR MÁS IMÁGENES =====
document.getElementById('loadMoreBtn').addEventListener('click', () => {
  generarGaleria(imagenesPorCarga);
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentImageIndex = 0;
let galleryImages = [];

function abrirLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Obtener todas las imágenes de la galería para navegación
  const items = document.querySelectorAll('.gallery-item img');
  galleryImages = Array.from(items).map(img => img.src);
  currentImageIndex = galleryImages.indexOf(src);
}

function cerrarLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function cambiarImagen(direccion) {
  if (galleryImages.length === 0) return;
  currentImageIndex = (currentImageIndex + direccion + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentImageIndex];
}

// ===== EVENTOS LIGHTBOX =====
document.getElementById('lightboxClose').addEventListener('click', cerrarLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => cambiarImagen(-1));
document.getElementById('lightboxNext').addEventListener('click', () => cambiarImagen(1));

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarLightbox();
  if (e.key === 'ArrowLeft') cambiarImagen(-1);
  if (e.key === 'ArrowRight') cambiarImagen(1);
});

// Cerrar al hacer clic fuera de la imagen
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) cerrarLightbox();
});

// ============================================
// ===== MENÚ HAMBURGUESA =====
// ============================================
document.getElementById('menuToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// ============================================
// ===== CONTACTO =====
// ============================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('📨 ¡Gracias por contactarnos! Te responderemos pronto 🌸');
  e.target.reset();
});

// ============================================
// ===== NAVEGACIÓN SUAVE =====
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelector('.nav-links').classList.remove('active');
    }
  });
});

// ============================================
// ===== INICIALIZAR =====
// ============================================
renderProductos();
actualizarContador();
generarGaleria(imagenesPorCarga);

// ============================================
// ===== ESTILOS PARA NOTIFICACIÓN =====
// ============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
