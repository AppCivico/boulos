<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="site-footer__copyright">
        <div class="wrap-logo">
          <a href="https://votolegal.com.br" target="_blank" class="votolegal-logo"></a>
        </div>
        <div class="site-footer__copyright">
          <p>
            <a href="https://votolegal.com.br" target="_blank">Voto Legal</a> é
            uma plataforma de software livre homologada pelo TSE e opera sob o
            CNPJ "08.746.641/0001-00", razão social "APPCIVICO CONSULTORIA
            LTDA". Todas as doações são registradas na blockchain da Decred com
            objetivo de garantir a autenticidade das transações, promovendo a
            confiabilidade no processo de doação eleitoral. Taxa de 5,5% via
            cartão de crédito ou 3,5% + R$2,99 via boleto, esse valor é
            destinado a taxas de operação financeira, sistemas de controle
            anti-fraude, impostos e infraestrutura.
          </p>
          <p>
            <strong>© 2016-2020 <a href="https://votolegal.com.br"
            target="_blank">Voto Legal</a> • Uma iniciativa <a
            href="http://appcivico.com" target="_blank">AppCívico</a> -
            Tecnologias Cívicas • <a href="https://participe.votolegal.com.br/files/Termo%20de%20uso%20e%20Politica%20de%20privacidade%20(unificado)%20-%20Voto%20Legal%20-%202020%402020-09-23.pdf"
            target="_blank">Contrato</a></strong>
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
      isDev: (process.env.VUE_APP_MODE === 'development'),
    };
  },
  computed: {
    recentDonationAmount() {
      const { amount = 0 } = this.$store.state.recentDonation;

      return amount / 100;
    },
    recentDonationFirstName() {
      const { name = '' } = this.$store.state.recentDonation;
      const firstName = name.substr(0, name.indexOf(' ')) || name;

      return firstName;
    },
  },
};
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
