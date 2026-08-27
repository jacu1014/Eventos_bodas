# Mejoras — Eventos_bodas

Instrucciones para el agente: ejecutar en el orden de las secciones (1 → 5). Cada item trae diagnóstico + fix concreto. No reescribir archivos completos salvo que se indique.

---

## 1. Deploy en Vercel (bloqueante — "no actualiza")

### 1-1. `vercel.json` inválido: mezcla `routes` con `headers`/`rewrites`/`redirects`
**Diagnóstico:** Vercel prohíbe combinar la config legacy `builds`/`routes` (v2) en el mismo archivo con `headers`, `rewrites`, `redirects`, `cleanUrls` o `trailingSlash`. Este `vercel.json` usa las dos a la vez → Vercel rechaza o ignora el build, por eso los cambios no se reflejan aunque el push a GitHub sea correcto.

**Fix:** reemplazar `vercel.json` completo por la sintaxis moderna (sin `builds`/`routes`):
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/admin", "destination": "/admin.html" },
    { "source": "/subir-fotos", "destination": "/subir-fotos.html" }
  ],
  "redirects": [
    { "source": "/invitacion", "destination": "/", "permanent": false },
    { "source": "/admin-login", "destination": "/admin.html", "permanent": false }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```
Nota: se quita `X-XSS-Protection` (header obsoleto, deprecado por navegadores modernos, Vercel puede advertirlo) y el bloque `"env"` con secretos referenciados por `@nombre` (sintaxis de Vercel Secrets, legacy) — las env vars de Supabase se configuran directamente en el dashboard de Vercel → Project → Settings → Environment Variables, no en `vercel.json`.

### 1-2. Confirmar rama de producción en Vercel
**Diagnóstico:** El ZIP exportado se llama `Eventos_bodas-main`, lo que indica que la rama por defecto de GitHub ya es `main`. Si aun así Vercel no autodespliega, la causa más probable no es el nombre de la rama sino el `vercel.json` inválido (1-1). Verificar de todos modos en el dashboard de Vercel: Project → Settings → Git → Production Branch = `main`.

### 1-3. Cache agresivo de HTML dificulta ver cambios
**Diagnóstico:** El header `Cache-Control: public, max-age=3600` para `*.html` (ya corregido/omitido en el fix de 1-1) hacía que los visitantes vieran una versión cacheada del HTML hasta por 1 hora tras cada deploy. Con el `vercel.json` nuevo de 1-1 ya no se define Cache-Control para HTML (Vercel usa su default con revalidación), lo cual es correcto para una landing que se edita seguido desde el admin.

---

## 2. Contenido dinámico real (editable 100% desde el admin)

### 2-1. Confirmar que no queden textos hardcodeados fuera de `config`
**Diagnóstico:** La mayoría del landing (`index.html`) ya usa `x-text="config.*"` correctamente. Verificar con `grep -n "Valentina\|Sebastián\|Hacienda La Esmeralda\|Capilla Nuestra" index.html` que no queden strings de ejemplo fuera de bindings Alpine — cualquier match que no esté dentro de un fallback `x-text` debe migrarse a un campo de `config` editable desde `admin.html`.

### 2-2. Galería "Nuestra Historia" y colores de dress code ya son arrays editables
**Diagnóstico:** `galeria_fotos` y `dress_code_colors` en `config` ya soportan edición dinámica (confirmado en `assets/js/supabase-client.js`). Falta exponer en `admin.html` un editor visual para reordenar la galería (drag & drop o botones subir/bajar) — hoy solo se puede agregar/eliminar, no reordenar.
**Fix:** en la sección de galería del admin, agregar botones ↑/↓ por foto que hagan `array.splice` e intercambien posición, guardando con el mismo flujo de `saveConfig`/`updateConfiguracion` ya existente.

### 2-3. Vista previa en vivo del tema (colores) antes de guardar
**Diagnóstico:** `applyWeddingTheme()` ya existe y actualiza CSS variables en caliente. Confirmar que los `<input type="color">` de `admin.html` (líneas ~736, ~743) disparen `applyWeddingTheme(personalization)` en el evento `@input` (no solo `@change`) para que el admin vea el cambio de color en tiempo real mientras arrastra el selector, antes de pulsar "Guardar".

---

## 3. Responsive / usabilidad móvil

### 3-1. Editor de mesas sin soporte táctil
**Archivo:** `assets/js/mesas.js` (actualmente huérfano — no se carga en ningún HTML, ver hallazgo 4-1)
**Diagnóstico:** `startDrag`/`moveDrag` usan únicamente `mousedown`/`mousemove` (`ev.clientX/clientY`). Si se reactiva esta funcionalidad (ver sección 4), el arrastre de mesas será inutilizable en tablet/celular.
**Fix:** agregar manejo de `touchstart`/`touchmove`/`touchend` en paralelo a los eventos de mouse, usando `ev.touches[0].clientX/clientY`, o migrar a Pointer Events (`pointerdown`/`pointermove`/`pointerup`) que unifican mouse y touch en un solo listener.

### 3-2. Tablas del admin en pantallas muy angostas (<360px)
**Archivo:** `admin.html` (tablas en líneas ~372 y ~526)
**Diagnóstico:** Ya tienen `overflow-x-auto`, lo cual es correcto, pero en pantallas muy angostas obliga a scroll horizontal para ver columnas clave (nombre, estado RSVP). Mejora de usabilidad, no bug.
**Fix:** para la tabla de invitados, agregar una vista alternativa tipo "tarjeta" en `sm:hidden` (una card por invitado con nombre, estado y acciones) y ocultar la tabla completa con `hidden sm:block` — patrón estándar de tablas responsive con Tailwind.

### 3-3. Formulario de RSVP público: validar tamaño de tap targets
**Diagnóstico:** Revisar que los botones "Confirmar asistencia"/"No podré asistir" en `index.html` tengan al menos 44×44px de área táctil (mínimo recomendado por Apple/Google HIG) — importante porque este formulario lo va a usar el invitado promedio desde el celular al recibir la tarjeta.

---

## 4. Funcionalidades a reactivar o agregar

### 4-1. Reactivar el editor visual de mesas (`assets/js/mesas.js`)
**Diagnóstico:** Existe un módulo completo de distribución visual de mesas con drag & drop (261 líneas) que **no está enlazado en ningún HTML**. Es funcionalidad ya construida y no usada — más valor que escribir algo nuevo.
**Fix:**
1. Aplicar el fix táctil de 3-1.
2. Agregar `<script src="./assets/js/mesas.js"></script>` en `admin.html`.
3. Añadir una pestaña "Distribución de Mesas" (canvas/grid visual) que consuma `getMesas()`/`updateMesa()` de `assets/js/supabase-client.js` — permite arrastrar invitados confirmados a mesas visualmente en vez de un `<select>` de texto.

### 4-2. Eliminar o completar `assets/js/personalizacion.js`
**Diagnóstico:** Archivo huérfano de 7 líneas, solo un `console.log`, no aporta nada (la personalización real vive en `assets/js/admin.js`).
**Fix:** `git rm assets/js/personalizacion.js` — evita que alguien intente editarlo pensando que tiene efecto.

### 4-3. Enlace directo de invitación personalizada por invitado
**Diagnóstico:** Ya existe `slug` por invitado en `normalizeGuest`. Se puede generar un link único `midominio.com/invitacion?inv=<slug>` que precargue el nombre del invitado en el formulario de RSVP (menos fricción, evita que escriban mal su nombre y no se encuentre el match en `submitRSVP`).
**Sugerencia de implementación:** en `index.html`/`landing.js`, leer `URLSearchParams` al cargar; si existe `inv`, llamar `getInvitadoBySlugOrId` y precompletar el form + mostrar el nombre y pases disponibles ("Tienes 3 pases disponibles") antes de que el invitado escriba nada.

### 4-4. Envío real de la tarjeta de invitación (WhatsApp/Email) desde el admin
**Diagnóstico:** El admin ya marca `invitacion_enviada` como booleano pero no hay ningún flujo que genere/envíe el link de 4-3. Es la funcionalidad central pedida por el usuario ("enviar tarjetas personalizadas para los invitados") y hoy es manual.
**Sugerencia:** en la tabla de invitados del admin, agregar un botón "Enviar invitación" por fila que:
- Genere la URL con el `slug` (4-3).
- Abra `https://wa.me/<telefono>?text=<mensaje con el link>` si hay teléfono (no requiere backend).
- Marque `invitacion_enviada = true` automáticamente tras el click.
- Opcional (requiere backend): usar la Edge Function `supabase/functions/notificaciones` ya existente (usa Resend) para enviar por email en lugar de WhatsApp.

### 4-5. Recordatorio automático a invitados sin RSVP
**Diagnóstico:** La Edge Function de notificaciones ya soporta envío de email vía Resend. Se puede agregar un botón en el admin "Recordar a pendientes" que itere `invitados` con `estado_rsvp = 'Pendiente'` y dispare la función para cada uno con un template de recordatorio, X días antes de la fecha límite de confirmación.

### 4-6. Exportar mesas/itinerario a PDF imprimible
**Diagnóstico:** Ya existe `generatePrintableAlbumWindow()` como patrón (ventana nueva + `window.print()`) para el álbum de fotos. Se puede replicar el mismo patrón para generar un "plano de mesas" imprimible y un itinerario del día imprimible, útil para el día del evento (staff/salón).

### 4-7. Contador de presupuesto vs. gasto real visible en el dashboard
**Diagnóstico:** `getStats()`/`normalizeFinanza` ya calculan `saldo`, `totalPresupuesto`, `totalGastos`. Confirmar que el dashboard del admin (`admin.html`) muestre esto con una barra de progreso visual (ya se carga Chart.js — usarlo aquí en vez de solo en otras vistas) para que los novios vean de un vistazo cuánto llevan gastado del presupuesto objetivo.

---

## 5. Facilidad de actualización futura (mantenibilidad)

### 5-1. Consolidar en un único `supabase-client.js`
**Diagnóstico:** Depende del resultado de `AUDITORIA_TECNICA.md` (P0-6): una vez borrados los archivos raíz muertos, solo debe quedar `assets/js/supabase-client.js` como fuente única. Esto es prerequisito para que cualquier mejora futura no se edite por error en el archivo equivocado.

### 5-2. Documentar en el README el flujo de "cómo cambiar X sin tocar código"
**Diagnóstico:** El README actual describe stack técnico pero no explica a un novio no-técnico qué se edita desde el admin vs qué requiere tocar código. Agregar sección "Guía rápida para los novios": cambiar textos/colores/fotos → admin.html; cambiar RLS/tablas → requiere migración SQL (avisar que eso sí necesita a un desarrollador).

### 5-3. Página 404 y estado "sin conexión a Supabase" más claros
**Diagnóstico:** Si Supabase no está configurado, la app cae a modo local (`localStorage`) silenciosamente — un invitado que confirme asistencia desde su celular sin que el admin haya configurado Supabase **no le llega la confirmación a nadie** (queda solo en su propio navegador). Es el riesgo más alto para el objetivo del proyecto ("que confirmen asistencia").
**Fix:** mostrar un banner visible en `admin.html` (`updateConnectionPill()` ya existe, parece que solo es un indicador pequeño) cuando `isOnlineSupabase === false`, con texto explícito: "⚠️ Modo local: las confirmaciones de tus invitados NO se están guardando en la nube. Conecta Supabase en Configuración." — actualmente es fácil no notarlo.

---

## Orden de ejecución sugerido para el agente
1. 1-1 (vercel.json) — desbloquea deploys, hazlo primero y verifica que el próximo push despliegue bien.
2. 5-3 (banner de modo local) — previene pérdida de datos reales de invitados mientras se hace el resto.
3. 4-2 (borrar archivo huérfano) y 5-1 (depende de auditoría técnica ya entregada).
4. 4-3 + 4-4 (link personalizado + envío) — es la funcionalidad núcleo pedida por el usuario.
5. 3-1, 3-2, 3-3 (responsive).
6. 4-1 (reactivar mesas visuales), 4-6, 4-7.
7. 2-2, 2-3, 4-5, 5-2.
