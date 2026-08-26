/**
 * ==============================================================================
 * CONTROLADOR PRINCIPAL DEL PORTAL PÚBLICO DE LA BODA (APP.JS) 💍✨
 * Versión 4.0: Carruseles Dinámicos, Múltiples Cuentas y Álbum Imprimible
 * ==============================================================================
 */

let weddingConfig = null;
let countdownInterval = null;

// Controladores de Carruseles
let storyCurrentIndex = 0;
let storyTotalSlides = 0;
let storyAutoTimer = null;

let dedCurrentIndex = 0;
let dedTotalSlides = 0;
let dedAutoTimer = null;

document.addEventListener('DOMContentLoaded', async () => {
    await initPublicApp();
    initRSVPFormEvents();
    initAlbumEvents();
    initOrganizerAuthEvents();
});

async function initPublicApp() {
    weddingConfig = await window.weddingDB.getConfig();
    renderPageContent(weddingConfig);
    startCountdown(weddingConfig.fecha_boda);
    checkAlbumAccessStatus();
    renderStoryCarousel(weddingConfig.galeria_fotos, weddingConfig.image_fit_mode);
    await renderDedicationsCarousel();
    await renderGuestPhotos();
    await renderAlbumChat();
}

function renderPageContent(config) {
    if (!config) return;

    const novia = config.novia_nombre || 'Valentina';
    const novio = config.novio_nombre || 'Sebastián';
    const initialNovia = novia.charAt(0).toUpperCase();
    const initialNovio = novio.charAt(0).toUpperCase();

    // Monograma y Títulos
    document.getElementById('nav-brand-names').innerHTML = `${initialNovia} <span>&</span> ${initialNovio}`;
    document.getElementById('hero-couple-title').innerHTML = `${escapeHtml(novia)} <span class="ampersand">&</span> ${escapeHtml(novio)}`;
    document.getElementById('footer-names').innerHTML = `${escapeHtml(novia)} & ${escapeHtml(novio)}`;

    // Frase de Amor
    if (config.frase_amor) {
        document.getElementById('hero-love-quote').textContent = `"${config.frase_amor}"`;
    }

    // Fecha formateada
    if (config.fecha_boda) {
        const dateObj = new Date(config.fecha_boda);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const dateFormatted = dateObj.toLocaleDateString('es-CO', options);
        document.getElementById('hero-wedding-date').textContent = capitalizeFirstLetter(dateFormatted);
    }

    // Foto de Portada
    if (config.hero_image_url) {
        const heroEl = document.querySelector('.hero-wedding');
        heroEl.style.backgroundImage = `url('${config.hero_image_url}')`;
    }

    // Ceremonia
    document.getElementById('place-ceremonia').textContent = config.lugar_ceremonia || 'Capilla';
    document.getElementById('address-ceremonia').textContent = config.direccion_ceremonia || '';
    if (config.maps_ceremonia_url) {
        document.getElementById('btn-maps-ceremonia').href = config.maps_ceremonia_url;
    }
    if (config.ceremonia_image_url) {
        document.getElementById('card-img-ceremonia').style.backgroundImage = `url('${config.ceremonia_image_url}')`;
    }

    // Recepción
    document.getElementById('place-recepcion').textContent = config.lugar_recepcion || 'Hacienda';
    document.getElementById('address-recepcion').textContent = config.direccion_recepcion || '';
    if (config.maps_recepcion_url) {
        document.getElementById('btn-maps-recepcion').href = config.maps_recepcion_url;
    }
    if (config.recepcion_image_url) {
        document.getElementById('card-img-recepcion').style.backgroundImage = `url('${config.recepcion_image_url}')`;
    }

    // Código de Vestimenta
    document.getElementById('dress-code-description').textContent = config.dress_code || 'Formal';
    renderDressCodeColors(config.dress_code_colors);

    // Múltiples Cuentas Bancarias
    renderMultipleBankAccounts(config);

    // Control de Descarga del Álbum Imprimible
    const btnPublicDownload = document.getElementById('btn-public-download-album');
    if (btnPublicDownload) {
        if (config.descarga_publica_habilitada) {
            btnPublicDownload.style.display = 'inline-flex';
            btnPublicDownload.onclick = () => window.weddingDB.generatePrintableAlbumWindow();
        } else {
            btnPublicDownload.style.display = 'none';
        }
    }
}

