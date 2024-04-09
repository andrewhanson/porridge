<template>
  <v-container>
    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>

    <v-row>
      <v-col v-for="recipe in data" :key="recipe.id" class="col-md-4">
        <ui-recipes-card :recipe="recipe"/>
      </v-col>
    </v-row>

    <!-- <auth-login-button/> -->

  </v-container>
</template>

<script setup>
  import { recipeApi } from '@app/api'
  const { data, error, loading } = useAsyncData('recipes', () => recipeApi.get())
</script>