/**
 * ==============================================================================
 * BODA DIGITAL - CLIENTE SUPABASE & PERSISTENCIA INTEGRAL (VERSION 4.2) 💍✨
 * - Autenticación con Google OAuth y Registro de Usuarios
 * - Compresión de imágenes de alta eficiencia en el cliente
 * - Búsqueda y validación exclusiva de invitados sin registro
 * - Soporte Offline con LocalStorage y Online con Supabase
 * ==============================================================================
 */

// Lista exhaustiva de entidades bancarias y billeteras de Colombia
const BANCOS_COLOMBIA = [
    'Bancolombia',
    'Nequi',
    'Davivienda',
    'Daviplata',
    'Banco de Bogotá',
    'BBVA Colombia',
    'Nu Colombia (Nubank)',
    'Lulo Bank',
    'Banco de Occidente',
    'Banco Popular',
    'Banco AV Villas',
    'Scotiabank Colpatria',
    'Banco Caja Social',
    'Banco Itaú',
    'Banco Falabella',
    'RappiPay / Banco Davivienda',
    'Banco Pichincha',
    'Banco Agrario de Colombia',
    'Banco Serfinanza',
    'Banco Santander',
    'Banco Coofinep / Cooperativas',
    'Dale!',
    'Movii',
    'Ualá Colombia',
    'Global66',
    'Otro Banco / Internacional'
];

const THEME_PRESETS = {
    emerald_gold: {
        name: 'Verde Esmeralda & Dorado (Oficial)',
        primary: '#0F4C3A',
        secondary: '#D4AF37',
        accent: '#D4AF37',
        bg: '#F6F9F7'
    },
    rose_gold: {
        name: 'Rosa Palo & Oro Rosa',
        primary: '#8B4F58',
        secondary: '#D4A373',
        accent: '#D4A373',
        bg: '#FAF7F7'
    },
    midnight_gold: {
        name: 'Azul Medianoche & Oro Real',
        primary: '#102A43',
        secondary: '#D4AF37',
        accent: '#D4AF37',
        bg: '#F4F7FB'
    },
    burgundy_gold: {
        name: 'Vino Tinto / Borgoña & Dorado',
        primary: '#581825',
        secondary: '#C5A059',
        accent: '#C5A059',
        bg: '#FAF5F6'
    },
    sage_copper: {
        name: 'Verde Eucalipto & Cobre Cálido',
        primary: '#3B5A4D',
        secondary: '#C87D55',
        accent: '#C87D55',
        bg: '#F5FAF7'
    }
};

const DEFAULT_CONFIG = {
    id: 'config-1',
    novia_nombre: 'Valentina',
    novio_nombre: 'Sebastián',
    novios: 'Valentina & Sebastián',
    titulo: '¡Nos Casamos!',
    frase_amor: 'El amor no se mira, se siente, y aún más cuando ustedes nos acompañan a celebrarlo.',
    fecha: '2026-10-24',
    hora: '16:00',
    fecha_boda: '2026-10-24T16:00:00',
    lugar_ceremonia: 'Capilla Nuestra Señora del Carmen',
    lugar_recepcion: 'Hacienda Campestre La Esmeralda',
    direccion_ceremonia: 'Calle 10 # 5-20, Zona Colonial',
    direccion_recepcion: 'Km 12 Vía Campestre, Valle Verde',
    ubicacion: 'Capilla Ntra. Señora del Carmen & Hacienda La Esmeralda',
    url_maps: 'https://maps.google.com/?q=Hacienda+La+Esmeralda',
    maps_ceremonia_url: 'https://maps.google.com/?q=Capilla+Nuestra+Señora+del+Carmen',
    maps_recepcion_url: 'https://maps.google.com/?q=Hacienda+Campestre+La+Esmeralda',
    dresscode: 'Formal / Etiqueta Rigurosa',
    dress_code: 'Formal / Etiqueta Rigurosa (Traje oscuro para caballeros y vestido largo para damas)',
    regalos: 'Lluvia de sobres o transferencia a nuestras cuentas bancarias',
    frase_regalos: 'Tu presencia y cariño en este día son nuestro mayor regalo. Si deseas hacernos un detalle para nuestro nuevo hogar y luna de miel, dispondremos de buzón de sobres el día del evento o puedes hacerlo mediante transferencia a cualquiera de nuestras cuentas:',
    presupuesto_objetivo: 45000000,
    moneda_simbolo: '$',
    admin_pin: '1234',

    // Cuentas Bancarias Múltiples con Soporte Bre-B
    cuentas_bancarias: [
        {
            id: 'cta-1',
            banco_nombre: 'Bancolombia',
            banco_tipo_cuenta: 'Cuenta de Ahorros',
            banco_numero_cuenta: '123-456789-00',
            banco_titular: 'Valentina Restrepo & Sebastián Gómez',
            banco_documento: '1.020.304.050',
            banco_llave_breb: '3001234567',
            qr_banco_url: ''
        },
        {
            id: 'cta-2',
            banco_nombre: 'Nequi',
            banco_tipo_cuenta: 'Depósito Electrónico / Billetera',
            banco_numero_cuenta: '3001234567',
            banco_titular: 'Valentina Restrepo',
            banco_documento: '1.020.304.050',
            banco_llave_breb: '3001234567',
            qr_banco_url: ''
        }
    ],

    // Colores y Personalización Visual
    theme_palette_preset: 'emerald_gold',
    color_principal: '#0F4C3A',
    color_secundario: '#D4AF37',
    theme_primary_color: '#0F4C3A',
    theme_accent_color: '#D4AF37',
    theme_bg_color: '#F6F9F7',
    fuente_titulos: 'serif',
    fuente_textos: 'sans-serif',

    // Paleta de Dress Code Sugerida
    dress_code_colors: [
        { name: 'Verde Esmeralda', hex: '#0F4C3A' },
        { name: 'Verde Bosque', hex: '#165B46' },
        { name: 'Dorado Champaña', hex: '#D4AF37' },
        { name: 'Verde Salvia', hex: '#88CBB3' },
        { name: 'Blanco Marfil', hex: '#FAFAF7' }
    ],

    // Imágenes
    fondo: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
    hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
    ceremonia_image_url: 'https://images.unsplash.com/photo-1545232979-fbf6783d8e57?auto=format&fit=crop&w=800&q=80',
    recepcion_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    logo_url: '',
    image_fit_mode: 'cover',

    // Galería de Nuestra Historia
    galeria_fotos: [
        {
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
            titulo: 'Nuestro Compromiso',
            descripcion: 'El día en que dijimos sí para siempre frente al mar.'
        },
        {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            titulo: 'Viaje Inolvidable',
            descripcion: 'Descubriendo nuevos rincones y sonrisas juntos.'
        },
        {
            url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
            titulo: 'Sesión Pre-Boda',
            descripcion: 'Capturando las risas y la emoción previa a nuestro gran día.'
        }
    ],

    // Control y Estados del Álbum
    album_habilitado_siempre: false,
    album_pausado: false,
    descarga_publica_habilitada: false
};

