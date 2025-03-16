<template>
    <div class="terminal">
        <div class="data-loading">
            <h1>TICKETER</h1>
            <p>Please wait a few moments...</p>
        </div>
        <p v-if="loading" class="loading-text">Loading...</p>
    </div>
</template>

<style>
.hidden {
    height: 0px;
    display: none;
}

.terminal {
    margin-top: 10vh;
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    width: 80%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.terminal h1 {
    margin-bottom: 20px;
}

.terminal-view {
    height: 50px;
    font-size: 14px;
    overflow: hidden;
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 10vh;
    left: 0;
}

.terminal-line {
    text-align: center;
    width: 100%;
    padding: 5px 0;
}

.terminal-line-1 {
    text-align: center;
    width: 100%;
    padding: 5px 0;
}

.loading-text {
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
}
</style>

<script>
import axios from 'axios';

export default {
    name: 'LoadingUserData',
    data() {
        return {
            InMotition: false,
            companies: [],
            allRoutes: [],
            allFleets: [],
            visibleRoutes: [],
            visibleCompanies: [],
            visibleFleets: [],
            loading: true,
            companyIntervalId: null,
            routeIntervalId: null,
            fleetIntervalId: null,
            
        };
    },
    async mounted() {
        try {
            const username = localStorage.getItem('username');
            if (!username) {
                throw new Error('No username found in localStorage.');
            }

            // Fetch companies
            const ToResponse = await axios.get(`https://api.mybustimes.cc/api/conversation/`, {
                params: { format: 'json', to: username },
            });
            this.conversationsToUser = ToResponse.data.results || [];

            localStorage.setItem('UserToData', JSON.stringify(this.conversationsToUser));

            const FromResponse = await axios.get(`https://api.mybustimes.cc/api/conversation/`, {
                params: { format: 'json', From: username },
            });
            this.conversationsFromUser = FromResponse.data.results || [];

            localStorage.setItem('UserFromData', JSON.stringify(this.conversationsFromUser));

            localStorage.setItem('routes', JSON.stringify(this.allRoutes));
            
            const companyResponse = await axios.get('https://api.mybustimes.cc/api/operator-codes/', {
                params: { format: 'json', owner: username },
            });
            this.companies = companyResponse.data.results || [];

            localStorage.setItem('operators', JSON.stringify(this.companies));

            // Fetch routes and fleet for each company
            for (const company of this.companies) {
                await this.fetchRoutesForCompany(company);
                await this.fetchFleetForCompany(company.operator_code);
            }

            this.allRoutes = this.companies.flatMap(company => company.routes || []);
            localStorage.setItem('routes', JSON.stringify(this.allRoutes));

            localStorage.setItem('fleets', JSON.stringify(this.allFleets));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Failed to load data. Please try again later.');
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async fetchRoutesForCompany(company) {
            try {
                const response = await axios.get('https://api.mybustimes.cc/api/routes/', {
                    params: { format: 'json', route_operator: company.operator_code },
                });
                company.routes = response.data.results || [];
            } catch (error) {
                console.error(`Failed to fetch routes for ${company.operator_name}:`, error);
            }
        },
        async fetchFleetForCompany(operatorCode) {
            try {
                const response = await axios.get('https://api.mybustimes.cc/api/fleets/', {
                    params: { format: 'json', operator_code: operatorCode },
                });
                this.allFleets.push(...response.data.results);
            } catch (error) {
                console.error(`Failed to fetch fleet for operator ${operatorCode}:`, error);
            }
        }
    },
    beforeUnmount() {
        if (this.companyIntervalId) clearInterval(this.companyIntervalId);
        if (this.routeIntervalId) clearInterval(this.routeIntervalId);
        if (this.fleetIntervalId) clearInterval(this.fleetIntervalId);
    },
};
</script>
