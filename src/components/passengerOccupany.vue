<template>
    <div class="top">
        <h3>Passenger Occupancy</h3>
    </div>
    <div class="vehicleInfo">
        <p>
            Bus Capacity
            <span style="display: inline-block; width: 5vw;"></span>
            Seated: {{ paxSeated }}
            <span style="display: inline-block; width: 5vw;"></span>
            Standing: {{ paxStanding }}
        </p>
    </div>
    <div class="alightButtons">
        <button @click="alight(1)">ALIGHT 1</button>
        <button @click="alight(2)">ALIGHT 2</button>
        <button @click="alight(3)">ALIGHT 3</button>
        <button @click="alight(4)">ALIGHT 4</button>
        <button @click="alight(5)">ALIGHT 5</button>
    </div>
    <div class="paxNum">
        <p>Occupancy</p>
        <div class="countPax" :style="{ backgroundColor: getBackgroundColour() }">
            <h3>{{ paxTotal }}</h3>
        </div>
    </div>
    <div class="addButton">
        <button @click="addPassenger(1)">ADD 1</button>
    </div>
    <div class="zero">
        <button @click="resetToZero()">RESET TO ZERO</button>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('optionsMenu')">BACK</button>
    </div>
</template>

<script>
export default {
    name: "template",
    data() {
        return {
            paxSeated: parseInt(localStorage.getItem("paxSeated")) || 0,
            paxStanding: parseInt(localStorage.getItem("paxStanding")) || 0,
            paxTotal: parseInt(localStorage.getItem("paxTotal")) || 0,
            colours: ["#ff5453", "#ffdc53", "#2fdb42"], // Red, Yellow, Green
        };
    },
    mounted() {
        this.saveToLocalStorage();
    },
    computed: {
        // Compute the total capacity percentage
        getCapPercent() {
            const totalCap = this.paxSeated + this.paxStanding;
            return totalCap > 0 ? (this.paxTotal / totalCap) * 100 : 0;
        },
    },
    methods: {
        gotTo(page) {
            this.$router.push({ path: "/" + page });
        },
        // Method to determine background colour based on percentage
        getBackgroundColour() {
            const percentage = this.getCapPercent;

            if (percentage >= 90) {
                return this.colours[0]; // Red for 90% and above
            } else if (percentage >= 75) {
                return this.colours[1]; // Yellow for 75% to 90%
            } else {
                return this.colours[2]; // Green for below 75%
            }
        },
        // Add passengers
        addPassenger(count) {
            this.paxTotal += count;
            this.saveToLocalStorage();
        },
        // Alight passengers
        alight(count) {
            this.paxTotal = Math.max(this.paxTotal - count, 0);
            this.saveToLocalStorage();
        },
        // Reset to zero
        resetToZero() {
            this.paxTotal = 0;
            this.saveToLocalStorage();
        },
        // Save current state to localStorage
        saveToLocalStorage() {
            localStorage.setItem("paxTotal", this.paxTotal);
        },
    },
};
</script>

<style>
/* Styles remain unchanged */
.optionBTRight {
    position: fixed;
    right: 0;
    width: calc(25vw - 5px);
    height: 7.5vh;
    font-size: 2.5vh;
}

.zero button {
    width: 100%;
    height: 100%;
}

.zero {
    position: fixed;
    right: 10px;
    top: 43vh;
    width: 65vw;
    height: calc(7.5vh - 10px);
}

.countPax {
    position: fixed;
    width: 30vw;
    left: 35vw;
    color: #fff;
    font-size: 150%;
    height: 15vh;
    top: 25vh;
}

.countPax h3 {
    margin: 15%;
}

.paxNum {
    position: fixed;
    width: 50vw;
    left: 25vw;
    top: 15vh;
    font-size: 200%;
}

.addButton button {
    height: 100%;
    width: 100%;
    margin-bottom: 10px;
    font-size: 100%;
}

.addButton {
    position: fixed;
    top: 29vh;
    height: calc(7vh - 10px);
    width: 25vw;
    right: 10px;
}

.alightButtons button {
    height: calc(20% - 10px);
    width: 100%;
    margin-bottom: 10px;
    font-size: 100%;
}

.alightButtons {
    position: fixed;
    top: 15vh;
    height: 35vh;
    width: 25vw;
}

.vehicleInfo {
    position: fixed;
    top: 5vh;
    text-align: center;
    width: 100vw;
    font-size: 2vh;
}

.top {
    position: fixed;
    width: 100vw;
    background: black;
    left: 0;
    top: 0;
    color: white;
    text-align: left;
    height: 45px;
}

.top h3 {
    margin-top: 8px;
    margin-left: 10px;
}
</style>