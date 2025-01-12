<template>
  <div>
    <img class="loading-img" alt="Vue logo" src="../assets/Ticketer Logo.png">
    <div class="loading-container">
      <div class="loading-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <!-- Add a conditional element to display after loading is done -->
    <div v-if="isLoadingComplete" class="loading-text">
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
  data() {
    return {
      progress: 0, // Start with 0% progress
    };
  },
  mounted() {
    this.startLoading();
  },
  methods: {
    startLoading() {
      const duration = 10000; // 5 seconds
      const interval = 50;   // Update every 50ms
      const step = (100 / duration) * interval;

      const timer = setInterval(() => {
        this.progress += step;
        if (this.progress >= 100) {
          this.progress = 100; // Cap at 100%
          clearInterval(timer); // Stop the timer
          this.$router.push('/blank?target=loading-data&time=5000'); // Navigate to LoadingData.vue
        }
      }, interval);
    },
  },
};
</script>

<style scoped>
.loading-img {
  max-width: 80vw;
  position: absolute;
  top: 20vh; /* 20% from the top of the viewport */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Offset only for horizontal centering */
  object-fit: contain; /* Ensure the image scales properly */
}

.loading-container {
  width: calc(100% - 100px);
  height: 1.5vh;
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 20px;
  position: fixed;
  bottom: 10px;
  left: 25px;
  right: 25px;
}

.loading-bar {
  height: 100%;
  background-color: #006aff;
  transition: width 0.05s ease;
}

.loading-text {
  position: fixed;
  bottom: 50px; /* Show the text just above the loading bar */
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5em;
  color: #006aff;
  font-weight: bold;
}
</style>
