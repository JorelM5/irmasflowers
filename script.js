// =============================================
// CONFIGURACIÓN DE LA FLORISTERÍA
// =============================================
const CONFIG = {
    whatsappNumber: "9161234567", // <-- CAMBIA ESTO POR TU NÚMERO REAL
    defaultMessage: "¡Hola! Me encantó este arreglo floral y me gustaría hacer un pedido:",
    businessName: "Irmas Flowers"
};

// =============================================
// DATOS DE LOS ARREGLOS (37 imágenes)
// =============================================
const TOTAL_IMAGES = 37;
const arreglos = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
    const num = i + 1;
    return {
        id: num,
        nombre: `Arreglo floral #${num}`,
        descripcion: `Hermoso arreglo floral con flores frescas seleccionadas especialmente para ti. Ideal para cualquier ocasión especial.`,
        imagen: `img/${num}irmas.jpeg`
    };
});

// =============================================
// ESTADO DEL LIGHTBOX
// =============================================
let currentIndex = 0;
let selectedIndex = null;
let startX = 0;
let currentX = 0;
let isDragging = false;
let isSwiping = false;

const track = document.getElementById('lightboxTrack');
const indicators = document.getElementById('lightboxIndicators');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const selectBtn = document.getElementById('selectBtn');
const selectionHint = document.getElementById('selectionHint');

// =============================================
// RENDERIZAR LIGHTBOX
// =============================================
function renderLightbox() {
    // Renderizar slides
    track.innerHTML = arreglos.map((arreglo, index) => `
        <div class="lightbox-slide" data-index="${index}" data-id="${arreglo.id}">
            <img src="${arreglo.imagen}" alt="${arreglo.nombre}" loading="${index < 5 ? 'eager' : 'lazy'}" />
            <div class="slide-number">${arreglo.id} / ${TOTAL_IMAGES}</div>
            <div class="slide-select-indicator">
                <i class="fas fa-check-circle"></i> Seleccionado
            </div>
        </div>
    `).join('');

    // Renderizar indicadores (puntos)
    indicators.innerHTML = arreglos.map((_, index) => `
        <button class="dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Ir a imagen ${index + 1}"></button>
    `).join('');

    // Evento de clic en indicadores
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
        });
    });

    // Actualizar posición inicial
    updateLightbox();
    updateSelection();
}

// =============================================
// NAVEGACIÓN DEL LIGHTBOX
// =============================================
function goTo(index) {
    if (index < 0) index = 0;
    if (index >= arreglos.length) index = arreglos.length - 1;
    currentIndex = index;
    updateLightbox();
}

function next() {
    if (currentIndex < arreglos.length - 1) {
        goTo(currentIndex + 1);
    }
}

function prev() {
    if (currentIndex > 0) {
        goTo(currentIndex - 1);
    }
}

function updateLightbox() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Actualizar indicadores
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    // Actualizar slide activo (para el indicador de selección)
    document.querySelectorAll('.lightbox-slide').forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });

    // Actualizar hint
    updateSelection();
}

// =============================================
// SELECCIÓN DE IMAGEN
// =============================================
function selectCurrent() {
    selectedIndex = currentIndex;
    updateSelection();
    
    // Efecto visual de selección
    const slides = document.querySelectorAll('.lightbox-slide');
    slides.forEach((slide, index) => {
        slide.style.border = index === selectedIndex ? '4px solid var(--primary)' : 'none';
        slide.style.borderRadius = index === selectedIndex ? '8px' : '0';
    });

    selectionHint.innerHTML = `✅ Has seleccionado: <strong>${arreglos[selectedIndex].nombre}</strong>`;
    selectionHint.style.color = 'var(--primary)';
    
    // Scroll al área de selección
    document.querySelector('.selection-area').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateSelection() {
    const hasSelection = selectedIndex !== null;
    const slide = document.querySelector('.lightbox-slide.active');
    if (slide) {
        const indicator = slide.querySelector('.slide-select-indicator');
        if (indicator) {
            indicator.style.opacity = hasSelection && selectedIndex === currentIndex ? '1' : '0';
        }
    }
}

// =============================================
// EVENTOS TÁCTILES Y DE RATÓN
// =============================================
// Touch events
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    isSwiping = false;
    track.style.transition = 'none';
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 10) {
        isSwiping = true;
    }
    const offset = -currentIndex * 100 + (diff / track.parentElement.offsetWidth * 100);
    track.style.transform = `translateX(${offset}%)`;
}, { passive: true });