// =============================================================================
// MÚLTIPLES CUENTAS BANCARIAS & COPIADO GRANULAR
// =============================================================================

function renderMultipleBankAccounts(config) {
    const container = document.getElementById('bank-accounts-grid');
    if (!container) return;

    if (config.frase_regalos) {
        document.getElementById('phrase-gifts').textContent = config.frase_regalos;
    }

    let cuentas = config.cuentas_bancarias;
    if (!cuentas || !Array.isArray(cuentas) || cuentas.length === 0) {
        // Fallback a cuenta simple si existía
        if (config.banco_nombre && config.banco_numero_cuenta) {
            cuentas = [{
                id: 'cta-legacy',
                banco_nombre: config.banco_nombre,
                banco_tipo_cuenta: config.banco_tipo_cuenta || 'Cuenta de Ahorros',
                banco_numero_cuenta: config.banco_numero_cuenta,
                banco_titular: config.banco_titular || `${config.novia_nombre} & ${config.novio_nombre}`,
                banco_documento: config.banco_documento || '',
                banco_llave_breb: config.banco_llave_breb || '',
                qr_banco_url: config.qr_banco_url || ''
            }];
        } else {
            container.innerHTML = `<div style="color: var(--text-muted); grid-column: 1 / -1;">Información de cuentas bancarias en preparación.</div>`;
            return;
        }
    }

    container.innerHTML = cuentas.map((cta, idx) => `
        <div class="bank-account-card">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1.5px solid var(--gold-400); padding-bottom: 0.5rem;">
                    <strong style="font-size: 1.15rem; color: var(--emerald-900);">🏦 ${escapeHtml(cta.banco_nombre)}</strong>
                    <span class="badge badge-gold">${escapeHtml(cta.banco_tipo_cuenta || 'Ahorros')}</span>
                </div>

                <div class="bank-row">
                    <span class="bank-label">Número de Cuenta:</span>
                    <span class="bank-value">${escapeHtml(cta.banco_numero_cuenta)}</span>
                </div>

                <div class="bank-row">
                    <span class="bank-label">Titular:</span>
                    <span class="bank-value" style="font-size: 0.88rem;">${escapeHtml(cta.banco_titular)}</span>
                </div>

                ${cta.banco_documento ? `
                    <div class="bank-row">
                        <span class="bank-label">Cédula / NIT:</span>
                        <span class="bank-value">${escapeHtml(cta.banco_documento)}</span>
                    </div>
                ` : ''}

                ${cta.banco_llave_breb ? `
                    <div class="bank-breb-highlight">
                        <div>
                            <span style="font-weight: 700; color: var(--gold-800); font-size: 0.78rem; display: block;">⚡ Llave Bre-B (Celular / ID):</span>
                            <strong style="color: var(--emerald-900); font-size: 1rem;">${escapeHtml(cta.banco_llave_breb)}</strong>
                        </div>
                        <span class="badge badge-gold" style="font-size: 0.65rem;">Bre-B</span>
                    </div>
                ` : ''}

                ${cta.qr_banco_url ? `
                    <div style="margin: 0.75rem auto 0; text-align: center;">
                        <img src="${escapeHtml(cta.qr_banco_url)}" style="width: 110px; height: 110px; border-radius: 8px; border: 1.5px solid var(--gold-400); margin: 0 auto;" alt="QR Banco">
                    </div>
                ` : ''}
            </div>

            <div class="bank-actions-row">
                <button type="button" class="btn btn-outline btn-sm" onclick="copyOnlyAccountNumber('${escapeHtml(cta.banco_nombre)}', '${escapeHtml(cta.banco_tipo_cuenta || '')}', '${escapeHtml(cta.banco_numero_cuenta)}', '${escapeHtml(cta.banco_titular)}')">
                    📋 Copiar Cuenta
                </button>
                ${cta.banco_llave_breb ? `
                    <button type="button" class="btn btn-gold btn-sm" onclick="copyOnlyBreBKey('${escapeHtml(cta.banco_llave_breb)}', '${escapeHtml(cta.banco_nombre)}')">
                        ⚡ Copiar Bre-B
                    </button>
                ` : `
                    <button type="button" class="btn btn-gold btn-sm" onclick="copyFullAccountData(${idx})">
                        📋 Copiar Todo
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

function copyOnlyAccountNumber(banco, tipo, numero, titular) {
    const text = `DATOS DE CUENTA 💍\nBanco: ${banco}\nTipo: ${tipo}\nNúmero: ${numero}\nTitular: ${titular}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast(`¡Número de cuenta ${banco} copiado al portapapeles! 📋`, 'success');
    }).catch(() => {
        showToast('No se pudo copiar automáticamente.', 'error');
    });
}

function copyOnlyBreBKey(key, banco) {
    navigator.clipboard.writeText(key).then(() => {
        showToast(`¡Llave Bre-B (${key}) copiada al portapapeles! ⚡`, 'success');
    }).catch(() => {
        showToast('No se pudo copiar automáticamente.', 'error');
    });
}

function copyFullAccountData(accountIndex) {
    if (!weddingConfig || !weddingConfig.cuentas_bancarias || !weddingConfig.cuentas_bancarias[accountIndex]) return;
    const cta = weddingConfig.cuentas_bancarias[accountIndex];

    let text = `DATOS BANCARIOS 💍\n• Banco: ${cta.banco_nombre}\n• Tipo: ${cta.banco_tipo_cuenta || 'Ahorros'}\n• Número: ${cta.banco_numero_cuenta}\n• Titular: ${cta.banco_titular}`;
    if (cta.banco_documento) text += `\n• Cédula/NIT: ${cta.banco_documento}`;
    if (cta.banco_llave_breb) text += `\n• Llave Bre-B: ${cta.banco_llave_breb}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast(`¡Datos completos de ${cta.banco_nombre} copiados! 📋`, 'success');
    }).catch(() => {
        showToast('No se pudo copiar automáticamente.', 'error');
    });
}

