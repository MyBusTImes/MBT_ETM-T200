<template>
    <div class="MainButtons">
        <div class="full">
            <div :style="{ width: 'calc(' + (volume * 50) + '% - 20px)' }" class="volume-progress">{{ (volume *
                50).toFixed(2) }}</div>
        </div>
        <div class="full">
            <button @click="play(routeNumName + ', To, ' + dest)">{{ routeNum }} To {{ dest }}</button>
        </div>
        <div class="full">
            <button @click="play('This Bus Terminates Here, All change please, all change.')">This Bus
                Terminates</button>
        </div>
        <div class="full">
            <button
                @click="play('This Bus Is Ready To Depart, please hold onto the hand rails when moving around the vehicle')">This
                Bus Is Ready</button>
        </div>
        <div class="full">
            <button
                @click="play('We are waiting here for a few minutes due to arriving ahead of our scheduled time.')">Waiting</button>
        </div>
        <div class="full">
            <button @click="play('If possible, please make use of the available upstairs seating.')">Sit
                Upstairs</button>
        </div>
        <div class="full">
            <button @click="play('This bus is now on diversion, please listen out for further announcements')">On
                Diversion</button>
        </div>
        <div class="full">
            <button @click="play('This bus terminates at, ' + dest)">This Bus Terminates At</button>
        </div>
        <div class="full">
            <button
                @click="play('This bus now terminates at, ' + dest + '. Please listen out for further announcements.')">This
                Bus Now Terminates At</button>
        </div>
        <div class="full">
            <button
                @click="play('If you see something that doesnt look right, tell a member of staff, or text the british transport police on, six 1 o 1 six, See it, Say it, Sorted.')">See it | Say it | Sorted</button>
        </div>
        <div class="full">
            <div v-for="(announcement, index) in savedAnnouncements" :key="index"
                style="display: flex; align-items: center; margin-bottom: 10px;">
                <button @click="play(announcement)" style="width: 90%; margin-right: 5%;">{{ announcement }}</button>
                <button @click="remove(announcement)"
                    style="writing-mode: vertical-lr; width: 10%; padding: 0px; font-size: 90%; margin: 0px;margin-left: -20px;padding-right: 15px;">REMOVE</button>
            </div>
        </div>
        <br><br>
        <div class="full">
            <input type="text" v-model="customTTS" name="customTTS" id="customTTS" placeholder="Custom Announcement"
                style="width: 100%; height: 7.5vh; background: #004ab9; border: 0; font-size: 125%; color: white; text-align: center;">
        </div>

        <div class="inline">
            <button @click="play(customTTS)">Play Custom</button>
            <button @click="saveCustom">Save Custom</button>
        </div>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('ticketSelling')">BACK</button>
        <button class="startBT" style="right: 12.5vw;" @click="adjustVolume('Down')">▼</button>
        <button class="startBT" @click="adjustVolume('Up')">▲</button>
    </div>
</template>

<style>
input::placeholder {
    font-size: 125%;
    color: rgb(255, 255, 255);
}

.MainButtons {
    overflow-y: scroll;
    height: 72.5vh;
    overflow-x: hidden;
}

.startBT {
    position: fixed;
    right: 0;
    width: calc(12.5vw - 5px);
    height: 7.5vh;
    font-size: 2.5vh;
}

body {
    margin-top: -50px;
}

.inline {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
    display: inline-flex;
    margin-bottom: 10px;
}

.inline button {
    width: calc(50% - 5px);
    margin-right: 5px;
    height: 7.5vh;
    font-size: 2vh;
}

.full {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
    display: block;
    margin-bottom: 10px;
}

.full button {
    width: 100%;
    height: 7.5vh;
    font-size: 2vh;
}

.volume-progress {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    display: none;
    height: 5vh;
    background: #004ab9;
    bottom: 20vh;
    position: fixed;
    left: 10px;
    color: white;
    font-size: 200%;
}
</style>

