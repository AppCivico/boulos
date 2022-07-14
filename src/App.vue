<template>
  <div id="app">
    <v-style v-if="candidate.username" :src="styleSrc" />

    <Header v-if="$route.name === 'home'" />
    <Menu v-if="$route.name === 'donors'" />
    <div class="content-container">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import Menu from '@/components/layout/Menu.vue';
import { getQueryString } from './utilities';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Menu,

    'v-style': {
      render(createElement) {
        return createElement('style', this.$slots.default);
      },
    },
  },
  computed: {
    styleSrc({ candidate } = this) {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(`./stylesheets/themes/${candidate.username}.scss`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      return '';
    },
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
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
