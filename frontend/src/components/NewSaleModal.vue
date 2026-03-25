<script setup>
import { ref, computed } from 'vue';
import { X, ShoppingCart, User, Package, Hash, DollarSign, Tag, CheckCircle } from 'lucide-vue-next';
import api from '@/api/axios.config.js';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Props : liste des campagnes à passer depuis le parent
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  campaigns: {
    type: Array,
    default: () => [], // [{ _id: '...', name: 'Campagne Poulets Mars' }]
  },
});

const emit = defineEmits(['close', 'sale-added']);

// ─── Formulaire ───────────────────────────────────────────────
const form = ref({
  clientName: '',
  campaignId: '',
  product: '',
  dept: 'Volaille',
  quantity: 1,
  unitPrice: 0,
  status: 'Payé',
});

const errors = ref({});
const isSubmitting = ref(false);

// ─── Total calculé en temps réel ──────────────────────────────
const computedTotal = computed(() =>
  (form.value.quantity * form.value.unitPrice).toLocaleString('fr-FR')
);

// ─── Validation ───────────────────────────────────────────────
const validate = () => {
  const e = {};
  if (!form.value.clientName.trim()) e.clientName = 'Le nom du client est requis.';
  if (!form.value.campaignId) e.campaignId = 'Veuillez sélectionner une campagne.';
  if (!form.value.product.trim()) e.product = 'Le produit est requis.';
  if (form.value.quantity < 1) e.quantity = 'La quantité doit être ≥ 1.';
  if (form.value.unitPrice <= 0) e.unitPrice = 'Le prix doit être > 0.';
  errors.value = e;
  return Object.keys(e).length === 0;
};

// ─── Soumission ───────────────────────────────────────────────
const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  try {
    // NewSaleModal.vue -> handleSubmit
    const payload = {
      clientName: form.value.clientName.trim(),
      campaignId: form.value.campaignId,
      product: form.value.product.trim(), // <--- Ajoute ceci
      dept: form.value.dept,             // <--- Ajoute ceci
      quantity: Number(form.value.quantity),
      unitPrice: Number(form.value.unitPrice),
      totalAmount: Number(form.value.quantity) * Number(form.value.unitPrice),
      status: form.value.status,         // <--- Ajoute ceci
      animalIds: [],
    };
    const res = await api.post('/ventes', payload);

    const newSale = res.data;
    toast.success("Vente enregistrée avec succès !");

    // On enrichit l'objet pour l'affichage local dans le parent
    emit('sale-added', {
      id: newSale._id || Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      client: newSale.clientName,
      dept: form.value.dept,
      product: form.value.product,
      quantity: newSale.quantity,
      unitPrice: newSale.unitPrice.toLocaleString('fr-FR'),
      total: newSale.totalAmount.toLocaleString('fr-FR'),
      status: form.value.status,
    });

    handleClose();
  } catch (err) {
    // Affiche le message d'erreur de Mongoose (ex: "Path 'product' is required")
    errors.value.global = err.response?.data?.message || "Erreur de connexion au serveur";
    console.error("Détails de la 400:", err.response?.data);
  } finally {
    isSubmitting.value = false;
  }
};

// ─── Fermeture + reset ────────────────────────────────────────
const handleClose = () => {
  form.value = {
    clientName: '',
    campaignId: '',
    product: '',
    dept: 'Volaille',
    quantity: 1,
    unitPrice: 0,
    status: 'Payé',
  };
  errors.value = {};
  emit('close');
};
</script>

<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="handleClose">
        <!-- Carte modale -->
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

          <!-- En-tête -->
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="bg-slate-950 text-white p-2 rounded-xl">
                <ShoppingCart class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-base leading-tight">Nouvelle Transaction</h3>
                <p class="text-[11px] text-slate-400">Remplis les champs pour enregistrer la vente.</p>
              </div>
            </div>
            <button @click="handleClose"
              class="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Corps -->
          <div class="p-6 space-y-4 max-h-[65vh] overflow-y-auto">

            <!-- Erreur globale -->
            <div v-if="errors.global"
              class="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
              ⚠ {{ errors.global }}
            </div>

            <!-- Client -->
            <div>
              <label
                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User class="w-3 h-3" /> Nom du Client
              </label>
              <input v-model="form.clientName" type="text" placeholder="Ex : Boucherie Moderne"
                :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all',
                  errors.clientName ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
              <p v-if="errors.clientName" class="text-red-500 text-[11px] mt-1">{{ errors.clientName }}</p>
            </div>

            <!-- Campagne -->
            <div>
              <label
                class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag class="w-3 h-3" /> Campagne
              </label>
              <select v-model="form.campaignId"
                :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all',
                  errors.campaignId ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']">
                <option value="" disabled>Sélectionner une campagne…</option>
                <option v-for="c in campaigns" :key="c._id" :value="c._id">{{ c.name }}</option>
              </select>
              <p v-if="errors.campaignId" class="text-red-500 text-[11px] mt-1">{{ errors.campaignId }}</p>
            </div>

            <!-- Produit + Département -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Package class="w-3 h-3" /> Produit
                </label>
                <input v-model="form.product" type="text" placeholder="Ex : Poulets de chair" :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all',
                  errors.product ? 'border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
                <p v-if="errors.product" class="text-red-500 text-[11px] mt-1">{{ errors.product }}</p>
              </div>

              <div>
                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Département
                </label>
                <select v-model="form.dept"
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-950">
                  <option>Volaille</option>
                  <option>Bovins</option>
                  <option>Caprins</option>
                  <option>Ovins</option>
                </select>
              </div>
            </div>

            <!-- Quantité + Prix unitaire -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Hash class="w-3 h-3" /> Quantité
                </label>
                <input v-model.number="form.quantity" type="number" min="1" :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none',
                  errors.quantity ? 'border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
                <p v-if="errors.quantity" class="text-red-500 text-[11px] mt-1">{{ errors.quantity }}</p>
              </div>

              <div>
                <label
                  class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <DollarSign class="w-3 h-3" /> Prix Unitaire (FCFA)
                </label>
                <input v-model.number="form.unitPrice" type="number" min="0" :class="['w-full p-2.5 bg-slate-50 border rounded-xl text-sm outline-none',
                  errors.unitPrice ? 'border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-slate-950']" />
                <p v-if="errors.unitPrice" class="text-red-500 text-[11px] mt-1">{{ errors.unitPrice }}</p>
              </div>
            </div>

            <!-- Statut -->
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Statut</label>
              <div class="flex gap-3">
                <label v-for="opt in ['Payé', 'En attente']" :key="opt" :class="['flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all',
                  form.status === opt
                    ? opt === 'Payé' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-orange-50 border-orange-400 text-orange-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100']">
                  <input type="radio" v-model="form.status" :value="opt" class="hidden" />
                  <CheckCircle class="w-4 h-4" />
                  {{ opt }}
                </label>
              </div>
            </div>

            <!-- Aperçu du total -->
            <div class="bg-slate-950 text-white rounded-xl px-5 py-3 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total estimé</span>
              <span class="text-lg font-bold text-emerald-400">{{ computedTotal }} FCFA</span>
            </div>
          </div>

          <!-- Pied de modale -->
          <div class="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
            <button @click="handleClose"
              class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 bg-white rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
              Annuler
            </button>
            <button @click="handleSubmit" :disabled="isSubmitting"
              class="flex-1 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {{ isSubmitting ? 'Enregistrement…' : 'Confirmer la vente' }}
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