track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    if (isSwiping) {
        const diff = currentX - startX;
        const threshold = 50;
        if (diff < -threshold && currentIndex < arreglos.length - 1) {
            next();
        } else if (diff > threshold && currentIndex > 0) {
            prev();
        } else {
            updateLightbox();
        }
    }
    isSwiping = false;
}, { passive: true });

// Mouse events (para arrastrar en escritorio)
let mouseStartX = 0;
let mouseCurrentX = 0;
let isMouseDragging = false;

track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isMouseDragging = true;
    isSwiping = false;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;
    mouseCurrentX = e.clientX;
    const diff = mouseCurrentX - mouseStartX;
    if (Math.abs(diff) > 10) {
        isSwiping = true;
    }
    const offset = -currentIndex * 100 + (diff / track.parentElement.offsetWidth * 100);
    track.style.transform = `translateX(${offset}%)`;
});

document.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    track.style.cursor = 'grab';
    
    if (isSwiping) {
        const diff = mouseCurrentX - mouseStartX;
        const threshold = 50;
        if (diff < -threshold && currentIndex < arreglos.length - 1) {
            next();
        } else if (diff > threshold && currentIndex > 0) {
            prev();
        } else {
            updateLightbox();
        }
    }
    isSwiping = false;
});

// =============================================
// EVENTOS DE BOTONES
// =============================================
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

// Teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCurrent();
    }
});

// Botón de selección
selectBtn.addEventListener('click', () => {
    if (selectedIndex === currentIndex) {
        // Si ya está seleccionado, abrir modal directamente
        openModal(arreglos[selectedIndex]);
    } else {
        selectCurrent();
        // Después de seleccionar, mostrar mensaje para continuar
        selectBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Hacer pedido';
        selectBtn.style.background = '#25D366';
        setTimeout(() => {
            selectBtn.innerHTML = '<i class="fas fa-check-circle"></i> Seleccionar este arreglo';
            selectBtn.style.background = '';
        }, 3000);
    }
});

// Doble clic en imagen para seleccionar
track.addEventListener('dblclick', (e) => {
    const slide = e.target.closest('.lightbox-slide');
    if (slide) {
        selectCurrent();
    }
});

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
    if (!arreglo) return;
    currentArreglo = arreglo;
    modalImage.src = arreglo.imagen;
    modalImage.alt = arreglo.nombre;
    modalTitle.textContent = arreglo.nombre;
    modalDescription.textContent = arreglo.descripcion;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    const mensaje = encodeURIComponent(
        `${CONFIG.defaultMessage}\n\n🌸 *${arreglo.nombre}*\n📍 ${CONFIG.businessName}\n\n¿Podrías darme más información sobre este arreglo?`
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
    alert(`🛒 Procesando pago para: ${currentArreglo.nombre}\n\nPor ahora, por favor contacta por WhatsApp para completar tu pedido.\n\n💡 Próximamente tendremos pagos integrados.`);
});

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderLightbox();
    // Seleccionar automáticamente la primera imagen al cargar
    setTimeout(() => {
        selectCurrent();
    }, 500);
});

console.log(`🌸 ${CONFIG.businessName} - Web cargada correctamente`);
console.log(`📸 ${arreglos.length} arreglos florales disponibles`);
console.log('💡 Desliza para ver los arreglos, toca "Seleccionar" para elegir uno');