<script>
export default {
    name: 'optionsMore',
    data() {
        return {
            routeNum: localStorage.getItem('selectedRouteRouteNum'),
            volume: 1, // Default volume is full
            volumeTimeout: null, // Store the timeout ID
            customTTS: '', // Model for the custom text input
            savedAnnouncements: [], // Array to store saved announcements
            dest: localStorage.getItem('dest'),
            routeNumName: (
            (localStorage.getItem('selectedRouteName') && localStorage.getItem('selectedRouteName').trim() !== '' && localStorage.getItem('selectedRouteName') !== 'null') 
                ? localStorage.getItem('selectedRouteName').trim() 
                : localStorage.getItem('selectedRouteRouteNum')
            ) || '',
        };
    },
    created() {
        this.loadSavedAnnouncements(); // Load saved announcements when the component is created
    },
    methods: {
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        },
        play(text) {
            console.log(localStorage.getItem('selectedRouteName')?.trim());
            if ('speechSynthesis' in window) {
                // Replace P&R with "park and ride"
                text = text.replace(/\bP&R\b/gi, "park and ride ");
                text = text.replace(/\bnull\b/gi, "");
                text = text.replace(/\bundefined\b/gi, "");

                // Replace '501' with 'five-oh-one' (or similar logic for other numbers)
                text = text.replace(/\b(\d{3})\b/g, (match) => {
                    return match.replace(/(\d)(\d)(\d)/, (m, first, second, third) => {
                        if (second === '0') {
                            return `${first}-O-${third}`;
                        }
                        return `${first}-${second}-${third}`;
                    });
                });

                const utterance = new SpeechSynthesisUtterance(text);

                // Set default language and voice
                utterance.lang = 'en-GB'; // English (UK)

                // Check for voices and set a natural-sounding one
                const voices = speechSynthesis.getVoices();
                const selectedVoice = voices.find(voice => voice.name.includes('Google UK English Male') || voice.name.includes('Google UK English Female'));
                if (selectedVoice) {
                    utterance.voice = selectedVoice; // Use a more natural voice if available
                }

                // Customize rate, pitch, and volume for a more natural sound
                utterance.rate = 1; // Speed of speech (1 is normal)
                utterance.pitch = 1; // Normal pitch
                utterance.volume = this.volume; // Set volume dynamically

                speechSynthesis.speak(utterance);
            } else {
                alert('Your browser does not support text-to-speech.');
            }
        },
        saveCustom() {
            // Save the custom TTS message to localStorage
            if (this.customTTS.trim() !== '') {
                let saved = JSON.parse(localStorage.getItem('savedAnnouncements')) || [];
                saved.push(this.customTTS);
                localStorage.setItem('savedAnnouncements', JSON.stringify(saved));
                this.loadSavedAnnouncements(); // Reload saved announcements
                this.customTTS = ''; // Clear the input after saving
            }
        },
        loadSavedAnnouncements() {
            // Load saved announcements from localStorage
            this.savedAnnouncements = JSON.parse(localStorage.getItem('savedAnnouncements')) || [];
        },
        adjustVolume(action) {
            if (action === 'Down') {
                this.volume = Math.max(0, (this.volume - 0.05).toFixed(2));
                this.volume = parseFloat(this.volume);
            }

            if (action === 'Up') {
                this.volume = Math.min(2, (this.volume + 0.05).toFixed(2)); // Limit volume to 2
                this.volume = parseFloat(this.volume);
            }

            console.log('Volume:', this.volume); // Log the current volume for debugging

            // Show the volume progress
            let volumeSlider = document.getElementsByClassName('volume-progress')[0]; // Target first element
            if (volumeSlider) {
                volumeSlider.style.display = "block";

                // Clear the existing timeout if there's one already running
                if (this.volumeTimeout) {
                    clearTimeout(this.volumeTimeout);
                }

                // Start a new timeout to hide the volume progress after 5 seconds
                this.volumeTimeout = setTimeout(() => {
                    volumeSlider.style.display = "none";
                }, 2000); // Hide after 2 seconds
            }
        },
        remove(announcement) {
            // Remove the announcement from localStorage
            let saved = JSON.parse(localStorage.getItem('savedAnnouncements')) || [];
            saved = saved.filter(item => item !== announcement); // Remove the specific announcement
            localStorage.setItem('savedAnnouncements', JSON.stringify(saved));

            // Update the savedAnnouncements array in the Vue component
            this.loadSavedAnnouncements(); // Reload saved announcements
        }
    }
}
</script>
