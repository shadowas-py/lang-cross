import { createRouter, createWebHistory } from 'vue-router';
import SolveView from '@/views/SolvePage.vue';
import HomeView from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/solve',
    name: 'solve',
    component: SolveView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
