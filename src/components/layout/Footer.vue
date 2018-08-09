<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="site-footer__copyright">
        <div class="wrap-logo">
          <a href="https://votolegal.com.br" target="_blank" class="votolegal-logo"></a>
        </div>
        <div class="site-footer__copyright">
          <p>
            <a href="https://votolegal.com.br" target="_blank">Voto Legal</a> é uma plataforma de software livre homologada pelo TSE e opera sob o CNPJ "30.217.474/0001-50", razão social "Pague Junto - Tecnologia de Intermediação LTDA".
            Todas as doações são registradas na blockchain da Decred com objetivo de garantir a autenticidade das transações, promovendo a confiabilidade no processo de doação eleitoral. Taxa de 7,4% via cartão de crédito ou 4% + R$4 via boleto, esse valor é destinado a taxas de operação financeira, sistemas de controle anti-fraude, impostos e infraestrutura.
          </p>
          <p>
            <strong>© 2016-2018 <a href="https://votolegal.com.br" target="_blank">Voto Legal</a> • Uma iniciativa <a href="http://appcivico.com" target="_blank">AppCívico</a> - Tecnologias Cívicas • <a href="/termos.pdf" target="_blank">Contrato</a></strong>
          </p>
        </div>
      </div>
    </div>
    <div v-if="isDev" class="fb-customerchat"
      attribution=setup_tool
      page_id="257874391684846"
      theme_color="#0a6661">
    </div>
    <div class="notifications-wrapper">
      <Notification message="Apoie você também!"
      :title="`R$${recentDonationAmount} acabam de ser doados por ${recentDonationFirstName}!`"
      :duration="5000" />
    </div>
  </footer>
</template>

<script>
import Notification from '@/components/Notification.vue';

export default {
  name: 'Footer',

  components: {
    Notification,
  },

  data() {
    return {
      isDev: (window.location.host === 'boulos.appcivico.com'),
    }
  },
  computed: {
    recentDonationAmount() {
      const {amount = 0} = this.$store.state.recentDonation;

      return amount / 100;
    },
    recentDonationFirstName() {
      const {name = ''} = this.$store.state.recentDonation;
      const firstName = name.substr(0, name.indexOf(' ')) || name;

      return firstName;
    },
  }
}
</script>

<style>
  .notification-fade-enter-active,
  .notification-fade-leave-active {
    transition: opacity .3s ease;
  }
  .notification-fade-enter,
  .notification-fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
