<template>
  <div class="footer">
    <div class="logo">
      <img height="100%" width="100%" src="@/assets/logo.png" alt="">
    </div>

    <div class="status">
      <img src="https://live.staticflickr.com/65535/54262843340_6a829de1cd_o_d.png" alt="">
      <p id="messagesNum">0</p>
      <img :src="gpsImage" alt="GPS Signal" id="gps" />
      <img :src="wifiImage" alt="Wi-Fi Signal" id="Wi-Fi" />
      <img :src="printerImage" alt="Printer Signal" id="Printer" />
      <img src="https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png" alt="" id="Tracking">
    </div>

    <div class="footerTime">
      <span>{{ time }}</span><br>
      <span>{{ date }}</span>
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
      date: '', // Live date
    };
  },
  mounted() {
    this.checkLocationPermission();
    this.getWiFiStrength();
    this.randomPrinterSignal();
    this.updateTime(); // Start updating the time when the component is mounted
    setInterval(this.updateTime, 1000); // Update the time every second
  },
  methods: {
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
      if (loadTime < 2000) {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
      } else if (loadTime < 5000) {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262661674_f182df8274_o_d.png';
      } else {
        this.wifiImage = 'https://live.staticflickr.com/65535/54262661719_3c33814e9d_o_d.png';
      }
    },
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[now.getMonth()];
      this.time = `${hours}:${minutes}`;
      this.date = `${month} ${day}`;
    }
  }
};
</script>

<style scoped>
#messagesNum {
  color: white;
  position: fixed;
  bottom: -15px;
  z-index: 100;
  left: 30%;
  font-size: 250%;
  font-weight: bolder;
  text-align: center;
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

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 9vh;
  width: 50%;
  margin: 0 auto;
}

.status img {
  width: 22%;
  height: 100%;
  object-fit: contain;
}

.footerTime {
  position: fixed;
  color: white;
  text-align: right;
  font-size: 2rem;
  right: 10px;
}

/* Media Queries */
@media (max-width: 768px) {
  #messagesNum {
    z-index: 100;
    left: 26.25%;
    font-size: 250%;
    font-weight: bolder;
    text-align: center;
  }

  .footer {
    height: 10vh;
    flex-direction: column;
    justify-content: center;
  }

  .logo {
    height: 8vh;
    width: 8vh;
  }

  .status {
    width: 60%;
  }

  .status img {
    width: 20%;
    height: 80%;
  }

  .footerTime {
    font-size: 1.2rem;
  }
}

@media (max-width: 600px) {
  #messagesNum {
    color: transparent;
  }

  .footer {
    height: 10vh;
  }

  .status {
    position: fixed;
    left: 25vw;
    width: 50vw;
  }

  .status img {
    width: 20%;
    height: 80%;
  }

  .footerTime {
    font-size: .75rem;
  }
}
</style>