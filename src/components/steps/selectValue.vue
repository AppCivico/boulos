<template>
  <section class="content">
    <form @submit.prevent="validateForm()">
      <fieldset class="of-radios-and-checks">
        <div class="input-wrapper" v-for="pledge in pledges" :key="pledge.value"
          :class="{ 'input-wrapper--has-label': !!pledge.label}">
          <input type="radio" :id="`amount_${pledge.value}`" name="amount" v-model="amount" :value="pledge.value"
            @change="validateForm()">
          <label :for="`amount_${pledge.value}`" class="bigger">
            <strong v-if="pledge.label">{{ pledge.label }}</strong>
            <small v-if="!centsInUse">R$</small>
            {{ pledge.value | formatBRL }}<small v-if="centsInUse">,{{ pad(pledge.value % 100, 2, '0') }}</small>
          </label>
        </div>
        <transition name="custom-value-fade" mode="out-in" v-if="!candidate.disable_custom_donation_value">
          <div class="input-wrapper
          input-wrapper--full-width" v-if="amount !== 'other'" key="other">
            <input type="radio" id="amount_other" name="amount" v-model="amount" value="other">
            <label for="amount_other">Outro valor</label>
          </div>

          <div class="input-wrapper has-real-value" v-else key="customValue">
            <label for="other">R$</label>
            <input type="tel" name="other" v-model.number="other" @change="validateForm()" pattern="[0-9]*"
              :disabled="amount === 'other' ? false : true" v-mask="'####'" v-focus>
            <button type="button" href="#" @click.prevent="validateForm">OK</button>
          </div>
        </transition>
      </fieldset>
      <p class="error" v-if="errorMessage != ''">
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import {
formatBRL, formatBRLDec, getQueryString, pad, validate
} from '../../utilities';

export default {
  name: 'selectValue',
  directives: {
    mask,
  },
  data() {
    return {
      errorMessage: '',
      amount: '',
      other: '',
      valueCheckedOnUrl: false,
    };
  },
  mounted() {
    this.getDonationAmount();
  },
  computed: {
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
    centsInUse({ pledges } = this) {
      return pledges.some((x) => x % 100 !== 0);
    },
    pledges({ candidate } = this) {
      const {
        pledges = [2000, 5000, 11000, 20000, 25000, 32000, 50000, 75000, 106400],
      } = candidate;

      return pledges
        .map((x) => (typeof x === 'number' ? { value: x } : x))
        .filter((x) => !!x.value)
        .sort((a, b) => b.value - a.value);
    },
  },
  watch: {
    candidate(newValue) {
      if (newValue && !this.valueCheckedOnUrl) {
        this.getDonationAmount();
      }
    },
  },
  methods: {
    validateForm() {
      const { amount, other } = this;
      const values = amount === 'other' ? { amount, other: other * 100 } : { amount };
      const maxValue = this.candidate ? this.candidate.max_donation_value : 106409;
      const minValue = this.candidate ? this.candidate.min_donation_value : 1000;

      const validation = validate(values);

      if (amount === 'other' && values.other < minValue) {
        this.errorMessage = `O valor mínimo da doação é de R$ ${formatBRLDec(minValue)}`;
        return;
      } if (amount === 'other' && values.other > maxValue) {
        this.errorMessage = `O valor máximo da doação é de R$ ${formatBRLDec(maxValue)}`;
        return;
      }

      if (validation.valid) {
        this.saveStep(values);
      } else {
        this.errorMessage = 'Todos os campos são obrigatórios';
      }
    },
    saveStep(values) {
      const data = {
        amount: values.amount !== 'other' ? values.amount : values.other,
        step: 'userData',
      };

      this.$store.dispatch('CHANGE_PAYMENT_AMOUNT', data);
    },
    checkAmount() {
      if (this.amount !== '') {
        this.validateForm();
      }
    },
    getDonationAmount() {
      let amount = getQueryString(window.location.search).valor || '';

      if (this.candidate.disable_custom_donation_value) {
        return;
      }

      this.valueCheckedOnUrl = true;

      /*
      accepted formats:
      10
      R$20
      R$30,00
      R$ 30,00
      R$    60,00
      R$  60,0
      $10
      $ 10
      20reais
      r$20
      10,00
      50 reais
      500   reais
      500,00 reais
      1000,00   reais
      */

      amount = amount.replace(/(?:^r*\$\s*)|(?:(?:,\d{1,2})*(?:\s*reais)*$)/gi, '');
      amount = parseInt(amount, 10) || 0;

      if (amount) {
        if (!this.pledges.some((x) => x.value === amount)) {
          this.amount = 'other';
          this.other = amount;
        }
      }
    },
    formatBRL,
    pad,
  },
};
</script>
