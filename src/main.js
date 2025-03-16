import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker'

// Create the Vue app and mount it
const app = createApp(App);
app.use(router);
app.mount('#app');

// Preload the audio file
const clickAudio = new Audio(require('@/assets/Audio/Click.wav'));
clickAudio.preload = 'auto'; // Ensure the audio is preloaded

// Optional: Preload by playing silently and pausing immediately if browser allows it
document.addEventListener('DOMContentLoaded', () => {
  clickAudio.play().then(() => {
    clickAudio.pause();
    clickAudio.currentTime = 0; // Reset to the beginning
  }).catch(() => {
    // Autoplay policies may block this; it's fine as long as the audio loads
    console.log('Audio preloading skipped due to autoplay restrictions.');
  });
});

// Add a global click listener for buttons
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    clickAudio.currentTime = 0; // Reset to the beginning for instant playback
    clickAudio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
});
