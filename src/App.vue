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
import { getQueryString } from './utilities';

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
    getReferral() {
      const referral = getQueryString(window.location.search).ref;

      if (referral) {
        this.$store.dispatch('ADD_REFERRAL', referral);
      }
    },
    handleSession() {
      if (window.localStorage) {
        const tokenName = process.env.VUE_APP_TOKEN_NAME;
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
    },
  },
};
</script>

<style src="./stylesheets/index.scss" lang="scss"></style>
