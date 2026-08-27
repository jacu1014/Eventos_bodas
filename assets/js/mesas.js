/**
 * Boda Digital - Mesa Management Logic
 * Handles table assignments, guest distribution, and interactive positioning
 */

// Mesa management module
const MesaManager = {
    // State
    mesas: [],
    invitados: [],
    selectedMesa: null,
    dragState: null,
    
    // Initialize with data
    init(mesas, invitados) {
        this.mesas = mesas || [];
        this.invitados = invitados || [];
        this.calculateGroupSizes();
    },
    
    // Calculate group sizes for each guest
    calculateGroupSizes() {
        this.invitados.forEach(invitado => {
            const totalPases = (invitado.pases_adultos || 1) + (invitado.pases_ninos || 0);
            invitado.total_pases = totalPases;
            
            // Check if this is a group invitation
            if (invitado.grupo && invitado.grupo !== 'Individual') {
                const groupMembers = this.invitados.filter(i => i.grupo === invitado.grupo);
                invitado.grupo_total = groupMembers.reduce((acc, curr) => 
                    acc + (curr.pases_adultos || 1) + (curr.pases_ninos || 0), 0
                );
                invitado.grupo_members = groupMembers.length;
            } else {
                invitado.grupo_total = totalPases;
                invitado.grupo_members = 1;
            }
        });
    },
    
    // Get guests by table
    getGuestsByTable(mesaId) {
        return this.invitados.filter(i => i.mesa === mesaId || i.mesa_asignada === mesaId);
    },
    
    // Get total guests per table
    getTableCount(mesaId) {
        const guests = this.getGuestsByTable(mesaId);
        return guests.reduce((acc, curr) => acc + (curr.total_pases || 1), 0);
    },
    
    // Get group details for a guest
    getGroupInfo(invitado) {
        if (!invitado.grupo || invitado.grupo === 'Individual') {
            return {
                isGroup: false,
                total: invitado.total_pases || 1,
                members: 1,
                label: `${invitado.nombre} (${invitado.total_pases || 1} pase${(invitado.total_pases || 1) > 1 ? 's' : ''})`
            };
        }
        
        const groupMembers = this.invitados.filter(i => i.grupo === invitado.grupo);
        const total = groupMembers.reduce((acc, curr) => 
            acc + (curr.pases_adultos || 1) + (curr.pases_ninos || 0), 0
        );
        
        return {
            isGroup: true,
            total: total,
            members: groupMembers.length,
            label: `${invitado.grupo} (${total} pases, ${groupMembers.length} invitaciones)`
        };
    },
    
    // Calculate table occupancy
    getTableOccupancy(mesaId) {
        const guests = this.getGuestsByTable(mesaId);
        const total = guests.reduce((acc, curr) => acc + (curr.total_pases || 1), 0);
        const capacity = this.mesas.find(m => m.id === mesaId)?.capacidad || 10;
        return {
            total,
            capacity,
            percentage: Math.round((total / capacity) * 100),
            isOverCapacity: total > capacity
        };
    },
    
    // Get all groups with their sizes
    getAllGroups() {
        const groups = {};
        this.invitados.forEach(inv => {
            const groupName = inv.grupo || 'Individual';
            if (!groups[groupName]) {
                groups[groupName] = {
                    name: groupName,
                    total: 0,
                    members: [],
                    mesa: inv.mesa || inv.mesa_asignada || 'Sin asignar'
                };
            }
            groups[groupName].total += (inv.pases_adultos || 1) + (inv.pases_ninos || 0);
            groups[groupName].members.push(inv);
        });
        return Object.values(groups);
    },
    
    // Get table with guest list and counts
    getTableDetails(mesaId) {
        const mesa = this.mesas.find(m => m.id === mesaId);
        if (!mesa) return null;
        
        const guests = this.getGuestsByTable(mesaId);
        const groups = this.getAllGroups().filter(g => g.mesa === mesaId || g.mesa === mesa.nombre);
        
        return {
            ...mesa,
            guests,
            groups,
            totalGuests: guests.reduce((acc, curr) => acc + (curr.total_pases || 1), 0),
            occupancy: this.getTableOccupancy(mesaId)
        };
    },
    
    // Interactive positioning - generate grid layout
    generateTableLayout() {
        const tables = this.mesas.map(mesa => {
            const occupancy = this.getTableOccupancy(mesa.id);
            return {
                ...mesa,
                occupancy,
                guests: this.getGuestsByTable(mesa.id)
            };
        });
        
        return {
            tables,
            totalGuests: this.invitados.reduce((acc, curr) => acc + (curr.total_pases || 1), 0),
            totalTables: this.mesas.length
        };
    },
    
    // Drag and drop support for repositioning
    startDrag(ev, mesaId) {
        // Get position from touch or mouse event
        const clientX = ev.clientX || (ev.touches && ev.touches[0].clientX);
        const clientY = ev.clientY || (ev.touches && ev.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;
        
        // Store the element reference
        const element = ev.currentTarget;
        // Get the element's current position
        const rect = element.getBoundingClientRect();
        
        this.dragState = {
            mesaId,
            startX: clientX,
            startY: clientY,
            element: element,
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
            elementRect: rect
        };
        
        // Add both mouse and touch listeners
        document.addEventListener('mousemove', this.moveDrag);
        document.addEventListener('touchmove', this.moveDrag, { passive: false });
        document.addEventListener('mouseup', this.endDrag);
        document.addEventListener('touchend', this.endDrag, { passive: false });
    },
    
    moveDrag(ev) {
        if (!this.dragState) return;
        ev.preventDefault();
        
        // Get position from touch or mouse event
        const clientX = ev.clientX || (ev.touches && ev.touches[0].clientX);
        const clientY = ev.clientY || (ev.touches && ev.touches[0].clientY);
        if (clientX === undefined || clientY === undefined) return;
        
        const dx = clientX - this.dragState.startX;
        const dy = clientY - this.dragState.startY;
        
        // Move the element using transform
        this.dragState.element.style.transform = `translate(${dx}px, ${dy}px)`;
        this.dragState.element.style.cursor = 'grabbing';
        this.dragState.element.style.transition = 'none';
    },
    
    endDrag(ev) {
        if (!this.dragState) return;
        const element = this.dragState.element;
        
        // Calculate final position
        const rect = element.getBoundingClientRect();
        
        // Apply new position
        element.style.position = 'fixed';
        element.style.left = rect.left + 'px';
        element.style.top = rect.top + 'px';
        element.style.transform = 'none';
        element.style.transition = 'all 0.2s ease';
        element.style.cursor = 'grab';
        
        // Save position to mesa data
        const mesa = this.mesas.find(m => m.id === this.dragState.mesaId);
        if (mesa) {
            mesa.position_x = rect.left;
            mesa.position_y = rect.top;
            // Trigger save
            this.saveMesaPositions();
        }
        
        this.dragState = null;
        document.removeEventListener('mousemove', this.moveDrag);
        document.removeEventListener('touchmove', this.moveDrag);
        document.removeEventListener('mouseup', this.endDrag);
        document.removeEventListener('touchend', this.endDrag);
    },
    
    // Save mesa positions
    async saveMesaPositions() {
        try {
            if (typeof supabaseClient !== 'undefined') {
                for (const mesa of this.mesas) {
                    await supabaseClient.updateMesa(mesa.id, {
                        position_x: mesa.position_x || 0,
                        position_y: mesa.position_y || 0
                    });
                }
                return { success: true };
            }
            // Fallback to localStorage
            localStorage.setItem('mesa_positions', JSON.stringify(
                this.mesas.map(m => ({ id: m.id, x: m.position_x || 0, y: m.position_y || 0 }))
            ));
            return { success: true };
        } catch (error) {
            console.error('Error saving mesa positions:', error);
            return { success: false, error };
        }
    },
    
    // Load mesa positions
    loadMesaPositions() {
        try {
            const saved = localStorage.getItem('mesa_positions');
            if (saved) {
                const positions = JSON.parse(saved);
                positions.forEach(pos => {
                    const mesa = this.mesas.find(m => m.id === pos.id);
                    if (mesa) {
                        mesa.position_x = pos.x;
                        mesa.position_y = pos.y;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading mesa positions:', error);
        }
    },
    
    // Move guest between tables
    moveGuest(guestId, targetMesaId) {
        const guest = this.invitados.find(i => i.id === guestId);
        if (!guest) return { success: false, error: 'Guest not found' };
        
        const targetMesa = this.mesas.find(m => m.id === targetMesaId);
        if (!targetMesa) return { success: false, error: 'Target table not found' };
        
        // Check capacity
        const occupancy = this.getTableOccupancy(targetMesaId);
        const guestPases = guest.total_pases || 1;
        if (occupancy.total + guestPases > occupancy.capacity) {
            return { success: false, error: 'Table would exceed capacity' };
        }
        
        // Move guest
        guest.mesa = targetMesa.nombre;
        guest.mesa_asignada = targetMesaId;
        
        // Save
        if (typeof supabaseClient !== 'undefined') {
            supabaseClient.updateInvitado(guestId, {
                mesa: targetMesa.nombre,
                mesa_asignada: targetMesaId
            });
        }
        
        return { success: true };
    }
};

// Export for global use
if (typeof window !== 'undefined') {
    window.MesaManager = MesaManager;
}
