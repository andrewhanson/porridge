<template>
 
  <v-list-item density="compact" link title="Home" to="/">
    <template v-slot:prepend>
      <v-icon icon="mdi-home-outline"></v-icon>
    </template>
  </v-list-item>
  
  <v-list-item density="compact" link title="Recipes" to="/recipes">
    <template v-slot:prepend>
      <v-icon icon="mdi-bowl-mix-outline"></v-icon>
    </template>
  </v-list-item>
  <v-list-item density="compact" link title="Users" to="/users">
    <template v-slot:prepend>
      <v-icon icon="mdi-account"></v-icon>
    </template>
  </v-list-item>
</template>