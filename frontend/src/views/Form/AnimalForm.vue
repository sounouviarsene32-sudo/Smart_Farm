<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-lg p-8 rounded-3xl shadow-xl space-y-6">
      <h2 class="text-xl font-bold text-slate-900">Nouvel Animal</h2>

      <!-- Boutons mode single / batch -->
      <div class="flex gap-2 mb-4">
        <button
          @click="mode = 'single'"
          :class="mode === 'single' ? 'bg-slate-900 text-white' : 'bg-slate-100'"
          class="px-4 py-2 rounded-xl text-sm font-bold"
        >
          Individuel
        </button>

        <button
          @click="mode = 'batch'"
          :class="mode === 'batch' ? 'bg-slate-900 text-white' : 'bg-slate-100'"
          class="px-4 py-2 rounded-xl text-sm font-bold"
        >
          Lot
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- ID unique seulement en mode single -->
        <input
          v-if="mode === 'single'"
          v-model="form.identificationNumber"
          placeholder="ID Animal"
          class="w-full p-3 border rounded-xl"
          required
        />

        <!-- Champs batch -->
        <div v-if="mode === 'batch'" class="space-y-4">
          <input
            v-model="form.prefix"
            placeholder="Préfixe (ex: ANM-2026)"
            class="w-full p-3 border rounded-xl"
            required
          />
          <input
            v-model.number="form.quantity"
            type="number"
            min="1"
            placeholder="Nombre d'animaux"
            class="w-full p-3 border rounded-xl"
            required
          />
        </div>

        <!-- Champs communs -->
        <input v-model="form.species" placeholder="Espèce" class="w-full p-3 border rounded-xl" required />
        <input v-model="form.breed" placeholder="Race" class="w-full p-3 border rounded-xl" required />
        <input v-model="form.birthDate" type="date" class="w-full p-3 border rounded-xl" required />

        <select v-model="form.gender" class="w-full p-3 border rounded-xl" required>
          <option value="">Sexe</option>
          <option value="male">Mâle</option>
          <option value="female">Femelle</option>
        </select>

        <input v-model.number="form.weight" type="number" placeholder="Poids (kg)" class="w-full p-3 border rounded-xl" />

        <!-- Sélection du département -->
        <select v-model="form.departmentId" class="w-full p-3 border rounded-xl" required>
          <option value="">Sélectionner un département</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>

        <!-- Sélection de la campagne -->
        <select v-model="form.campaignId" class="w-full p-3 border rounded-xl" required>
          <option value="">Sélectionner une campagne</option>
          <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.name }} - {{ c.type }}</option>
        </select>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-xl">Annuler</button>
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all">Enregistrer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AnimalService from "@/services/animals.js";
import DepartementService from "@/services/departement.js";

const emit = defineEmits(["close", "created"]);

const mode = ref("single"); // single | batch

const form = ref({
  identificationNumber: "",
  species: "",
  breed: "",
  birthDate: "",
  gender: "",
  weight: null,
  departmentId: "",
  campaignId: "",
  quantity: 1,
  prefix: "ANM"
});

const departments = ref([]);
const campaigns = ref([]);

// Charger les départements avec leurs campagnes
async function loadDepartments() {
  try {
    const data = await DepartementService.getDepartmentsWithCampaigns();
    departments.value = data;
  } catch (err) {
    console.error("Erreur chargement départements:", err);
    alert("Impossible de charger les départements et campagnes");
  }
}

onMounted(loadDepartments);

// Filtrer les campagnes selon le département sélectionné
watch(
  () => form.value.departmentId,
  (newId) => {
    const dept = departments.value.find((d) => d.id === newId);
    campaigns.value = dept?.stats?.campagnes || [];
    form.value.campaignId = ""; // reset
    console.log(`Campagnes pour ${dept?.name}:`, campaigns.value);
  }
);

// Soumission du formulaire
async function handleSubmit() {
  try {
    if (mode.value === "single") {
      await AnimalService.createAnimal({
        identificationNumber: form.value.identificationNumber,
        species: form.value.species,
        breed: form.value.breed,
        birthDate: form.value.birthDate,
        gender: form.value.gender,
        weight: form.value.weight,
        departmentId: form.value.departmentId,
        campaignId: form.value.campaignId
      });
    } else {
      await AnimalService.createAnimalsBatch({
        prefix: form.value.prefix,
        quantity: form.value.quantity,
        species: form.value.species,
        breed: form.value.breed,
        birthDate: form.value.birthDate,
        gender: form.value.gender,
        weight: form.value.weight,
        departmentId: form.value.departmentId,
        campaignId: form.value.campaignId
      });
    }

    emit("created");
    emit("close");
  } catch (err) {
    console.error("Erreur création animal:", err);
    alert("Une erreur est survenue lors de l'enregistrement.");
  }
}
</script>