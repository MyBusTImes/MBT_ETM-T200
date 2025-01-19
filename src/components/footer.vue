<template>
  <div class="footer">
    <div class="logo">
      <img height="100%" width="100%" src="@/assets/logo.png" alt="">
    </div>

    <div class="status">
      <div class="status-item">
        <!-- https://live.staticflickr.com/65535/54264885401_932921103d_o_d.png-->
        <img :src="getImageSrc(messages)" alt="Status Icon 1">
        <p style="transform: translate(0%, -200%);margin-bottom: -30%;" class="messagesNum">{{ messages }}</p>
        <p class="messagesNum">Messages</p>
      </div>
      <div class="status-item">
        <img :src="gpsImage" alt="GPS Signal" id="gps">
        <p class="messagesNum">GPS</p>
      </div>
      <div class="status-item">
        <img :src="wifiImage" alt="Wi-Fi Signal" id="Wi-Fi">
        <p class="messagesNum">Wi-Fi</p>
      </div>
      <div class="status-item">
        <img :src="printerImage" alt="Printer Signal" id="Printer">
        <p class="messagesNum">Paper</p>
      </div>
      <div class="status-item">
        <img src="https://live.staticflickr.com/65535/54265089689_fcd864d237_o_d.png" alt="Tracking" id="Tracking">
        <p class="messagesNum">Tracking</p>
      </div>
    </div>

    <div class="footerTime" @click="toggleVisibility">
      <span>{{ time }}</span><br>
      <span>{{ date }}</span>
    </div>

    <div class="time" id="time">
      <h2>TIME</h2>
      <span>{{ time }}{{ seconds }}</span><br>
      <span>{{ date }}</span>
      <p>TAP CLOCK TO DISMISS</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      gpsStrength: 0,
      gpsImage: 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png',
      wifiImage: 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png',
      time: '', // Live time
      seconds: '',
      date: '', // Live date
      messages: 0,
    };
  },
  mounted() {
    this.checkLocationPermission();
    this.getWiFiStrength();
    this.randomPrinterSignal();
    this.updateTime(); // Start updating the time when the component is mounted
    setInterval(this.updateTime, 100); // Update the time every second
  },
  methods: {
    getImageSrc(messages) {
      if (messages === 0) {
        return 'https://live.staticflickr.com/65535/54262843340_988c73e09e_o_d.png';
      } else {
        return 'https://live.staticflickr.com/65535/54264885401_932921103d_o_d.png';
      }
    },
    toggleVisibility() {
      const timeElement = document.getElementById('time');
      // Check current display value
      if (timeElement.style.display === "block") {
        timeElement.style.display = "none";
      } else {
        timeElement.style.display = "block";
      }
    },
    randomPrinterSignal() {
      const randomSignal = Math.floor(Math.random() * 100);
      if (randomSignal < 10) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      } else if (randomSignal < 40) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262843335_2b52f87b6f_o_d.png';
      } else {
        this.printerImage = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
      }
    },
    checkLocationPermission() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getGPSSignalStrength(position);
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            this.gpsStrength = 0;
            this.gpsImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
          }
        );
      } else {
        console.error('Geolocation not supported');
        this.gpsStrength = 0;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      }
    },
    getGPSSignalStrength(position) {
      const accuracy = position.coords.accuracy;
      if (accuracy < 10) {
        this.gpsStrength = 3;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
      } else if (accuracy < 50) {
        this.gpsStrength = 2;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262661674_f182df8274_o_d.png';
      } else if (accuracy < 100) {
        this.gpsStrength = 1;
        this.gpsImage = 'https://live.staticflickr.com/65535/54261533367_2c09f08a7f_o_d.png';
      } else {
        this.gpsStrength = 0;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      }
    },
    getWiFiStrength() {
      const navigationStart = performance.timing.navigationStart;
      const domComplete = performance.timing.domComplete;
      const loadTime = domComplete - navigationStart;
      if (loadTime < 1000) {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
      } else if (loadTime < 2000) {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
      } else if (loadTime < 5000) {
        this.wifiImage = 'https://live.staticflickr.com/65535/54261533367_2c09f08a7f_o_d.png';
      } else {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      }
    },
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[now.getMonth()];
      this.seconds = `:${seconds}`;
      this.time = `${hours}:${minutes}`;
      this.date = `${month} ${day}`;
    }
  }
};
</script>

<style scoped>
.status {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  margin: 0 auto;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 18%; /* Adjusted width for all items to fit 5 icons */
}

.status img {
  max-width: 50px;
  width: 50%; /* Adjust the width of the images */
  height: auto;
  object-fit: contain;
}

.messagesNum {
  color: white;
  margin-top: 5px;
  font-size: 1rem;
  text-align: center;
}

.time {
  display: none;
  position: fixed;
  width: 50vw;
  height: 20vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff77a;
  padding: 5%;
  text-align: center;
  font-size: 7.5vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-top: 50px solid rgb(80, 80, 80);
  border-bottom: 25px solid rgb(80, 80, 80);
}

.time h2 {
  position: fixed;
  top: 4vw;
  margin-top: -80px;
  margin-left: -30px;
  font-size: 3.5vw;
  font-weight: normal;
  color: white;
  text-align: left;
}

.time p {
  position: fixed;
  top: calc(27.5vw + 10px);
  width: 50vw;
  font-size: 2vw;
  color: white;
  text-align: center;
}

/* Media Queries for Responsiveness */
@media (max-width: 740px) {
  .time h2 {
    top: 6vw;
  }
}

@media (max-width: 660px) {
  .time {
    border-top: 30px solid rgb(80, 80, 80);
  }
  
  .time h2 {
    top: 10vw;
    margin-left: -20px;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  height: 10vh;
  width: 100vw;
  background: black;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.logo {
  height: 10vh;
  width: 10vh;
  position: fixed;
  left: 10px;
}

.footerTime {
  position: fixed;
  color: white;
  text-align: right;
  font-size: 2rem;
  right: 10px;
  cursor: pointer;
}

/* Media Queries */
@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    justify-content: center;
  }

  .logo {
    height: 8vh;
    width: 8vh;
  }

  .status {
    width: 80%; /* Adjust width on smaller screens */
    flex-wrap: wrap;
    justify-content: center;
  }

  .status-item {
    width: 20%; /* Adjust item width */
  }

  .footerTime {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .status {
    margin-left: 17%;
    width: 60%;
    margin-top: 25px;
  }
  .messagesNum{
    font-size: 15%;
  }
  .status-item {
    width: 20%; /* Adjust item width */
  }
  .footerTime {
    font-size: 1rem;
  }
}
</style>
