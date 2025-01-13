<template>
    <div class="title">
        <h3>Select Route</h3>
        <p>User: {{ username }}</p>
    </div>
    <div class="titleButton">
        <button class="buttonLogOut" @click="logOff">BACK</button>
    </div>
    <div class="options">
        <div v-for="Route in filteredRoutes" :key="Route.id" class="option">
            <button @click="selectRoute(Route)">{{ Route.route_num }} | {{ Route.start_destination }} | {{ Route.end_destination }}</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            routes: [],
            filteredRoutes: []
        };
    },
    mounted() {
        const selectedCompany = localStorage.getItem('selectedCompany');
        const storedRoutes = localStorage.getItem('routes');

        console.log(storedRoutes);

        if (storedRoutes) {
            try {
                this.Routes = JSON.parse(storedRoutes); // Parse the stored Routes
                this.filterRoutes(selectedCompany);
            } catch (error) {
                console.error('Failed to parse fleets from localStorage:', error);
                this.Routes = []; // Fallback to an empty array
            }
        } else {
            console.error('No fleets found in localStorage');
            this.Routes = [];
        }

        // Get the username from localStorage if it exists
        this.username = localStorage.getItem('username') || 'Guest'; // Default to 'Guest' if no username is found
    },

    methods: {
        filterRoutes(companyCode) {
            if (companyCode) {
                this.filteredRoutes = this.Routes.filter(
                    (Route) => Route.route_operator === companyCode
                );
            } else {
                console.error('No selected company found in localStorage');
                this.filteredRoutes = [];
            }
        },
        selectRoute(Route) {
            localStorage.setItem('selectedRoute', Route.route_id);
            localStorage.setItem('selectedRouteStart', Route.start_destination);
            localStorage.setItem('selectedRouteEnd', Route.end_destination);
            localStorage.setItem('selectedRouteStop1', Route.stop);
            localStorage.setItem('selectedRouteStop2', Route.stop2);
            localStorage.setItem('selectedRouteDest1', Route.destination);
            localStorage.setItem('selectedRouteDest2', Route.destination2);
            
            console.log(`Selected Route: ${Route.route_id} | ${Route.route_num} | ${Route.start_destination} | ${Route.end_destination}`);
            this.$router.push({ path: `/VehicleSelect` });
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
