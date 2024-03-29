<template>
  <div class="donation-form" id="donation-form">
    <h2 v-if="!allowedPaymentMethods.length">
      Doações desabilitadas
    </h2>

    <template v-if="!allowedPaymentMethods.length">
      <div class="warning-panel" v-html="parseMD(candidate.disable_donations_message)"
      v-if="candidate && candidate.disable_donations_message" />
      <div v-else class="warning-panel">
        <p>
          Não é possível apoiar financeiramente essa campanha.
        </p>
        <p>
          Nossa democracia agradece o seu interesse.
        </p>
      </div>
    </template>

    <template v-else-if="paymentStep === 'selectValue'">
      <selectValue />
    </template>
    <template v-else-if="paymentStep === 'finalMessage'">
      <finalMessage />
    </template>
    <template v-else>
      <div class="donation-form-title" v-if="paymentStep !== 'printBoleto'">
        <h2>Você escolheu doar:</h2>
        <h2 v-if="amount">R$ {{ amount | formatBRLDec }}</h2>
      </div>
      <headSteps />
      <userData v-if="paymentStep === 'userData'" />
      <cardData v-if="paymentStep === 'cardData'" />
      <addressData v-if="paymentStep === 'boleto'" />
      <certFaceVerify v-if="paymentStep === 'certFaceVerify'" />
      <section :aria-busy="loading " v-if="loading"> verificando</section>
      <printBoleto v-if="paymentStep === 'printBoleto'" class="loading" />
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import addressData from '@/components/steps/addressData.vue';
import cardData from '@/components/steps/cardData.vue';
import certFaceVerify from '@/components/steps/certFaceVerify.vue';
import finalMessage from '@/components/steps/finalMessage.vue';
import headSteps from '@/components/steps/headSteps.vue';
import printBoleto from '@/components/steps/printBoleto.vue';
import selectValue from '@/components/steps/selectValue.vue';
import userData from '@/components/steps/userData.vue';
import { parseMD } from '../utilities';

export default {
  name: 'Payment',
  components: {
    selectValue,
    userData,
    cardData,
    finalMessage,
    addressData,
    certFaceVerify,
    printBoleto,
    headSteps,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    paymentStep() {
      return this.$store.state.paymentStep;
    },
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate || {};
    },
    amount() {
      return this.$store.state.amount;
    },
    allowedPaymentMethods() {
      return this.candidate?.allowed_payment_methods || ['credit_card', 'boleto'];
    },
  },
  mounted() {
    if (this.$route.query.donation_id) {
      this.toggleLoading();

      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'printBoleto' });
      const payload = {
        donationId: this.$route.query.donation_id,
      };
      this.$store.dispatch('START_DONATION_BOLETO', payload)
        .then(() => {
          this.toggleLoading();
          setTimeout(() => {
            const form = document.getElementById('donation-form');
            form.scrollIntoView();
          }, 1000);
        }, () => {
          setTimeout(() => {
            const form = document.getElementById('donation-form');
            form.scrollIntoView();
          }, 1000);
          this.toggleLoading();
        });
    }
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading;
    },
    goBack() {
      const step = this.paymentStep === 'userData' ? 'selectValue' : 'userData';
      this.$store.dispatch('CHANGE_PAYMENT_STEP', { step });
    },
    parseMD,
  },
};
</script>

<style>
.home__donate h2 {
  color: #ffffff;
}

</style>
