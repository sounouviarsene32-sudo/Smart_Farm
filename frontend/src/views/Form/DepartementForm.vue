<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="close"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-slide-up"
      >
        <div
          class="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center"
        >
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Nouveau Département
            </h2>
            <p class="text-sm text-slate-500 font-medium">
              Extension de l'infrastructure d'élevage
            </p>
          </div>
          <button
            @click="close"
            class="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label
                class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >
                <LayoutGrid class="w-3 h-3" /> Type *
              </label>
              <select
                v-model="form.name"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option disabled value="">-- Choisir --</option>
                <option value="Volaille">Volaille</option>
                <option value="Bétail">Bétail</option>
                <option value="Pisciculture">Pisciculture</option>
                <option value="Bovin">Bovin</option>
                <option value="Porcin">Porcin</option>
              </select>
              <p v-if="errors.name" class="text-red-500 text-[11px] font-bold mt-1 px-1">
                {{ errors.name }}
              </p>
            </div>

            <div class="space-y-1.5">
              <label
                class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
              >
                <Tag class="w-3 h-3" /> Nom Public (Label) *
              </label>
              <input
                v-model="form.label"
                type="text"
                placeholder="Ex: Secteur A1"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
              <p v-if="errors.label" class="text-red-500 text-[11px] font-bold mt-1 px-1">
                {{ errors.label }}
              </p>
            </div>

            <div class="md:col-span-2 space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
                >État Opérationnel</label
              >
              <div class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                <button
                  v-for="status in ['Actif', 'Inactif']"
                  :key="status"
                  type="button"
                  @click="form.status = status"
                  :class="[
                    form.status === status
                      ? 'bg-white text-emerald-600 shadow-sm border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 border-transparent',
                    'py-2 px-4 rounded-xl text-sm font-bold border transition-all duration-200',
                  ]"
                >
                  {{ status }}
                </button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Label du Département *
              </label>
              <input
                v-model="form.label"
                type="text"
                placeholder="Ex: Volaille, Bétail, Pisciculture"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
              <p v-if="errors.label" class="text-red-500 text-xs mt-1 font-medium">
                {{ errors.label }}
              </p>
            </div>

            <div class="md:col-span-2 pt-6 pb-2 border-t border-slate-100 flex items-center gap-3">
              <div class="p-2 bg-emerald-50 rounded-lg">
                <UserSquare class="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Responsable d'Unité</h3>
                <p class="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                  Attribution du chef de groupe
                </p>
              </div>
            </div>

            <div class="md:col-span-2">
              <input
                v-model="form.managerName"
                type="text"
                placeholder="Nom complet du manager *"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
              <p v-if="errors.managerName" class="text-red-500 text-[11px] font-bold mt-1 px-1">
                {{ errors.managerName }}
              </p>
            </div>

            <div class="relative group">
              <Mail
                class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              />
              <input
                v-model="form.managerEmail"
                type="email"
                placeholder="Email pro"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div class="relative group">
              <Phone
                class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              />
              <input
                v-model="form.managerPhone"
                type="text"
                placeholder="Contact"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <p v-if="errors.managerEmail" class="text-red-500 text-[11px] font-bold px-1 -mt-2">
            {{ errors.managerEmail }}
          </p>

          <div class="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              @click="close"
              class="px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              {{ loading ? 'Initialisation...' : 'Enregistrer le département' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { X, UserSquare, LayoutGrid, Tag, Mail, Phone } from 'lucide-vue-next'
import departementService from '@/services/departement.js'

const props = defineProps({
  show: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'created'])

const form = reactive({
  name: '',
  label: '',
  status: 'Actif',
  managerName: '',
  managerEmail: '',
  managerPhone: '',
  agentsCount: 0,
  animalsCount: 0,
  performance: '0%',
})

const errors = reactive({ name: '', label: '', managerName: '', managerEmail: '' })
const loading = ref(false)

function validate() {
  let valid = true
  errors.name = !form.name ? 'Type requis.' : ''
  errors.label = !form.label.trim() ? 'Label requis.' : ''
  errors.managerName = !form.managerName.trim() ? 'Nom du manager requis.' : ''

  if (form.managerEmail && !/\S+@\S+\.\S+/.test(form.managerEmail)) {
    errors.managerEmail = 'Format email invalide.'
    valid = false
  } else {
    errors.managerEmail = ''
  }

  return !errors.name && !errors.label && !errors.managerName && valid
}

async function submitForm() {
  if (!validate()) return
  try {
    loading.value = true

    const payload = {
      name: form.name,
      label: form.label,
      status: form.status,
      managerName: form.managerName,
      managerEmail: form.managerEmail,
      managerPhone: form.managerPhone,
    }

    console.log('Payload envoyé :', payload)

    const created = await departementService.createDepartement(payload)
    emit('created', created)
    close()
  } catch (err) {
    console.error('Erreur création département :', err.response?.data || err)
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
  Object.assign(form, {
    name: '',
    label: '',
    status: 'Actif',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
  })
  errors.name = ''
  errors.label = ''
  errors.managerName = ''
  errors.managerEmail = ''
}
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom scrollbar pour le modal si nécessaire */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
