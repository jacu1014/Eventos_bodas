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
        },
        
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
        }
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Admin panel loaded');
});
