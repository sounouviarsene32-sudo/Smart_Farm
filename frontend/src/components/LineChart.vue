<script setup>
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement 
} from 'chart.js'

// Enregistrement des modules nécessaires de Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  chartData: { type: Object, required: true },
  chartOptions: { type: Object, default: () => ({ responsive: true, maintainAspectRatio: false }) }
})
</script>

<template>
  <div class="h-75">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>