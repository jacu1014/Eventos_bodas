/**
 * ==============================================================================
 * BODA DIGITAL - LÓGICA DE SUBIDA DE FOTOS (UPLOAD.JS) 📸✨
 * Integración móvil con cámara, compresión y galería en tiempo real
 * ==============================================================================
 */

function uploadApp() {
    return {
        config: {
            color_principal: '#0F4C3A',
            novios: 'Valentina & Sebastián',
            album_pausado: false
        },
        
        file: null,
        previewUrl: null,
        dragover: false,
        uploading: false,
        uploadSuccess: false,
        uploadError: null,
        
        photoData: {
            titulo: '',
            nombre: '',
        },
        
        recentPhotos: [],
        
        async init() {
            try {
                await this.loadConfig();
                await this.loadRecentPhotos();
                console.log('📸 Photo uploader initialized');
            } catch (error) {
                console.error('Error initializing uploader:', error);
            }
        },
        
        async loadConfig() {
            if (typeof supabaseClient === 'undefined') return;
            const { data } = await supabaseClient.getConfiguracion();
            if (data) {
                this.config = { ...this.config, ...data };
            }
        },
        
        async loadRecentPhotos() {
            if (typeof supabaseClient === 'undefined') return;
            const { data } = await supabaseClient.getFotos(6, true);
            if (data) {
                this.recentPhotos = data;
            }
        },
        
        handleFileSelect(event) {
            const files = event.target.files;
            if (files && files.length > 0) {
                this.processFile(files[0]);
            }
        },
        
        handleDrop(event) {
            this.dragover = false;
            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
                this.processFile(files[0]);
            }
        },
        
        processFile(file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
            if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
                this.uploadError = 'Formato no soportado. Usa JPG, PNG, WebP o GIF.';
                return;
            }
            
            const maxSize = 12 * 1024 * 1024; // 12MB
            if (file.size > maxSize) {
                this.uploadError = 'El archivo es demasiado grande. Máximo 12MB.';
                return;
            }
            
            this.file = file;
            this.uploadError = null;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        
        clearFile() {
            this.file = null;
            this.previewUrl = null;
            this.uploadSuccess = false;
            this.uploadError = null;
            this.photoData.titulo = '';
            
            if (this.$refs && this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },
        
        async uploadPhoto() {
            if (!this.file) {
                this.uploadError = 'Por favor selecciona o toma una foto';
                return;
            }
            
            if (!this.photoData.nombre) {
                this.uploadError = 'Por favor escribe tu nombre';
                return;
            }
            
            this.uploading = true;
            this.uploadError = null;
            this.uploadSuccess = false;
            
            try {
                const { data, error } = await supabaseClient.uploadFoto(
                    this.file,
                    {
                        titulo: this.photoData.titulo,
                        nombre: this.photoData.nombre,
                    }
                );
                
                if (error) throw new Error(error);
                
                if (data) {
                    this.recentPhotos.unshift(data);
                }
                
                this.uploadSuccess = true;
                this.clearFile();
                this.showConfetti();
                
            } catch (error) {
                this.uploadError = error.message || 'Error al subir la foto';
            } finally {
                this.uploading = false;
            }
        },
        
        showConfetti() {
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#0F4C3A', '#D4AF37', '#ffffff']
                });
            }
        }
    };
}
