import Vue from 'vue';
import VueRouter from 'vue-router';
import Donors from './components/donors/Donors.vue';
import Home from './views/Home.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/doadores',
      name: 'donors',
      component: Donors,
    },
  ],
});
