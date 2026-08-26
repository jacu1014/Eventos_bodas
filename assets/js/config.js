/**
 * Boda Digital - Configuration File
 * Centralizes all configuration settings for the application
 */

const CONFIG = {
    // Supabase Configuration
    supabase: {
        url: 'https://tu-proyecto.supabase.co',
        anonKey: 'tu-anon-key-public',
    },
    
    // App Configuration
    app: {
        name: 'Boda Digital',
        version: '1.0.0',
        adminEmail: 'novios@email.com',
    },
    
    // Default Theme Colors
    theme: {
        primary: '#e91e63',
        secondary: '#9c27b0',
        accent: '#ff6f00',
        background: '#fafafa',
        text: '#1a1a1a',
    },
    
    // Default Content
    defaults: {
        titulo: '¡Nos Casamos!',
        novios: 'Carlos & María',
        fecha: 'Próximamente',
        ubicacion: 'En un lugar especial',
        dresscode: 'Formal elegante',
        regalos: 'Lluvia de sobres',
        fondo: '/assets/images/default-fondo.jpg',
        logo: '/assets/images/default-logo.png',
    },
    
    // Upload Limits
    upload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFiles: 10,
    },
    
    // API Endpoints (for future expansion)
    endpoints: {
        rsvp: '/api/rsvp',
        wishes: '/api/wishes',
        photos: '/api/photos',
        guests: '/api/guests',
        tables: '/api/tables',
    },
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
