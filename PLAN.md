# PLAN DE TRABAJO - BODA DIGITAL WEB

## Proyecto: Plataforma integral para bodas con gestión de invitados, mesas y personalización total

---

## 📋 VISIÓN GENERAL DEL PROYECTO

**Objetivo:** Crear una plataforma web completa para gestionar una boda que incluya:

- Landing pública personalizable con invitación digital animada
- Panel de administración para los novios (backoffice)
- Gestión de invitados, mesas, RSVP, menús, finanzas y proveedores
- Álbum colaborativo con subida de fotos vía QR
- Muro de deseos y sugerencia de canciones
- Personalización total de colores, fuentes, imágenes y mensajes
- Despliegue en Vercel con GitHub (presupuesto cero)

**Tecnologías:**

- Frontend: HTML5, Tailwind CSS (CDN), Vanilla JS + Alpine.js
- Backend: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- Hosting: Vercel + GitHub
- Librerías: canvas-confetti, qrcode.js, Chart.js, Lucide Icons

---

## 🗂️ ESTRUCTURA DEL PROYECTO

boda-digital/
│
├── index.html # Landing pública de invitados
├── admin.html # Panel de administración (novios)
├── subir-fotos.html # Página para subir fotos vía QR
├── 404.html # Página de error personalizada
│
├── assets/
│ ├── css/
│ │ ├── tailwind.css # Tailwind compilado (o CDN)
│ │ ├── custom.css # Estilos personalizables
│ │ └── admin.css # Estilos específicos del panel
│ │
│ ├── js/
│ │ ├── config.js # Configuración global
│ │ ├── supabase-client.js # Cliente de Supabase
│ │ ├── landing.js # Lógica de la landing
│ │ ├── admin.js # Lógica del backoffice
│ │ ├── upload.js # Lógica de subida de fotos
│ │ ├── mesas.js # Gestión de mesas
│ │ └── personalizacion.js # Editor visual en vivo
│ │
│ └── images/
│ ├── default-fondo.jpg # Fondo por defecto
│ ├── default-logo.png # Logo por defecto
│ └── default-dresscode/ # Fotos de dress code por defecto
│
├── supabase/
│ ├── migrations/
│ │ ├── 001_create_tables.sql
│ │ ├── 002_add_rls_policies.sql
│ │ ├── 003_create_triggers.sql
│ │ └── 004_seed_data.sql
│ │
│ └── functions/
│ └── notificaciones/
│ ├── index.js # Edge Function para notificaciones
│ └── package.json
│
├── .env # Variables de entorno
├── .gitignore # Archivos ignorados por Git
├── vercel.json # Configuración de despliegue
├── package.json # Dependencias (opcional)
└── README.md # Documentación del proyecto

---

## 🔧 CONFIGURACIÓN INICIAL (.env)

Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-public
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

URLs
APP_URL=https://tu-dominio.vercel.app
ADMIN_EMAIL=novios@email.com

Email (para notificaciones)
RESEND_API_KEY=tu-api-key-de-resend
EMAIL_FROM=no-reply@tudominio.com

---

## 📝 FASES DE DESARROLLO

### ✅ FASE 0: CONFIGURACIÓN INICIAL DEL PROYECTO

**Objetivo:** Crear la estructura base del proyecto y configurar el entorno de desarrollo.

**Tareas:**

1. Crear la estructura de carpetas completa.
2. Crear archivos base: index.html, admin.html, subir-fotos.html, 404.html.
3. Crear .env con variables de entorno.
4. Configurar .gitignore.
5. Crear vercel.json para despliegue.
6. Crear README.md con instrucciones.
7. Inicializar repositorio Git.

**Prompt para el agente:**
"Ejecuta la Fase 0 del plan: crea toda la estructura de carpetas y archivos base del proyecto. Asegúrate de incluir .env, .gitignore, vercel.json y README.md. Inicializa Git y haz el primer commit."

---

### ✅ FASE 1: BASE DE DATOS COMPLETA

**Objetivo:** Crear todas las tablas, relaciones, políticas RLS, triggers y funciones en Supabase.

**Tablas:**

- bodas (configuración principal)
- menu_opciones (menús configurables)
- invitaciones (gestión de invitados)
- mesas (distribución de mesas)
- asignacion_mesas (relación invitados-mesas)
- cuentas_bancarias (cuentas para transferencias)
- deseos (muro de deseos)
- canciones_sugeridas (sugerencias musicales)
- fotos_album (fotos subidas)
- proveedores (directorio de proveedores)
- gastos (registro financiero)
- tareas (checklist de tareas)

