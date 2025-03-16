<template>
  <router-view />

  <FooterComponent />
</template>

<script>
// Remove these imports as they are not used here
// import { createRouter, createWebHistory } from 'vue-router';
// import LoadingScreen from './components/LoadingScreen.vue';
import FooterComponent from './components/footer.vue';
export default {
  name: 'App',
  components: {
    FooterComponent
  },
};
</script>

<style>
body {
    touch-action: manipulation;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top: 60px;
  overflow: hidden;
}

button {
    background: #004ab9;
    color: white;
    border: 0;
    touch-action: manipulation;
}

button:hover{
    background: #003c97;
    touch-action: manipulation;
}
</style>
