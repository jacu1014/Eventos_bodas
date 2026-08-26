// ==============================================================================
// EDGE FUNCTION: Notificaciones
// ==============================================================================
// Descripción: Envía notificaciones por email usando Resend
// Método: POST
// Body: { to: string, subject: string, html: string, type: 'rsvp' | 'mensaje' | 'foto' }
// ==============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { Resend } from 'https://esm.sh/resend@2.0.0';

// ==============================================================================
// CONFIGURACIÓN
// ==============================================================================

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const emailFrom = Deno.env.get('EMAIL_FROM') || 'no-reply@tudominio.com';
const adminEmail = Deno.env.get('ADMIN_EMAIL') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

// ==============================================================================
// TEMPLATES DE EMAIL
// ==============================================================================

const emailTemplates = {
  rsvp: (nombre, estado, pases) => `
    <h2>📋 Nuevo RSVP Confirmado</h2>
    <p><strong>Invitado:</strong> ${nombre}</p>
    <p><strong>Estado:</strong> ${estado}</p>
    <p><strong>Pases confirmados:</strong> ${pases}</p>
    <p>Revisa el panel de administración para más detalles.</p>
  `,
  mensaje: (autor, mensaje) => `
    <h2>💌 Nuevo Mensaje de los Invitados</h2>
    <p><strong>De:</strong> ${autor}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote>${mensaje}</blockquote>
    <p>Revisa el panel de administración para responder.</p>
  `,
  foto: (autor, pieFoto) => `
    <h2>📸 Nueva Foto Subida</h2>
    <p><strong>Autor:</strong> ${autor}</p>
    <p><strong>Pie de foto:</strong> ${pieFoto || 'Sin descripción'}</p>
    <p>Revisa el álbum compartido para aprobarla.</p>
  `,
  confirmacion: (nombre, pases) => `
    <h2>✅ Confirmación de Asistencia</h2>
    <p>Hola ${nombre},</p>
    <p>Gracias por confirmar tu asistencia a nuestra boda. Has confirmado <strong>${pases}</strong> pases.</p>
    <p>¡Te esperamos con mucha alegría!</p>
    <p>Con cariño,<br/>Valentina y Sebastián 💍</p>
  `
};

// ==============================================================================
// FUNCIÓN PRINCIPAL
// ==============================================================================

export default async function handler(req, res) {
  // CORS para desarrollo
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido. Usa POST.' }),
      { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { to, subject, html, type, data } = body;

    // Validar que tenemos todos los datos necesarios
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY no configurada. Las notificaciones no se enviarán.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'RESEND_API_KEY no configurada',
          message: 'Las notificaciones están deshabilitadas.'
        }),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Si no se proporciona 'to', usar el email del administrador
    const recipient = to || adminEmail;
    if (!recipient) {
      return new Response(
        JSON.stringify({ error: 'No se especificó destinatario ni ADMIN_EMAIL' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Construir el email
    let emailHtml = html;
    let emailSubject = subject || 'Notificación de Boda Digital';

    // Si se proporciona un tipo y datos, usar el template correspondiente
    if (type && data) {
      const template = emailTemplates[type];
      if (template) {
        emailHtml = template(data.nombre || '', data.estado || '', data.pases || '');
        emailSubject = subject || `Nueva notificación - ${type.toUpperCase()}`;
      }
    }

    // Enviar el email
    const { data: emailData, error } = await resend.emails.send({
      from: emailFrom,
      to: [recipient],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Si el tipo es rsvp y se confirma un invitado, enviar confirmación al invitado
    if (type === 'rsvp' && data && data.confirmarInvitado && data.emailInvitado) {
      try {
        const confirmTemplate = emailTemplates.confirmacion(
          data.nombre,
          data.pases
        );
        await resend.emails.send({
          from: emailFrom,
          to: [data.emailInvitado],
          subject: '✅ Confirmación de asistencia - Boda de Valentina y Sebastián',
          html: confirmTemplate,
        });
      } catch (confirmError) {
        console.warn('No se pudo enviar confirmación al invitado:', confirmError);
        // No fallamos la operación principal si esto falla
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en Edge Function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
}