**Tareas:**

1. Crear script SQL con todas las tablas y relaciones.
2. Crear triggers y funciones (updated_at, validación de cupos, generación de slug).
3. Configurar políticas RLS (lectura pública, escritura autenticada, admin total).
4. Ejecutar el script en Supabase SQL Editor.

**Prompt para el agente:**
"Ejecuta la Fase 1: crea el script SQL completo para Supabase con todas las tablas, relaciones, triggers, funciones y políticas RLS. Guarda el script en supabase/migrations/001_create_tables.sql."

---

### ✅ FASE 2: BACKOFFICE - PANEL DE CONTROL (PARTE 1)

**Objetivo:** Crear el panel de administración con autenticación, dashboard y personalización visual.

**Tareas:**

1. Crear admin.html con login (email + Google OAuth).
2. Implementar sidebar con navegación.
3. Crear dashboard con tarjetas resumen y gráficos (Chart.js).
4. Implementar editor visual en vivo (colores, fuentes, imágenes, mensajes).
5. Crear gestión de mesas (CRUD + vista visual).
6. Conectar todas las secciones con Supabase.

**Prompt para el agente:**
"Ejecuta la Fase 2: crea admin.html con autenticación de Supabase, dashboard con gráficos, editor de personalización visual y gestión de mesas. Incluye todo el CSS y JavaScript necesario."

---

### ✅ FASE 3: BACKOFFICE - GESTIÓN DE INVITADOS Y MESAS

**Objetivo:** Implementar CRUD de invitados, asignación de mesas y reportes.

**Tareas:**

1. Crear lista de invitados con filtros y buscador.
2. Implementar modal para crear/editar invitaciones.
3. Generar enlaces únicos con slug.
4. Implementar asignación de mesas (selector + drag & drop).
5. Crear vista interactiva de mesas (plano del salón).
6. Implementar reportes (PDF, CSV).
7. Actualizar en tiempo real con Supabase Realtime.

**Prompt para el agente:**
"Ejecuta la Fase 3: amplía admin.html con gestión completa de invitados, asignación de mesas con drag & drop, y reportes. Incluye todas las validaciones y actualización en tiempo real."

---

### ✅ FASE 4: BACKOFFICE - FINANZAS, PROVEEDORES Y TAREAS

**Objetivo:** Implementar gestión financiera y operativa.

**Tareas:**

1. Crear CRUD de proveedores con categorías.
2. Implementar registro de gastos con resumen financiero.
3. Crear gráficos de gastos por categoría.
4. Implementar checklist de tareas.
5. Configurar cuentas bancarias para mostrar a invitados.
6. Conectar todo con Supabase.

**Prompt para el agente:**
"Ejecuta la Fase 4: agrega a admin.html la gestión de proveedores, gastos, tareas y cuentas bancarias. Incluye gráficos financieros y resúmenes."

---

### ✅ FASE 5: LANDING PÚBLICA - SOBRE Y TARJETA PERSONALIZADA

**Objetivo:** Crear la landing con sobre animado y tarjeta personalizada.

**Tareas:**

1. Crear index.html con carga dinámica desde URL (?id=).
2. Implementar sobre 3D con CSS.
3. Crear sello de cera con iniciales.
4. Implementar animación de apertura (canvas-confetti).
5. Crear tarjeta con datos dinámicos (nombres, fecha, cuenta regresiva).
6. Mostrar ubicaciones, dress code y paleta de colores.
7. Aplicar personalización visual desde la BD.
8. Hacer responsive (mobile-first).

**Prompt para el agente:**
"Ejecuta la Fase 5: crea index.html con sobre animado 3D, sello de cera, apertura con confeti, y tarjeta personalizada con todos los datos de la boda. Aplica colores y fuentes desde la BD."

---

### ✅ FASE 6: LANDING - RSVP, MENÚS Y CUENTAS BANCARIAS

**Objetivo:** Implementar módulos interactivos de confirmación.

**Tareas:**

1. Crear módulo RSVP con selector de cupos.
2. Implementar selección de menú por asistente.
3. Agregar campo de alergias.
4. Conectar con Supabase para guardar confirmación.
5. Mostrar resumen de confirmación con opción de modificar.
6. Listar cuentas bancarias con botón de copiar.
7. Mostrar mesa asignada al invitado.

**Prompt para el agente:**
"Ejecuta la Fase 6: agrega a index.html el módulo RSVP completo con selección de menús por asistente, campo de alergias, y conexión con Supabase. También muestra las cuentas bancarias con botón de copiar."

