<script setup>
import { ref, computed } from 'vue';
import { X, Box, Tag, Hash, DollarSign, AlertTriangle, Layers, Truck } from 'lucide-vue-next';
import api from '@/api/axios.config.js';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    }
});

const emit = defineEmits(['close', 'stock-added']);

// ─── Formulaire ───────────────────────────────────────────────
const form = ref({
    name: '',
    category: 'aliment',
    quantity: 0,
    unit: 'kg',
    threshold: 10,
    unitCost: 0,
    supplier: ''
});

const errors = ref({});
const isSubmitting = ref(false);

const categories = [
    { value: 'aliment', label: 'Aliment' },
    { value: 'medicament', label: 'Médicament' },
    { value: 'materiel', label: 'Matériel' }
];

// ─── Validation ───────────────────────────────────────────────
const validate = () => {
    const e = {};
    if (!form.value.name.trim()) e.name = "Le nom de l'article est requis.";
    if (!form.value.unit.trim()) e.unit = "L'unité est requise (ex: kg, doses).";
    if (form.value.quantity < 0) e.quantity = "La quantité ne peut pas être négative.";
    if (form.value.threshold < 0) e.threshold = "Le seuil d'alerte ne peut pas être négatif.";
    if (form.value.unitCost < 0) e.unitCost = "Le coût unitaire ne peut pas être négatif.";
    errors.value = e;
    return Object.keys(e).length === 0;
};

// ─── Soumission ───────────────────────────────────────────────
const handleSubmit = async () => {
    if (!validate()) return;

    isSubmitting.value = true;
    try {
        const payload = {
            name: form.value.name.trim(),
            category: form.value.category,
            quantity: Number(form.value.quantity),
            unit: form.value.unit.trim(),
            threshold: Number(form.value.threshold),
            unitCost: Number(form.value.unitCost),
            supplier: form.value.supplier.trim()
        };

        const res = await api.post('/stock', payload);
        const newStock = res.data;

        emit('stock-added', newStock);
        handleClose();
    } catch (err) {
        errors.value.global = err.response?.data?.message || "Erreur lors de l'enregistrement de l'article";
        console.error("Détails erreur stock:", err.response?.data);
    } finally {
        isSubmitting.value = false;
    }
};

// ─── Fermeture + reset ────────────────────────────────────────
const handleClose = () => {
    form.value = {
        name: '',
        category: 'aliment',
        quantity: 0,
        unit: 'kg',
        threshold: 10,
        unitCost: 0,
        supplier: ''
    };
    errors.value = {};
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                @click.self="handleClose">

                <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                    <!-- En-tête -->
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="bg-slate-950 text-white p-2 rounded-xl">
                                <Box class="w-4 h-4" />
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-base leading-tight">Nouvel Article de Stock
                                </h3>
                                <p class="text-[11px] text-slate-400">Ajouter un produit à l'inventaire.</p>
                            </div>
                        </div>
                        <button @click="handleClose"
                            class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Corps -->
                    <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left">
                        <div v-if="errors.global"
                            class="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
                            ⚠ {{ errors.global }}
                        </div>

                        <!-- Nom -->
                        <div>
                            <label
                                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Tag class="w-3 h-3" /> Nom de l'Article
                            </label>
                            <input v-model="form.name" type="text" placeholder="Ex : Aliment Volaille" :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all',
                                errors.name ? 'border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
                            <p v-if="errors.name" class="text-red-500 text-[11px] mt-1">{{ errors.name }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Catégorie -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Layers class="w-3 h-3" /> Catégorie
                                </label>
                                <select v-model="form.category"
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950">
                                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label
                                        }}</option>
                                </select>
                            </div>

                            <!-- Unité -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Hash class="w-3 h-3" /> Unité
                                </label>
                                <input v-model="form.unit" type="text" placeholder="kg, doses, flacons..." :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none',
                                    errors.unit ? 'border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
                                <p v-if="errors.unit" class="text-red-500 text-[11px] mt-1">{{ errors.unit }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Quantité Initiale -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Hash class="w-3 h-3" /> Quantité Initiale
                                </label>
                                <input v-model.number="form.quantity" type="number" min="0"
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                            </div>

                            <!-- Seuil d'alerte -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 text-orange-600">
                                    <AlertTriangle class="w-3 h-3" /> Seuil d'Alerte
                                </label>
                                <input v-model.number="form.threshold" type="number" min="0"
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Coût Unitaire -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <DollarSign class="w-3 h-3" /> Coût Unitaire (FCFA)
                                </label>
                                <input v-model.number="form.unitCost" type="number" min="0"
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                            </div>

                            <!-- Fournisseur -->
                            <div>
                                <label
                                    class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Truck class="w-3 h-3" /> Fournisseur
                                </label>
                                <input v-model="form.supplier" type="text" placeholder="Ex : SEDIMA"
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950" />
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-6 bg-slate-50 flex gap-3">
                        <button @click="handleClose"
                            class="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                            Annuler
                        </button>
                        <button @click="handleSubmit" :disabled="isSubmitting"
                            class="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            <span v-if="isSubmitting"
                                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {{ isSubmitting ? 'Enregistrement…' : 'Ajouter l\'article' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .bg-white {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
}
</style>