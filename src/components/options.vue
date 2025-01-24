<template>
    <div class="MainButtons">
        <div class="inline">
            <button>LOCK</button>
            <button @click="logOff">LOG OFF</button>
        </div>
        <div class="full">
            <button @click="endTrip">END TRIP</button>
        </div>
        <div class="inline">
            <button @click="gotTo()">DUTY SUMMARY</button>
            <button @click="gotTo('tripSummary')">TRIP SUMMARY</button>
        </div>
        <div class="full">
            <button @click="gotTo('messageSection')">MESSAGES</button>
        </div>
        <div class="inline">
            <button @click="gotTo('scanTicket')">SCAN TICKET</button>
            <button @click="gotTo('passengerOccupany')">PASSENGER<br>OCCUPANCY</button>
        </div>
        <div class="full">
            
        </div>

    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('ticketSelling')">BACK</button>
        <button class="startBT" style="width: 25vw;" @click="gotTo('optionsMore')">MORE</button>
    </div>
</template>

<style>
body {
    margin-top: -50px
}

.inline {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
    display: inline-flex;
    margin-bottom: 10px
}

.inline button {
    width: calc(50% - 5px);
    margin-right: 5px;
    height: 7.5vh;
    font-size: 2vh;
}

.full {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 10px;
    display: block;
    margin-bottom: 10px
}

.full button {
    width: 100%;
    height: 7.5vh;
    font-size: 2vh;
}
</style>

<script>
export default {
    name: 'OptionsComponent',
    methods: {
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        },
        endTrip() {
            const keysToRemove = ['paxTotal', 'ticketDataArray', 'tickets', 'dead', 'dontLog', 'currentIndexStop', 'stopArray', 'selectedRouteEnd', 'selectedRouteDest1', 'selectedRouteDest2', 'selectedRouteStart', 'TripID', 'INBOUND', 'dontLog','selectedRoute', 'selectedEndDestination', 'selectedRouteRouteNum', 'startTime','selectedRouteStop1', 'selectedRouteStop2', 'activeRouteStop'];
            keysToRemove.forEach(key => localStorage.removeItem(key));
            localStorage.setItem('InMotition', false);

            this.$router.push({ path: '/RouteSelect' });
            const trackingImg = document.getElementById('Tracking');
            trackingImg.src = 'https://live.staticflickr.com/65535/54265089689_fcd864d237_o_d.png';
        },
        logOff() {
            // Clear localStorage (persists across sessions)
            localStorage.clear();

            // Clear sessionStorage (only persists during the session)
            sessionStorage.clear();

            // Optionally, clear cookies if needed (can be done in a loop for each cookie)
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.trim().replace(/^.+/, "") + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            });

            // Redirect the user to a login page or home page (if needed)
            window.location.href = '/DriverLogin'; // Or replace with your desired route
        },
    }
}
</script>