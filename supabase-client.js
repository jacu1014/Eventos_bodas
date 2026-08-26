/**
 * ==============================================================================
 * SERVICIO DE DATOS Y CONEXIÓN SUPABASE / LOCALSTORAGE 💍✨
 * Versión 4.0: Múltiples Cuentas Bancarias, Álbum Imprimible y Pausa de Emergencia
 * ==============================================================================
 */

// Claves de almacenamiento local
const STORAGE_KEYS = {
    CONFIG: 'boda_config',
    INVITADOS: 'boda_invitados',
    PRESUPUESTO: 'boda_presupuesto',
    COTIZACIONES: 'boda_cotizaciones',
    ACTIVIDADES: 'boda_actividades',
    COMPRAS: 'boda_compras',
    ITINERARIO: 'boda_itinerario',
    DEDICATORIAS: 'boda_dedicatorias',
    ALBUM_FOTOS: 'boda_album_fotos',
    ALBUM_CHAT: 'boda_album_chat',
    SUPABASE_URL: 'boda_supabase_url',
    SUPABASE_KEY: 'boda_supabase_key',
    AUTH_STATE: 'boda_auth_session'
};

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

// Datos por defecto
const DEFAULT_DATA = {
    config: {
        id: '1',
        novia_nombre: 'Valentina',
        novio_nombre: 'Sebastián',
        frase_amor: 'El amor no se mira, se siente, y aún más cuando ustedes nos acompañan a celebrarlo.',
        fecha_boda: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T16:00:00',
        lugar_ceremonia: 'Capilla Nuestra Señora del Carmen',
        lugar_recepcion: 'Hacienda Campestre La Esmeralda',
        direccion_ceremonia: 'Calle 10 # 5-20, Zona Colonial',
        direccion_recepcion: 'Km 12 Vía Campestre, Valle Verde',
        maps_ceremonia_url: 'https://maps.google.com/?q=Capilla+Nuestra+Señora+del+Carmen',
        maps_recepcion_url: 'https://maps.google.com/?q=Hacienda+Campestre+La+Esmeralda',
        dress_code: 'Formal / Etiqueta Rigurosa (Traje oscuro para caballeros y vestido largo para damas)',
        presupuesto_objetivo: 45000000,
        moneda_simbolo: '$',
        mensaje_bienvenida: '¡Nos casamos! Nos llena de felicidad compartir este momento tan significativo con las personas que forman parte de nuestra historia. ¡Te esperamos para celebrar el amor!',
        admin_pin: '1234',

        // Información Bancaria (Frase + Múltiples Cuentas)
        frase_regalos: 'Tu presencia y cariño en este día son nuestro mayor regalo. Si deseas hacernos un detalle para nuestro nuevo hogar y luna de miel, dispondremos de buzón de sobres el día del evento o puedes hacerlo mediante transferencia a cualquiera de nuestras cuentas:',
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

        // Personalización de Paleta de Colores de la Web (3 Colores)
        theme_palette_preset: 'emerald_gold',
        theme_primary_color: '#0F4C3A',
        theme_accent_color: '#D4AF37',
        theme_bg_color: '#F6F9F7',

        // Paleta de Colores para el Código de Vestimenta
        dress_code_colors: [
            { name: 'Verde Esmeralda', hex: '#0F4C3A' },
            { name: 'Verde Bosque', hex: '#165B46' },
            { name: 'Dorado Champaña', hex: '#D4AF37' },
            { name: 'Verde Salvia', hex: '#88CBB3' },
            { name: 'Blanco Marfil', hex: '#FAFAF7' }
        ],

        // Ajuste de Imágenes
        image_fit_mode: 'cover',

        // Imágenes Principales
        hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
        ceremonia_image_url: 'https://images.unsplash.com/photo-1545232979-fbf6783d8e57?auto=format&fit=crop&w=800&q=80',
        recepcion_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        
        // Galería de los Novios
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

        // Configuración y Control del Álbum Compartido
        album_habilitado_siempre: false,
        album_pausado: false,
        descarga_publica_habilitada: false
    },
    invitados: [
        {
            id: 'inv-1',
            nombre_completo: 'Carlos Mendoza & Esposa',
            grupo: 'Familia Novia',
            pases_adultos: 2,
            pases_ninos: 0,
            estado_rsvp: 'Confirmado',
            pases_confirmados: 2,
            mesa_asignada: 'Mesa 1 (Familia)',
            restricciones_dieteticas: 'Ninguna',
            alergias_detalle: '',
            telefono: '+57 300 123 4567',
            email: 'carlos@example.com',
            cancion_sugerida: 'Vivir Mi Vida - Marc Anthony',
            mensaje_dedicatoria: '¡Muchas felicidades a los novios! Que Dios bendiga su nuevo hogar.',
            es_corte_honor: false,
            invitacion_enviada: true,
            confirmado_por_web: true,
            created_at: new Date().toISOString()
        },
        {
            id: 'inv-2',
            nombre_completo: 'María Fernanda Ruiz',
            grupo: 'Corte de Honor',
            pases_adultos: 1,
            pases_ninos: 0,
            estado_rsvp: 'Confirmado',
            pases_confirmados: 1,
            mesa_asignada: 'Mesa Principal',
            restricciones_dieteticas: 'Vegetariano',
            alergias_detalle: 'No come carnes rojas ni pollo',
            telefono: '+57 311 987 6543',
            email: 'mafe@example.com',
            cancion_sugerida: 'Danza Kuduro - Don Omar',
            mensaje_dedicatoria: '¡La mejor dama de honor para la novia más hermosa! Los amo.',
            es_corte_honor: true,
            invitacion_enviada: true,
            confirmado_por_web: true,
            created_at: new Date().toISOString()
        }
    ],
    presupuesto: [
        {
            id: 'pres-1',
            categoria: 'Lugar y Salón',
            concepto: 'Alquiler de Hacienda (Ceremonia + Recepción)',
            costo_estimado: 12000000,
            costo_real: 11500000,
            monto_pagado: 5750000,
            fecha_limite_pago: '2026-10-15',
            proveedor_asociado: 'Hacienda La Esmeralda',
            estado_pago: 'Anticipo Parcial',
            notas: 'Incluye suite nupcial y parqueaderos'
        },
        {
            id: 'pres-2',
            categoria: 'Catering y Bebidas',
            concepto: 'Banquete 3 tiempos + Cóctel + Barra Libre (100 personas)',
            costo_estimado: 14000000,
            costo_real: 13500000,
            monto_pagado: 6750000,
            fecha_limite_pago: '2026-11-01',
            proveedor_asociado: 'Gourmet Eventos Catering',
            estado_pago: 'Anticipo Parcial',
            notas: 'Prueba de menú realizada y aprobada'
        }
    ],
    cotizaciones: [
        {
            id: 'cot-1',
            proveedor: 'Hacienda La Esmeralda',
            categoria: 'Lugar y Salón',
            monto_cotizado: 11500000,
            servicios_incluidos: 'Salón principal, jardines ceremoniales, suite nupcial, parqueaderos vigilados, planta eléctrica.',
            contacto_nombre: 'Carolina Duque',
            telefono: '+57 310 999 1122',
            email: 'eventos@laesmeralda.com',
            instagram_o_web: '@haciendalaesmeralda',
            pros: 'Ubicación campestre hermosa, hermosos jardines para fotos, exclusividad del día.',
            contras: 'Horario máximo hasta las 02:30 AM.',
            estado: 'Contratado',
            es_favorito: true,
            notas: 'Contrato firmado con 50% de anticipo'
        }
    ],
    actividades: [
        {
            id: 'act-1',
            titulo: 'Definir el presupuesto total y número estimado de invitados',
            fase: '12 a 9 Meses Antes',
            fecha_limite: '2026-05-15',
            responsable: 'Ambos',
            prioridad: 'Alta',
            completada: true,
            notas: 'Meta fijada en $45.000.000 y 100 invitados.'
        },
        {
            id: 'act-2',
            titulo: 'Elegir y reservar el lugar de la ceremonia y recepción',
            fase: '12 a 9 Meses Antes',
            fecha_limite: '2026-06-01',
            responsable: 'Ambos',
            prioridad: 'Alta',
            completada: true,
            notas: 'Hacienda La Esmeralda reservada.'
        }
    ],
    compras: [
        {
            id: 'cmp-1',
            articulo: 'Copas de cristal grabadas para el brindis de novios',
            categoria: 'Ceremonia y Brindis',
            cantidad: 2,
            tienda_sugerida: 'Cristalería Fina / Tienda Nupcial',
            costo_estimado: 120000,
            comprado: true,
            responsable: 'Novia',
            enlace_compra: ''
        }
    ],
    itinerario: [
        {
            id: 'it-1',
            hora: '15:00',
            actividad: 'Ceremonia Religiosa / Simbólica',
            lugar: 'Capilla Ntra. Señora del Carmen',
            responsables: 'Todos los Invitados y Cortejo',
            detalles: 'Entrada del cortejo, intercambio de votos y anillos.',
            orden: 1
        }
    ],
    dedicatorias: [
        {
            id: 'ded-1',
            autor: 'Carlos Mendoza',
            mensaje: '¡Muchas felicidades a los novios! Que este sea el inicio de una vida llena de complicidad, amor y felicidad.',
            cancion_sugerida: 'Vivir Mi Vida - Marc Anthony',
            publico: true,
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 'ded-2',
            autor: 'Mafe Ruiz',
            mensaje: '¡Los novios más hermosos del planeta! Los amo con todo mi corazón.',
            cancion_sugerida: 'Can\'t Take My Eyes Off You',
            publico: true,
            created_at: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
            id: 'ded-3',
            autor: 'Familia Gómez',
            mensaje: 'Que el amor, la paciencia y la alegría reinen por siempre en su hogar.',
            cancion_sugerida: 'Todo Cambió - Camila',
            publico: true,
            created_at: new Date().toISOString()
        }
    ],
    album_fotos: [
        {
            id: 'foto-1',
            autor_nombre: 'Damas de Honor',
            foto_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            pie_de_foto: '¡Listos para el momento más esperado! ✨',
            aprobada: true,
            descarga_permitida: true,
            created_at: new Date().toISOString()
        },
        {
            id: 'foto-2',
            autor_nombre: 'Padrinos',
            foto_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            pie_de_foto: 'Brindando con el novio antes de la ceremonia 🥂',
            aprobada: true,
            descarga_permitida: true,
            created_at: new Date().toISOString()
        }
    ],
    album_chat: [
        {
            id: 'chat-1',
            autor_nombre: 'Mafe Ruiz',
            mensaje: '¡Qué fotos tan hermosas todos están subiendo! 😍',
            created_at: new Date().toISOString()
        },
        {
            id: 'chat-2',
            autor_nombre: 'Juan González',
            mensaje: '¡La hacienda quedó espectacular! Nos vemos en el cóctel 🍹',
            created_at: new Date().toISOString()
        }
    ]
};