function renderDressCodeColors(colors) {
    const container = document.getElementById('dress-code-colors-list');
    if (!container) return;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
        container.innerHTML = `
            <div class="color-dot-wrap"><div class="color-dot" style="background-color: #0F4C3A;"></div><span class="color-dot-label">Esmeralda</span></div>
            <div class="color-dot-wrap"><div class="color-dot" style="background-color: #D4AF37;"></div><span class="color-dot-label">Dorado</span></div>
            <div class="color-dot-wrap"><div class="color-dot" style="background-color: #FFFFFF;"></div><span class="color-dot-label">Blanco</span></div>
        `;
        return;
    }

    container.innerHTML = colors.map(c => `
        <div class="color-dot-wrap">
            <div class="color-dot" style="background-color: ${escapeHtml(c.hex)};"></div>
            <span class="color-dot-label">${escapeHtml(c.name)}</span>
        </div>
    `).join('');
}

// =============================================================================
// CARRUSEL INTERACTIVO: NUESTRA HISTORIA
// =============================================================================

function renderStoryCarousel(photos, fitMode = 'cover') {
    const track = document.getElementById('story-carousel-track');
    const dotsContainer = document.getElementById('story-carousel-dots');
    if (!track) return;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
        track.innerHTML = `<div style="padding: 3rem; text-align: center; width: 100%; color: var(--text-muted);">Pronto compartiremos fotos de nuestra historia. ✨</div>`;
        if (dotsContainer) dotsContainer.innerHTML = '';
        return;
    }

    const objectFitStyle = fitMode === 'contain' ? 'object-fit: contain; background: #000;' : 'object-fit: cover;';
    storyTotalSlides = photos.length;
    storyCurrentIndex = 0;

    track.innerHTML = photos.map(p => `
        <div class="carousel-slide">
            <div class="carousel-img-wrap">
                <img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.titulo || 'Momento')}" class="carousel-img" style="${objectFitStyle}" loading="lazy">
            </div>
            ${p.titulo || p.descripcion ? `
                <div class="carousel-caption">
                    ${p.titulo ? `<h4>${escapeHtml(p.titulo)}</h4>` : ''}
                    ${p.descripcion ? `<p>${escapeHtml(p.descripcion)}</p>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');

    // Generar Puntos de Navegación
    if (dotsContainer) {
        dotsContainer.innerHTML = photos.map((_, idx) => `
            <button class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToStorySlide(${idx})" aria-label="Ir a foto ${idx + 1}"></button>
        `).join('');
    }

    // Botones Flecha
    const prevBtn = document.getElementById('story-carousel-prev');
    const nextBtn = document.getElementById('story-carousel-next');

    if (prevBtn) prevBtn.onclick = () => prevStorySlide();
    if (nextBtn) nextBtn.onclick = () => nextStorySlide();

    // Auto-desplazamiento cada 5 segundos
    startStoryAutoPlay();

    const container = document.getElementById('story-carousel-container');
    if (container) {
        container.addEventListener('mouseenter', stopStoryAutoPlay);
        container.addEventListener('mouseleave', startStoryAutoPlay);
    }
}

function updateStoryCarouselPosition() {
    const track = document.getElementById('story-carousel-track');
    if (!track) return;

    track.style.transform = `translateX(-${storyCurrentIndex * 100}%)`;

    const dots = document.querySelectorAll('#story-carousel-dots .carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === storyCurrentIndex);
    });
}

function nextStorySlide() {
    if (storyTotalSlides <= 0) return;
    storyCurrentIndex = (storyCurrentIndex + 1) % storyTotalSlides;
    updateStoryCarouselPosition();
}

function prevStorySlide() {
    if (storyTotalSlides <= 0) return;
    storyCurrentIndex = (storyCurrentIndex - 1 + storyTotalSlides) % storyTotalSlides;
    updateStoryCarouselPosition();
}

function goToStorySlide(index) {
    storyCurrentIndex = index;
    updateStoryCarouselPosition();
}

function startStoryAutoPlay() {
    stopStoryAutoPlay();
    if (storyTotalSlides > 1) {
        storyAutoTimer = setInterval(nextStorySlide, 5000);
    }
}

function stopStoryAutoPlay() {
    if (storyAutoTimer) clearInterval(storyAutoTimer);
}

// =============================================================================
// CARRUSEL EN MOVIMIENTO: DEDICATORIAS & BUENOS DESEOS
// =============================================================================

async function renderDedicationsCarousel() {
    const track = document.getElementById('dedications-track');
    const dotsContainer = document.getElementById('dedications-dots');
    if (!track) return;

    const list = await window.weddingDB.getDedicatorias();

    if (list.length === 0) {
        track.innerHTML = `
            <div class="dedications-slide">
                <div class="dedication-card">
                    <p class="dedication-text">"Aún no hay dedicatorias. ¡Sé el primero en dejar un mensaje en el formulario de confirmación!"</p>
                    <div class="dedication-author">✨ Valentina & Sebastián</div>
                </div>
            </div>
        `;
        if (dotsContainer) dotsContainer.innerHTML = '';
        return;
    }

    dedTotalSlides = list.length;
    dedCurrentIndex = 0;

    track.innerHTML = list.map(d => `
        <div class="dedications-slide">
            <div class="dedication-card">
                <p class="dedication-text">"${escapeHtml(d.mensaje)}"</p>
                <div class="dedication-author">✨ ${escapeHtml(d.autor)}</div>
                ${d.cancion_sugerida ? `
                    <div style="margin-top: 0.75rem;">
                        <span class="dedication-song">🎵 ${escapeHtml(d.cancion_sugerida)}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    if (dotsContainer) {
        dotsContainer.innerHTML = list.map((_, idx) => `
            <button class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToDedicationSlide(${idx})"></button>
        `).join('');
    }

    startDedicationsAutoPlay();
}

function updateDedicationsPosition() {
    const track = document.getElementById('dedications-track');
    if (!track) return;

    track.style.transform = `translateX(-${dedCurrentIndex * 100}%)`;

    const dots = document.querySelectorAll('#dedications-dots .carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === dedCurrentIndex);
    });
}

function nextDedicationSlide() {
    if (dedTotalSlides <= 0) return;
    dedCurrentIndex = (dedCurrentIndex + 1) % dedTotalSlides;
    updateDedicationsPosition();
}

function goToDedicationSlide(index) {
    dedCurrentIndex = index;
    updateDedicationsPosition();
}

function startDedicationsAutoPlay() {
    if (dedAutoTimer) clearInterval(dedAutoTimer);
    if (dedTotalSlides > 1) {
        dedAutoTimer = setInterval(nextDedicationSlide, 4500);
    }
}

// =============================================================================
// ÁLBUM DE FOTOS COMPARTIDO EN VIVO & CHAT DE INVITADOS
// =============================================================================

function checkAlbumAccessStatus() {
    if (!weddingConfig) return;

    const pausedStateEl = document.getElementById('album-paused-state');
    const lockStateEl = document.getElementById('album-lock-state');
    const activeStateEl = document.getElementById('album-active-state');
    if (!pausedStateEl || !lockStateEl || !activeStateEl) return;

    // Si está pausado por emergencia por los novios
    if (weddingConfig.album_pausado) {
        pausedStateEl.style.display = 'block';
        lockStateEl.style.display = 'none';
        activeStateEl.style.display = 'none';
        return;
    } else {
        pausedStateEl.style.display = 'none';
    }

    // Si los novios configuraron "habilitar siempre para pruebas"
    if (weddingConfig.album_habilitado_siempre) {
        lockStateEl.style.display = 'none';
        activeStateEl.style.display = 'block';
        return;
    }

    const weddingTime = new Date(weddingConfig.fecha_boda).getTime();
    const oneHourBefore = weddingTime - (60 * 60 * 1000);
    const now = new Date().getTime();

    if (now >= oneHourBefore) {
        lockStateEl.style.display = 'none';
        activeStateEl.style.display = 'block';
    } else {
        lockStateEl.style.display = 'block';
        activeStateEl.style.display = 'none';

        const unlockDate = new Date(oneHourBefore);
        const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' };
        document.getElementById('album-unlock-time').textContent = unlockDate.toLocaleDateString('es-CO', options);
    }
}

async function renderGuestPhotos() {
    const container = document.getElementById('guest-photos-container');
    if (!container) return;

    const photos = await window.weddingDB.getAlbumFotos(true); // Solo aprobadas

    if (photos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: #ffffff; border-radius: var(--radius-md); border: 1px dashed var(--border-light); color: var(--text-muted);">
                📷 ¡Sé el primero en subir una foto de la boda! Haz clic en "Tomar / Subir Foto".
            </div>
        `;
        return;
    }

    container.innerHTML = photos.map(p => `
        <div class="guest-photo-card">
            <div class="guest-photo-img-wrap">
                <img src="${escapeHtml(p.foto_url)}" alt="Foto de boda por ${escapeHtml(p.autor_nombre)}" class="guest-photo-img" loading="lazy" onclick="openPhotoZoom('${escapeHtml(p.foto_url)}')">
            </div>
            <div class="guest-photo-info">
                <div class="guest-photo-author">👤 ${escapeHtml(p.autor_nombre)}</div>
                ${p.pie_de_foto ? `<div class="guest-photo-caption">"${escapeHtml(p.pie_de_foto)}"</div>` : ''}
                <div class="guest-photo-time">🕒 ${formatRelativeTime(p.created_at)}</div>
            </div>
        </div>
    `).join('');
}

async function renderAlbumChat() {
    const container = document.getElementById('album-chat-messages-wrap');
    const badgeCount = document.getElementById('chat-msg-count');
    if (!container) return;

    const messages = await window.weddingDB.getAlbumChat();
    if (badgeCount) badgeCount.textContent = messages.length;

    if (messages.length === 0) {
        container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; text-align: center; margin-top: 1rem;">No hay mensajes todavía. ¡Sé el primero en saludar! 👋</div>`;
        return;
    }

    container.innerHTML = messages.map(m => `
        <div class="chat-bubble">
            <div class="chat-bubble-author">${escapeHtml(m.autor_nombre)}</div>
            <p class="chat-bubble-text">${escapeHtml(m.mensaje)}</p>
            <div class="chat-bubble-time">${formatRelativeTime(m.created_at)}</div>
        </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
}

function initAlbumEvents() {
    const btnOpenUpload = document.getElementById('btn-open-upload-modal');
    if (btnOpenUpload) {
        btnOpenUpload.addEventListener('click', () => {
            const modal = document.getElementById('modal-upload-photo');
            document.getElementById('form-upload-guest-photo').reset();
            document.getElementById('up-guest-photo-base64').value = '';
            document.getElementById('preview-guest-upload').style.backgroundImage = 'none';
            document.getElementById('preview-guest-upload').textContent = 'Sin foto seleccionada';
            modal.showModal();
        });
    }

    const fileInput = document.getElementById('file-guest-photo');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    document.getElementById('up-guest-photo-base64').value = base64;
                    const preview = document.getElementById('preview-guest-upload');
                    preview.style.backgroundImage = `url('${base64}')`;
                    preview.textContent = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const formUpload = document.getElementById('form-upload-guest-photo');
    if (formUpload) {
        formUpload.addEventListener('submit', async (e) => {
            e.preventDefault();
            const photoBase64 = document.getElementById('up-guest-photo-base64').value;
            if (!photoBase64) {
                showToast('Por favor selecciona o toma una foto primero.', 'error');
                return;
            }

            const btnSubmit = document.getElementById('btn-submit-guest-photo');
            btnSubmit.innerHTML = 'Subiendo... ⏳';
            btnSubmit.disabled = true;

            const payload = {
                autor_nombre: document.getElementById('up-guest-name').value.trim(),
                pie_de_foto: document.getElementById('up-guest-caption').value.trim(),
                foto_url: photoBase64
            };

            await window.weddingDB.saveAlbumFoto(payload);
            document.getElementById('modal-upload-photo').close();
            btnSubmit.innerHTML = 'Publicar en el Álbum';
            btnSubmit.disabled = false;

            showToast('¡Foto publicada de inmediato en el álbum compartido! 📸✨', 'success');
            await renderGuestPhotos();
        });
    }

    const formChat = document.getElementById('form-album-chat');
    if (formChat) {
        formChat.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('chat-input-name').value.trim();
            const msg = document.getElementById('chat-input-msg').value.trim();

            if (!name || !msg) return;

            await window.weddingDB.sendAlbumChatMessage({
                autor_nombre: name,
                mensaje: msg
            });

            document.getElementById('chat-input-msg').value = '';
            await renderAlbumChat();
        });
    }
}

function openPhotoZoom(url) {
    window.open(url, '_blank');
}

// =============================================================================
// CUENTA REGRESIVA
// =============================================================================

function startCountdown(targetDateStr) {
    if (!targetDateStr) return;
    if (countdownInterval) clearInterval(countdownInterval);

    const targetTime = new Date(targetDateStr).getTime();

    function update() {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff <= 0) {
            document.getElementById('cd-days').textContent = '00';
            document.getElementById('cd-hours').textContent = '00';
            document.getElementById('cd-minutes').textContent = '00';
            document.getElementById('cd-seconds').textContent = '00';
            checkAlbumAccessStatus();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownInterval = setInterval(update, 1000);
}

// =============================================================================
// FORMULARIO DE CONFIRMACIÓN DE ASISTENCIA
// =============================================================================

function initRSVPFormEvents() {
    const optAttending = document.getElementById('opt-attending');
    const optDeclined = document.getElementById('opt-declined');
    const attendingFields = document.getElementById('rsvp-attending-fields');
    const form = document.getElementById('form-public-rsvp');

    if (!form) return;

    optAttending.addEventListener('click', () => {
        optAttending.classList.add('selected');
        optDeclined.classList.remove('selected');
        attendingFields.style.display = 'block';
        document.querySelector('input[name="estado_rsvp"][value="Confirmado"]').checked = true;
    });

    optDeclined.addEventListener('click', () => {
        optDeclined.classList.add('selected');
        optAttending.classList.remove('selected');
        attendingFields.style.display = 'none';
        document.querySelector('input[name="estado_rsvp"][value="Declinado"]').checked = true;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnSubmit = document.getElementById('btn-submit-rsvp');
        const origText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Enviando confirmación... ⏳';
        btnSubmit.disabled = true;

        const isAttending = document.querySelector('input[name="estado_rsvp"]:checked').value === 'Confirmado';

        const payload = {
            nombre_completo: document.getElementById('rsvp-nombre').value.trim(),
            telefono: document.getElementById('rsvp-telefono').value.trim(),
            email: document.getElementById('rsvp-email').value.trim(),
            estado_rsvp: isAttending ? 'Confirmado' : 'Declinado',
            pases_adultos: isAttending ? parseInt(document.getElementById('rsvp-pases-adultos').value) || 1 : 0,
            pases_ninos: isAttending ? parseInt(document.getElementById('rsvp-pases-ninos').value) || 0 : 0,
            pases_confirmados: isAttending ? parseInt(document.getElementById('rsvp-pases-adultos').value) || 1 : 0,
            restricciones_dieteticas: isAttending ? document.getElementById('rsvp-dieta').value : 'Ninguna',
            alergias_detalle: isAttending ? document.getElementById('rsvp-alergias').value.trim() : '',
            cancion_sugerida: isAttending ? document.getElementById('rsvp-cancion').value.trim() : '',
            mensaje_dedicatoria: document.getElementById('rsvp-mensaje').value.trim()
        };

        try {
            await window.weddingDB.submitPublicRSVP(payload);

            form.reset();
            optAttending.click();
            btnSubmit.innerHTML = origText;
            btnSubmit.disabled = false;

            showToast(isAttending ? '🎉 ¡Muchas gracias! Tu asistencia ha sido confirmada.' : '💌 Gracias por avisarnos. Te tendremos presente.', 'success');
            await renderDedicationsCarousel();
        } catch (err) {
            btnSubmit.innerHTML = origText;
            btnSubmit.disabled = false;
            showToast('Error al enviar: ' + err.message, 'error');
        }
    });
}

// =============================================================================
// MODAL ORGANIZADORES & AUTENTICACIÓN
// =============================================================================

function initOrganizerAuthEvents() {
    const btnOpenAuth = document.getElementById('btn-open-organizer-auth');
    const modal = document.getElementById('modal-organizer-auth');
    const form = document.getElementById('form-organizer-login');

    if (!btnOpenAuth || !modal || !form) return;

    btnOpenAuth.addEventListener('click', () => {
        modal.showModal();
        document.getElementById('auth-pin').focus();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pinInput = document.getElementById('auth-pin').value.trim();
        const validPin = (weddingConfig && weddingConfig.admin_pin) ? weddingConfig.admin_pin : '1234';

        if (pinInput === validPin) {
            localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'authenticated_' + Date.now());
            modal.close();
            showToast('Acceso concedido. Redirigiendo al panel...', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
        } else {
            showToast('PIN incorrecto. Intenta nuevamente.', 'error');
            document.getElementById('auth-pin').value = '';
            document.getElementById('auth-pin').focus();
        }
    });
}

// =============================================================================
// UTILIDADES
// =============================================================================

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatRelativeTime(dateStr) {
    if (!dateStr) return 'Hace un momento';
    const now = new Date().getTime();
    const past = new Date(dateStr).getTime();
    const diffMin = Math.floor((now - past) / (1000 * 60));

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return new Date(dateStr).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(string) {
    if (!string) return '';
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