---

### ✅ FASE 7: LANDING - DESEOS, CANCIONES Y ÁLBUM QR

**Objetivo:** Implementar muro de deseos, sugerencia de canciones y álbum QR.

**Tareas:**

1. Crear formulario de deseos con aprobación.
2. Listar deseos aprobados (tiempo real).
3. Crear formulario de sugerencia de canciones.
4. Listar canciones aprobadas (estilo playlist).
5. Generar QR para subir fotos.
6. Crear galería de fotos aprobadas (masonry grid).
7. Implementar lazy loading y actualización en tiempo real.

**Prompt para el agente:**
"Ejecuta la Fase 7: agrega a index.html el muro de deseos, sugerencia de canciones, generación de QR y galería de fotos. Todo con actualización en tiempo real."

---

### ✅ FASE 8: PÁGINA DE SUBIDA DE FOTOS (QR)

**Objetivo:** Crear página independiente para subir fotos vía QR.

**Tareas:**

1. Crear subir-fotos.html con verificación de boda y fecha.
2. Implementar drag & drop + preview.
3. Subir fotos a Supabase Storage.
4. Guardar registro en fotos_album (aprobado = false).
5. Mostrar galería de fotos aprobadas (tiempo real).
6. Agregar compresión de imágenes (opcional).

**Prompt para el agente:**
"Ejecuta la Fase 8: crea subir-fotos.html con drag & drop, preview, subida a Supabase Storage, y galería de fotos aprobadas en tiempo real."

---

### ✅ FASE 9: MODERACIÓN AVANZADA Y NOTIFICACIONES

**Objetivo:** Implementar panel de moderación y notificaciones automáticas.

**Tareas:**

1. Crear pestañas de moderación (deseos, canciones, fotos).
2. Implementar acciones masivas (aprobar, rechazar, eliminar).
3. Configurar Edge Functions para notificaciones.
4. Implementar notificaciones en tiempo real (Realtime).
5. Configurar recordatorios automáticos (RSVP, evento).
6. Agregar exportación de datos (CSV, PDF).

**Prompt para el agente:**
"Ejecuta la Fase 9: agrega a admin.html la moderación de contenido (deseos, canciones, fotos) con acciones masivas. Configura Edge Functions para notificaciones y recordatorios."

---

### ✅ FASE 10: DESPLIEGUE, PERSONALIZACIÓN Y MANTENIMIENTO

**Objetivo:** Preparar el proyecto para producción.

**Tareas:**

1. Conectar GitHub con Vercel.
2. Configurar variables de entorno en Vercel.
3. Implementar sistema de temas predefinidos (5 temas).
4. Optimizar rendimiento (compresión, lazy loading, cache).
5. Configurar backup automático de Supabase.
6. Crear documentación final (manual de usuario).
7. Revisar seguridad y políticas RLS.

**Prompt para el agente:**
"Ejecuta la Fase 10: configura GitHub y Vercel para despliegue automático. Implementa 5 temas predefinidos, optimiza el rendimiento, y crea la documentación final."

---

## 📋 CHECKLIST DE ENTREGA

- [x] Fase 0: Configuración del proyecto
- [x] Fase 1: Base de datos completa
- [x] Fase 2: Backoffice - Panel de control
- [ ] Fase 3: Backoffice - Invitados y mesas
- [ ] Fase 4: Backoffice - Finanzas, proveedores y tareas
- [ ] Fase 5: Landing - Sobre y tarjeta
- [ ] Fase 6: Landing - RSVP, menús y cuentas
- [ ] Fase 7: Landing - Deseos, canciones y álbum QR
- [ ] Fase 8: Página de subida de fotos
- [ ] Fase 9: Moderación y notificaciones
- [ ] Fase 10: Despliegue y mantenimiento

---

## 📌 COMANDOS PARA EL AGENTE

```bash
# Para iniciar una fase específica
forge-agent "Ejecuta la Fase 0 del plan"

# Para continuar con la siguiente fase
forge-agent "Continúa con la Fase 1"

# Para ver el progreso
forge-agent "Muestra el progreso del proyecto"

# Para revisar el código de una fase
forge-agent "Revisa el código de admin.html y sugiere mejoras"

🔗 ENLACES IMPORTANTES
Supabase Dashboard: https://app.supabase.com

Vercel Dashboard: https://vercel.com

GitHub Repositorio: https://github.com/tu-usuario/boda-digital
```
