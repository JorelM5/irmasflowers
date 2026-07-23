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
let currentPage = 0;
const itemsPerPage = CONFIG.itemsPerPage;
let selectedId = null;

const galleryGrid = document.getElementById('galleryGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const showingCount = document.getElementById('showingCount');
const totalCount = document.getElementById('totalCount');
const countBadge = document.getElementById('countBadge');

// =============================================
// RENDERIZAR GALERÍA
// =============================================
function renderGallery() {
    const start = 0;
    const end = Math.min(itemsPerPage, arreglos.length);
    currentPage = 1;
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
        div.addEventListener('click', () => {
            openModal(arreglo);
        });
        
        galleryGrid.appendChild(div);
    });
}

function loadMore() {
    const start = currentPage * itemsPerPage;
    const end = Math.min(start + itemsPerPage, arreglos.length);
    
    if (start >= arreglos.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> Todos los arreglos cargados';
        return;
    }
    
    renderItems(start, end);
    currentPage++;
    updateLoadMoreInfo();
    
    // Scroll suave a los nuevos elementos
    const lastItem = galleryGrid.lastElementChild;
    if (lastItem) {
        lastItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateLoadMoreInfo() {
    const showing = galleryGrid.children.length;
    const total = arreglos.length;
    showingCount.textContent = showing;
    totalCount.textContent = total;
    countBadge.textContent = total - showing;
    
    if (showing >= total) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Todos los arreglos cargados';
        countBadge.style.display = 'none';
    } else {
        loadMoreBtn.disabled = false;
        countBadge.style.display = 'inline-block';
    }
}

// =============================================
// MODAL EN CUADRÍCULA
// =============================================
const modal = document.getElementById('modal');
const modalGrid = document.getElementById('modalGrid');
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
    selectedId = arreglo.id;
    
    // Actualizar contenido del modal
    modalTitle.textContent = arreglo.nombre;
    modalDescription.textContent = arreglo.descripcion;
    modalPrice.textContent = `${CONFIG.currency}${arreglo.precio}`;
    
    // Generar grid de imágenes (foto principal + 4 relacionadas)
    const imagenesRelacionadas = getRelatedImages(arreglo.id);
    modalGrid.innerHTML = `
        <div class="modal-grid-item modal-main">
            <img src="${arreglo.imagen}" alt="${arreglo.nombre}" />
        </div>
        ${imagenesRelacionadas.map(img => `
            <div class="modal-grid-item modal-thumb">
                <img src="${img.imagen}" alt="${img.nombre}" data-id="${img.id}" />
                <div class="modal-thumb-price">${CONFIG.currency}${img.precio}</div>
            </div>
        `).join('')}
    `;

    // Evento para abrir el detalle de la miniatura seleccionada
    modalGrid.querySelectorAll('.modal-thumb img').forEach(img => {
        img.addEventListener('click', () => {
            const id = parseInt(img.dataset.id);
            const arregloEncontrado = arreglos.find(a => a.id === id);
            if (arregloEncontrado) {
                closeModal();
                // Esperar a que se cierre el modal y abrir el seleccionado
                setTimeout(() => {
                    // Buscar el elemento en la galería y hacer scroll
                    const items = galleryGrid.querySelectorAll('.gallery-item');
                    let found = false;
                    items.forEach(item => {
                        if (parseInt(item.dataset.id) === id) {
                            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Simular clic para abrir modal
                            setTimeout(() => openModal(arregloEncontrado), 400);
                            found = true;
                        }
                    });
                    // Si no está cargado, cargar más hasta encontrarlo
                    if (!found) {
                        // Cargar todas las imágenes restantes
                        const remaining = arreglos.length - galleryGrid.children.length;
                        if (remaining > 0) {
                            loadAllRemaining();
                            setTimeout(() => {
                                const items = galleryGrid.querySelectorAll('.gallery-item');
                                items.forEach(item => {
                                    if (parseInt(item.dataset.id) === id) {
                                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        setTimeout(() => openModal(arregloEncontrado), 400);
                                    }
                                });
                            }, 500);
                        }
                    }
                }, 300);
            }
        });
    });

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Configurar botón de WhatsApp
    const mensaje = encodeURIComponent(
        `${CONFIG.defaultMessage}\n\n🌸 *${arreglo.nombre}*\n💰 Precio: ${CONFIG.currency}${arreglo.precio}\n📍 ${CONFIG.businessName}\n\n¿Podrías darme más información sobre este arreglo?`
    );
    orderBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;
}

function loadAllRemaining() {
    const start = galleryGrid.children.length;
    const end = arreglos.length;
    renderItems(start, end);
    currentPage = Math.ceil(arreglos.length / itemsPerPage);
    updateLoadMoreInfo();
}

function getRelatedImages(id) {
    const index = arreglos.findIndex(a => a.id === id);
    const related = [];
    const offsets = [-2, -1, 1, 2];
    offsets.forEach(offset => {
        const newIndex = index + offset;
        if (newIndex >= 0 && newIndex < arreglos.length) {
            related.push(arreglos[newIndex]);
        }
    });
    // Si no hay suficientes, rellenar con las primeras
    while (related.length < 4) {
        const randomIndex = Math.floor(Math.random() * arreglos.length);
        if (!related.includes(arreglos[randomIndex]) && arreglos[randomIndex].id !== id) {
            related.push(arreglos[randomIndex]);
        }
    }
    return related.slice(0, 4);
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
loadMoreBtn.addEventListener('click', loadMore);

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

console.log(`🌸 ${CONFIG.businessName} - Web cargada correctamente`);
console.log(`📸 ${arreglos.length} arreglos florales disponibles`);
console.log(`📋 Mostrando ${itemsPerPage} arreglos por carga`);
