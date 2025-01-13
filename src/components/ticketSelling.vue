<template>
    <div class="stops">
        <div class="stop">
            <span class="tag tag1" style="height: 5vh;">FROM</span>
            <button class="prev-button terminus" @click="prevDestinationFrom">&lt;</button>
            <span class="terminus">
                <p id="From">Name</p>
            </span>
            <button class="next-button terminus" @click="nextDestinationFrom">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag2" style="height: 5vh;">STOP</span>
            <button class="prev-button stop1">&lt;</button>
            <span class="stop1">
                <p id="Stop">Name</p>
            </span>
            <button class="next-button stop1">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag3" style="height: 5vh;">TO</span>
            <button class="prev-button terminus" @click="prevDestinationTo">&lt;</button>
            <span class="terminus">
                <p id="To">Name</p>
            </span>
            <button class="next-button terminus" @click="nextDestinationTo">&gt;</button>
        </div>
    </div>
    <div class="ticketToIssue">
        <p>NO TICKETS TO ISSUE</p>
    </div>
    <div class="Zones">
        <button @click="previousZone" style="left: 0;">&lt;</button>
        <div class="swipe-container">
            <span v-for="(zone, index) in zones" :key="index" :class="['zone', { active: activeZone === index }]"
                @click="setActiveZone(index)">
                {{ zone }}
            </span>
        </div>
        <button @click="nextZone" style="right: 0;">&gt;</button>
    </div>
    <div class="tickets">
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">OPTIONS</button>
        <button class="issue">READY</button>
        <button id="startStop" class="startBT" @click="startStopTrip">Start Tracking</button>
    </div>
</template>

<style>
.Zones .zone {
    background-color: #004ab9;
    color: white;
    display: inline-block;
    padding: 5px;
    min-width: 100px;
    text-align: center;
    scroll-snap-align: center;
    cursor: pointer;
}

.Zones .zone.active {
    background-color: #ff0000;
    /* Active zone color */
}


.Zones {
    display: flex;
    align-items: center;
    position: absolute;
    width: calc(100% - 20px);
    top: calc(20vh - 5px);
    height: 3vh;
    left: 10px;
}

.swipe-container {
    display: flex;
    overflow-x: scroll;
    gap: 5px;
    scroll-snap-type: x mandatory;
    padding: 10px;
    width: 100%;
}

.Zones span {
    background-color: #004ab9;
    color: white;
    display: inline-block;
    padding: 5px;
    min-width: 100px;
    text-align: center;
    scroll-snap-align: center;
}

.swipe-container {
    display: flex;
    overflow-x: scroll;
    gap: 5px;
    scroll-snap-type: x mandatory;
    padding: 0 5px;
    width: calc(90% - 20px);
    margin-left: calc(5% + 5px);
    margin-top: 16px;
    height: calc(5vh - 2px);
}

.left {
    left: 0;
}

.right {
    right: 0;
}


.Zones button {
    height: 100%;
    width: 5%;
    position: absolute;

}

.ticketToIssue {
    position: fixed;
    top: calc(15vh + 2px);
    color: #828182;
}

.tickets {
    display: grid;
    grid-template-columns: repeat(2, 6fr);
    gap: 5px;
    position: fixed;
    width: calc(100vw - 20px);
    left: 10px;
    right: 10px;
    top: 22.5vh;
    bottom: calc(18vh + 10px);
    font-size: 2vh;
}

.ticket {
    border: 1px solid #000000;
    text-align: center;
    background-color: #c5c2c5;
}

.ticket .count {
    display: inline-block;
    margin: -10px 20px;
    border: 1px black solid;
    width: 30%;
}

.ticket button {
    display: inline-block;
    vertical-align: middle;
    background-color: transparent;
    color: black;
    font-size: 2vh;
}

.buttons {
    position: fixed;
    bottom: calc(10vh + 5px);
    left: 0;
    right: 0;
    height: 7.5vh;
}

.optionBT {
    position: fixed;
    left: 0;
    width: calc(25vw - 5px);
    height: 7.5vh;
    font-size: 2.5vh;
}

.startBT {
    position: fixed;
    right: 0;
    width: calc(25vw - 5px);
    height: 7.5vh;
    font-size: 2.5vh;
}

.issue {
    background: #c5c2c5;
    color: #9d9c9d;
    font-size: 2.5vh;
    position: fixed;
    width: 50vw;
    left: 25vw;
    height: 7.5vh;
}

.prev-button {
    margin-left: 20px;
}

.tag {
    position: fixed;
    left: 5px;
    background-color: #c5c2c5;
    color: black;
    text-orientation: mixed;
    text-align: center;
    writing-mode: vertical-rl;
    font-size: 90%;
    transform: rotate(180deg);
}

.tag1 {
    top: 5px;
}

.tag2 {
    top: calc(5vh + 10px);
}

