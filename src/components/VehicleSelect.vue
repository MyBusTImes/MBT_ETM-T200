<template>
    <div class="title">
        <h3>Select Vehicle</h3>
        <p>User: {{ username }}</p>
    </div>
    <div class="titleButton">
        <button class="buttonLogOut" @click="logOff">BACK</button>
    </div>
    <div class="options">
        <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="option">
            <button @click="selectVehicle(vehicle)">{{ vehicle.fleet_number }} | {{ vehicle.reg }}</button>
        </div>
        <div class="popup"
            style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 50vw; height: 10vh; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
            <button style="height: 100%;" class="button1 inOutBT" @click="submitTrip">START TRIP</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '', // Variable to store the username
            vehicles: [], // All vehicles from localStorage
            filteredVehicles: [] // Vehicles matching the selected company
        };
    },
    mounted() {
        const dead = localStorage.getItem('dead');
        const selectedCompany = localStorage.getItem('selectedCompany');
        const storedVehicles = localStorage.getItem('fleets');

        this.dead = dead;

        console.log(storedVehicles);

        if (storedVehicles) {
            try {
                this.vehicles = JSON.parse(storedVehicles); // Parse the stored vehicles
                this.filterVehicles(selectedCompany); // Filter vehicles based on selected company

                // Sort the filteredVehicles array
                this.filteredVehicles = this.filteredVehicles.sort((a, b) => {
                    return a.fleet_number.localeCompare(b.fleet_number, undefined, { numeric: true, sensitivity: 'base' });
                });
            } catch (error) {
                console.error('Failed to parse fleets from localStorage:', error);
                this.vehicles = []; // Fallback to an empty array
            }
        } else {
            console.error('No fleets found in localStorage');
            this.vehicles = [];
        }

        // Get the username from localStorage if it exists
        this.username = localStorage.getItem('username') || 'Guest'; // Default to 'Guest' if no username is found
    },


    methods: {
        filterVehicles(companyCode) {
            if (companyCode) {
                this.filteredVehicles = this.vehicles.filter(
                    (vehicle) => vehicle.operator_code === companyCode && vehicle.in_service === true
                );
            } else {
                console.error('No selected company found in localStorage');
                this.filteredVehicles = [];
            }
        },
        selectVehicle(vehicle) {
            const popup = document.querySelector('.popup');
            popup.style.display = 'block';

            // Save vehicle selection in localStorage
            localStorage.setItem('selectedVehicle', vehicle.id);
            localStorage.setItem('currentIndexStop', 1);
            console.log(`Selected Vehicle: ${vehicle.id} | ${vehicle.reg} | ${vehicle.fleet_number}`);
            console.log(this.dead);
        },
        submitTrip() {
            const dontLog = localStorage.getItem('dontLog');

            console.log(this.dead);
            if (dontLog === true) {
                this.$router.push({ path: `/ticketSelling` });
            } else if (this.dead) {
                console.log('not ah' + this.dead);
                const currentDate = new Date();
                const currentDateTime = currentDate.toISOString();
                const vehicleId = localStorage.getItem('selectedVehicle');
                const currentStop = 'dead';

                const data = {
                    trip_date_time: `${currentDateTime}`,
                    route_number: 'dead',
                    end_destination: '',
                    vehicle_id: vehicleId,
                    route_id: -1,
                    InBound: '',
                    current_stop: currentStop
                };

                console.log(data);
                axios.post('https://api.mybustimes.cc/api/trip/', data)
                    .then(response => {
                        console.log('Trip submitted successfully:', response.data);
                        localStorage.setItem('TripID', response.data.trip_id);
                        // Optionally, navigate to another page or show a success message
                        this.$router.push({ path: `/ticketSelling` });
                    })
                    .catch(error => {
                        console.error('Error submitting trip:', error);
                    });
            } else {
                console.log('AHHHHHHHH' + this.dead);

                const currentDate = new Date();
                const currentDateTime = currentDate.toISOString().split('T')[0]; // Convert to ISO string format
                const startTime = localStorage.getItem('startTime');
                const routeNumber = localStorage.getItem('selectedRouteRouteNum');
                const endDestination = localStorage.getItem('selectedEndDestination');
                const vehicleId = localStorage.getItem('selectedVehicle');
                const routeId = localStorage.getItem('selectedRoute');
                const dontLog = localStorage.getItem('dontLog');
                const isInbound = JSON.parse(localStorage.getItem('INBOUND')); // Assuming true/false value

                const currentStop = this.dead ? 'dead' : isInbound
                    ? localStorage.getItem('selectedRouteStop1')
                    : localStorage.getItem('selectedRouteStop2');

                // Split the current stop into an array using \r\n as the separator
                let stopArray = currentStop.split('\r\n');

                // Set the last item of the array as the active one
                const activeStop = stopArray[0];

                // Optionally, you can store this active stop back into localStorage if needed
                localStorage.setItem('activeRouteStop', activeStop);

                // Output or use the active stop as needed
                console.log(activeStop);


                // Prepare the data for the POST request
                const data = {
                    trip_date_time: `${currentDateTime} ${startTime}`,
                    route_number: routeNumber,
                    end_destination: endDestination,
                    vehicle_id: vehicleId,
                    route_id: routeId,
                    InBound: isInbound,
                    current_stop: activeStop
                };

                console.log(data);

                // Make POST request using axios
                if (dontLog !== 'true') {
                    axios.post('https://api.mybustimes.cc/api/trip/', data)
                        .then(response => {
                            console.log('Trip submitted successfully:', response.data);
                            localStorage.setItem('TripID', response.data.trip_id);
                            // Optionally, navigate to another page or show a success message
                            this.$router.push({ path: `/ticketSelling` });
                        })
                        .catch(error => {
                            console.error('Error submitting trip:', error);
                        });
                } else {
                    this.$router.push({ path: `/ticketSelling` });
                }
            }
        },
        logOff() {
            // Redirect the user to a login page or home page (if needed)
            this.$router.push({ path: `/RouteSelect` });
        }
    }
};
</script>

<style></style>
