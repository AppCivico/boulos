<template>
  <section class="content">
    <h2 v-if="candidate && candidate.donation_title">{{ candidate.donation_title }}</h2>
    <h2 v-else>Escolha um valor para doar</h2>

    <div class="donation-intro" v-if="candidate.donation_intro" v-html="parseMD(candidate.donation_intro)"></div>

    <form @submit.prevent="validateForm()">
      <fieldset v-for="fieldSet, i in pledgesAsFieldSets" :key="i">
        <legend class="of-radios-and-checks__legend" v-if="fieldSet.legend">{{ fieldSet.legend }}</legend>

        <div class="of-radios-and-checks__intro" v-if="fieldSet.intro" v-html="parseMD(fieldSet.intro)" />
        <div class="of-radios-and-checks">
          <template v-for="pledge in fieldSet.fields">
            <div class="input-wrapper" v-if="pledge.value !== 'other'" :key="pledge.value+'__'+i"
              :class="{ 'input-wrapper--has-label': !!pledge.label}">
              <input type="radio" :id="`amount_${pledge.value}--${i}`" v-model="amount" :value="pledge.value"
                @change="setButtonReferral(pledge.referral); validateForm();" />
              <label :for="`amount_${pledge.value}--${i}`" class="bigger">
                <strong v-if="pledge.label">{{ pledge.label }}</strong>
                <small v-if="!centsInUse">R$</small>
                {{ pledge.value | formatBRL }}<small v-if="centsInUse">,{{ pad(pledge.value % 100, 2, '0') }}</small>
              </label>
            </div>

            <transition name="custom-value-fade" mode="out-in" :key="pledge.value+'__'+i+'--other-amount-transition'"
              v-else-if="!candidate.disable_custom_donation_value">
              <div class="input-wrapper input-wrapper--full-width" :key="`${pledge.value}--custom-amount`"
                v-if="amount !== 'other' || focusedFieldSet !== i">
                <input type="radio" id="amount_other" v-model="amount" value="other" />
                <label for="amount_other" @click="setInitialValueForOther(fieldSet.minValue);
                setButtonReferral(pledge.referral); focusedFieldSet = i">
                  <template v-if="pledge.label">
                    {{ pledge.label }}
                  </template>
                  <template v-else-if="fieldSet.minValue">
                    <small v-if="!centsInUse">R$</small>{{ fieldSet.minValue | formatBRL }} ou +
                  </template>
                  <template v-else>Outro valor</template>
                </label>
              </div>
              <div class="input-wrapper has-real-value" :key="pledge.value+'__'+i+'--other-amount'"
                v-else-if="focusedFieldSet === i">
                <label for="other">R$</label>
                <input type="tel" v-model.number="other" @change="validateForm()" pattern="[0-9]*"
                  :disabled="amount === 'other' ? false : true" v-mask="'####'" v-focus.select />
                <button type="button" href="#" @click.prevent="validateForm">OK</button>
              </div>
            </transition>
          </template>
        </div>
        <p class="error" v-if="errorMessage != '' && focusedFieldSet === i">
          {{ errorMessage }}
        </p>
      </fieldset>
    </form>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import { mapMutations, mapState } from 'vuex';
import {
formatBRL, formatBRLDec, getQueryString, pad, parseMD, validate
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
      focusedFieldSet: 0,
      minValueError: '',
    };
  },
  mounted() {
    this.getDonationAmount();
    this.setButtonReferral('');
  },
  computed: {
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
    centsInUse({ pledges } = this) {
      return pledges.some((x) => x % 100 !== 0);
    },
    pledgesAsFieldSets({ candidate, cleanUpPledges } = this) {
      const {
        pledges = [2000, 5000, 11000, 20000, 25000, 32000, 50000, 75000, 106400, 'other'],
      } = candidate;

      return candidate.pledgesAsFieldSets
        .map((x) => ({
          ...x,
          fields: x.minValue ? cleanUpPledges(x.fields, x.minValue) : cleanUpPledges(x.fields),
        }))
        || {
          fields: cleanUpPledges([...pledges, 'other']),
        };
    },

    pledges({ pledgesAsFieldSets } = this) {
      return pledgesAsFieldSets
        .reduce((acc, cur) => ([...acc, ...cur.fields]), [])
        .filter((x) => typeof x.value === 'number')
        .map((x) => x.value);
    },

    ...mapState(['referral']),
  },
  watch: {
    candidate(newValue) {
      if (newValue && !this.valueCheckedOnUrl) {
        this.getDonationAmount();
      }
    },
  },
  methods: {
    cleanUpPledges(pledges, minValue = 0) {
      const { disable_custom_donation_value: disableCustomDonationValue, pledges_order: pledgesOrder = 'desc' } = this.candidate;
      return pledges.map((x) => (typeof x === 'number' || x === 'other' ? { value: x } : x))
        .filter((x) => !!x.value || (x.value !== 'other' && typeof x.value !== 'number'))
        // using a ternary just because it looks easier to read
        .filter((x) => (disableCustomDonationValue
          ? x.value >= (minValue || 0)
          : x.value === 'other' || x.value >= (minValue || 0)))
        .filter((obj, index, arr) => arr.map((mapObj) => mapObj.value).indexOf(obj.value) === index)
        .sort((a, b) => {
          if (typeof a.value === 'number' && typeof b.value === 'number') {
            return pledgesOrder === 'asc'
              ? a.value - b.value
              : b.value - a.value;
          }
          // check for num vs string
          if (typeof a.value === 'number' && typeof b.value === 'string') {
            return -1;
          }
          // check for string vs num
          if (typeof a.value === 'string' && typeof b.value === 'number') {
            return 1;
          }
          // check for string vs string
          if (typeof a.value === 'string' && typeof b.value === 'string') {
            if (a.value < b.value) return -1;
            return 1;
          }
          return 0;
        });
    },
    setButtonReferral(referral = '') {
      this.storeToState({ name: 'buttonReferral', data: referral });
    },
    setInitialValueForOther(value) {
      if (value) {
        this.other = value / 100;
      }
    },
    validateForm() {
      const {
        amount, focusedFieldSet, other, pledgesAsFieldSets,
      } = this;
      const values = amount === 'other' ? { amount, other: other * 100 } : { amount };
      const maxValue = this.candidate?.max_donation_value || 106409;
      const minValue = pledgesAsFieldSets[focusedFieldSet]?.minValue || this.candidate?.min_donation_value || 1000;

      const validation = validate(values);

      if (amount === 'other' && values.other < minValue) {
        this.errorMessage = pledgesAsFieldSets[focusedFieldSet]?.minValue
          ? `O valor mínimo para essa opção é de R$ ${formatBRLDec(minValue)}`
          : `O valor mínimo para doação é de R$ ${formatBRLDec(minValue)}`;
        return;
      } if (amount === 'other' && values.other > maxValue) {
        this.errorMessage = `O valor máximo para doação é de R$ ${formatBRLDec(maxValue)}`;
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
    parseMD,
    ...mapMutations(['storeToState']),
  },
};
</script>
