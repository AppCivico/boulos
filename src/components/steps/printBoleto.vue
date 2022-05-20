<template>
    <section v-if="messages" class="certiface-verify">
      <a class="donation-nav donation-nav--rewind" @click.prevent="goBack" href="/#doar">voltar</a>
      <div class="instructions-donation">
        <h2 class="instructions">Pagamento boleto</h2>
      </div>
      <div class="input-wrapper"
        v-for="(message, index) in messages"
        v-if="message.type == 'msg'"
        v-html="message.text" :key="index"></div>

      <div class="donation-nav-wrap">
        <div class="input-wrapper"
          v-for="(message, index) in messages"
          v-if="message.type == 'link'" :key="index">
          <a target="_blank" class="donation-nav donation-nav--block"
            :href="message.href">
            {{ message.text }}
          </a>
        </div>
      </div>

      <ul id="wrap-share">
      <li>
        <a class="twitter"
          href="https://twitter.com/intent/tweet?text=Eu%20apoio%20Boulos%20%2C%20com%20honestidade%20e%20coragem%20para%20virar%20o%20jogo%20em%20SP.%20Fa%C3%A7a%20parte%20voc%C3%AA%20tamb%C3%A9m!%20https%3A%2F%2Fdoeboulos.com%2F%3Fref%3Dcompartilhamento">Compartilhar</a>
      </li>
      <li>
        <a target="_blank"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdoeboulos.com%2F%3Fref%3Dcompartilhamento&amp;src=sdkpreparse"
          class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
      </li>
      </ul>
    </section>
</template>

<script>

export default {
  name: 'printBoleto',
  data() {
    return {
      loading: false,
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
    scrollToDonate() {
      const form = document.getElementById('doar');
      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
    handleErrorMessage(err) {
      if (err) {
        this.errorMessage = err.message || err.name || (err.data && err.data[0] ? err.data[0].message : err);
      }
    },
    goBack() {
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'selectValue' });
    },
  },
  mounted() {
    this.scrollToDonate();
  },
};
</script>
