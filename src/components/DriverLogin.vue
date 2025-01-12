<template>
  <div class="login-container">
    <div class="login-form">
      <input type="text" v-model="username" placeholder="Enter username" class="username-input" />
      <div class="button-grid">
        <button v-for="button in buttons" :key="button" @click="handleButtonClick(button)">
          {{ button }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DriverLogin',  // Multi-word name, this is fine
  data() {
    return {
      username: '',
      buttons: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Submit', 'Clear'],
    };
  },
  methods: {
    handleButtonClick(button) {
      if (button === 'Clear') {
        this.username = ''; // Clear the input field
      } else if (button === 'Submit') {
        alert(`Username submitted: ${this.username}`); // Handle form submission
      } else {
        this.username += button; // Append the button value to the input
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.login-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.username-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

button {
  padding: 15px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
