<template>
<main id="conteudo">

  <article id="home__donors" class="home__donors">
    <div class="internal-container" id="donation-wrap">
      <h2>
      Doadores
      </h2>

      <p><strong>Essas são as pessoas que entenderam o valor de seu apoio e decidiram dar um passo na direção de uma política mais transparente, mais representativa e mais colaborativa:</strong></p>

      <div v-if="donations" class="donations-wrapper" v-cloak>
        <table class="donations-table" v-if="donations.length > 0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data</th>
              <th>Método</th>
              <th>Valor</th>
              <th>Recibo</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data</th>
              <th>Método</th>
              <th>Valor</th>
              <th>Recibo</th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-show="donationsRecentCount > 0">
              <td colspan="6" class="alert alert--warning" role="alert">
              Há pelo menos <b>{{ donationsRecentCount }}</b> novas transações segundo os critérios escolhidos.
              <button class="" type="button" @click="refreshDonationsList()">Carregar?</button>
              </td>
            </tr>
            <tr v-for="donation in donations" :key="donation.id" :class="{irregular: donation.is_irregular}">
              <th title="Nome">{{donation.name | titleCase}}</th>
              <td title="CPF">{{donation.cpf | formatCPF }}</td>
              <td title="Data">{{ donation.captured_at | date }}</td>
              <td title="Método">{{ donation.payment_method_human }}</td>
              <td title="Valor">R$ {{donation.amount | formatBRL}} </td>
              <td v-if="donation.digest" title="Recibo" class="decred-link">
                <a :href="`${generalSiteDomain}/em/${candidate.username}/recibo/${donation.digest}`"
                  target="_blank"
                  title="Registro na blockchain">
                  <img src="../../assets/images/icons/website-dark.png" alt="Recibo"/>
                </a>
              </td>
              <td title="Recibo" v-else-if="!donation.platform || donation.platform === 'votolegal' || donation.platform === '30217474000150'">Processando</td>
              <td title="Recibo" v-else-if="donation.platform">
                {{ getPlatformName(donation.platform) }}
              </td>
              <td title="Recibo" v-else></td>
            </tr>
          </tbody>
        </table>
        <h3 v-else-if="!donationsLoading" v-cloak>Ainda não há doações</h3>

        <button class="button--load-more" type="button" @click.prevent="getDonationsList()"
          v-if="hasMoreDonations">
          Carregar mais
        </button>
      </div>
    </div>
  </article>
</main>
</template>

<script>

export default {
  name: 'donors',
  mounted() {
    const candidateId = (window.location.host === 'doeboulos.com' || window.location.host === 'test.doeboulos.com') ? 10129 : 200;
    this.$store.dispatch('GET_CANDIDATE_INFO', candidateId);
    this.$store.dispatch('GET_DONATIONS', candidateId);
    this.$store.dispatch('UPDATE_DONATIONS', candidateId);
  },
  computed: {
    generalSiteDomain() {
      return (window.location.host === 'doeboulos.com' || window.location.host === 'test.doeboulos.com')
        ? 'https://votolegal.com.br'
        : 'https://dev.votolegal.com.br';
    },
    candidate() {
      return this.$store.state.candidate;
    },
    donations() {
      return this.$store.state.donations;
    },
    donationsLoading() {
      return this.$store.state.donationsLoading;
    },
    donationsRecentCount() {
      return this.$store.state.donationsRecentCount;
    },
    donationsRecent() {
      return this.$store.state.donationsRecent;
    },
    hasMoreDonations() {
      return this.$store.state.hasMoreDonations;
    },
    expected() {
      if (this.candidate) {
        if (this.candidate.raising_goal) {
          return this.candidate.raising_goal;
        }
      }
      return 0;
    },
    porcentage() {
      if (this.candidate) {
        const value = (this.candidate.total_donated * 100) / this.expected;
        return Math.ceil(value);
      }
      return 0;
    },
  },
  methods: {
    FormatFixedBRL(amount) {
      let formated = `${(amount / 100).toFixed(2)}`;

      formated = formated
        .substring(0, formated.length - 2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
        .replace(/\.+$/, '');
      return formated;
    },
    getDonationsList() {
      this.$store.dispatch('GET_DONATIONS', this.candidate.id);
    },
    refreshDonationsList() {
      this.$store.dispatch('REFRESH_DONATIONS');
    },
    getPlatformName(platformCNPJ) {
      return this.$store.state.donationPlatforms
        .filter(x => x.cnpj === platformCNPJ)
        .map(x => x.name)[0] || platformCNPJ;
    },
  },
};
</script>
