<template>
  <section
    v-if="tickets && candidate.rede_ticket"
    id="vales"
    :class="`entry-content ${activeSection === 'vales' ? 'entry-content-active' : ''}`"
  >
    <h2>Vale eleitoral</h2>
    <h4>O que são os vales eleitorais?</h4>

    <p>
      Você sabe como os partidos políticos definem quais candidatos
      irão ganhar mais dinheiros e quais menos? Aqui na Rede
      Sustentabilidade da cidade de São Paulo a gente faz essa escolha
      com você!
    </p>

    <p>
      Para você participar da escolha de destinar parte do fundo
      eleitoral para candidaturas do {{
        candidate.party.name.toLowerCase().indexOf('partido') === -1 ?
          'Partido' : '' }} {{ candidate.party.name }} ({{
        candidate.address_city }}), basta acessar a página do seu
      pré-candidato do VOTO LEGAL e clicar em "vale eleitoral" e
      preencher com seus dados para confirmar sua escolha. Você só
      pode destinar o vale para 1 pré-candidato ou pré-candidata e tem
      até o dia 27 de setembro para fazer isso.
    </p>

    <p>
      Aqui você pode acompanhar todos os vales registrados para a
      pré-candidatura de {{ candidate.popular_name }}, do {{
        candidate.party.name.toLowerCase().indexOf('partido') === -1 ?
          'Partido' : '' }} {{ candidate.party.name }}.
    </p>

    <table
      v-if="tickets.length > 0"
      class="tickets-table"
    >
      <thead>
        <tr>
          <th>Nome</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ticket in tickets"
          :key="ticket.id"
          :class="{irregular: ticket.is_irregular}"
        >
          <th title="Nome">
            {{ ticket.nome | titleCase }}
          </th>
          <td title="Data">
            {{ ticket.criado_em | date }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Nome</th>
          <th>Data</th>
        </tr>
      </tfoot>
    </table>
    <h3 v-else>
      Ainda não há vales
    </h3>

    <button
      v-if="hasMore.tickets"
      class="button--load-more"
      type="button"
      @click.prevent="getCandidateTickets()"
    >
      Carregar mais
    </button>
  </section>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "Tickets",
  computed: {
    ...mapState(['candidate', 'tickets', 'hasMore'])
  },
}
</script>
<style lang="scss" scoped>
</style>
