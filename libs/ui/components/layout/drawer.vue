<template>
  <v-navigation-drawer color="grey-lighten-1">
    <v-card
      color="grey-lighten-4"
      elevation="0"
      flat
      tile
      :rounded="false"
      image="/images/porridge_logo.webp"
      min-height="220px"
    >
      <v-card-actions>
        
        <v-spacer/>
        <v-btn
          size="small"
          density="compact"
          @click="emit('update:drawer', false)"
          icon="mdi-menu"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-divider></v-divider>
    
    <v-card 
      color="white" 
      flat
      tile
      class="sidebar-nav h-100 font-xs"
      rounded="false"
    >
      <slot/>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup>
  const emit = defineEmits(['update:drawer']);
</script>