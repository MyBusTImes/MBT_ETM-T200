<template>
    <div class="terminal">
        <div class="data-loading">
            <h1>TICKETER</h1>
            <p>Please wait a few moments...</p>
        </div>
        <p v-if="loading" class="loading-text">Loading...</p>
        <div class="terminal-view">
            <div class="hideme">
                <div v-for="(companies, index) in visibleCompanies" :key="index" class="terminal-line-1">
                    {{ companies.operator_name }} | {{ companies.operator_code }}
                </div>
            </div>
            <div class="hideme1">
                <div v-for="(route, index) in visibleRoutes" :key="index" class="terminal-line">
                    {{ route.route_num }} | {{ route.start_destination }} | {{ route.route_operator }}
                </div>
            </div>
            <div v-for="(fleet, index) in visibleFleets" :key="index" class="terminal-line">
                {{ fleet.reg }} | {{ fleet.fleet_number }} | {{ fleet.operator_code }}
            </div>
        </div>
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
    width: 50%;
    left: calc(25%);
    bottom: 100px;
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

            this.startScrollingCompanies();
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
        },
        startScrollingCompanies() {
            let startIndex = 0;
            this.companyIntervalId = setInterval(() => {
                if (startIndex + 4 <= this.companies.length) {
                    this.visibleCompanies = this.companies.slice(startIndex, startIndex + 4);
                    startIndex++;
                } else {
                    if (!this.routesScrolling) {
                        this.routesScrolling = true;
                        document.querySelector('.hideme').style.display = 'none';
                        setTimeout(() => this.startScrollingRoutes(), 1000);
                    }
                }
            }, 100);
        },
        startScrollingRoutes() {
            let startIndex = 0;
            this.routeIntervalId = setInterval(() => {
                if (startIndex + 4 <= this.allRoutes.length) {
                    this.visibleRoutes = this.allRoutes.slice(startIndex, startIndex + 4);
                    startIndex++;
                } else {
                    if (!this.fleetScrolling) {
                        this.fleetScrolling = true;
                        document.querySelector('.hideme1').style.display = 'none';
                        setTimeout(() => this.startScrollingFleets(), 1000);
                    }
                }
            }, 25);
        },
        startScrollingFleets() {
            let startIndex = 0;
            this.fleetIntervalId = setInterval(() => {
                if (startIndex + 4 <= this.allFleets.length) {
                    this.visibleFleets = this.allFleets.slice(startIndex, startIndex + 4);
                    startIndex++;
                } else {
                    this.$router.push({ path: `/CompanySelect` });
                }
            }, 25);
        },
    },
    beforeUnmount() {
        if (this.companyIntervalId) clearInterval(this.companyIntervalId);
        if (this.routeIntervalId) clearInterval(this.routeIntervalId);
        if (this.fleetIntervalId) clearInterval(this.fleetIntervalId);
    },
};
</script>
