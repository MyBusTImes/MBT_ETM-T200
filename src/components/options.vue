<template>
    <div class="MainButtons">
        <div class="inline">
            <button>LOCK</button>
            <button>PASSENGER<br>OCCUPANCY</button>
        </div>
        <div class="full">
            <button @click="endTrip">END TRIP</button>
        </div>
        <div class="inline">
            <button>DUTY SUMMARY</button>
            <button>TRIP SUMMARY</button>
        </div>
        <div class="full">
            <button @click="openMessages">MESSAGES</button>
        </div>
        <div class="full">
            <button @click="logOff">LOG OFF</button>
        </div>

    </div>
    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">BACK</button>
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
        navigateToOptions() {
            this.$router.push({ path: '/ticketSelling' });
        },
        openMessages() {
            this.$router.push({ path: '/messageSection' });
        },
        endTrip() {
            this.$router.push({ path: '/RouteSelect' });
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