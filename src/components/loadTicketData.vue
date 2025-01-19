<template>
    <div class="data-loading">
        <h1>TICKETER</h1>
        <p>Loading Ticket Data</p>
        <p>Please wait a few moments...</p>
    </div>
    <div>
        <!-- Loading Bar -->
        <div v-if="isLoading" class="loading-bar"></div>

        <!-- Content -->
        <div v-else>
            <!-- <ul>
                <li v-for="ticket in filteredTickets" :key="ticket.id">
                    {{ ticket.operator_code }} - {{ ticket.ticketer_cat }} - {{ ticket.ticketer_name }} - {{ ticket.ticket_name }} - {{ ticket.zone }}
                </li>
            </ul> -->
        </div>
    </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      tickets: [], // Store tickets in case you want to use them in the component
      isLoading: false, // Loading state
    };
  },
  computed: {
    // Computed property to filter tickets (e.g., remove null or invalid entries)
    filteredTickets() {
      return this.tickets.filter((ticket) => ticket !== null);
    },
  },
  methods: {
    async fetchTickets() {
      try {
        this.isLoading = true; // Start loading

        // Get the selected company from localStorage
        const selectedCompany = localStorage.getItem("selectedCompany");

        if (!selectedCompany) {
          console.error("No company selected in localStorage.");
          this.isLoading = false; // Stop loading
          return;
        }

        // Make the API call
        const response = await axios.get(
          "https://api.mybustimes.cc/api/tickets/",
          {
            params: {
              operator_code: selectedCompany,
            },
          }
        );

        // Get the ticket data
        const ticketData = response.data.results || []; // Ensure it's an array

        // Save the data to localStorage
        localStorage.setItem("tickets", JSON.stringify(ticketData));

        // Update component data
        this.tickets = ticketData;
        console.log("Tickets saved to localStorage:", ticketData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setTimeout(() => {
          this.isLoading = false; // Stop loading
          this.$router.push({ path: `/ticketSelling` });
        }, 5000);
      }
    },
  },
  mounted() {
    this.fetchTickets(); // Fetch tickets when the component is mounted
  },
};
</script>


<style>
/* Loading Bar Style */
.loading-bar {
    position: fixed;
    bottom: 10vh;
    width: 100%;
    height: 20px;
    background-color: #007bff;
    animation: loading 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes loading {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>