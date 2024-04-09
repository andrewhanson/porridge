<template>
<v-container>
  <div v-if="loading">Loading...</div>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-if="data">
  <v-img v-if="data" :src="data.image" max-height="250px" cover></v-img>  
  <h2>{{ data.name }}</h2>
  <div>{{ data.description }}</div>
  <h3 class="py-2">Ingredients</h3>
  <ul class="px-5">
    <li v-for="ingredient in data.ingredients" :key="ingredient">
      {{ ingredient }}
    </li>
  </ul>
  <h3 class="py-2">Preparation</h3>
  <ul class="px-5">
    <li v-for="step in data.preparationSteps" :key="step">
      {{ step }}
    </li>
  </ul>
</div>
</v-container>
</template>

<script setup>
  import { recipeApi } from '@app/api'
  const route = useRoute()

  const id  =  computed(() => route.params.id)

  const { data, error, loading } = useAsyncData('recipe', () => recipeApi.fetch(id.value))
</script>