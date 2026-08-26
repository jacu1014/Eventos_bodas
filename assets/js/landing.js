/**
 * ==============================================================================
 * BODA DIGITAL - LÓGICA DE LA LANDING PÚBLICA (LANDING.JS) 💍✨
 * Versión 4.2:
 * - Confirmación de asistencia EXCLUSIVA sin registro para invitados
 * - Detección automática por URL / Buscador inteligente en lista autorizada
 * - Compresión de imágenes en el cliente y sobre 3D interactivo
 * ==============================================================================
 */

function landingApp() {
    return {
        envelopeOpen: false,
        
        // Configuración de la Boda
        config: {
            titulo: '¡Nos Casamos!',
            novia_nombre: 'Valentina',
            novio_nombre: 'Sebastián',
            novios: 'Valentina & Sebastián',
            frase_amor: 'El amor no se mira, se siente, y aún más cuando ustedes nos acompañan a celebrarlo.',
            fecha_boda: '2026-10-24T16:00:00',
            lugar_ceremonia: 'Capilla Nuestra Señora del Carmen',
            lugar_recepcion: 'Hacienda Campestre La Esmeralda',
            direccion_ceremonia: 'Calle 10 # 5-20, Zona Colonial',
            direccion_recepcion: 'Km 12 Vía Campestre, Valle Verde',
            maps_ceremonia_url: 'https://maps.google.com/?q=Capilla+Nuestra+Señora+del+Carmen',
            maps_recepcion_url: 'https://maps.google.com/?q=Hacienda+Campestre+La+Esmeralda',
            dress_code: 'Formal / Etiqueta Rigurosa',
            frase_regalos: 'Tu presencia y cariño son nuestro mayor regalo. Si deseas hacernos un detalle, puedes hacerlo mediante transferencia:',
            color_principal: '#0F4C3A',
            color_secundario: '#D4AF37',
            hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
            fondo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
            cuentas_bancarias: [],
            dress_code_colors: [],
            galeria_fotos: [],
            album_pausado: false,
            descarga_publica_habilitada: false,
            album_habilitado_siempre: false
        },
        
        // Cuenta Regresiva
        countdown: { dias: '00', horas: '00', minutos: '00', segundos: '00' },
        countdownTimer: null,
        
        // Carousels State
        currentHistorySlide: 0,
        currentWishSlide: 0,
        
        // Invitado Activo & Confirmación Exclusiva
        activeGuest: null,
        searchQuery: '',
        searchResults: [],
        searchSearched: false,
        
        // RSVP Form
        rsvp: {
            id: null,
            nombre: '',
            email: '',
            telefono: '',
            asistira: 'true',
            acompanantes: 0,
            menu: 'Tradicional',
            dietas: '',
            cancion_sugerida: '',
            mensaje_dedicatoria: ''
        },
        
        // Deseos y Fotos
        wishes: [],
        photos: [],
        
        // Feedback & UI
        loadingRSVP: false,
        rsvpSuccess: false,
        rsvpError: null,
        toastMessage: '',
        showToast: false,
        
        // Modal Subir Foto
        showUploadModal: false,
        uploadData: {
            nombre: '',
            titulo: '',
            file: null,
            preview: null,
            uploading: false
        },
        
        async init() {
            try {
                await this.loadConfig();
                await this.loadWishes();
                await this.loadPhotos();
                this.initCountdown();
                await this.detectGuestFromUrl();
                this.applyCustomStyles();
                
                // Rotación automática de deseos
                setInterval(() => {
                    if (this.wishes.length > 1) {
                        this.currentWishSlide = (this.currentWishSlide + 1) % this.wishes.length;
                    }
                }, 5500);
                
                console.log('✅ Landing page initialized successfully');
            } catch (error) {
                console.error('Error initializing landing:', error);
            }
        },
        
        async loadConfig() {
            if (typeof supabaseClient === 'undefined') return;
            const { data } = await supabaseClient.getConfiguracion();
            if (data) {
                this.config = { ...this.config, ...data };
            }
        },
        
        async loadWishes() {
            if (typeof supabaseClient === 'undefined') return;
            const { data } = await supabaseClient.getDeseos();
            if (data) {
                this.wishes = data.filter(d => d.aprobado !== false);
            }
        },
        
        async loadPhotos() {
            if (typeof supabaseClient === 'undefined') return;
            const { data } = await supabaseClient.getFotos(100, true);
            if (data) {
                this.photos = data;
            }
        },
        
        // ==================== VALIDACIÓN EXCLUSIVA DE INVITADOS SIN REGISTRO ====================
        async detectGuestFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const slug = params.get('slug') || params.get('token') || params.get('id') || params.get('invitado');
            
            console.log('🔍 Detecting guest from URL:', { slug, params: window.location.search });
            
            if (slug && typeof supabaseClient !== 'undefined') {
                try {
                    const { data: guest, error } = await supabaseClient.getInvitadoBySlugOrId(slug);
                    console.log('📧 Guest lookup result:', { guest, error });
                    if (guest) {
                        this.selectGuestForRSVP(guest);
                        // Open the envelope automatically when guest is found
                        this.envelopeOpen = true;
                        this.triggerToast(`✨ ¡Bienvenido(a) ${guest.nombre}! Tu invitación está lista.`);
                    } else {
                        console.warn('⚠️ Guest not found for slug:', slug);
                        // Try searching by name as fallback
                        const { data: searchResults } = await supabaseClient.searchInvitadosPorNombre(slug);
                        if (searchResults && searchResults.length > 0) {
                            this.searchResults = searchResults;
                            this.searchSearched = true;
                            this.searchQuery = slug;
                            this.triggerToast('🔍 ¿Eres tú? Selecciona tu nombre para continuar.');
                        }
                    }
                } catch (error) {
                    console.error('Error detecting guest:', error);
                }
            }
        },
        
        async searchGuest() {
            if (!this.searchQuery || this.searchQuery.trim().length < 2) {
                this.searchResults = [];
                this.searchSearched = false;
                return;
            }
            
            this.searchSearched = true;
            const { data } = await supabaseClient.searchInvitadosPorNombre(this.searchQuery);
            this.searchResults = data || [];
        },
        
        selectGuestForRSVP(guest) {
            this.activeGuest = guest;
            this.rsvp.id = guest.id;
            this.rsvp.nombre = guest.nombre;
            this.rsvp.email = guest.email || '';
            this.rsvp.telefono = guest.telefono || '';
            this.rsvp.acompanantes = guest.acompanantes || 0;
            this.rsvp.asistira = guest.asistira === false ? 'false' : 'true';
            this.rsvp.menu = guest.menu || 'Tradicional';
            this.rsvp.dietas = guest.dietas || guest.alergias_detalle || '';
            this.rsvp.cancion_sugerida = guest.cancion_sugerida || '';
            this.rsvp.mensaje_dedicatoria = guest.mensaje_dedicatoria || '';
            
            this.searchResults = [];
            this.searchQuery = '';
            this.searchSearched = false;
            
            this.triggerToast(`¡Bienvenido(a) ${guest.nombre}! Invitación cargada.`);
        },
        
        getMaxPasses() {
            if (!this.activeGuest) return 2;
            return (this.activeGuest.pases_adultos || 1) + (this.activeGuest.pases_ninos || 0);
        },
        
        initCountdown() {
            const updateTimer = () => {
                const target = new Date(this.config.fecha_boda || '2026-10-24T16:00:00').getTime();
                const now = new Date().getTime();
                const diff = target - now;
                
                if (diff <= 0) {
                    this.countdown = { dias: '00', horas: '00', minutos: '00', segundos: '00' };
                    return;
                }
                
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);
                
                this.countdown = {
                    dias: String(d).padStart(2, '0'),
                    horas: String(h).padStart(2, '0'),
                    minutos: String(m).padStart(2, '0'),
                    segundos: String(s).padStart(2, '0')
                };
            };
            
            updateTimer();
            this.countdownTimer = setInterval(updateTimer, 1000);
        },
        
        openEnvelope() {
            this.envelopeOpen = true;
            this.showConfetti();
            setTimeout(() => {
                const target = document.getElementById('boda-invitacion');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        },
        
        showConfetti() {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#0F4C3A', '#D4AF37', '#ffffff', '#e2c56a']
                });
            }
        },
        
        applyCustomStyles() {
            const primary = this.config.color_principal || '#0F4C3A';
            const accent = this.config.color_secundario || '#D4AF37';
            document.documentElement.style.setProperty('--color-primary', primary);
            document.documentElement.style.setProperty('--color-accent', accent);
        },
        
        async submitRSVP() {
            if (!this.rsvp.nombre) {
                this.rsvpError = 'Por favor ingresa o selecciona tu nombre';
                return;
            }
            
            this.loadingRSVP = true;
            this.rsvpError = null;
            
            try {
                await supabaseClient.submitRSVP(this.rsvp);
                this.rsvpSuccess = true;
                this.showConfetti();
                await this.loadWishes();
            } catch (error) {
                this.rsvpError = error.message || 'Error al enviar confirmación';
            } finally {
                this.loadingRSVP = false;
            }
        },
        
        copyToClipboard(text, message) {
            navigator.clipboard.writeText(text).then(() => {
                this.triggerToast(message || '¡Copiado al portapapeles! 📋');
            }).catch(() => {
                this.triggerToast('No se pudo copiar automáticamente');
            });
        },
        
        triggerToast(msg) {
            this.toastMessage = msg;
            this.showToast = true;
            setTimeout(() => this.showToast = false, 3000);
        },
        
        // Álbum Time Lock
        isAlbumUnlocked() {
            if (this.config.album_habilitado_siempre) return true;
            const weddingTime = new Date(this.config.fecha_boda || '2026-10-24T16:00:00').getTime();
            const oneHourBefore = weddingTime - (60 * 60 * 1000);
            return new Date().getTime() >= oneHourBefore;
        },
        
        // Manejo de Fotos con Compresión en el Cliente
        async handlePhotoSelect(event) {
            const rawFile = event.target.files[0];
            if (!rawFile) return;
            
            // Comprimir automáticamente
            const compressed = await supabaseClient.compressImage(rawFile, 1600, 1600, 0.82);
            this.uploadData.file = compressed;
            
            const reader = new FileReader();
            reader.onload = e => this.uploadData.preview = e.target.result;
            reader.readAsDataURL(compressed);
        },
        
        async uploadPhoto() {
            if (!this.uploadData.file || !this.uploadData.nombre) {
                alert('Por favor selecciona una foto e ingresa tu nombre');
                return;
            }
            
            this.uploadData.uploading = true;
            try {
                await supabaseClient.uploadFoto(this.uploadData.file, {
                    nombre: this.uploadData.nombre,
                    titulo: this.uploadData.titulo
                });
                await this.loadPhotos();
                this.showUploadModal = false;
                this.uploadData = { nombre: '', titulo: '', file: null, preview: null, uploading: false };
                this.triggerToast('¡Foto subida con éxito al álbum de la boda! 📸✨');
                this.showConfetti();
            } catch (e) {
                alert('Error al subir foto: ' + e.message);
            } finally {
                this.uploadData.uploading = false;
            }
        },
        
        openPrintableAlbum() {
            supabaseClient.generatePrintableAlbumWindow();
        }
    };
}
