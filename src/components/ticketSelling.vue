<template>
    <div class="stops">
        <div class="stop">
            <span class="tag tag1" style="height: 5vh;">FROM</span>
            <button class="prev-button terminus" @click="prevDestinationFrom">&lt;</button>
            <span class="terminus">
                <p id="From">FROM</p>
            </span>
            <button class="next-button terminus" @click="nextDestinationFrom">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag2" style="height: 5vh;">STOP</span>
            <button class="prev-button stop1" @click="prevStop">&lt;</button>
            <span class="stop1">
                <p id="Stop">STOP</p>
            </span>
            <button class="next-button stop1" @click="nextStop">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag3" style="height: 5vh;">TO</span>
            <button class="prev-button terminus" @click="prevDestinationTo">&lt;</button>
            <span class="terminus">
                <p id="To">TO</p>
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
    </div>
    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">OPTIONS</button>
        <button class="issue">READY</button><button style="left: 50vw;" class="issue">Scan Ticket</button>
        <button id="startStop" class="startBT">1/1</button>
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

.swipe-container::-webkit-scrollbar {
    display: none;
}

.swipe-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    overflow-x: scroll;
    gap: 5px;
    scroll-snap-type: x mandatory;
    padding: 0 5px;
    width: calc(90% - 20px);
    margin-left: calc(5% + 5px);
    height: 3vh;
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
    height: 33%;
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
    width: 25vw;
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
import { updateCurrentStop } from '@/update_currect_stop.js';

export default {
    data() {
        return {
            zones: ['Single', 'Day', 'Week', 'Month', 'Year', 'Other'],  // List of zones
            activeZone: 0,  // Default active zone is the first one
            routeArray: [], // Holds the combined array
            currentIndexFrom: 0,
            currentIndexTo: 0,
            currentIndexStop: Number(localStorage.getItem('currentIndexStop')) - 1 || 0,
            INBOUND: true,
            StopArray: [],
            Start: '',
            End: '',
            tripId: '',
            updatedStop: '', // New stop
            inactivityTimer: null, // Timer to track inactivity
        };
    },
    mounted() {
        console.log(this.currentIndexStop),
        this.startInactivityTimer();
        
        // Setting up event listeners for user activity
        window.addEventListener('mousemove', this.resetInactivityTimer);
        window.addEventListener('keydown', this.resetInactivityTimer);
        
        // Fetch data from localStorage (same as before)
        const INBOUND = localStorage.getItem('INBOUND');
        const routeStart = localStorage.getItem('selectedRouteStart');
        const routeEnd = localStorage.getItem('selectedRouteEnd');
        const routeStop1 = localStorage.getItem('selectedRouteStop1');
        const routeStop2 = localStorage.getItem('selectedRouteStop2');
        const routeDest1 = localStorage.getItem('selectedRouteDest1');
        const TripID = localStorage.getItem('TripID');
        const routeDest1Array = routeDest1 === 'null' || !routeDest1 ? [] : routeDest1.split(' - ').filter(item => item !== 'null');
        const routeDest2 = localStorage.getItem('selectedRouteDest2');
        const routeDest2Array = routeDest2 === 'null' || !routeDest2 ? [] : routeDest2.split(' - ').filter(item => item !== 'null');

        this.tripId = TripID;

        const routeStop1Array = routeStop1 === 'null' || !routeStop1 ? [] : routeStop1.split('\r\n').filter(item => item !== 'null');
        const routeStop2Array = routeStop2 === 'null' || !routeStop2 ? [] : routeStop2.split('\r\n').filter(item => item !== 'null');

        this.INBOUND = INBOUND === 'true';
        this.routeArray = [routeStart, ...routeDest1Array, ...routeDest2Array, routeEnd].filter(Boolean);

        if (this.INBOUND) {
            this.StopArray = routeStop1Array;
            this.Start = this.routeArray[0];
            this.End = this.routeArray[this.routeArray.length - 1];
            console.log('Inbound', this.Start, this.End);
            localStorage.setItem('stopArray', JSON.stringify(this.StopArray));
        } else {
            this.StopArray = routeStop2Array;
            this.Start = this.routeArray[this.routeArray.length - 1];
            this.End = this.routeArray[0];
            console.log('Outbound', this.Start, this.End);
            localStorage.setItem('stopArray', JSON.stringify(this.StopArray));
        }
        console.log(INBOUND);
        this.updatePTags();
    },
    methods: {
        startInactivityTimer() {
            // Set inactivity timer to redirect after 30 seconds
            this.inactivityTimer = setTimeout(() => {
                console.log('test');
                this.$router.push({ path: '/vehicleInMotition'});
            }, 10000); // 30 seconds
        },

        resetInactivityTimer() {
            // Clear the previous timer and restart the countdown
            clearTimeout(this.inactivityTimer);
            this.startInactivityTimer();
        },

        updatePTags() {
            const trackingImg = document.getElementById('Tracking');
            trackingImg.src = 'https://live.staticflickr.com/65535/54264871386_a378d6b4fb_o_d.png';
            // Ensure the routeArray has content
            if (this.routeArray.length) {
                const fromElement = document.getElementById('From');
                const toElement = document.getElementById('To');
                const stopElement = document.getElementById('Stop');

                const fromText = this.Start;
                const toText = this.End;

                console.log(this.INBOUND);

                // Update elements if they exist
                if (fromElement) fromElement.textContent = fromText;
                if (toElement) toElement.textContent = toText;

                // Ensure StopArray has at least one element before updating
                if (this.StopArray.length > 0 && stopElement) {
                    this.currentIndexStop = Number(localStorage.getItem('currentIndexStop')) - 1,
                    stopElement.textContent = this.StopArray[this.currentIndexStop];
                }
            }
        },

        //Update the displayed dest or stop
        updateStopTag() {
            const StopElement = document.getElementById('Stop');
            if (StopElement && this.StopArray.length > 0) {
                StopElement.textContent = this.StopArray[this.currentIndexStop];
                const updatedData = updateCurrentStop(this.tripId, this.StopArray[this.currentIndexStop]);
                console.log(updatedData);
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

        //Change dest or stop

        // Moves to the next stop
        nextStop() {
            if (this.StopArray.length > 0) {
                this.currentIndexStop = (this.currentIndexStop + 1) % this.StopArray.length;
                localStorage.setItem('currentIndexStop', (this.currentIndexStop + 1) % this.StopArray.length);
                this.updateStopTag();
            }
        },
        prevStop() {
            if (this.StopArray.length > 0) {
                this.currentIndexStop =
                    (this.currentIndexStop - 1 + this.StopArray.length) % this.StopArray.length;
                localStorage.setItem('currentIndexStop', (this.currentIndexStop + 1) % this.StopArray.length);
                this.updateStopTag();
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