class SupabaseClient {
    constructor() {
        this.supabase = null;
        this.initialized = false;
        this.STORAGE_PREFIX = 'boda_digital_';
        this.initFromStorage();
    }

    initFromStorage() {
        try {
            const url = localStorage.getItem(this.STORAGE_PREFIX + 'supabase_url') || window.CONFIG?.supabase?.url;
            const key = localStorage.getItem(this.STORAGE_PREFIX + 'supabase_key') || window.CONFIG?.supabase?.anonKey;
            if (url && key && typeof supabase !== 'undefined') {
                console.log('🔌 Initializing Supabase with URL:', url);
                this.init(url, key);
            } else {
                console.warn('⚠️ Supabase credentials not found in localStorage or CONFIG');
            }
        } catch (e) {
            console.warn('Init from storage error:', e);
        }
    }

    init(url, anonKey) {
        try {
            if (typeof supabase === 'undefined') {
                console.warn('Supabase JS library not loaded. Running in local storage mode.');
                return false;
            }
            this.supabase = supabase.createClient(url.trim(), anonKey.trim());
            this.initialized = true;
            localStorage.setItem(this.STORAGE_PREFIX + 'supabase_url', url.trim());
            localStorage.setItem(this.STORAGE_PREFIX + 'supabase_key', anonKey.trim());
            console.log('✅ Supabase client initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            this.initialized = false;
            return false;
        }
    }

    isReady() {
        return this.initialized && this.supabase !== null;
    }

    getClient() {
        return this.supabase;
    }

    // Helper para almacenamiento local
    getLocal(key, fallback = []) {
        try {
            const data = localStorage.getItem(this.STORAGE_PREFIX + key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    setLocal(key, value) {
        try {
            localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving local storage:', e);
        }
    }

    generateId(prefix = 'id') {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Sanitización básica para evitar inyecciones XSS
    sanitize(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    // ==================== COMPRESIÓN DE IMÁGENES EN EL CLIENTE ====================
    async compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
        if (!file || !file.type.startsWith('image/')) return file;
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                });
                                resolve(compressedFile);
                            } else {
                                resolve(file);
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.onerror = () => resolve(file);
            };
            reader.onerror = () => resolve(file);
        });
    }

