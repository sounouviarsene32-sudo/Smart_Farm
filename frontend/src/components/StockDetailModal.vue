<script setup>
import { ref, watch } from 'vue';
import { X, Box, Tag, Hash, DollarSign, AlertTriangle, Layers, Truck, Calendar, Trash2, Edit, Save } from 'lucide-vue-next';
import api from '@/api/axios.config.js';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    item: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'stock-deleted', 'stock-updated']);

const isEditing = ref(false);
const isSubmitting = ref(false);
const editableItem = ref({});

// Initialiser editableItem quand item change
watch(() => props.item, (newVal) => {
    if (newVal) {
        editableItem.value = { ...newVal };
    }
    isEditing.value = false;
}, { immediate: true });

const getStatusInfo = (item) => {
    if (!item) return {};
    const ratio = item.quantity / item.threshold;
    if (ratio <= 1) return { label: 'Critique', class: 'bg-rose-500 text-white', progress: 'bg-rose-500', percent: Math.min(100, (item.quantity / item.threshold) * 100) };
    if (ratio <= 2) return { label: 'Faible', class: 'bg-orange-500 text-white', progress: 'bg-orange-500', percent: 50 };
    return { label: 'Normal', class: 'bg-emerald-500 text-white', progress: 'bg-emerald-500', percent: 100 };
};

const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const handleDelete = async () => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: `Voulez-vous vraiment supprimer l'article "${props.item.name}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0f172a',
        cancelButtonColor: '#f1f5f9',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler',
        customClass: {
            cancelButton: 'text-slate-700'
        }
    });

    if (!result.isConfirmed) return;

    isSubmitting.value = true;
    try {
        await api.delete(`/stock/${props.item._id}`);
        toast.success("Article supprimé avec succès");
        emit('stock-deleted', props.item._id);
        emit('close');
    } catch (err) {
        toast.error("Erreur lors de la suppression de l'article");
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};

const handleUpdate = async () => {
    isSubmitting.value = true;
    try {
        const res = await api.put(`/stock/${props.item._id}`, editableItem.value);
        toast.success("Article mis à jour avec succès");
        emit('stock-updated', res.data);
        isEditing.value = false;
        emit('close'); // Ferme la modale après modification
    } catch (err) {
        toast.error("Erreur lors de la mise à jour de l'article");
        console.error(err);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen && item"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                @click.self="emit('close')">

                <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                    <!-- En-tête -->
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div class="flex items-center gap-3">
                            <div class="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg">
                                <Box class="w-5 h-5" />
                            </div>
                            <div>
                                <h3 v-if="!isEditing" class="font-bold text-slate-900 text-lg leading-tight">{{
                                    item.name }}</h3>
                                <input v-else v-model="editableItem.name"
                                    class="font-bold text-slate-900 text-lg leading-tight bg-white border border-slate-200 rounded px-2 py-1 w-full focus:ring-2 focus:ring-slate-950 outline-none" />
                                <p class="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                                    {{ isEditing ? 'Modification de l\'article' : 'Détails de l\'article' }}
                                </p>
                            </div>
                        </div>
                        <button @click="emit('close')"
                            class="text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl p-2 transition-all">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Corps -->
                    <div class="p-8 space-y-8 max-h-[75vh] overflow-y-auto">

                        <!-- Section Statut & Quantité (View Mode) -->
                        <div v-if="!isEditing"
                            class="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                            <div class="space-y-1">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantité en
                                    stock</p>
                                <div class="flex items-baseline gap-2">
                                    <span class="text-4xl font-black text-slate-900">{{ item.quantity }}</span>
                                    <span class="text-lg font-bold text-slate-500">{{ item.unit }}</span>
                                </div>
                            </div>
                            <div class="text-right space-y-2">
                                <span
                                    :class="['px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-tight shadow-sm', getStatusInfo(item).class]">
                                    {{ getStatusInfo(item).label }}
                                </span>
                                <div
                                    class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-2 border border-white">
                                    <div :class="['h-full rounded-full transition-all duration-1000', getStatusInfo(item).progress]"
                                        :style="{ width: getStatusInfo(item).percent + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Informations détaillées (View Mode) -->
                        <div v-if="!isEditing" class="grid grid-cols-2 gap-y-8 gap-x-6">
                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Layers class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Catégorie</p>
                                    <p class="font-bold text-slate-800 capitalize">{{ item.category }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                    <AlertTriangle class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seuil
                                        d'alerte</p>
                                    <p class="font-bold text-slate-800">{{ item.threshold }} {{ item.unit }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <DollarSign class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coût
                                        Unitaire</p>
                                    <p class="font-bold text-slate-800">{{ item.unitCost?.toLocaleString('fr-FR') }}
                                        FCFA</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Truck class="w-4 h-4" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Fournisseur</p>
                                    <p class="font-bold text-slate-800">{{ item.supplier || 'Non spécifié' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Formulaire d'édition (Edit Mode) -->
                        <div v-else class="space-y-6">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Catégorie</label>
                                    <select v-model="editableItem.category"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950">
                                        <option value="aliment">Aliment</option>
                                        <option value="medicament">Médicament</option>
                                        <option value="materiel">Matériel</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Unité</label>
                                    <input v-model="editableItem.unit"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quantité
                                        actuelle</label>
                                    <input v-model.number="editableItem.quantity" type="number"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Seuil
                                        d'alerte</label>
                                    <input v-model.number="editableItem.threshold" type="number"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Coût
                                        unitaire (FCFA)</label>
                                    <input v-model.number="editableItem.unitCost" type="number"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                                <div>
                                    <label
                                        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Fournisseur</label>
                                    <input v-model="editableItem.supplier"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                            </div>
                        </div>

                        <hr class="border-slate-100" />

                        <!-- Date de mise à jour -->
                        <div v-if="!isEditing" class="flex items-center justify-center gap-2 text-slate-400 py-2">
                            <Calendar class="w-4 h-4" />
                            <p class="text-xs font-medium italic">Dernière mise à jour : {{ formatDate(item.lastUpdated)
                                }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <template v-if="!isEditing">
                            <button @click="handleDelete" :disabled="isSubmitting"
                                class="flex-1 px-4 py-3 bg-white border border-rose-100 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm flex items-center justify-center gap-2">
                                <Trash2 class="w-4 h-4" /> Supprimer
                            </button>
                            <button @click="isEditing = true"
                                class="flex-1 px-4 py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                                <Edit class="w-4 h-4" /> Modifier
                            </button>
                        </template>
                        <template v-else>
                            <button @click="isEditing = false"
                                class="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm">
                                Annuler
                            </button>
                            <button @click="handleUpdate" :disabled="isSubmitting"
                                class="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                <span v-if="isSubmitting"
                                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <Save v-else class="w-4 h-4" /> Enregistrer
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .bg-white {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
}
</style>