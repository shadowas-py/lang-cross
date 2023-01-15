import { createRouter, createWebHistory } from 'vue-router';
import SolveView from '@/views/SolveView.vue';
import EditView from '@/views/EditView.vue';

const routes = [
  {
    path: '/edit',
    name: 'editCrossword',
    component: EditView,
  },
  {
    path: '/solve',
    name: 'solveCrossword',
    component: SolveView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
