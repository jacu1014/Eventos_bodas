/**
 * Boda Digital - Landing Page Logic
 * Handles RSVP, wishes, and interactive elements
 */

function landingApp() {
    return {
        config: {
            titulo: '¡Nos Casamos!',
            novios: 'Carlos & María',
            fecha: 'Próximamente',
            hora: 'Por confirmar',
            ubicacion: 'En un lugar especial',
            url_maps: '#',
            dresscode: 'Formal elegante',
            regalos: 'Lluvia de sobres',
            color_principal: '#e91e63',
            fondo: '/assets/images/default-fondo.jpg',
        },
        
        rsvp: {
            nombre: '',
            email: '',
            asistira: '',
            acompanantes: 0,
            menu: '',
            dietas: '',
        },
        
        wish: {
            nombre: '',
            texto: '',
        },
        
        wishes: [],
        loading: false,
        success: false,
        error: null,
        
        async init() {
            try {
                // Load configuration from Supabase
                await this.loadConfig();
                
                // Load wishes
                await this.loadWishes();
                
                // Initialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                
                console.log('✅ Landing page initialized');
            } catch (error) {
                console.error('Error initializing landing:', error);
            }
        },
        
        async loadConfig() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    console.warn('Supabase client not available, using default config');
                    return;
                }
                
                const { data, error } = await supabaseClient.getConfiguracion();
                if (error) throw error;
                
                if (data) {
                    this.config = {
                        ...this.config,
                        ...data,
                    };
                }
            } catch (error) {
                console.error('Error loading config:', error);
            }
        },
        
        async loadWishes() {
            try {
                if (typeof supabaseClient === 'undefined') return;
                
                const { data, error } = await supabaseClient.getDeseos();
                if (error) throw error;
                
                if (data) {
                    this.wishes = data;
                }
            } catch (error) {
                console.error('Error loading wishes:', error);
            }
        },
        
        async submitRSVP() {
            this.loading = true;
            this.error = null;
            this.success = false;
            
            try {
                // Validate form
                if (!this.rsvp.nombre || !this.rsvp.email || !this.rsvp.asistira) {
                    throw new Error('Por favor completa todos los campos obligatorios');
                }
                
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode - simulate success
                    this.success = true;
                    this.loading = false;
                    this.resetRSVP();
                    return;
                }
                
                const { data, error } = await supabaseClient.submitRSVP(this.rsvp);
                if (error) throw new Error(error);
                
                this.success = true;
                this.resetRSVP();
                
                // Show confetti effect
                this.showConfetti();
                
            } catch (error) {
                this.error = error.message || 'Error al enviar la confirmación';
            } finally {
                this.loading = false;
            }
        },
        
        resetRSVP() {
            this.rsvp = {
                nombre: '',
                email: '',
                asistira: '',
                acompanantes: 0,
                menu: '',
                dietas: '',
            };
        },
        
        async submitWish() {
            if (!this.wish.texto) {
                this.error = 'Por favor escribe un mensaje';
                return;
            }
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode - add locally
                    this.wishes.unshift({
                        nombre: this.wish.nombre || 'Anónimo',
                        texto: this.wish.texto,
                        created_at: new Date().toISOString(),
                    });
                    this.wish.texto = '';
                    this.wish.nombre = '';
                    return;
                }
                
                const { data, error } = await supabaseClient.addDeseo(this.wish);
                if (error) throw new Error(error);
                
                // Add to local list
                this.wishes.unshift(data);
                this.wish.texto = '';
                this.wish.nombre = '';
                
            } catch (error) {
                this.error = error.message || 'Error al publicar el deseo';
            }
        },
        
        showConfetti() {
            // Load confetti library dynamically if needed
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setTimeout(() => {
                    confetti({
                        particleCount: 50,
                        spread: 100,
                        origin: { y: 0.6 }
                    });
                }, 200);
            }
        }
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Landing page loaded');
});
