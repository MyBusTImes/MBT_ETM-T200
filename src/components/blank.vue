<template>
    <div class="black">
      <!-- Optional content for the loading screen -->
    </div>
  </template>
  
  <script>
  export default {
    name: "LoadingScreen",
    data() {
      return {
        target: this.$route.query.target, // Get 'target' query param
        time: parseInt(this.$route.query.time) || 5000, // Default to 5000ms if 'time' is not provided
      };
    },
    mounted() {
      console.log('Target:', this.target);  // Logs the 'target' query param
      console.log('Time:', this.time);      // Logs the 'time' query param
  
      // Redirect after the specified time
      setTimeout(() => {
        this.redirect();
      }, this.time);
    },
    methods: {
      redirect() {
        // Redirect to the specified target route (e.g., '/loading-data')
        this.$router.push({ path: `/${this.target}` }); // Assuming target contains a valid route name
      }
    }
  };
  </script>
  
  <style scoped>
  /* Target only the root div of this component */
  .black {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
  }
  </style>
  