<template>
    <div class="vehicle" @click="goToTicketSelling">
        <h2>{{ this.routeNum }}</h2>
        <h2>VEHICLE IN MOTION</h2>
        <h2>TAP SCREEN TO CONTINUE</h2>

        <div class="passengers">PASSENGERS: {{ paxTotal }}</div>

        <h3>Next Stop: {{ nextStop }}</h3>

        <h3>Last Stop: {{ lastStop }}</h3><br><br>
        <button class="issue" @click.stop="arriveAtStop">ARRIVED AT: <br> {{ nextStop }}</button>
    </div>
</template>

<script>
import { updateCurrentStop } from '@/update_currect_stop.js';

export default {
    data() {
        return {
            paxTotal: parseInt(localStorage.getItem("paxTotal")) || 0,
            nextStop: 'STOP NAME',
            lastStop: 'STOP NAME',
        }
    },
    mounted() {
        this.routeNum = localStorage.getItem('selectedRouteRouteNum') ? 'SERVICE: ' + localStorage.getItem('selectedRouteRouteNum') : '';
        const TripID = localStorage.getItem('TripID');
        this.TripID = TripID
        // Ensure currentIndexStop is a valid number
        const currentIndexStop = Number(localStorage.getItem('currentIndexStop')) || 0;
        console.log(currentIndexStop);
        this.currentIndexStop = currentIndexStop;

        // Get the route stops from localStorage and parse it as a JSON array
        const stopArray = JSON.parse(localStorage.getItem('stopArray')) || [];
        this.stopArray = stopArray;

        // Ensure the stopArray has valid stops and calculate the next stop index
        if (this.stopArray.length > 0 && this.currentIndexStop + 1 < this.stopArray.length) {
            this.nextStop = this.stopArray[this.currentIndexStop]; // Get next stop
            this.lastStop = this.stopArray[this.currentIndexStop - 1]; // Get last stop
            if (this.nextStop.startsWith("M - ")) {
                this.nextStop = this.nextStop.split("M - ")[1]; // Remove "M - " from next stop
            }
            if (this.lastStop && this.lastStop.startsWith("M - ")) {
                this.lastStop = this.lastStop.split("M - ")[1]; // Remove "M - " from last stop
            }
        } else {
            this.nextStop = 'No more stops'; // Fallback if no more stops are available
        }
    },
    methods: {
        arriveAtStop() {
            // Handle the arrival at stop logic here
            const audio = new Audio(require('@/assets/Audio/Click.wav'));

            const isSFXMuted = localStorage.getItem('muteSFX') === 'true';
            if (!isSFXMuted) {
                audio.play();
            }
            console.log("Arriving at stop:", this.nextStop);
            updateCurrentStop(this.TripID, this.stopArray[this.currentIndexStop]);
            this.currentIndexStop = this.currentIndexStop + 1;
            localStorage.setItem('currentIndexStop', this.currentIndexStop)
            this.nextStop = this.stopArray[this.currentIndexStop];
            this.lastStop = this.stopArray[this.currentIndexStop - 1]; // Get last stop
            if (this.nextStop.startsWith("M - ")) {
                this.nextStop = this.nextStop.split("M - ")[1]; // Remove "M - " from next stop
            }
            if (this.lastStop && this.lastStop.startsWith("M - ")) {
                this.lastStop = this.lastStop.split("M - ")[1]; // Remove "M - " from last stop
            }

            this.play('this is, ' + this.lastStop + '. Next stop, ' + this.nextStop)
        },
        play(text) {
            const isTTSMuted = localStorage.getItem('muteTTS') === 'true';
            if (!isTTSMuted) {
                if ('speechSynthesis' in window) {
                    // Replace "opp" with "opposite" before speaking
                    text = text.replace(/\bM - \b/gi, "");
                    text = text.replace(/\badj\b/gi, "adjacent, ");
                    text = text.replace(/\bPH\b/gi, "pub, ");
                    text = text.replace(/\bopp\b/gi, "opposite, ");
                    text = text.replace(/\bnr\b/gi, "near, ");
                    text = text.replace(/\bP&R\b/gi, "park and ride ");
                    text = text.replace(/\bnull\b/gi, "");
                    text = text.replace(/\bundefined\b/gi, "");
                    text = text.replace(/\bln\b/gi, "line");

                    const utterance = new SpeechSynthesisUtterance(text);

                    // Set default language and voice
                    utterance.lang = 'en-GB'; // English (UK)

                    // Check for voices and set a natural-sounding one
                    const voices = speechSynthesis.getVoices();
                    const selectedVoice = voices.find(voice =>
                        voice.name.includes('Google UK English Male') ||
                        voice.name.includes('Google UK English Female')
                    );

                    if (selectedVoice) {
                        utterance.voice = selectedVoice; // Use a more natural voice if available
                    }

                    // Customize rate, pitch, and volume for a more natural sound
                    utterance.rate = 1; // Speed of speech (1 is normal)
                    utterance.pitch = 1; // Normal pitch
                    utterance.volume = 1; // Set volume dynamically

                    speechSynthesis.speak(utterance);
                } else {
                    alert('Your browser does not support text-to-speech.');
                }
            }
        },
        goToTicketSelling() {
            this.$router.go(-1);
        }
    }
}
</script>


<style>
.lastStop {
    position: fixed;
    bottom: 20vh;
    text-align: center;
    width: 100vw;
}

.vehicle .issue {
    background-color: rgb(56, 56, 56);
    color: white;
    left: 0;
    width: 100vw;
    height: 10vh;
    font-size: calc(4vw - 2.5px);
    position: fixed;
    bottom: 10vh;
    z-index: 10;
}

.vehicle h2 {
    margin-top: 5vh;
}

.vehicle .passengers {
    width: 90vw;
    margin: 10vh 5vw;
    background-color: rgb(0, 155, 21);
    height: 3vh;
    font-size: calc(3vh - 2.5px);
}

.vehicle {
    background: black;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    color: white;
}
</style>
