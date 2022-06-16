<template>
  <section id="user-data-payment">
    <form @submit.prevent="validateForm()" :aria-busy="loading ? 'true' : 'false'" :data-busy-message="dataBusyMessage">
      <a class="donation-nav donation-nav--rewind" href="#" @click.prevent="goBack">voltar</a>

      <div class="instructions-donation">
        <p class="instructions" v-if="allowedPaymentMethods.length > 1">
          Escolha a forma de pagamento
        </p>
        <ul class="payment-choices">
          <li class="payment-type" v-if="isPaymentMethodAllowed('credit_card')">
            <input name="payment_method" id="credit_card" value="credit_card" type="radio" v-model="payment_method" />
            <label for="credit_card">Cartão de Crédito</label>
          </li>
          <li class="payment-type" v-if="isPaymentMethodAllowed('boleto')">
            <input name="payment_method" id="boleto" value="boleto" type="radio" v-model="payment_method" />
            <label for="boleto">Boleto</label>
          </li>
          <li class="payment-type" v-if="isPaymentMethodAllowed('pix')">
            <input name="payment_method" id="pix" value="pix" type="radio" v-model="payment_method">
            <label for="pix">PIX</label>
          </li>
        </ul>
        <div class="error" v-if="validation.errors.payment_method">
          Selecione uma forma de pagamento
        </div>
      </div>
      <fieldset v-if="payment_method || formAction !== 'donate'">
        <div class="instructions-donation">
          <p class="instructions">Por favor, informe os seguintes dados:</p>
        </div>
        <div :class="`input-wrapper
        ${validation.errors.name ? 'has-error' : ''}`">
          <label for="name">Nome</label>
          <input ref="nameField" type="text" id="name" name="name" autocomplete="given-name"
            v-focus="formAction !== 'donate' || payment_method" v-model="name" required />
          <div class="error" v-if="validation.errors.name">
            {{ validation.errors.name }}
          </div>
        </div>

        <div :class="`input-wrapper
        ${validation.errors.surname ? 'has-error' : ''}`">
          <label for="surname">Sobrenome</label>
          <input type="text" id="surname" name="surname" autocomplete="family-name" v-model="surname" required />
          <div class="error" v-if="validation.errors.surname">
            {{ validation.errors.surname }}
          </div>
        </div>

        <div v-if="formAction === 'donate'" :class="`input-wrapper
        ${validation.errors.cpf ? 'has-error' : ''}`">
          <label for="cpf">CPF</label>
          <input type="tel" name="cpf" v-model="cpf" v-mask="'###.###.###-##'" required>
          <div class="error" v-if="validation.errors.cpf">
            {{ validation.errors.cpf }}
          </div>
        </div>

        <div :class="`input-wrapper
        ${validation.errors.email ? 'has-error' : ''}`">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" autocomplete="email" v-model="email" required />
          <div class="error" v-if="validation.errors.email">
            {{ validation.errors.email }}
          </div>
        </div>
      </fieldset>
      <template v-if="formAction === 'donate' && candidateAmount">
        <p class="subtitle">
          Declaro que minhas doações não ultrapassam 10% dos meus rendimentos
          brutos do ano anterior, a origem do dinheiro não é estrangeira, não sou
          concessionário ou permissionário de serviço público.
        </p>
        <p class="subtitle">
          Declaro estar ciente, que ao realizar uma doação, por conta da
          legislação eleitoral, os seus dados (nome completo, CPF, valor
          individual de cada doação, forma de pagamento, data das doações) serão
          publicados de forma pública no site do candidato, e concordo com os <a
            href="https://participe.votolegal.com.br/files/Termo%20de%20uso%20e%20Politica%20de%20privacidade%20(unificado)%20-%20Voto%20Legal%20-%202020%402020-09-23.pdf"
            target="_blank">termos de doação</a>.
        </p>
        <div v-if="formAction === 'donate' && candidateAmount" class="candidate-amount">
          <p>
            Valor doado
            <output>
              R${{ candidateAmount | formatBRLDec }}
            </output>
          </p>
          <p class="helper-text form__disclaimer" v-if="payment_method">
            Taxa de {{ taxes[payment_method].text }}.
            Esse valor é destinado a taxas de operação financeira, sistemas de
            controle anti-fraude, impostos e infraestrutura.
          </p>
        </div>
      </template>

      <p class="error" v-if="errorMessage != ''">
        {{ errorMessage }}
      </p>
      <button type="submit" :disabled="loading" class="donation-nav donation-nav--forward">Continuar</button>
    </form>
  </section>
</template>

<script>
import { mask } from 'vue-the-mask';
import { mapMutations, mapState } from 'vuex';
import CONFIG from '../../config';
import { root as minimumPerMethodFallback } from '../../data/minimum_donations_per_payment_method.json';
import { validate } from '../../utilities';
import VotolegalFP from '../../vendor/loadme';

export default {
  name: 'userData',
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
      taxes: CONFIG.taxes,
      dataBusyMessage: '',
      loading: false,
      errorMessage: '',
      name: '',
      surname: '',
      cpf: '',
      email: '',
      donationFp: '',
      validation: {
        errors: {},
      },
      payment_method: '',
      formData: {},
    };
  },
  computed: {
    candidateAmount({ amount, taxes, payment_method } = this) {
      let newAmount = 0;

      if (payment_method && taxes[payment_method]) {
        newAmount = amount - amount * taxes[payment_method].percent / 100;
        newAmount -= taxes[payment_method].tax;
      }
      if (newAmount) {
        return Math.floor(newAmount).toFixed(0);
      }
      return newAmount;
    },
    allowedPaymentMethods({ amount, candidate } = this) {
      const allowedPaymentMethodsFallback = ['credit_card', 'boleto', 'pix'];
      const {
        min_donation_values: minimumPerMethod = minimumPerMethodFallback,
        allowed_payment_methods: allowedPaymentMethods = allowedPaymentMethodsFallback,
      } = candidate;

      return allowedPaymentMethods.filter((x) => amount >= minimumPerMethod[x]);
    },
    ...mapState(['amount', 'candidate', 'candidateId', 'token']),
  },
  watch: {
    payment_method(newValue, oldValue) {
      if (newValue && !oldValue) {
        if (this.validation.errors.payment_method) {
          this.validation.errors.payment_method = undefined;
        }
      }
    },
  },
  methods: {
    isPaymentMethodAllowed(method = '') {
      return this.allowedPaymentMethods.indexOf(method.toLowerCase()) !== -1;
    },
    controlSession() {
      const dataSession = JSON.parse(sessionStorage.getItem('donor-data'));
      if (dataSession != null) {
        const data = {
          amount: (this.amount != undefined) ? this.amount : dataSession.amount,
          step: 'userData',
        };

        if (this.formAction === 'donate') {
          this.$store.dispatch('CHANGE_PAYMENT_AMOUNT', data);
        }

        this.name = dataSession.firstName;
        this.surname = dataSession.surname;
        this.cpf = dataSession.cpf;
        this.email = dataSession.email;
      }
    },
    goBack() {
      if (this.formAction === 'donate') {
        this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'selectValue' });
      } else {
        this.SET_TICKET_STEP({ step: 'intro' });
      }

      this.$emit('go-back');
    },
    scrollToForm({ formAction } = this) {
      let form = null;

      switch (formAction) {
        case 'follow':
          form = document.getElementById('acompanhar');
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

    validateForm({
      payment_method, name, surname, cpf, email, amount,
    } = this) {
      this.toggleLoading('Validando valor e método...');

      const fields = {
        name,
        surname,
        cpf,
        email,
      };

      if (this.formAction === 'donate') {
        fields.payment_method = payment_method;
      }

      const validation = validate(fields);

      if (validation.valid) {
        this.formData = fields;
        this.registerUser(fields);
        let donorData = {
          name: `${name} ${surname}`.toUpperCase().trim().replace(/\s/g, ''),
          cpf: cpf.replace(/[^0-9]+/g, ''),
          email,
          firstName: name,
          surname,
          cpfDirty: cpf,
          amount,
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
    registerUser(data) {
      this.getDonationFP()
        .then(() => {
          const payload = {
            payment_method: this.payment_method,
            device_authorization_token_id: this.token,
            email: data.email,
            cpf: data.cpf,
            name: `${data.name} ${data.surname}`,
            amount: this.amount,
            candidate_id: this.candidate.id,
            donation_fp: this.donationFp,
            referral_code: this.$store.state.referral,
          };
          const user = {
            name: data.name,
            surname: data.surname,
          };
          this.$store.dispatch('SAVE_PAYMENT_DATA', payload);
          this.$store.dispatch('SAVE_DONOR_NAMES', user);
          this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'boleto' });
        }).catch(() => {
          this.toggleLoading();
          this.errorMessage = 'Ocorreu um erro inesperado, tente novamente!';
        });
    },
    handleErrorMessage(err) {
      this.errorMessage = err.data[0].message;
    },
    getDonationFP() {
      return new Promise((resolve, reject) => {
        const d1 = new Date();
        const fp = new VotolegalFP({
          excludeUserAgent: true,
          dontUseFakeFontInCanvas: true,
        });

        fp.get((result, components) => {
          const d2 = new Date();

          const info = {
            ms: d2 - d1,
            id: result,
          };

          for (const index in components) {
            const obj = components[index];

            if (obj.key == 'canvas' || obj.key == 'webgl') {
              info[obj.key] = obj.value.toString().length;
            } else {
              info[obj.key] = obj.value.toString();
            }
          }

          const Base64 = {
            _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            encode(e) {
              let t = '';
              let n;
              let r;
              let i;
              let s;
              let o;
              let u;
              let a;
              let f = 0;
              e = Base64._utf8_encode(e);
              while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                  u = a = 64;
                } else if (isNaN(i)) {
                  a = 64;
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
              }
              return t;
            },
            _utf8_encode(e) {
              e = e.replace(/rn/g, 'n');
              let t = '';
              for (let n = 0; n < e.length; n++) {
                const r = e.charCodeAt(n);
                if (r < 128) {
                  t += String.fromCharCode(r);
                } else if (r > 127 && r < 2048) {
                  t += String.fromCharCode(r >> 6 | 192);
                  t += String.fromCharCode(r & 63 | 128);
                } else {
                  t += String.fromCharCode(r >> 12 | 224);
                  t += String.fromCharCode(r >> 6 & 63 | 128);
                  t += String.fromCharCode(r & 63 | 128);
                }
              }
              return t;
            },
          };

          const donation_fp = Base64.encode(JSON.stringify(info));

          if (donation_fp) {
            this.donationFp = donation_fp;
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    setData(data, {
      token,
      email,
      name,
      surname,
      cpf,
      candidateId,
      donationFp,
      formAction,
      payment_method,
      amount,
    } = this) {
      const payload = {
        device_authorization_token_id: token,
        email,
        name: `${name} ${surname}`,
        cpf,
        candidate_id: candidateId,
        donation_fp: donationFp,
        referral_code: this.$store.state.referral,
      };

      if (formAction === 'donate') {
        payload.payment_method = payment_method;
        payload.amount = amount;
      } else {
        payload.name = name;
        payload.surname = surname;
      }

      const user = {
        name: data.name,
        surname: data.surname,
      };

      this.$store.dispatch('SAVE_PAYMENT_DATA', payload);
      this.$store.dispatch('SAVE_DONOR_NAMES', user);

      if (formAction === 'donate') {
        this.$store.dispatch('CHANGE_PAYMENT_STEP', { step: 'boleto' });
      } else {
        this.SET_TICKET_STEP({ step: 'addressData' });
      }

      this.$emit('go-ahead');
    },

    handleSession() {
      if (window.localStorage) {
        const token = localStorage.getItem(CONFIG.tokenName);
        if (token !== null) {
          this.$store.dispatch('ADD_TOKEN', token);
        } else {
          this.$store.dispatch('GET_TOKEN').then((res) => {
            localStorage.setItem(
              CONFIG.tokenName,
              res.data.device_authorization_token_id,
            );
          });
        }
      }
    },

    ...mapMutations(['SET_TICKET_STEP']),
  },
  mounted() {
    this.scrollToForm();
    this.handleSession();
    this.controlSession();
  },
};
</script>
