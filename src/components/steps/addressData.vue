<template>
  <form @submit.prevent="validateForm()" :aria-busy="loading ? 'true' : 'false'"
    :data-busy-message="dataBusyMessage"
  >
    <fieldset>
      <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>
      <div class="instructions-donation">
        <p class="instructions">Informe seu endereço</p>
      </div>
      <div class="input-wrapper" :class="`${validation.errors.birthdate ? 'has-error' : ''}`">
        <label for="birthdate">
          Data de nascimento
        </label>
        <input type="text" v-model="birthdate" id="birthdate" name="birthdate"
        autocomplete="bday" v-mask="'##/##/####'" required v-focus />
        <div class="error" v-if="validation.errors.birthdate">
          {{ validation.errors.birthdate }}
        </div>
      </div>
      <div class="input-wrapper" :class="{ 'has-error': validation.errors.phone }">
        <label for="phone">
          {{ formAction === 'follow' ? 'Celular' : 'Telefone' }}
        </label>
        <input v-model="phone" v-mask="['(##) ####-####', '(##) #####-####']"
        type="tel" id="phone" name="phone" autocomplete="tel-national"
        placeholder="(00) 00000-0000" minlength="14"
        :required="paymentData.payment_method !== 'credit_card'" />
        <div v-if="validation.errors.phone" class="error">
          {{ validation.errors.phone }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.zip_code ? 'has-error' : ''}`">
        <label for="zip_code">CEP</label>
        <input type="tel" v-model="zip_code" id="zip_code" name="zipcode"
        autocomplete="postal-code" v-mask="'#####-###'"
        @change="searchAddress($event)" required minlength="9" ref="zipCode" />
        <div class="error" v-if="validation.errors.zip_code">
          {{ validation.errors.zip_code }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.city ? 'has-error' : ''}`">
        <label for="city">Cidade</label>
        <input type="text" v-model="city" id="city" name="city"
        autocomplete="address-level2" disabled="true" required ref="city" />
        <div class="error" v-if="validation.errors.city">
          {{ validation.errors.city }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.state ? 'has-error' : ''}`">
        <label for="state">Estado</label>
        <select type="text" v-model="state" id="state" name="state"
        autocomplete="address-level1" disabled="true" required ref="state">
          <option value=""></option>
          <option :value="key" v-for="(state, key) in states" :key="key">{{
          state }}</option>
        </select>
        <div class="error" v-if="validation.errors.state">
          {{ validation.errors.state }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.street ? 'has-error' : ''}`">
        <label for="street">Rua</label>
        <input type="text" v-model="street" id="street" name="street"
        autocomplete="address-level4" disabled="true" required ref="street" />
        <div class="error" v-if="validation.errors.street">
          {{ validation.errors.street }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.district ? 'has-error' : ''}`">
        <label for="district">Bairro</label>
        <input type="text" v-model="district" id="district" name="district"
        autocomplete="address-level3" disabled="true" required ref="district" />
        <div class="error" v-if="validation.errors.district">
          {{ validation.errors.district }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.number ? 'has-error' : ''}`">
        <label for="number">Número</label>
        <input type="tel" v-model="number" id="number" name="number" required>
        <div class="error" v-if="validation.errors.number">
          {{ validation.errors.number }}
        </div>
      </div>
      <div :class="`input-wrapper
      ${validation.errors.complement ? 'has-error' : ''}`">
        <label for="complement">Complemento</label>
        <input type="text" v-model="complement" name="complement">
        <div class="error" v-if="validation.errors.complement">
          {{ validation.errors.complement }}
        </div>
      </div>
    </fieldset>
    <p class="error" v-if="errorMessage != ''">
      {{ errorMessage }}
    </p>

    <button type="submit" :disabled="loading" class="donation-nav
    donation-nav--forward" v-if="formAction !== 'donate'">
      Concluir
    </button>
    <button type="submit" :disabled="loading" class="donation-nav
    donation-nav--forward" v-else>
      Continuar
    </button>
  </form>
</template>

<script>
import { mask } from 'vue-the-mask';
import { mapMutations } from 'vuex';
import states from '../../data/states.json';
import { validate } from '../../utilities';

export default {
  name: 'addressData',
  directives: {
    mask,
  },
  props: {
    formAction: {
      type: String,
      default: 'donate',
    },
  },
  data() {
    return {
      loading: false,
      dataBusyMessage: '',
      states,
      errorMessage: '',
      zip_code: '',
      state: '',
      city: '',
      street: '',
      district: '',
      number: '',
      complement: '',
      phone: '',
      birthdate: '',
      formData: {},
      validation: {
        errors: {
          zip_code: '',
          state: '',
          city: '',
          street: '',
          district: '',
        },
      },
    };
  },
  computed: {
    iugu() {
      return this.$store.state.iugu;
    },
    paymentData() {
      return this.$store.state.paymentData;
    },
  },
  methods: {
    controlSession() {
      const dataSession = JSON.parse(sessionStorage.getItem('donor-data'));
      if (dataSession != null) {
        this.zip_code = dataSession.zip_code || this.zip_code;
        this.state = dataSession.state || this.state;
        this.city = dataSession.city || this.city;
        this.street = dataSession.street || this.street;
        this.district = dataSession.district || this.district;
        this.number = dataSession.number || this.number;
        this.complement = dataSession.complement || this.complement;
        this.birthdate = dataSession.birthdate
          ? dataSession.birthdate.split('-').reverse().join('/')
          : this.birthdate;
        this.phone = dataSession.phone || this.phone;
      }
    },
    goBack() {
      this.$emit('go-back');
      if (this.formAction === 'donate') {
        this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'userData' });
      } else {
        this.SET_TICKET_STEP({ step: 'userData' });
      }
    },
    scrollToForm({ formAction } = this) {
      let form = null;

      switch (formAction) {
        case 'follow':
          form = document.getElementById('acompanhar');
          break;

        case 'testify':
          form = document.getElementById('testemunhar');
          break;

        case 'ticket':
          form = document.getElementById('votar');
          break;

        default:
          form = document.getElementById('doar');
          break;
      }

      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    },

    toggleLoading(message = '') {
      this.loading = !this.loading;

      this.dataBusyMessage = this.dataBusyMessage !== message ? message : '';
    },

    validateForm() {
      this.toggleLoading('Validando endereço...');
      const birthdate = this.birthdate.split('/').reverse().join('-');

      const phone = this.phone
        ? this.phone.replace(/[^\d]+/g, '')
        : '';
      const address = {
        zip_code: this.zip_code,
        state: this.state,
        city: this.city,
        street: this.street,
        district: this.district,
        number: this.number,
        phone,
      };

      if (this.paymentData.payment_method === 'boleto' || this.formAction === 'ticket') {
        address.birthdate = birthdate;
      }

      const validation = validate(address);

      if (validation.valid) {
        this.saveAddress();

        let donorData = {
          zip_code: this.zip_code,
          state: this.state,
          city: this.city,
          street: this.street,
          district: this.district,
          number: this.number,
          complement: this.complement,
          phone,
          birthdate,
        };
        let currentDonorData = sessionStorage.getItem('donor-data');

        if (currentDonorData) {
          currentDonorData = JSON.parse(currentDonorData);
          donorData = Object.assign(currentDonorData, donorData);
        }

        sessionStorage.setItem('donor-data', JSON.stringify(donorData));
      } else {
        this.validation = validation;
        this.toggleLoading();
      }
    },
    saveAddress({
      phone, zip_code, state, city, street, district, number, complement, birthdate, formAction,
    } = this) {
      const payload = this.$store.state.paymentData;

      payload.address_zipcode = zip_code;
      payload.address_state = state;
      payload.address_city = city;
      payload.address_street = street;
      payload.address_district = district;
      payload.address_house_number = number;
      payload.address_complement = complement;
      payload.phone = phone ? phone.replace(/[^\d]+/g, '') : '';
      payload.birthdate = birthdate.split('/').reverse().join('-');
      payload.billing_address_zipcode = zip_code;
      payload.billing_address_state = state;
      payload.billing_address_city = city;
      payload.billing_address_street = street;
      payload.billing_address_district = district;
      payload.billing_address_house_number = number;
      payload.billing_address_complement = complement;

      if (formAction === 'donate') {
        this.$store.dispatch('GET_DONATION', payload)
          .then(() => {
            this.handleIugu();
            const stepToGoTo = this.paymentData.payment_method === 'credit_card'
              ? 'cardData'
              : 'certFaceVerify';

            this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: stepToGoTo });
          })
          .catch((err) => {
            this.toggleLoading();
            this.handleErrorMessage(err);
          });
      } else {
        let action = 'SEND_TICKET';

        switch (this.formAction) {
          case 'follow':
            action = 'requestToFollowCandidate';
            break;

          case 'testify':
            action = 'submitCandidateTestimony';
            break;

          default:
            break;
        }

        this.$store.dispatch(action, payload)
          .then(() => {
            this.$emit('go-ahead');
            // this.SET_TICKET_STEP({ step: "finalMessage" });
          })
          .catch((err) => {
            this.handleErrorMessage(err);
          })
          .finally(() => {
            this.toggleLoading();
          });
      }
    },
    searchAddress(event) {
      this.$data.validation.errors.zip_code = '';
      this.$data.validation.errors.state = '';
      this.$data.validation.errors.city = '';
      this.$data.validation.errors.street = '';
      this.$data.validation.errors.district = '';
      this.$data.state = '';
      this.$data.city = '';
      this.$data.street = '';
      this.$data.district = '';
      this.errorMessage = '';

      if (event.target.value.length !== parseInt(event.target.getAttribute('minlength'), 10)) {
        this.$data.validation.errors.zip_code = 'CEP inválido';

        return this.$refs.zipCode.select() || this.$refs.zipCode.focus();
      }

      this.toggleLoading('Procurando endereço...');

      this.$store.dispatch('GET_ADDRESS', event.target.value)
        .then((response) => {
          if (!response.state) {
            this.$refs.state.disabled = false;
          } else {
            this.$refs.state.disabled = true;
            this.state = response.state;
          }

          if (!response.city) {
            this.$refs.city.disabled = false;
          } else {
            this.$refs.city.disabled = true;
            this.city = response.city;
          }

          if (!response.street) {
            this.$refs.street.disabled = false;
          } else {
            this.$refs.street.disabled = true;
            this.street = response.street;
          }

          if (!response.district) {
            this.$refs.district.disabled = false;
          } else {
            this.$refs.district.disabled = true;
            this.district = response.district;
          }

          return this.toggleLoading();
        }).catch((error) => {
          this.toggleLoading();

          if (error.response && error.response.status === 404) {
            this.$refs.state.disabled = true;
            this.$refs.city.disabled = true;
            this.$refs.street.disabled = true;
            this.$refs.district.disabled = true;

            this.$refs.zipCode.select() || this.$refs.zipCode.focus();

            this.$data.validation.errors.zip_code = 'CEP não encontrado';
          } else {
            this.$refs.state.disabled = false;
            this.$refs.city.disabled = false;
            this.$refs.street.disabled = false;
            this.$refs.district.disabled = false;

            this.$refs.zipCode.focus();

            if (error.response.data.form_error && error.response.data.form_error.CEP) {
              this.$data.validation.errors.zip_code = error.response.data.form_error.CEP.indexOf('dismembered') !== -1
                ? 'Alguns endereços desse CEP mudaram. Por favor, confira o seu e preencha os campos restantes.'
                : error.response.data.form_error.CEP;
            } else {
              this.$data.validation.errors.zip_code = error.response.data.form_error;
            }
          }

          return this.$data.validation.errors.zip_code;
        });

      return true;
    },
    handleErrorMessage(err) {
      if (err) {
        this.errorMessage = err.message || err.name || (err.data && err.data[0] ? err.data[0].message : err);
      }
    },
    handleIugu() {
      Iugu.setAccountID(this.iugu.account_id);
      Iugu.setTestMode(this.iugu.is_testing === 1);
    },
    ...mapMutations(['CHANGE_PAYMENT_STEP', 'SET_TICKET_STEP']),
  },
  mounted() {
    this.scrollToForm();
    this.controlSession();
  },
};
</script>
