<template>
  <section class="certiface-verify" v-if="messages.length > 0">
    <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>
    <div v-if="messages[0] && messages[0].text" v-html="messages[0].text"
    @click="delegation($event)"/>
    <a v-if="messages[1] && messages[1].href" :href="messages[1].href"
    target="_blank" class="donation-nav donation-nav--forward">{{
    messages[1].text }}</a>
  </section>
</template>

<script>

export default {
  name: 'certFaceVerify',
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
  },
  methods: {
    async copyTextToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        alert('Chave PIX copiada');
      } catch (err) {
        alert('Erro ao copiar a chave PIX: ', err);
      }
    },
    delegation({ target }) {
      if (target.hasAttribute('data-pix')) {
        this.copyTextToClipboard(target.getAttribute('data-pix'));
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
  },
};
</script>
