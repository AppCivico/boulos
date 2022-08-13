<template>
  <div class="ticket-form" :aria-busy="Object.keys(candidate).length === 0 ? 'true' : 'false'">
    <h2>Acompanhar campanha</h2>
    <section v-if="step === 'intro'" class="content">
      <form @submit.prevent="step = 'userData'">
        <p>
          Gostaria de acompanhar a campanha {{ candidatePreposition }}
          <strong>{{ candidate.popular_name }}</strong>?
        </p>

        <button type="submit">
          Prosseguir
        </button>
      </form>
    </section>

    <userData v-if="step === 'userData'" :form-action="'follow'" @go-ahead="step = 'addressData'" @go-back="step = 'intro'" />

    <addressData v-if="step === 'addressData'" :form-action="'follow'" @go-back="step = 'userData'"
      @go-ahead="step = 'finalMessage'" />

    <p class="form__disclaimer" v-if="['intro', 'finalMessage'].indexOf(step) === -1">
      Todos os dados serão utilizados exclusivamente na campanha eleitoral de
      2022 {{ candidatePreposition }} <strong>{{ candidate.popular_name
      }}</strong> para o envio de informativos via correspondência, e-mail,
      telefone, SMS, WhatsApp ou Telegram. A qualquer momento você poderá
      solicitar a remoção dos seus dados pessoais para o uso da campanha. Leia
      nosso <a :href="CONFIG.ToS" target="_blank">termo de uso e privacidade de
      dados</a> para mais informações.
    </p>

    <template v-if="step === 'finalMessage'">
      <p v-if="candidate.followers_optin_message">
        {{ followers_optin_message }}
      </p>
      <template v-else>
        <p>
          Obrigado!
        </p>

        <p>
          Agora você poderá acompanhar as novidades na campanha
          {{ candidatePreposition }}
          <strong>{{ candidate.popular_name }}</strong>.
        </p>
      </template>

      <p>
        A qualquer momento você pode solicitar para que não seja mais enviado
        nenhum comunicado para você, basta solicitar via e-mail para <a
        :href="CONFIG.ToS" target="_blank">{{ candidate.popular_name }}</a> ou
        <button type="button" class="like-a__link"
        @click="stopToFollow()">solicitar por aqui</button>.
      </p>

      <p>
        Além de acompanhar, você também pode <a href="#doar">doar</a>!
      </p>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CONFIG from '../config';
import addressData from './steps/addressData.vue';
import userData from './steps/userData.vue';

export default {
  name: 'Follow',
  components: {
    userData,
    addressData,
  },
  data() {
    return {
      step: 'intro',

      loading: false,
      dataBusyMessage: '',
      CONFIG,
    };
  },
  computed: {
    email: {
      get() {
        return this.$store.state.email;
      },
      set(value) {
        this.storeToState({ name: 'email', data: value });
      },
    },
    candidate() {
      return this.getMergeCandidate.candidate;
    },
    getMergeCandidate() {
      return this.$store.getters.candidateWithProjectAndDonations;
    },
    ...mapGetters(['candidatePreposition']),
  },

  methods: {
    stopToFollow({ candidate, email } = this) {
      const emailFromPrompt = window.prompt('Qual o seu email?', email);

      if (!emailFromPrompt) return;

      const payload = {
        email: emailFromPrompt.trim(),
        candidate_id: candidate.id,
      };

      this.$store
        .dispatch('requestToUnfollowCandidate', payload)
        .then(() => {
          window.alert('Verifique seu e-mail para confirmar a solicitação.');
        })
        .catch((err) => {
          this.handleErrorMessage(err);
        });
    },

    toggleLoading(message = '') {
      this.loading = !this.loading;

      this.dataBusyMessage = this.dataBusyMessage !== message ? message : '';
    },
  },
};
</script>

<style>
.home__donate h2 {
  color: #ffffff;
}
</style>
