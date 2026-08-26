-- ==============================================================================
-- MIGRATION 001: CREACIÓN DE TABLAS PRINCIPALES
-- ==============================================================================
-- Descripción: Crea todas las tablas necesarias para la plataforma de boda
-- Fecha: 2026-08-26
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE CONFIGURACIÓN DE LA BODA
CREATE TABLE IF NOT EXISTS public.boda_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    novia_nombre TEXT NOT NULL DEFAULT 'Valentina',
    novio_nombre TEXT NOT NULL DEFAULT 'Sebastián',
    frase_amor TEXT DEFAULT 'El amor no se mira, se siente, y aún más cuando ustedes nos acompañan a celebrarlo.',
    fecha_boda TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '6 months'),
    lugar_ceremonia TEXT DEFAULT 'Capilla Nuestra Señora del Carmen',
    lugar_recepcion TEXT DEFAULT 'Hacienda Campestre La Esmeralda',
    direccion_ceremonia TEXT DEFAULT 'Calle 10 # 5-20, Zona Colonial',
    direccion_recepcion TEXT DEFAULT 'Km 12 Vía Campestre, Valle Verde',
    maps_ceremonia_url TEXT DEFAULT 'https://maps.google.com',
    maps_recepcion_url TEXT DEFAULT 'https://maps.google.com',
    dress_code TEXT DEFAULT 'Formal / Etiqueta Rigurosa',
    presupuesto_objetivo NUMERIC(12, 2) DEFAULT 45000000.00,
    moneda_simbolo TEXT DEFAULT '$',
    mensaje_bienvenida TEXT DEFAULT '¡Nos casamos! Estamos muy felices de compartir este día tan especial.',
    admin_pin TEXT DEFAULT '1234',
    frase_regalos TEXT DEFAULT 'Tu presencia y cariño son nuestro mayor regalo. Si deseas hacernos un detalle, puedes hacerlo mediante transferencia a cualquiera de nuestras cuentas:',
    cuentas_bancarias JSONB DEFAULT '[{"id":"cta-1","banco_nombre":"Bancolombia","banco_tipo_cuenta":"Cuenta de Ahorros","banco_numero_cuenta":"123-456789-00","banco_titular":"Valentina & Sebastián","banco_documento":"1.020.304.050","banco_llave_breb":"3001234567","qr_banco_url":""}]'::jsonb,
    theme_palette_preset TEXT DEFAULT 'emerald_gold',
    theme_primary_color TEXT DEFAULT '#0F4C3A',
    theme_accent_color TEXT DEFAULT '#D4AF37',
    theme_bg_color TEXT DEFAULT '#F6F9F7',
    dress_code_colors JSONB DEFAULT '[{"name":"Verde Esmeralda","hex":"#0F4C3A"},{"name":"Dorado Champaña","hex":"#D4AF37"}]'::jsonb,
    hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
    ceremonia_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1545232979-fbf6783d8e57?auto=format&fit=crop&w=800&q=80',
    recepcion_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    image_fit_mode TEXT DEFAULT 'cover',
    galeria_fotos JSONB DEFAULT '[]'::jsonb,
    album_habilitado_siempre BOOLEAN DEFAULT FALSE,
    album_pausado BOOLEAN DEFAULT FALSE,
    descarga_publica_habilitada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE INVITADOS
CREATE TABLE IF NOT EXISTS public.invitados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo TEXT NOT NULL,
    grupo TEXT NOT NULL DEFAULT 'Ambos',
    pases_adultos INTEGER NOT NULL DEFAULT 1,
    pases_ninos INTEGER NOT NULL DEFAULT 0,
    estado_rsvp TEXT NOT NULL DEFAULT 'Pendiente',
    pases_confirmados INTEGER DEFAULT 0,
    mesa_asignada TEXT DEFAULT 'Sin asignar',
    restricciones_dieteticas TEXT DEFAULT 'Ninguna',
    alergias_detalle TEXT DEFAULT '',
    telefono TEXT DEFAULT '',
    email TEXT DEFAULT '',
    cancion_sugerida TEXT DEFAULT '',
    mensaje_dedicatoria TEXT DEFAULT '',
    es_corte_honor BOOLEAN DEFAULT FALSE,
    invitacion_enviada BOOLEAN DEFAULT FALSE,
    confirmado_por_web BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE PRESUPUESTO
