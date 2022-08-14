<template>
  <main id="conteudo">
    <article id="home__donors" class="home__donors">
      <div class="internal-container" id="donation-wrap">
        <h2>
          Doadores
        </h2>

        <p><strong>Essas são as pessoas que entenderam o valor de seu apoio e
            decidiram dar um passo na direção de uma política mais transparente, mais
            representativa e mais colaborativa:</strong></p>

        <div v-if="donations" class="donations-wrapper" v-cloak>
          <table v-if="donations.length > 0" class="donations-table" :class="{
          'has-unmasked-row': donationToUnmask }">
            <thead>
              <tr>
                <th>Nome</th>
                <th><abbr title="Cadastro de Pessoa Fìsica">CPF</abbr></th>
                <th>Data</th>
                <th>Método</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="donation in donations" :key="donation.id"
                :class="{ irregular: donation.is_irregular, 'unmasked-row':
                donationToUnmask === donation.id }">
                <th title="Nome">
                  {{ donationToUnmask === donation.id ? donation.name : maskName(donation.name) }}
                </th>
                <td title="CPF">
                  {{ donationToUnmask === donation.id ? formatCPF(donation.cpf)
                  : maskCPF(donation.cpf) }}
                </td>
                <td title="Data">
                  {{ donation.captured_at | date }}
                </td>
                <td title="Método">
                  {{ donation.payment_method_human }}
                </td>
                <td title="Valor">
                  R$ {{ donation.amount | formatBRL }}<small class="cents">,{{
                  pad(donation.amount % 100, 2, '0') }}</small>
                </td>
                <td>
                  <label class="like-a__button--submit">
                    <input type="checkbox" :true-value="donation.id" v-model="donationToUnmask" />
                    ver
                  </label>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Nome</th>
                <th><abbr title="Cadastro de Pessoa Fìsica">CPF</abbr></th>
                <th>Data</th>
                <th>Método</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <h3 v-else-if="!donationsLoading" v-cloak>Ainda não há doações</h3>

          <button class="button--load-more" type="button"
          @click.prevent="getDonationsList()" v-if="hasMoreDonations"
          :disabled="loading">
            Carregar mais
          </button>
        </div>
      </div>
    </article>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import {
formatCPF, maskCPF, maskName, pad
} from '../../utilities';

export default {
  name: 'donors',
  props: {
  // we get candidateId as a prop to allow overriding it on local environment
    candidateId: String,
  },
  data() {
    return {
      donationToUnmask: '',
      loading: false,
    };
  },
  mounted({ candidateId } = this) {
    this.$store.dispatch('GET_CANDIDATE_INFO', candidateId);
    this.$store.dispatch('GET_DONATIONS', candidateId);
    this.$store.dispatch('UPDATE_DONATIONS', candidateId);
  },
  computed: {
    ...mapState(['candidate', 'donations', 'donationsLoading', 'hasMoreDonations']),
  },
  methods: {
    getDonationsList() {
      this.loading = true;
      this.$store.dispatch('GET_DONATIONS', this.candidate.id)
        .then(() => {
          this.loading = false;
        });
    },
    refreshDonationsList() {
      this.$store.dispatch('REFRESH_DONATIONS');
    },
    getPlatformName(platformCNPJ) {
      return this.$store.state.donationPlatforms
        .filter((x) => x.cnpj === platformCNPJ)
        .map((x) => x.name)[0] || platformCNPJ;
    },
    formatCPF,
    maskCPF,
    maskName,
    pad,
  },
};
</script>
