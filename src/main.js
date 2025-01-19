import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.mount('#app');

// Add a global click listener for buttons
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const audio = new Audio(require('@/assets/Audio/Click.wav'));
    audio.play();
  }
});
