import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import Donors from './components/donors/Donors.vue';

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
