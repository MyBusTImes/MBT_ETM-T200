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
        <p id="ticketName">NO TICKETS TO ISSUE</p>
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

    <div class="tickets" v-if="filteredTickets.length > 0">
        <div class="ticket" v-for="ticket in currentPageTickets" :key="ticket.id">
            <p>£{{ ticket.ticket_price }}</p>
            <button @click="decreaseCount(ticket)">-</button>
            <div class="count">
                <p>{{ ticket.count || 0 }}</p> <!-- Use ticket.count here -->
            </div>
            <button @click="increaseCount(ticket)">+</button>
            <p>{{ ticket.ticketer_name || ticket.ticket_name }}</p>
        </div>
    </div>
    <div v-else>
        <p>No tickets available for this zone.</p>
    </div>

    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">OPTIONS</button>
        <button id="issue" style="z-index: 0;" class="issue" @click="issueTicket">READY</button><button
            style="z-index: 1;" class="issue">SCAN TICKET</button>
        <button style="right: 12.5vw;" id="startStop" class="startBT" @click="prevPage">&lt;</button>
        <button id="startStop" class="startBT" @click="nextPage">&gt;</button>
        <!-- Pagination button -->
    </div>
</template>
<script>
import { updateCurrentStop } from '@/update_currect_stop.js';

