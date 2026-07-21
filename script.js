// ============================================
// ===== DATOS DE PRODUCTOS (37 IMÁGENES) =====
// ============================================

// Generamos automáticamente los 37 productos
const productos = [];

// Lista de nombres de flores para variar
const nombres = [
  "Ramo de Rosas Rojas",
  "Arreglo de Girasoles",
  "Orquídeas Exóticas",
  "Ramo de Lirios",
  "Tulipanes Coloridos",
  "Arreglo de Rosas y Claveles",
  "Ramo de Flores Mixtas",
  "Centro de Mesa Elegante",
  "Ramo de Girasoles y Rosas",
  "Arreglo de Primavera",
  "Ramo de Claveles",
  "Arreglo de Orquídeas",
  "Ramo de Rosas Blancas",
  "Arreglo de Flores Silvestres",
  "Ramo de Gerberas",
  "Centro de Mesa Romántico",
  "Ramo de Flores Tropicales",
  "Arreglo de Lirios y Rosas",
  "Ramo de Girasoles Gigantes",
  "Arreglo de Flores de Campo",
  "Ramo de Rosas y Lirios",
  "Arreglo de Flores Exóticas",
  "Ramo de Claveles y Rosas",
  "Centro de Mesa Clásico",
  "Ramo de Flores de Temporada",
  "Arreglo de Girasoles y Claveles",
  "Ramo de Rosas y Tulipanes",
  "Arreglo de Flores Naturales",
  "Ramo de Gerberas y Rosas",
  "Centro de Mesa Moderno",
  "Ramo de Flores Premium",
  "Arreglo de Rosas Rojas y Blancas",
  "Ramo de Flores para Bodas",
  "Arreglo de Flores para Aniversario",
  "Ramo de Rosas y Orquídeas",
  "Arreglo de Flores Especial",
  "Ramo de Flores Deluxe"
];

// Precios variados entre $35 y $95
const precios = [
  45, 38, 62, 50, 55, 68, 72, 85, 58, 48,
  35, 75, 42, 52, 40, 78, 65, 55, 60, 44,
  48, 70, 38, 80, 46, 50, 52, 42, 46, 82,
  58, 48, 90, 65, 55, 95, 60
];

// Generar los 37 productos
for (let i = 0; i < 37; i++) {
  const num = i + 1;
  productos.push({
    id: num,
    nombre: nombres[i] || `Arreglo Floral #${num}`,
    precio: precios[i] || 45 + Math.floor(Math.random() * 50),
    imagen: `img/${num}irmas.jpeg`
  });
}

// ============================================
// ===== CARRITO =====
// ============================================

let carrito = [];

// ============================================
// ===== ELEMENTOS DOM =====
// ============================================

