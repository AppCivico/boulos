<template>
  <section>
    <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>
    <h2>{{ candidate.popular_name }} agradece a sua colaboração</h2>

    <template v-for="(message, idx) in messages">
      <p v-if="message.type === 'link'" :key="idx + '--link'" class="input-wrapper">
        <a target="_blank" :href="message.href" class="donation-nav donation-nav--forward">{{ message.text }}</a>
      </p>

      <div v-else class="input-wrapper" v-html="message.text" :key="idx" />

      <DonationMeta v-if="idx === 0" class="donation-meta" :key="idx + '--meta'" />
    </template>

    <p>Contamos com você para batermos juntos essa meta e agora temos um desafio:
      <strong>TRAZ MAIS 1</strong>! Se cada pessoa que contribuiu trouxer mais um amigo para doar,
      conseguiremos bater a meta! Topa dar mais essa força pra gente? Compartilhe seu
      apoio nas redes sociais.
    </p>

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
import { mapState } from 'vuex';
import DonationMeta from '../DonationMeta.vue';

export default {
  name: 'finalMessage',
  components: {
    DonationMeta,
  },
  computed: {
    candidate() {
      return this.getMergeCandidate.candidate;
    },
    getMergeCandidate() {
      return this.$store.getters.generateCandidateObject;
    },
    ...mapState(['messages']),
  },
  mounted() {
    const form = document.getElementById('donation-form');
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
