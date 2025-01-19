<template>
    <div class="top">
        <h3>Vehicle Config</h3>
    </div>
    <div class="setup">
        <h2>Total Standing Capacity</h2>
        <!-- Use v-model for two-way binding -->
        <input type="number" v-model="paxStanding" id="paxStanding"><br><br>
        
        <h2>Total Seated Capacity</h2>
        <input type="number" v-model="paxSeated" id="paxSeated"><br><br>
        
        <!-- Call setCapacity method when button is clicked -->
        <button @click="setCapacity">Set</button>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('optionsMenu')">BACK</button>
    </div>
</template>

<script>
export default {
    name: "vehicleConfig",
    data() {
        return {
            // Load initial values from localStorage or default to 0
            paxSeated: parseInt(localStorage.getItem("paxSeated")) || 0,
            paxStanding: parseInt(localStorage.getItem("paxStanding")) || 0,
        };
    },
    methods: {
        gotTo(page) {
            this.$router.push({ path: "/" + page });
        },
        // Save capacities to localStorage
        setCapacity() {
            localStorage.setItem("paxSeated", this.paxSeated); // Save seated capacity
            localStorage.setItem("paxStanding", this.paxStanding); // Save standing capacity
        },
    },
};
</script>


<style>
.setup {
    left: 10%;
    text-align: left;
    position: fixed;
    top: 10vh;
    width: 100vw;
    display: block;
}

.setup input {
    width: 80%;
    font-size: 250%;
    border: 1px solid black;
}

.setup button {
    border: 5px solid #004ab9;
    width: 80%;
    font-size: 250%;
}
</style>