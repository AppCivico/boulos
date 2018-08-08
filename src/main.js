import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import App from './App.vue';
import router from './router';
import store from './store';

import {
  formatBRL,
  formatBRLDec,
  formatDate,
  formatCNPJ,
  formatDateBasic,
  thousandsSeparator,
} from './utilities';

Vue.use(VueScrollTo);

Vue.config.productionTip = false;

Vue.filter('formatBRL', formatBRL);
Vue.filter('formatBRLDec', formatBRLDec);
Vue.filter('thousandsSeparator', thousandsSeparator);
Vue.filter('formatDate', formatDate);
Vue.filter('formatCNPJ', formatCNPJ);
Vue.filter('formatDateBasic', formatDateBasic);
Vue.filter('upperCase', value => value.toUpperCase());
Vue.filter('lowerCase', value => value.toLowerCase());

Vue.filter('date', (value) => {
  if (!value) return;
  const newDate = new Date(value.replace(' ', 'T'));
  return `${(newDate.getDate() <= 9) ? `0${newDate.getDate()}` : newDate.getDate()}/${((newDate.getMonth() + 1) <= 9) ? `0${(newDate.getMonth() + 1)}` : (newDate.getMonth() + 1)}/${newDate.getFullYear()} - ${(newDate.getHours() <= 9) ? `0${newDate.getHours()}` : newDate.getHours()}:${(newDate.getUTCMinutes() <= 9) ? `0${newDate.getUTCMinutes()}` : newDate.getUTCMinutes()}`;
});

Vue.filter('formatCPF', (value) => {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
});

Vue.filter('titleCase', str =>
  str
    .split(/\s+/)
    .map((item) => {
      if (item.length > 2) {
        if (item.toLowerCase() === 'dos') {
          return item.toLowerCase();
        }
        return item.charAt(0).toUpperCase() + item.substring(1).toLowerCase();
      }
      return item.toLowerCase();
    })
    .join(' '));

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

Vue.directive('focus', {
  inserted: (el, binding) => {
    if (binding.value || typeof binding.value === 'undefined') {
      el.focus();
    }
  },
});
