<template>
    <v-layout class="rounded rounded-md">
      <ui-layout-drawer v-if="showDrawer" @update:drawer="onDrawerUpdate">
        <layouts-drawer-links/>
      </ui-layout-drawer>
      <ui-layout-header :drawer="showDrawer" @update:drawer="onDrawerUpdate">
        <auth-login-button/>
      </ui-layout-header> 
      <v-main class="d-flex justify-center fluid mt-2">
        <v-container class="pa-0" style="max-width: 1248px;">
          <slot />
        </v-container>
      </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
 const showDrawer = ref(true);

const onDrawerUpdate = (value: boolean) => {
  showDrawer.value = value;
};
</script>