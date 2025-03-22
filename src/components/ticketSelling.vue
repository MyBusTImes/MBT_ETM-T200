<template>

    <div class="stops">
        <div class="stop">
            <span class="tag tag1" style="height: 6vh;">FROM</span>
            <button class="prev-button terminus" @click="prevDestinationFrom">&lt;</button>
            <span class="terminus">
                <p id="From">FROM</p>
            </span>
            <button class="next-button terminus" @click="nextDestinationFrom">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag2" style="height: 6vh;">STOP</span>
            <button class="prev-button stop1" @click="prevStop">&lt;</button>
            <span class="stop1">
                <p id="Stop">STOP</p>
            </span>
            <button class="next-button stop1" @click="nextStop">&gt;</button>
        </div>
        <div class="stop">
            <span class="tag tag3" style="height: 6vh;">TO</span>
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
        <div class="ticket" v-for="ticket in currentPageTickets" :key="ticket.id"
            :style="{ backgroundColor: ticket.ticketer_colour }">
            <p style="margin-top: 10px;">£{{ ticket.ticket_price.toFixed(2) }}</p>
            <button @click="decreaseCount(ticket)">-</button>
            <div class="count">
                <p>{{ ticket.count || 0 }}</p> <!-- Use ticket.count here -->
            </div>
            <button @click="increaseCount(ticket)">+</button>
            <p>{{ ticket.ticketer_name || ticket.ticket_name }}</p>
        </div>
        <div class="ticket1">

        </div>
        <div class="ticket1">

        </div>
        <div class="ticket1">

        </div>
    </div>
    <div v-else>
        <p>No tickets available for this zone.</p>
    </div>

    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">OPTIONS</button>
        <button id="issue" style="z-index: 0;" class="issue" @click="issueTicket">READY</button>
        <button class="issue" style="z-index: 1;" @click="gotTo('ticketReport')">SCAN TICKET</button>
        <button class="issueALIGHT" :style="{ zIndex: 2, backgroundColor: getBackgroundColour() }"
            @click="alight(1)">ALIGHT ({{ this.paxTotal }})</button>
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
            bellOn: false,
            currentPage: 0, // Current page index
            ticketsPerPage: 6, // Number of tickets per page
            totalPages: 1, // Total pages, defaulted to 1
            currentPageTickets: [],
            ticketDataArray: JSON.parse(localStorage.getItem('ticketDataArray')) || [],
        };
    },
    mounted() {
        console.log(this.currentIndexStop),
            this.startInactivityTimer(true);

        // Setting up event listeners for user activity
        window.addEventListener('mousemove', this.resetInactivityTimer);
        window.addEventListener('keydown', this.resetInactivityTimer);

        const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

        // Order tickets by ticket_price in ascending order (lowest to highest)
        tickets.sort((a, b) => {
            // Move tickets with a ticket_price of 0 to the end
            if (a.ticket_price === 0 || a.ticket_price === 0.0 || a.ticket_price === 0.00) {
                return 1;
            }
            if (b.ticket_price === 0 || b.ticket_price === 0.0 || b.ticket_price === 0.00) {
                return -1;
            }

            // Otherwise, sort by ticket_price in ascending order
            return a.ticket_price - b.ticket_price;
        });

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

        console.log(routeStop1);

        this.tripId = TripID;

        const routeStop1Array = routeStop1 === 'null' || !routeStop1 ? [] : routeStop1.split('\r\n').filter(item => item !== 'null');
        const routeStop2Array = routeStop2 === 'null' || !routeStop2 ? [] : routeStop2.split('\r\n').filter(item => item !== 'null');

        this.INBOUND = INBOUND === 'true';
        this.routeArray = [routeStart, ...routeDest1Array, ...routeDest2Array, routeEnd].filter(Boolean);

        if (this.INBOUND) {
            this.StopArray = routeStop1Array;
            this.Start = this.routeArray[0];
            this.End = this.routeArray[this.routeArray.length - 1];
            localStorage.setItem("dest", this.End);
            console.log('Inbound', this.Start, this.End);
            localStorage.setItem('stopArray', JSON.stringify(this.StopArray));
        } else {
            this.StopArray = routeStop2Array;
            this.Start = this.routeArray[this.routeArray.length - 1];
            this.End = this.routeArray[0];
            localStorage.setItem("dest", this.End);
            console.log('Outbound', this.Start, this.End);
            localStorage.setItem('stopArray', JSON.stringify(this.StopArray));
        }
        console.log(INBOUND);
        this.updatePTags();

        this.updatePagination();

        this.setActiveZone(0);
    },
    computed: {
        // Compute the total capacity percentage
        getCapPercent() {
            const totalCap = this.paxSeated + this.paxStanding;
            return totalCap > 0 ? (this.paxTotal / totalCap) * 100 : 0;
        },
        randomSignal() {
            return this.$store.state.randomSignal;
        },
    },
    methods: {
        alight(count) {
            this.paxTotal = Math.max(this.paxTotal - count, 0);
            this.saveToLocalStorage();
        },
        saveToLocalStorage() {
            localStorage.setItem("paxTotal", this.paxTotal);
        },
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        },
        startInactivityTimer(InMotition) {
            // Check if the current route is 'ticketSelling'
            if (InMotition) {
                // Set inactivity timer to redirect after 30 seconds
                this.inactivityTimer = setTimeout(() => {
                    this.$router.push({ path: '/vehicleInMotition' });
                }, 30000); // 30 seconds
            }
        },

        resetInactivityTimer() {
            // Clear the previous timer and restart the countdown
            clearTimeout(this.inactivityTimer);
            if (this.$route.name === 'ticketSelling') {
                this.startInactivityTimer(true);
            }
        },

        updatePTags() {
            const trackingImg = document.getElementById('Tracking');
            const dontLog = localStorage.getItem('dontLog');
            if (!dontLog) {
                trackingImg.src = 'https://live.staticflickr.com/65535/54264871386_d81d4d41d3_o_d.png';
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

                this.play('this is, ' + this.StopArray[this.currentIndexStop] + '. Next stop, ' + this.StopArray[this.currentIndexStop + 1])
            }
        },

        updateToTag() {
            const toElement = document.getElementById('To');
            if (toElement && this.routeArray.length > 0) {
                toElement.textContent = this.routeArray[this.currentIndexTo];
                localStorage.setItem("dest", this.routeArray[this.currentIndexTo]);
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
        play(text) {
            const isTTSMuted = localStorage.getItem('muteTTS') === 'true';
            if (!isTTSMuted) {
                if ('speechSynthesis' in window) {
                    // Replace "opp" with "opposite" before speaking
                    text = text.replace(/\bM - \b/gi, "");
                    text = text.replace(/\badj\b/gi, "adjacent to, ");
                    text = text.replace(/\bPH\b/gi, "pub, ");
                    text = text.replace(/\bopp\b/gi, "opposite, ");

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

            // Filter tickets by ticketer_cat
            this.filteredTickets = this.tickets
                .filter(ticket => ticket.ticketer_cat === selectedZone)
                .sort((a, b) => {
                    // Move tickets with a ticket_price of 0 to the end
                    if (a.ticket_price === 0 || a.ticket_price === 0.0 || a.ticket_price === 0.00) {
                        return 1;
                    }
                    if (b.ticket_price === 0 || b.ticket_price === 0.0 || b.ticket_price === 0.00) {
                        return -1;
                    }

                    // Otherwise, sort by ticket_price in ascending order
                    return a.ticket_price - b.ticket_price;
                });

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
                if (t.id !== ticket.id) {
                    t.count = 0;
                }
            });
            const targetTicket = this.filteredTickets.find(t => t.id === ticket.id);
            if (targetTicket) {
                targetTicket.count = (targetTicket.count || 0) + 1;  // Ensure count is a number
                this.totalPrice = targetTicket.ticket_price * targetTicket.count;
                this.totalPrice = this.totalPrice.toFixed(2)
                if (targetTicket.count > 1) {
                    document.getElementById('ticketName').textContent = '£' + targetTicket.ticket_price.toFixed(2) + ' ' + targetTicket.ticketer_name + ' X' + targetTicket.count;
                } else {
                    document.getElementById('ticketName').textContent = '£' + targetTicket.ticket_price.toFixed(2) + ' ' + targetTicket.ticketer_name;
                }
                document.getElementById('issue').style.zIndex = '3';
                document.getElementById('issue').style.backgroundColor = this.getBackgroundColour();
                document.getElementById('issue').style.color = '#ffffff';
                document.getElementById('issue').textContent = '£' + this.totalPrice;
            }
        },
        decreaseCount(ticket) {
            const targetTicket = this.filteredTickets.find(t => t.id === ticket.id);
            if (targetTicket && targetTicket.count > 0) {
                targetTicket.count = (targetTicket.count || 0) - 1;  // Ensure count is a number
                if (targetTicket.count > 1) {
                    document.getElementById('ticketName').textContent = '£' + targetTicket.ticket_price.toFixed(2) + ' ' + targetTicket.ticketer_name + ' X' + targetTicket.count;
                } else {
                    document.getElementById('ticketName').textContent = '£' + targetTicket.ticket_price.toFixed(2) + ' ' + targetTicket.ticketer_name;
                }
                this.totalPrice = targetTicket.ticket_price * targetTicket.count;
                this.totalPrice = this.totalPrice.toFixed(2)
                document.getElementById('issue').style.zIndex = '3';
                document.getElementById('issue').style.backgroundColor = this.getBackgroundColour();
                document.getElementById('issue').style.color = '#ffffff';
                document.getElementById('issue').textContent = '£' + this.totalPrice;
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
            // Ensure the array to store ticket data exists
            if (!this.ticketDataArray) {
                this.ticketDataArray = [];
            }

            // Loop through filtered tickets to find and handle the selected ticket
            this.filteredTickets.forEach(t => {
                if (t.count > 0) {
                    this.ticketName = t.ticket_name;
                    this.ticketPrice = t.ticket_price;
                    this.totalPax = t.count;

                    let randomSignal = localStorage.getItem("randomSignal");

                    // Loop through the count of passengers to add multiple tickets
                    for (let i = 0; i < t.count; i++) {

                        randomSignal = randomSignal - 1;

                        localStorage.setItem("randomSignal", randomSignal);

                        // Prepare the ticket data to be added to the array
                        const currentDate = new Date();
                        const currentDateTime = currentDate.toISOString().split('.')[0];
                        const soldAt = this.StopArray[this.currentIndexStop];
                        const routeNumber = localStorage.getItem('selectedRouteRouteNum');
                        const data = {
                            saleTime: currentDateTime,
                            route_number: routeNumber,
                            ticket_name: this.ticketName,
                            ticket_price: this.ticketPrice,
                            soldAt: soldAt,
                            tripID: this.tripId,
                        };

                        // Add the ticket data to the array
                        this.ticketDataArray.push(data);
                    }
                }
            });

            // Reset ticket counts after processing
            this.filteredTickets.forEach(t => {
                t.count = 0;
            });

            // Update the passenger total in localStorage
            this.paxTotal = parseInt(localStorage.getItem("paxTotal") || 0);
            this.paxTotal += this.totalPax;  // Adjust if needed (you can also add t.count here if you want to track total passengers)
            localStorage.setItem("paxTotal", this.paxTotal);

            // Save the array to localStorage as a JSON string
            localStorage.setItem('ticketDataArray', JSON.stringify(this.ticketDataArray));

            // Log the array to the console for debugging
            console.log(JSON.stringify(this.ticketDataArray));

            // Update UI
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
html,
body,
template,
#app {
    touch-action: manipulation;
}

button {
    touch-action: manipulation;
}

.Zones .zone {
    background-color: #004ab9;
    color: white;
    display: inline-block;
    padding: 5px;
    padding-top: 5px;
    min-width: 100px;
    text-align: center;
    scroll-snap-align: center;
    cursor: pointer;
    padding-top: 2%;
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
    top: calc(25vh - 5px);
    height: 5vh;
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
    background: #004ab9;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    overflow-x: scroll;
    gap: 5px;
    scroll-snap-type: x mandatory;
    padding: 0 20px;
    width: calc(90% - 60px);
    margin-left: calc(5% + 5px);
    height: 5vh;
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
    top: 19vh;
    color: #828182;
    font-size: 2vh;
}

.tickets {
    display: grid;
    grid-template-columns: repeat(2, 6fr);
    gap: 5px;
    position: fixed;
    width: calc(100vw - 20px);
    left: 10px;
    right: 10px;
    top: 30vh;
    bottom: calc(20vh + 10px);
    font-size: 2vh;
}

.ticket1 {
    height: 15vh;
    text-align: center;
    background-color: #ffffff;
}

.ticket {
    height: 15vh;
    text-align: center;
    background-color: #c5c2c5;
}

.ticket .count p {
    margin: 10px;
}

.ticket .count {
    display: inline-block;
    margin: -20px 20px;
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
    background-color: white;
    border-top: 5px solid white;
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

.issueALIGHT {
    background: #c5c2c5;
    color: #ffffff;
    font-size: 2.5vh;
    position: fixed;
    width: 50vw;
    left: 25vw;
    height: 7.5vh;
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
    margin-left: 30px;
}

.tag {
    position: fixed;
    left: 5px;
    background-color: #c5c2c5;
    color: black;
    text-orientation: mixed;
    text-align: center;
    writing-mode: vertical-rl;
    font-size: 1.5vh;
    transform: rotate(180deg);
}

.tag1 {
    top: 5px;
}

.tag2 {
    top: calc(6vh + 10px);
}

.tag3 {
    top: calc(12vh + 15px);
}

.stops {
    position: fixed;
    top: 5px;
    left: 5px;
    right: 5px;
    z-index: 10;
    /* Ensures it stays on top of other content */
}

.stop {
    right: 5px;
    position: relative;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 6vh;
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
    font-size: 2vh;
    text-align: center;
    color: white;
    margin-top: 2vh;
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