-- ==============================================================================
-- MIGRATION 002: POLÍTICAS DE SEGURIDAD RLS
-- ==============================================================================
-- Descripción: Habilita Row Level Security en todas las tablas y crea políticas
-- de acceso público para permitir lectura/escritura desde el frontend
-- Fecha: 2026-08-26
-- ==============================================================================

-- ==============================================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ==============================================================================

ALTER TABLE public.boda_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presupuesto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dedicatorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_chat ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- POLÍTICAS PARA boda_config
-- ==============================================================================

CREATE POLICY "Permitir acceso público a boda_config" 
ON public.boda_config 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA invitados
-- ==============================================================================

CREATE POLICY "Permitir acceso público a invitados" 
ON public.invitados 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA presupuesto
-- ==============================================================================

CREATE POLICY "Permitir acceso público a presupuesto" 
ON public.presupuesto 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA cotizaciones
-- ==============================================================================

CREATE POLICY "Permitir acceso público a cotizaciones" 
ON public.cotizaciones 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA actividades
-- ==============================================================================

CREATE POLICY "Permitir acceso público a actividades" 
ON public.actividades 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA compras
-- ==============================================================================

CREATE POLICY "Permitir acceso público a compras" 
ON public.compras 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA itinerario
-- ==============================================================================

CREATE POLICY "Permitir acceso público a itinerario" 
ON public.itinerario 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA dedicatorias
-- ==============================================================================

CREATE POLICY "Permitir acceso público a dedicatorias" 
ON public.dedicatorias 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA album_fotos
-- ==============================================================================

CREATE POLICY "Permitir acceso público a album_fotos" 
ON public.album_fotos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- POLÍTICAS PARA album_chat
-- ==============================================================================

CREATE POLICY "Permitir acceso público a album_chat" 
ON public.album_chat 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ==============================================================================
-- NOTA: Para producción, se recomienda restringir las políticas de escritura
-- a usuarios autenticados con rol específico. Estas políticas son para
-- desarrollo inicial y despliegue rápido.
-- ==============================================================================
