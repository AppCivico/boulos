<template>
    <section class="certiface-verify" v-if="messages.length > 0">
      <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>
      <div v-html="messages[0].text"></div>
      <a :href="messages[1].href" class="donation-nav donation-nav--forward">{{ messages[1].text }}</a>
    </section>
</template>

<script>

  export default {
    name: 'certFaceVerify',
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
      goBack() {
        this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'boleto' });
      },
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
    },
    mounted() {
      this.scrollToDonate();
    },
  };
</script>