.tag3 {
    top: calc(10vh + 15px);
}

.stops {
    position: fixed;
    top: 5px;
    left: 5px;
    right: 5px;
    z-index: 1000;
    /* Ensures it stays on top of other content */
}

.stop {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 5vh;
}

.stop button {
    width: 5%;
    height: 100%;
}

.stop span {
    margin: 0 5px;
    flex-grow: 1;
    height: 100%;
}

.stop p {
    font-size: 100%;
    text-align: center;
    color: white;
    margin-top: 15px;
}

.terminus {
    background-color: #103963;
}

.terminus:hover {
    background-color: #0b2846;
}

.stop1 {
    background-color: #2965a5;
}

.stop1:hover {
    background-color: #1f4b7a;
}
</style>

<script>
export default {
    data() {
        return {
            zones: ['Single', 'Day', 'Week', 'Month', 'Year', 'Other'],  // List of zones
            activeZone: 0,  // Default active zone is the first one
            routeArray: [], // Holds the combined array
            currentIndexFrom: 0,
            currentIndexTo: 0,
        };
    },
    mounted() {
        //const routeID = localStorage.getItem('selectedRoute');
        const routeStart = localStorage.getItem('selectedRouteStart');
        const routeEnd = localStorage.getItem('selectedRouteEnd');
        //const routeStop1 = localStorage.getItem('selectedRouteStop1');
        //const routeStop2 = localStorage.getItem('selectedRouteStop2');
        const routeDest1 = localStorage.getItem('selectedRouteDest1');
        const routeDest1Array = routeDest1 === 'null' || !routeDest1 ? [] : routeDest1.split(' - ').filter(item => item !== 'null');
        const routeDest2 = localStorage.getItem('selectedRouteDest2');
        const routeDest2Array = routeDest2 === 'null' || !routeDest2 ? [] : routeDest2.split(' - ').filter(item => item !== 'null');


        this.routeArray = [routeStart, ...routeDest1Array, ...routeDest2Array, routeEnd].filter(Boolean);

        this.updatePTags();
    },
    methods: {
        startStopTrip() {
            const startStop = document.getElementById('startStop');
            const trackingImg = document.getElementById('Tracking');
            if (startStop.textContent == 'Stop Tracking'){
                startStop.textContent = 'Start Tracking';
                trackingImg.src = 'https://live.staticflickr.com/65535/54265089689_3b0b1b2a6e_o_d.png';
            } else {
                startStop.textContent = 'Stop Tracking';
                trackingImg.src = 'https://live.staticflickr.com/65535/54262423506_4e89c983c4_o_d.png';
            }
            
        },
        updatePTags() {
            // Ensure the routeArray has content
            if (this.routeArray.length) {
                const fromElement = document.getElementById('From');
                const toElement = document.getElementById('To');
                if (fromElement) fromElement.textContent = this.routeArray[0];
                if (toElement) toElement.textContent = this.routeArray[this.routeArray.length - 1];
            }
        },

        updateToTag() {
            const toElement = document.getElementById('To');
            if (toElement && this.routeArray.length > 0) {
                toElement.textContent = this.routeArray[this.currentIndexTo];
            }
        },

        updateFromTag() {
            const fromElement = document.getElementById('From');
            if (fromElement && this.routeArray.length > 0) {
                fromElement.textContent = this.routeArray[this.currentIndexFrom];
            }
        },
        prevDestinationTo() {
            if (this.routeArray.length > 0) {
                this.currentIndexTo =
                    (this.currentIndexTo - 1 + this.routeArray.length) % this.routeArray.length;
                this.updateToTag();
            }
        },
        // Moves to the next destination
        nextDestinationTo() {
            if (this.routeArray.length > 0) {
                this.currentIndexTo = (this.currentIndexTo + 1) % this.routeArray.length;
                this.updateToTag();
            }
        },
        prevDestinationFrom() {
            if (this.routeArray.length > 0) {
                this.currentIndexFrom =
                    (this.currentIndexFrom - 1 + this.routeArray.length) % this.routeArray.length;
                this.updateFromTag();
            }
        },
        // Moves From the next destination
        nextDestinationFrom() {
            if (this.routeArray.length > 0) {
                this.currentIndexFrom = (this.currentIndexFrom + 1) % this.routeArray.length;
                this.updateFromTag();
            }
        },
        setActiveZone(index) {
            this.activeZone = index;
        },
        nextZone() {
            if (this.activeZone < this.zones.length - 1) {
                this.activeZone++;
            } else {
                this.activeZone = 0;  // Loop back to the start
            }
        },
        previousZone() {
            if (this.activeZone > 0) {
                this.activeZone--;
            } else {
                this.activeZone = this.zones.length - 1;  // Loop back to the end
            }
        },
        navigateToOptions() {
            this.$router.push({ path: '/optionsMenu' });
        }
    }
}
</script>