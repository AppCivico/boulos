<template>
  <div class="ticket-form" :aria-busy="Object.keys(candidate).length === 0 ? 'true' : 'false'">
    <h2 v-if="testifyStep !== 'finalMessage'">Depoimento</h2>

    <form @submit.prevent="testifyStep = 'testify'" v-if="testifyStep === 'intro'" class="content">
      <p>
        Escreva um depoimento público para
        <strong>
          {{ candidate.popular_name }}
        </strong>
      </p>

      <button type="submit">
        Prosseguir
      </button>
    </form>

    <form v-else-if="testifyStep === 'testify'" @submit.prevent="testifyStep = 'userData'">
      <div class="input-wrapper">
        <label for="testimony">Depoimento</label>
        <textarea v-model="testimony" name="testimony" id="testimony" cols="30" rows="10"
          :maxlength="testimonyMaxLength" required v-focus></textarea>
        <span class="char-counter">
          <output class="char-counter__output" :class="{
            'char-counter__output--warning': charCount < 0,
            'char-counter__output--danger': charCount > testimonyMaxLength / -4 && charCount < 0
          }" for="testimony">{{ charCount }}</output>/{{ testimonyMaxLength }}
        </span>
      </div>

      <button type="submit" :disabled="!testimony">
        Prosseguir
      </button>
    </form>

    <userData v-else-if="testifyStep === 'userData'" :form-action="'testify'" @go-back="testifyStep = 'testify'"
      @go-ahead="testifyStep = 'addressData'" />

    <addressData v-else-if="testifyStep === 'addressData'" :form-action="'testify'" @go-back="testifyStep = 'userData'"
      @go-ahead="toTestify($event)" />

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <p class="form__disclaimer" v-if="['intro', 'finalMessage'].indexOf(testifyStep) === -1">
      A campanha eleitoral {{ candidatePreposition }} <strong>{{
        candidate.popular_name
        }}</strong>, nos termos da Lei Geral de Proteção de
      Dados (<abbr title="Lei Geral de Proteção de Dados">LGPD</abbr>), poderá
      usar seus dados para comunicar-se com você. Para saber mais detalhes, leia
      o <a :href="CONFIG.ToS" target="_blank">termo de uso e privacidade de
        dados</a>
    </p>

    <section v-if="testifyStep === 'finalMessage'" section class="final-message">
      <h2>
        Obrigad{{ candidateArticle || 'o' }} pelo seu depoimento.
      </h2>

      <template v-if="candidate.reviews_optin_message">
        {{ parseMD(candidate.reviews_optin_message) }}
      </template>

      <p class="wrap-share-buttons__before">Compartilhar:</p>

      <ul class="wrap-share-buttons">
        <li>
          <a class="twitter" target="_blank"
            :href="'https://twitter.com/intent/tweet?hashtags=VotoLegal&twitter&text=Eu%20apoiei%20' + candidate.popular_name + ',%20apoie%20você%20também!%20' + encodeURIComponent(location.href) + ''" />
        </li>
        <li>
          <a target="_blank"
            :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href) + '&src=sdkpreparse'"
            class="fb-xfbml-parse-ignore facebook" />
        </li>
      </ul>

      <p>
        <a class="donation-nav" href="#doar">Doar para campanha</a>
      </p>

      <p v-if="candidate.followers_activated">
        <a class="donation-nav" href="#acompanhar">
          Acompanhar campanha
        </a>
      </p>
    </section>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import CONFIG from '../config';
import { parseMD, scrollTo } from '../utilities';
import addressData from './steps/addressData.vue';
import userData from './steps/userData.vue';

export default {
  name: 'Testify',
  props: {
    formAction: {
      type: String,
      default: 'donate',
    },
  },
  components: {
    addressData,
    userData,
  },
  data() {
    return {
      location: window.location,
      loading: false,
      errorMessage: '',
      dataBusyMessage: '',
      testifyStep: 'intro',
      CONFIG,
      testimonyMaxLength: 512,
    };
  },
  watch: {
    testifyStep() {
      scrollTo('testemunhar');
    },
  },
  computed: {
    charCount({ testimony, testimonyMaxLength } = this) {
      return testimony.length > testimonyMaxLength / 2
        ? testimony.length - testimonyMaxLength
        : testimony.length;
    },
    testimony: {
      get() {
        return this.$store.state.testimony;
      },
      set(value) {
        this.storeToState({ name: 'testimony', data: value });
      },
    },
    candidate() {
      return this.getMergeCandidate.candidate;
    },
    getMergeCandidate() {
      return this.$store.getters.candidateWithProjectAndDonations;
    },

    ...mapGetters(['candidateArticle', 'candidatePreposition']),
  },

  methods: {
    toTestify(payload) {
      if (!payload.testimony) {
        payload.testimony = this.$store.state.testimony;
      }

      this.$store
        .dispatch('submitCandidateTestimony', payload)
        .then(() => {
          this.$emit('go-ahead');
          this.testifyStep = 'finalMessage';
        })
        .catch((err) => {
          this.handleErrorMessage(err);
        })
        .finally(() => {
          this.toggleLoading();
        });
    },
    handleErrorMessage(err) {
      this.errorMessage = err.data[0].message;
    },
    toggleLoading(message = '') {
      this.loading = !this.loading;

      this.dataBusyMessage = this.dataBusyMessage !== message ? message : '';
    },
    parseMD,
    ...mapMutations(['storeToState']),
  },
};
</script>

<style>
.home__donate h2 {
  color: #ffffff;
}
</style>
