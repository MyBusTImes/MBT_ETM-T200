<template>
    <div class="data-loading">
        <h1>TICKETER</h1>
        <p>Please wait a few moments...</p>
    </div>
</template>

<script>
export default {
    name: 'LoadingData',

    mounted() {
        setTimeout(() => {
            this.redirect();
        }, 5000);
    },
    methods: {
        redirect() {
            this.$router.push({ path: `/DriverLogin` }); // Assuming target contains a valid route name
        }
    }
};
</script>

<style>
.data-loading {
    margin-top: 20vh;
}

.data-loading h1 {
    font-weight: 500;
}

.data-loading p {
    font-weight: 1;
}
</style>