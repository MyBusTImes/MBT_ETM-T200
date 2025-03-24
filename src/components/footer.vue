<template>
  <div class="footer">
    <div class="logo">
      <img height="100%" width="100%" src="@/assets/logo.png" alt="" @click="toggleVisibility('options')">
    </div>

    <div class="status">
      <div style="left: 12.5vw;" class="status-item">
        <!-- https://live.staticflickr.com/65535/54264885401_932921103d_o_d.png-->
        <img :src="getImageSrc(unreadMessagesCount)" alt="Status Icon 1">
        <p class="messagesNum">{{ unreadMessagesCount }}</p>
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

    <div class="fullScreenStop" @click="clearBell()">
      <div class="stopBanner">
        <h2>STOP</h2>
        <p>Tap To Dismiss</p>
        <div class="stopInfo">
          <p>{{ stopText }}</p>
        </div>
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

    <div class="fullScreen" id="timefs" @click="toggleVisibility('')">
      <div class="time" id="time">
        <h2>TIME</h2>
        <span>{{ time }}{{ seconds }}</span><br>
        <span>{{ date }}</span>
        <p>TAP ANYWHERE TO DISMISS</p>
      </div>
    </div>

    <div class="fullScreen" id="gpsStatusfs" @click="toggleVisibility('')">
      <div class="time" id="gpsStatus">
        <h2>GPS</h2>
        <span>{{ gpsStrength === 0 ? 'No GPS available' : gpsStrength }}</span><br>
        <small style="font-size: 2.5vw;position: fixed;width: 100%;left: 0;bottom: 5px;">Updating In: {{ updatedIn
          }}</small><br>
        <p>TAP ANYWHERE TO DISMISS</p>
      </div>
    </div>

    <div class="fullScreen" id="wifiStatusfs" @click="toggleVisibility('')">
      <div class="time" id="wifiStatus">
        <h2>WIFI</h2>
        <span>{{ downloadSpeed }} mbps</span><br>
        <small style="font-size: 2.5vw;position: fixed;width: 100%;left: 0;bottom: 5px;">Updating In: {{ updatedIn
          }}</small><br>
        <p>TAP ANYWHERE TO DISMISS</p>
      </div>
    </div>

    <div class="fullScreen" id="paperStatusfs" @click="toggleVisibility('')">
      <div class="time" id="paperStatus">
        <h2>PAPER</h2>
        <span>{{ this.randomSignal }} tickets left</span><br>
        <button @click="resetPaper()" style="font-size: 2vw; padding: 1vh; margin-top: 30px;">Reload Paper</button>
        <p>TAP ANYWHERE TO DISMISS</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FooterComponent',
  data() {
    return {
      username: localStorage.getItem("username")?.trim(),
      gpsStrength: 0,
      gpsImage: 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png',
      wifiImage: 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png',
      time: '', // Live time
      seconds: '',
      date: '', // Live date
      muteSFX: localStorage.getItem("muteSFX") === "true",
      muteTTS: localStorage.getItem("muteTTS") === "true",
      toggleBELL: localStorage.getItem("toggleBELL") === "true",
      bellLock: false,
      bellOn: false,
      paxAlight: 0,
      unreadMessagesCount: 0, // Initial unread messages count
      previousUnreadMessagesCount: 0, // Store the previous count for comparison
      checkInterval: 1, // Interval for polling the API
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
    this.startPollingForUnreadMessages();
    this.interval = setInterval(this.checkBell, 3000);
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
    async checkUnreadMessages() {
      console.log(this.username);
      try {
          // Make an API call to fetch unread messages
          const response = await axios.get(
            `https://api.mybustimes.cc/api/messages?to_user=${this.username}`,
            { params: { format: 'json' } }
          );
  
          const unreadMessages = response.data.results.filter(
            (message) => message.to_user === this.username && !message.read
          );
  
          // Update unread message count
          this.unreadMessagesCount = unreadMessages.length;
          console.log(unreadMessages.length);
  
          // If the count has increased, play the sound
          if (this.unreadMessagesCount > this.previousUnreadMessagesCount) {
            this.playSoundEffect();
          }
  
          // Store the current count for future comparison
          this.previousUnreadMessagesCount = this.unreadMessagesCount;
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    },

    // Function to play sound effect if not muted
    playSoundEffect() {
      const audio = new Audio(require('@/assets/Audio/Logon.wav'));
      const isSFXMuted = localStorage.getItem('muteSFX') === 'true';
      if (!isSFXMuted) {
        audio.play();
      }
    },

    // Start polling every 5 seconds (you can adjust the interval)
    startPollingForUnreadMessages() {
      this.checkInterval = setInterval(this.checkUnreadMessages, 1000);
    },
    checkBell() {
      if (this.bellLock) return; // Prevent triggering during lockout

      const imgSrc = document.getElementById("Tracking")?.src;
      this.paxTotal = parseInt(localStorage.getItem("paxTotal") || 0);

      if (imgSrc === 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png') {
        const toggleBELL = localStorage.getItem("toggleBELL") === "true"; // Convert to boolean

        if (toggleBELL && !this.bellOn) {
          const randomChance = Math.floor(Math.random() * 10) + 1; // 1 in 10 chance
          if (randomChance === 1 && this.paxTotal > 0) {
            const paxBoarding = Math.floor(Math.random() * 10); // Amount of passengers boarding
            // Ensure paxAlight is between 0 and 5, but only 0 if paxBoarding > 1
            const minAlight = paxBoarding > 1 ? 0 : 1; 
            const maxAlight = this.paxTotal > 5 ? Math.floor(this.paxTotal * 0.1) : 5;
            const paxAlight = Math.max(minAlight, Math.min(maxAlight, Math.floor(Math.random() * this.paxTotal) + 1));

            this.stopText = 'Alighting: ' + paxAlight + '\n Boarding: ' + paxBoarding;

            const audio = new Audio(new URL("@/assets/Audio/bell.wav", import.meta.url));
            const isSFXMuted = localStorage.getItem('muteSFX') === 'true';
            if (!isSFXMuted || paxAlight === 0) {
              audio.play();
            }
            const banner = document.querySelector(".fullScreenStop");
            banner.style.display = "block"; // Show banner
            this.bellOn = true;
            this.bellLock = true;
          } else if  (randomChance === 1) {
            const paxBoarding = Math.floor(Math.random() * 5); // Amount of passengers boarding
          
            this.stopText = 'Boarding: ' + paxBoarding;

            const banner = document.querySelector(".fullScreenStop");
            banner.style.display = "block"; // Show banner
            this.bellOn = true;
            this.bellLock = true;
          }
        }
      }
    },

    clearBell() {
      const banner = document.querySelector(".fullScreenStop");
      banner.style.display = "none";
      this.bellOn = false;
      this.bellLock = true; // Activate lockout

      // Set a 10-second timeout before allowing bell to trigger again
      setTimeout(() => {
        this.bellLock = false;
      }, 10000);
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
            
            // Hide the 'fs' variant of the element
            const elementFS = document.getElementById(elementId + 'fs');
            if (elementFS) {
              elementFS.style.display = "none";
            }
          }
        }
      });

      // Toggle the display of the passed element
      const targetElement = document.getElementById(id);
      if (targetElement) {
        // Toggle the display of the 'fs' variant of the element
        const targetElementFS = document.getElementById(id + 'fs');
        if (targetElementFS) {
          targetElementFS.style.display = (targetElementFS.style.display === "block") ? "none" : "block";
        }

        // Toggle the display of the main element
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
.fullScreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
}

.stopBanner {
  background-color: #ca1a1a;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 10vh;
  color: white;
}

.stopInfo {
  width: 25vw;
  height: 10vh;
  position: fixed;
  left: 0;
  top: 0;
  text-align: center;
  display: flex; 
  align-items: center;
  justify-content: center;
}
.stopBanner p {
  margin: auto;
  font-size: 2vh;
}

.stopInfo p {
  font-size: 4vw;
}

.stopBanner h2 {
  font-size: 5vh;
  margin: 0;
  margin-top: 1vh;
}

.fullScreenStop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 10vh;
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
