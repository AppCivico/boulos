<template>
  <div id="app">
    <Header v-if="$route.name === 'home'"/>
    <Menu v-if="$route.name === 'donors'"/>
    <div class="content-container">
      <router-view/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Menu from '@/components/layout/Menu';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Menu,
  },
  mounted() {
    this.handleSession();
    this.getReferral();
  },
  methods: {
    _getQueryString(url) {
      const queryString = url.indexOf('?') !== -1
        ? url.split('?')[1]
        : [];
      const params = {};
      const queries = queryString.indexOf('&') !== -1
        ? queryString.split('&')
        : [queryString];

      for (let i = 0; i < queries.length; i += 1) {
        const element = queries[i].indexOf('=') !== -1
          ? queries[i].split('=')
          : [queries[i], null];
        params[decodeURIComponent(element[0])] = decodeURIComponent(element[1] || '');
      }
      return params;
    },
    getReferral() {
      const referral = this._getQueryString(window.location.search).ref;

      if(referral) {
        this.$store.dispatch('ADD_REFERRAL', referral);
      }
    },
    handleSession() {
      if(window.localStorage) {
        const tokenName = (window.location.host === 'doeboulos.com.br' || window.location.host === 'test.doeboulos.com.br')
          ? 'prod_apm_token'
          : 'dev_apm_token';
        const token = localStorage.getItem(tokenName);
        if (token !== null) {
          this.$store.dispatch('ADD_TOKEN', token);
        } else {
          this.$store.dispatch('GET_TOKEN')
            .then((res) => {
              localStorage.setItem(tokenName, res.data.device_authorization_token_id);
            });
        }
      }
    }
  }
}
</script>


<style src="./stylesheets/index.scss" lang="scss"></style>