export default {
    data() {
        return {
            colours: ["#ff5453", "#ffdc53", "#2fdb42"], 
            paxSeated: parseInt(localStorage.getItem("paxSeated")) || 0,
            paxStanding: parseInt(localStorage.getItem("paxStanding")) || 0,
            paxTotal: parseInt(localStorage.getItem("paxTotal")) || 0,
            zones: ['Other'],  // List of zones
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
            activeZone: null,  // Active zone, initially null
            tickets: JSON.parse(localStorage.getItem('tickets')) || [],
            filteredTickets: [],
            count: 0,
            currentPage: 0, // Current page index
            ticketsPerPage: 6, // Number of tickets per page
            totalPages: 1, // Total pages, defaulted to 1
            currentPageTickets: [],
        };
    },
    mounted() {
        console.log(this.currentIndexStop),
            this.startInactivityTimer();

        // Setting up event listeners for user activity
        window.addEventListener('mousemove', this.resetInactivityTimer);
        window.addEventListener('keydown', this.resetInactivityTimer);

        const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

        // Order tickets by ticket_price in ascending order (lowest to highest)
        tickets.sort((a, b) => a.ticket_price - b.ticket_price);

        // Extract unique ticketer_cat values
        const uniqueCategories = [...new Set(tickets.map(ticket => ticket.ticketer_cat))];

        // Add unique ticketer_cat to zones
        this.zones = uniqueCategories;

        // Set the first zone as active by default
        this.activeZone = this.zones[0] || null;
        this.setActiveZone(0);

        // Initialize filteredTickets with count set to 0
        this.filteredTickets = tickets.map(ticket => ({
            ...ticket,
            count: 0  // Set default count to 0
        }));


        // Fetch data from localStorage (same as before)
    
        this.InMotition = true;
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

        this.updatePagination();
    },
    computed: {
        // Compute the total capacity percentage
        getCapPercent() {
            const totalCap = this.paxSeated + this.paxStanding;
            return totalCap > 0 ? (this.paxTotal / totalCap) * 100 : 0;
        },
    },
    methods: {
        startInactivityTimer() {
            console.log(this.InMotition);
            // Set inactivity timer to redirect after 30 seconds
            if (this.InMotition) {
                console.log('test2');
                this.inactivityTimer = setTimeout(() => {
                    console.log('test3');
                    this.$router.push({ path: '/vehicleInMotition' });
                }, 30000); // 30 seconds
            }
        },

        resetInactivityTimer() {
            // Clear the previous timer and restart the countdown
            clearTimeout(this.inactivityTimer);
            this.startInactivityTimer();
        },

        updatePTags() {
            const trackingImg = document.getElementById('Tracking');
            const dontLog = localStorage.getItem('dontLog');
            if (!dontLog) {
                trackingImg.src = 'https://live.staticflickr.com/65535/54264871386_a378d6b4fb_o_d.png';
            }
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
            const selectedZone = this.zones[index];

            // Filter tickets by ticketer_cat and order by ticket_price (ascending)
            this.filteredTickets = this.tickets
                .filter(ticket => ticket.ticketer_cat === selectedZone)
                .sort((a, b) => a.ticket_price - b.ticket_price);  // Sort by ticket_price

            // Update pagination and current page tickets
            this.updatePagination();
        },

        updatePagination() {
            // Calculate the total pages
            this.totalPages = Math.ceil(this.filteredTickets.length / this.ticketsPerPage);

            // Update the tickets for the current page
            this.updateCurrentPageTickets();
        },

        updateCurrentPageTickets() {
            const startIndex = this.currentPage * this.ticketsPerPage;
            const endIndex = startIndex + this.ticketsPerPage;
            this.currentPageTickets = this.filteredTickets.slice(startIndex, endIndex);
        },

        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.updateCurrentPageTickets();
            }
        },

        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.updateCurrentPageTickets();
            }
        },

        // Update the pagination button text when the page changes
        updatePageButton() {
            document.getElementById("startStop").textContent = `${this.currentPage + 1}/${this.totalPages}`;
        },
        // Show previous zone
        previousZone() {
            if (this.activeZone > 0) {
                this.activeZone--;
                this.setActiveZone(this.activeZone);
            }
        },
        // Show next zone
        nextZone() {
            if (this.activeZone < this.zones.length - 1) {
                this.activeZone++;
                this.setActiveZone(this.activeZone);
            }
        },
        // Decrease the count of the ticket
        increaseCount(ticket) {
            this.filteredTickets.forEach(t => {
                t.count = 0;
            });
            const targetTicket = this.filteredTickets.find(t => t.id === ticket.id);
            if (targetTicket) {
                document.getElementById('ticketName').textContent = '£' + targetTicket.ticket_price.toFixed(2) + ' ' + targetTicket.ticketer_name;
                targetTicket.count = (targetTicket.count || 0) + 1;  // Ensure count is a number
                document.getElementById('issue').style.zIndex = '2';
                document.getElementById('issue').style.backgroundColor = this.getBackgroundColour();
                document.getElementById('issue').style.color = '#ffffff';
                document.getElementById('issue').textContent = '£' + targetTicket.ticket_price.toFixed(2)
            }
        },
        decreaseCount(ticket) {
            const targetTicket = this.filteredTickets.find(t => t.id === ticket.id);
            if (targetTicket && targetTicket.count > 0) {
                targetTicket.count = (targetTicket.count || 0) - 1;  // Ensure count is a number
            }
            if (targetTicket && targetTicket.count === 0) {
                document.getElementById('ticketName').textContent = 'NO TICKET TO ISSUE';
                document.getElementById('issue').style.zIndex = '0';
                document.getElementById('issue').style.backgroundColor = '#c5c2c5';
                document.getElementById('issue').style.color = '#9d9c9d';
                document.getElementById('issue').textContent = 'READY';
            }
        },
        issueTicket() {
            this.filteredTickets.forEach(t => {
                t.count = 0;
            });
            this.paxTotal = parseInt(localStorage.getItem("paxTotal") || 0); // Retrieve and parse to number
            this.paxTotal += 1; // Increment the value
            localStorage.setItem("paxTotal", this.paxTotal); // Save the updated value
            document.getElementById('ticketName').textContent = 'NO TICKET TO ISSUE';
            document.getElementById('issue').style.zIndex = '0';
            document.getElementById('issue').style.backgroundColor = '#c5c2c5';
            document.getElementById('issue').style.color = '#9d9c9d';
            document.getElementById('issue').textContent = 'READY';
        },
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
        navigateToOptions() {
            this.$router.push({ path: '/optionsMenu' });
        }
    }
}
</script>

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
    max-height: calc(20vh - 10px);
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
    width: calc(12.5vw - 5px);
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