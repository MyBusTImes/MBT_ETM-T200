<template>
    <div class="MainButtons">
        <div class="full">
            <button @click="play('This Bus Terminates Here, All change please, all change.')">This Bus
                Terminates</button>
        </div>
        <div class="full">
            <button
                @click="play('This Bus Is Ready To Depart, please hold onto the hand rails when moving around the vehicle')">This
                Bus Is Ready</button>
        </div>
    </div>
    <div class="full">
        <button @click="gotTo('announcements')">Announcements</button>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('optionsMore')">BACK</button>
    </div>
</template>

<style>
body {
    margin-top: -50px
}

.inline {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
    display: inline-flex;
    margin-bottom: 10px
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
    margin-bottom: 10px
}

.full button {
    width: 100%;
    height: 7.5vh;
    font-size: 2vh;
}
</style>

<script>
export default {
    name: 'optionsMore',
    mounted() {
        speechSynthesis.onvoiceschanged = () => {
            this.voices = speechSynthesis.getVoices();
        };
    },
    methods: {
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        },
        play(text) {
            if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            
            // Try selecting a high-quality voice (Microsoft's)
            utterance.voice = voices.find(v => v.name.includes('Microsoft')) || voices[0];
            utterance.lang = 'en-GB'; // Adjust as needed

            speechSynthesis.speak(utterance);
            } else {
            alert('Your browser does not support text-to-speech.');
            }
        }
    }
}
</script>