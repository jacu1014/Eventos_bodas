/**
 * Boda Digital - Supabase Client
 * Handles all database and storage interactions
 */

class SupabaseClient {
    constructor() {
        this.supabase = null;
        this.initialized = false;
    }

    /**
     * Initialize the Supabase client
     */
    init(url, anonKey) {
        try {
            if (typeof supabase === 'undefined') {
                console.error('Supabase library not loaded. Please include the Supabase CDN script.');
                return false;
            }
            
            this.supabase = supabase.createClient(url, anonKey);
            this.initialized = true;
            console.log('✅ Supabase client initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            return false;
        }
    }

    /**
     * Check if client is initialized
     */
    isReady() {
        if (!this.initialized || !this.supabase) {
            console.warn('Supabase client not initialized');
            return false;
        }
        return true;
    }

    /**
     * Get the Supabase client instance
     */
    getClient() {
        return this.supabase;
    }

    // ==================== AUTH ====================

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        if (!this.isReady()) return { error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Sign out the current user
     */
    async signOut() {
        if (!this.isReady()) return { error: 'Client not initialized' };
        
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error: error.message };
        }
    }

    /**
     * Get current session
     */
    async getSession() {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase.auth.getSession();
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Get current user
     */
    async getUser() {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get user error:', error);
            return { data: null, error: error.message };
        }
    }

    // ==================== INVITADOS ====================

    /**
     * Get all guests
     */
    async getInvitados() {
        if (!this.isReady()) return { data: [], error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('invitaciones')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get invitados error:', error);
            return { data: [], error: error.message };
        }
    }

    /**
     * Add a new guest
     */
    async addInvitado(invitado) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('invitaciones')
                .insert([invitado])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Add invitado error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Update a guest
     */
    async updateInvitado(id, updates) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('invitaciones')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Update invitado error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Delete a guest
     */
    async deleteInvitado(id) {
        if (!this.isReady()) return { error: 'Client not initialized' };
        
        try {
            const { error } = await this.supabase
                .from('invitaciones')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Delete invitado error:', error);
            return { error: error.message };
        }
    }

    /**
     * Submit RSVP
     */
    async submitRSVP(data) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            // Check if guest already exists
            const { data: existing, error: searchError } = await this.supabase
                .from('invitaciones')
                .select('id')
                .eq('email', data.email)
                .single();
            
            if (searchError && searchError.code !== 'PGRST116') {
                throw searchError;
            }
            
            let result;
            if (existing) {
                // Update existing guest
                const { data: updated, error: updateError } = await this.supabase
                    .from('invitaciones')
                    .update({
                        nombre: data.nombre,
                        telefono: data.telefono || null,
                        asistira: data.asistira === 'true',
                        acompanantes: parseInt(data.acompanantes) || 0,
                        menu: data.menu || null,
                        dietas: data.dietas || null,
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();
                
                if (updateError) throw updateError;
                result = updated;
            } else {
                // Create new guest
                const { data: created, error: createError } = await this.supabase
                    .from('invitaciones')
                    .insert([{
                        nombre: data.nombre,
                        email: data.email,
                        telefono: data.telefono || null,
                        asistira: data.asistira === 'true',
                        acompanantes: parseInt(data.acompanantes) || 0,
                        menu: data.menu || null,
                        dietas: data.dietas || null,
                    }])
                    .select()
                    .single();
                
                if (createError) throw createError;
                result = created;
            }
            
            return { data: result, error: null };
        } catch (error) {
            console.error('Submit RSVP error:', error);
            return { data: null, error: error.message };
        }
    }

    // ==================== DESEOS ====================

    /**
     * Get all wishes
     */
    async getDeseos() {
        if (!this.isReady()) return { data: [], error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('deseos')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get deseos error:', error);
            return { data: [], error: error.message };
        }
    }

