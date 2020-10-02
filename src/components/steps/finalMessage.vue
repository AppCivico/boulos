<template>
  <section>
  <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>
    <div class="input-wrapper"
      v-for="(message, index) in messages"
      v-if="message.type == 'msg'"
      v-html="message.text" :key="index"></div>
    <div class="donation-nav-wrap">
      <div class="input-wrapper"
        v-for="(message, index) in messages"
        v-if="message.type == 'link'" :key="index">
        <a target="_blank" class="donation-nav donation-nav--block"
          :href="message.href" >
          {{ message.text }}
        </a>
      </div>
    </div>

    <p>Contamos com você para batermos juntos essa meta e agora temos um desafio:
    <strong>TRAZ MAIS 1</strong>! Se cada pessoa que contribuiu trouxer mais um amigo para doar,
    conseguiremos bater a meta! Topa dar mais essa força pra gente? Compartilhe seu
    apoio nas redes sociais.</p>

    <ul id="wrap-share">
      <li>
        <a class="twitter" href="https://twitter.com/intent/tweet?text=Com%20Boulos%20e%20Erundina%2C%20somos%20n%C3%B3s%20l%C3%A1!%20https%3A%2F%2Fdoeboulos.com%3Fref%3Dagradecimento">Compartilhar</a>
      </li>
      <li>
        <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdoeboulos.com%3Fref%3Dagradecimento&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore facebook">Compartilhar</a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'finalMessage',
  computed: {
    messages() {
      return this.$store.state.messages;
    },
  },
  mounted() {
    const form = document.getElementById('home__donate');
    form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    this.scrollToDonate();
  },
  methods: {
    scrollToDonate() {
      const form = document.getElementById('doar');
      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },
    redirectUser(ui) {
      if (ui.value === 'pay_with_cc') {
        this.$router.replace(this.$route.path);
        this.$store.dispatch('CHANGE_PAYMENT_STEP', {
          step: 'userData',
        });
      } else {
        sessionStorage.clear();
        window.open(ui.href);
      }
    },
    goBack() {
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'selectValue' });
    },
  },
};
</script>
