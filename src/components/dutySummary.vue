<template>
  <div style="overflow-y: scroll; height: calc(80vh - 10px);">
    <h2>Trips with Matching TripID</h2>
    <div class="top" v-if="filteredTrips.length > 0">
      <h3><strong>Total Passengers:</strong> {{ totalPassengers }} | <strong>Total Amount:</strong> £{{ totalAmount.toFixed(2) }}</h3>
    </div>
    <div v-if="filteredTrips.length > 0" class="tripContainer">
      <div class="trip" v-for="(trip, index) in filteredTrips" :key="index">
        <div class="headers">
          <h3>Sale Time</h3>
          <h3>Route</h3>
          <h3>Ticket Name</h3>
          <h3>Ticket Price</h3>
          <h3>Sold At</h3>
        </div>
        <br>
        <div class="data">
          <p>{{ formatSaleTime(trip.saleTime) }}</p>
          <p>{{ trip.route_number }}</p>
          <p>{{ trip.ticket_name }}</p>
          <p>£{{ trip.ticket_price.toFixed(2) }}</p>
          <p>{{ trip.soldAt }}</p>
        </div>
      </div>
    </div>
    <!-- Show a message if no matching trips are found -->
    <p v-else>No trips found for the selected TripID.</p>
  </div>
  <div class="buttons" style="margin-top: 10px; text-align: centre;">
    <button class="optionBT" @click="gotTo('optionsMenu')">BACK</button>
  </div>
</template>


<script>
export default {
  name: "tripSummary",
  data() {
    return {
      ticketDataArray: JSON.parse(localStorage.getItem('ticketDataArray')) || [],
      //TripID: localStorage.getItem('TripID'),
    };
  },
  computed: {
    filteredTrips() {
      // Just return the entire ticketDataArray without filtering by TripID
      return this.ticketDataArray;
    },
    totalPassengers() {
      // Return the total number of passengers by counting the length of filteredTrips
      return this.filteredTrips.length;
    },
    totalAmount() {
      // Calculate the total amount by summing up the ticket prices
      return this.filteredTrips.reduce((total, trip) => total + parseFloat(trip.ticket_price), 0);
    }
  },
  methods: {
    formatSaleTime(saleTime) {
      // Format the sale time (if it's a valid date string)
      const date = new Date(saleTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
      return saleTime; // If invalid, return the raw string
    },
    gotTo(page) {
      this.$router.push({ path: '/' + page });
    }
  }
};
</script>


<style scoped>
.headers {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.headers h3 {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-size: 3vw;
}

.data {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.data p {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-weight: bold;
    font-size: 2.5vw;
}

.tripContainer {
    width: 100vw;
    overflow-y: auto;
    position: fixed;
    left: 0;
    top: 45px;
    bottom: 20vh;
}

.trip:hover {
    background-color: #ffce73;
}

.trip {
    background-color: #e6ebff;
    border-bottom: 2.5px solid gray;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.trip .headers,
.trip .data {
    width: 100%;
}

p {
    text-align: left;
    font-size: 1rem;
    color: #555;
}

.startBT:hover {
    background-color: #0056b3;
}
</style>