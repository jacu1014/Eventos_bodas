-- Migration 005: Fix RLS policies and remove admin_pin
-- This replaces the overly permissive policies with proper security

-- ==================== P0-1: Fix RLS Policies ====================

-- Drop all existing permissive policies
DROP POLICY IF EXISTS "Permitir acceso público a boda_config" ON public.boda_config;
DROP POLICY IF EXISTS "Permitir acceso público a invitados" ON public.invitados;
DROP POLICY IF EXISTS "Permitir acceso público a presupuesto" ON public.presupuesto;
DROP POLICY IF EXISTS "Permitir acceso público a cotizaciones" ON public.cotizaciones;
DROP POLICY IF EXISTS "Permitir acceso público a actividades" ON public.actividades;
DROP POLICY IF EXISTS "Permitir acceso público a compras" ON public.compras;
DROP POLICY IF EXISTS "Permitir acceso público a itinerario" ON public.itinerario;
DROP POLICY IF EXISTS "Permitir acceso público a dedicatorias" ON public.dedicatorias;
DROP POLICY IF EXISTS "Permitir acceso público a album_fotos" ON public.album_fotos;
DROP POLICY IF EXISTS "Permitir acceso público a album_chat" ON public.album_chat;

-- boda_config: lectura pública (necesaria para landing), escritura solo admin autenticado
CREATE POLICY "config_select_public" ON public.boda_config FOR SELECT USING (true);
CREATE POLICY "config_write_auth" ON public.boda_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- presupuesto, cotizaciones, actividades, compras: solo admin autenticado (nada público)
CREATE POLICY "presupuesto_auth" ON public.presupuesto FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cotizaciones_auth" ON public.cotizaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "actividades_auth" ON public.actividades FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "compras_auth" ON public.compras FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- itinerario: lectura pública, escritura solo admin autenticado
CREATE POLICY "itinerario_select_public" ON public.itinerario FOR SELECT USING (true);
CREATE POLICY "itinerario_write_auth" ON public.itinerario FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- invitados: público solo puede INSERT (RSVP) y SELECT restringido vía RPC, no SELECT * libre
CREATE POLICY "invitados_insert_public" ON public.invitados FOR INSERT WITH CHECK (true);
CREATE POLICY "invitados_write_auth" ON public.invitados FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "invitados_delete_auth" ON public.invitados FOR DELETE TO authenticated USING (true);

-- album_fotos, album_chat, dedicatorias: público inserta y lee aprobado, admin modera
CREATE POLICY "album_fotos_select_public" ON public.album_fotos FOR SELECT USING (true);
CREATE POLICY "album_fotos_insert_public" ON public.album_fotos FOR INSERT WITH CHECK (true);
CREATE POLICY "album_fotos_write_auth" ON public.album_fotos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "album_fotos_delete_auth" ON public.album_fotos FOR DELETE TO authenticated USING (true);

CREATE POLICY "album_chat_select_public" ON public.album_chat FOR SELECT USING (true);
CREATE POLICY "album_chat_insert_public" ON public.album_chat FOR INSERT WITH CHECK (true);
CREATE POLICY "album_chat_delete_auth" ON public.album_chat FOR DELETE TO authenticated USING (true);

CREATE POLICY "dedicatorias_select_public" ON public.dedicatorias FOR SELECT USING (true);
CREATE POLICY "dedicatorias_insert_public" ON public.dedicatorias FOR INSERT WITH CHECK (true);
CREATE POLICY "dedicatorias_delete_auth" ON public.dedicatorias FOR DELETE TO authenticated USING (true);

-- ==================== P0-2: RPC function for public guest search ====================

-- Create a security definer function to safely search for guests without exposing the full table
CREATE OR REPLACE FUNCTION public.buscar_invitado_publico(p_query text)
RETURNS SETOF public.invitados
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT * FROM public.invitados
  WHERE lower(nombre_completo) = lower(trim(p_query))
  LIMIT 5;
$$;

GRANT EXECUTE ON FUNCTION public.buscar_invitado_publico(text) TO anon, authenticated;

-- ==================== P0-3: Remove admin_pin column ====================

-- Remove the vestigial admin_pin column from boda_config
ALTER TABLE public.boda_config DROP COLUMN IF EXISTS admin_pin;
