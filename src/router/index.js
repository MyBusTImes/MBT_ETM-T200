import { createRouter, createWebHistory } from 'vue-router';
import LoadingScreen from '../components/LoadingScreen.vue';
import LoadingData from '../components/LoadingData.vue';
import blank from "../components/blank.vue";
import DriverLogin from "../components/Login.vue";
import LoadUserData from "../components/LoadingUserData.vue";
import CompanySelect from "../components/companySelect.vue";
import VehicleSelect from "../components/VehicleSelect.vue";
import dutySelect from "../components/dutySelect.vue";
import ticketSelling from "../components/ticketSelling.vue";
import optionsMenu from "../components/options.vue";
import RouteSelect from "../components/routeSelect.vue";
import messageSection from "../components/messages.vue";
import message from "../components/message.vue";
import vehicleInMotition from "../components/vehicleInMotion.vue";
import loadTicketData from "../components/loadTicketData.vue";
import passengerOccupany from "../components/passengerOccupany.vue";
import vehicleConfig from "../components/vehicleConfig.vue";
import tripSummary from "../components/tripSummary.vue";

const routes = [
  {
    path: '/',
    name: 'LoadingScreen',
    component: LoadingScreen,
  },
  {
    path: '/blank',
    name: 'blank',
    component: blank,
  },
  {
    path: '/loading-data',
    name: 'LoadingData',
    component: LoadingData,
  },
  {
    path: '/DriverLogin',
    name: 'DriverLogin',  // Make sure this name matches the component's name
    component: DriverLogin, // Ensure it's the correct imported component
  },
  {
    path: '/LoadUserData',
    name: 'LoadUserData',  // Make sure this name matches the component's name
    component: LoadUserData, // Ensure it's the correct imported component
  },
  {
    path: '/CompanySelect',
    name: 'CompanySelect',
    component: CompanySelect,
  },
  {
    path: '/VehicleSelect',
    name: 'VehicleSelect',
    component: VehicleSelect,
  },
  {
    path: '/RouteSelect',
    name: 'RouteSelect',
    component: RouteSelect,
  },
  {
    path: '/dutySelect',
    name: 'dutySelect',
    component: dutySelect,
  },
  {
    path: '/ticketSelling',
    name: 'ticketSelling',
    component: ticketSelling,
  },
  {
    path: '/optionsMenu',
    name: 'optionsMenu',
    component: optionsMenu,
  },
  {
    path: '/messageSection',
    name: 'messageSection',
    component: messageSection,
  },
  {
    path: '/message',
    name: 'message',
    component: message,
  },
  {
    path: '/vehicleInMotition',
    name: 'vehicleInMotition',
    component: vehicleInMotition,
  },
  {
    path: '/loadTicketData',
    name: 'loadTicketData',
    component: loadTicketData,
  },
  {
    path: '/passengerOccupany',
    name: 'passengerOccupany',
    component: passengerOccupany,
  },
  {
    path: '/vehicleConfig',
    name: 'vehicleConfig',
    component: vehicleConfig,
  },
  {
    path: '/tripSummary',
    name: 'tripSummary',
    component: tripSummary,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
