// =============================================
// CONFIGURACIÓN DE LA FLORISTERÍA
// =============================================
const CONFIG = {
    // Número de WhatsApp con código de país (sin +)
    whatsappNumber: "9161234567", // <-- CAMBIA ESTO POR TU NÚMERO REAL
    // Mensaje predefinido para pedidos
    defaultMessage: "¡Hola! Me encantó este arreglo floral y me gustaría hacer un pedido:",
    // Nombre del negocio
    businessName: "Irmas Flowers"
};

// =============================================
// DATOS DE LOS ARREGLOS (32 imágenes)
// =============================================
const arreglos = [
    // Generamos del 1 al 37
    ...Array.from({ length: 37 }, (_, i) => {
        const num = i + 1;
        return {
            id: num,
            nombre: `Arreglo floral #${num}`,
            descripcion: `Hermoso arreglo floral con flores frescas seleccionadas especialmente para ti. Ideal para cualquier ocasión especial.`,
            imagen: `img/${num}irma.jpeg`
        };
    })
];

// =============================================
// RENDERIZAR GALERÍA
// =============================================
const galleryGrid = document.getElementById('galleryGrid');

function renderGallery() {
    galleryGrid.innerHTML = arreglos.map(arreglo => `
        <div class="gallery-item" data-id="${arreglo.id}">
            <img src="${arreglo.imagen}" alt="${arreglo.nombre}" loading="lazy" />
            <div class="item-number">${arreglo.id}</div>
            <div class="item-overlay">
                <span>${arreglo.nombre}</span>
            </div>
        </div>
    `).join('');

    // Evento de clic en cada imagen
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const arreglo = arreglos.find(a => a.id === id);
            if (arreglo) openModal(arreglo);
        });
    });
}

// =============================================
// MODAL
// =============================================
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.getElementById('modalClose');
const orderBtn = document.getElementById('orderBtn');
const payBtn = document.getElementById('payBtn');

let currentArreglo = null;

function openModal(arreglo) {
    currentArreglo = arreglo;
    modalImage.src = arreglo.imagen;
    modalImage.alt = arreglo.nombre;
    modalTitle.textContent = arreglo.nombre;
    modalDescription.textContent = arreglo.descripcion;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Configurar botón de WhatsApp
    const mensaje = encodeURIComponent(
        `${CONFIG.defaultMessage}\n\n🌸 *${arreglo.nombre}*\n📍 ${CONFIG.businessName}\n\n¿Podrías darme más información sobre este arreglo?`
    );
    orderBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Eventos del modal
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// =============================================
// BOTÓN DE PAGO (Stripe / PayPal / MercadoPago)
// =============================================
payBtn.addEventListener('click', () => {
    if (!currentArreglo) return;
    
    // Opción 1: Redirigir a un enlace de pago (ej. MercadoPago, PayPal)
    // Puedes cambiar esta URL por tu propio enlace de pago
    const paymentUrl = `https://www.paypal.com/paypalme/tu_usuario/${currentArreglo.id}`;
    
    // Opción 2: Mostrar un mensaje (si no tienes sistema de pagos aún)
    alert(`🛒 Procesando pago para: ${currentArreglo.nombre}\n\nPor ahora, por favor contacta por WhatsApp para completar tu pedido.\n\n💡 Próximamente tendremos pagos integrados.`);
    
    // Descomenta la línea de abajo si tienes un enlace de pago real
    // window.open(paymentUrl, '_blank');
});

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener('DOMContentLoaded', renderGallery);

console.log(`🌸 ${CONFIG.businessName} - Web cargada correctamente`);
console.log(`📸 ${arreglos.length} arreglos florales disponibles`);
