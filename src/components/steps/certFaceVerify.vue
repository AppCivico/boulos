<template>
  <section class="certiface-verify">
    <h2>{{ candidate.popular_name }} agradece a sua doação</h2>

    <template v-for="(message, idx) in messages">
      <p v-if="message.type === 'link'" :key="idx + '--link'">
        <a :href="message.href" class="donation-nav donation-nav--forward">{{ message.text }}</a>
      </p>

      <div v-else v-html="message.text" @click="delegation($event)" :key="idx" />

      <DonationMeta v-if="idx === 0" class="donation-meta" :key="idx + '--meta'" />
    </template>

    <p v-if="candidate.followers_activated">
      <a class="donation-nav donation-nav--forward" @click="scrollTo"
      href="#acompanhar">Acompanhar campanha</a>
    </p>
    <p v-if="candidate.reviews_activated">
      <a class="donation-nav donation-nav--forward" @click="scrollTo"
      href="#testemunhar">Testemunhar sobre {{ candidate.popular_name }}</a>
    </p>
  </section>
</template>

<script>
import { copyTextToClipboard, scrollTo } from '../../utilities';
import DonationMeta from '../DonationMeta.vue';

export default {
  name: 'certFaceVerify',
  components: {
    DonationMeta,
  },
  data() {
    return {
      loading: false,
      dataBusyMessage: '',
      errorMessage: '',

      validation: {
        errors: {},
      },
    };
  },
  computed: {
    donor_names() {
      return this.$store.state.donor_names;
    },
    messages() {
      return this.$store.state.messages;
    },
    candidate() {
      return this.getMergeCandidate.candidate;
    },
    getMergeCandidate() {
      return this.$store.getters.generateCandidateObject;
    },
  },
  methods: {
    delegation({ target }) {
      if (target.hasAttribute('data-pix')) {
        this.copyTextToClipboard(target.getAttribute('data-pix'))
          .then(() => {
            alert('Chave PIX copiada');
          }).catch((err) => {
            alert('Seu navegador não permitiu a cópia da chave PIX! ', err);
          });
      }
    },
    goBack() {
      this.$emit('go-back');
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'boleto' });
    },

    toggleLoading(message = '') {
      this.loading = !this.loading;

      this.dataBusyMessage = this.dataBusyMessage !== message ? message : '';
    },
    handleErrorMessage(err) {
      if (err) {
        this.errorMessage = err.message || err.name || (err.data && err.data[0] ? err.data[0].message : err);
      }
    },
    scrollTo,
    copyTextToClipboard,
  },
};
</script>

<style lang="scss">
  .certiface-verify p {
    &::before,
    &::after {

      display: table;

      border-collapse: collapse;

      content: '';
    }

    &::after {
      clear: both;
    }
  }
</style>
