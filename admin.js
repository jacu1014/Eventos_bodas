/**
 * ==============================================================================
 * CONTROLADOR PRINCIPAL DEL PANEL ADMINISTRATIVO DE BODA (ADMIN.JS) 💍✨
 * Versión 4.0: Múltiples Cuentas Bancarias, Pausa de Emergencia y Álbum Imprimible
 * ==============================================================================
 */

let weddingConfig = null;
let currentTab = 'tab-dashboard';

// Caché de listas
let listInvitados = [];
let listPresupuesto = [];
let listCotizaciones = [];
let listActividades = [];
let listCompras = [];
let listItinerario = [];
let listAlbumFotos = [];
let listAlbumChat = [];

// Paleta activa para código de vestimenta
let activeDressCodeColors = [];

// Galería activa de los novios
let activeGalleryPhotos = [];

// Múltiples cuentas bancarias
let activeBankAccounts = [];

document.addEventListener('DOMContentLoaded', async () => {
    checkAuthentication();
    await loadInitialData();
    initTabNavigation();
    initEventListeners();
    updateConnectionPill();
});

function checkAuthentication() {
    const authState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    if (!authState) {
        window.location.href = 'index.html#confirmacion';
    }
}

async function loadInitialData() {
    weddingConfig = await window.weddingDB.getConfig();
    listInvitados = await window.weddingDB.getInvitados();
    listPresupuesto = await window.weddingDB.getPresupuesto();
    listCotizaciones = await window.weddingDB.getCotizaciones();
    listActividades = await window.weddingDB.getActividades();
    listCompras = await window.weddingDB.getCompras();
    listItinerario = await window.weddingDB.getItinerario();
    listAlbumFotos = await window.weddingDB.getAlbumFotos(false);
    listAlbumChat = await window.weddingDB.getAlbumChat();

    activeDressCodeColors = weddingConfig.dress_code_colors || [];
    activeGalleryPhotos = weddingConfig.galeria_fotos || [];
    activeBankAccounts = weddingConfig.cuentas_bancarias || [];

    // Si venía de versión anterior con cuenta única, migrarla a activeBankAccounts
    if (activeBankAccounts.length === 0 && weddingConfig.banco_nombre && weddingConfig.banco_numero_cuenta) {
        activeBankAccounts.push({
            id: 'cta-legacy',
            banco_nombre: weddingConfig.banco_nombre,
            banco_tipo_cuenta: weddingConfig.banco_tipo_cuenta || 'Cuenta de Ahorros',
            banco_numero_cuenta: weddingConfig.banco_numero_cuenta,
            banco_titular: weddingConfig.banco_titular || `${weddingConfig.novia_nombre} & ${weddingConfig.novio_nombre}`,
            banco_documento: weddingConfig.banco_documento || '',
            banco_llave_breb: weddingConfig.banco_llave_breb || '',
            qr_banco_url: weddingConfig.qr_banco_url || ''
        });
    }

    renderHeaderInfo();
    renderAllViews();
}

function renderHeaderInfo() {
    if (!weddingConfig) return;
    const novia = weddingConfig.novia_nombre || 'Valentina';
    const novio = weddingConfig.novio_nombre || 'Sebastián';
    document.getElementById('admin-header-title').textContent = `Panel de Boda: ${novia} & ${novio}`;

    if (weddingConfig.fecha_boda) {
        const weddingDate = new Date(weddingConfig.fecha_boda);
        const now = new Date();
        const diffDays = Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            document.getElementById('admin-countdown-badge').textContent = `⏳ Faltan ${diffDays} días para el gran día (${weddingDate.toLocaleDateString('es-CO')})`;
        } else if (diffDays === 0) {
            document.getElementById('admin-countdown-badge').textContent = `🎉 ¡Hoy es el gran día de la boda!`;
        } else {
            document.getElementById('admin-countdown-badge').textContent = `💍 Celebrada el ${weddingDate.toLocaleDateString('es-CO')}`;
        }
    }
}

function renderAllViews() {
    renderDashboard();
    renderInvitadosTable();
    renderAlbumModeration();
    renderPresupuestoTable();
    renderCotizacionesGrid();
    renderActividadesTree();
    renderComprasTable();
    renderItinerarioTable();
    populateConfigForm();
}

// =============================================================================
// NAVEGACIÓN ENTRE PESTAÑAS
// =============================================================================

function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    currentTab = tabId;

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================================
// PESTAÑA 1: DASHBOARD
// =============================================================================

function renderDashboard() {
    // 1. Invitados
    const totalInvitados = listInvitados.length;
    const confirmadosList = listInvitados.filter(i => i.estado_rsvp === 'Confirmado');
    const totalPasesConfirmados = confirmadosList.reduce((acc, curr) => acc + (parseInt(curr.pases_confirmados) || parseInt(curr.pases_adultos) || 0), 0);
    const totalPasesInvitados = listInvitados.reduce((acc, curr) => acc + (parseInt(curr.pases_adultos) || 0) + (parseInt(curr.pases_ninos) || 0), 0);

    document.getElementById('dash-invitados-confirmados').textContent = totalPasesConfirmados;
    document.getElementById('dash-invitados-subtext').textContent = `${totalPasesConfirmados} pases de ${totalPasesInvitados} invitados totales`;
    document.getElementById('badge-count-invitados').textContent = `${confirmadosList.length}/${totalInvitados}`;

    // 2. Fotos en el Álbum
    const totalFotos = listAlbumFotos.length;
    document.getElementById('dash-album-fotos-count').textContent = totalFotos;
    document.getElementById('badge-count-album').textContent = totalFotos;

    // 3. Presupuesto & Pagos
    const metaPresupuesto = weddingConfig.presupuesto_objetivo || 45000000;
    const totalRealContratado = listPresupuesto.reduce((acc, curr) => acc + (Number(curr.costo_real) || Number(curr.costo_estimado) || 0), 0);
    const totalPagado = listPresupuesto.reduce((acc, curr) => acc + (Number(curr.monto_pagado) || 0), 0);
    const saldoPendiente = totalRealContratado - totalPagado;

    document.getElementById('dash-saldo-pendiente').textContent = formatCurrency(saldoPendiente);
    document.getElementById('dash-pagado-total').textContent = `Total Pagado: ${formatCurrency(totalPagado)}`;
    document.getElementById('badge-count-presupuesto').textContent = formatCurrency(totalRealContratado);

    const budgetPct = metaPresupuesto > 0 ? Math.min(100, Math.round((totalRealContratado / metaPresupuesto) * 100)) : 0;
    document.getElementById('dash-budget-pct').textContent = `${budgetPct}% (${formatCurrency(totalRealContratado)} de ${formatCurrency(metaPresupuesto)})`;
    document.getElementById('dash-budget-progress').style.width = `${budgetPct}%`;
    document.getElementById('dash-spent-label').textContent = `Gastado: ${formatCurrency(totalRealContratado)}`;
    const disponible = metaPresupuesto - totalRealContratado;
    document.getElementById('dash-remaining-label').textContent = disponible >= 0 ? `Disponible: ${formatCurrency(disponible)}` : `Excedido: ${formatCurrency(Math.abs(disponible))}`;

    // Desglose de Gastos por Categoría
    const categoriesMap = {};
    listPresupuesto.forEach(p => {
        const cat = p.categoria || 'Otros';
        categoriesMap[cat] = (categoriesMap[cat] || 0) + (Number(p.costo_real) || Number(p.costo_estimado) || 0);
    });

    const catSorted = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const catContainer = document.getElementById('dash-categories-breakdown');
    catContainer.innerHTML = catSorted.map(([cat, amount]) => {
        const pct = totalRealContratado > 0 ? Math.round((amount / totalRealContratado) * 100) : 0;
        return `
            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.2rem;">
                    <span>${escapeHtml(cat)}</span>
                    <strong>${formatCurrency(amount)} (${pct}%)</strong>
                </div>
                <div class="progress-bar-container" style="height: 6px; margin: 0;">
                    <div class="progress-bar-fill" style="width: ${pct}%;"></div>
                </div>
            </div>
        `;
    }).join('');

    // 4. Progreso de Tareas
    const totalTareas = listActividades.length;
    const completadas = listActividades.filter(a => a.completada).length;
    const tareasPct = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;
    document.getElementById('dash-tareas-progreso').textContent = `${tareasPct}%`;
    document.getElementById('dash-tareas-subtext').textContent = `${completadas} de ${totalTareas} completadas`;
    document.getElementById('badge-count-tareas').textContent = `${tareasPct}%`;

    // Próximas Tareas Pendientes
    const pendientes = listActividades.filter(a => !a.completada).slice(0, 4);
    const tasksContainer = document.getElementById('dash-upcoming-tasks');
    if (pendientes.length === 0) {
        tasksContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem;">¡Excelente! No hay tareas pendientes en este momento. 🎉</div>`;
    } else {
        tasksContainer.innerHTML = pendientes.map(t => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-canvas); padding: 0.65rem 0.9rem; border-radius: var(--radius-sm); border-left: 3px solid var(--gold-500);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" onchange="toggleActividadStatus('${t.id}')">
                    <span style="font-size: 0.88rem; font-weight: 500;">${escapeHtml(t.titulo)}</span>
                </div>
                <span class="badge badge-emerald" style="font-size: 0.72rem;">${escapeHtml(t.responsable)}</span>
            </div>
        `).join('');
    }

    // Últimas Confirmaciones y Dedicatorias
    const recentRSVPs = [...listInvitados].reverse().slice(0, 4);
    const rsvpContainer = document.getElementById('dash-recent-rsvps');
    if (recentRSVPs.length === 0) {
        rsvpContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; grid-column: 1 / -1;">Aún no se han recibido confirmaciones desde la web.</div>`;
    } else {
        rsvpContainer.innerHTML = recentRSVPs.map(r => `
            <div style="background: var(--bg-canvas); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <strong style="color: var(--emerald-900); font-size: 0.95rem;">${escapeHtml(r.nombre_completo)}</strong>
                    <span class="badge ${r.estado_rsvp === 'Confirmado' ? 'badge-confirmado' : 'badge-declinado'}">${escapeHtml(r.estado_rsvp)}</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--text-muted);">Pases: ${r.pases_adultos} adultos ${r.pases_ninos > 0 ? '+ ' + r.pases_ninos + ' niños' : ''}</div>
                ${r.cancion_sugerida ? `<div style="font-size: 0.8rem; color: var(--gold-700); margin-top: 0.3rem;">🎵 ${escapeHtml(r.cancion_sugerida)}</div>` : ''}
                ${r.mensaje_dedicatoria ? `<div style="font-size: 0.82rem; font-style: italic; margin-top: 0.4rem; color: var(--text-secondary);">"${escapeHtml(r.mensaje_dedicatoria)}"</div>` : ''}
            </div>
        `).join('');
    }
}

