<template>
  <dl class="donation-meta">
    <div>
      <dt>Doação processada por:</dt>
      <dd>
        AppCívico Consultoria Ltda.
      </dd>
      <dd>
        razão social pela qual o <strong>Voto Legal</strong>
        é homologado no <abbr title="Tribunal Superior Eleitoral">TSE</abbr>
      </dd>
    </div>
    <div>
      <dt><abbr title="Cadastro Nacional de Pessoa Jurídica">CNPJ</abbr>:</dt>
      <dd>08.746.641/0001-00</dd>
    </div>
  </dl>
</template>

<script>
export default {
  name: 'DonationMeta',
};
</script>

<style lang="scss">
.donation-meta {
  dt {
    font-size: small;
    font-weight: inherit;
    text-transform: lowercase;
  }

  dd {
    margin-bottom: 0;

    font-weight: bold;

    + dd {
      font-size: small;
      font-weight: normal;
    }
  }
}
</style>
