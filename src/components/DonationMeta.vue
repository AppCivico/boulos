<template>
  <dl class="donation-meta">
    <div>
      <dt>Doação processada por:</dt>
      <dd>
        AppCívico Consultoria Ltda.
      </dd>
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
