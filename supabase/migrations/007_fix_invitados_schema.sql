-- ==============================================================================
-- MIGRATION 007: CORREGIR ESQUEMA DE LA TABLA INVITADOS
-- ==============================================================================
-- Descripción: Añade campos faltantes que el código espera pero que no existían
-- en la migración inicial. Esto alinea la base de datos con el código frontend.
-- Fecha: 2026-08-27
-- ==============================================================================

-- 1. AGREGAR CAMPOS FALTANTES A LA TABLA invitados
ALTER TABLE public.invitados
ADD COLUMN IF NOT EXISTS asistira BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS acompanantes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS menu TEXT DEFAULT 'Tradicional',
ADD COLUMN IF NOT EXISTS dietas TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS notas TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS confirmado_por_web BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. MIGRAR DATOS EXISTENTES DE estado_rsvp A asistira
UPDATE public.invitados
SET asistira = CASE
    WHEN estado_rsvp = 'Confirmado' THEN TRUE
    WHEN estado_rsvp = 'No asiste' THEN FALSE
    ELSE NULL
END
WHERE asistira IS NULL;

-- 3. MIGRAR pases_confirmados A acompanantes
UPDATE public.invitados
SET acompanantes = pases_confirmados
WHERE acompanantes = 0 AND pases_confirmados IS NOT NULL AND pases_confirmados > 0;

-- 4. MIGRAR restricciones_dieteticas A dietas
UPDATE public.invitados
SET dietas = restricciones_dieteticas
WHERE dietas = '' AND restricciones_dieteticas IS NOT NULL AND restricciones_dieteticas != 'Ninguna';

-- 5. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_invitados_asistira ON public.invitados(asistira);
CREATE INDEX IF NOT EXISTS idx_invitados_slug ON public.invitados(slug);

-- 6. ACTUALIZAR LA FUNCIÓN DE TRIGGER PARA updated_at SI EXISTE
-- Si no existe la función, la creamos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
END $$;

-- 7. CREAR O REEMPLAZAR EL TRIGGER PARA invitados
DROP TRIGGER IF EXISTS update_invitados_updated_at ON public.invitados;
CREATE TRIGGER update_invitados_updated_at
BEFORE UPDATE ON public.invitados
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 8. ACTUALIZAR LA TABLA boda_config PARA AGREGAR CAMPOS FALTANTES
ALTER TABLE public.boda_config
ADD COLUMN IF NOT EXISTS novia_nombre TEXT DEFAULT 'Valentina',
ADD COLUMN IF NOT EXISTS novio_nombre TEXT DEFAULT 'Sebastián',
ADD COLUMN IF NOT EXISTS novios TEXT GENERATED ALWAYS AS (novia_nombre || ' & ' || novio_nombre) STORED,
ADD COLUMN IF NOT EXISTS titulo TEXT DEFAULT '¡Nos Casamos!',
ADD COLUMN IF NOT EXISTS color_principal TEXT DEFAULT '#0F4C3A',
ADD COLUMN IF NOT EXISTS color_secundario TEXT DEFAULT '#D4AF37',
ADD COLUMN IF NOT EXISTS fuente_titulos TEXT DEFAULT 'serif',
ADD COLUMN IF NOT EXISTS fuente_textos TEXT DEFAULT 'sans-serif',
ADD COLUMN IF NOT EXISTS image_fit_mode TEXT DEFAULT 'cover';

-- 9. CORREGIR EL CAMPO admin_pin PARA QUE SEA TEXT (no es seguro almacenarlo como hash aquí, pero el código lo espera)
ALTER TABLE public.boda_config
ALTER COLUMN admin_pin TYPE TEXT USING admin_pin::TEXT;

-- 10. ACTUALIZAR REGISTRO DE CONFIGURACIÓN CON VALORES POR DEFECTO SI ESTÁ VACÍO
INSERT INTO public.boda_config (id, novia_nombre, novio_nombre, admin_pin)
SELECT 
    uuid_generate_v4(),
    'Valentina',
    'Sebastián',
    '1234'
WHERE NOT EXISTS (SELECT 1 FROM public.boda_config LIMIT 1);

-- 11. COMENTARIOS DE DOCUMENTACIÓN
COMMENT ON COLUMN public.invitados.asistira IS 'Boolean que indica si el invitado asistirá (TRUE = Sí, FALSE = No, NULL = Pendiente)';
COMMENT ON COLUMN public.invitados.acompanantes IS 'Número de acompañantes adicionales que trae el invitado';
COMMENT ON COLUMN public.invitados.menu IS 'Opción de menú seleccionada por el invitado (Tradicional, Vegetariano, Vegano, etc.)';
COMMENT ON COLUMN public.invitados.dietas IS 'Restricciones dietéticas específicas del invitado';
COMMENT ON COLUMN public.invitados.notas IS 'Notas adicionales sobre el invitado';
COMMENT ON COLUMN public.invitados.slug IS 'Slug único para generar enlaces personalizados del invitado';