CREATE TABLE IF NOT EXISTS public.presupuesto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    categoria TEXT NOT NULL,
    concepto TEXT NOT NULL,
    costo_estimado NUMERIC(12, 2) NOT NULL DEFAULT 0,
    costo_real NUMERIC(12, 2) NOT NULL DEFAULT 0,
    monto_pagado NUMERIC(12, 2) NOT NULL DEFAULT 0,
    fecha_limite_pago DATE,
    proveedor_asociado TEXT DEFAULT '',
    estado_pago TEXT NOT NULL DEFAULT 'Pendiente',
    notas TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE COTIZACIONES
CREATE TABLE IF NOT EXISTS public.cotizaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proveedor TEXT NOT NULL,
    categoria TEXT NOT NULL,
    monto_cotizado NUMERIC(12, 2) NOT NULL DEFAULT 0,
    servicios_incluidos TEXT DEFAULT '',
    contacto_nombre TEXT DEFAULT '',
    telefono TEXT DEFAULT '',
    email TEXT DEFAULT '',
    instagram_o_web TEXT DEFAULT '',
    pros TEXT DEFAULT '',
    contras TEXT DEFAULT '',
    estado TEXT NOT NULL DEFAULT 'En evaluación',
    es_favorito BOOLEAN DEFAULT FALSE,
    notas TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE ACTIVIDADES
CREATE TABLE IF NOT EXISTS public.actividades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    fase TEXT NOT NULL,
    fecha_limite DATE,
    responsable TEXT NOT NULL DEFAULT 'Ambos',
    prioridad TEXT NOT NULL DEFAULT 'Media',
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    notas TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE COMPRAS
CREATE TABLE IF NOT EXISTS public.compras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    articulo TEXT NOT NULL,
    categoria TEXT DEFAULT 'General',
    cantidad INTEGER NOT NULL DEFAULT 1,
    tienda_sugerida TEXT DEFAULT '',
    costo_estimado NUMERIC(12, 2) DEFAULT 0,
    comprado BOOLEAN NOT NULL DEFAULT FALSE,
    responsable TEXT DEFAULT 'Ambos',
    enlace_compra TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA DE ITINERARIO
CREATE TABLE IF NOT EXISTS public.itinerario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hora TEXT NOT NULL,
    actividad TEXT NOT NULL,
    lugar TEXT DEFAULT '',
    responsables TEXT DEFAULT 'Todos',
    detalles TEXT DEFAULT '',
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA DE DEDICATORIAS
CREATE TABLE IF NOT EXISTS public.dedicatorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    cancion_sugerida TEXT DEFAULT '',
    publico BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABLA DE ÁLBUM DE FOTOS
CREATE TABLE IF NOT EXISTS public.album_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_nombre TEXT NOT NULL,
    foto_url TEXT NOT NULL,
    pie_de_foto TEXT DEFAULT '',
    aprobada BOOLEAN DEFAULT TRUE,
    descarga_permitida BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABLA DE CHAT DEL ÁLBUM
CREATE TABLE IF NOT EXISTS public.album_chat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    autor_nombre TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_invitados_grupo ON public.invitados(grupo);
CREATE INDEX IF NOT EXISTS idx_invitados_estado_rsvp ON public.invitados(estado_rsvp);
CREATE INDEX IF NOT EXISTS idx_invitados_mesa_asignada ON public.invitados(mesa_asignada);
CREATE INDEX IF NOT EXISTS idx_presupuesto_categoria ON public.presupuesto(categoria);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_categoria ON public.cotizaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_actividades_fase ON public.actividades(fase);
CREATE INDEX IF NOT EXISTS idx_album_fotos_created_at ON public.album_fotos(created_at DESC);
