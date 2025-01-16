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
        const selectedCompany = localStorage.getItem('selectedCompany');
        const storedVehicles = localStorage.getItem('fleets');

        console.log(storedVehicles);

        if (storedVehicles) {
            try {
                this.vehicles = JSON.parse(storedVehicles); // Parse the stored vehicles
                this.filterVehicles(selectedCompany);
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
                    (vehicle) => vehicle.operator_code === companyCode
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
            console.log(`Selected Vehicle: ${vehicle.id} | ${vehicle.reg} | ${vehicle.fleet_number}`);
        },
        submitTrip() {
            const dontLog = localStorage.getItem('dontLog');

            if (dontLog == true) {
                this.$router.push({ path: `/ticketSelling` });
            } else {

                // Get current date and time
                const currentDate = new Date();
                const currentDateTime = currentDate.toISOString().split('T')[0]; // Convert to ISO string format

                // Get the start time from localStorage and set it
                const startTime = localStorage.getItem('startTime');

                // Get route number from localStorage
                const routeNumber = localStorage.getItem('selectedRouteRouteNum');

                // Get end destination from localStorage
                const endDestination = localStorage.getItem('selectedEndDestination');

                // Get vehicle ID from localStorage
                const vehicleId = localStorage.getItem('selectedVehicle');

                // Get route ID from localStorage
                const routeId = localStorage.getItem('selectedRoute');

                // Get current stop based on INBOUND value
                const isInbound = JSON.parse(localStorage.getItem('INBOUND')); // Assuming true/false value
                // Get the current stop
                const currentStop = isInbound
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
