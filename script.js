// =============================================
// CONFIGURACIÓN DE LA FLORISTERÍA
// =============================================
const CONFIG = {
    whatsappNumber: "9161234567", // <-- CAMBIA ESTO POR TU NÚMERO REAL
    defaultMessage: "¡Hola! Me encantó este arreglo floral y me gustaría hacer un pedido:",
    businessName: "Irmas Flowers",
    currency: "$",
    itemsPerPage: 10 // Cantidad de imágenes que se muestran por carga
};

// =============================================
// DATOS DE LOS ARREGLOS (37 imágenes CON PRECIOS)
// =============================================
const TOTAL_IMAGES = 37;
const arreglos = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
    const num = i + 1;
    // Precios variados entre $25 y $120
    const precios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
    const precio = precios[num % precios.length] + (num % 5 === 0 ? 0 : 5);
    
    return {
        id: num,
        nombre: `Arreglo floral #${num}`,
        descripcion: `Hermoso arreglo floral con flores frescas seleccionadas especialmente para ti. Ideal para cualquier ocasión especial.`,
        precio: precio,
        imagen: `img/${num}irmas.jpeg`
    };
});

// =============================================
// ESTADO DE LA GALERÍA
// =============================================
let currentPage = 1;
const itemsPerPage = CONFIG.itemsPerPage;

const galleryGrid = document.getElementById('galleryGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const showingCount = document.getElementById('showingCount');
const totalCount = document.getElementById('totalCount');
const countBadge = document.getElementById('countBadge');

// =============================================
// RENDERIZAR GALERÍA
// =============================================
function renderGallery() {
    // Limpiar el grid por si acaso
    galleryGrid.innerHTML = '';
    currentPage = 1;
    
    const start = 0;
    const end = Math.min(itemsPerPage, arreglos.length);
    renderItems(start, end);
    updateLoadMoreInfo();
}

function renderItems(start, end) {
    const itemsToShow = arreglos.slice(start, end);
    
    itemsToShow.forEach(arreglo => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.id = arreglo.id;
        div.innerHTML = `
            <img src="${arreglo.imagen}" alt="${arreglo.nombre}" loading="lazy" />
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <h4>${arreglo.nombre}</h4>
                    <span class="gallery-item-price">${CONFIG.currency}${arreglo.precio}</span>
                </div>
                <button class="gallery-item-select">
                    <i class="fas fa-eye"></i> Ver detalles
                </button>
            </div>
            <div class="gallery-item-number">#${arreglo.id}</div>
        `;
        
        // Evento para abrir el modal
        div.addEventListener('click', (e) => {
            // Evitar que el botón interno dispare dos veces
            if (e.target.closest('.gallery-item-select')) return;
            openModal(arreglo);
        });
        
        // Evento específico para el botón "Ver detalles"
        const selectBtn = div.querySelector('.gallery-item-select');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(arreglo);
        });
        
        galleryGrid.appendChild(div);
    });
}

function loadMore() {
    const start = currentPage * itemsPerPage;
    const end = Math.min(start + itemsPerPage, arreglos.length);
    
    // Verificar si ya no hay más imágenes
    if (start >= arreglos.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Todos los arreglos cargados';
        countBadge.style.display = 'none';
        return;
    }
    
    // Renderizar las siguientes imágenes
    renderItems(start, end);
    currentPage++;
    updateLoadMoreInfo();
    
    // Scroll suave a los nuevos elementos
    setTimeout(() => {
        const lastItem = galleryGrid.lastElementChild;
        if (lastItem) {
            lastItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
}

function updateLoadMoreInfo() {
    const showing = galleryGrid.children.length;
    const total = arreglos.length;
    showingCount.textContent = showing;
    totalCount.textContent = total;
    
    const remaining = total - showing;
    countBadge.textContent = remaining;
    
    if (showing >= total) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Todos los arreglos cargados';
        countBadge.style.display = 'none';
    } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Ver más arreglos <span class="count-badge">${remaining}</span>`;
        countBadge.style.display = 'inline-block';
    }
}

// =============================================
// MODAL SIMPLE (SOLO LA FOTO SELECCIONADA)
// =============================================
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const orderBtn = document.getElementById('orderBtn');
const payBtn = document.getElementById('payBtn');

let currentArreglo = null;

function openModal(arreglo) {
    if (!arreglo) return;
    currentArreglo = arreglo;
    
    // Actualizar contenido del modal
    modalImage.src = arreglo.imagen;
    modalImage.alt = arreglo.nombre;
    modalTitle.textContent = arreglo.nombre;
    modalDescription.textContent = arreglo.descripcion;
    modalPrice.textContent = `${CONFIG.currency}${arreglo.precio}`;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Configurar botón de WhatsApp
    const mensaje = encodeURIComponent(
        `${CONFIG.defaultMessage}\n\n🌸 *${arreglo.nombre}*\n💰 Precio: ${CONFIG.currency}${arreglo.precio}\n📍 ${CONFIG.businessName}\n\n¿Podrías darme más información sobre este arreglo?`
    );
    orderBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// =============================================
// BOTÓN DE PAGO
// =============================================
payBtn.addEventListener('click', () => {
    if (!currentArreglo) return;
    alert(`🛒 Procesando pago para: ${currentArreglo.nombre}\n💰 Total: ${CONFIG.currency}${currentArreglo.precio}\n\nPor ahora, por favor contacta por WhatsApp para completar tu pedido.\n\n💡 Próximamente tendremos pagos integrados.`);
});

// =============================================
// EVENTOS
// =============================================
// Asegurar que el botón "Ver más" funcione correctamente
loadMoreBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loadMore();
});

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

console.log(`🌸 ${CONFIG.businessName} - Web cargada correctamente`);
console.log(`📸 ${arreglos.length} arreglos florales disponibles`);
console.log(`📋 Mostrando ${itemsPerPage} arreglos por carga`);
console.log('✅ Botón "Ver más" funcionando correctamente');
