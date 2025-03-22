<template>
  <div class="footer">
    <div class="logo">
      <img height="100%" width="100%" src="@/assets/logo.png" alt="" @click="toggleVisibility('options')">
    </div>

    <div class="status">
      <div style="left: 12.5vw;" class="status-item">
        <!-- https://live.staticflickr.com/65535/54264885401_932921103d_o_d.png-->
        <img :src="getImageSrc(messages)" alt="Status Icon 1">
        <p class="messagesNum">{{ messages }}</p>
        <img class="status-logo" src="@/assets/Mail.png" alt="">
      </div>
      <div style="left: 22.5vw;" class="status-item" @click="toggleVisibility('gpsStatus')">
        <img :src="gpsImage" alt="GPS Signal" id="gps">
        <img class="status-logo" src="@/assets/GPS.png" alt="">
      </div>
      <div style="left: 32.5vw;" class="status-item" @click="toggleVisibility('wifiStatus')">
        <img :src="wifiImage" alt="Wi-Fi Signal" id="Wi-Fi">
        <img src="@/assets/Globe.png" alt="">
      </div>
      <div style="left: 42.5vw;" class="status-item" @click="toggleVisibility('paperStatus')">
        <img :src="printerImage" alt="Printer Signal" id="Printer">
        <img class="status-logo" src="@/assets/Printer.png" alt="">
      </div>
      <div style="left: 52.5vw;" class="status-item" @click="toggleVisibility('trackingStatus')">
        <img src="https://live.staticflickr.com/65535/54265089689_a99f484562_o_d.png" alt="Tracking" id="Tracking">
        <img class="status-logo" src="@/assets/Tracking.png" alt="">
      </div>
    </div>

    <div class="fullScreen" @click="clearBell()">
      <div class="stopBanner">
        <h2>STOP</h2>
        <p>Tap To Dismiss</p>
      </div>
    </div>

    <div class="footerTime" @click="toggleVisibility('time')">
      <span>{{ time }}</span><br>
      <span>{{ date }}</span>
    </div>

    <div class="userOptions" id="options">
      <button @click="toggleBELL_func">{{ bellText }}</button><br>
      <button @click="toggleSFX">{{ sfxText }}</button><br>
      <button @click="toggleTTS">{{ ttsText }}</button>
    </div>

    <div class="time" id="time">
      <h2>TIME</h2>
      <span>{{ time }}{{ seconds }}</span><br>
      <span>{{ date }}</span>
      <p>TAP CLOCK TO DISMISS</p>
    </div>

    <div class="time" id="gpsStatus">
      <h2>GPS</h2>
      <span>{{ gpsStrength === 0 ? 'No GPS available' : gpsStrength }}</span><br>
      <small style="font-size: 2.5vw;position: fixed;width: 100%;left: 0;bottom: 5px;">Updating In: {{ updatedIn
      }}</small><br>
      <p>TAP GPS TO DISMISS</p>
    </div>

    <div class="time" id="wifiStatus">
      <h2>WIFI</h2>
      <span>{{ downloadSpeed }} mbps</span><br>
      <small style="font-size: 2.5vw;position: fixed;width: 100%;left: 0;bottom: 5px;">Updating In: {{ updatedIn
      }}</small><br>
      <p>TAP WIFI TO DISMISS</p>
    </div>

    <div class="time" id="paperStatus">
      <h2>PAPER</h2>
      <span>{{ this.randomSignal }} tickets left</span><br>
      <button @click="resetPaper()" style="font-size: 2vw; padding: 1vh; margin-top: 30px;">Reload Paper</button>
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
      muteSFX: localStorage.getItem("muteSFX") === "true",
      muteTTS: localStorage.getItem("muteTTS") === "true",
      toggleBELL: localStorage.getItem("toggleBELL") === "true",
    };
  },
  computed: {
    sfxText() {
      return this.muteSFX ? "Unmute SFX" : "Mute SFX";
    },
    ttsText() {
      return this.muteTTS ? "Unmute TTS" : "Mute TTS";
    },
    bellText() {
      return this.toggleBELL ? "Disable Bell" : "Enable Bell";
    },
  },
  mounted() {
    this.interval = setInterval(this.checkBell, 5000);
    this.checkLocationPermission();
    this.resetUpdatedTime();
    this.getWiFiStrength();
    this.randomPrinterSignal();
    this.updateTime(); // Start updating the time when the component is mounted
    setInterval(this.updateTime, 100); // Update the time every second
    setInterval(() => {
      this.randomSignal = localStorage.getItem("randomSignal");
      if (this.randomSignal < 10) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      } else if (this.randomSignal <= 0) {
        this.printerImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      } else if (this.randomSignal < 40) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262843335_997362a3f3_o_d.png';
      } else {
        this.printerImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      }
    }, 1000);
  },
  methods: {
    checkBell() {
      const imgSrc = document.getElementById("Tracking")?.src;



      if (imgSrc !== 'https://live.staticflickr.com/65535/54265089689_a99f484562_o_d.png') {
        console.log(imgSrc);
        const toggleBELL = localStorage.getItem("toggleBELL") === "true"; // Convert to boolean

        if (toggleBELL && this.bellOn != true) {
          const randomChance = Math.floor(Math.random() * 1) + 1; // 1 in 5 chance
          console.log(randomChance);
          if (randomChance === 1) {
            const audio = new Audio(new URL("@/assets/Audio/bell.wav", import.meta.url));
            audio.play();
            const banner = document.querySelector(".fullScreen");
            banner.style.display = "block"; // Show banner
            this.bellOn = true;
          }
        }
      }
    },

    clearBell() {
      const banner = document.querySelector(".fullScreen");
      banner.style.display = "none";
      this.bellOn = false;
    },
    toggleBELL_func() {
      this.toggleBELL = !this.toggleBELL;
      localStorage.setItem("toggleBELL", this.toggleBELL);
    },
    toggleTTS() {
      this.muteTTS = !this.muteTTS;
      localStorage.setItem("muteTTS", this.muteTTS);
    },
    toggleSFX() {
      this.muteSFX = !this.muteSFX;
      localStorage.setItem("muteSFX", this.muteSFX);
    },
    resetUpdatedTime() {
      // Clear any existing intervals
      clearInterval(this.countdownInterval);

      // Set the countdown to 5 seconds
      this.updatedIn = 5;

      // Start the countdown interval
      this.countdownInterval = setInterval(() => {
        if (this.updatedIn > 0) {
          this.updatedIn -= 1;
        } else {
          this.checkLocationPermission();
          this.getWiFiStrength();
          // When the countdown reaches 0, reset it to 5 seconds
          this.updatedIn = 5;
        }
      }, 1000);
    },
    getImageSrc(messages) {
      if (messages === 0) {
        return 'https://live.staticflickr.com/65535/54262843340_7afe33a4e3_o_d.png';
      } else {
        return 'https://live.staticflickr.com/65535/54264885401_99629c9803_o_d.png';
      }
    },
    toggleVisibility(id) {
      // List of elements to hide
      const elementsToHide = ['gpsStatus', 'wifiStatus', 'paperStatus', 'trackingStatus', 'time'];

      // Loop through and hide all elements, except the one with the passed id
      elementsToHide.forEach(elementId => {
        // Skip the element that matches the passed id
        if (elementId !== id) {
          const element = document.getElementById(elementId);
          if (element) {
            element.style.display = "none";
          }
        }
      });

      // Toggle the display of the passed element
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.style.display = (targetElement.style.display === "block") ? "none" : "block";
      }
    },
    randomPrinterSignal() {
      const randomSignal = Math.floor(Math.random() * 100);
      this.randomSignal = randomSignal;
      if (randomSignal < 10) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      } else if (this.randomSignal <= 0) {
        this.printerImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      } else if (randomSignal < 40) {
        this.printerImage = 'https://live.staticflickr.com/65535/54262843335_997362a3f3_o_d.png';
      } else {
        this.printerImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      }

      localStorage.setItem("randomSignal", this.randomSignal);
    },
    resetPaper() {
      this.printerImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      this.randomSignal = 100;
      localStorage.setItem("randomSignal", this.randomSignal);
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
        this.gpsImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
      } else if (accuracy < 50) {
        this.gpsStrength = 2;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262661674_348b293572_o_d.png';
      } else if (accuracy < 100) {
        this.gpsStrength = 1;
        this.gpsImage = 'https://live.staticflickr.com/65535/54261533367_c04bc3c716_o_d.png';
      } else {
        this.gpsStrength = 0;
        this.gpsImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      }
    },
    getWiFiStrength() {
      const imageUrl = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';  // A file to test download speed

      const startTime = Date.now();

      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;  // Duration in seconds

          const fileSizeInBytes = blob.size;
          const fileSizeInMegabits = (fileSizeInBytes * 8) / (1024 * 1024);  // Convert bytes to megabits

          // Calculate download speed in Mbps (Megabits per second)
          const downloadSpeed = (fileSizeInMegabits / duration).toFixed(2);  // Speed in Mbps

          this.loadTime = duration;
          this.downloadSpeed = downloadSpeed

          // Log the download speed in Mbps
          //console.log(`Download speed: ${downloadSpeed} Mbps`);

          if (downloadSpeed > 5) {
            this.wifiImage = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png'; // Excellent
          } else if (downloadSpeed > 3) {
            this.wifiImage = 'https://live.staticflickr.com/65535/54262661674_348b293572_o_d.png'; // Good
          } else if (downloadSpeed > 1) {
            this.wifiImage = 'https://live.staticflickr.com/65535/54261533367_c04bc3c716_o_d.png'; // Fair
          } else {
            this.wifiImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png'; // Poor
          }
        })
        .catch(error => {
          console.error('Speed test failed:', error);
          this.wifiImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png'; // Default error image
        });
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
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>
.stopBanner {
  background-color: #ca1a1a;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 10vh;
  color: white;
}

