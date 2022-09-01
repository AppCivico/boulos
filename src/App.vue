<template>
  <div id="app" :data-candidate="candidate && candidate.username ?
  candidate.username : null" :aria-busy="candidate && candidate.pending">
    <main v-if="!candidate" class="not-found">
      <header class="site-header">
        <div class="container">
          <div class="site-label">
            <h1>
              Página não encontrada
            </h1>
          </div>
        </div>
      </header>
    </main>
    <template v-else-if="!candidate.pending">
      <Header v-if="$route.name === 'home'" />
      <Menu v-if="$route.name === 'donors'" />
      <div class="content-container">
        <router-view :candidate-id="candidateId" />
      </div>
    </template>
    <Footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';
import Menu from '@/components/layout/Menu.vue';
import CONFIG from '@/config';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Menu,
  },
  computed: {
    candidateId() {
      switch (true) {
        case window.location.hostname === ('localhost'):
        case window.location.hostname.indexOf('192.168') === 0:
        case window.location.hostname.indexOf('dev.') === 0:
        case window.location.hostname.indexOf('test.') === 0:
        case window.location.hostname.indexOf('.local') > -1:
          return this.$route?.query?.candidate_id || CONFIG.candidateId;

        default:
          return CONFIG.candidateId;
      }
    },
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
  },
  mounted({ candidateId } = this) {
    this.handleSession();

    if (this.$route.query?.ref === '2exclusivo') {
      const cleanQuery = { ...this.$route.query };

      delete cleanQuery.ref;

      this.$router.replace({ query: cleanQuery });
    }

    this.GET_CANDIDATE_INFO(candidateId).finally(() => {
      this.$nextTick(() => {
        this.getReferral();
        this.$emit('updateHead');
        window.prerenderReady = true;
      });
    });
  },
  methods: {
    getReferral({ candidate } = this) {
      const referral = this.$route.query?.ref || candidate?.ref;

      if (referral === '2exclusivo') return;

      if (referral) {
        this.$store.commit('storeToState', { name: 'referral', data: referral });
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
    ...mapActions(['GET_CANDIDATE_INFO']),
  },
};
</script>

<style src="./stylesheets/index.scss" lang="scss"></style>
