-- ==============================================================================
-- MIGRATION 003: TRIGGERS Y FUNCIONES AUTOMÁTICAS
-- ==============================================================================
-- Descripción: Crea triggers para actualizar automáticamente los campos
-- updated_at y funciones para validación de datos
-- Fecha: 2026-08-26
-- ==============================================================================

-- ==============================================================================
-- FUNCIÓN: actualizar_updated_at
-- Actualiza el campo updated_at en cualquier tabla que lo tenga
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TRIGGERS PARA TODAS LAS TABLAS CON updated_at
-- ==============================================================================

-- boda_config
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_boda_config ON public.boda_config;
CREATE TRIGGER trigger_actualizar_updated_at_boda_config
    BEFORE UPDATE ON public.boda_config
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- invitados
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_invitados ON public.invitados;
CREATE TRIGGER trigger_actualizar_updated_at_invitados
    BEFORE UPDATE ON public.invitados
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- presupuesto
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_presupuesto ON public.presupuesto;
CREATE TRIGGER trigger_actualizar_updated_at_presupuesto
    BEFORE UPDATE ON public.presupuesto
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- cotizaciones
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_cotizaciones ON public.cotizaciones;
CREATE TRIGGER trigger_actualizar_updated_at_cotizaciones
    BEFORE UPDATE ON public.cotizaciones
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- actividades
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_actividades ON public.actividades;
CREATE TRIGGER trigger_actualizar_updated_at_actividades
    BEFORE UPDATE ON public.actividades
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- compras
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_compras ON public.compras;
CREATE TRIGGER trigger_actualizar_updated_at_compras
    BEFORE UPDATE ON public.compras
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- itinerario
DROP TRIGGER IF EXISTS trigger_actualizar_updated_at_itinerario ON public.itinerario;
CREATE TRIGGER trigger_actualizar_updated_at_itinerario
    BEFORE UPDATE ON public.itinerario
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_updated_at();

-- ==============================================================================
-- FUNCIÓN: validar_estado_rsvp
-- Valida que el estado RSVP sea uno de los valores permitidos
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.validar_estado_rsvp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado_rsvp NOT IN ('Pendiente', 'Confirmado', 'Rechazado') THEN
        RAISE EXCEPTION 'estado_rsvp debe ser Pendiente, Confirmado o Rechazado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_estado_rsvp ON public.invitados;
CREATE TRIGGER trigger_validar_estado_rsvp
    BEFORE INSERT OR UPDATE ON public.invitados
    FOR EACH ROW
    EXECUTE FUNCTION public.validar_estado_rsvp();

-- ==============================================================================
-- FUNCIÓN: contar_pases_confirmados
-- Actualiza automáticamente pases_confirmados basado en pases_adultos + pases_ninos
-- cuando el estado RSVP es Confirmado
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.contar_pases_confirmados()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado_rsvp = 'Confirmado' THEN
        NEW.pases_confirmados = NEW.pases_adultos + NEW.pases_ninos;
    ELSE
        NEW.pases_confirmados = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contar_pases_confirmados ON public.invitados;
CREATE TRIGGER trigger_contar_pases_confirmados
    BEFORE INSERT OR UPDATE ON public.invitados
    FOR EACH ROW
    EXECUTE FUNCTION public.contar_pases_confirmados();

-- ==============================================================================
-- FUNCIÓN: notificar_nuevo_invitado
-- (Placeholder para futura integración con Edge Functions)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.notificar_nuevo_invitado()
RETURNS TRIGGER AS $$
BEGIN
    -- Esta función será reemplazada por una Edge Function
    -- que envíe notificaciones por email cuando se agregue un nuevo invitado
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notificar_nuevo_invitado ON public.invitados;
CREATE TRIGGER trigger_notificar_nuevo_invitado
    AFTER INSERT ON public.invitados
    FOR EACH ROW
    EXECUTE FUNCTION public.notificar_nuevo_invitado();

-- ==============================================================================
-- FUNCIÓN: notificar_nuevo_mensaje
-- (Placeholder para futura integración con Edge Functions)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.notificar_nuevo_mensaje()
RETURNS TRIGGER AS $$
BEGIN
    -- Esta función será reemplazada por una Edge Function
    -- que envíe notificaciones cuando se reciba un nuevo mensaje
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notificar_nuevo_mensaje ON public.dedicatorias;
CREATE TRIGGER trigger_notificar_nuevo_mensaje
    AFTER INSERT ON public.dedicatorias
    FOR EACH ROW
    EXECUTE FUNCTION public.notificar_nuevo_mensaje();

-- ==============================================================================
-- NOTA: Los triggers de notificación son placeholders. La implementación
-- real se hará en la Fase 9 con Edge Functions de Supabase.
-- ==============================================================================
