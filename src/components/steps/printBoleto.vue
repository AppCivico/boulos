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
        <a class="twitter" href="https://twitter.com/intent/tweet?text=Com%20Boulos%20e%20S%C3%B4nia%2C%20somos%20n%C3%B3s%20l%C3%A1!%20https%3A%2F%2Fdoeboulos.com%3Fref%3Dagradecimento">Compartilhar</a>
        </li>
        <li>
        <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdoeboulos.com%3Fref%3Dagradecimento&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
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
    username() {
      return this.$store.state.username;
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
      this.errorMessage = err.data[0].message;
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
