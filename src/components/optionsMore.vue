<template>
    <div class="MainButtons">
        <div class="full">
            <button @click="gotTo('vehicleConfig')">VEHICLE CONFIG</button>
        </div>
        <div class="full">
            <button @click="gotTo('LoadUserData')">RELOAD ALL DATA</button>
        </div>
    </div>
    <div class="full">
        <button @click="gotTo('announcements')">Announcements</button>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="gotTo('optionsMenu')">BACK</button>
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
    name: 'optionsMore',
    methods: {
        gotTo(page) {
            this.$router.push({ path: '/' + page });
        }
    }
}
</script>