const THEME_PRESETS = {
    emerald_gold: {
        name: 'Verde Esmeralda & Dorado (Oficial)',
        primary: '#0F4C3A',
        accent: '#D4AF37',
        bg: '#F6F9F7'
    },
    rose_gold: {
        name: 'Rosa Palo & Oro Rosa',
        primary: '#8B4F58',
        accent: '#D4A373',
        bg: '#FAF7F7'
    },
    midnight_gold: {
        name: 'Azul Medianoche & Oro Real',
        primary: '#102A43',
        accent: '#D4AF37',
        bg: '#F4F7FB'
    },
    burgundy_gold: {
        name: 'Vino Tinto / Borgoña & Dorado',
        primary: '#581825',
        accent: '#C5A059',
        bg: '#FAF5F6'
    },
    sage_copper: {
        name: 'Verde Eucalipto & Cobre Cálido',
        primary: '#3B5A4D',
        accent: '#C87D55',
        bg: '#F5FAF7'
    }
};

function applyWeddingTheme(config) {
    if (!config) return;

    const primary = config.theme_primary_color || '#0F4C3A';
    const accent = config.theme_accent_color || '#D4AF37';
    const bg = config.theme_bg_color || '#F6F9F7';

    const root = document.documentElement;
    root.style.setProperty('--emerald-900', adjustHexBrightness(primary, -20));
    root.style.setProperty('--emerald-800', primary);
    root.style.setProperty('--emerald-700', adjustHexBrightness(primary, 15));
    root.style.setProperty('--emerald-50', hexToRgba(primary, 0.08));

    root.style.setProperty('--gold-500', accent);
    root.style.setProperty('--gold-600', adjustHexBrightness(accent, -15));
    root.style.setProperty('--gold-400', adjustHexBrightness(accent, 15));
    root.style.setProperty('--gold-50', hexToRgba(accent, 0.08));

    root.style.setProperty('--bg-canvas', bg);
}