    // ==================== AUTHENTICATION (EMAIL, PASSWORD, GOOGLE, REGISTRO) ====================
    async signIn(email, password) {
        if (!this.isReady()) {
            if (email && password) {
                const sessionUser = { email, id: 'admin-local-1', user_metadata: { full_name: 'Novios' } };
                this.setLocal('session_user', sessionUser);
                return { data: { user: sessionUser, session: { access_token: 'local-token' } }, error: null };
            }
            return { data: null, error: 'Por favor ingresa credenciales válidas' };
        }
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data?.user) this.setLocal('session_user', data.user);
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }

    async signUp(email, password, metadata = {}) {
        if (!this.isReady()) {
            const user = { email, user_metadata: metadata, id: 'user-' + Date.now() };
            this.setLocal('session_user', user);
            return { data: { user, session: { access_token: 'local-token' } }, error: null };
        }
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: { data: metadata }
            });
            if (error) throw error;
            if (data?.user) this.setLocal('session_user', data.user);
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }

    async signInWithGoogle() {
        if (!this.isReady()) {
            const demoUser = {
                email: 'novios.google@gmail.com',
                id: 'google-user-1',
                user_metadata: { full_name: 'Valentina & Sebastián (Google)', avatar_url: '' }
            };
            this.setLocal('session_user', demoUser);
            return { data: { user: demoUser }, error: null };
        }
        try {
            const { data, error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/admin.html'
                }
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }

    async resetPassword(email) {
        if (!this.isReady()) {
            return { data: true, error: null };
        }
        try {
            const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/admin.html?reset=true'
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    }

    async signOut() {
        localStorage.removeItem(this.STORAGE_PREFIX + 'session_user');
        if (!this.isReady()) return { error: null };
        try {
            const { error } = await this.supabase.auth.signOut();
            return { error: error ? error.message : null };
        } catch (error) {
            return { error: error.message };
        }
    }

    async getSession() {
        const localUser = this.getLocal('session_user', null);
        if (!this.isReady()) {
            return { data: localUser ? { session: { user: localUser } } : null, error: null };
        }
        try {
            const { data, error } = await this.supabase.auth.getSession();
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: localUser ? { session: { user: localUser } } : null, error: null };
        }
    }

    async getUser() {
        const localUser = this.getLocal('session_user', null);
        if (!this.isReady()) {
            return { data: { user: localUser }, error: null };
        }
        try {
            const { data, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: { user: localUser }, error: null };
        }
    }

    // ==================== CONFIGURACIÓN ====================
    async getConfiguracion(forceRefresh = false) {
        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error, fallback to local:', e);
            }
        }
        const local = this.getLocal('config', DEFAULT_CONFIG);
        const merged = { ...DEFAULT_CONFIG, ...local };
        return { data: merged, error: null };
    }

    async updateConfiguracion(updates) {
        const current = (await this.getConfiguracion()).data || DEFAULT_CONFIG;
        const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
        this.setLocal('config', updated);

        if (this.isReady()) {
            try {
                if (updated.id && !updated.id.startsWith('config-')) {
                    await this.supabase.from('boda_config').update(updated).eq('id', updated.id);
                } else {
                    const { id, ...dataToInsert } = updated;
                    const { data } = await this.supabase.from('boda_config').insert([dataToInsert]).select().single();
                    if (data) {
                        updated.id = data.id;
                        this.setLocal('config', updated);
                    }
                }
            } catch (e) {
                console.warn('Supabase updateConfig error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async updateBodaConfig(updates) {
        return this.updateConfiguracion(updates);
    }

    // ==================== INVITADOS (CON VALIDACIÓN EXCLUSIVA Y GRUPOS) ====================
    async getInvitados(forceRefresh = false) {
        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('invitados').select('*').order('nombre_completo', { ascending: true });
                if (!error && data) {
                    const mapped = data.map(i => this.normalizeGuest(i));
                    this.setLocal('invitados', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getInvitados error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('invitados').select('*').order('nombre_completo', { ascending: true });
                if (!error && data) {
                    const mapped = data.map(i => this.normalizeGuest(i));
                    this.setLocal('invitados', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getInvitados error, fallback to local:', e);
            }
        }
        const local = this.getLocal('invitados', [
            {
                id: 'inv-1',
                nombre: 'Carlos Mendoza & Esposa',
                nombre_completo: 'Carlos Mendoza & Esposa',
                grupo: 'Amigos Novio',
                email: 'carlos@example.com',
                telefono: '+57 300 123 4567',
                asistira: true,
                estado_rsvp: 'Confirmado',
                pases_adultos: 2,
                pases_ninos: 0,
                acompanantes: 1,
                pases_confirmados: 2,
                mesa: 'Mesa 1 (Familia Novia)',
                mesa_asignada: 'Mesa 1 (Familia Novia)',
                menu: 'Tradicional',
                restricciones_dieteticas: 'Ninguna',
                alergias_detalle: '',
                slug: 'carlos-mendoza',
                invitacion_enviada: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'inv-2',
                nombre: 'Familia Gómez Restrepo',
                nombre_completo: 'Familia Gómez Restrepo',
                grupo: 'Familia Novia',
                email: 'familia.gomez@example.com',
                telefono: '+57 310 987 6543',
                asistira: null,
                estado_rsvp: 'Pendiente',
                pases_adultos: 4,
                pases_ninos: 1,
                acompanantes: 4,
                pases_confirmados: 0,
                mesa: 'Mesa 2 (Familia Novio)',
                mesa_asignada: 'Mesa 2 (Familia Novio)',
                menu: 'Tradicional',
                restricciones_dieteticas: 'Ninguna',
                alergias_detalle: '',
                slug: 'familia-gomez-restrepo',
                invitacion_enviada: false,
                created_at: new Date().toISOString()
            }
        ]);
        return { data: local.map(i => this.normalizeGuest(i)), error: null };
    }

    normalizeGuest(i) {
        const nombre = i.nombre || i.nombre_completo || '';
        return {
            id: i.id,
            nombre: nombre,
            nombre_completo: i.nombre_completo || nombre,
            grupo: i.grupo || 'General',
            email: i.email || '',
            telefono: i.telefono || '',
            asistira: i.asistira !== undefined ? i.asistira : (i.estado_rsvp === 'Confirmado' ? true : (i.estado_rsvp === 'Declinado' ? false : null)),
            estado_rsvp: i.estado_rsvp || (i.asistira === true ? 'Confirmado' : (i.asistira === false ? 'Declinado' : 'Pendiente')),
            acompanantes: i.acompanantes !== undefined ? parseInt(i.acompanantes) : Math.max(0, (parseInt(i.pases_adultos) || 1) - 1),
            pases_adultos: parseInt(i.pases_adultos) || ((parseInt(i.acompanantes) || 0) + 1),
            pases_ninos: parseInt(i.pases_ninos) || 0,
            pases_confirmados: i.pases_confirmados !== undefined ? parseInt(i.pases_confirmados) : (i.asistira ? ((parseInt(i.pases_adultos) || 1) + (parseInt(i.pases_ninos) || 0)) : 0),
            mesa: i.mesa || i.mesa_asignada || 'Sin asignar',
            mesa_asignada: i.mesa_asignada || i.mesa || 'Sin asignar',
            menu: i.menu || i.restricciones_dieteticas || 'Tradicional',
            restricciones_dieteticas: i.restricciones_dieteticas || i.menu || 'Ninguna',
            alergias_detalle: i.alergias_detalle || i.dietas || '',
            dietas: i.dietas || i.alergias_detalle || '',
            notas: i.notas || '',
            cancion_sugerida: i.cancion_sugerida || '',
            mensaje_dedicatoria: i.mensaje_dedicatoria || '',
            slug: i.slug || nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'invitado-' + Date.now(),
            invitacion_enviada: i.invitacion_enviada === true,
            confirmado_por_web: i.confirmado_por_web === true,
            created_at: i.created_at || new Date().toISOString(),
            updated_at: i.updated_at || new Date().toISOString()
        };
    }

    async getInvitadoBySlugOrId(identifier) {
        if (!identifier) return { data: null, error: 'Identificador vacío' };
        const idClean = identifier.toLowerCase().trim();
        const list = (await this.getInvitados()).data;
        const found = list.find(i => 
            i.id === identifier || 
            i.slug === idClean || 
            i.nombre.toLowerCase().trim() === idClean
        );
        return { data: found || null, error: found ? null : 'Invitado no encontrado' };
    }

    async searchInvitadosPorNombre(query) {
        if (!query || query.trim().length < 2) return { data: [], error: null };
        const clean = query.toLowerCase().trim();
        const { data: list } = await this.getInvitados(true);
        const matches = list.filter(i => 
            (i.nombre && i.nombre.toLowerCase().includes(clean)) || 
            (i.nombre_completo && i.nombre_completo.toLowerCase().includes(clean)) ||
            (i.grupo && i.grupo.toLowerCase().includes(clean)) ||
            (i.email && i.email.toLowerCase().includes(clean))
        );
        return { data: matches, error: null };
    }

    async addInvitado(invitado, forceRefresh = false) {
        const list = (await this.getInvitados()).data;
        const normalized = this.normalizeGuest({
            ...invitado,
            id: this.generateId('inv'),
            created_at: new Date().toISOString()
        });

        list.unshift(normalized);
        this.setLocal('invitados', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = normalized;
                const { data } = await this.supabase.from('invitados').insert([dataToInsert]).select().single();
                if (data) normalized.id = data.id;
            } catch (e) {
                console.warn('Supabase addInvitado error:', e);
            }
        }
        return { data: normalized, error: null };
    }

    async updateInvitado(id, updates, forceRefresh = false) {
        const list = (await this.getInvitados()).data;
        const index = list.findIndex(i => i.id === id);
        if (index === -1) return { data: null, error: 'Invitado no encontrado' };

        const updated = this.normalizeGuest({ ...list[index], ...updates, updated_at: new Date().toISOString() });
        list[index] = updated;
        this.setLocal('invitados', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('invitados').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateInvitado error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async deleteInvitado(id, forceRefresh = false) {
        let list = (await this.getInvitados()).data;
        list = list.filter(i => i.id !== id);
        this.setLocal('invitados', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('invitados').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteInvitado error:', e);
            }
        }
        return { error: null };
    }

    // ==================== SUBMIT RSVP SEGURO Y EXCLUSIVO ====================
    async submitRSVP(rsvpData) {
        const list = (await this.getInvitados()).data;
        let targetGuest = null;

        // 1. Si viene con ID o slug específico
        if (rsvpData.id) {
            targetGuest = list.find(i => i.id === rsvpData.id);
        }
        if (!targetGuest && rsvpData.slug) {
            targetGuest = list.find(i => i.slug === rsvpData.slug);
        }

        // 2. Si no viene ID/slug, buscar coincidencia exacta por nombre
        if (!targetGuest && rsvpData.nombre) {
            const searchName = rsvpData.nombre.toLowerCase().trim();
            targetGuest = list.find(i => (i.nombre || '').toLowerCase().trim() === searchName);
        }

        // Seguridad: Si no está en la lista oficial de invitados, no permitir confirmación
        if (!targetGuest) {
            throw new Error('No encontramos una invitación registrada con ese nombre. Por favor selecciona tu nombre de la lista oficial o ingresa con tu enlace personal.');
        }

        const maxPasses = (targetGuest.pases_adultos || 1) + (targetGuest.pases_ninos || 0);
        const requestedPasses = (parseInt(rsvpData.acompanantes) || 0) + 1;

        if (requestedPasses > maxPasses) {
            throw new Error(`Esta invitación tiene asignado un máximo de ${maxPasses} pase(s). Has seleccionado ${requestedPasses}.`);
        }

        const isAttending = (rsvpData.asistira === true || rsvpData.asistira === 'true');

        const payload = {
            asistira: isAttending,
            estado_rsvp: isAttending ? 'Confirmado' : 'Declinado',
            pases_confirmados: isAttending ? requestedPasses : 0,
            acompanantes: Math.max(0, requestedPasses - 1),
            email: rsvpData.email || targetGuest.email || '',
            telefono: rsvpData.telefono || targetGuest.telefono || '',
            menu: rsvpData.menu || 'Tradicional',
            restricciones_dieteticas: rsvpData.menu || 'Ninguna',
            alergias_detalle: rsvpData.dietas || rsvpData.alergias_detalle || '',
            dietas: rsvpData.dietas || '',
            cancion_sugerida: rsvpData.cancion_sugerida || '',
            mensaje_dedicatoria: rsvpData.mensaje_dedicatoria || '',
            confirmado_por_web: true,
            updated_at: new Date().toISOString()
        };

        const result = (await this.updateInvitado(targetGuest.id, payload)).data;

        // Guardar dedicatoria si la escribió
        if (rsvpData.mensaje_dedicatoria && rsvpData.mensaje_dedicatoria.trim()) {
            await this.addDeseo({
                nombre: targetGuest.nombre,
                mensaje: rsvpData.mensaje_dedicatoria.trim(),
                texto: rsvpData.mensaje_dedicatoria.trim(),
                cancion_sugerida: rsvpData.cancion_sugerida || ''
            });
        }

        // Guardar sugerencia musical
        if (rsvpData.cancion_sugerida && rsvpData.cancion_sugerida.trim()) {
            await this.addCancion({
                titulo: rsvpData.cancion_sugerida.trim(),
                invitado: targetGuest.nombre
            });
        }

        return { data: result, error: null };
    }

    // ==================== MESAS ====================
    async getMesas(forceRefresh = false) {
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('mesas').select('*').order('numero', { ascending: true });
                if (!error && data && data.length > 0) {
                    this.setLocal('mesas', data);
                    return { data, error: null };
                }
            } catch (e) {
                console.warn('Supabase getMesas error:', e);
            }
        }
        const local = this.getLocal('mesas', [
            { id: 'm-1', nombre: 'Mesa 1 (Familia Novia)', capacidad: 8, ubicacion: 'Zona Central', numero: 1 },
            { id: 'm-2', nombre: 'Mesa 2 (Familia Novio)', capacidad: 8, ubicacion: 'Zona Central', numero: 2 },
            { id: 'm-3', nombre: 'Mesa 3 (Amigos)', capacidad: 10, ubicacion: 'Cerca a la Pista', numero: 3 }
        ]);
        return { data: local, error: null };
    }

    async addMesa(mesa, forceRefresh = false) {
        const list = (await this.getMesas()).data;
        const newMesa = {
            ...mesa,
            id: mesa.id || this.generateId('mesa'),
            numero: mesa.numero || (list.length + 1)
        };
        list.push(newMesa);
        this.setLocal('mesas', list);

        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = newMesa;
                const { data } = await this.supabase.from('mesas').insert([dataToInsert]).select().single();
                if (data) newMesa.id = data.id;
            } catch (e) {
                console.warn('Supabase addMesa error:', e);
            }
        }
        return { data: newMesa, error: null };
    }

    async updateMesa(id, updates, forceRefresh = false) {
        const list = (await this.getMesas()).data;
        const index = list.findIndex(m => m.id === id);
        if (index === -1) return { data: null, error: 'Mesa no encontrada' };

        const updated = { ...list[index], ...updates };
        list[index] = updated;
        this.setLocal('mesas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('mesas').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateMesa error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async deleteMesa(id, forceRefresh = false) {
        let list = (await this.getMesas()).data;
        list = list.filter(m => m.id !== id);
        this.setLocal('mesas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('mesas').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteMesa error:', e);
            }
        }
        return { error: null };
    }

    // ==================== FINANZAS & PRESUPUESTO ====================
    async getFinanzas(forceRefresh = false) {
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('presupuesto').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    const mapped = data.map(f => this.normalizeFinanza(f));
                    this.setLocal('finanzas', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getFinanzas error:', e);
            }
        }
        const local = this.getLocal('finanzas', [
            { id: 'f-1', concepto: 'Alquiler de Hacienda y Salón', categoria: 'Lugar y Salón', monto: 11500000, tipo: 'gasto', pagado: 5750000, estado_pago: 'Anticipo Parcial', fecha: '2026-10-15' },
            { id: 'f-2', concepto: 'Banquete Catering 100 personas', categoria: 'Catering y Bebidas', monto: 13500000, tipo: 'gasto', pagado: 6750000, estado_pago: 'Anticipo Parcial', fecha: '2026-11-01' },
            { id: 'f-3', concepto: 'Aporte Pareja Fondo Boda', categoria: 'Presupuesto Inicial', monto: 45000000, tipo: 'ingreso', pagado: 45000000, estado_pago: 'Completado', fecha: '2026-05-01' }
        ]);
        return { data: local.map(f => this.normalizeFinanza(f)), error: null };
    }

    normalizeFinanza(f) {
        return {
            id: f.id,
            concepto: f.concepto || f.titulo || '',
            categoria: f.categoria || 'Otros',
            monto: parseFloat(f.monto || f.costo_real || f.costo_estimado || 0),
            costo_real: parseFloat(f.costo_real || f.monto || 0),
            costo_estimado: parseFloat(f.costo_estimado || f.monto || 0),
            monto_pagado: parseFloat(f.monto_pagado || f.pagado || 0),
            tipo: f.tipo || (f.categoria === 'Presupuesto Inicial' || f.categoria === 'Ingreso' ? 'ingreso' : 'gasto'),
            estado_pago: f.estado_pago || (f.monto_pagado >= f.monto ? 'Pagado' : (f.monto_pagado > 0 ? 'Anticipo Parcial' : 'Pendiente')),
            fecha: f.fecha || f.fecha_limite_pago || '',
            proveedor_asociado: f.proveedor_asociado || '',
            notas: f.notas || ''
        };
    }

    async addFinanza(finanza, forceRefresh = false) {
        const list = (await this.getFinanzas()).data;
        const normalized = this.normalizeFinanza({
            ...finanza,
            id: this.generateId('fin'),
            created_at: new Date().toISOString()
        });
        list.unshift(normalized);
        this.setLocal('finanzas', list);

        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = normalized;
                const { data } = await this.supabase.from('presupuesto').insert([dataToInsert]).select().single();
                if (data) normalized.id = data.id;
            } catch (e) {
                console.warn('Supabase addFinanza error:', e);
            }
        }
        return { data: normalized, error: null };
    }

    async updateFinanza(id, updates, forceRefresh = false) {
        const list = (await this.getFinanzas()).data;
        const index = list.findIndex(f => f.id === id);
        if (index === -1) return { data: null, error: 'Movimiento no encontrado' };

        const updated = this.normalizeFinanza({ ...list[index], ...updates });
        list[index] = updated;
        this.setLocal('finanzas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('presupuesto').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateFinanza error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async deleteFinanza(id, forceRefresh = false) {
        let list = (await this.getFinanzas()).data;
        list = list.filter(f => f.id !== id);
        this.setLocal('finanzas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('presupuesto').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteFinanza error:', e);
            }
        }
        return { error: null };
    }

    // ==================== PROVEEDORES & COTIZACIONES ====================
    async getProveedores(forceRefresh = false) {
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('cotizaciones').select('*').order('created_at', { ascending: false });
                if (!error && data) {
                    const mapped = data.map(p => this.normalizeProveedor(p));
                    this.setLocal('proveedores', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getProveedores error:', e);
            }
        }
        const local = this.getLocal('proveedores', [
            {
                id: 'prov-1',
                nombre: 'Hacienda La Esmeralda',
                proveedor: 'Hacienda La Esmeralda',
                categoria: 'Lugar y Salón',
                servicio: 'Lugar y Salón',
                monto: 11500000,
                monto_cotizado: 11500000,
                servicios_incluidos: 'Salón principal, jardines ceremoniales, suite nupcial, parqueaderos.',
                contacto_nombre: 'Carolina Duque',
                telefono: '+57 310 999 1122',
                email: 'eventos@laesmeralda.com',
                estado: 'contratado',
                pros: 'Hermosos jardines, exclusividad del día',
                contras: 'Horario límite 02:30 AM'
            },
            {
                id: 'prov-2',
                nombre: 'Lumière Studio Fotografía',
                proveedor: 'Lumière Studio Fotografía',
                categoria: 'Fotografía y Video',
                servicio: 'Fotografía y Video',
                monto: 4500000,
                monto_cotizado: 4500000,
                servicios_incluidos: 'Cobertura 10 horas, 2 fotógrafos, drone, álbum impreso 50 páginas.',
                contacto_nombre: 'Andrés Morales',
                telefono: '+57 312 888 4433',
                email: 'contacto@lumiere.co',
                estado: 'confirmado',
                pros: 'Excelente portafolio, entrega en 15 días',
                contras: 'Requiere viáticos fuera de la ciudad'
            }
        ]);
        return { data: local.map(p => this.normalizeProveedor(p)), error: null };
    }

    normalizeProveedor(p) {
        return {
            id: p.id,
            nombre: p.nombre || p.proveedor || '',
            proveedor: p.proveedor || p.nombre || '',
            categoria: p.categoria || p.servicio || 'General',
            servicio: p.servicio || p.categoria || 'General',
            monto: parseFloat(p.monto || p.monto_cotizado || 0),
            monto_cotizado: parseFloat(p.monto_cotizado || p.monto || 0),
            servicios_incluidos: p.servicios_incluidos || '',
            contacto_nombre: p.contacto_nombre || '',
            telefono: p.telefono || '',
            email: p.email || '',
            instagram_o_web: p.instagram_o_web || p.web || '',
            pros: p.pros || '',
            contras: p.contras || '',
            estado: (p.estado || 'en evaluación').toLowerCase(),
            notas: p.notas || ''
        };
    }

    async addProveedor(proveedor, forceRefresh = false) {
        const list = (await this.getProveedores()).data;
        const normalized = this.normalizeProveedor({
            ...proveedor,
            id: this.generateId('prov'),
            created_at: new Date().toISOString()
        });
        list.unshift(normalized);
        this.setLocal('proveedores', list);

        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = normalized;
                const { data } = await this.supabase.from('cotizaciones').insert([dataToInsert]).select().single();
                if (data) normalized.id = data.id;
            } catch (e) {
                console.warn('Supabase addProveedor error:', e);
            }
        }
        return { data: normalized, error: null };
    }

    async updateProveedor(id, updates, forceRefresh = false) {
        const list = (await this.getProveedores()).data;
        const index = list.findIndex(p => p.id === id);
        if (index === -1) return { data: null, error: 'Proveedor no encontrado' };

        const updated = this.normalizeProveedor({ ...list[index], ...updates });
        list[index] = updated;
        this.setLocal('proveedores', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('cotizaciones').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateProveedor error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async deleteProveedor(id, forceRefresh = false) {
        let list = (await this.getProveedores()).data;
        list = list.filter(p => p.id !== id);
        this.setLocal('proveedores', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('cotizaciones').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteProveedor error:', e);
            }
        }
        return { error: null };
    }

    async transferProveedorToPresupuesto(proveedorId) {
        const proveedores = (await this.getProveedores()).data;
        const prov = proveedores.find(p => p.id === proveedorId);
        if (!prov) return { error: 'Proveedor no encontrado' };

        prov.estado = 'contratado';
        await this.updateProveedor(prov.id, prov);

        const finanzaItem = {
            concepto: `${prov.nombre} (${prov.servicios_incluidos ? prov.servicios_incluidos.substring(0, 40) + '...' : 'Servicio contratado'})`,
            categoria: prov.categoria,
            monto: prov.monto,
            tipo: 'gasto',
            pagado: 0,
            estado_pago: 'Pendiente',
            proveedor_asociado: prov.nombre,
            notas: `Traspasado automáticamente desde Proveedores. Contacto: ${prov.contacto_nombre || ''} ${prov.telefono || ''}`
        };

        return await this.addFinanza(finanzaItem);
    }

    // ==================== TAREAS & CRONOGRAMA ====================
    async getTareas(forceRefresh = false) {
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('actividades').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    const mapped = data.map(t => this.normalizeTarea(t));
                    this.setLocal('tareas', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getTareas error:', e);
            }
        }
        const local = this.getLocal('tareas', [
            { id: 'tar-1', titulo: 'Definir el presupuesto total y número estimado de invitados', fase: '12 a 9 Meses Antes', prioridad: 'alta', completada: true, responsable: 'Ambos' },
            { id: 'tar-2', titulo: 'Elegir y reservar el lugar de la ceremonia y recepción', fase: '12 a 9 Meses Antes', prioridad: 'alta', completada: true, responsable: 'Ambos' },
            { id: 'tar-3', titulo: 'Contratar fotógrafo y videógrafo oficial', fase: '8 a 6 Meses Antes', prioridad: 'alta', completada: true, responsable: 'Ambos' },
            { id: 'tar-4', titulo: 'Elegir y probar vestido de novia y traje de novio', fase: '5 a 3 Meses Antes', prioridad: 'media', completada: false, responsable: 'Novia' },
            { id: 'tar-5', titulo: 'Enviar invitaciones digitales y habilitar confirmaciones', fase: '2 a 1 Mes Antes', prioridad: 'alta', completada: false, responsable: 'Ambos' }
        ]);
        return { data: local.map(t => this.normalizeTarea(t)), error: null };
    }

    normalizeTarea(t) {
        return {
            id: t.id,
            titulo: t.titulo || '',
            fase: t.fase || 'General',
            prioridad: (t.prioridad || 'media').toLowerCase(),
            completada: t.completada === true,
            responsable: t.responsable || 'Ambos',
            fecha_limite: t.fecha_limite || '',
            notas: t.notas || ''
        };
    }

    async addTarea(tarea, forceRefresh = false) {
        const list = (await this.getTareas()).data;
        const normalized = this.normalizeTarea({
            ...tarea,
            id: this.generateId('tar'),
            created_at: new Date().toISOString()
        });
        list.push(normalized);
        this.setLocal('tareas', list);

        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = normalized;
                const { data } = await this.supabase.from('actividades').insert([dataToInsert]).select().single();
                if (data) normalized.id = data.id;
            } catch (e) {
                console.warn('Supabase addTarea error:', e);
            }
        }
        return { data: normalized, error: null };
    }

    async updateTarea(id, updates, forceRefresh = false) {
        const list = (await this.getTareas()).data;
        const index = list.findIndex(t => t.id === id);
        if (index === -1) return { data: null, error: 'Tarea no encontrada' };

        const updated = this.normalizeTarea({ ...list[index], ...updates });
        list[index] = updated;
        this.setLocal('tareas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('actividades').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateTarea error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async toggleTarea(tarea) {
        return await this.updateTarea(tarea.id, { completada: !tarea.completada });
    }

    async deleteTarea(id, forceRefresh = false) {
        let list = (await this.getTareas()).data;
        list = list.filter(t => t.id !== id);
        this.setLocal('tareas', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('actividades').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteTarea error:', e);
            }
        }
        return { error: null };
    }

    // ==================== DESEOS & DEDICATORIAS ====================
    async getDeseos(forceRefresh = true) {
        // Always fetch from Supabase if ready, regardless of forceRefresh
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('dedicatorias').select('*').order('created_at', { ascending: false });
                if (!error && data) {
                    const mapped = data.map(d => this.normalizeDeseo(d));
                    this.setLocal('deseos', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getDeseos error:', e);
            }
        }
        const local = this.getLocal('deseos', [
            { id: 'des-1', nombre: 'Carlos Mendoza', autor: 'Carlos Mendoza', texto: '¡Muchas felicidades a los novios! Que este sea el inicio de una vida llena de felicidad y bendiciones.', mensaje: '¡Muchas felicidades a los novios! Que este sea el inicio de una vida llena de felicidad y bendiciones.', cancion_sugerida: 'Vivir Mi Vida - Marc Anthony', aprobado: true, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: 'des-2', nombre: 'Mafe Ruiz', autor: 'Mafe Ruiz', texto: '¡Los novios más hermosos del mundo! Los amo con todo mi corazón. 💖', mensaje: '¡Los novios más hermosos del mundo! Los amo con todo mi corazón. 💖', cancion_sugerida: "Can't Take My Eyes Off You", aprobado: true, created_at: new Date(Date.now() - 86400000).toISOString() }
        ]);
        return { data: local.map(d => this.normalizeDeseo(d)), error: null };
    }

    normalizeDeseo(d) {
        return {
            id: d.id,
            nombre: d.nombre || d.autor || 'Anónimo',
            autor: d.autor || d.nombre || 'Anónimo',
            texto: d.texto || d.mensaje || '',
            mensaje: d.mensaje || d.texto || '',
            cancion_sugerida: d.cancion_sugerida || '',
            aprobado: d.aprobado !== false,
            created_at: d.created_at || new Date().toISOString()
        };
    }

    async addDeseo(deseo) {
        const list = (await this.getDeseos()).data;
        const normalized = this.normalizeDeseo({
            ...deseo,
            id: this.generateId('des'),
            created_at: new Date().toISOString()
        });
        list.unshift(normalized);
        this.setLocal('deseos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = normalized;
                const { data } = await this.supabase.from('dedicatorias').insert([dataToInsert]).select().single();
                if (data) normalized.id = data.id;
            } catch (e) {
                console.warn('Supabase addDeseo error:', e);
            }
        }
        return { data: normalized, error: null };
    }

    async updateDeseo(id, updates) {
        const list = (await this.getDeseos()).data;
        const index = list.findIndex(d => d.id === id);
        if (index === -1) return { data: null, error: 'Deseo no encontrado' };

        const updated = this.normalizeDeseo({ ...list[index], ...updates });
        list[index] = updated;
        this.setLocal('deseos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('dedicatorias').update(updated).eq('id', id);
            } catch (e) {
                console.warn('Supabase updateDeseo error:', e);
            }
        }
        return { data: updated, error: null };
    }

    async deleteDeseo(id) {
        let list = (await this.getDeseos()).data;
        list = list.filter(d => d.id !== id);
        this.setLocal('deseos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('dedicatorias').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteDeseo error:', e);
            }
        }
        return { error: null };
    }

    // ==================== CANCIONES SUGERIDAS ====================
    async getCanciones(forceRefresh = false) {
        if (this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('canciones_sugeridas').select('*').order('created_at', { ascending: false });
                if (!error && data) {
                    this.setLocal('canciones', data);
                    return { data, error: null };
                }
            } catch (e) {
                console.warn('Supabase getCanciones error:', e);
            }
        }
        const local = this.getLocal('canciones', [
            { id: 'can-1', titulo: 'Vivir Mi Vida - Marc Anthony', invitado: 'Carlos Mendoza', created_at: new Date().toISOString() },
            { id: 'can-2', titulo: "Can't Take My Eyes Off You - Frankie Valli", invitado: 'Mafe Ruiz', created_at: new Date().toISOString() }
        ]);
        return { data: local, error: null };
    }

    async addCancion(cancion, forceRefresh = false) {
        const list = (await this.getCanciones()).data;
        const newCancion = {
            ...cancion,
            id: this.generateId('can'),
            created_at: new Date().toISOString()
        };
        list.unshift(newCancion);
        this.setLocal('canciones', list);

        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = newCancion;
                await this.supabase.from('canciones_sugeridas').insert([dataToInsert]);
            } catch (e) {
                console.warn('Supabase addCancion error:', e);
            }
        }
        return { data: newCancion, error: null };
    }

    async deleteCancion(id, forceRefresh = false) {
        let list = (await this.getCanciones()).data;
        list = list.filter(c => c.id !== id);
        this.setLocal('canciones', list);

        if (this.isReady()) {
            try {
                await this.supabase.from('canciones_sugeridas').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteCancion error:', e);
            }
        }
        return { error: null };
    }

    // ==================== ÁLBUM DE FOTOS & CHAT ====================
    async getFotos(limit = 100, soloAprobadas = false, forceRefresh = true) {
        // Always fetch from Supabase if ready, regardless of forceRefresh
        if (this.isReady()) {
            try {
                let query = this.supabase.from('album_fotos').select('*').order('created_at', { ascending: false });
                if (soloAprobadas) query = query.eq('aprobada', true);
                if (limit) query = query.limit(limit);
                const { data, error } = await query;
                if (!error && data) {
                    const mapped = data.map(f => this.normalizeFoto(f));
                    this.setLocal('fotos', mapped);
                    return { data: mapped, error: null };
                }
            } catch (e) {
                console.warn('Supabase getFotos error:', e);
            }
        }
        let local = this.getLocal('fotos', [
            {
                id: 'foto-1',
                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                foto_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                titulo: '¡Listos para celebrar! ✨',
                pie_de_foto: '¡Listos para celebrar! ✨',
                nombre_subidor: 'Damas de Honor',
                autor_nombre: 'Damas de Honor',
                aprobada: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'foto-2',
                url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                foto_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                titulo: 'Brindis con el novio 🥂',
                pie_de_foto: 'Brindis con el novio 🥂',
                nombre_subidor: 'Padrinos',
                autor_nombre: 'Padrinos',
                aprobada: true,
                created_at: new Date().toISOString()
            }
        ]);

        if (soloAprobadas) {
            local = local.filter(f => f.aprobada !== false);
        }
        return { data: local.map(f => this.normalizeFoto(f)), error: null };
    }

    normalizeFoto(f) {
        return {
            id: f.id,
            url: f.url || f.foto_url || '',
            foto_url: f.foto_url || f.url || '',
            titulo: f.titulo || f.pie_de_foto || '',
            pie_de_foto: f.pie_de_foto || f.titulo || '',
            nombre_subidor: f.nombre_subidor || f.autor_nombre || 'Invitado',
            autor_nombre: f.autor_nombre || f.nombre_subidor || 'Invitado',
            aprobada: f.aprobada !== false,
            created_at: f.created_at || new Date().toISOString()
        };
    }

    async uploadFoto(fileOrBase64, metadata = {}, forceRefresh = false) {
        let photoUrl = '';
        let fileToUpload = fileOrBase64;

        // Comprimir imagen si es un File
        if (fileOrBase64 instanceof File) {
            fileToUpload = await this.compressImage(fileOrBase64);
        }

        if (typeof fileToUpload === 'string') {
            photoUrl = fileToUpload;
        } else if (fileToUpload instanceof File || fileToUpload instanceof Blob) {
            if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
                try {
                    const fileExt = (fileToUpload.name || 'image.jpg').split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `album/${fileName}`;

                    const { error: uploadError } = await this.supabase.storage.from('fotos').upload(filePath, fileToUpload);
                    if (!uploadError) {
                        const { data: urlData } = this.supabase.storage.from('fotos').getPublicUrl(filePath);
                        photoUrl = urlData.publicUrl;
                    }
                } catch (e) {
                    console.warn('Storage upload error, fallback to data URL:', e);
                }
            }

            if (!photoUrl) {
                photoUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(fileToUpload);
                });
            }
        }

        const newFoto = this.normalizeFoto({
            id: this.generateId('foto'),
            url: photoUrl,
            foto_url: photoUrl,
            titulo: metadata.titulo || metadata.pie_de_foto || '',
            pie_de_foto: metadata.pie_de_foto || metadata.titulo || '',
            nombre_subidor: metadata.nombre || metadata.autor_nombre || 'Invitado Especial',
            autor_nombre: metadata.autor_nombre || metadata.nombre || 'Invitado Especial',
            aprobada: true, // Visible de inmediato
            created_at: new Date().toISOString()
        });

        const list = (await this.getFotos(100, false)).data;
        list.unshift(newFoto);
        this.setLocal('fotos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                const { id, ...dataToInsert } = newFoto;
                const { data } = await this.supabase.from('album_fotos').insert([dataToInsert]).select().single();
                if (data) newFoto.id = data.id;
            } catch (e) {
                console.warn('Supabase addFoto error:', e);
            }
        }

        return { data: newFoto, error: null };
    }

    async toggleAprobarFoto(id, forceRefresh = false) {
        const list = (await this.getFotos(100, false)).data;
        const index = list.findIndex(f => f.id === id);
        if (index === -1) return { data: null, error: 'Foto no encontrada' };

        list[index].aprobada = !list[index].aprobada;
        this.setLocal('fotos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('album_fotos').update({ aprobada: list[index].aprobada }).eq('id', id);
            } catch (e) {
                console.warn('Supabase toggleAprobarFoto error:', e);
            }
        }
        return { data: list[index], error: null };
    }

    async deleteFoto(id, forceRefresh = false) {
        let list = (await this.getFotos(100, false)).data;
        list = list.filter(f => f.id !== id);
        this.setLocal('fotos', list);

        if (forceRefresh && this.isReady()) {
            try {
                const { data, error } = await this.supabase.from('boda_config').select('*').limit(1).single();
                if (!error && data) {
                    const merged = { ...DEFAULT_CONFIG, ...data };
                    this.setLocal('config', merged);
                    return { data: merged, error: null };
                }
            } catch (e) {
                console.warn('Supabase getConfig error (forced):', e);
            }
        }
        if (this.isReady()) {
            try {
                await this.supabase.from('album_fotos').delete().eq('id', id);
            } catch (e) {
                console.warn('Supabase deleteFoto error:', e);
            }
        }
        return { error: null };
    }

    // ==================== GENERADOR DE ÁLBUM IMPRIMIBLE ====================
    async generatePrintableAlbumWindow() {
        const config = (await this.getConfiguracion()).data || DEFAULT_CONFIG;
        const photos = (await this.getFotos(100, true)).data || [];

        const novia = config.novia_nombre || 'Valentina';
        const novio = config.novio_nombre || 'Sebastián';
        const fechaStr = config.fecha_boda ? new Date(config.fecha_boda).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : (config.fecha || '');
        const heroImg = config.hero_image_url || config.fondo || '';

        const albumWindow = window.open('', '_blank');
        if (!albumWindow) {
            alert('Por favor permite abrir ventanas emergentes para ver el álbum imprimible.');
            return;
        }

        const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Álbum de Recuerdos de Boda 💍 | ${escapeHtml(novia)} & ${escapeHtml(novio)}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #e5e7eb; color: #1f2937; line-height: 1.5; }
        
        .no-print-bar {
            position: sticky; top: 0; z-index: 1000; background: #0F4C3A; color: #ffffff;
            padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-bottom: 3px solid #D4AF37;
        }
        .btn-print {
            background: linear-gradient(135deg, #e2c56a 0%, #D4AF37 100%); color: #0b110e;
            font-weight: 700; border: none; padding: 0.65rem 1.75rem; border-radius: 8px; cursor: pointer;
            font-size: 0.95rem; box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .btn-print:hover { background: #e2c56a; }
        
        .album-book { width: 100%; max-width: 850px; margin: 2rem auto; }
        .page {
            background: #ffffff; width: 100%; min-height: 1050px; padding: 3.5rem 3rem 4.5rem;
            margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            page-break-after: always; display: flex; flex-direction: column; justify-content: space-between;
            border: 1px solid rgba(212,175,55,0.3);
        }
        .cover-page {
            text-align: center; justify-content: center; align-items: center;
            background: linear-gradient(180deg, #ffffff 0%, #f6f9f7 100%); border: 3px double #D4AF37;
            padding: 4rem 3rem;
        }
        .cover-monogram { font-size: 2.5rem; margin-bottom: 1rem; }
        .cover-title { font-family: 'Playfair Display', serif; font-size: 3rem; color: #0F4C3A; margin-bottom: 0.5rem; }
        .cover-names { font-family: 'Playfair Display', serif; font-size: 3.8rem; color: #a38125; margin-bottom: 1.5rem; }
        .cover-hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; border: 2px solid #D4AF37; margin-bottom: 2rem; }
        .cover-date { font-size: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #0F4C3A; margin-bottom: 1rem; }
        .cover-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.35rem; color: #4b5563; max-width: 600px; }
        
        .photo-page-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .photo-frame { width: 100%; max-height: 650px; object-fit: contain; border-radius: 8px; border: 1px solid #D4AF37; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .photo-caption { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-style: italic; text-align: center; margin-bottom: 0.5rem; }
        .photo-author { font-size: 0.95rem; font-weight: 600; color: #0F4C3A; text-align: center; }
        
        .page-footer {
            border-top: 1px solid rgba(212,175,55,0.4); padding-top: 0.8rem;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.8rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em;
        }
        
        @media print {
            .no-print-bar { display: none !important; }
            body { background: #ffffff !important; }
            .album-book { max-width: 100% !important; margin: 0 !important; }
            .page { box-shadow: none !important; border: none !important; border-radius: 0 !important; margin: 0 !important; min-height: 100vh !important; }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <div>
            <strong style="font-size: 1.15rem; color: #efdc9d;">💍 Álbum de Recuerdos de Boda</strong>
            <span style="font-size: 0.85rem; color: #d7ede4; margin-left: 1rem;">${photos.length} fotos aprobadas listas para guardar o imprimir</span>
        </div>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar en PDF</button>
    </div>

    <div class="album-book">
        <!-- Portada -->
        <div class="page cover-page">
            <div class="cover-monogram">💍 ✨ 🕊️</div>
            <h2 class="cover-title">Álbum de Recuerdos</h2>
            <h1 class="cover-names">${escapeHtml(novia)} & ${escapeHtml(novio)}</h1>
            ${heroImg ? `<img src="${escapeHtml(heroImg)}" class="cover-hero-img">` : ''}
            <div class="cover-date">${escapeHtml(fechaStr)}</div>
            <p class="cover-quote">"${escapeHtml(config.frase_amor || 'El amor no se mira, se siente.')}"</p>
        </div>

        <!-- Hojas de Fotos -->
        ${photos.length === 0 ? `
            <div class="page" style="justify-content: center; align-items: center; text-align: center;">
                <p style="color: #6b7280; font-size: 1.2rem;">No hay fotos aprobadas en el álbum todavía.</p>
            </div>
        ` : photos.map((p, idx) => `
            <div class="page">
                <div class="photo-page-content">
                    <img src="${escapeHtml(p.url || p.foto_url)}" class="photo-frame">
                    ${p.titulo || p.pie_de_foto ? `<div class="photo-caption">"${escapeHtml(p.titulo || p.pie_de_foto)}"</div>` : ''}
                    <div class="photo-author">📸 Fotografía por: ${escapeHtml(p.nombre_subidor || p.autor_nombre)}</div>
                </div>
                <div class="page-footer">
                    <span>Boda ${escapeHtml(novia)} & ${escapeHtml(novio)}</span>
                    <span>${escapeHtml(fechaStr)}</span>
                    <span>Página ${idx + 2}</span>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>
        `;

        albumWindow.document.open();
        albumWindow.document.write(html);
        albumWindow.document.close();
    }

    // ==================== DASHBOARD STATS ====================
    async getStats() {
        const [invitadosRes, mesasRes, finanzasRes, tareasRes, fotosRes] = await Promise.all([
            this.getInvitados(),
            this.getMesas(),
            this.getFinanzas(),
            this.getTareas(),
            this.getFotos(100, false)
        ]);

        const invitados = invitadosRes.data || [];
        const mesas = mesasRes.data || [];
        const finanzas = finanzasRes.data || [];
        const tareas = tareasRes.data || [];
        const fotos = fotosRes.data || [];

        const totalInvitados = invitados.length;
        const confirmados = invitados.filter(i => i.asistira === true).length;
        const pendientes = invitados.filter(i => i.asistira === null || i.asistira === undefined).length;
        const noAsistiran = invitados.filter(i => i.asistira === false).length;

        const totalPresupuesto = finanzas.filter(f => f.tipo === 'ingreso').reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0);
        const totalGastos = finanzas.filter(f => f.tipo === 'gasto').reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0);
        const saldo = totalPresupuesto - totalGastos;

        const tareasCompletadas = tareas.filter(t => t.completada).length;

        return {
            data: {
                totalInvitados,
                confirmados,
                pendientes,
                noAsistiran,
                totalMesas: mesas.length,
                totalFotos: fotos.length,
                totalPresupuesto,
                totalGastos,
                saldo,
                tareasCompletadas,
                totalTareas: tareas.length,
                porcentajeConfirmados: totalInvitados > 0 ? Math.round((confirmados / totalInvitados) * 100) : 0,
                porcentajeTareas: tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0
            },
            error: null
        };
    }
}

// Global Exports
window.supabaseClient = new SupabaseClient();
window.BANCOS_COLOMBIA = BANCOS_COLOMBIA;
window.THEME_PRESETS = THEME_PRESETS;
