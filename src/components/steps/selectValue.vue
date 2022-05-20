<template>
  <section class="content">
    <form @submit.prevent="validateForm">
      <fieldset class="of-radios-and-checks">
        <div class="input-wrapper" v-for="pledge in pledges" :key="pledge">
          <input type="radio" :id="`amount_${pledge}`" name="amount" v-model="amount" :value="pledge" @change="validateForm">
          <label :for="`amount_${pledge}`" class="bigger">R$ {{ pledge | formatBRL }}</label>
        </div>
        <transition name="custom-value-fade" mode="out-in">
          <div
          class="input-wrapper
          input-wrapper--full-width"
          v-if="amount !== 'other'" key="other">
            <input type="radio" id="amount_other" name="amount" v-model="amount" value="other">
            <label for="amount_other">Outro valor</label>
          </div>

          <div class="input-wrapper has-real-value" v-else key="customValue">
            <label for="other">R$</label>
            <input
              type="tel"
              name="other"
              v-model.number="other"
              pattern="[0-9]*"
              :disabled="amount === 'other' ? false : true"
              v-mask="'####'" v-focus>
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
import { validate, formatBRL, getQueryString } from '../../utilities';

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
  computed: {
    candidate() {
      return this.$store.state.candidate;
    },
    pledges({ candidate } = this) {
      const { pledges } = candidate;

      return pledges && Array.isArray(pledges) && pledges.length
        ? pledges
        : [2000, 5000, 11000, 20000, 25000, 32000, 50000, 75000, 106400];
    },
  },
  watch: {
    candidate(newValue) {
      if (newValue && !this.valueCheckedOnUrl) {
        this.valueCheckedOnUrl = true;
        this.getDonationAmount();
      }
    },
  },
  methods: {
    validateForm() {
      const { amount, other } = this;
      const values = amount === 'other' ? { amount, other: other * 100 } : { amount };
      const maxvalue = this.candidate ? this.candidate.max_donation_value : 106400;
      const minvalue = this.candidate ? this.candidate.min_donation_value : 1000;

      const validation = validate(values);

      if (amount === 'other' && values.other < minvalue) {
        this.errorMessage = `O valor mínimo da doação é de R$ ${formatBRL(minvalue)}`;
        return;
      } if (amount === 'other' && values.other > maxvalue) {
        this.errorMessage = `O valor máximo da doação é de R$ ${formatBRL(maxvalue)}`;
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
        if (this.pledges.indexOf(amount) === -1) {
          this.amount = 'other';
          this.other = amount;
          this.formatOther();
        }
        this.amount = amount;
      }
    },
  },
};
</script>
