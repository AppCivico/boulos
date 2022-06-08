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
            uma plataforma de financiamento coletivo eleitoral de propriedade do
            <em>AppCívico Consultoria LTDA <small>(CNPJ: 08.746.641/0001-00)</small></em>.
          </p>
          <p>
            <strong>
              © 2016-2022 <a href="https://votolegal.com.br" target="_blank">Voto Legal</a>
              • Uma iniciativa <a href="http://appcivico.com" target="_blank">AppCívico</a> - Tecnologias Cívicas
            </strong>
          </p>
        </div>
      </div>
    </div>

    <template
      v-if="whatsAppNumber"
    >
      <a
        :href="`https://api.whatsapp.com/send?phone=${whatsAppNumber}`"
        style="position:fixed;width:60px;height:60px;bottom:40px;right:40px;background-color:#25d366;color:#FFF;border-radius:50px;text-align:center;font-size:30px;
				box-shadow: 1px 1px 2px #888; z-index:1000; text-decoration: none;"
        target="_blank"
      >
        <i
          style="margin-top:16px"
          class="fa fa-whatsapp"
        />
      </a>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
      >
    </template>

    <div class="notifications-wrapper">
      <Notification message="Apoie você também!"
      :title="`R$${recentDonationAmount} acabam de ser doados por ${recentDonationFirstName}!`"
      :duration="5000" />
    </div>
  </footer>
</template>

<script>
import Notification from '@/components/Notification.vue';
import { mapGetters, mapState } from 'vuex';

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
    whatsAppNumber() {
      return this.candidate.whatsapp_number
        ? this.candidate.whatsapp_number.replace(/[^0-9]/g, '')
        : '';
    },
    candidate() {
      return this.generateCandidateObject.candidate;
    },
    recentDonationAmount() {
      const { amount = 0 } = this.recentDonation;

      return amount / 100;
    },
    recentDonationFirstName() {
      const { name = '' } = this.recentDonation;
      const firstName = name.substr(0, name.indexOf(' ')) || name;

      return firstName;
    },
    ...mapGetters(['generateCandidateObject']),
    ...mapState(['recentDonation']),
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
