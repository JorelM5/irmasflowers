// =============================================
// CONFIGURACIÓN DE LA FLORISTERÍA
// =============================================
const CONFIG = {
    whatsappNumber: "9165413044", // <-- CAMBIA ESTO POR TU NÚMERO REAL
    businessName: "Irmas Flowers",
    currency: "$",
    itemsPerPage: 10
};

// =============================================
// DATOS DE LOS ARREGLOS (37 imágenes CON PRECIOS)
// =============================================
const TOTAL_IMAGES = 37;
const arreglos = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
    const num = i + 1;
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
        
        div.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item-select')) return;
            openModal(arreglo);
        });
        
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
    
    if (start >= arreglos.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check-circle"></i> Todos los arreglos cargados';
        countBadge.style.display = 'none';
        return;
    }
    
    renderItems(start, end);
    currentPage++;
    updateLoadMoreInfo();
    
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
// MODAL CON FORMULARIO
// =============================================
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const orderBtn = document.getElementById('orderBtn');
const payBtn = document.getElementById('payBtn');
const notaEspecial = document.getElementById('notaEspecial');
const extraCheckboxes = document.querySelectorAll('.extra-checkbox');
const totalPriceSpan = document.getElementById('totalPrice');

let currentArreglo = null;
let basePrice = 0;

// =============================================
// CÁLCULO DEL TOTAL CON EXTRAS
// =============================================
function calculateTotal() {
    let extrasTotal = 0;
    let extrasList = [];
    
    extraCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const price = parseFloat(checkbox.dataset.price);
            const name = checkbox.dataset.extra;
            extrasTotal += price;
            extrasList.push(name);
        }
    });
    
    const total = basePrice + extrasTotal;
    totalPriceSpan.textContent = `${CONFIG.currency}${total.toFixed(2)}`;
    
    return { total, extrasList, extrasTotal };
}

// Evento para recalcular al marcar/desmarcar extras
extraCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});

// Evento para la nota especial (no recalcula, solo se usa en el mensaje)
notaEspecial.addEventListener('input', () => {
    // Solo guardamos el valor para el mensaje
});

// =============================================
// ABRIR MODAL
// =============================================
function openModal(arreglo) {
    if (!arreglo) return;
    currentArreglo = arreglo;
    basePrice = arreglo.precio;
    
    // Resetear formulario
    notaEspecial.value = '';
    extraCheckboxes.forEach(cb => cb.checked = false);
    
    // Actualizar contenido
    modalImage.src = arreglo.imagen;
    modalImage.alt = arreglo.nombre;
    modalTitle.textContent = arreglo.nombre;
    modalDescription.textContent = arreglo.descripcion;
    modalPrice.textContent = `${CONFIG.currency}${arreglo.precio}`;
    
    // Calcular total inicial
    calculateTotal();

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// =============================================
// GENERAR MENSAJE PARA WHATSAPP
// =============================================
function generateWhatsAppMessage() {
    if (!currentArreglo) return '';
    
    const { total, extrasList, extrasTotal } = calculateTotal();
    const nota = notaEspecial.value.trim();
    
    let mensaje = `${CONFIG.defaultMessage}\n\n`;
    mensaje += `🌸 *${currentArreglo.nombre}*\n`;
    mensaje += `💰 Precio base: ${CONFIG.currency}${currentArreglo.precio}\n`;
    
    if (extrasList.length > 0) {
        mensaje += `\n🎁 *Extras seleccionados:*\n`;
        extrasList.forEach(extra => {
            mensaje += `  ✓ ${extra}\n`;
        });
        mensaje += `💰 Extras: ${CONFIG.currency}${extrasTotal.toFixed(2)}\n`;
    }
    
    mensaje += `\n💲 *Total: ${CONFIG.currency}${total.toFixed(2)}*\n`;
    
    if (nota) {
        mensaje += `\n📝 *Nota especial:*\n"${nota}"\n`;
    }
    
    mensaje += `\n📍 ${CONFIG.businessName}\n`;
    mensaje += `\n¿Podrías confirmarme el pedido?`;
    
    return encodeURIComponent(mensaje);
}

// =============================================
// EVENTO DEL BOTÓN WHATSAPP
// =============================================
orderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentArreglo) return;
    
    const mensaje = generateWhatsAppMessage();
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;
    window.open(url, '_blank');
});

// =============================================
// BOTÓN DE PAGO
// =============================================
payBtn.addEventListener('click', () => {
    if (!currentArreglo) return;
    const { total, extrasList } = calculateTotal();
    const nota = notaEspecial.value.trim();
    
    let mensaje = `🛒 Pedido: ${currentArreglo.nombre}\n`;
    mensaje += `💰 Total: ${CONFIG.currency}${total.toFixed(2)}\n`;
    if (extrasList.length > 0) {
        mensaje += `🎁 Extras: ${extrasList.join(', ')}\n`;
    }
    if (nota) {
        mensaje += `📝 Nota: "${nota}"\n`;
    }
    
    alert(`🛒 Procesando pago para:\n\n${mensaje}\n\n💡 Por ahora, contacta por WhatsApp para completar tu pedido.\n\nPróximamente tendremos pagos integrados.`);
});

// =============================================
// CERRAR MODAL
// =============================================
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
// EVENTOS
// =============================================
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
console.log('✅ Formulario de personalización activo');
