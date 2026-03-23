<script setup></script>

<template>
  <main
    class="flex-1 lg:ml-64 p-8 lg:p-8 transition-all duration-300 w-full bg-[#F8F9FA] min-h-screen space-y-8"
  >
    <h1 class="text-3xl font-bold text-gray-900">Profil de l'animal: <span>#ID: 12345</span></h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="flex items-center space-x-4 mb-6">
        <img
          src="https://via.placeholder.com/150"
          alt="Photo de l'animal"
          class="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Départment: Volaille</h2>
          <p class="text-gray-600">Espèce: Canard</p>
          <p class="text-gray-600">Âge: 2 semaines</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Détails de santé</h3>
          <ul class="list-disc list-inside text-gray-600">
            <li>Vaccinations à jour</li>
            <li>Pas d'allergies connues</li>
            <li>Dernier contrôle vétérinaire: Date du dernier contrôle</li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Historique des soins</h3>
          <ul class="list-disc list-inside text-gray-600">
            <li>Soins réguliers: Fréquence des soins</li>
            <li>Problèmes de santé passés: Description des problèmes de santé passés</li>
            <li>Traitements en cours: Description des traitements en cours</li>
          </ul>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Identifiant QR</h3>
        <p class="text-gray-600">.....</p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
