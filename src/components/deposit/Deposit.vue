<template>
  <article :id="$route.name" :aria-busy="!donations.length">
    <header class="receipts-header">
      <img :src="candidate.avatar" :alt="candidate.popular_name" class="receipt__avatar">
    </header>

    <p>
      Doações referentes ao depósito <strong>{{ deposit.id || depositId
      }}</strong>
      <template v-if="deposit.created_at"> do dia {{ deposit.created_at | date }}</template>.
    </p>

    <template v-if="donations.length">
      <table class="donations-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th><abbr title="Cadastro de Pessoa Física">CPF</abbr></th>
            <th>Data</th>
            <th>Método</th>
            <th>Valor</th>
            <th>Recibo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donations" :key="donation.id">
            <th title="Nome">{{donation.donor_name | titleCase }}</th>
            <td title="CPF">{{donation.donor_cpf | formatCPF }}</td>
            <td title="Data">{{ donation.created_at | date }}</td>
            <td title="Método">{{ paymentMethod(donation) }}</td>
            <td title="Valor">R$ {{donation.amount | formatBRLDec}} </td>
            <td title="Recibo">
              <a :href="donation.transaction_link"><i class="fa fa-link"></i> Recibo</a>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Nome</th>
            <th><abbr title="Cadastro de Pessoa Física">CPF</abbr></th>
            <th>Data</th>
            <th>Método</th>
            <th>Valor</th>
            <th>Recibo</th>
          </tr>
        </tfoot>
      </table>
    </template>
    <template v-else>
      <h3>Depósito inexistente</h3>
      <p>Esse depósito não foi encontrado</p>
    </template>
  </article>
</template>

<script>
export default {
  name: 'deposit',
  props: {
    candidateId: {
      type: String,
      default: '',
    },
    depositId: {
      type: String,
      default: '',
    },
  },
  mounted({ depositId, candidateId } = this) {
    const payload = {
      candidateId,
      depositId,
    };
    this.$store.dispatch('GET_DEPOSIT', payload);
  },
  computed: {
    donations() {
      return this.$store.state.deposit.donations || [];
    },
    candidate() {
      return this.$store.state.deposit.candidate || {};
    },
    deposit() {
      return this.$store.state.deposit.meta || {};
    },
  },
  methods: {
    paymentMethod: (item) => (item.is_boleto ? 'boleto' : 'cartão de crédito'),
  },
};
</script>

<style src="../../../candidate-styles/index.scss" lang="scss"></style>