// =============================================================================
// PESTAÑA 2: INVITADOS & CONFIRMACIONES
// =============================================================================

function renderInvitadosTable() {
    const tbody = document.getElementById('table-invitados-body');
    const searchVal = (document.getElementById('filter-guest-search').value || '').toLowerCase();
    const statusVal = document.getElementById('filter-guest-status').value;
    const groupVal = document.getElementById('filter-guest-group').value;

    let filtered = listInvitados.filter(i => {
        const matchesSearch = (i.nombre_completo || '').toLowerCase().includes(searchVal) ||
                              (i.grupo || '').toLowerCase().includes(searchVal) ||
                              (i.mesa_asignada || '').toLowerCase().includes(searchVal);
        const matchesStatus = !statusVal || i.estado_rsvp === statusVal;
        const matchesGroup = !groupVal || i.grupo === groupVal;
        return matchesSearch && matchesStatus && matchesGroup;
    });

    // Totales de resumen
    const totalPases = listInvitados.reduce((a, c) => a + (parseInt(c.pases_adultos) || 0) + (parseInt(c.pases_ninos) || 0), 0);
    const confirmedPases = listInvitados.filter(i => i.estado_rsvp === 'Confirmado').reduce((a, c) => a + (parseInt(c.pases_confirmados) || parseInt(c.pases_adultos) || 0), 0);
    const pendingPases = listInvitados.filter(i => i.estado_rsvp === 'Pendiente').reduce((a, c) => a + (parseInt(c.pases_adultos) || 0), 0);
    const declinedPases = listInvitados.filter(i => i.estado_rsvp === 'Declinado').reduce((a, c) => a + (parseInt(c.pases_adultos) || 0), 0);

    document.getElementById('sum-guests-total').textContent = listInvitados.length;
    document.getElementById('sum-passes-total').textContent = totalPases;
    document.getElementById('sum-passes-confirmed').textContent = confirmedPases;
    document.getElementById('sum-passes-pending').textContent = pendingPases;
    document.getElementById('sum-passes-declined').textContent = declinedPases;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron invitados con los filtros seleccionados.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(i => {
        const statusBadge = i.estado_rsvp === 'Confirmado' ? 'badge-confirmado' : (i.estado_rsvp === 'Pendiente' ? 'badge-pendiente' : 'badge-declinado');
        const phone = i.telefono ? `<a href="tel:${escapeHtml(i.telefono)}" style="font-size: 0.85rem;">📞 ${escapeHtml(i.telefono)}</a>` : '<span style="color: var(--text-muted);">-</span>';

        return `
            <tr>
                <td>
                    <strong>${escapeHtml(i.nombre_completo)}</strong>
                    ${i.es_corte_honor ? `<span class="badge badge-gold" style="margin-left: 0.4rem; font-size: 0.65rem;">Corte de Honor</span>` : ''}
                    ${i.confirmado_por_web ? `<span class="badge badge-emerald" style="margin-left: 0.3rem; font-size: 0.65rem;">Web</span>` : ''}
                </td>
                <td><span class="badge badge-emerald">${escapeHtml(i.grupo)}</span></td>
                <td>${i.pases_adultos} adultos ${i.pases_ninos > 0 ? `+ ${i.pases_ninos} niños` : ''}</td>
                <td><span class="badge ${statusBadge}">${escapeHtml(i.estado_rsvp)}</span></td>
                <td><span style="font-weight: 600;">${escapeHtml(i.mesa_asignada || 'Sin asignar')}</span></td>
                <td>
                    <div>${escapeHtml(i.restricciones_dieteticas || 'Ninguna')}</div>
                    ${i.alergias_detalle ? `<small style="color: var(--status-danger); font-size: 0.75rem;">⚠️ ${escapeHtml(i.alergias_detalle)}</small>` : ''}
                </td>
                <td>${phone}</td>
                <td>
                    <div style="display: flex; gap: 0.4rem;">
                        <button class="btn btn-icon btn-outline btn-sm" onclick="openWhatsAppModal('${i.id}')" title="Enviar recordatorio por WhatsApp">📲</button>
                        <button class="btn btn-icon btn-outline btn-sm" onclick="openGuestModal('${i.id}')" title="Editar invitado">✏️</button>
                        <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteGuest('${i.id}')" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =============================================================================
// PESTAÑA 3: ÁLBUM DE FOTOS EN VIVO & MODERACIÓN
// =============================================================================

function renderAlbumModeration() {
    const grid = document.getElementById('admin-album-grid');
    const chatList = document.getElementById('admin-chat-list');
    const chatBadge = document.getElementById('admin-chat-count');

    // Botón de Pausa de Emergencia
    const btnTogglePause = document.getElementById('btn-toggle-pause-album');
    if (btnTogglePause) {
        if (weddingConfig.album_pausado) {
            btnTogglePause.innerHTML = '▶️ Reanudar Álbum';
            btnTogglePause.style.background = 'var(--status-success)';
        } else {
            btnTogglePause.innerHTML = '⏸️ Pausar Álbum';
            btnTogglePause.style.background = 'var(--status-warning)';
        }
    }

    // Botón de Descarga Pública
    const btnToggleDownload = document.getElementById('btn-toggle-public-download');
    if (btnToggleDownload) {
        if (weddingConfig.descarga_publica_habilitada) {
            btnToggleDownload.innerHTML = '🔒 Ocultar Descarga a Invitados';
            btnToggleDownload.classList.add('btn-emerald');
            btnToggleDownload.classList.remove('btn-outline-gold');
        } else {
            btnToggleDownload.innerHTML = '🔓 Habilitar Descarga para Invitados';
            btnToggleDownload.classList.add('btn-outline-gold');
            btnToggleDownload.classList.remove('btn-emerald');
        }
    }

    if (grid) {
        if (listAlbumFotos.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px dashed var(--border-light); color: var(--text-muted);">
                    📷 Aún no hay fotos subidas al álbum de la boda.
                </div>
            `;
        } else {
            grid.innerHTML = listAlbumFotos.map(f => {
                const isApproved = f.aprobada !== false;
                return `
                    <div class="guest-photo-card" style="border: 2px solid ${isApproved ? 'var(--emerald-300)' : 'var(--status-danger)'};">
                        <div class="guest-photo-img-wrap" style="height: 220px;">
                            <img src="${escapeHtml(f.foto_url)}" alt="Foto" class="guest-photo-img">
                        </div>
                        <div class="guest-photo-info">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                                <span class="guest-photo-author">👤 ${escapeHtml(f.autor_nombre)}</span>
                                <span class="badge ${isApproved ? 'badge-success' : 'badge-danger'}">
                                    ${isApproved ? 'Visible en Web' : 'Oculta'}
                                </span>
                            </div>
                            ${f.pie_de_foto ? `<div class="guest-photo-caption">"${escapeHtml(f.pie_de_foto)}"</div>` : ''}
                            <div class="guest-photo-time">🕒 ${formatRelativeTime(f.created_at)}</div>

                            <!-- Botones de Acción -->
                            <div style="display: flex; gap: 0.4rem; margin-top: 0.75rem; flex-wrap: wrap;">
                                <button class="btn btn-sm ${isApproved ? 'btn-outline' : 'btn-emerald'}" style="flex: 1;" onclick="toggleApprovePhoto('${f.id}')">
                                    ${isApproved ? '👁️ Ocultar' : '✅ Mostrar en Web'}
                                </button>
                                <a href="${escapeHtml(f.foto_url)}" download="foto_boda_${f.id}.jpg" class="btn btn-outline-gold btn-sm" title="Descargar imagen">
                                    📥
                                </a>
                                <button class="btn btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteAlbumPhoto('${f.id}')" title="Eliminar foto permanentemente">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    if (chatList) {
        chatBadge.textContent = `${listAlbumChat.length} mensajes`;
        if (listAlbumChat.length === 0) {
            chatList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1rem;">No hay mensajes en el chat del álbum.</div>`;
        } else {
            chatList.innerHTML = listAlbumChat.map(m => `
                <div style="background: var(--bg-canvas); padding: 0.65rem 0.9rem; border-radius: var(--radius-sm); border-left: 3px solid var(--gold-500); display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong style="color: var(--emerald-900); font-size: 0.85rem;">${escapeHtml(m.autor_nombre)}:</strong>
                        <span style="font-size: 0.88rem; color: var(--text-primary); margin-left: 0.3rem;">${escapeHtml(m.mensaje)}</span>
                    </div>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${formatRelativeTime(m.created_at)}</span>
                </div>
            `).join('');
        }
    }
}

async function togglePauseAlbum() {
    weddingConfig.album_pausado = !weddingConfig.album_pausado;
    await window.weddingDB.saveConfig({ album_pausado: weddingConfig.album_pausado });
    showToast(weddingConfig.album_pausado ? '⏸️ Álbum pausado temporalmente para invitados.' : '▶️ Álbum reanudado con éxito.', 'success');
    renderAlbumModeration();
}

async function togglePublicDownload() {
    weddingConfig.descarga_publica_habilitada = !weddingConfig.descarga_publica_habilitada;
    await window.weddingDB.saveConfig({ descarga_publica_habilitada: weddingConfig.descarga_publica_habilitada });
    showToast(weddingConfig.descarga_publica_habilitada ? '🔓 Botón de descarga de álbum habilitado en la web.' : '🔒 Botón de descarga oculto en la web.', 'success');
    renderAlbumModeration();
}

async function toggleApprovePhoto(id) {
    const updated = await window.weddingDB.toggleAprobarFoto(id);
    if (updated) {
        listAlbumFotos = await window.weddingDB.getAlbumFotos(false);
        renderAlbumModeration();
        renderDashboard();
        showToast(updated.aprobada ? 'Foto visible en la web.' : 'Foto oculta de la web pública.', 'success');
    }
}

async function deleteAlbumPhoto(id) {
    if (confirm('¿Estás seguro de eliminar esta foto del álbum de forma permanente?')) {
        await window.weddingDB.deleteAlbumFoto(id);
        listAlbumFotos = await window.weddingDB.getAlbumFotos(false);
        renderAlbumModeration();
        renderDashboard();
        showToast('Foto eliminada del álbum.', 'success');
    }
}

// =============================================================================
// PESTAÑA 4: PRESUPUESTO & PAGOS
// =============================================================================

function renderPresupuestoTable() {
    const tbody = document.getElementById('table-presupuesto-body');
    const tfoot = document.getElementById('table-presupuesto-foot');
    const catFilter = document.getElementById('filter-presupuesto-categoria').value;

    document.getElementById('presupuesto-meta-display').textContent = formatCurrency(weddingConfig.presupuesto_objetivo || 0);

    let filtered = listPresupuesto.filter(p => !catFilter || p.categoria === catFilter);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay registros de presupuesto con los filtros seleccionados.</td></tr>`;
        tfoot.innerHTML = '';
        return;
    }

    let sumEstimado = 0, sumReal = 0, sumPagado = 0, sumPendiente = 0;

    tbody.innerHTML = filtered.map(p => {
        const est = Number(p.costo_estimado) || 0;
        const real = Number(p.costo_real) || 0;
        const pag = Number(p.monto_pagado) || 0;
        const pen = Math.max(0, real - pag);

        sumEstimado += est;
        sumReal += real;
        sumPagado += pag;
        sumPendiente += pen;

        const badgeClass = p.estado_pago === 'Pagado' ? 'badge-pagado' : (p.estado_pago === 'Anticipo Parcial' ? 'badge-anticipo' : 'badge-pendiente');

        return `
            <tr>
                <td><span class="badge badge-emerald">${escapeHtml(p.categoria)}</span></td>
                <td>
                    <strong>${escapeHtml(p.concepto)}</strong>
                    ${p.proveedor_asociado ? `<div style="font-size: 0.78rem; color: var(--text-muted);">🏢 ${escapeHtml(p.proveedor_asociado)}</div>` : ''}
                </td>
                <td>${formatCurrency(est)}</td>
                <td><strong>${formatCurrency(real)}</strong></td>
                <td style="color: var(--status-success);">${formatCurrency(pag)}</td>
                <td style="color: ${pen > 0 ? 'var(--status-warning)' : 'var(--text-muted)'}; font-weight: 700;">${formatCurrency(pen)}</td>
                <td><span class="badge ${badgeClass}">${escapeHtml(p.estado_pago)}</span></td>
                <td>${p.fecha_limite_pago || '-'}</td>
                <td>
                    <div style="display: flex; gap: 0.3rem;">
                        <button class="btn btn-icon btn-outline btn-sm" onclick="openPresupuestoModal('${p.id}')" title="Editar">✏️</button>
                        <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deletePresupuestoItem('${p.id}')" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tfoot.innerHTML = `
        <tr>
            <td colspan="2" style="text-align: right;">TOTALES:</td>
            <td>${formatCurrency(sumEstimado)}</td>
            <td>${formatCurrency(sumReal)}</td>
            <td style="color: var(--status-success);">${formatCurrency(sumPagado)}</td>
            <td style="color: var(--status-warning);">${formatCurrency(sumPendiente)}</td>
            <td colspan="3"></td>
        </tr>
    `;
}

// =============================================================================
// PESTAÑA 5: COTIZACIONES & PROVEEDORES
// =============================================================================

function renderCotizacionesGrid() {
    const grid = document.getElementById('cotizaciones-grid');
    const catFilter = document.getElementById('filter-cotizaciones-categoria').value;
    const estFilter = document.getElementById('filter-cotizaciones-estado').value;

    let filtered = listCotizaciones.filter(c => {
        const matchesCat = !catFilter || c.categoria === catFilter;
        const matchesEst = !estFilter || c.estado === estFilter;
        return matchesCat && matchesEst;
    });

    document.getElementById('badge-count-cotizaciones').textContent = listCotizaciones.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem; background: #ffffff; border-radius: var(--radius-lg);">No hay cotizaciones registradas. Haz clic en "➕ Nueva Cotización".</div>`;
        return;
    }

    grid.innerHTML = filtered.map(c => {
        const badgeState = c.estado === 'Contratado' ? 'badge-success' : (c.estado === 'Descartado' ? 'badge-danger' : 'badge-warning');

        return `
            <div class="card ${c.estado === 'Contratado' ? 'card-emerald-border' : 'card-gold-border'}">
                <div class="card-header">
                    <div>
                        <span class="badge badge-emerald" style="font-size: 0.75rem;">${escapeHtml(c.categoria)}</span>
                        <h4 style="font-size: 1.35rem; color: var(--emerald-900); margin-top: 0.3rem;">${escapeHtml(c.proveedor)}</h4>
                    </div>
                    <span class="badge ${badgeState}">${escapeHtml(c.estado)}</span>
                </div>

                <div style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: var(--emerald-900); margin-bottom: 0.75rem;">
                    ${formatCurrency(c.monto_cotizado)}
                </div>

                ${c.servicios_incluidos ? `
                    <div style="font-size: 0.88rem; margin-bottom: 1rem; color: var(--text-secondary); background: var(--bg-canvas); padding: 0.75rem; border-radius: var(--radius-sm);">
                        <strong>Incluye:</strong> ${escapeHtml(c.servicios_incluidos)}
                    </div>
                ` : ''}

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.82rem; margin-bottom: 1rem;">
                    ${c.pros ? `<div style="color: var(--status-success);"><strong>Pros:</strong> ${escapeHtml(c.pros)}</div>` : ''}
                    ${c.contras ? `<div style="color: var(--status-danger);"><strong>Contras:</strong> ${escapeHtml(c.contras)}</div>` : ''}
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; border-top: 1px solid var(--bg-subtle); padding-top: 0.6rem;">
                    ${c.contacto_nombre ? `<div>👤 ${escapeHtml(c.contacto_nombre)}</div>` : ''}
                    ${c.telefono ? `<div>📞 ${escapeHtml(c.telefono)}</div>` : ''}
                    ${c.instagram_o_web ? `<div>🌐 ${escapeHtml(c.instagram_o_web)}</div>` : ''}
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center;">
                    ${c.estado !== 'Contratado' ? `
                        <button class="btn btn-gold btn-sm" onclick="transferCotizacionToPresupuesto('${c.id}')" title="Traspasar automáticamente al Presupuesto Oficial">
                            ⭐ Contratar
                        </button>
                    ` : `<span class="badge badge-success">¡Proveedor Oficial!</span>`}

                    <div style="display: flex; gap: 0.3rem;">
                        <button class="btn btn-icon btn-outline btn-sm" onclick="openCotizacionModal('${c.id}')">✏️</button>
                        <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteCotizacionItem('${c.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function transferCotizacionToPresupuesto(id) {
    if (confirm('¿Deseas marcar este proveedor como CONTRATADO y trasladar su monto al Presupuesto Oficial?')) {
        await window.weddingDB.transferCotizacionToPresupuesto(id);
        listCotizaciones = await window.weddingDB.getCotizaciones();
        listPresupuesto = await window.weddingDB.getPresupuesto();
        renderCotizacionesGrid();
        renderPresupuestoTable();
        renderDashboard();
        showToast('¡Proveedor contratado y agregado al Presupuesto Oficial!', 'success');
    }
}

// =============================================================================
// PESTAÑA 6: CRONOGRAMA & TAREAS
// =============================================================================

function renderActividadesTree() {
    const container = document.getElementById('actividades-container');
    const faseFilter = document.getElementById('filter-actividades-fase').value;
    const respFilter = document.getElementById('filter-actividades-responsable').value;

    const FASES = [
        '12 a 9 Meses Antes',
        '8 a 6 Meses Antes',
        '5 a 3 Meses Antes',
        '2 a 1 Mes Antes',
        'Últimas 2 Semanas',
        'El Gran Día',
        'Post-Boda'
    ];

    let html = '';

    FASES.forEach(fase => {
        if (faseFilter && fase !== faseFilter) return;

        const tasksInPhase = listActividades.filter(a => {
            const matchFase = a.fase === fase;
            const matchResp = !respFilter || a.responsable === respFilter;
            return matchFase && matchResp;
        });

        if (tasksInPhase.length === 0 && faseFilter) return;

        const doneInPhase = tasksInPhase.filter(t => t.completada).length;
        const totalInPhase = tasksInPhase.length;

        html += `
            <div class="card card-emerald-border">
                <div class="card-header" style="margin-bottom: 0.75rem;">
                    <div>
                        <h4 style="font-size: 1.25rem; color: var(--emerald-900);">${fase}</h4>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${doneInPhase} de ${totalInPhase} completadas</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                    ${tasksInPhase.length === 0 ? `<div style="color: var(--text-muted); font-size: 0.85rem;">No hay tareas en esta fase.</div>` : tasksInPhase.map(t => `
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: ${t.completada ? 'var(--status-success-bg)' : 'var(--bg-canvas)'}; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <input type="checkbox" ${t.completada ? 'checked' : ''} onchange="toggleActividadStatus('${t.id}')" style="transform: scale(1.2); cursor: pointer;">
                                <span style="font-size: 0.92rem; font-weight: 500; ${t.completada ? 'text-decoration: line-through; color: var(--text-muted);' : 'color: var(--text-primary);'}">${escapeHtml(t.titulo)}</span>
                            </div>

                            <div style="display: flex; align-items: center; gap: 0.6rem;">
                                ${t.fecha_limite ? `<span style="font-size: 0.78rem; color: var(--text-muted);">📅 ${t.fecha_limite}</span>` : ''}
                                <span class="badge badge-emerald" style="font-size: 0.72rem;">${escapeHtml(t.responsable)}</span>
                                <button class="btn btn-icon btn-outline btn-sm" onclick="openActividadModal('${t.id}')">✏️</button>
                                <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteActividadItem('${t.id}')">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html || `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay tareas para mostrar.</div>`;
}

async function toggleActividadStatus(id) {
    await window.weddingDB.toggleActividad(id);
    listActividades = await window.weddingDB.getActividades();
    renderActividadesTree();
    renderDashboard();
}

// =============================================================================
// PESTAÑA 7: LISTA DE COMPRAS
// =============================================================================

function renderComprasTable() {
    const tbody = document.getElementById('table-compras-body');
    const filterEstado = document.getElementById('filter-compras-estado').value;

    let filtered = listCompras.filter(c => {
        if (filterEstado === 'pendientes') return !c.comprado;
        if (filterEstado === 'comprados') return c.comprado;
        return true;
    });

    document.getElementById('badge-count-compras').textContent = listCompras.filter(c => !c.comprado).length;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay artículos de compra registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(c => `
        <tr style="${c.comprado ? 'background: #fbfdfc;' : ''}">
            <td>
                <input type="checkbox" ${c.comprado ? 'checked' : ''} onchange="toggleCompraStatus('${c.id}')" style="transform: scale(1.2); cursor: pointer;">
            </td>
            <td>
                <strong style="${c.comprado ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${escapeHtml(c.articulo)}</strong>
            </td>
            <td><span class="badge badge-emerald">${escapeHtml(c.categoria || 'General')}</span></td>
            <td>${c.cantidad || 1}</td>
            <td>${escapeHtml(c.tienda_sugerida || '-')}</td>
            <td>${formatCurrency(c.costo_estimado || 0)}</td>
            <td>${escapeHtml(c.responsable || 'Ambos')}</td>
            <td>
                <div style="display: flex; gap: 0.3rem;">
                    <button class="btn btn-icon btn-outline btn-sm" onclick="openCompraModal('${c.id}')">✏️</button>
                    <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteCompraItem('${c.id}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function toggleCompraStatus(id) {
    await window.weddingDB.toggleCompra(id);
    listCompras = await window.weddingDB.getCompras();
    renderComprasTable();
}

// =============================================================================
// PESTAÑA 8: ITINERARIO
// =============================================================================

function renderItinerarioTable() {
    const tbody = document.getElementById('table-itinerario-body');

    if (listItinerario.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aún no has registrado hitos en el itinerario del Día D.</td></tr>`;
        return;
    }

    tbody.innerHTML = listItinerario.map(it => `
        <tr>
            <td><strong style="color: var(--gold-700); font-size: 1.05rem;">${escapeHtml(it.hora)}</strong></td>
            <td><strong>${escapeHtml(it.actividad)}</strong></td>
            <td>${escapeHtml(it.lugar || '-')}</td>
            <td>${escapeHtml(it.responsables || 'Todos')}</td>
            <td style="font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(it.detalles || '-')}</td>
            <td>
                <div style="display: flex; gap: 0.3rem;">
                    <button class="btn btn-icon btn-outline btn-sm" onclick="openItinerarioModal('${it.id}')">✏️</button>
                    <button class="btn btn-icon btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteItinerarioItem('${it.id}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// =============================================================================
// PESTAÑA 9: CONFIGURACIÓN DINÁMICA & ESTUDIO DE PERSONALIZACIÓN
// =============================================================================

function populateConfigForm() {
    if (!weddingConfig) return;

    document.getElementById('cfg-novia').value = weddingConfig.novia_nombre || 'Valentina';
    document.getElementById('cfg-novio').value = weddingConfig.novio_nombre || 'Sebastián';
    document.getElementById('cfg-frase').value = weddingConfig.frase_amor || '';
    document.getElementById('cfg-admin-pin').value = weddingConfig.admin_pin || '1234';

    if (weddingConfig.fecha_boda) {
        document.getElementById('cfg-fecha').value = weddingConfig.fecha_boda.substring(0, 16);
    }
    document.getElementById('cfg-presupuesto').value = weddingConfig.presupuesto_objetivo || 45000000;
    document.getElementById('cfg-album-habilitado-siempre').value = weddingConfig.album_habilitado_siempre ? 'true' : 'false';

    // Dress code
    document.getElementById('cfg-dress-code').value = weddingConfig.dress_code || '';
    renderDressCodeChips();

    // Paleta de Colores de la Web
    renderThemePresets();
    const primary = weddingConfig.theme_primary_color || '#0F4C3A';
    const accent = weddingConfig.theme_accent_color || '#D4AF37';
    const bg = weddingConfig.theme_bg_color || '#F6F9F7';

    document.getElementById('cfg-color-primary').value = primary;
    document.getElementById('cfg-color-primary-text').value = primary;
    document.getElementById('cfg-color-accent').value = accent;
    document.getElementById('cfg-color-accent-text').value = accent;
    document.getElementById('cfg-color-bg').value = bg;
    document.getElementById('cfg-color-bg-text').value = bg;

    // Lugares
    document.getElementById('cfg-ceremonia-lugar').value = weddingConfig.lugar_ceremonia || '';
    document.getElementById('cfg-ceremonia-dir').value = weddingConfig.direccion_ceremonia || '';
    document.getElementById('cfg-ceremonia-maps').value = weddingConfig.maps_ceremonia_url || '';
    document.getElementById('cfg-recepcion-lugar').value = weddingConfig.lugar_recepcion || '';
    document.getElementById('cfg-recepcion-dir').value = weddingConfig.direccion_recepcion || '';
    document.getElementById('cfg-recepcion-maps').value = weddingConfig.maps_recepcion_url || '';

    // Imágenes Principales
    document.getElementById('cfg-image-fit-mode').value = weddingConfig.image_fit_mode || 'cover';
    document.getElementById('cfg-hero-img-url').value = weddingConfig.hero_image_url || '';
    updateImagePreview('preview-hero-img', weddingConfig.hero_image_url);

    document.getElementById('cfg-ceremonia-img-url').value = weddingConfig.ceremonia_image_url || '';
    updateImagePreview('preview-ceremonia-img', weddingConfig.ceremonia_image_url);

    document.getElementById('cfg-recepcion-img-url').value = weddingConfig.recepcion_image_url || '';
    updateImagePreview('preview-recepcion-img', weddingConfig.recepcion_image_url);

    // Galería de los Novios
    renderAdminGalleryGrid();

    // Múltiples Cuentas Bancarias
    document.getElementById('cfg-frase-regalos').value = weddingConfig.frase_regalos || '';
    renderAdminBankAccounts();

    // Supabase
    document.getElementById('sb-url').value = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
    document.getElementById('sb-key').value = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '';
}

// =============================================================================
// GESTIÓN DE MÚLTIPLES CUENTAS BANCARIAS EN EL PANEL DE CONFIGURACIÓN
// =============================================================================

function renderAdminBankAccounts() {
    const container = document.getElementById('admin-bank-accounts-list');
    if (!container) return;

    if (activeBankAccounts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--bg-canvas); border-radius: var(--radius-md); color: var(--text-muted);">
                No hay cuentas bancarias configuradas. Haz clic en "➕ Agregar Otra Cuenta Bancaria".
            </div>
        `;
        return;
    }

    container.innerHTML = activeBankAccounts.map((cta, idx) => `
        <div class="bank-account-card">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--emerald-900); font-size: 1.05rem;">🏦 ${escapeHtml(cta.banco_nombre)}</strong>
                    <span class="badge badge-gold">${escapeHtml(cta.banco_tipo_cuenta || 'Ahorros')}</span>
                </div>
                <div style="font-size: 0.88rem; margin-bottom: 0.3rem;">
                    <span class="bank-label">N° Cuenta:</span> <strong>${escapeHtml(cta.banco_numero_cuenta)}</strong>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.3rem;">
                    <span class="bank-label">Titular:</span> ${escapeHtml(cta.banco_titular)}
                </div>
                ${cta.banco_llave_breb ? `
                    <div style="font-size: 0.82rem; color: var(--gold-800); background: var(--gold-50); padding: 0.2rem 0.5rem; border-radius: 4px; margin-top: 0.3rem;">
                        ⚡ Bre-B: <strong>${escapeHtml(cta.banco_llave_breb)}</strong>
                    </div>
                ` : ''}
            </div>

            <div style="display: flex; gap: 0.4rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 0.6rem;">
                <button type="button" class="btn btn-outline btn-sm" onclick="openBankAccountModal(${idx})">✏️ Editar</button>
                <button type="button" class="btn btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteBankAccount(${idx})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function openBankAccountModal(index = null) {
    const modal = document.getElementById('modal-bank-account');
    const selectBanco = document.getElementById('mba-banco');

    // Llenar combo de bancos
    selectBanco.innerHTML = window.BANCOS_COLOMBIA.map(b => `<option value="${b}">${b}</option>`).join('');

    if (index !== null && activeBankAccounts[index]) {
        const cta = activeBankAccounts[index];
        document.getElementById('mba-index').value = index;
        document.getElementById('modal-bank-title').textContent = '✏️ Editar Cuenta Bancaria';
        selectBanco.value = cta.banco_nombre || 'Bancolombia';
        document.getElementById('mba-tipo').value = cta.banco_tipo_cuenta || 'Cuenta de Ahorros';
        document.getElementById('mba-numero').value = cta.banco_numero_cuenta || '';
        document.getElementById('mba-titular').value = cta.banco_titular || '';
        document.getElementById('mba-doc').value = cta.banco_documento || '';
        document.getElementById('mba-breb').value = cta.banco_llave_breb || '';
        document.getElementById('mba-qr-url').value = cta.qr_banco_url || '';
        updateImagePreview('preview-mba-qr', cta.qr_banco_url);
    } else {
        document.getElementById('mba-index').value = '';
        document.getElementById('modal-bank-title').textContent = '➕ Agregar Nueva Cuenta Bancaria';
        document.getElementById('form-bank-account').reset();
        updateImagePreview('preview-mba-qr', '');
    }

    modal.showModal();
}

function deleteBankAccount(index) {
    if (confirm('¿Deseas eliminar esta cuenta bancaria?')) {
        activeBankAccounts.splice(index, 1);
        renderAdminBankAccounts();
        showToast('Cuenta bancaria eliminada de la lista.', 'success');
    }
}

// =============================================================================
// GALERÍA Y PALETAS
// =============================================================================

function renderThemePresets() {
    const container = document.getElementById('theme-presets-container');
    if (!container) return;

    container.innerHTML = Object.entries(window.THEME_PRESETS).map(([key, p]) => `
        <div class="theme-preset-card ${weddingConfig.theme_palette_preset === key ? 'active' : ''}" onclick="applyThemePreset('${key}')">
            <div class="preset-colors-row">
                <div class="preset-color-block" style="background-color: ${p.primary};"></div>
                <div class="preset-color-block" style="background-color: ${p.accent};"></div>
                <div class="preset-color-block" style="background-color: ${p.bg};"></div>
            </div>
            <div class="preset-name">${p.name}</div>
        </div>
    `).join('');
}

function applyThemePreset(presetKey) {
    const preset = window.THEME_PRESETS[presetKey];
    if (!preset) return;

    weddingConfig.theme_palette_preset = presetKey;
    weddingConfig.theme_primary_color = preset.primary;
    weddingConfig.theme_accent_color = preset.accent;
    weddingConfig.theme_bg_color = preset.bg;

    document.getElementById('cfg-color-primary').value = preset.primary;
    document.getElementById('cfg-color-primary-text').value = preset.primary;
    document.getElementById('cfg-color-accent').value = preset.accent;
    document.getElementById('cfg-color-accent-text').value = preset.accent;
    document.getElementById('cfg-color-bg').value = preset.bg;
    document.getElementById('cfg-color-bg-text').value = preset.bg;

    window.applyWeddingTheme(weddingConfig);
    renderThemePresets();
    showToast(`Paleta aplicada: ${preset.name}`, 'success');
}

function renderDressCodeChips() {
    const container = document.getElementById('dress-code-chips');
    if (!container) return;

    container.innerHTML = activeDressCodeColors.map((c, idx) => `
        <div class="dress-code-chip">
            <span class="dress-code-chip-dot" style="background-color: ${escapeHtml(c.hex)};"></span>
            <span>${escapeHtml(c.name)}</span>
            <button type="button" class="dress-code-chip-delete" onclick="removeDressCodeColor(${idx})" title="Eliminar color">&times;</button>
        </div>
    `).join('');
}

function removeDressCodeColor(index) {
    activeDressCodeColors.splice(index, 1);
    renderDressCodeChips();
}

function renderAdminGalleryGrid() {
    const container = document.getElementById('admin-gallery-preview-grid');
    if (!container) return;

    if (activeGalleryPhotos.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; color: var(--text-muted); padding: 1.5rem; text-align: center;">No hay fotos en la galería de los novios. Haz clic en "➕ Agregar Foto a la Galería".</div>`;
        return;
    }

    container.innerHTML = activeGalleryPhotos.map((p, idx) => `
        <div class="card" style="padding: 1rem;">
            <div style="width: 100%; height: 160px; background-image: url('${escapeHtml(p.url)}'); background-size: cover; background-position: center; border-radius: var(--radius-sm); margin-bottom: 0.75rem;"></div>
            <strong style="font-size: 1rem; color: var(--emerald-900); display: block;">${escapeHtml(p.titulo || 'Sin título')}</strong>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${escapeHtml(p.descripcion || '')}</p>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn btn-outline btn-sm" onclick="openGalleryModal(${idx})">✏️ Editar</button>
                <button type="button" class="btn btn-outline btn-sm" style="color: var(--status-danger);" onclick="deleteGalleryPhoto(${idx})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function openGalleryModal(index = null) {
    const modal = document.getElementById('modal-gallery');
    if (index !== null && activeGalleryPhotos[index]) {
        const photo = activeGalleryPhotos[index];
        document.getElementById('gal-index').value = index;
        document.getElementById('modal-gallery-title').textContent = '✏️ Editar Foto de la Galería';
        document.getElementById('gal-titulo').value = photo.titulo || '';
        document.getElementById('gal-desc').value = photo.descripcion || '';
        document.getElementById('gal-url').value = photo.url || '';
        updateImagePreview('preview-gal-img', photo.url);
    } else {
        document.getElementById('gal-index').value = '';
        document.getElementById('modal-gallery-title').textContent = '➕ Agregar Foto a la Galería';
        document.getElementById('form-gallery').reset();
        updateImagePreview('preview-gal-img', '');
    }
    modal.showModal();
}

function deleteGalleryPhoto(index) {
    if (confirm('¿Deseas eliminar esta foto de la galería?')) {
        activeGalleryPhotos.splice(index, 1);
        renderAdminGalleryGrid();
        showToast('Foto eliminada de la galería.', 'success');
    }
}

// =============================================================================
// MODALES Y FORMULARIOS DE ENTIDADES
// =============================================================================

function openGuestModal(id = null) {
    const modal = document.getElementById('modal-guest');
    if (id) {
        const guest = listInvitados.find(i => i.id === id);
        if (guest) {
            document.getElementById('modal-guest-title').textContent = '✏️ Editar Invitado';
            document.getElementById('g-id').value = guest.id;
            document.getElementById('g-nombre').value = guest.nombre_completo || '';
            document.getElementById('g-grupo').value = guest.grupo || 'Ambos';
            document.getElementById('g-estado').value = guest.estado_rsvp || 'Pendiente';
            document.getElementById('g-adultos').value = guest.pases_adultos || 1;
            document.getElementById('g-ninos').value = guest.pases_ninos || 0;
            document.getElementById('g-confirmados').value = guest.pases_confirmados || 0;
            document.getElementById('g-mesa').value = guest.mesa_asignada || '';
            document.getElementById('g-dieta').value = guest.restricciones_dieteticas || 'Ninguna';
            document.getElementById('g-alergias').value = guest.alergias_detalle || '';
            document.getElementById('g-telefono').value = guest.telefono || '';
            document.getElementById('g-email').value = guest.email || '';
        }
    } else {
        document.getElementById('modal-guest-title').textContent = '➕ Agregar Nuevo Invitado';
        document.getElementById('form-guest').reset();
        document.getElementById('g-id').value = '';
    }
    modal.showModal();
}

async function deleteGuest(id) {
    if (confirm('¿Eliminar este invitado de la lista?')) {
        await window.weddingDB.deleteInvitado(id);
        listInvitados = await window.weddingDB.getInvitados();
        renderInvitadosTable();
        renderDashboard();
        showToast('Invitado eliminado.', 'success');
    }
}

function openWhatsAppModal(id) {
    const guest = listInvitados.find(i => i.id === id);
    if (!guest) return;

    const novia = weddingConfig.novia_nombre || 'Valentina';
    const novio = weddingConfig.novio_nombre || 'Sebastián';
    const url = window.location.href.replace('admin.html', 'index.html');

    const msg = `¡Hola ${guest.nombre_completo}! 💍✨ Con mucha alegría queremos invitarte a celebrar nuestra boda (${novia} & ${novio}). Puedes consultar todos los detalles del evento, lugares, código de vestimenta y confirmar tu asistencia en el siguiente enlace: ${url} ¡Esperamos contar contigo! 🥂`;

    document.getElementById('wa-guest-name').textContent = guest.nombre_completo;
    document.getElementById('wa-message-preview').value = msg;

    const cleanPhone = (guest.telefono || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    document.getElementById('btn-open-wa').href = waUrl;

    document.getElementById('modal-whatsapp').showModal();
}

function openPresupuestoModal(id = null) {
    const modal = document.getElementById('modal-presupuesto');
    if (id) {
        const item = listPresupuesto.find(p => p.id === id);
        if (item) {
            document.getElementById('modal-pres-title').textContent = '✏️ Editar Gasto de Presupuesto';
            document.getElementById('p-id').value = item.id;
            document.getElementById('p-categoria').value = item.categoria;
            document.getElementById('p-concepto').value = item.concepto;
            document.getElementById('p-costo-estimado').value = item.costo_estimado;
            document.getElementById('p-costo-real').value = item.costo_real;
            document.getElementById('p-monto-pagado').value = item.monto_pagado;
            document.getElementById('p-estado-pago').value = item.estado_pago;
            document.getElementById('p-fecha-limite').value = item.fecha_limite_pago || '';
            document.getElementById('p-proveedor').value = item.proveedor_asociado || '';
            document.getElementById('p-notas').value = item.notas || '';
        }
    } else {
        document.getElementById('modal-pres-title').textContent = '➕ Registrar Nuevo Gasto';
        document.getElementById('form-presupuesto').reset();
        document.getElementById('p-id').value = '';
    }
    modal.showModal();
}

async function deletePresupuestoItem(id) {
    if (confirm('¿Eliminar este rubro de presupuesto?')) {
        await window.weddingDB.deletePresupuesto(id);
        listPresupuesto = await window.weddingDB.getPresupuesto();
        renderPresupuestoTable();
        renderDashboard();
        showToast('Rubro eliminado del presupuesto.', 'success');
    }
}

function openCotizacionModal(id = null) {
    const modal = document.getElementById('modal-cotizacion');
    if (id) {
        const item = listCotizaciones.find(c => c.id === id);
        if (item) {
            document.getElementById('modal-cot-title').textContent = '✏️ Editar Cotización';
            document.getElementById('c-id').value = item.id;
            document.getElementById('c-proveedor').value = item.proveedor;
            document.getElementById('c-categoria').value = item.categoria;
            document.getElementById('c-monto').value = item.monto_cotizado;
            document.getElementById('c-estado').value = item.estado;
            document.getElementById('c-servicios').value = item.servicios_incluidos || '';
            document.getElementById('c-pros').value = item.pros || '';
            document.getElementById('c-contras').value = item.contras || '';
            document.getElementById('c-contacto').value = item.contacto_nombre || '';
            document.getElementById('c-telefono').value = item.telefono || '';
            document.getElementById('c-web').value = item.instagram_o_web || '';
        }
    } else {
        document.getElementById('modal-cot-title').textContent = '➕ Registrar Nueva Cotización';
        document.getElementById('form-cotizacion').reset();
        document.getElementById('c-id').value = '';
    }
    modal.showModal();
}

async function deleteCotizacionItem(id) {
    if (confirm('¿Eliminar esta cotización?')) {
        await window.weddingDB.deleteCotizacion(id);
        listCotizaciones = await window.weddingDB.getCotizaciones();
        renderCotizacionesGrid();
        showToast('Cotización eliminada.', 'success');
    }
}

function openActividadModal(id = null) {
    const modal = document.getElementById('modal-actividad');
    if (id) {
        const item = listActividades.find(a => a.id === id);
        if (item) {
            document.getElementById('modal-act-title').textContent = '✏️ Editar Tarea';
            document.getElementById('a-id').value = item.id;
            document.getElementById('a-titulo').value = item.titulo;
            document.getElementById('a-fase').value = item.fase;
            document.getElementById('a-fecha').value = item.fecha_limite || '';
            document.getElementById('a-responsable').value = item.responsable;
            document.getElementById('a-prioridad').value = item.prioridad;
            document.getElementById('a-notas').value = item.notas || '';
        }
    } else {
        document.getElementById('modal-act-title').textContent = '➕ Registrar Nueva Tarea';
        document.getElementById('form-actividad').reset();
        document.getElementById('a-id').value = '';
    }
    modal.showModal();
}

async function deleteActividadItem(id) {
    if (confirm('¿Eliminar esta tarea del cronograma?')) {
        await window.weddingDB.deleteActividad(id);
        listActividades = await window.weddingDB.getActividades();
        renderActividadesTree();
        renderDashboard();
        showToast('Tarea eliminada.', 'success');
    }
}

function openCompraModal(id = null) {
    const modal = document.getElementById('modal-compra');
    if (id) {
        const item = listCompras.find(c => c.id === id);
        if (item) {
            document.getElementById('modal-cmp-title').textContent = '✏️ Editar Artículo de Compra';
            document.getElementById('cmp-id').value = item.id;
            document.getElementById('cmp-articulo').value = item.articulo;
            document.getElementById('cmp-categoria').value = item.categoria;
            document.getElementById('cmp-cantidad').value = item.cantidad;
            document.getElementById('cmp-costo').value = item.costo_estimado;
            document.getElementById('cmp-responsable').value = item.responsable;
            document.getElementById('cmp-tienda').value = item.tienda_sugerida || '';
        }
    } else {
        document.getElementById('modal-cmp-title').textContent = '➕ Registrar Artículo por Comprar';
        document.getElementById('form-compra').reset();
        document.getElementById('cmp-id').value = '';
    }
    modal.showModal();
}

async function deleteCompraItem(id) {
    if (confirm('¿Eliminar este artículo de la lista de compras?')) {
        await window.weddingDB.deleteCompra(id);
        listCompras = await window.weddingDB.getCompras();
        renderComprasTable();
        showToast('Artículo eliminado.', 'success');
    }
}

function openItinerarioModal(id = null) {
    const modal = document.getElementById('modal-itinerario');
    if (id) {
        const item = listItinerario.find(i => i.id === id);
        if (item) {
            document.getElementById('modal-it-title').textContent = '✏️ Editar Hito de Itinerario';
            document.getElementById('it-id').value = item.id;
            document.getElementById('it-hora').value = item.hora;
            document.getElementById('it-actividad').value = item.actividad;
            document.getElementById('it-lugar').value = item.lugar || '';
            document.getElementById('it-responsables').value = item.responsables || '';
            document.getElementById('it-detalles').value = item.detalles || '';
        }
    } else {
        document.getElementById('modal-it-title').textContent = '➕ Agregar Hito al Itinerario';
        document.getElementById('form-itinerario').reset();
        document.getElementById('it-id').value = '';
    }
    modal.showModal();
}

async function deleteItinerarioItem(id) {
    if (confirm('¿Eliminar este momento del itinerario?')) {
        await window.weddingDB.deleteItinerario(id);
        listItinerario = await window.weddingDB.getItinerario();
        renderItinerarioTable();
        showToast('Hito eliminado del itinerario.', 'success');
    }
}

// =============================================================================
// EVENT LISTENERS DE FORMULARIOS Y BOTONES
// =============================================================================

function initEventListeners() {
    // Botones de Acción Superior
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
        window.location.href = 'index.html';
    });

    document.getElementById('btn-print-report').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('btn-open-printable-album').addEventListener('click', () => {
        window.weddingDB.generatePrintableAlbumWindow();
    });

    document.getElementById('btn-toggle-pause-album').addEventListener('click', () => {
        togglePauseAlbum();
    });

    document.getElementById('btn-toggle-public-download').addEventListener('click', () => {
        togglePublicDownload();
    });

    // Filtros de Invitados
    document.getElementById('filter-guest-search').addEventListener('input', renderInvitadosTable);
    document.getElementById('filter-guest-status').addEventListener('change', renderInvitadosTable);
    document.getElementById('filter-guest-group').addEventListener('change', renderInvitadosTable);
    document.getElementById('btn-add-guest').addEventListener('click', () => openGuestModal());
    document.getElementById('btn-export-guests-csv').addEventListener('click', () => window.weddingDB.exportInvitadosCSV());

    // Filtros de Presupuesto
    document.getElementById('filter-presupuesto-categoria').addEventListener('change', renderPresupuestoTable);
    document.getElementById('btn-add-presupuesto').addEventListener('click', () => openPresupuestoModal());
    document.getElementById('btn-edit-budget-goal').addEventListener('click', async () => {
        const current = weddingConfig.presupuesto_objetivo || 45000000;
        const nuevo = prompt('Ingresa el nuevo presupuesto total objetivo ($):', current);
        if (nuevo && !isNaN(nuevo)) {
            weddingConfig.presupuesto_objetivo = parseFloat(nuevo);
            await window.weddingDB.saveConfig({ presupuesto_objetivo: weddingConfig.presupuesto_objetivo });
            renderPresupuestoTable();
            renderDashboard();
            showToast('Meta presupuestaria actualizada.', 'success');
        }
    });

    // Filtros de Cotizaciones
    document.getElementById('filter-cotizaciones-categoria').addEventListener('change', renderCotizacionesGrid);
    document.getElementById('filter-cotizaciones-estado').addEventListener('change', renderCotizacionesGrid);
    document.getElementById('btn-add-cotizacion').addEventListener('click', () => openCotizacionModal());

    // Filtros de Actividades
    document.getElementById('filter-actividades-fase').addEventListener('change', renderActividadesTree);
    document.getElementById('filter-actividades-responsable').addEventListener('change', renderActividadesTree);
    document.getElementById('btn-add-actividad').addEventListener('click', () => openActividadModal());

    // Filtros de Compras
    document.getElementById('filter-compras-estado').addEventListener('change', renderComprasTable);
    document.getElementById('btn-add-compra').addEventListener('click', () => openCompraModal());

    // Itinerario
    document.getElementById('btn-add-itinerario').addEventListener('click', () => openItinerarioModal());

    // Múltiples Cuentas Bancarias
    document.getElementById('btn-add-bank-account').addEventListener('click', () => openBankAccountModal());
    document.getElementById('form-bank-account').addEventListener('submit', (e) => {
        e.preventDefault();
        const indexVal = document.getElementById('mba-index').value;
        const newAccount = {
            id: indexVal !== '' && activeBankAccounts[indexVal] ? activeBankAccounts[indexVal].id : window.weddingDB.generateId('cta'),
            banco_nombre: document.getElementById('mba-banco').value,
            banco_tipo_cuenta: document.getElementById('mba-tipo').value,
            banco_numero_cuenta: document.getElementById('mba-numero').value.trim(),
            banco_titular: document.getElementById('mba-titular').value.trim(),
            banco_documento: document.getElementById('mba-doc').value.trim(),
            banco_llave_breb: document.getElementById('mba-breb').value.trim(),
            qr_banco_url: document.getElementById('mba-qr-url').value.trim()
        };

        if (indexVal !== '') {
            activeBankAccounts[parseInt(indexVal)] = newAccount;
        } else {
            activeBankAccounts.push(newAccount);
        }

        renderAdminBankAccounts();
        document.getElementById('modal-bank-account').close();
        showToast('Cuenta bancaria guardada en la lista.', 'success');
    });

    // Galería
    document.getElementById('btn-add-gallery-photo').addEventListener('click', () => openGalleryModal());
    document.getElementById('form-gallery').addEventListener('submit', (e) => {
        e.preventDefault();
        const indexVal = document.getElementById('gal-index').value;
        const newPhoto = {
            url: document.getElementById('gal-url').value.trim(),
            titulo: document.getElementById('gal-titulo').value.trim(),
            descripcion: document.getElementById('gal-desc').value.trim()
        };

        if (indexVal !== '') {
            activeGalleryPhotos[parseInt(indexVal)] = newPhoto;
        } else {
            activeGalleryPhotos.push(newPhoto);
        }

        renderAdminGalleryGrid();
        document.getElementById('modal-gallery').close();
        showToast('Foto agregada a la galería de los novios.', 'success');
    });

    // Formulario Invitado
    document.getElementById('form-guest').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('g-id').value || undefined,
            nombre_completo: document.getElementById('g-nombre').value.trim(),
            grupo: document.getElementById('g-grupo').value,
            estado_rsvp: document.getElementById('g-estado').value,
            pases_adultos: parseInt(document.getElementById('g-adultos').value) || 1,
            pases_ninos: parseInt(document.getElementById('g-ninos').value) || 0,
            pases_confirmados: parseInt(document.getElementById('g-confirmados').value) || 0,
            mesa_asignada: document.getElementById('g-mesa').value.trim() || 'Sin asignar',
            restricciones_dieteticas: document.getElementById('g-dieta').value,
            alergias_detalle: document.getElementById('g-alergias').value.trim(),
            telefono: document.getElementById('g-telefono').value.trim(),
            email: document.getElementById('g-email').value.trim()
        };

        await window.weddingDB.saveInvitado(payload);
        listInvitados = await window.weddingDB.getInvitados();
        renderInvitadosTable();
        renderDashboard();
        document.getElementById('modal-guest').close();
        showToast('Invitado guardado exitosamente.', 'success');
    });

    // Formulario Presupuesto
    document.getElementById('form-presupuesto').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('p-id').value || undefined,
            categoria: document.getElementById('p-categoria').value,
            concepto: document.getElementById('p-concepto').value.trim(),
            costo_estimado: parseFloat(document.getElementById('p-costo-estimado').value) || 0,
            costo_real: parseFloat(document.getElementById('p-costo-real').value) || 0,
            monto_pagado: parseFloat(document.getElementById('p-monto-pagado').value) || 0,
            estado_pago: document.getElementById('p-estado-pago').value,
            fecha_limite_pago: document.getElementById('p-fecha-limite').value || null,
            proveedor_asociado: document.getElementById('p-proveedor').value.trim(),
            notas: document.getElementById('p-notas').value.trim()
        };

        await window.weddingDB.savePresupuesto(payload);
        listPresupuesto = await window.weddingDB.getPresupuesto();
        renderPresupuestoTable();
        renderDashboard();
        document.getElementById('modal-presupuesto').close();
        showToast('Registro de gasto guardado.', 'success');
    });

    // Formulario Cotización
    document.getElementById('form-cotizacion').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('c-id').value || undefined,
            proveedor: document.getElementById('c-proveedor').value.trim(),
            categoria: document.getElementById('c-categoria').value,
            monto_cotizado: parseFloat(document.getElementById('c-monto').value) || 0,
            estado: document.getElementById('c-estado').value,
            servicios_incluidos: document.getElementById('c-servicios').value.trim(),
            pros: document.getElementById('c-pros').value.trim(),
            contras: document.getElementById('c-contras').value.trim(),
            contacto_nombre: document.getElementById('c-contacto').value.trim(),
            telefono: document.getElementById('c-telefono').value.trim(),
            instagram_o_web: document.getElementById('c-web').value.trim()
        };

        await window.weddingDB.saveCotizacion(payload);
        listCotizaciones = await window.weddingDB.getCotizaciones();
        renderCotizacionesGrid();
        document.getElementById('modal-cotizacion').close();
        showToast('Cotización guardada exitosamente.', 'success');
    });

    // Formulario Actividad
    document.getElementById('form-actividad').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('a-id').value || undefined,
            titulo: document.getElementById('a-titulo').value.trim(),
            fase: document.getElementById('a-fase').value,
            fecha_limite: document.getElementById('a-fecha').value || null,
            responsable: document.getElementById('a-responsable').value,
            prioridad: document.getElementById('a-prioridad').value,
            notas: document.getElementById('a-notas').value.trim()
        };

        await window.weddingDB.saveActividad(payload);
        listActividades = await window.weddingDB.getActividades();
        renderActividadesTree();
        renderDashboard();
        document.getElementById('modal-actividad').close();
        showToast('Tarea guardada exitosamente.', 'success');
    });

    // Formulario Compra
    document.getElementById('form-compra').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('cmp-id').value || undefined,
            articulo: document.getElementById('cmp-articulo').value.trim(),
            categoria: document.getElementById('cmp-categoria').value.trim() || 'General',
            cantidad: parseInt(document.getElementById('cmp-cantidad').value) || 1,
            costo_estimado: parseFloat(document.getElementById('cmp-costo').value) || 0,
            responsable: document.getElementById('cmp-responsable').value,
            tienda_sugerida: document.getElementById('cmp-tienda').value.trim()
        };

        await window.weddingDB.saveCompra(payload);
        listCompras = await window.weddingDB.getCompras();
        renderComprasTable();
        document.getElementById('modal-compra').close();
        showToast('Artículo agregado a la lista de compras.', 'success');
    });

    // Formulario Itinerario
    document.getElementById('form-itinerario').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('it-id').value || undefined,
            hora: document.getElementById('it-hora').value.trim(),
            actividad: document.getElementById('it-actividad').value.trim(),
            lugar: document.getElementById('it-lugar').value.trim(),
            responsables: document.getElementById('it-responsables').value.trim(),
            detalles: document.getElementById('it-detalles').value.trim()
        };

        await window.weddingDB.saveItinerario(payload);
        listItinerario = await window.weddingDB.getItinerario();
        renderItinerarioTable();
        document.getElementById('modal-itinerario').close();
        showToast('Hito de itinerario guardado.', 'success');
    });

    // Paleta de Colores de la Web (Inputs en Tiempo Real)
    initThemeColorPickers();

    // Guardado Global de Configuración
    document.getElementById('form-config-boda').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSave = document.getElementById('btn-save-all-config');
        btnSave.innerHTML = 'Guardando cambios... ⏳';
        btnSave.disabled = true;

        const payload = {
            novia_nombre: document.getElementById('cfg-novia').value.trim(),
            novio_nombre: document.getElementById('cfg-novio').value.trim(),
            frase_amor: document.getElementById('cfg-frase').value.trim(),
            fecha_boda: document.getElementById('cfg-fecha').value,
            presupuesto_objetivo: parseFloat(document.getElementById('cfg-presupuesto').value) || 45000000,
            admin_pin: document.getElementById('cfg-admin-pin').value.trim() || '1234',
            album_habilitado_siempre: document.getElementById('cfg-album-habilitado-siempre').value === 'true',

            // Colores Web
            theme_primary_color: document.getElementById('cfg-color-primary').value,
            theme_accent_color: document.getElementById('cfg-color-accent').value,
            theme_bg_color: document.getElementById('cfg-color-bg').value,

            // Dress code
            dress_code: document.getElementById('cfg-dress-code').value.trim(),
            dress_code_colors: activeDressCodeColors,

            // Lugares
            lugar_ceremonia: document.getElementById('cfg-ceremonia-lugar').value.trim(),
            direccion_ceremonia: document.getElementById('cfg-ceremonia-dir').value.trim(),
            maps_ceremonia_url: document.getElementById('cfg-ceremonia-maps').value.trim(),
            lugar_recepcion: document.getElementById('cfg-recepcion-lugar').value.trim(),
            direccion_recepcion: document.getElementById('cfg-recepcion-dir').value.trim(),
            maps_recepcion_url: document.getElementById('cfg-recepcion-maps').value.trim(),

            // Imágenes y Ajuste
            image_fit_mode: document.getElementById('cfg-image-fit-mode').value,
            hero_image_url: document.getElementById('cfg-hero-img-url').value.trim(),
            ceremonia_image_url: document.getElementById('cfg-ceremonia-img-url').value.trim(),
            recepcion_image_url: document.getElementById('cfg-recepcion-img-url').value.trim(),

            // Galería
            galeria_fotos: activeGalleryPhotos,

            // Cuentas Bancarias
            frase_regalos: document.getElementById('cfg-frase-regalos').value.trim(),
            cuentas_bancarias: activeBankAccounts
        };

        weddingConfig = await window.weddingDB.saveConfig(payload);
        renderHeaderInfo();
        btnSave.innerHTML = '💾 Guardar Todos los Cambios 💍✨';
        btnSave.disabled = false;
        showToast('¡Toda la configuración y personalización ha sido guardada!', 'success');
    });

    // Carga de Archivos de Imagen Locales (Base64)
    setupFileInputPreview('file-upload-hero', 'cfg-hero-img-url', 'preview-hero-img');
    setupFileInputPreview('file-upload-ceremonia', 'cfg-ceremonia-img-url', 'preview-ceremonia-img');
    setupFileInputPreview('file-upload-recepcion', 'cfg-recepcion-img-url', 'preview-recepcion-img');
    setupFileInputPreview('file-upload-gal', 'gal-url', 'preview-gal-img');
    setupFileInputPreview('file-upload-mba-qr', 'mba-qr-url', 'preview-mba-qr');

    // Dress code color add
    document.getElementById('btn-add-dress-color').addEventListener('click', () => {
        const hex = document.getElementById('new-dress-color').value;
        const name = document.getElementById('new-dress-name').value.trim() || 'Color';
        activeDressCodeColors.push({ hex, name });
        renderDressCodeChips();
        document.getElementById('new-dress-name').value = '';
    });

    // Supabase Conexión
    document.getElementById('btn-save-supabase').addEventListener('click', async () => {
        const url = document.getElementById('sb-url').value.trim();
        const key = document.getElementById('sb-key').value.trim();
        const result = await window.weddingDB.configureSupabase(url, key);
        updateConnectionPill();
        showToast(result.message, result.success ? 'success' : 'error');
    });

    document.getElementById('btn-disconnect-supabase').addEventListener('click', async () => {
        await window.weddingDB.configureSupabase(null, null);
        document.getElementById('sb-url').value = '';
        document.getElementById('sb-key').value = '';
        updateConnectionPill();
        showToast('Modo Local activado.', 'success');
    });

    // Respaldos JSON & SQL
    document.getElementById('btn-export-backup-json').addEventListener('click', () => window.weddingDB.exportBackupJSON());
    document.getElementById('file-import-backup').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                await window.weddingDB.importBackupJSON(file);
                showToast('¡Copia de seguridad restaurada con éxito!', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } catch (err) {
                showToast('Error al importar copia: ' + err.message, 'error');
            }
        }
    });

    document.getElementById('btn-load-demo-data').addEventListener('click', () => {
        if (confirm('¿Restablecer el sistema a los datos de ejemplo iniciales?')) {
            window.weddingDB.resetToDemoData();
            showToast('Datos de ejemplo cargados.', 'success');
            setTimeout(() => window.location.reload(), 800);
        }
    });

    document.getElementById('btn-copy-sql-schema').addEventListener('click', () => {
        const sqlSchema = `-- Ejecuta este script en el SQL Editor de Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.boda_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    novia_nombre TEXT NOT NULL DEFAULT 'Valentina',
    novio_nombre TEXT NOT NULL DEFAULT 'Sebastián',
    frase_amor TEXT,
    fecha_boda TIMESTAMP WITH TIME ZONE NOT NULL,
    lugar_ceremonia TEXT, lugar_recepcion TEXT,
    direccion_ceremonia TEXT, direccion_recepcion TEXT,
    maps_ceremonia_url TEXT, maps_recepcion_url TEXT,
    dress_code TEXT, presupuesto_objetivo NUMERIC(12,2),
    frase_regalos TEXT, cuentas_bancarias JSONB,
    theme_primary_color TEXT DEFAULT '#0F4C3A',
    theme_accent_color TEXT DEFAULT '#D4AF37',
    theme_bg_color TEXT DEFAULT '#F6F9F7',
    dress_code_colors JSONB,
    hero_image_url TEXT, ceremonia_image_url TEXT, recepcion_image_url TEXT, image_fit_mode TEXT,
    galeria_fotos JSONB,
    album_habilitado_siempre BOOLEAN DEFAULT FALSE,
    album_pausado BOOLEAN DEFAULT FALSE,
    descarga_publica_habilitada BOOLEAN DEFAULT FALSE,
    admin_pin TEXT DEFAULT '1234',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.album_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_nombre TEXT NOT NULL,
    foto_url TEXT NOT NULL,
    pie_de_foto TEXT,
    aprobada BOOLEAN DEFAULT TRUE,
    descarga_permitida BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.album_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_nombre TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.boda_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_chat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public boda_config" ON public.boda_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public album_fotos" ON public.album_fotos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public album_chat" ON public.album_chat FOR ALL USING (true) WITH CHECK (true);`;

        navigator.clipboard.writeText(sqlSchema).then(() => {
            showToast('¡Script SQL copiado al portapapeles! Pégalo en el SQL Editor de Supabase.', 'success');
        });
    });
}

function initThemeColorPickers() {
    const pPicker = document.getElementById('cfg-color-primary');
    const pText = document.getElementById('cfg-color-primary-text');
    const aPicker = document.getElementById('cfg-color-accent');
    const aText = document.getElementById('cfg-color-accent-text');
    const bgPicker = document.getElementById('cfg-color-bg');
    const bgText = document.getElementById('cfg-color-bg-text');

    function syncPrimary(val) {
        pPicker.value = val;
        pText.value = val;
        weddingConfig.theme_primary_color = val;
        window.applyWeddingTheme(weddingConfig);
    }
    function syncAccent(val) {
        aPicker.value = val;
        aText.value = val;
        weddingConfig.theme_accent_color = val;
        window.applyWeddingTheme(weddingConfig);
    }
    function syncBg(val) {
        bgPicker.value = val;
        bgText.value = val;
        weddingConfig.theme_bg_color = val;
        window.applyWeddingTheme(weddingConfig);
    }

    pPicker.addEventListener('input', (e) => syncPrimary(e.target.value));
    pText.addEventListener('change', (e) => syncPrimary(e.target.value));
    aPicker.addEventListener('input', (e) => syncAccent(e.target.value));
    aText.addEventListener('change', (e) => syncAccent(e.target.value));
    bgPicker.addEventListener('input', (e) => syncBg(e.target.value));
    bgText.addEventListener('change', (e) => syncBg(e.target.value));
}

function setupFileInputPreview(inputId, textUrlId, previewBoxId) {
    const input = document.getElementById(inputId);
    const textUrl = document.getElementById(textUrlId);
    const previewBox = document.getElementById(previewBoxId);

    if (input) {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    textUrl.value = base64;
                    updateImagePreview(previewBoxId, base64);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (textUrl) {
        textUrl.addEventListener('input', (e) => {
            updateImagePreview(previewBoxId, e.target.value);
        });
    }
}

function updateImagePreview(previewBoxId, url) {
    const box = document.getElementById(previewBoxId);
    if (!box) return;
    if (url && url.trim()) {
        box.style.backgroundImage = `url('${url}')`;
        box.textContent = '';
    } else {
        box.style.backgroundImage = 'none';
        box.textContent = 'Sin imagen';
    }
}

function updateConnectionPill() {
    const pill = document.getElementById('btn-status-pill');
    const text = document.getElementById('connection-status-text');

    if (window.weddingDB.isOnlineSupabase) {
        pill.className = 'connection-pill online';
        text.textContent = 'Supabase Conectado';
    } else {
        pill.className = 'connection-pill local';
        text.textContent = 'Modo Local';
    }
}

// =============================================================================
// UTILIDADES
// =============================================================================

function formatCurrency(amount) {
    return '$ ' + Number(amount || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
