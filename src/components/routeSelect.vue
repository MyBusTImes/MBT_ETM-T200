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
            <button @click="selectRoute(Route)">{{ Route.route_num }} | {{ Route.start_destination }} | {{
                Route.end_destination }}</button>
        </div>
    </div>
    <div id="fade" style="display: none; position: fixed;top: 0;left: 0;right: 0;border: 0;background: #000000d1;width: 100%;height: 100%;/*! z-index: ; */">
        <button class="Close" @click="close()" style="padding: 2.55% 5%;">X</button>
    </div>
    <div class="popup"
        style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 50vw; height: 20vh; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
        <button class="button1 inOutBT">INBOUND</button><br>
        <button class="button2 inOutBT">OUTBOUND</button>
    </div>
    <div class="popup2"
        style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 50vw; height: 20vh; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
        <label for="">Select Terminus</label>
        <select style="width: 100%;border: 0;height: 20%;" v-model="selectedEndDestination">
            <option v-for="(destination, index) in endDestinations" :key="index" :value="destination">
                {{ destination }}
            </option>
        </select>
        <button class="button4 inOutBT">SET</button>
    </div>
    <div class="popup3"
        style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 50vw; height: 20vh; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
        <label for="startTime">Start Time</label><br>
        <input type="time" id="startTime" v-model="startTime" data-tempmail="17613"
            style="border: 0;width: 100%;text-align: center;height: 7.5vh;font-size: 2vh;">
        <button style="border-right: 5px solid white;" class="button3 inOutBT">SET</button><button style="border-left: 5px solid white;" class="button3 inOutBT" @click="dontLog()">DON'T LOG</button>
    </div>
</template>

<style>
.button3.inOutBT {
  display: inline-block;
  width: 50%;
}

.inOutBT {
    width: 100%;
    height: 50%;
}
</style>

<script>
export default {
    data() {
        return {
            startTime: '',
            username: '',
            routes: [],
            filteredRoutes: [],
            selectedEndDestination: '', // Variable for storing selected end destination
            endDestinations: [] // Array for storing split destinations
        };
    },
    mounted() {
        const selectedCompany = localStorage.getItem('selectedCompany');
        const storedRoutes = localStorage.getItem('routes');

        if (storedRoutes) {
            try {
                this.Routes = JSON.parse(storedRoutes); // Parse the stored Routes

                // Sort the routes by Route.route_num
                this.Routes.sort((a, b) => {
                    return a.route_num.localeCompare(b.route_num, undefined, { numeric: true, sensitivity: 'base' });
                });

                this.filterRoutes(selectedCompany);
            } catch (error) {
                console.error('Failed to parse fleets from localStorage:', error);
                this.Routes = []; // Fallback to an empty array
            }
        } else {
            console.error('No fleets found in localStorage');
            this.Routes = [];
        }

        this.username = localStorage.getItem('username') || 'Guest'; // Default to 'Guest' if no username is found
    },
    watch: {
        // Watch the selectedEndDestination and update localStorage when it changes
        selectedEndDestination(newValue) {
            // Store the selected destination in localStorage
            localStorage.setItem('selectedEndDestination', newValue);
        }
    },

    methods: {
        close() {
            location.reload(); 
        },
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
        dontLog() {
            this.$router.push({ path: '/VehicleSelect' });
            localStorage.setItem('dontLog', true);
        },
        selectRoute(Route) {
            // Split the stop and destination values into arrays
            const stop1Array = Route.start_destination;
            const stop2Array = Route.end_destination;
            const destination = Route.destination;
            const destination2 = Route.destination2;
            const destinationArray = destination === 'null' || !destination ? [] : destination.split(' - ').filter(item => item !== 'null');
            const destination2Array = destination2 === 'null' || !destination2 ? [] : destination2.split(' - ').filter(item => item !== 'null');

            this.endDestinations = [stop1Array, stop2Array, ...destinationArray, ...destination2Array];

            // Save the selected route information in localStorage
            localStorage.setItem('selectedRoute', Route.route_id);
            localStorage.setItem('selectedRouteStart', Route.start_destination);
            localStorage.setItem('selectedRouteEnd', Route.end_destination);
            localStorage.setItem('selectedRouteStop1', Route.stop);
            localStorage.setItem('selectedRouteStop2', Route.stop2);
            localStorage.setItem('selectedRouteRouteNum', Route.route_num);
            localStorage.setItem('selectedRouteDest1', Route.destination);
            localStorage.setItem('selectedRouteDest2', Route.destination2);

            // Show the popup
            const popup = document.querySelector('.popup');
            popup.style.display = 'block';

            const fade = document.getElementById('fade');
            fade.style.display = 'block';

            // Wait for user action
            const button1 = document.querySelector('.button1'); // Confirm button
            const button2 = document.querySelector('.button2'); // Cancel button
            const button3 = document.querySelector('.button3'); // Cancel button
            const button4 = document.querySelector('.button4'); // Cancel button

            const handleButton3Click = () => {
                button3.removeEventListener('click', handleButton3Click);
                localStorage.setItem('startTime', this.startTime);  // Use this.startTime instead of time.value
                console.log(this.startTime)
                this.$router.push({ path: '/VehicleSelect' });
            };

            const handleButton4Click = () => {
                button3.addEventListener('click', handleButton3Click);
                const popup3 = document.querySelector('.popup3');
                popup3.style.display = 'block';
                const popup2 = document.querySelector('.popup2');
                popup2.style.display = 'none';
                button4.removeEventListener('click', handleButton4Click);
            };

            const handleButtonClick = (event) => {
                const button = event.target;
                if (button.classList.contains('button1')) {
                    localStorage.setItem('INBOUND', true);
                    const popup2 = document.querySelector('.popup2');
                    popup2.style.display = 'block';
                    button4.addEventListener('click', handleButton4Click);
                } else if (button.classList.contains('button2')) {
                    localStorage.setItem('INBOUND', false);
                    const popup2 = document.querySelector('.popup2');
                    popup2.style.display = 'block';
                    button4.addEventListener('click', handleButton4Click);
                }

                // Hide popup and clean up event listeners
                popup.style.display = 'none';
                button1.removeEventListener('click', handleButtonClick);
                button2.removeEventListener('click', handleButtonClick);
            };

            button1.addEventListener('click', handleButtonClick);
            button2.addEventListener('click', handleButtonClick);
        },
        logOff() {
            // Redirect the user to a login page or home page (if needed)
            this.$router.push({ path: '/companySelect' });
        }
    }
};
</script>
