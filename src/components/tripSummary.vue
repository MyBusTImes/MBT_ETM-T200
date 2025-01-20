<template>
  <div style="overflow-y: scroll; height: calc(80vh - 10px);">
    <h2>Trips with Matching TripID</h2>
    <div v-if="filteredTrips.length > 0">
      <p><strong>Total Passengers:</strong> {{ totalPassengers }}</p>
      <p><strong>Total Amount:</strong> £{{ totalAmount.toFixed(2) }}</p>
    </div>
    <!-- Conditionally render only if filteredTrips has data -->
    <div v-if="filteredTrips.length > 0" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      <div v-for="(trip, index) in filteredTrips" :key="index"
        style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
        <p><strong>Sale Time:</strong> {{ trip.saleTime }}</p>
        <p><strong>Route Number:</strong> {{ trip.route_number }}</p>
        <p><strong>Ticket Name:</strong> {{ trip.ticket_name }}</p>
        <p><strong>Ticket Price:</strong> £{{ trip.ticket_price.toFixed(2) }}</p>
        <p><strong>Sold At:</strong> {{ trip.soldAt }}</p>
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
      TripID: localStorage.getItem('TripID'),
    };
  },
  computed: {
    filteredTrips() {
      // Guard against invalid or empty TripID and ticketDataArray
      if (!this.TripID || !Array.isArray(this.ticketDataArray)) {
        return []; // Return an empty array if there's no valid TripID or ticketDataArray
      }

      // Filter trips by matching TripID, ensuring both are the same type (string)
      const tripID = String(this.TripID); // Ensure TripID is a string
      return this.ticketDataArray.filter(trip => String(trip.tripID) === tripID);
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
    gotTo(page) {
      this.$router.push({ path: '/' + page });
    }
  }
};
</script>
