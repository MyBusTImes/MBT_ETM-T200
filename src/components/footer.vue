<template>
  <div class="footer">
    <div class="logo">
      <img height="100%" width="100%" src="@/assets/logo.png" alt="">
    </div>

    <div class="status">
      <img src="https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/Messages.png?token=GHSAT0AAAAAAC5G2KAOYU6EMEVDOOQICON4Z4ECTVA" alt="">
      <p id="messagesNum">0</p>
      <img :src="gpsImage" alt="GPS Signal" id="gps" />
      <img :src="wifiImage" alt="Wi-Fi Signal" id="Wi-Fi" />
      <img :src="printerImage" alt="Printer Signal" id="Printer" />
      <img src="https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA" alt="" id="Tracking">
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
      gpsImage: 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA',
      wifiImage: 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA',
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
        this.printerImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA';
      } else if (randomSignal < 40) {
        this.printerImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/Printer%20Low.png?token=GHSAT0AAAAAAC5G2KAPH5ME7JDCMTXSCYWCZ4ECUCQ';
      } else {
        this.printerImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/3.png?token=GHSAT0AAAAAAC5G2KAOXHIFVHT3M6LHEEMEZ4ECXFA';
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
            this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA';
          }
        );
      } else {
        console.error('Geolocation not supported');
        this.gpsStrength = 0;
        this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA';
      }
    },
    getGPSSignalStrength(position) {
      const accuracy = position.coords.accuracy;
      if (accuracy < 10) {
        this.gpsStrength = 3;
        this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/3.png?token=GHSAT0AAAAAAC5G2KAOXHIFVHT3M6LHEEMEZ4ECXFA';
      } else if (accuracy < 50) {
        this.gpsStrength = 2;
        this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/2.png?token=GHSAT0AAAAAAC5G2KAPAAX64M4IUHFGBXJWZ4ECW6A';
      } else if (accuracy < 100) {
        this.gpsStrength = 1;
        this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/1.png?token=GHSAT0AAAAAAC5G2KAOXY25CVKJYDRZ3XDOZ4ECVFQ';
      } else {
        this.gpsStrength = 0;
        this.gpsImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA';
      }
    },
    getWiFiStrength() {
      const navigationStart = performance.timing.navigationStart;
      const domComplete = performance.timing.domComplete;
      const loadTime = domComplete - navigationStart;
      if (loadTime < 1000) {
        this.wifiImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/3.png?token=GHSAT0AAAAAAC5G2KAOXHIFVHT3M6LHEEMEZ4ECXFA';
      } else if (loadTime < 1500) {
        this.wifiImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/2.png?token=GHSAT0AAAAAAC5G2KAPAAX64M4IUHFGBXJWZ4ECW6A';
      } else if (loadTime < 3000) {
        this.wifiImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/1.png?token=GHSAT0AAAAAAC5G2KAOXY25CVKJYDRZ3XDOZ4ECVFQ';
      } else {
        this.wifiImage = 'https://raw.githubusercontent.com/Kai-codin/MBT-Ticketer/refs/heads/main/src/assets/Signal/0.png?token=GHSAT0AAAAAAC5G2KAOTLJDRVQZQMTJGXEIZ4ECUQA';
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