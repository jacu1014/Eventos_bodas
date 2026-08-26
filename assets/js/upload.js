/**
 * Boda Digital - Photo Upload Logic
 * Handles file uploads, previews, and gallery display
 */

function uploadApp() {
    return {
        config: {
            color_principal: '#e91e63',
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
                // Load configuration
                await this.loadConfig();
                
                // Load recent photos
                await this.loadRecentPhotos();
                
                console.log('📸 Upload page initialized');
            } catch (error) {
                console.error('Error initializing upload:', error);
            }
        },
        
        async loadConfig() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.config.color_principal = '#e91e63';
                    return;
                }
                
                const { data, error } = await supabaseClient.getConfiguracion();
                if (error) throw error;
                
                if (data && data.color_principal) {
                    this.config.color_principal = data.color_principal;
                }
            } catch (error) {
                console.error('Error loading config:', error);
            }
        },
        
        async loadRecentPhotos() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo photos
                    this.recentPhotos = [
                        { url: 'https://picsum.photos/200/200?random=1', titulo: 'Foto 1' },
                        { url: 'https://picsum.photos/200/200?random=2', titulo: 'Foto 2' },
                        { url: 'https://picsum.photos/200/200?random=3', titulo: 'Foto 3' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getFotos(9);
                if (error) throw error;
                
                this.recentPhotos = data || [];
                
            } catch (error) {
                console.error('Error loading recent photos:', error);
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
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                this.uploadError = 'Formato no soportado. Usa JPG, PNG, GIF o WebP.';
                return;
            }
            
            // Validate file size (10MB max)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                this.uploadError = 'El archivo es demasiado grande. Máximo 10MB.';
                return;
            }
            
            this.file = file;
            this.uploadError = null;
            
            // Create preview
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
            
            // Reset file input
            if (this.$refs && this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },
        
        async uploadPhoto() {
            if (!this.file) {
                this.uploadError = 'Por favor selecciona una foto';
                return;
            }
            
            if (!this.photoData.nombre) {
                this.uploadError = 'Por favor ingresa tu nombre';
                return;
            }
            
            this.uploading = true;
            this.uploadError = null;
            this.uploadSuccess = false;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode - simulate upload
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Add to recent photos
                    this.recentPhotos.unshift({
                        url: this.previewUrl,
                        titulo: this.photoData.titulo || 'Foto subida',
                        nombre_subidor: this.photoData.nombre,
                    });
                    
                    this.uploadSuccess = true;
                    this.clearFile();
                    return;
                }
                
                const { data, error } = await supabaseClient.uploadFoto(
                    this.file,
                    {
                        titulo: this.photoData.titulo,
                        nombre: this.photoData.nombre,
                    }
                );
                
                if (error) throw new Error(error);
                
                // Add to recent photos
                if (data) {
                    this.recentPhotos.unshift(data);
                }
                
                this.uploadSuccess = true;
                this.clearFile();
                
                // Show confetti
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
                    origin: { y: 0.6 }
                });
            }
        }
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📸 Upload page loaded');
});
