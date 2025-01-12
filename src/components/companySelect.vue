<template>
    <div class="title">
        <h3>Select Company</h3>
        <p>User: {{ username }}</p>
    </div>
    <div class="titleButton">
        <button class="buttonLogOut" @click="logOff">LOG OFF</button>
    </div>
    <div class="options">
        <div v-for="company in companies" :key="company.id" class="option">
            <button @click="selectCompany(company.operator_name)">{{ company.operator_name }} | {{ company.operator_code }}</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '', // Variable to store the username
            companies: []  // Initialize companies array
        };
    },
    mounted() {
        const storedCompanies = localStorage.getItem('operators');
        if (storedCompanies) {
            this.companies = JSON.parse(storedCompanies); // Parse the stored data
        } else {
            console.error('No companies found in localStorage');
            // Optionally set a default set of companies if none are found
            this.companies = [
                { id: 1, operator_name: 'No Data Found', operator_code: '' }
            ];
        }
        // Get the username from localStorage if it exists
        this.username = localStorage.getItem('username') || 'Guest'; // Default to 'Guest' if no username is found
    },
    methods: {
        selectCompany(companyName) {
            // Optionally, do something with the selected company (e.g., store it)
            console.log(`Selected Company: ${companyName}`);
            // Store the selected company in localStorage if needed
            localStorage.setItem('selectedCompany', companyName);
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
        setUsername(newUsername) {
            // Set the new username in localStorage
            localStorage.setItem('username', newUsername);
            this.username = newUsername; // Update the username in the component
        }
    }
};
</script>

<style>
.options {
    position: fixed;
    top: calc(7.5vh + 10px);
    left: 10px;
    right: 10px;
    bottom: calc(10vh + 10px);
    overflow-y: scroll;
    padding-left: 10px;
}

.option {
  width: 100%;
  height: 5vh;
  margin-bottom: 10px;
}

.option button{
    font-size: 110%;
    height: 100%;
    width: 100%;
}

.title h3 {
    margin-top: 10px;
    margin-bottom: -10px;
}

.title {
    position: fixed;
    top: 0;
    left: 0;
    background: #282828;
    color: white;
    text-align: left;
    width: calc(75vw - 15px);
    padding-left: 10px;
    height: 7.5vh;
}

.buttonLogOut {
    position: fixed;
    top: 0;
    right: 0;
    height: 7.5vh;
    width: 25vw;
    border: 0;
    background: #004ab9;
    color: white;
    font-size: 150%;
}

.buttonLogOut:hover {
    background: #003c97;
}
</style>
