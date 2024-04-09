<template>
  <v-app-bar app tile rounded="false"  elevation="1" density="compact">
    <v-app-bar-nav-icon 
      v-if="showDrawer"
      icon="mdi-menu"
      density="compact"
      size="small"
      @click="$emit('update:drawer', !drawer)"
    ></v-app-bar-nav-icon>
    <v-app-bar-title>
      <h4 @click="goHome" class="title"><a href="/">Goldilocks's Perfect Porridge</a></h4>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <slot/>
  </v-app-bar>
</template>

<script lang="ts" setup>

const props = defineProps({
  drawer: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:drawer']);

const router = useRouter();

const showDrawer = computed(() => !props.drawer);
const showAuth = ref(true);

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.title  a{
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
