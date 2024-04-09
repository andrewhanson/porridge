<template>
  <v-card flat class="mx-auto" :to="`recipes/${recipe.id}`">
    <v-img :src="recipe.image"
      height="200px"
      cover
    >
    </v-img>

    <v-card-title>
      {{ recipe.name }}
    </v-card-title>
    <v-card-text>
      {{ recipe.summary }}
    </v-card-text>
    
  </v-card>
</template>

<script setup>

  defineProps({
    recipe: Object
  })

</script>