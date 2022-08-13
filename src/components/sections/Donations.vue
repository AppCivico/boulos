<template>
  <section class="entry-content">
    <h2>Doações</h2>

    <h4>O que são os comprovantes?</h4>

    <p>
      A {{ campaign }} {{ candidatePreposition }} <strong>{{
        candidate.popular_name }}</strong> registra todas suas doações em um
      cartório cívico digital para comprovar e manter a autenticidade da sua
      doação.
    </p>
    <p>
      Essa rede de informações é vinculada a uma das mais seguras e
      confiáveis do mundo, que é a blockchain do DECRED. Esses números são a
      referência sobre as doações realizadas.
    </p>

    <h4>Por que isso é importante?</h4>

    <p>
      As doações eleitorais são muito importantes para construção de projetos
      políticos. Porém, é fundamental que as plataformas de financiamento
      coletivo, sociedade e o TSE tenham garantias que as informações ofereçam
      integridade e confiabilidade de maneira descentralizada para garantir
      controle social.
    </p>

    <p>
      Por isso, a {{ campaign }} {{ candidatePreposition }} <strong>{{
        candidate.popular_name }}</strong> <em>({{ partyAndName }})</em> está
      registrando todas suas doações financeiras para comprovar a integridade e
      honestidade do processo de captação de recursos.
    </p>

    <table v-if="donations.length > 0" class="donations-table" :class="{'has-unmasked-row': donationToUnmask}">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data</th>
          <th>Método</th>
          <th>Valor</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="donation in donations" :key="donation.id"
          :class="{ irregular: donation.is_irregular, 'unmasked-row': donationToUnmask === donation.id }">
          <th title="Nome">
            {{ donationToUnmask === donation.id ? donation.name : maskName(donation.name) }}
          </th>
          <td title="CPF">
            {{ donationToUnmask === donation.id ? formatCPF(donation.cpf) : maskCPF(donation.cpf) }}
          </td>
          <td title="Data">
            {{ donation.captured_at | date }}
          </td>
          <td title="Método">
            {{ donation.payment_method_human }}
          </td>
          <td title="Valor">
            R$ {{ donation.amount | formatBRL }}<small class="cents">,{{ pad(donation.amount % 100, 2, '0')
              }}</small>
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
          <th>CPF</th>
          <th>Data</th>
          <th>Método</th>
          <th>Valor</th>
          <th></th>
        </tr>
      </tfoot>
    </table>

    <h3 v-else>
      Ainda não há doações
    </h3>

    <button v-if="hasMore.donations" class="button--load-more" type="button" @click.prevent="getCandidateDonations()">
      Carregar mais
    </button>
  </section>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import {
formatCPF, FormatFixedBRL, maskCPF, maskName, pad, parseMD
} from '../../utilities';

export default {
  name: 'Donations',
  data() {
    return {
      donationToUnmask: '',
    };
  },
  computed: {
    ...mapGetters(['campaign', 'candidatePreposition', 'partyAndName']),
    ...mapState(['candidate', 'donations', 'hasMore']),
  },
  methods: {
    FormatFixedBRL,
    formatCPF,
    maskCPF,
    maskName,
    pad,
    parseMD,
    ...mapActions(['getCandidateDonations']),
  },
};
</script>
