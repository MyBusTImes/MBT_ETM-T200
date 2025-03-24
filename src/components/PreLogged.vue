<template>
    <div>
        <div class="top">
            <b>
                <h3>Trips for Vehicle {{ vehicleId }}</h3>
            </b>
        </div>
        <div class="tripContainer">
            <div class="trip" v-for="trip in trips" :key="trip.trip_id" @click="selectTrip(trip)">
                <div class="headers">
                    <h3>Route</h3>
                    <h3>Destination</h3>
                    <h3>Time</h3>
                </div>
                <br>
                <div class="data">
                    <p>{{ trip.route_number || "N/A" }}</p>
                    <p>{{ trip.end_destination || "N/A" }}</p>
                    <p>{{ formatDateTime(trip.trip_date_time) }}</p>
                </div>
            </div>
        </div>
        <p v-if="!trips.length">No trips found for today.</p>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('routeSelect')">BACK</button>
        <button v-if="selectedTrip" class="startBT" style="width: 25vw;" @click="acceptTrip">
            ACCEPT
        </button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "PreLogged",
    data() {
        return {
            vehicleId: localStorage.getItem("selectedVehicle"), // Retrieve vehicle ID from local storage
            trips: [], // Array to store trips
            selectedTrip: null, // Store the selected trip
        };
    },
    mounted() {
        this.fetchTrips();
    },
    methods: {
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        },
        async fetchTrips() {
            if (!this.vehicleId) {
                console.error("Vehicle ID is not set.");
                return;
            }

            const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

            try {
                const response = await axios.get(
                    "https://api.mybustimes.cc/api/trip/",
                    {
                        params: {
                            vehicle_id: this.vehicleId, // Filter by vehicle ID
                            trip_date_time: today, // Filter by today's date
                        },
                    }
                );

                // Validate and store the response data
                if (response.data && Array.isArray(response.data.results)) {
                    // Filter trips for today's date
                    this.trips = response.data.results.filter((trip) =>
                        trip.trip_date_time.startsWith(today) // Check if the trip's date starts with today's date
                    );
                } else {
                    console.error("Unexpected response format", response.data);
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            return date.toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        selectTrip(trip) {
            this.selectedTrip = trip;
        },
        acceptTrip() {
            if (this.selectedTrip) {
                fetch(`https://api.mybustimes.cc/api/routes/?route_id=${this.selectedTrip.route_id}`)
                .then(response => response.json())
                .then(data => {
                    // Extract start and end destinations
                    const startDestination = data.results[0].start_destination || null;
                    const endDestination = data.results[0].end_destination || null;

                    // Set the start destination based on InBound status
                    this.startDest = this.selectedTrip.InBound == 1 ? startDestination : endDestination;

                    console.log(this.startDest);

                    // Set all the required data in localStorage, ensuring null values are handled
                    localStorage.setItem("TripID", this.selectedTrip.trip_id || null);
                    localStorage.setItem('startTime', this.selectedTrip.trip_date_time || null);
                    localStorage.setItem('selectedRouteNum', this.selectedTrip.route_number || null);
                    localStorage.setItem('selectedRouteStart', this.startDest || null);
                    localStorage.setItem('selectedRouteEnd', this.selectedTrip.end_destination || null);
                    localStorage.setItem('selectedRoute', this.selectedTrip.route_id || null);
                    localStorage.setItem('INBOUND', this.selectedTrip.InBound || null);
                    localStorage.setItem('currentIndexStop', 1);
                    localStorage.setItem('selectedRouteRouteNum', this.selectedTrip.route_number || null);

                    // Retrieve the routes stored in localStorage and parse it into an object
                    const storedRoutes = localStorage.getItem('routes');
                    const routes = storedRoutes ? JSON.parse(storedRoutes) : null;

                    // Find the route matching the selectedRoute ID, with fallback for null
                    const selectedRouteData = routes ? routes.find(route => route.route_id == this.selectedTrip.route_id) : null;

                    // If selectedRouteData exists, set the stop values, else set null
                    localStorage.setItem('selectedRouteStop1', selectedRouteData ? selectedRouteData.stop || null : null);
                    localStorage.setItem('selectedRouteStop2', selectedRouteData ? selectedRouteData.stop2 || null : null);

                    console.log(this.selectedTrip.trip_id, this.selectedTrip.trip_date_time, this.selectedTrip.route_number, this.selectedTrip.end_destination, this.selectedTrip.route_id, this.selectedTrip.InBound);
                    this.$router.push({ path: `/loadTicketData` });
                })
                .catch(error => console.error("Error fetching route details:", error));
            }
        }
    },
};
</script>

<style scoped>
.headers {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.headers h3 {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-size: 3vw;
}

.data {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.data p {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-weight: bold;
    font-size: 2.5vw;
}

.tripContainer {
    width: 100vw;
    overflow-y: auto;
    position: fixed;
    left: 0;
    top: 45px;
    bottom: 20vh;
}

.trip:hover {
    background-color: #ffce73;
}

.trip {
    background-color: #e6ebff;
    border-bottom: 2.5px solid gray;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.trip .headers,
.trip .data {
    width: 100%;
}

p {
    text-align: left;
    font-size: 1rem;
    color: #555;
}

.startBT:hover {
    background-color: #0056b3;
}
</style>
