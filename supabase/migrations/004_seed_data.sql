-- ==============================================================================
-- MIGRATION 004: DATOS DE EJEMPLO (SEED DATA)
-- ==============================================================================
-- Descripción: Inserta datos de ejemplo para pruebas y demostración
-- Fecha: 2026-08-26
-- ==============================================================================

-- ==============================================================================
-- CONFIGURACIÓN DE LA BODA
-- ==============================================================================

INSERT INTO public.boda_config (
    novia_nombre,
    novio_nombre,
    frase_amor,
    fecha_boda,
    lugar_ceremonia,
    lugar_recepcion,
    direccion_ceremonia,
    direccion_recepcion,
    dress_code,
    presupuesto_objetivo,
    mensaje_bienvenida,
    admin_pin
) VALUES (
    'Valentina',
    'Sebastián',
    'El amor no se mira, se siente, y aún más cuando ustedes nos acompañan a celebrarlo.',
    NOW() + INTERVAL '6 months',
    'Capilla Nuestra Señora del Carmen',
    'Hacienda Campestre La Esmeralda',
    'Calle 10 # 5-20, Zona Colonial',
    'Km 12 Vía Campestre, Valle Verde',
    'Formal / Etiqueta Rigurosa (Traje oscuro para caballeros y vestido largo para damas)',
    45000000.00,
    '¡Nos casamos! Estamos muy felices de compartir este día tan especial con las personas que más amamos.',
    '1234'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- INVITADOS DE EJEMPLO
-- ==============================================================================

INSERT INTO public.invitados (nombre_completo, grupo, pases_adultos, pases_ninos, estado_rsvp, mesa_asignada) VALUES
('María José Pérez', 'Novia', 2, 0, 'Confirmado', 'Mesa 1'),
('Carlos Alberto Gómez', 'Novio', 2, 0, 'Confirmado', 'Mesa 1'),
('Ana Lucía Ramírez', 'Novia', 2, 2, 'Pendiente', 'Mesa 2'),
('Fernando José Torres', 'Novio', 1, 0, 'Pendiente', 'Mesa 2'),
('Laura Vanessa Díaz', 'Novia', 2, 0, 'Confirmado', 'Mesa 3'),
('Jorge Andrés López', 'Novio', 1, 0, 'Rechazado', 'Sin asignar'),
('Camila Alejandra Sánchez', 'Ambos', 2, 0, 'Pendiente', 'Mesa 3'),
('David Santiago Martínez', 'Ambos', 2, 1, 'Confirmado', 'Mesa 4'),
('Valentina Isabel García', 'Ambos', 1, 0, 'Pendiente', 'Mesa 4'),
('Diego Alejandro Pérez', 'Novio', 2, 0, 'Confirmado', 'Mesa 5'),
('Paula Andrea González', 'Novia', 2, 0, 'Pendiente', 'Mesa 5'),
('Nicolás Andrés Castro', 'Ambos', 2, 0, 'Confirmado', 'Mesa 6')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- PRESUPUESTO DE EJEMPLO
-- ==============================================================================

INSERT INTO public.presupuesto (categoria, concepto, costo_estimado, costo_real, monto_pagado, estado_pago, proveedor_asociado) VALUES
('Lugar', 'Salón de eventos', 8000000.00, 7500000.00, 5000000.00, 'Pagado Parcial', 'Hacienda Campestre'),
('Alimentos', 'Banquete 100 personas', 12000000.00, 0, 0, 'Pendiente', 'Gourmet Eventos'),
('Alimentos', 'Bebidas y licores', 3000000.00, 0, 0, 'Pendiente', 'Distribuidora La Barra'),
('Música', 'DJ y sonido', 2500000.00, 2500000.00, 2500000.00, 'Pagado Total', 'DJ Carlos'),
('Música', 'Música en vivo (ceremonia)', 1500000.00, 0, 500000.00, 'Pagado Parcial', 'Cuarteto Clásico'),
('Fotografía', 'Fotógrafo 8 horas', 3000000.00, 2800000.00, 2800000.00, 'Pagado Total', 'FotoArte Studio'),
('Vestimenta', 'Traje de novia', 2500000.00, 2300000.00, 2300000.00, 'Pagado Total', 'Atelier Novias'),
('Vestimenta', 'Traje de novio', 1500000.00, 1200000.00, 1200000.00, 'Pagado Total', 'Sastrería Moderna'),
('Decoración', 'Flores y arreglos', 2000000.00, 0, 500000.00, 'Pagado Parcial', 'Floristería El Jardín'),
('Decoración', 'Mantelería y vajilla', 1000000.00, 0, 0, 'Pendiente', 'Alquileres Fiesta'),
('Transporte', 'Limusinas y transporte', 1500000.00, 0, 0, 'Pendiente', 'Transportes Elegance'),
('Invitaciones', 'Tarjetas e invitaciones digitales', 500000.00, 450000.00, 450000.00, 'Pagado Total', 'Diseño Creativo'),
('Varios', 'Recuerdos para invitados', 1200000.00, 0, 0, 'Pendiente', 'Regalos Especiales'),
('Varios', 'Pastel de bodas', 800000.00, 0, 300000.00, 'Pagado Parcial', 'Repostería Dulce Amor')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- COTIZACIONES DE EJEMPLO
-- ==============================================================================

INSERT INTO public.cotizaciones (proveedor, categoria, monto_cotizado, servicios_incluidos, contacto_nombre, telefono, email, estado, es_favorito) VALUES
('Gourmet Eventos', 'Alimentos', 12000000.00, 'Banquete completo para 100 personas, incluye plato fuerte, entrada, postre y bebidas no alcohólicas', 'María Fernanda', '3001234567', 'info@gourmeteventos.com', 'En evaluación', TRUE),
('Eventos y Sabores', 'Alimentos', 11000000.00, 'Menú ejecutivo para 100 personas, 3 tiempos', 'Carlos Alberto', '3002345678', 'carlos@eventossabores.com', 'En evaluación', FALSE),
('FotoArte Studio', 'Fotografía', 3000000.00, '8 horas de cobertura, edición de 300 fotos, álbum físico', 'Andrea Martínez', '3003456789', 'andrea@fotoartestudio.com', 'Seleccionado', TRUE),
('Luz y Arte Fotos', 'Fotografía', 2500000.00, '6 horas de cobertura, edición de 200 fotos, entrega digital', 'Juan Pablo', '3004567890', 'juan@luzyartefotos.com', 'En evaluación', FALSE),
('DJ Carlos', 'Música', 2500000.00, '4 horas de música, sonido profesional, iluminación básica', 'Carlos Ramírez', '3005678901', 'carlos@djcarlos.com', 'Seleccionado', TRUE),
('Sonic Music', 'Música', 2800000.00, '5 horas de música, sonido premium, iluminación led', 'Felipe Moreno', '3006789012', 'felipe@sonicmusic.com', 'En evaluación', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ACTIVIDADES DE EJEMPLO
-- ==============================================================================

INSERT INTO public.actividades (titulo, fase, fecha_limite, responsable, prioridad, completada) VALUES
('Seleccionar lugar de recepción', 'Lugar', NOW() - INTERVAL '30 days', 'Ambos', 'Alta', TRUE),
('Contratar fotógrafo', 'Fotografía', NOW() - INTERVAL '15 days', 'Valentina', 'Alta', TRUE),
('Diseñar invitaciones', 'Diseño', NOW() + INTERVAL '15 days', 'Sebastián', 'Media', FALSE),
('Seleccionar menú con caterer', 'Alimentos', NOW() + INTERVAL '30 days', 'Ambos', 'Alta', FALSE),
('Comprar traje de novia', 'Vestimenta', NOW() - INTERVAL '10 days', 'Valentina', 'Alta', TRUE),
('Comprar traje de novio', 'Vestimenta', NOW() + INTERVAL '20 days', 'Sebastián', 'Media', FALSE),
('Preparar lista de invitados final', 'Invitados', NOW() + INTERVAL '45 days', 'Ambos', 'Alta', FALSE),
('Seleccionar música para ceremonia', 'Música', NOW() + INTERVAL '60 days', 'Sebastián', 'Baja', FALSE),
('Definir decoración y flores', 'Decoración', NOW() + INTERVAL '40 days', 'Valentina', 'Media', FALSE),
('Organizar transporte para invitados', 'Transporte', NOW() + INTERVAL '70 days', 'Ambos', 'Media', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- COMPRAS DE EJEMPLO
-- ==============================================================================

INSERT INTO public.compras (articulo, categoria, cantidad, tienda_sugerida, costo_estimado, comprado, responsable) VALUES
('Velas decorativas', 'Decoración', 50, 'Decoraciones Colombia', 200000.00, FALSE, 'Valentina'),
('Centros de mesa', 'Decoración', 12, 'Manualidades y Arte', 360000.00, FALSE, 'Valentina'),
('Libro de firmas', 'Invitados', 1, 'Papelería Especial', 80000.00, FALSE, 'Ambos'),
('Alianzas de matrimonio', 'Varios', 2, 'Joyas de Oro', 2500000.00, FALSE, 'Ambos'),
('Zapatos de novia', 'Vestimenta', 1, 'Calzado Elegante', 300000.00, TRUE, 'Valentina'),
('Corbata y pañuelo', 'Vestimenta', 1, 'Sastrería Moderna', 120000.00, FALSE, 'Sebastián'),
('Cámara instantánea', 'Fotografía', 1, 'Tecnología Digital', 400000.00, FALSE, 'Ambos'),
('Recuerdos para invitados', 'Varios', 100, 'Regalos Especiales', 800000.00, FALSE, 'Ambos')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ITINERARIO DE EJEMPLO
-- ==============================================================================

INSERT INTO public.itinerario (hora, actividad, lugar, responsables, detalles, orden) VALUES
('10:00 AM', 'Llegada de invitados', 'Capilla Nuestra Señora del Carmen', 'Novios', 'Bienvenida con café y pasteles', 1),
('11:00 AM', 'Ceremonia religiosa', 'Capilla Nuestra Señora del Carmen', 'Novios', 'Misa completa con música en vivo', 2),
('12:00 PM', 'Salida de novios y fotos', 'Jardines de la Capilla', 'Fotógrafo', 'Sesión de fotos con la familia', 3),
('12:30 PM', 'Traslado a la recepción', 'Hacienda Campestre La Esmeralda', 'Todos', 'Transporte organizado para invitados', 4),
('1:30 PM', 'Llegada a recepción', 'Hacienda Campestre La Esmeralda', 'Todos', 'Cóctel de bienvenida', 5),
('2:30 PM', 'Almuerzo', 'Salón principal', 'Catering', 'Banquete de 3 tiempos', 6),
('3:30 PM', 'Brindis y discursos', 'Salón principal', 'Novios', 'Brindis con champaña', 7),
('4:00 PM', 'Pastel y postres', 'Salón principal', 'Repostería', 'Corte de pastel', 8),
('5:00 PM', 'Música y baile', 'Pista de baile', 'DJ', 'Inicio de fiesta con DJ', 9),
('6:00 PM', 'Entrega de recuerdos', 'Salida', 'Novios', 'Despedida de invitados', 10),
('7:00 PM', 'Fin del evento', 'Hacienda Campestre La Esmeralda', 'Todos', 'Salida de invitados', 11)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- DEDICATORIAS DE EJEMPLO
-- ==============================================================================

INSERT INTO public.dedicatorias (autor, mensaje, cancion_sugerida, publico) VALUES
('María José', 'Valentina, siempre has sido como una hermana para mí. Te deseo toda la felicidad del mundo en este nuevo capítulo. Sebastián, cuídala mucho.', 'Perfect - Ed Sheeran', TRUE),
('Carlos Alberto', 'Sebastián, hermano, no puedo estar más feliz por ti. Valentina es una mujer increíble, te mereces todo lo bueno que te está pasando.', 'Amor Eterno - Juan Gabriel', TRUE),
('Ana Lucía', 'Qué emoción verlos juntos. Son una pareja hermosa y su amor es inspirador. Que Dios los bendiga siempre.', 'A Dios Le Pido - Juanes', TRUE),
('Laura Vanessa', '¡Felicidades! Deseo que su amor crezca cada día más y que construyan un hogar lleno de risas y buenos momentos.', 'Contigo - Los Panchos', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ALBUM FOTOS DE EJEMPLO
-- ==============================================================================

INSERT INTO public.album_fotos (autor_nombre, foto_url, pie_de_foto, aprobada) VALUES
('Fotógrafo', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', '¡El gran día está cerca!', TRUE),
('Fotógrafo', 'https://images.unsplash.com/photo-1545232979-fbf6783d8e57?auto=format&fit=crop&w=800&q=80', 'La iglesia donde todo comenzará', TRUE),
('Fotógrafo', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80', 'La recepción lista para celebrar', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- NOTA: Los datos de ejemplo son para propósitos de demostración y desarrollo.
-- En producción, estos datos pueden ser eliminados o reemplazados por datos reales.
-- ==============================================================================
