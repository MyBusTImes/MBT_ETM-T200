<template>
    <div class="title">
        <h3>Select Duty</h3>
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
            localStorage.setItem('selectedVehicle', vehicle.id);
            console.log(`Selected Vehicle: ${vehicle.id} | ${vehicle.reg} | ${vehicle.fleet_number}`);
            this.$router.push({ path: `/dutySelect` });
            // Optionally navigate to another page or perform additional logic
        },
        logOff() {
            // Redirect the user to a login page or home page (if needed)
            this.$router.push({ path: `/companySelect` });
        }
    }
};
</script>

<style>

</style>