.stopBanner p {
  margin: 0;
  font-size: 2vh;
}

.stopBanner h2 {
  font-size: 5vh;
  margin: 0;
  margin-top: 1vh;
}

.fullScreen {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.userOptions {
  display: none;
  background: black;
  width: 25vw;
  position: fixed;
  bottom: 10vh;
  left: 0;
  padding: 10px;
}

.userOptions button {
  padding: 20px;
  width: 100%;
  font-size: 125%;
}

.status {
  display: flex;
  width: 50vw;
  position: absolute;
  left: calc(12.5vw + 20px);
  bottom: 0vh;
  right: 25vw;
  height: 10vh;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  width: 8vh;
  /* Adjusted width for all items to fit 5 icons */
  height: 10vh;
  bottom: -2vh;
}

.status img {
  position: relative;
  bottom: 5px;
  max-width: 45%;
  width: 100%;
  /* Adjust the width of the images */
  object-fit: contain;
}

.messagesNum {
  color: white;
  font-size: 2vh;
  bottom: 5.5vh;
  z-index: 10;
  text-align: center;
  position: fixed;
  margin: 0;
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
  border-bottom: 35px solid rgb(80, 80, 80);
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

.logo {
  height: 12.5vw;
  width: 12.5vw;
  position: fixed;
  left: 10px;
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
  z-index: 1000;
}

.footerTime {
  position: fixed;
  color: white;
  text-align: right;
  font-size: 2rem;
  right: 10px;
  cursor: pointer;
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

@media (max-width: 450px) {
  .time h2 {
    top: 12.5vw;
    margin-left: -15px;
  }
}

@media (max-width: 380px) {
  .time h2 {
    top: 15vw;
    margin-left: -15px;
  }
}


/* Media Queries */
@media (max-width: 768px) {
  .footerTime {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  .footerTime {
    font-size: 1rem;
  }
}
</style>