    /**
     * Add a wish
     */
    async addDeseo(deseo) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('deseos')
                .insert([{
                    nombre: deseo.nombre || 'Anónimo',
                    texto: deseo.texto,
                }])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Add deseo error:', error);
            return { data: null, error: error.message };
        }
    }

    // ==================== FOTOS ====================

    /**
     * Upload a photo to storage
     */
    async uploadFoto(file, metadata = {}) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `album/${fileName}`;
            
            // Upload to storage
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('fotos')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from('fotos')
                .getPublicUrl(filePath);
            
            const fotoUrl = urlData.publicUrl;
            
            // Save metadata to database
            const { data: dbData, error: dbError } = await this.supabase
                .from('fotos_album')
                .insert([{
                    url: fotoUrl,
                    storage_path: filePath,
                    titulo: metadata.titulo || null,
                    nombre_subidor: metadata.nombre || 'Anónimo',
                }])
                .select()
                .single();
            
            if (dbError) throw dbError;
            
            return { data: dbData, error: null };
        } catch (error) {
            console.error('Upload foto error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Get all photos
     */
    async getFotos(limit = 20) {
        if (!this.isReady()) return { data: [], error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('fotos_album')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get fotos error:', error);
            return { data: [], error: error.message };
        }
    }

    /**
     * Delete a photo
     */
    async deleteFoto(id, storagePath) {
        if (!this.isReady()) return { error: 'Client not initialized' };
        
        try {
            // Delete from storage
            if (storagePath) {
                const { error: storageError } = await this.supabase.storage
                    .from('fotos')
                    .remove([storagePath]);
                
                if (storageError) throw storageError;
            }
            
            // Delete from database
            const { error: dbError } = await this.supabase
                .from('fotos_album')
                .delete()
                .eq('id', id);
            
            if (dbError) throw dbError;
            
            return { error: null };
        } catch (error) {
            console.error('Delete foto error:', error);
            return { error: error.message };
        }
    }

    // ==================== CONFIGURACIÓN ====================

    /**
     * Get wedding configuration
     */
    async getConfiguracion() {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('bodas')
                .select('*')
                .limit(1)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { data: data || null, error: null };
        } catch (error) {
            console.error('Get configuracion error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Update wedding configuration
     */
    async updateConfiguracion(updates) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data: existing } = await this.getConfiguracion();
            
            let result;
            if (existing) {
                const { data, error } = await this.supabase
                    .from('bodas')
                    .update(updates)
                    .eq('id', existing.id)
                    .select()
                    .single();
                
                if (error) throw error;
                result = data;
            } else {
                const { data, error } = await this.supabase
                    .from('bodas')
                    .insert([updates])
                    .select()
                    .single();
                
                if (error) throw error;
                result = data;
            }
            
            return { data: result, error: null };
        } catch (error) {
            console.error('Update configuracion error:', error);
            return { data: null, error: error.message };
        }
    }

    // ==================== MESAS ====================

    /**
     * Get all tables
     */
    async getMesas() {
        if (!this.isReady()) return { data: [], error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('mesas')
                .select('*')
                .order('numero', { ascending: true });
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Get mesas error:', error);
            return { data: [], error: error.message };
        }
    }

    /**
     * Add a table
     */
    async addMesa(mesa) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('mesas')
                .insert([mesa])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Add mesa error:', error);
            return { data: null, error: error.message };
        }
    }

    /**
     * Delete a table
     */
    async deleteMesa(id) {
        if (!this.isReady()) return { error: 'Client not initialized' };
        
        try {
            const { error } = await this.supabase
                .from('mesas')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Delete mesa error:', error);
            return { error: error.message };
        }
    }

    /**
     * Assign a guest to a table
     */
    async asignarMesa(invitadoId, mesaId) {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const { data, error } = await this.supabase
                .from('asignacion_mesas')
                .insert([{
                    invitado_id: invitadoId,
                    mesa_id: mesaId,
                }])
                .select()
                .single();
            
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Asignar mesa error:', error);
            return { data: null, error: error.message };
        }
    }

    // ==================== ESTADÍSTICAS ====================

    /**
     * Get statistics for dashboard
     */
    async getStats() {
        if (!this.isReady()) return { data: null, error: 'Client not initialized' };
        
        try {
            const [invitados, fotos, mesas] = await Promise.all([
                this.supabase.from('invitaciones').select('*', { count: 'exact', head: true }),
                this.supabase.from('fotos_album').select('*', { count: 'exact', head: true }),
                this.supabase.from('mesas').select('*', { count: 'exact', head: true }),
            ]);
            
            // Get confirmed guests count
            const { data: confirmados, error: confirmError } = await this.supabase
                .from('invitaciones')
                .select('*', { count: 'exact', head: true })
                .eq('asistira', true);
            
            if (confirmError) throw confirmError;
            
            const totalInvitados = invitados.count || 0;
            const totalFotos = fotos.count || 0;
            const totalMesas = mesas.count || 0;
            const totalConfirmados = confirmados.count || 0;
            
            return {
                data: {
                    totalInvitados,
                    totalFotos,
                    totalMesas,
                    totalConfirmados,
                    pendientes: totalInvitados - totalConfirmados,
                    porcentajeConfirmados: totalInvitados > 0 ? Math.round((totalConfirmados / totalInvitados) * 100) : 0,
                },
                error: null,
            };
        } catch (error) {
            console.error('Get stats error:', error);
            return { data: null, error: error.message };
        }
    }
}

// Create global instance
window.supabaseClient = new SupabaseClient();
