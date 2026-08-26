/**
 * Boda Digital - Admin Panel Logic
 * Handles authentication, dashboard, and CRUD operations
 */

function adminApp() {
    return {
        authenticated: false,
        user: null,
        currentView: 'dashboard',
        
        // Login data
        loginData: {
            email: '',
            password: '',
        },
        loginError: null,
        loginLoading: false,
        
        // Data
        config: null,
        invitados: [],
        mesas: [],
        finanzas: [],
        proveedores: [],
        tareas: [],
        fotos: [],
        deseos: [],
        
        // Stats
        stats: {
            totalInvitados: 0,
            confirmados: 0,
            pendientes: 0,
            totalFotos: 0,
            porcentajeConfirmados: 0,
            porcentajeTareas: 0,
            totalMesas: 0,
            totalPresupuesto: 0,
            totalGastos: 0,
            saldo: 0,
        },
        
        // Chart instances
        chartInvitados: null,
        chartPresupuesto: null,
        
        // UI state
        loading: false,
        error: null,
        success: false,
        showAddInvitado: false,
        editingInvitado: null,
        
        async init() {
            try {
                // Check for existing session
                await this.checkSession();
                
                // If authenticated, load data
                if (this.authenticated) {
                    await this.loadAllData();
                }
                
                console.log('✅ Admin panel initialized');
            } catch (error) {
                console.error('Error initializing admin:', error);
            }
        },
        
        async checkSession() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode - auto-login for testing
                    this.authenticated = true;
                    this.user = { email: 'admin@demo.com' };
                    return;
                }
                
                const { data, error } = await supabaseClient.getSession();
                if (error) throw error;
                
                if (data?.session) {
                    this.authenticated = true;
                    const { data: userData } = await supabaseClient.getUser();
                    this.user = userData?.user || null;
                }
            } catch (error) {
                console.error('Session check error:', error);
                this.authenticated = false;
            }
        },
        
        async login() {
            this.loginLoading = true;
            this.loginError = null;
            
            try {
                if (!this.loginData.email || !this.loginData.password) {
                    throw new Error('Por favor ingresa email y contraseña');
                }
                
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode - accept any credentials
                    if (this.loginData.email && this.loginData.password) {
                        this.authenticated = true;
                        this.user = { email: this.loginData.email };
                        this.loginLoading = false;
                        await this.loadAllData();
                        return;
                    }
                }
                
                const { data, error } = await supabaseClient.signIn(
                    this.loginData.email,
                    this.loginData.password
                );
                
                if (error) throw new Error(error);
                
                this.authenticated = true;
                this.user = data?.user || null;
                this.loginData = { email: '', password: '' };
                
                // Load all data
                await this.loadAllData();
                
            } catch (error) {
                this.loginError = error.message || 'Error al iniciar sesión';
            } finally {
                this.loginLoading = false;
            }
        },
        
        async logout() {
            try {
                if (typeof supabaseClient !== 'undefined') {
                    await supabaseClient.signOut();
                }
                
                this.authenticated = false;
                this.user = null;
                this.currentView = 'dashboard';
                
                // Reset data
                this.invitados = [];
                this.stats = {
                    totalInvitados: 0,
                    confirmados: 0,
                    pendientes: 0,
                    totalFotos: 0,
                    porcentajeConfirmados: 0,
                    porcentajeTareas: 0,
                    totalMesas: 0,
                };
                
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
        
        async loadAllData() {
            this.loading = true;
            
            try {
                await Promise.all([
                    this.loadConfig(),
                    this.loadInvitados(),
                    this.loadStats(),
                    this.loadFotos(),
                    this.loadDeseos(),
                ]);
                
            } catch (error) {
                console.error('Error loading data:', error);
                this.error = 'Error al cargar los datos';
            } finally {
                this.loading = false;
            }
        },
        
        async loadConfig() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Use default config
                    this.config = {
                        color_principal: '#e91e63',
                        titulo: '¡Nos Casamos!',
                        novios: 'Carlos & María',
                    };
                    return;
                }
                
                const { data, error } = await supabaseClient.getConfiguracion();
                if (error) throw error;
                
                this.config = data || {
                    color_principal: '#e91e63',
                    titulo: '¡Nos Casamos!',
                    novios: 'Carlos & María',
                };
                
            } catch (error) {
                console.error('Error loading config:', error);
            }
        },
        
        async loadInvitados() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo data
                    this.invitados = [
                        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', asistira: true, mesa: 'Mesa 1' },
                        { id: 2, nombre: 'María López', email: 'maria@email.com', telefono: '987654321', asistira: false, mesa: null },
                        { id: 3, nombre: 'Carlos García', email: 'carlos@email.com', telefono: '555555555', asistira: null, mesa: 'Mesa 2' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getInvitados();
                if (error) throw error;
                
                this.invitados = data || [];
                
            } catch (error) {
                console.error('Error loading invitados:', error);
            }
        },
        
        async loadStats() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo stats
                    this.stats = {
                        totalInvitados: 120,
                        confirmados: 78,
                        pendientes: 42,
                        totalFotos: 45,
                        porcentajeConfirmados: 65,
                        porcentajeTareas: 70,
                        totalMesas: 12,
                    };
                    return;
                }
                
                const { data, error } = await supabaseClient.getStats();
                if (error) throw error;
                
                if (data) {
                    this.stats = {
                        ...this.stats,
                        ...data,
                        pendientes: data.totalInvitados - data.totalConfirmados,
                        porcentajeConfirmados: data.totalInvitados > 0 
                            ? Math.round((data.totalConfirmados / data.totalInvitados) * 100) 
                            : 0,
                    };
                }
                
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },
        
        async loadFotos() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.fotos = [];
                    return;
                }
                
                const { data, error } = await supabaseClient.getFotos(10);
                if (error) throw error;
                
                this.fotos = data || [];
                
            } catch (error) {
                console.error('Error loading fotos:', error);
            }
        },
        
        async loadDeseos() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.deseos = [
                        { id: 1, nombre: 'Ana', texto: '¡Felicidades! 🎉', created_at: new Date().toISOString() },
                        { id: 2, nombre: 'Pedro', texto: 'Mucha felicidad para la pareja', created_at: new Date().toISOString() },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getDeseos();
                if (error) throw error;
                
                this.deseos = data || [];
                
            } catch (error) {
                console.error('Error loading deseos:', error);
            }
        },
        
        async addInvitado(invitado) {
            this.loading = true;
            this.error = null;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    const newInvitado = {
                        id: Date.now(),
                        ...invitado,
                        asistira: null,
                    };
                    this.invitados.unshift(newInvitado);
                    this.showAddInvitado = false;
                    return;
                }
                
                const { data, error } = await supabaseClient.addInvitado(invitado);
                if (error) throw new Error(error);
                
                this.invitados.unshift(data);
                this.showAddInvitado = false;
                await this.loadStats();
                
                this.success = true;
                setTimeout(() => this.success = false, 3000);
                
            } catch (error) {
                this.error = error.message || 'Error al agregar invitado';
            } finally {
                this.loading = false;
            }
        },
        
        async deleteInvitado(id) {
            if (!confirm('¿Estás seguro de eliminar este invitado?')) return;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    this.invitados = this.invitados.filter(i => i.id !== id);
                    return;
                }
                
                const { error } = await supabaseClient.deleteInvitado(id);
                if (error) throw new Error(error);
                
                this.invitados = this.invitados.filter(i => i.id !== id);
                await this.loadStats();
                
            } catch (error) {
                console.error('Error deleting invitado:', error);
                alert('Error al eliminar el invitado');
            }
        },
        
        editInvitado(invitado) {
            this.editingInvitado = { ...invitado };
            this.showAddInvitado = true;
        },
        
        async saveInvitado() {
            if (!this.editingInvitado) return;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    const index = this.invitados.findIndex(i => i.id === this.editingInvitado.id);
                    if (index !== -1) {
                        this.invitados[index] = { ...this.editingInvitado };
                    }
                    this.showAddInvitado = false;
                    this.editingInvitado = null;
                    return;
                }
                
                const { data, error } = await supabaseClient.updateInvitado(
                    this.editingInvitado.id,
                    this.editingInvitado
                );
                if (error) throw new Error(error);
                
                const index = this.invitados.findIndex(i => i.id === this.editingInvitado.id);
                if (index !== -1) {
                    this.invitados[index] = data;
                }
                
                this.showAddInvitado = false;
                this.editingInvitado = null;
                
            } catch (error) {
                console.error('Error saving invitado:', error);
                alert('Error al guardar el invitado');
            }
        },
        
        cancelEdit() {
            this.showAddInvitado = false;
            this.editingInvitado = null;
        },
        
        // Data loading methods
        async loadAllData() {
            this.loading = true;
            
            try {
                await Promise.all([
                    this.loadConfig(),
                    this.loadInvitados(),
                    this.loadMesas(),
                    this.loadFinanzas(),
                    this.loadProveedores(),
                    this.loadTareas(),
                    this.loadFotos(),
                    this.loadDeseos(),
                    this.loadStats(),
                ]);
                
                // Initialize charts if on dashboard
                if (this.currentView === 'dashboard') {
                    this.initCharts();
                }
                
            } catch (error) {
                console.error('Error loading data:', error);
                this.error = 'Error al cargar los datos';
            } finally {
                this.loading = false;
            }
        },
        
        async loadConfig() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Use default config
                    this.config = {
                        color_principal: '#e91e63',
                        titulo: '¡Nos Casamos!',
                        novios: 'Carlos & María',
                        fecha: '2026-12-25',
                        lugar: 'Salón de Eventos',
                    };
                    return;
                }
                
                const { data, error } = await supabaseClient.getConfiguracion();
                if (error) throw error;
                
                this.config = data || {
                    color_principal: '#e91e63',
                    titulo: '¡Nos Casamos!',
                    novios: 'Carlos & María',
                    fecha: '2026-12-25',
                    lugar: 'Salón de Eventos',
                };
                
            } catch (error) {
                console.error('Error loading config:', error);
            }
        },
        
        async loadInvitados() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo data
                    this.invitados = [
                        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', asistira: true, mesa: 'Mesa 1', acompanantes: 2, menu: 'Carne' },
                        { id: 2, nombre: 'María López', email: 'maria@email.com', telefono: '987654321', asistira: false, mesa: null, acompanantes: 0, menu: 'Pescado' },
                        { id: 3, nombre: 'Carlos García', email: 'carlos@email.com', telefono: '555555555', asistira: null, mesa: 'Mesa 2', acompanantes: 1, menu: 'Vegetariano' },
                        { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', telefono: '444444444', asistira: true, mesa: 'Mesa 1', acompanantes: 1, menu: 'Carne' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getInvitados();
                if (error) throw error;
                this.invitados = data || [];
                
            } catch (error) {
                console.error('Error loading invitados:', error);
                // Fallback to demo data
                this.invitados = [
                    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123456789', asistira: true, mesa: 'Mesa 1', acompanantes: 2, menu: 'Carne' },
                    { id: 2, nombre: 'María López', email: 'maria@email.com', telefono: '987654321', asistira: false, mesa: null, acompanantes: 0, menu: 'Pescado' },
                ];
            }
        },
        
        async loadMesas() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.mesas = [
                        { id: 1, nombre: 'Mesa 1', capacidad: 8, ubicacion: 'Principal' },
                        { id: 2, nombre: 'Mesa 2', capacidad: 6, ubicacion: 'Lateral' },
                        { id: 3, nombre: 'Mesa 3', capacidad: 8, ubicacion: 'Principal' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getMesas();
                if (error) throw error;
                this.mesas = data || [];
                
            } catch (error) {
                console.error('Error loading mesas:', error);
                this.mesas = [];
            }
        },
        
        async loadFinanzas() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.finanzas = [
                        { id: 1, concepto: 'Pago Salón', monto: 1500, tipo: 'gasto', categoria: 'Lugar', fecha: '2026-01-15' },
                        { id: 2, concepto: 'Presupuesto inicial', monto: 5000, tipo: 'ingreso', categoria: 'Ahorros', fecha: '2026-01-01' },
                        { id: 3, concepto: 'Comida', monto: 800, tipo: 'gasto', categoria: 'Alimentación', fecha: '2026-02-10' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getFinanzas();
                if (error) throw error;
                this.finanzas = data || [];
                
            } catch (error) {
                console.error('Error loading finanzas:', error);
                this.finanzas = [];
            }
        },
        
        async loadProveedores() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.proveedores = [
                        { id: 1, nombre: 'Floristería Bella', servicio: 'Flores', telefono: '123456789', estado: 'confirmado' },
                        { id: 2, nombre: 'Catering Gourmet', servicio: 'Comida', telefono: '987654321', estado: 'pendiente' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getProveedores();
                if (error) throw error;
                this.proveedores = data || [];
                
            } catch (error) {
                console.error('Error loading proveedores:', error);
                this.proveedores = [];
            }
        },
        
        async loadTareas() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.tareas = [
                        { id: 1, titulo: 'Elegir vestido de novia', completada: true, prioridad: 'alta' },
                        { id: 2, titulo: 'Contratar música', completada: false, prioridad: 'media' },
                        { id: 3, titulo: 'Enviar invitaciones', completada: false, prioridad: 'alta' },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getTareas();
                if (error) throw error;
                this.tareas = data || [];
                
            } catch (error) {
                console.error('Error loading tareas:', error);
                this.tareas = [];
            }
        },
        
        async loadFotos() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.fotos = [
                        { id: 1, url: 'https://via.placeholder.com/150', descripcion: 'Foto de prueba 1', aprobada: true },
                        { id: 2, url: 'https://via.placeholder.com/150', descripcion: 'Foto de prueba 2', aprobada: false },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getFotos();
                if (error) throw error;
                this.fotos = data || [];
                
            } catch (error) {
                console.error('Error loading fotos:', error);
                this.fotos = [];
            }
        },
        
        async loadDeseos() {
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.deseos = [
                        { id: 1, nombre: 'Juan', mensaje: 'Felicidades!', aprobado: true },
                        { id: 2, nombre: 'María', mensaje: 'Que sean muy felices', aprobado: false },
                    ];
                    return;
                }
                
                const { data, error } = await supabaseClient.getDeseos();
                if (error) throw error;
                this.deseos = data || [];
                
            } catch (error) {
                console.error('Error loading deseos:', error);
                this.deseos = [];
            }
        },
        
        async loadStats() {
            try {
                const total = this.invitados.length;
                const confirmados = this.invitados.filter(i => i.asistira === true).length;
                const pendientes = this.invitados.filter(i => i.asistira === null || i.asistira === undefined).length;
                const noAsistiran = this.invitados.filter(i => i.asistira === false).length;
                const totalMesas = this.mesas.length;
                const tareasCompletadas = this.tareas.filter(t => t.completada).length;
                const totalTareas = this.tareas.length;
                
                // Calculate financial stats
                const totalPresupuesto = this.finanzas.filter(f => f.tipo === 'ingreso').reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0);
                const totalGastos = this.finanzas.filter(f => f.tipo === 'gasto').reduce((sum, f) => sum + (parseFloat(f.monto) || 0), 0);
                const saldo = totalPresupuesto - totalGastos;
                
                this.stats = {
                    totalInvitados: total,
                    confirmados: confirmados,
                    pendientes: pendientes,
                    noAsistiran: noAsistiran,
                    totalFotos: this.fotos.length,
                    porcentajeConfirmados: total > 0 ? Math.round((confirmados / total) * 100) : 0,
                    porcentajeTareas: totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0,
                    totalMesas: totalMesas,
                    totalPresupuesto: totalPresupuesto,
                    totalGastos: totalGastos,
                    saldo: saldo,
                    tareasCompletadas: tareasCompletadas,
                    totalTareas: totalTareas,
                };
                
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },
        
        initCharts() {
            // Destroy existing charts
            if (this.chartInvitados) {
                this.chartInvitados.destroy();
                this.chartInvitados = null;
            }
            if (this.chartPresupuesto) {
                this.chartPresupuesto.destroy();
                this.chartPresupuesto = null;
            }
            
            // Wait for DOM to render
            setTimeout(() => {
                this.createInvitadosChart();
                this.createPresupuestoChart();
            }, 100);
        },
        
        createInvitadosChart() {
            const canvas = document.getElementById('chartInvitados');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            this.chartInvitados = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Confirmados', 'Pendientes', 'No Asistirán'],
                    datasets: [{
                        data: [
                            this.stats.confirmados || 0,
                            this.stats.pendientes || 0,
                            this.stats.noAsistiran || 0
                        ],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
        },
        
        createPresupuestoChart() {
            const canvas = document.getElementById('chartPresupuesto');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Group expenses by category
            const categories = {};
            this.finanzas.filter(f => f.tipo === 'gasto').forEach(gasto => {
                const cat = gasto.categoria || 'Otros';
                categories[cat] = (categories[cat] || 0) + (parseFloat(gasto.monto) || 0);
            });
            
            const labels = Object.keys(categories);
            const data = Object.values(categories);
            
            // If no data, show sample
            if (labels.length === 0) {
                labels.push('Sin datos');
                data.push(0);
            }
            
            this.chartPresupuesto = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Gastos por Categoría',
                        data: data,
                        backgroundColor: this.config?.color_principal || '#e91e63',
                        borderColor: '#c2185b',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        // Watch for view changes
        currentViewChanged() {
            if (this.currentView === 'dashboard') {
                this.initCharts();
            }
        },
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Admin panel loaded');
});

        // Personalization methods
        personalization: {
            color_principal: '#e91e63',
            color_secundario: '#ff6f00',
            fuente_titulos: 'serif',
            fuente_textos: 'sans-serif',
            fondo_url: '',
            logo_url: '',
            mensaje_personal: '',
        },
        
        async savePersonalization() {
            try {
                this.loading = true;
                
                if (typeof supabaseClient !== 'undefined') {
                    const { data, error } = await supabaseClient.updateBodaConfig(this.personalization);
                    if (error) throw error;
                    this.config = { ...this.config, ...this.personalization };
                } else {
                    // Demo mode
                    this.config = { ...this.config, ...this.personalization };
                }
                
                // Apply changes to the page
                this.applyPersonalization();
                this.success = true;
                setTimeout(() => this.success = false, 3000);
                
            } catch (error) {
                console.error('Error saving personalization:', error);
                this.error = 'Error al guardar la personalización';
            } finally {
                this.loading = false;
            }
        },
        
        applyPersonalization() {
            if (!this.config) return;
            
            // Apply color to the page
            if (this.config.color_principal) {
                document.documentElement.style.setProperty('--color-primary', this.config.color_principal);
                
                // Update all elements with the color
                document.querySelectorAll('[style*="background-color"]').forEach(el => {
                    if (el.style.backgroundColor) {
                        // Only update if it matches the previous color
                        el.style.backgroundColor = this.config.color_principal;
                    }
                });
            }
        },
        
        loadPersonalization() {
            if (this.config) {
                this.personalization = {
                    color_principal: this.config.color_principal || '#e91e63',
                    color_secundario: this.config.color_secundario || '#ff6f00',
                    fuente_titulos: this.config.fuente_titulos || 'serif',
                    fuente_textos: this.config.fuente_textos || 'sans-serif',
                    fondo_url: this.config.fondo_url || '',
                    logo_url: this.config.logo_url || '',
                    mensaje_personal: this.config.mensaje_personal || '',
                };
            }
        },        
        // Mesa CRUD operations
        showAddMesa: false,
        editingMesa: { nombre: '', capacidad: 8, ubicacion: '' },
        
        addMesa() {
            this.showAddMesa = true;
            this.editingMesa = { nombre: '', capacidad: 8, ubicacion: '' };
        },
        
        editMesa(mesa) {
            this.showAddMesa = true;
            this.editingMesa = { ...mesa };
        },
        
        async saveMesa() {
            if (!this.editingMesa.nombre) {
                alert('Por favor ingresa un nombre para la mesa');
                return;
            }
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    if (this.editingMesa.id) {
                        const index = this.mesas.findIndex(m => m.id === this.editingMesa.id);
                        if (index !== -1) {
                            this.mesas[index] = { ...this.editingMesa };
                        }
                    } else {
                        this.editingMesa.id = Date.now();
                        this.mesas.push({ ...this.editingMesa });
                    }
                    this.showAddMesa = false;
                    this.editingMesa = { nombre: '', capacidad: 8, ubicacion: '' };
                    await this.loadStats();
                    return;
                }
                
                let result;
                if (this.editingMesa.id) {
                    result = await supabaseClient.updateMesa(this.editingMesa.id, this.editingMesa);
                } else {
                    result = await supabaseClient.createMesa(this.editingMesa);
                }
                
                if (result.error) throw result.error;
                
                await this.loadMesas();
                await this.loadStats();
                this.showAddMesa = false;
                this.editingMesa = { nombre: '', capacidad: 8, ubicacion: '' };
                
            } catch (error) {
                console.error('Error saving mesa:', error);
                alert('Error al guardar la mesa');
            }
        },
        
        async deleteMesa(id) {
            if (!confirm('¿Estás seguro de eliminar esta mesa?')) return;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    this.mesas = this.mesas.filter(m => m.id !== id);
                    await this.loadStats();
                    return;
                }
                
                const { error } = await supabaseClient.deleteMesa(id);
                if (error) throw error;
                
                await this.loadMesas();
                await this.loadStats();
                
            } catch (error) {
                console.error('Error deleting mesa:', error);
                alert('Error al eliminar la mesa');
            }
        },
        
        cancelMesa() {
            this.showAddMesa = false;
            this.editingMesa = { nombre: '', capacidad: 8, ubicacion: '' };
        },        
        // Finanza CRUD operations
        showAddFinanza: false,
        editingFinanza: { concepto: '', monto: 0, tipo: 'gasto', categoria: '', fecha: '' },
        
        addFinanza() {
            this.showAddFinanza = true;
            const today = new Date().toISOString().split('T')[0];
            this.editingFinanza = { concepto: '', monto: 0, tipo: 'gasto', categoria: '', fecha: today };
        },
        
        async saveFinanza() {
            if (!this.editingFinanza.concepto || !this.editingFinanza.monto) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    this.editingFinanza.id = Date.now();
                    this.finanzas.push({ ...this.editingFinanza });
                    this.showAddFinanza = false;
                    this.editingFinanza = { concepto: '', monto: 0, tipo: 'gasto', categoria: '', fecha: '' };
                    await this.loadStats();
                    return;
                }
                
                const { data, error } = await supabaseClient.createFinanza(this.editingFinanza);
                if (error) throw error;
                
                await this.loadFinanzas();
                await this.loadStats();
                this.showAddFinanza = false;
                this.editingFinanza = { concepto: '', monto: 0, tipo: 'gasto', categoria: '', fecha: '' };
                
            } catch (error) {
                console.error('Error saving finanza:', error);
                alert('Error al guardar el movimiento');
            }
        },
        
        async deleteFinanza(id) {
            if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.finanzas = this.finanzas.filter(f => f.id !== id);
                    await this.loadStats();
                    return;
                }
                
                const { error } = await supabaseClient.deleteFinanza(id);
                if (error) throw error;
                
                await this.loadFinanzas();
                await this.loadStats();
                
            } catch (error) {
                console.error('Error deleting finanza:', error);
                alert('Error al eliminar el movimiento');
            }
        },
        
        cancelFinanza() {
            this.showAddFinanza = false;
            this.editingFinanza = { concepto: '', monto: 0, tipo: 'gasto', categoria: '', fecha: '' };
        },        
        // Tarea CRUD operations
        showAddTarea: false,
        editingTarea: { titulo: '', prioridad: 'media', completada: false },
        
        addTarea() {
            this.showAddTarea = true;
            this.editingTarea = { titulo: '', prioridad: 'media', completada: false };
        },
        
        editTarea(tarea) {
            this.showAddTarea = true;
            this.editingTarea = { ...tarea };
        },
        
        async saveTarea() {
            if (!this.editingTarea.titulo) {
                alert('Por favor ingresa un título para la tarea');
                return;
            }
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    // Demo mode
                    if (this.editingTarea.id) {
                        const index = this.tareas.findIndex(t => t.id === this.editingTarea.id);
                        if (index !== -1) {
                            this.tareas[index] = { ...this.editingTarea };
                        }
                    } else {
                        this.editingTarea.id = Date.now();
                        this.tareas.push({ ...this.editingTarea });
                    }
                    this.showAddTarea = false;
                    this.editingTarea = { titulo: '', prioridad: 'media', completada: false };
                    await this.loadStats();
                    return;
                }
                
                let result;
                if (this.editingTarea.id) {
                    result = await supabaseClient.updateTarea(this.editingTarea.id, this.editingTarea);
                } else {
                    result = await supabaseClient.createTarea(this.editingTarea);
                }
                
                if (result.error) throw result.error;
                
                await this.loadTareas();
                await this.loadStats();
                this.showAddTarea = false;
                this.editingTarea = { titulo: '', prioridad: 'media', completada: false };
                
            } catch (error) {
                console.error('Error saving tarea:', error);
                alert('Error al guardar la tarea');
            }
        },
        
        async toggleTarea(tarea) {
            try {
                if (typeof supabaseClient === 'undefined') {
                    await this.loadStats();
                    return;
                }
                
                const { error } = await supabaseClient.updateTarea(tarea.id, { completada: tarea.completada });
                if (error) throw error;
                
                await this.loadStats();
                
            } catch (error) {
                console.error('Error toggling tarea:', error);
            }
        },
        
        async deleteTarea(id) {
            if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
            
            try {
                if (typeof supabaseClient === 'undefined') {
                    this.tareas = this.tareas.filter(t => t.id !== id);
                    await this.loadStats();
                    return;
                }
                
                const { error } = await supabaseClient.deleteTarea(id);
                if (error) throw error;
                
                await this.loadTareas();
                await this.loadStats();
                
            } catch (error) {
                console.error('Error deleting tarea:', error);
                alert('Error al eliminar la tarea');
            }
        },
        
        cancelTarea() {
            this.showAddTarea = false;
            this.editingTarea = { titulo: '', prioridad: 'media', completada: false };
        },