const galleryGrid = document.getElementById('galleryGrid');
const cartModal = document.getElementById('cartModal');
const orderModal = document.getElementById('orderModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// ===== ESTADO DE LA GALERÍA =====
let imagenesCargadas = 0;
const imagenesPorCarga = 12;
const totalProductos = productos.length;

// Guardar la posición de scroll actual
let scrollPosition = 0;

// ============================================
// ===== RENDERIZAR GALERÍA / TIENDA =====
// ============================================

function renderGaleria(cantidad) {
  const fragment = document.createDocumentFragment();
  const start = imagenesCargadas;
  const end = Math.min(start + cantidad, totalProductos);

  for (let i = start; i < end; i++) {
    const prod = productos[i];
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy" data-id="${prod.id}" />
      <div class="gallery-info">
        <h3>${prod.nombre}</h3>
        <p class="price">$${prod.precio.toFixed(2)}</p>
        <button class="btn-add" data-id="${prod.id}">
          <i class="fas fa-shopping-cart"></i> Agregar al carrito
        </button>
      </div>
    `;
    fragment.appendChild(item);
  }

  galleryGrid.appendChild(fragment);
  imagenesCargadas = end;

  // ===== EVENTO: CLICK EN IMAGEN → SOLO ABRE LIGHTBOX =====
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const src = e.target.src;
      
      // Solo abrir lightbox, NO agregar al carrito
      abrirLightbox(src);
    });
  });

  // ===== EVENTO: BOTÓN AGREGAR AL CARRITO =====
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id || e.target.closest('.btn-add').dataset.id);
      agregarAlCarrito(id);
    });
  });

  // Ocultar botón si ya cargamos todos
  if (imagenesCargadas >= totalProductos) {
    loadMoreBtn.style.display = 'none';
  }
}

// ============================================
// ===== AGREGAR AL CARRITO =====
// ============================================

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

// ============================================
// ===== ELIMINAR DEL CARRITO =====
// ============================================

function eliminarDelCarrito(index) {
  const producto = carrito[index];
  if (!producto) return;
  
  carrito.splice(index, 1);
  actualizarContador();
  mostrarCarrito();
  mostrarNotificacion(`🗑️ ${producto.nombre} eliminado del carrito`);
}

// ============================================
// ===== ACTUALIZAR CONTADOR =====
// ============================================

function actualizarContador() {
  const count = carrito.reduce((total, item) => total + item.cantidad, 0);
  cartCount.textContent = count;
}

// ============================================
// ===== MOSTRAR CARRITO (CON BOTÓN ELIMINAR) =====
// ============================================

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
          <button onclick="cambiarCantidad(${index}, -1)" title="Quitar uno">−</button>
          <span style="font-weight:600; margin:0 8px;">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)" title="Agregar uno">+</button>
          <button onclick="eliminarDelCarrito(${index})" style="background:#c0392b; margin-left:8px;" title="Eliminar producto">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// ============================================
// ===== CAMBIAR CANTIDAD =====
// ============================================

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

// ============================================
// ===== NOTIFICACIÓN =====
// ============================================

function mostrarNotificacion(mensaje) {
  // Eliminar notificaciones anteriores
  const existingToasts = document.querySelectorAll('.custom-toast');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
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
    z-index: 99999;
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

// ============================================
// ===== ABRIR CARRITO =====
// ============================================

document.querySelector('.cart-icon').addEventListener('click', () => {
  mostrarCarrito();
  cartModal.classList.add('active');
});

// ============================================
// ===== CERRAR MODALES =====
// ============================================

document.getElementById('cartClose').addEventListener('click', () => {
  cartModal.classList.remove('active');
});

document.getElementById('orderClose').addEventListener('click', () => {
  orderModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('active');
  if (e.target === orderModal) orderModal.classList.remove('active');
});

// ============================================
// ===== FINALIZAR PEDIDO =====
// ============================================

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (carrito.length === 0) {
    mostrarNotificacion('⚠️ El carrito está vacío');
    return;
  }
  cartModal.classList.remove('active');
  mostrarResumenPedido();
  orderModal.classList.add('active');
});

// ============================================
// ===== MOSTRAR RESUMEN DEL PEDIDO =====
// ============================================

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

// ============================================
// ===== ENVIAR PEDIDO =====
// ============================================

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('orderName').value;
  const telefono = document.getElementById('orderPhone').value;
  const email = document.getElementById('orderEmail').value;
  const direccion = document.getElementById('orderAddress').value;
  const notas = document.getElementById('orderNotes').value;

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

  // ===== ENVIAR POR WHATSAPP =====
  const telefonoWhatsApp = '19165591808';
  const whatsappLink = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  // ===== ENVIAR POR CORREO =====
  const asunto = encodeURIComponent(`Nuevo pedido de ${nombre} - Irma's Flowers`);
  const cuerpo = encodeURIComponent(mensaje);
  const mailtoLink = `mailto:info@irmasflowers.com?subject=${asunto}&body=${cuerpo}`;

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

  carrito = [];
  actualizarContador();
  orderModal.classList.remove('active');

  mostrarNotificacion('🎉 ¡Pedido enviado! Te contactaremos pronto');
  document.getElementById('orderForm').reset();
});

// ============================================
// ===== LIGHTBOX CON BOTÓN AGREGAR AL CARRITO =====
// ============================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentImageIndex = 0;
let galleryImages = [];
let currentProductId = null;

function abrirLightbox(src) {
  // Guardar la posición actual del scroll
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  // Obtener todas las imágenes de la galería
  const items = document.querySelectorAll('.gallery-item img');
  galleryImages = Array.from(items).map(img => img.src);
  
  // Encontrar el índice de la imagen actual
  currentImageIndex = galleryImages.indexOf(src);
  
  // Si no encuentra la imagen, usar la primera
  if (currentImageIndex === -1) {
    currentImageIndex = 0;
  }
  
  // Obtener el ID del producto desde el atributo data-id
  const imgElement = document.querySelector(`img[src="${src}"]`);
  if (imgElement) {
    currentProductId = parseInt(imgElement.dataset.id);
  }
  
  // Mostrar la imagen en el lightbox
  lightboxImg.src = galleryImages[currentImageIndex];
  lightbox.classList.add('active');
  
  // Actualizar el botón del lightbox con el nombre del producto
  actualizarBotonLightbox();
  
  // Bloquear el scroll del body pero mantener la posición
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function actualizarBotonLightbox() {
  const producto = productos.find(p => p.id === currentProductId);
  const btn = document.getElementById('lightboxAddToCart');
  if (producto && btn) {
    btn.innerHTML = `<i class="fas fa-shopping-cart"></i> Agregar ${producto.nombre} - $${producto.precio.toFixed(2)}`;
    btn.style.display = 'block';
    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
  } else if (btn) {
    btn.style.display = 'none';
  }
}

function cerrarLightbox() {
  lightbox.classList.remove('active');
  
  // Restaurar el scroll a la posición guardada
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  
  // Volver a la posición exacta donde estaba
  window.scrollTo(0, scrollPosition);
}

function cambiarImagen(direccion) {
  if (galleryImages.length === 0) return;
  
  // Calcular el nuevo índice
  currentImageIndex = (currentImageIndex + direccion + galleryImages.length) % galleryImages.length;
  
  // Actualizar la imagen mostrada
  lightboxImg.src = galleryImages[currentImageIndex];
  
  // BUSCAR EL ID DEL PRODUCTO CORRECTO PARA LA IMAGEN ACTUAL
  // Usamos el nombre del archivo para encontrar el producto
  const currentSrc = galleryImages[currentImageIndex];
  const imgElement = document.querySelector(`img[src="${currentSrc}"]`);
  
  if (imgElement) {
    currentProductId = parseInt(imgElement.dataset.id);
  } else {
    // Si no encuentra el elemento, buscar por el nombre del archivo
    const fileName = currentSrc.split('/').pop();
    const numero = parseInt(fileName);
    if (!isNaN(numero)) {
      currentProductId = numero;
    }
  }
  
  // Actualizar el botón con el nuevo producto
  actualizarBotonLightbox();
}

// ===== AGREGAR AL CARRITO DESDE LIGHTBOX =====
function agregarDesdeLightbox() {
  if (currentProductId) {
    agregarAlCarrito(currentProductId);
    // Mostrar una notificación adicional
    const producto = productos.find(p => p.id === currentProductId);
    if (producto) {
      mostrarNotificacion(`✅ ${producto.nombre} añadido al carrito`);
    }
  } else {
    mostrarNotificacion('⚠️ No se pudo agregar el producto');
  }
}

// ===== EVENTOS DEL LIGHTBOX =====
document.getElementById('lightboxClose').addEventListener('click', (e) => {
  e.preventDefault();
  cerrarLightbox();
});

document.getElementById('lightboxPrev').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  cambiarImagen(-1);
});

document.getElementById('lightboxNext').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  cambiarImagen(1);
});

// Evento para el botón de agregar desde lightbox
document.getElementById('lightboxAddToCart').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  agregarDesdeLightbox();
});

// ===== TECLAS DEL TECLADO =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightbox.classList.contains('active')) {
      cerrarLightbox();
    }
  }
  if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
    e.preventDefault();
    cambiarImagen(-1);
  }
  if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
    e.preventDefault();
    cambiarImagen(1);
  }
});

// ===== CERRAR AL HACER CLICK FUERA =====
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    cerrarLightbox();
  }
});

// ============================================
// ===== TOUCH PARA MÓVIL (deslizar) =====
// ============================================

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      cambiarImagen(1);
    } else {
      cambiarImagen(-1);
    }
  }
}

// ============================================
// ===== CARGA INICIAL =====
// ============================================

loadMoreBtn.addEventListener('click', () => {
  renderGaleria(imagenesPorCarga);
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

renderGaleria(imagenesPorCarga);
actualizarContador();

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
