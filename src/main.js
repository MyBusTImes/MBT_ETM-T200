import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

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
    console.log('Audio preloading skipped due to autoplay restrictions.');
  });
});

document.addEventListener('click', (event) => {
  // Always check the latest localStorage value when a button is clicked
  const isSFXMuted = localStorage.getItem('muteSFX') === 'true';

  if (event.target.tagName === 'BUTTON' && !isSFXMuted) {
    clickAudio.currentTime = 0; // Reset to the beginning for instant playback
    clickAudio.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }
});
