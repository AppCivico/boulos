<template>
  <section class="certiface-verify">
    <h2>{{ candidate.popular_name }} agradece a sua doação</h2>

    <template v-for="(message, idx) in messages">
      <p v-if="message.type === 'link'" :key="idx + '--link'">
        <a :href="message.href" class="donation-nav donation-nav--forward">{{ message.text }}</a>
      </p>

      <div v-else-if="message.text" v-html="message.text" @click="delegation($event)" :key="idx" />

      <template v-if="idx === 0">
        <div class="input-wrapper field-for-copy__wrapper" v-if="isClipboardInaccessible" :key="idx + '--copy-field'">
          <label class="field-for-copy__label">
            Selecione e copie
          </label>
          <input class="field-for-copy" type="text" @click="selectContent($event)"
            readonly :value="pixKey" v-focus.select />
        </div>
        <DonationMeta class="donation-meta" :key="idx + '--meta'" />
      </template>
    </template>

    <p v-if="candidate.followers_activated">
      <a class="donation-nav donation-nav--forward" @click="scrollTo" href="#acompanhar">Acompanhar campanha</a>
    </p>
    <p v-if="candidate.reviews_activated">
      <a class="donation-nav donation-nav--forward" @click="scrollTo" href="#testemunhar">Testemunhar sobre {{
          candidate.popular_name
      }}</a>
    </p>
  </section>
</template>

<script>
import { scrollTo } from '../../utilities';
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
      isClipboardInaccessible: !navigator.clipboard,
      validation: {
        errors: {},
      },
    };
  },
  computed: {
    pixKey({ messages } = this) {
      let key = '';

      messages.every((x) => {
        const found = x.text.match(/(?:data-pix='(.+)')/i);
        if (found?.[1]) {
          key = found[1];
          return false;
        }
        return true;
      });

      return key;
    },
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
      return this.$store.getters.candidateWithProjectAndDonations;
    },
  },
  methods: {
    delegation({ target }) {
      if (target.hasAttribute('data-pix')) {
        navigator.clipboard.writeText(target.getAttribute('data-pix'))
          .then(() => {
            alert('Chave PIX copiada');
          }).catch((err) => {
            this.isClipboardInaccessible = true;
            throw err;
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
  },
};
</script>

<style lang="scss" scoped>
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

.field-for-copy__wrapper {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.field-for-copy {
  width: auto;
  margin-left: auto;
  margin-right: auto;
}

</style>