function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function adjustHexBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.max(0, (num >> 16) + percent));
    let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    let b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

class WeddingDataService {
    constructor() {
        this.supabaseClient = null;
        this.isOnlineSupabase = false;
        this.init();
    }

    init() {
        this.ensureLocalSeeds();
        this.connectSupabaseFromStorage();
    }

    connectSupabaseFromStorage() {
        const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
        const key = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);

        if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                this.supabaseClient = window.supabase.createClient(url.trim(), key.trim());
                this.isOnlineSupabase = true;
                console.log('✅ Conectado con Supabase');
            } catch (err) {
                console.warn('⚠️ Error cliente Supabase:', err);
                this.supabaseClient = null;
                this.isOnlineSupabase = false;
            }
        } else {
            this.supabaseClient = null;
            this.isOnlineSupabase = false;
        }
    }

    async configureSupabase(url, key) {
        if (!url || !key) {
            localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
            localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
            this.supabaseClient = null;
            this.isOnlineSupabase = false;
            return { success: true, message: 'Modo Local activado.' };
        }

        try {
            if (!window.supabase || typeof window.supabase.createClient !== 'function') {
                throw new Error('Supabase SDK no cargado.');
            }

            const client = window.supabase.createClient(url.trim(), key.trim());
            const { error } = await client.from('boda_config').select('*').limit(1);

            if (error && error.code !== 'PGRST116') {
                if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
                    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
                    localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
                    this.supabaseClient = client;
                    this.isOnlineSupabase = true;
                    return {
                        success: true,
                        warning: true,
                        message: '¡Conexión establecida! Corre el script SQL en Supabase para crear las tablas del álbum.'
                    };
                }
                throw error;
            }

            localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
            localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
            this.supabaseClient = client;
            this.isOnlineSupabase = true;

            return { success: true, message: '¡Conectado exitosamente con Supabase!' };
        } catch (error) {
            return { success: false, message: 'Error de conexión: ' + (error.message || 'Verifica credenciales.') };
        }
    }

    ensureLocalSeeds() {
        if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_DATA.config));
        } else {
            const current = this.getLocal(STORAGE_KEYS.CONFIG) || {};
            const merged = { ...DEFAULT_DATA.config, ...current };
            this.setLocal(STORAGE_KEYS.CONFIG, merged);
        }

        if (!localStorage.getItem(STORAGE_KEYS.INVITADOS)) {
            localStorage.setItem(STORAGE_KEYS.INVITADOS, JSON.stringify(DEFAULT_DATA.invitados));
        }
        if (!localStorage.getItem(STORAGE_KEYS.PRESUPUESTO)) {
            localStorage.setItem(STORAGE_KEYS.PRESUPUESTO, JSON.stringify(DEFAULT_DATA.presupuesto));
        }
        if (!localStorage.getItem(STORAGE_KEYS.COTIZACIONES)) {
            localStorage.setItem(STORAGE_KEYS.COTIZACIONES, JSON.stringify(DEFAULT_DATA.cotizaciones));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVIDADES)) {
            localStorage.setItem(STORAGE_KEYS.ACTIVIDADES, JSON.stringify(DEFAULT_DATA.actividades));
        }
        if (!localStorage.getItem(STORAGE_KEYS.COMPRAS)) {
            localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(DEFAULT_DATA.compras));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ITINERARIO)) {
            localStorage.setItem(STORAGE_KEYS.ITINERARIO, JSON.stringify(DEFAULT_DATA.itinerario));
        }
        if (!localStorage.getItem(STORAGE_KEYS.DEDICATORIAS)) {
            localStorage.setItem(STORAGE_KEYS.DEDICATORIAS, JSON.stringify(DEFAULT_DATA.dedicatorias));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ALBUM_FOTOS)) {
            localStorage.setItem(STORAGE_KEYS.ALBUM_FOTOS, JSON.stringify(DEFAULT_DATA.album_fotos));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ALBUM_CHAT)) {
            localStorage.setItem(STORAGE_KEYS.ALBUM_CHAT, JSON.stringify(DEFAULT_DATA.album_chat));
        }
    }

    getLocal(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    setLocal(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error guardando local:', e);
        }
    }

    generateId(prefix = 'id') {
        return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
    }

    // =========================================================================
    // CONFIGURACIÓN DE LA BODA
    // =========================================================================

    async getConfig() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('boda_config').select('*').limit(1);
                if (!error && data && data.length > 0) {
                    const merged = { ...DEFAULT_DATA.config, ...data[0] };
                    this.setLocal(STORAGE_KEYS.CONFIG, merged);
                    applyWeddingTheme(merged);
                    return merged;
                }
            } catch (e) {
                console.warn('Fallo getConfig Supabase, usando local:', e);
            }
        }
        const local = this.getLocal(STORAGE_KEYS.CONFIG) || DEFAULT_DATA.config;
        applyWeddingTheme(local);
        return local;
    }

    async saveConfig(configData) {
        const current = (await this.getConfig()) || {};
        const updated = { ...current, ...configData, updated_at: new Date().toISOString() };
        this.setLocal(STORAGE_KEYS.CONFIG, updated);
        applyWeddingTheme(updated);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (updated.id && !updated.id.startsWith('1')) {
                    await this.supabaseClient.from('boda_config').update(updated).eq('id', updated.id);
                } else {
                    const { id, ...toInsert } = updated;
                    const { data } = await this.supabaseClient.from('boda_config').insert([toInsert]).select();
                    if (data && data[0]) {
                        updated.id = data[0].id;
                        this.setLocal(STORAGE_KEYS.CONFIG, updated);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando config en Supabase:', e);
            }
        }
        return updated;
    }

    // =========================================================================
    // ÁLBUM DE FOTOS COMPARTIDO EN VIVO & CHAT DE INVITADOS
    // =========================================================================

    async getAlbumFotos(soloAprobadas = false) {
        let photos = [];
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                let query = this.supabaseClient.from('album_fotos').select('*').order('created_at', { ascending: false });
                if (soloAprobadas) {
                    query = query.eq('aprobada', true);
                }
                const { data, error } = await query;
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo getAlbumFotos Supabase:', e);
            }
        }
        photos = this.getLocal(STORAGE_KEYS.ALBUM_FOTOS) || [];
        if (soloAprobadas) {
            return photos.filter(p => p.aprobada !== false);
        }
        return photos;
    }

    async saveAlbumFoto(fotoData) {
        const list = await this.getAlbumFotos(false);
        const newItem = {
            id: this.generateId('foto'),
            autor_nombre: fotoData.autor_nombre || 'Invitado Especial',
            foto_url: fotoData.foto_url,
            pie_de_foto: fotoData.pie_de_foto || '',
            aprobada: true, // Visible de inmediato por solicitud del usuario
            descarga_permitida: true,
            created_at: new Date().toISOString()
        };

        list.unshift(newItem);
        this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { id, ...toInsert } = newItem;
                await this.supabaseClient.from('album_fotos').insert([toInsert]);
            } catch (e) {
                console.warn('Fallo guardando foto en Supabase:', e);
            }
        }
        return newItem;
    }

    async toggleAprobarFoto(id) {
        const list = await this.getAlbumFotos(false);
        const item = list.find(f => f.id === id);
        if (item) {
            item.aprobada = !item.aprobada;
            this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, list);

            if (this.isOnlineSupabase && this.supabaseClient) {
                try {
                    await this.supabaseClient.from('album_fotos').update({ aprobada: item.aprobada }).eq('id', id);
                } catch (e) {
                    console.warn('Fallo actualizando aprobación en Supabase:', e);
                }
            }
            return item;
        }
        return null;
    }

    async toggleDescargaFoto(id) {
        const list = await this.getAlbumFotos(false);
        const item = list.find(f => f.id === id);
        if (item) {
            item.descarga_permitida = !item.descarga_permitida;
            this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, list);

            if (this.isOnlineSupabase && this.supabaseClient) {
                try {
                    await this.supabaseClient.from('album_fotos').update({ descarga_permitida: item.descarga_permitida }).eq('id', id);
                } catch (e) {
                    console.warn('Fallo actualizando permiso de descarga en Supabase:', e);
                }
            }
            return item;
        }
        return null;
    }

    async deleteAlbumFoto(id) {
        let list = await this.getAlbumFotos(false);
        list = list.filter(f => f.id !== id);
        this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('album_fotos').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando foto en Supabase:', e);
            }
        }
        return true;
    }

    // Chat en Vivo del Álbum
    async getAlbumChat() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('album_chat').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.ALBUM_CHAT, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo getAlbumChat Supabase:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.ALBUM_CHAT) || [];
    }

    async sendAlbumChatMessage(chatData) {
        const list = await this.getAlbumChat();
        const msgItem = {
            id: this.generateId('chat'),
            autor_nombre: chatData.autor_nombre || 'Invitado',
            mensaje: chatData.mensaje,
            created_at: new Date().toISOString()
        };

        list.push(msgItem);
        this.setLocal(STORAGE_KEYS.ALBUM_CHAT, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { id, ...toInsert } = msgItem;
                await this.supabaseClient.from('album_chat').insert([toInsert]);
            } catch (e) {
                console.warn('Fallo enviando chat a Supabase:', e);
            }
        }
        return msgItem;
    }

    // =========================================================================
    // INVITADOS, PRESUPUESTO, COTIZACIONES, ACTIVIDADES, COMPRAS, ITINERARIO, DEDICATORIAS
    // =========================================================================

    async getInvitados() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('invitados').select('*').order('nombre_completo', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.INVITADOS, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getInvitados:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.INVITADOS) || [];
    }

    async saveInvitado(invitado) {
        const list = await this.getInvitados();
        let savedItem;

        if (invitado.id) {
            const index = list.findIndex(i => i.id === invitado.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...invitado, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...invitado, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...invitado,
                id: this.generateId('inv'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.INVITADOS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (invitado.id && !invitado.id.startsWith('inv-')) {
                    await this.supabaseClient.from('invitados').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('invitados').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(i => i.id === (invitado.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.INVITADOS, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando invitado en Supabase:', e);
            }
        }
        return savedItem;
    }

    async deleteInvitado(id) {
        let list = await this.getInvitados();
        list = list.filter(i => i.id !== id);
        this.setLocal(STORAGE_KEYS.INVITADOS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('invitados').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando invitado en Supabase:', e);
            }
        }
        return true;
    }

    async submitPublicRSVP(rsvpData) {
        const list = await this.getInvitados();
        const normalize = str => (str || '').toLowerCase().trim();
        const searchName = normalize(rsvpData.nombre_completo);

        let existing = list.find(i => normalize(i.nombre_completo) === searchName ||
            (rsvpData.telefono && i.telefono && normalize(i.telefono) === normalize(rsvpData.telefono)) ||
            (rsvpData.email && i.email && normalize(i.email) === normalize(rsvpData.email)));

        const payload = {
            nombre_completo: rsvpData.nombre_completo,
            estado_rsvp: rsvpData.estado_rsvp || 'Confirmado',
            pases_adultos: parseInt(rsvpData.pases_adultos) || 1,
            pases_ninos: parseInt(rsvpData.pases_ninos) || 0,
            pases_confirmados: rsvpData.estado_rsvp === 'Confirmado' ? (parseInt(rsvpData.pases_confirmados) || parseInt(rsvpData.pases_adultos) || 1) : 0,
            restricciones_dieteticas: rsvpData.restricciones_dieteticas || 'Ninguna',
            alergias_detalle: rsvpData.alergias_detalle || '',
            telefono: rsvpData.telefono || '',
            email: rsvpData.email || '',
            cancion_sugerida: rsvpData.cancion_sugerida || '',
            mensaje_dedicatoria: rsvpData.mensaje_dedicatoria || '',
            confirmado_por_web: true,
            updated_at: new Date().toISOString()
        };

        if (existing) {
            payload.id = existing.id;
            payload.grupo = existing.grupo || 'Amigos';
            payload.mesa_asignada = existing.mesa_asignada || 'Sin asignar';
        } else {
            payload.grupo = rsvpData.grupo || 'Invitados Web';
            payload.mesa_asignada = 'Sin asignar';
        }

        const savedGuest = await this.saveInvitado(payload);

        if (rsvpData.mensaje_dedicatoria && rsvpData.mensaje_dedicatoria.trim()) {
            await this.saveDedicatoria({
                autor: rsvpData.nombre_completo,
                mensaje: rsvpData.mensaje_dedicatoria.trim(),
                cancion_sugerida: rsvpData.cancion_sugerida || '',
                publico: true
            });
        }

        return savedGuest;
    }

    async getPresupuesto() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('presupuesto').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.PRESUPUESTO, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getPresupuesto:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.PRESUPUESTO) || [];
    }

    async savePresupuesto(item) {
        const list = await this.getPresupuesto();
        let savedItem;

        if (item.id) {
            const index = list.findIndex(p => p.id === item.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...item, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...item, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...item,
                id: this.generateId('pres'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.PRESUPUESTO, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (item.id && !item.id.startsWith('pres-')) {
                    await this.supabaseClient.from('presupuesto').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('presupuesto').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(p => p.id === (item.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.PRESUPUESTO, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando presupuesto en Supabase:', e);
            }
        }
        return savedItem;
    }

    async deletePresupuesto(id) {
        let list = await this.getPresupuesto();
        list = list.filter(p => p.id !== id);
        this.setLocal(STORAGE_KEYS.PRESUPUESTO, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('presupuesto').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando presupuesto en Supabase:', e);
            }
        }
        return true;
    }

    async getCotizaciones() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('cotizaciones').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.COTIZACIONES, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getCotizaciones:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.COTIZACIONES) || [];
    }

    async saveCotizacion(item) {
        const list = await this.getCotizaciones();
        let savedItem;

        if (item.id) {
            const index = list.findIndex(c => c.id === item.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...item, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...item, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...item,
                id: this.generateId('cot'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.COTIZACIONES, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (item.id && !item.id.startsWith('cot-')) {
                    await this.supabaseClient.from('cotizaciones').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('cotizaciones').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(c => c.id === (item.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.COTIZACIONES, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando cotización en Supabase:', e);
            }
        }
        return savedItem;
    }

    async deleteCotizacion(id) {
        let list = await this.getCotizaciones();
        list = list.filter(c => c.id !== id);
        this.setLocal(STORAGE_KEYS.COTIZACIONES, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('cotizaciones').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando cotización en Supabase:', e);
            }
        }
        return true;
    }

    async transferCotizacionToPresupuesto(cotizacionId) {
        const cotizaciones = await this.getCotizaciones();
        const cot = cotizaciones.find(c => c.id === cotizacionId);
        if (!cot) throw new Error('Cotización no encontrada');

        cot.estado = 'Contratado';
        await this.saveCotizacion(cot);

        const nuevoPresupuesto = {
            categoria: cot.categoria,
            concepto: cot.proveedor + ' (' + (cot.servicios_incluidos ? cot.servicios_incluidos.substring(0, 40) + '...' : 'Servicio contratado') + ')',
            costo_estimado: cot.monto_cotizado,
            costo_real: cot.monto_cotizado,
            monto_pagado: 0,
            proveedor_asociado: cot.proveedor,
            estado_pago: 'Pendiente',
            notas: 'Traspasado automáticamente desde Cotizaciones. Contacto: ' + (cot.contacto_nombre || '') + ' ' + (cot.telefono || '')
        };

        return await this.savePresupuesto(nuevoPresupuesto);
    }

    async getActividades() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('actividades').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.ACTIVIDADES, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getActividades:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.ACTIVIDADES) || [];
    }

    async saveActividad(item) {
        const list = await this.getActividades();
        let savedItem;

        if (item.id) {
            const index = list.findIndex(a => a.id === item.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...item, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...item, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...item,
                id: this.generateId('act'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.ACTIVIDADES, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (item.id && !item.id.startsWith('act-')) {
                    await this.supabaseClient.from('actividades').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('actividades').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(a => a.id === (item.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.ACTIVIDADES, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando actividad en Supabase:', e);
            }
        }
        return savedItem;
    }

    async toggleActividad(id) {
        const list = await this.getActividades();
        const item = list.find(a => a.id === id);
        if (item) {
            item.completada = !item.completada;
            return await this.saveActividad(item);
        }
        return null;
    }

    async deleteActividad(id) {
        let list = await this.getActividades();
        list = list.filter(a => a.id !== id);
        this.setLocal(STORAGE_KEYS.ACTIVIDADES, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('actividades').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando actividad en Supabase:', e);
            }
        }
        return true;
    }

    async getCompras() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('compras').select('*').order('created_at', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.COMPRAS, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getCompras:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.COMPRAS) || [];
    }

    async saveCompra(item) {
        const list = await this.getCompras();
        let savedItem;

        if (item.id) {
            const index = list.findIndex(c => c.id === item.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...item, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...item, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...item,
                id: this.generateId('cmp'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.COMPRAS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (item.id && !item.id.startsWith('cmp-')) {
                    await this.supabaseClient.from('compras').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('compras').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(c => c.id === (item.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.COMPRAS, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando compra en Supabase:', e);
            }
        }
        return savedItem;
    }

    async toggleCompra(id) {
        const list = await this.getCompras();
        const item = list.find(c => c.id === id);
        if (item) {
            item.comprado = !item.comprado;
            return await this.saveCompra(item);
        }
        return null;
    }

    async deleteCompra(id) {
        let list = await this.getCompras();
        list = list.filter(c => c.id !== id);
        this.setLocal(STORAGE_KEYS.COMPRAS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('compras').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando compra en Supabase:', e);
            }
        }
        return true;
    }

    async getItinerario() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('itinerario').select('*').order('orden', { ascending: true });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.ITINERARIO, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getItinerario:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.ITINERARIO) || [];
    }

    async saveItinerario(item) {
        const list = await this.getItinerario();
        let savedItem;

        if (item.id) {
            const index = list.findIndex(i => i.id === item.id);
            if (index >= 0) {
                savedItem = { ...list[index], ...item, updated_at: new Date().toISOString() };
                list[index] = savedItem;
            } else {
                savedItem = { ...item, updated_at: new Date().toISOString() };
                list.push(savedItem);
            }
        } else {
            savedItem = {
                ...item,
                id: this.generateId('it'),
                orden: list.length + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.push(savedItem);
        }

        this.setLocal(STORAGE_KEYS.ITINERARIO, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                if (item.id && !item.id.startsWith('it-')) {
                    await this.supabaseClient.from('itinerario').update(savedItem).eq('id', savedItem.id);
                } else {
                    const { id, ...dataToInsert } = savedItem;
                    const { data } = await this.supabaseClient.from('itinerario').insert([dataToInsert]).select();
                    if (data && data[0]) {
                        savedItem.id = data[0].id;
                        const idx = list.findIndex(i => i.id === (item.id || savedItem.id));
                        if (idx >= 0) list[idx] = savedItem;
                        this.setLocal(STORAGE_KEYS.ITINERARIO, list);
                    }
                }
            } catch (e) {
                console.warn('Fallo guardando itinerario en Supabase:', e);
            }
        }
        return savedItem;
    }

    async deleteItinerario(id) {
        let list = await this.getItinerario();
        list = list.filter(i => i.id !== id);
        this.setLocal(STORAGE_KEYS.ITINERARIO, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                await this.supabaseClient.from('itinerario').delete().eq('id', id);
            } catch (e) {
                console.warn('Fallo eliminando itinerario en Supabase:', e);
            }
        }
        return true;
    }

    async getDedicatorias() {
        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { data, error } = await this.supabaseClient.from('dedicatorias').select('*').order('created_at', { ascending: false });
                if (!error && data) {
                    this.setLocal(STORAGE_KEYS.DEDICATORIAS, data);
                    return data;
                }
            } catch (e) {
                console.warn('Fallo Supabase getDedicatorias:', e);
            }
        }
        return this.getLocal(STORAGE_KEYS.DEDICATORIAS) || [];
    }

    async saveDedicatoria(item) {
        const list = await this.getDedicatorias();
        const savedItem = {
            ...item,
            id: item.id || this.generateId('ded'),
            created_at: item.created_at || new Date().toISOString()
        };
        list.unshift(savedItem);
        this.setLocal(STORAGE_KEYS.DEDICATORIAS, list);

        if (this.isOnlineSupabase && this.supabaseClient) {
            try {
                const { id, ...dataToInsert } = savedItem;
                await this.supabaseClient.from('dedicatorias').insert([dataToInsert]);
            } catch (e) {
                console.warn('Fallo guardando dedicatoria en Supabase:', e);
            }
        }
        return savedItem;
    }

    // =========================================================================
    // GENERADOR DE ÁLBUM IMPRIMIBLE DE RECUERDOS (PDF / IMPRESIÓN)
    // =========================================================================

    async generatePrintableAlbumWindow() {
        const config = await this.getConfig();
        const photos = await this.getAlbumFotos(true);

        const novia = config.novia_nombre || 'Valentina';
        const novio = config.novio_nombre || 'Sebastián';
        const fechaStr = config.fecha_boda ? new Date(config.fecha_boda).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        const heroImg = config.hero_image_url || '';

        const albumWindow = window.open('', '_blank');
        if (!albumWindow) {
            alert('Por favor permite abrir ventanas emergentes para ver el álbum imprimible.');
            return;
        }

        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Álbum de Recuerdos 💍 | ${novia} & ${novio}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #eaeded; color: #1b2823; line-height: 1.5; }
        
        .no-print-bar {
            position: sticky; top: 0; z-index: 1000; background: #0a3327; color: #ffffff;
            padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-bottom: 2px solid #d4af37;
        }
        .btn-print {
            background: linear-gradient(135deg, #e2c56a 0%, #d4af37 100%); color: #0b110e;
            font-weight: 700; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer;
            font-size: 0.95rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .btn-print:hover { background: #e2c56a; }
        
        .album-book { width: 100%; max-width: 900px; margin: 2rem auto; }
        
        .page {
            background: #ffffff; width: 100%; min-height: 1100px; padding: 3.5rem 3rem 4.5rem;
            margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            position: relative; page-break-after: always; display: flex; flex-direction: column;
            justify-content: space-between; border: 1px solid rgba(212,175,55,0.25);
        }
        
        .cover-page {
            text-align: center; justify-content: center; align-items: center;
            background: linear-gradient(180deg, #ffffff 0%, #f6f9f7 100%);
            border: 3px double #d4af37; padding: 4rem 3rem;
        }
        
        .cover-monogram { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #0a3327; margin-bottom: 1rem; }
        .cover-title { font-family: 'Playfair Display', serif; font-size: 3.2rem; color: #0a3327; margin-bottom: 0.5rem; }
        .cover-names { font-family: 'Playfair Display', serif; font-size: 3.8rem; color: #a38125; margin-bottom: 1.5rem; }
        .cover-hero-img { width: 100%; max-height: 420px; object-fit: cover; border-radius: 12px; border: 2px solid #d4af37; margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
        .cover-date { font-size: 1.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #0a3327; margin-bottom: 1rem; }
        .cover-quote { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.4rem; color: #4a5c53; max-width: 650px; }
        
        .photo-page-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .photo-frame { width: 100%; max-height: 650px; object-fit: contain; border-radius: 8px; border: 1px solid #d4af37; box-shadow: 0 8px 25px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
        .photo-caption { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-style: italic; color: #1b2823; text-align: center; margin-bottom: 0.5rem; }
        .photo-author { font-size: 0.95rem; font-weight: 600; color: #0a3327; text-align: center; }
        
        .page-footer {
            border-top: 1px solid rgba(212,175,55,0.4); padding-top: 0.8rem;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 0.8rem; color: #798c83; text-transform: uppercase; letter-spacing: 0.1em;
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
            <strong style="font-size: 1.1rem; color: #efdc9d;">💍 Álbum de Recuerdos de Boda</strong>
            <span style="font-size: 0.85rem; color: #d7ede4; margin-left: 1rem;">${photos.length} fotos listas para guardar o imprimir</span>
        </div>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar en PDF</button>
    </div>

    <div class="album-book">
        <!-- Portada del Álbum -->
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
                <p style="color: #798c83; font-size: 1.2rem;">No hay fotos aprobadas en el álbum todavía.</p>
            </div>
        ` : photos.map((p, idx) => `
            <div class="page">
                <div class="photo-page-content">
                    <img src="${escapeHtml(p.foto_url)}" class="photo-frame">
                    ${p.pie_de_foto ? `<div class="photo-caption">"${escapeHtml(p.pie_de_foto)}"</div>` : ''}
                    <div class="photo-author">📸 Fotografía por: ${escapeHtml(p.autor_nombre)}</div>
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

    // =========================================================================
    // COPIAS DE SEGURIDAD & EXPORTACIÓN / IMPORTACIÓN
    // =========================================================================

    async exportBackupJSON() {
        const payload = {
            version: '4.0',
            exported_at: new Date().toISOString(),
            config: await this.getConfig(),
            invitados: await this.getInvitados(),
            presupuesto: await this.getPresupuesto(),
            cotizaciones: await this.getCotizaciones(),
            actividades: await this.getActividades(),
            compras: await this.getCompras(),
            itinerario: await this.getItinerario(),
            dedicatorias: await this.getDedicatorias(),
            album_fotos: await this.getAlbumFotos(false),
            album_chat: await this.getAlbumChat()
        };

        const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `respaldo_boda_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    async importBackupJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (!parsed.config && !parsed.invitados) {
                        throw new Error('Formato de archivo inválido.');
                    }

                    if (parsed.config) this.setLocal(STORAGE_KEYS.CONFIG, parsed.config);
                    if (parsed.invitados) this.setLocal(STORAGE_KEYS.INVITADOS, parsed.invitados);
                    if (parsed.presupuesto) this.setLocal(STORAGE_KEYS.PRESUPUESTO, parsed.presupuesto);
                    if (parsed.cotizaciones) this.setLocal(STORAGE_KEYS.COTIZACIONES, parsed.cotizaciones);
                    if (parsed.actividades) this.setLocal(STORAGE_KEYS.ACTIVIDADES, parsed.actividades);
                    if (parsed.compras) this.setLocal(STORAGE_KEYS.COMPRAS, parsed.compras);
                    if (parsed.itinerario) this.setLocal(STORAGE_KEYS.ITINERARIO, parsed.itinerario);
                    if (parsed.dedicatorias) this.setLocal(STORAGE_KEYS.DEDICATORIAS, parsed.dedicatorias);
                    if (parsed.album_fotos) this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, parsed.album_fotos);
                    if (parsed.album_chat) this.setLocal(STORAGE_KEYS.ALBUM_CHAT, parsed.album_chat);

                    applyWeddingTheme(parsed.config);
                    resolve({ success: true, message: '¡Copia de seguridad importada con éxito!' });
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }

    async exportInvitadosCSV() {
        const invitados = await this.getInvitados();
        const headers = ['Nombre Completo', 'Grupo', 'Pases Adultos', 'Pases Niños', 'Estado Confirmación', 'Pases Confirmados', 'Mesa Asignada', 'Restricciones Dietéticas', 'Alergias', 'Teléfono', 'Email', 'Canción Sugerida', 'Confirmado por Web'];

        const rows = invitados.map(i => [
            `"${(i.nombre_completo || '').replace(/"/g, '""')}"`,
            `"${(i.grupo || '').replace(/"/g, '""')}"`,
            i.pases_adultos || 0,
            i.pases_ninos || 0,
            `"${(i.estado_rsvp || '').replace(/"/g, '""')}"`,
            i.pases_confirmados || 0,
            `"${(i.mesa_asignada || '').replace(/"/g, '""')}"`,
            `"${(i.restricciones_dieteticas || '').replace(/"/g, '""')}"`,
            `"${(i.alergias_detalle || '').replace(/"/g, '""')}"`,
            `"${(i.telefono || '').replace(/"/g, '""')}"`,
            `"${(i.email || '').replace(/"/g, '""')}"`,
            `"${(i.cancion_sugerida || '').replace(/"/g, '""')}"`,
            i.confirmado_por_web ? 'Sí' : 'No'
        ]);

        const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `lista_invitados_boda_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    resetToDemoData() {
        this.setLocal(STORAGE_KEYS.CONFIG, DEFAULT_DATA.config);
        this.setLocal(STORAGE_KEYS.INVITADOS, DEFAULT_DATA.invitados);
        this.setLocal(STORAGE_KEYS.PRESUPUESTO, DEFAULT_DATA.presupuesto);
        this.setLocal(STORAGE_KEYS.COTIZACIONES, DEFAULT_DATA.cotizaciones);
        this.setLocal(STORAGE_KEYS.ACTIVIDADES, DEFAULT_DATA.actividades);
        this.setLocal(STORAGE_KEYS.COMPRAS, DEFAULT_DATA.compras);
        this.setLocal(STORAGE_KEYS.ITINERARIO, DEFAULT_DATA.itinerario);
        this.setLocal(STORAGE_KEYS.DEDICATORIAS, DEFAULT_DATA.dedicatorias);
        this.setLocal(STORAGE_KEYS.ALBUM_FOTOS, DEFAULT_DATA.album_fotos);
        this.setLocal(STORAGE_KEYS.ALBUM_CHAT, DEFAULT_DATA.album_chat);
        applyWeddingTheme(DEFAULT_DATA.config);
    }
}

// Instancias globales
window.weddingDB = new WeddingDataService();
window.BANCOS_COLOMBIA = BANCOS_COLOMBIA;
window.THEME_PRESETS = THEME_PRESETS;
window.applyWeddingTheme = applyWeddingTheme;
