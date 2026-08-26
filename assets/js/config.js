/**
 * Boda Digital - Configuration File
 * Centralizes all configuration settings for the application
 */

const CONFIG = {
    // Supabase Configuration
    supabase: {
        url: 'https://ljohstlurceekxmtfeoe.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqb2hzdGx1cmNlZWt4bXRmZW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NjA0NjIsImV4cCI6MjA2MTAzNjQ2Mn0.Wv0XF3tY4M8yZJ7s8q5YKzXgVKqCjHKXvqJNnW5h0Mg',
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
