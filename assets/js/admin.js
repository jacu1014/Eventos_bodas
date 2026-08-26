/**
 * ==============================================================================
 * BODA DIGITAL - LÓGICA DEL PANEL ADMINISTRATIVO (ADMIN.JS) 💍✨
 * Versión 4.2:
 * - Autenticación con Google OAuth, Registro y Recuperación de Contraseña
 * - Generador de Invitaciones de WhatsApp (Individuales y Grupales sin API)
 * - Navegación 100% responsive en móviles
 * ==============================================================================
 */

function adminApp() {
    return {
        authenticated: false,
        user: null,
        currentView: 'dashboard',
        mobileSidebarOpen: false,
        
        // Autenticación & Pestañas de Acceso
        authMode: 'login', // 'login' | 'register' | 'forgot'
        loginData: { email: '', password: '', nombreNovia: 'Valentina', nombreNovio: 'Sebastián' },
        loginError: null,
        loginLoading: false,
        
        // Datos principales
        config: null,
        invitados: [],
        mesas: [],
        finanzas: [],
        proveedores: [],
        tareas: [],
        fotos: [],
        deseos: [],
        canciones: [],
        
        // Estadísticas
        stats: {
            totalInvitados: 0,
            confirmados: 0,
            pendientes: 0,
            noAsistiran: 0,
            totalFotos: 0,
            porcentajeConfirmados: 0,
            porcentajeTareas: 0,
            totalMesas: 0,
            totalPresupuesto: 0,
            totalGastos: 0,
            saldo: 0,
            tareasCompletadas: 0,
            totalTareas: 0,
        },
        
        // Gráficos
        chartInvitados: null,
        chartPresupuesto: null,
        
        // UI & Modales
        loading: false,
        error: null,
        success: false,
        successMessage: '',
        
        // Invitados State
        showAddInvitado: false,
        editingInvitado: { id: null, nombre: '', grupo: 'General', email: '', telefono: '', asistira: null, mesa: '', acompanantes: 0, pases_adultos: 1, pases_ninos: 0, menu: 'Tradicional', dietas: '', notas: '', slug: '', invitacion_enviada: false },
        invitadoSearch: '',
        invitadoFilterAsistencia: 'all',
        invitadoFilterMesa: '',
        invitadoFilterEnvio: 'all', // 'all' | 'enviados' | 'pendientes'
        draggedInvitado: null,
        
        // WhatsApp Sender Modal State (Individual & Grupal)
        showWhatsAppModal: false,
        whatsAppData: {
            modo: 'individual', // 'individual' | 'grupal'
            invitadoSeleccionado: null,
            grupoSeleccionado: '',
            telefonoManual: '',
            plantilla: 'emocional', // 'emocional' | 'formal' | 'recordatorio' | 'urgente'
            mensajeGenerado: '',
            enlaceGenerado: ''
        },
        
        // Mesas State
        showAddMesa: false,
        editingMesa: { id: null, nombre: '', capacidad: 8, ubicacion: '' },
        mesaViewMode: 'grid',
        dragMesaState: null,
        
        // Finanzas State
        showAddFinanza: false,
        editingFinanza: { id: null, concepto: '', categoria: 'Lugar y Salón', monto: '', tipo: 'gasto', fecha: '', pagado: 0, estado_pago: 'Pendiente' },
        finanzaFilterCategoria: 'all',
        
        // Proveedores State
        showAddProveedor: false,
        editingProveedor: { id: null, nombre: '', categoria: 'Lugar y Salón', monto: '', servicios_incluidos: '', contacto_nombre: '', telefono: '', email: '', pros: '', contras: '', estado: 'en evaluación' },
        proveedorFilterCategoria: 'all',
        
        // Tareas State
        showAddTarea: false,
        editingTarea: { id: null, titulo: '', fase: '12 a 9 Meses Antes', prioridad: 'media', responsable: 'Ambos', fecha_limite: '', completada: false },
        tareaFilterFase: 'all',
        
        // Personalización State
        personalization: {
            novia_nombre: 'Valentina',
            novio_nombre: 'Sebastián',
            color_principal: '#0F4C3A',
            color_secundario: '#D4AF37',
            theme_primary_color: '#0F4C3A',
            theme_accent_color: '#D4AF37',
            theme_bg_color: '#F6F9F7',
            fuente_titulos: 'serif',
            fuente_textos: 'sans-serif',
            fondo: '',
            hero_image_url: '',
            ceremonia_image_url: '',
            recepcion_image_url: '',
            frase_amor: '',
            frase_regalos: '',
            dresscode: 'Formal / Etiqueta Rigurosa',
            fecha_boda: '2026-10-24T16:00:00',
            lugar_ceremonia: '',
            lugar_recepcion: '',
            direccion_ceremonia: '',
            direccion_recepcion: '',
            maps_ceremonia_url: '',
            maps_recepcion_url: '',
            album_pausado: false,
            descarga_publica_habilitada: false,
            album_habilitado_siempre: false,
            cuentas_bancarias: [],
            dress_code_colors: [],
            galeria_fotos: []
        },
        
        // Múltiples Cuentas Bancarias State
        showAddCuenta: false,
        editingCuenta: { id: null, banco_nombre: 'Bancolombia', banco_tipo_cuenta: 'Cuenta de Ahorros', banco_numero_cuenta: '', banco_titular: '', banco_documento: '', banco_llave_breb: '', qr_banco_url: '' },
        
        // Dress Code Color State
        newDressColor: { name: '', hex: '#0F4C3A' },
        
        // Galería de los Novios State
        showAddGaleriaFoto: false,
        editingGaleriaFoto: { url: '', titulo: '', descripcion: '' },

        async init() {
            try {
                await this.checkSession();
                if (this.authenticated) {
                    await this.loadAllData();
                }
                console.log('✅ Admin panel initialized');
            } catch (error) {
                console.error('Error initializing admin:', error);
            }
        },
        
        async checkSession() {
            try {
                const { data } = await supabaseClient.getSession();
                if (data?.session) {
                    this.authenticated = true;
                    this.user = data.session.user || { email: 'admin@boda.com' };
                } else {
                    const local = localStorage.getItem('boda_digital_session_user');
                    if (local) {
                        this.authenticated = true;
                        this.user = JSON.parse(local);
                    }
                }
            } catch (error) {
                this.authenticated = false;
            }
        },
        
        // ==================== AUTH METHODS ====================
        async login() {
            this.loginLoading = true;
            this.loginError = null;
            try {
                if (!this.loginData.email || !this.loginData.password) {
                    throw new Error('Por favor ingresa email y contraseña');
                }
                
                const { data, error } = await supabaseClient.signIn(this.loginData.email, this.loginData.password);
                if (error) throw new Error(error);
                
                this.authenticated = true;
                this.user = data?.user || { email: this.loginData.email };
                this.loginData.password = '';
                await this.loadAllData();
                this.triggerSuccess('¡Bienvenido al Panel de los Novios! 💍✨');
            } catch (error) {
                this.loginError = error.message || 'Error al iniciar sesión';
            } finally {
                this.loginLoading = false;
            }
        },
        
        async registerUser() {
            this.loginLoading = true;
            this.loginError = null;
            try {
                if (!this.loginData.email || !this.loginData.password) {
                    throw new Error('Por favor ingresa email y una contraseña segura');
                }
                
                const metadata = {
                    novia_nombre: this.loginData.nombreNovia || 'Valentina',
                    novio_nombre: this.loginData.nombreNovio || 'Sebastián',
                    novios: `${this.loginData.nombreNovia || 'Valentina'} & ${this.loginData.nombreNovio || 'Sebastián'}`
                };
                
                const { data, error } = await supabaseClient.signUp(this.loginData.email, this.loginData.password, metadata);
                if (error) throw new Error(error);
                
                this.authenticated = true;
                this.user = data?.user || { email: this.loginData.email, user_metadata: metadata };
                
                // Actualizar config con los nombres
                await supabaseClient.updateConfiguracion({
                    novia_nombre: metadata.novia_nombre,
                    novio_nombre: metadata.novio_nombre,
                    novios: metadata.novios
                });
                
                await this.loadAllData();
                this.triggerSuccess('¡Cuenta creada y registrada exitosamente en Supabase! 💍✨');
            } catch (error) {
                this.loginError = error.message || 'Error al registrar usuario';
            } finally {
                this.loginLoading = false;
            }
        },
        
        async loginWithGoogle() {
            this.loginLoading = true;
            this.loginError = null;
            try {
                const { data, error } = await supabaseClient.signInWithGoogle();
                if (error) throw new Error(error);
                if (data?.user) {
                    this.authenticated = true;
                    this.user = data.user;
                    await this.loadAllData();
                    this.triggerSuccess('¡Acceso concedido con Google! 🌐');
                }
            } catch (error) {
                this.loginError = error.message || 'Error en autenticación con Google';
            } finally {
                this.loginLoading = false;
            }
        },
        
        async requestPasswordReset() {
            if (!this.loginData.email) {
                this.loginError = 'Por favor ingresa tu email para enviarte el enlace de recuperación';
                return;
            }
            this.loginLoading = true;
            try {
                await supabaseClient.resetPassword(this.loginData.email);
                alert(`Hemos enviado instrucciones de restablecimiento a ${this.loginData.email}. Revisa tu bandeja de entrada.`);
                this.authMode = 'login';
            } catch (error) {
                this.loginError = error.message || 'Error al solicitar restablecimiento';
            } finally {
                this.loginLoading = false;
            }
        },
        
        async logout() {
            await supabaseClient.signOut();
            this.authenticated = false;
            this.user = null;
            this.mobileSidebarOpen = false;
        },
        
        async loadAllData() {
            this.loading = true;
            try {
                await Promise.all([
                    this.loadConfig(),
                    this.loadInvitados(),
                    this.loadMesas(),
                    this.loadFinanzas(),
                    this.loadProveedores(),
                    this.loadTareas(),
                    this.loadFotos(),
                    this.loadDeseos(),
                    this.loadCanciones()
                ]);
                this.loadMesaPositions();
                await this.loadStats();
                this.initCharts();
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async loadConfig() {
            const { data } = await supabaseClient.getConfiguracion();
            if (data) {
                this.config = data;
                this.personalization = {
                    ...this.personalization,
                    ...data,
                    cuentas_bancarias: data.cuentas_bancarias || [],
                    dress_code_colors: data.dress_code_colors || [],
                    galeria_fotos: data.galeria_fotos || []
                };
                this.applyThemeToDOM();
            }
        },
        
        async loadInvitados() {
            const { data } = await supabaseClient.getInvitados();
            this.invitados = data || [];
        },
        
        async loadMesas() {
            const { data } = await supabaseClient.getMesas();
            this.mesas = data || [];
        },
        
        async loadFinanzas() {
            const { data } = await supabaseClient.getFinanzas();
            this.finanzas = data || [];
        },
        
        async loadProveedores() {
            const { data } = await supabaseClient.getProveedores();
            this.proveedores = data || [];
        },
        
        async loadTareas() {
            const { data } = await supabaseClient.getTareas();
            this.tareas = data || [];
        },
        
        async loadFotos() {
            const { data } = await supabaseClient.getFotos(100, false);
            this.fotos = data || [];
        },
        
        async loadDeseos() {
            const { data } = await supabaseClient.getDeseos();
            this.deseos = data || [];
        },
        
        async loadCanciones() {
            const { data } = await supabaseClient.getCanciones();
            this.canciones = data || [];
        },
        
        async loadStats() {
            const { data } = await supabaseClient.getStats();
            if (data) this.stats = data;
        },
        
        // ==================== INVITADOS ====================
        filteredInvitados() {
            return this.invitados.filter(i => {
                const term = (this.invitadoSearch || '').toLowerCase();
                const matchesSearch = (i.nombre || '').toLowerCase().includes(term) ||
                                      (i.grupo || '').toLowerCase().includes(term) ||
                                      (i.email || '').toLowerCase().includes(term) ||
                                      (i.telefono || '').toLowerCase().includes(term) ||
                                      (i.mesa || '').toLowerCase().includes(term);
                
                let matchesStatus = true;
                if (this.invitadoFilterAsistencia === 'confirmados') matchesStatus = (i.asistira === true);
                if (this.invitadoFilterAsistencia === 'pendientes') matchesStatus = (i.asistira === null || i.asistira === undefined);
                if (this.invitadoFilterAsistencia === 'no_asistiran') matchesStatus = (i.asistira === false);
                
                let matchesMesa = true;
                if (this.invitadoFilterMesa) {
                    if (this.invitadoFilterMesa === 'sin_mesa') matchesMesa = (!i.mesa || i.mesa === 'Sin asignar');
                    else matchesMesa = (i.mesa === this.invitadoFilterMesa);
                }
                
                let matchesEnvio = true;
                if (this.invitadoFilterEnvio === 'enviados') matchesEnvio = (i.invitacion_enviada === true);
                if (this.invitadoFilterEnvio === 'pendientes') matchesEnvio = (i.invitacion_enviada !== true);
                
                return matchesSearch && matchesStatus && matchesMesa && matchesEnvio;
            });
        },
        
        getGruposUnicos() {
            const groups = new Set();
            this.invitados.forEach(i => {
                if (i.grupo && i.grupo.trim()) groups.add(i.grupo.trim());
            });
            return Array.from(groups);
        },
        
        openAddInvitado() {
            this.editingInvitado = { id: null, nombre: '', grupo: 'Familia', email: '', telefono: '', asistira: null, mesa: 'Sin asignar', acompanantes: 0, pases_adultos: 1, pases_ninos: 0, menu: 'Tradicional', dietas: '', notas: '', slug: '', invitacion_enviada: false };
            this.showAddInvitado = true;
        },
        
        editInvitado(invitado) {
            this.editingInvitado = { ...invitado };
            this.showAddInvitado = true;
        },
        
        async saveInvitado() {
            if (!this.editingInvitado.nombre) {
                alert('Por favor ingresa el nombre del invitado o familia');
                return;
            }
            
            if (!this.editingInvitado.slug) {
                this.editingInvitado.slug = this.editingInvitado.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            
            this.loading = true;
            try {
                if (this.editingInvitado.id) {
                    await supabaseClient.updateInvitado(this.editingInvitado.id, this.editingInvitado);
                } else {
                    await supabaseClient.addInvitado(this.editingInvitado);
                }
                await this.loadInvitados();
                await this.loadStats();
                this.showAddInvitado = false;
                this.triggerSuccess('Invitado guardado exitosamente');
            } catch (e) {
                alert('Error al guardar invitado: ' + e.message);
            } finally {
                this.loading = false;
            }
        },
        
        async deleteInvitado(id) {
            if (!confirm('¿Estás seguro de eliminar este invitado?')) return;
            await supabaseClient.deleteInvitado(id);
            await this.loadInvitados();
            await this.loadStats();
            this.triggerSuccess('Invitado eliminado');
        },
        
        // ==================== GENERADOR DE WHATSAPP (INDIVIDUAL Y GRUPAL SIN API) ====================
        openWhatsAppModal(invitado = null, grupo = null) {
            this.whatsAppData.invitadoSeleccionado = invitado;
            this.whatsAppData.grupoSeleccionado = grupo || (invitado ? invitado.grupo : '');
            this.whatsAppData.modo = grupo && !invitado ? 'grupal' : 'individual';
            this.whatsAppData.telefonoManual = invitado ? (invitado.telefono || '') : '';
            this.updateWhatsAppMessage();
            this.showWhatsAppModal = true;
        },
        
        updateWhatsAppMessage() {
            const novia = this.config?.novia_nombre || 'Valentina';
            const novio = this.config?.novio_nombre || 'Sebastián';
            const novios = `${novia} & ${novio}`;
            const fechaStr = this.config?.fecha_boda ? new Date(this.config.fecha_boda).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '24 de Octubre de 2026';
            const baseUrl = window.location.origin;
            
            let nombre = 'Estimado Invitado';
            let pases = 1;
            let slug = '';
            let phone = this.whatsAppData.telefonoManual;
            
            if (this.whatsAppData.modo === 'individual' && this.whatsAppData.invitadoSeleccionado) {
                const inv = this.whatsAppData.invitadoSeleccionado;
                nombre = inv.nombre;
                pases = (inv.pases_adultos || 1) + (inv.pases_ninos || 0);
                // Generate slug if not exists
                if (!inv.slug) {
                    inv.slug = inv.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    // Save slug immediately
                    if (typeof supabaseClient !== 'undefined' && supabaseClient.isReady()) {
                        supabaseClient.updateInvitado(inv.id, { slug: inv.slug });
                    }
                }
                slug = inv.slug;
                phone = phone || inv.telefono;
            } else if (this.whatsAppData.modo === 'grupal' && this.whatsAppData.grupoSeleccionado) {
                nombre = this.whatsAppData.grupoSeleccionado;
                const members = this.invitados.filter(i => i.grupo === this.whatsAppData.grupoSeleccionado);
                pases = members.reduce((acc, curr) => acc + (curr.pases_adultos || 1) + (curr.pases_ninos || 0), 0);
                // Generate group slug from first member
                const firstMember = members[0];
                if (firstMember) {
                    if (!firstMember.slug) {
                        firstMember.slug = firstMember.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        if (typeof supabaseClient !== 'undefined' && supabaseClient.isReady()) {
                            supabaseClient.updateInvitado(firstMember.id, { slug: firstMember.slug });
                        }
                    }
                    slug = firstMember.slug;
                    phone = phone || firstMember.telefono;
                }
            }
            
            // Build the invitation link with multiple query parameters for better compatibility
            const link = slug ? `${baseUrl}/?slug=${encodeURIComponent(slug)}&invitado=${encodeURIComponent(slug)}` : baseUrl;
            this.whatsAppData.enlaceGenerado = link;
            
            let text = '';
            if (this.whatsAppData.plantilla === 'emocional') {
                text = `💍✨ ¡Hola ${nombre}!\n\nCon inmensa alegría en nuestros corazones queremos invitarte a celebrar nuestra boda (${novios}).\n\n📅 Fecha: ${fechaStr}\n🎟️ Pases reservados: ${pases} persona(s)\n\nEntra a tu invitación interactiva personalizada y confirma tu asistencia aquí:\n👉 ${link}\n\n¡Esperamos contar con tu presencia para brindar juntos! 🥂🕊️`;
            } else if (this.whatsAppData.plantilla === 'formal') {
                text = `✉️ Invitación Oficial de Matrimonio\n\nEstimado(a) ${nombre},\n\nTenemos el agrado de invitarle a la celebración de nuestro matrimonio (${novios}), que se llevará a cabo el día ${fechaStr}.\n\nPara conocer los detalles del evento, código de vestimenta y confirmar su asistencia (${pases} cupos asignados), por favor ingrese a su tarjeta digital:\n🔗 ${link}\n\nCordialmente,\n${novia} & ${novio}`;
            } else if (this.whatsAppData.plantilla === 'recordatorio') {
                text = `🥂 ¡Hola ${nombre}! Recordatorio de Boda (${novios})\n\nEsperamos que estés teniendo una excelente semana. Te recordamos que la fecha límite para confirmar tu asistencia a nuestro gran día se acerca.\n\nPor favor ingresa a tu enlace personal para confirmar tus ${pases} cupo(s) y seleccionar tu menú:\n👉 ${link}\n\n¡Un abrazo enorme! ✨`;
            } else if (this.whatsAppData.plantilla === 'urgente') {
                text = `⏰ ¡Últimos días para confirmar! Boda ${novios}\n\nHola ${nombre}, estamos ultimando los detalles del banquete y la asignación de mesas. Por favor confirma hoy mismo en tu enlace si nos podrás acompañar:\n👉 ${link}\n\n¡Muchas gracias! ❤️`;
            }
            
            this.whatsAppData.mensajeGenerado = text;
        },
        
        async sendWhatsAppDirect() {
            const cleanPhone = (this.whatsAppData.telefonoManual || '').replace(/\D/g, '');
            const encoded = encodeURIComponent(this.whatsAppData.mensajeGenerado);
            
            // Marcar como enviado si es individual
            if (this.whatsAppData.invitadoSeleccionado) {
                await supabaseClient.updateInvitado(this.whatsAppData.invitadoSeleccionado.id, { invitacion_enviada: true });
                await this.loadInvitados();
            } else if (this.whatsAppData.grupoSeleccionado) {
                const members = this.invitados.filter(i => i.grupo === this.whatsAppData.grupoSeleccionado);
                for (const m of members) {
                    await supabaseClient.updateInvitado(m.id, { invitacion_enviada: true });
                }
                await this.loadInvitados();
            }
            
            let url = `https://api.whatsapp.com/send?text=${encoded}`;
            if (cleanPhone) {
                url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
            }
            
            window.open(url, '_blank');
            this.showWhatsAppModal = false;
            this.triggerSuccess('¡Invitación marcada como enviada y abierta en WhatsApp! 📲');
        },
        
        copyWhatsAppMessage() {
            navigator.clipboard.writeText(this.whatsAppData.mensajeGenerado);
            this.triggerSuccess('Mensaje de WhatsApp copiado al portapapeles 📋');
        },
        
        copyInvitationLink() {
            navigator.clipboard.writeText(this.whatsAppData.enlaceGenerado);
            this.triggerSuccess('Enlace exclusivo de invitación copiado 🔗');
        },
        
        exportCSV() {
            const data = this.filteredInvitados();
            if (data.length === 0) return alert('No hay datos para exportar');
            
            const headers = ['Nombre', 'Grupo', 'Email', 'Telefono', 'Asistencia', 'Mesa', 'Pases', 'Menu', 'Enviado'];
            const rows = data.map(i => [
                `"${i.nombre}"`,
                `"${i.grupo || 'General'}"`,
                `"${i.email || ''}"`,
                `"${i.telefono || ''}"`,
                `"${i.asistira === true ? 'Confirmado' : (i.asistira === false ? 'Declinado' : 'Pendiente')}"`,
                `"${i.mesa || 'Sin asignar'}"`,
                (i.pases_adultos || 1) + (i.pases_ninos || 0),
                `"${i.menu || 'Tradicional'}"`,
                `"${i.invitacion_enviada ? 'Sí' : 'No'}"`
            ]);
            
            const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `invitados_boda_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        },
        
        exportPDF() {
            window.print();
        },
        
        // ==================== MESAS & DRAG AND DROP ====================
        openAddMesa() {
            this.editingMesa = { id: null, nombre: `Mesa ${this.mesas.length + 1}`, capacidad: 8, ubicacion: 'Zona Central' };
            this.showAddMesa = true;
        },
        
        editMesa(mesa) {
            this.editingMesa = { ...mesa };
            this.showAddMesa = true;
        },
        
        async saveMesa() {
            if (!this.editingMesa.nombre) return alert('Ingresa el nombre de la mesa');
            if (this.editingMesa.id) {
                await supabaseClient.updateMesa(this.editingMesa.id, this.editingMesa);
            } else {
                await supabaseClient.addMesa(this.editingMesa);
            }
            await this.loadMesas();
            await this.loadStats();
            this.showAddMesa = false;
            this.triggerSuccess('Mesa guardada');
        },
        
        async deleteMesa(id) {
            if (!confirm('¿Eliminar esta mesa? Los invitados asignados quedarán sin mesa.')) return;
            const mesa = this.mesas.find(m => m.id === id);
            if (mesa) {
                const toUpdate = this.invitados.filter(i => i.mesa === mesa.nombre);
                for (const inv of toUpdate) {
                    await supabaseClient.updateInvitado(inv.id, { mesa: 'Sin asignar' });
                }
            }
            await supabaseClient.deleteMesa(id);
            await this.loadMesas();
            await this.loadInvitados();
            await this.loadStats();
            this.triggerSuccess('Mesa eliminada');
        },
        
        startDragInvitado(event, invitado) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'invitado', id: invitado.id }));
            this.draggedInvitado = invitado;
        },
        
        async dropOnMesa(event, mesa) {
            event.preventDefault();
            try {
                const data = JSON.parse(event.dataTransfer.getData('text/plain'));
                if (data.type === 'invitado') {
                    const invitado = this.invitados.find(i => i.id === data.id);
                    if (!invitado) return;
                    
                    const currentCount = this.invitados.filter(i => i.mesa === mesa.nombre).length;
                    if (currentCount >= mesa.capacidad) {
                        alert(`La ${mesa.nombre} está completa (${mesa.capacidad} personas).`);
                        return;
                    }
                    
                    await supabaseClient.updateInvitado(invitado.id, { mesa: mesa.nombre });
                    await this.loadInvitados();
                    this.triggerSuccess(`${invitado.nombre} asignado a ${mesa.nombre}`);
                }
            } catch (e) {
                console.error('Drop error:', e);
            } finally {
                this.draggedInvitado = null;
            }
        },
        
        // ==================== FINANZAS ====================
        openAddFinanza() {
            this.editingFinanza = { id: null, concepto: '', categoria: 'Lugar y Salón', monto: '', tipo: 'gasto', fecha: new Date().toISOString().split('T')[0], pagado: 0, estado_pago: 'Pendiente' };
            this.showAddFinanza = true;
        },
        
        async saveFinanza() {
            if (!this.editingFinanza.concepto || !this.editingFinanza.monto) {
                return alert('Por favor ingresa concepto y monto');
            }
            
            this.loading = true;
            try {
                if (this.editingFinanza.id) {
                    await supabaseClient.updateFinanza(this.editingFinanza.id, this.editingFinanza);
                } else {
                    await supabaseClient.addFinanza(this.editingFinanza);
                }
                await this.loadFinanzas();
                await this.loadStats();
                this.initCharts();
                this.showAddFinanza = false;
                this.triggerSuccess('Movimiento financiero guardado');
            } catch (e) {
                alert('Error al guardar finanza: ' + e.message);
            } finally {
                this.loading = false;
            }
        },
        
        async deleteFinanza(id) {
            if (!confirm('¿Eliminar este registro financiero?')) return;
            await supabaseClient.deleteFinanza(id);
            await this.loadFinanzas();
            await this.loadStats();
            this.initCharts();
            this.triggerSuccess('Registro eliminado');
        },
        
        // ==================== PROVEEDORES ====================
        openAddProveedor() {
            this.editingProveedor = { id: null, nombre: '', categoria: 'Lugar y Salón', monto: '', servicios_incluidos: '', contacto_nombre: '', telefono: '', email: '', pros: '', contras: '', estado: 'en evaluación' };
            this.showAddProveedor = true;
        },
        
        async saveProveedor() {
            if (!this.editingProveedor.nombre) return alert('Ingresa el nombre del proveedor');
            this.loading = true;
            try {
                if (this.editingProveedor.id) {
                    await supabaseClient.updateProveedor(this.editingProveedor.id, this.editingProveedor);
                } else {
                    await supabaseClient.addProveedor(this.editingProveedor);
                }
                await this.loadProveedores();
                this.showAddProveedor = false;
                this.triggerSuccess('Proveedor guardado con éxito');
            } catch (e) {
                alert('Error al guardar proveedor: ' + e.message);
            } finally {
                this.loading = false;
            }
        },
        
        async deleteProveedor(id) {
            if (!confirm('¿Eliminar este proveedor?')) return;
            await supabaseClient.deleteProveedor(id);
            await this.loadProveedores();
            this.triggerSuccess('Proveedor eliminado');
        },
        
        async transferProveedor(id) {
            if (!confirm('¿Deseas contratar este proveedor y agregar el gasto automáticamente al Presupuesto?')) return;
            await supabaseClient.transferProveedorToPresupuesto(id);
            await this.loadProveedores();
            await this.loadFinanzas();
            await this.loadStats();
            this.initCharts();
            this.triggerSuccess('¡Proveedor contratado y transferido al Presupuesto Oficial!');
        },
        
        // ==================== TAREAS ====================
        openAddTarea() {
            this.editingTarea = { id: null, titulo: '', fase: '12 a 9 Meses Antes', prioridad: 'media', responsable: 'Ambos', fecha_limite: '', completada: false };
            this.showAddTarea = true;
        },
        
        async saveTarea() {
            if (!this.editingTarea.titulo) return alert('Ingresa el título de la tarea');
            this.loading = true;
            try {
                if (this.editingTarea.id) {
                    await supabaseClient.updateTarea(this.editingTarea.id, this.editingTarea);
                } else {
                    await supabaseClient.addTarea(this.editingTarea);
                }
                await this.loadTareas();
                await this.loadStats();
                this.showAddTarea = false;
                this.triggerSuccess('Tarea guardada');
            } catch (e) {
                alert('Error al guardar tarea: ' + e.message);
            } finally {
                this.loading = false;
            }
        },
        
        async toggleTarea(tarea) {
            await supabaseClient.toggleTarea(tarea);
            await this.loadTareas();
            await this.loadStats();
        },
        
        async deleteTarea(id) {
            if (!confirm('¿Eliminar esta tarea?')) return;
            await supabaseClient.deleteTarea(id);
            await this.loadTareas();
            await this.loadStats();
            this.triggerSuccess('Tarea eliminada');
        },
        
        // ==================== ÁLBUM & MODERACIÓN ====================
        async toggleAprobarFoto(foto) {
            await supabaseClient.toggleAprobarFoto(foto.id);
            await this.loadFotos();
            this.triggerSuccess(foto.aprobada ? 'Foto ocultada del álbum' : 'Foto aprobada y visible');
        },
        
        async deleteFoto(id) {
            if (!confirm('¿Eliminar esta foto permanentemente?')) return;
            await supabaseClient.deleteFoto(id);
            await this.loadFotos();
            this.triggerSuccess('Foto eliminada');
        },
        
        async togglePauseAlbum() {
            const current = this.personalization.album_pausado;
            this.personalization.album_pausado = !current;
            await supabaseClient.updateConfiguracion({ album_pausado: !current });
            this.triggerSuccess(!current ? '⏸️ Álbum pausado temporalmente' : '▶️ Álbum reanudado');
        },
        
        async togglePublicDownload() {
            const current = this.personalization.descarga_publica_habilitada;
            this.personalization.descarga_publica_habilitada = !current;
            await supabaseClient.updateConfiguracion({ descarga_publica_habilitada: !current });
            this.triggerSuccess(!current ? '🔓 Descarga pública autorizada para invitados' : '🔒 Descarga pública ocultada');
        },
        
        openPrintableAlbum() {
            supabaseClient.generatePrintableAlbumWindow();
        },
        
        // ==================== DESEOS & CANCIONES ====================
        async deleteDeseo(id) {
            if (!confirm('¿Eliminar este deseo del muro?')) return;
            await supabaseClient.deleteDeseo(id);
            await this.loadDeseos();
            this.triggerSuccess('Deseo eliminado');
        },
        
        async deleteCancion(id) {
            if (!confirm('¿Eliminar esta sugerencia de canción?')) return;
            await supabaseClient.deleteCancion(id);
            await this.loadCanciones();
            this.triggerSuccess('Canción eliminada');
        },
        
        // ==================== PERSONALIZACIÓN & CUENTAS BANCARIAS ====================
        applyThemePreset(presetKey) {
            const preset = THEME_PRESETS[presetKey];
            if (!preset) return;
            this.personalization.theme_palette_preset = presetKey;
            this.personalization.color_principal = preset.primary;
            this.personalization.color_secundario = preset.accent;
            this.personalization.theme_primary_color = preset.primary;
            this.personalization.theme_accent_color = preset.accent;
            this.personalization.theme_bg_color = preset.bg;
            this.applyThemeToDOM();
            this.triggerSuccess(`Paleta aplicada: ${preset.name}`);
        },
        
        applyThemeToDOM() {
            const primary = this.personalization.color_principal || '#0F4C3A';
            const accent = this.personalization.color_secundario || '#D4AF37';
            document.documentElement.style.setProperty('--color-primary', primary);
            document.documentElement.style.setProperty('--color-accent', accent);
        },
        
        openAddCuenta() {
            this.editingCuenta = { id: null, banco_nombre: 'Bancolombia', banco_tipo_cuenta: 'Cuenta de Ahorros', banco_numero_cuenta: '', banco_titular: '', banco_documento: '', banco_llave_breb: '', qr_banco_url: '' };
            this.showAddCuenta = true;
        },
        
        saveCuenta() {
            if (!this.editingCuenta.banco_numero_cuenta || !this.editingCuenta.banco_titular) {
                return alert('Por favor ingresa número de cuenta y titular');
            }
            if (this.editingCuenta.id) {
                const idx = this.personalization.cuentas_bancarias.findIndex(c => c.id === this.editingCuenta.id);
                if (idx !== -1) this.personalization.cuentas_bancarias[idx] = { ...this.editingCuenta };
            } else {
                this.personalization.cuentas_bancarias.push({
                    ...this.editingCuenta,
                    id: 'cta-' + Date.now().toString(36)
                });
            }
            this.showAddCuenta = false;
            this.triggerSuccess('Cuenta bancaria agregada a la lista');
        },
        
        deleteCuenta(index) {
            this.personalization.cuentas_bancarias.splice(index, 1);
            this.triggerSuccess('Cuenta bancaria eliminada');
        },
        
        addDressCodeColor() {
            if (!this.newDressColor.name) return alert('Ingresa el nombre del color');
            this.personalization.dress_code_colors.push({ ...this.newDressColor });
            this.newDressColor = { name: '', hex: '#0F4C3A' };
            this.triggerSuccess('Color agregado a la paleta');
        },
        
        removeDressCodeColor(index) {
            this.personalization.dress_code_colors.splice(index, 1);
        },
        
        openAddGaleriaFoto() {
            this.editingGaleriaFoto = { url: '', titulo: '', descripcion: '' };
            this.showAddGaleriaFoto = true;
        },
        
        saveGaleriaFoto() {
            if (!this.editingGaleriaFoto.url) return alert('Ingresa la URL de la foto');
            this.personalization.galeria_fotos.push({ ...this.editingGaleriaFoto });
            this.showAddGaleriaFoto = false;
            this.triggerSuccess('Foto agregada a la galería');
        },
        
        removeGaleriaFoto(index) {
            this.personalization.galeria_fotos.splice(index, 1);
        },
        
        async savePersonalization() {
            this.loading = true;
            try {
                await supabaseClient.updateConfiguracion(this.personalization);
                await this.loadConfig();
                this.triggerSuccess('¡Toda la configuración y personalización guardada exitosamente! ✨');
            } catch (e) {
                alert('Error al guardar personalización: ' + e.message);
            } finally {
                this.loading = false;
            }
        },
        
        // ==================== GRÁFICOS & UTILIDADES ====================
        initCharts() {
            setTimeout(() => {
                this.createInvitadosChart();
                this.createPresupuestoChart();
            }, 150);
        },
        
        createInvitadosChart() {
            const canvas = document.getElementById('chartInvitados');
            if (!canvas || typeof Chart === 'undefined') return;
            if (this.chartInvitados) this.chartInvitados.destroy();
            
            const ctx = canvas.getContext('2d');
            this.chartInvitados = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Confirmados', 'Pendientes', 'No Asistirán'],
                    datasets: [{
                        data: [this.stats.confirmados || 0, this.stats.pendientes || 0, this.stats.noAsistiran || 0],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        },
        
        createPresupuestoChart() {
            const canvas = document.getElementById('chartPresupuesto');
            if (!canvas || typeof Chart === 'undefined') return;
            if (this.chartPresupuesto) this.chartPresupuesto.destroy();
            
            const categories = {};
            this.finanzas.filter(f => f.tipo === 'gasto').forEach(g => {
                const cat = g.categoria || 'Otros';
                categories[cat] = (categories[cat] || 0) + (parseFloat(g.monto) || 0);
            });
            
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            if (labels.length === 0) {
                labels.push('Sin gastos');
                data.push(0);
            }
            
            const ctx = canvas.getContext('2d');
            this.chartPresupuesto = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Gastos por Categoría ($)',
                        data,
                        backgroundColor: this.personalization.color_principal || '#0F4C3A',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        },
        
        currentViewChanged() {
            if (this.currentView === 'dashboard') {
                this.initCharts();
            }
        },
        
        triggerSuccess(msg) {
            this.successMessage = msg;
            this.success = true;
            setTimeout(() => this.success = false, 3500);
        },
        
        formatCurrency(num) {
            return '$ ' + Number(num || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
        },
        
        // ==================== MESA HELPER FUNCTIONS ====================
        getMesaGuests(mesaId) {
            if (!mesaId) return [];
            const mesa = this.mesas.find(m => m.id === mesaId);
            if (!mesa) return [];
            return this.invitados.filter(i => i.mesa === mesa.nombre || i.mesa_asignada === mesaId);
        },
        
        getMesaTotalPersonas(mesaId) {
            const guests = this.getMesaGuests(mesaId);
            return guests.reduce((acc, curr) => acc + (curr.pases_adultos || 1) + (curr.pases_ninos || 0), 0);
        },
        
        toggleMesaView() {
            this.mesaViewMode = this.mesaViewMode === 'grid' ? 'plano' : 'grid';
        },
        
        startDragMesa(event, mesa) {
            if (event.target.closest('button')) return;
            this.dragMesaState = {
                mesa: mesa,
                startX: event.clientX,
                startY: event.clientY,
                offsetX: event.offsetX,
                offsetY: event.offsetY,
                element: event.currentTarget
            };
            event.currentTarget.style.cursor = 'grabbing';
            event.currentTarget.style.zIndex = '10';
        },
        
        moveDragMesa(event) {
            if (!this.dragMesaState) return;
            const container = event.currentTarget.closest('.relative');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left - this.dragMesaState.offsetX;
            const y = event.clientY - rect.top - this.dragMesaState.offsetY;
            this.dragMesaState.mesa.position_x = Math.max(0, x);
            this.dragMesaState.mesa.position_y = Math.max(0, y);
        },
        
        endDragMesa(event) {
            if (!this.dragMesaState) return;
            this.dragMesaState.element.style.cursor = 'grab';
            this.dragMesaState.element.style.zIndex = '1';
            // Save positions
            this.saveMesaPositions();
            this.dragMesaState = null;
        },
        
        async saveMesaPositions() {
            try {
                if (typeof supabaseClient !== 'undefined' && supabaseClient.isReady()) {
                    for (const mesa of this.mesas) {
                        if (mesa.position_x !== undefined || mesa.position_y !== undefined) {
                            await supabaseClient.updateMesa(mesa.id, {
                                position_x: mesa.position_x || 0,
                                position_y: mesa.position_y || 0
                            });
                        }
                    }
                }
                // Save to localStorage as backup
                const positions = this.mesas.map(m => ({ id: m.id, x: m.position_x || 0, y: m.position_y || 0 }));
                localStorage.setItem('mesa_positions', JSON.stringify(positions));
            } catch (error) {
                console.error('Error saving mesa positions:', error);
            }
        },
        
        loadMesaPositions() {
            try {
                const saved = localStorage.getItem('mesa_positions');
                if (saved) {
                    const positions = JSON.parse(saved);
                    positions.forEach(pos => {
                        const mesa = this.mesas.find(m => m.id === pos.id);
                        if (mesa) {
                            mesa.position_x = pos.x;
                            mesa.position_y = pos.y;
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading mesa positions:', error);
            }
        }
    };
}
