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
    </div>
</template>

<script>
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
            // Save vehicle selection in localStorage
            localStorage.setItem('selectedVehicle', vehicle.id);
            localStorage.setItem('currentIndexStop', 1);
            console.log(`Selected Vehicle: ${vehicle.id} | ${vehicle.reg} | ${vehicle.fleet_number}`);
            console.log(this.dead);
            this.$router.push({ path: `/RouteSelect` });
        },
        logOff() {
            // Redirect the user to a login page or home page (if needed)
            this.$router.push({ path: `/CompanySelect` });
        }
    }
};
</script>

<style></style>
