<template>
    <div>
      <div class="scanBox" :class="{ scanned: isScanned }">
        <!-- The QR code scanner view -->
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>
  
      <div class="buttons">
        <button class="optionBT" @click="gotTo('ticketSelling')">BACK</button>
        <button class="issue">SCAN</button>
      </div>
  
      <!-- Display decoded QR code data if available -->
      <div v-if="decodedData" class="decodedData">
        <h3>Decoded QR Code Data:</h3>
        <p>{{ decodedData }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "ticketReports",
    data() {
      return {
        isScanned: false, // Track if the QR code is scanned
        decodedData: null, // Store the decoded QR code data
      };
    },
    methods: {
      gotTo(page) {
        this.$router.push({ path: '/' + page });
      },
  
      async handleFileUpload(event) {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
  
          try {
            const response = await axios.post('https://www.mybustimes.cc/BusTimes/scanQRCode.php', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
  
            if (response.data.success) {
              this.isScanned = true; // Mark as scanned
              this.decodedData = response.data.data; // Store decoded data
            } else {
              this.isScanned = false;
              this.decodedData = null;
              alert('QR Code not found');
            }
          } catch (error) {
            console.error("Error scanning QR:", error);
            alert('Error scanning QR');
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .scanBox {
    height: 50vw;
    width: 50vw;
    position: fixed;
    top: 10vh;
    left: 25vw;
    border: 2.5px solid black;
    transition: border-color 0.3s ease;
  }
  
  .scanBox.scanned {
    border-color: green; /* Green border when QR is scanned */
  }
  
  .buttons {
    position: fixed;
    left: 25vw;
    bottom: calc(10vh + 5px);
  }
  
  .decodedData {
    position: fixed;
    top: 70vh;
    left: 25vw;
    width: 50vw;
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  </style>
  