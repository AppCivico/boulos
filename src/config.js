let candidateId;
let api = process.env.VUE_APP_API_ORIGIN;

switch (window.location.hostname) {
  case 'boulos.com':
  case 'boulos.com.br':
  case 'www.boulos.com':
  case 'www.boulos.com.br':
  case 'boulos.votolegal.com.br':
    candidateId = 10325;
    break;

  case 'doepoit.com':
  case 'doepoit.com.br':
  case 'www.doepoit.com':
  case 'www.doepoit.com.br':
  case 'poit.votolegal.com.br':
    candidateId = 10357;
    api = 'https://api2022vl.appcivico.com';
    break;

  case 'omelhorprorio.com.br':
  case 'molon.votolegal.com.br':
    candidateId = 10439;
    api = 'https://api2022vl.appcivico.com';
    break;

  case 'doe.marinasilva.org.br':
  case 'doar.marinasilva.org.br':
  case 'marinasilva.votolegal.com.br':
    candidateId = 10459;
    api = 'https://api2022vl.appcivico.com';
    break;

  default:
    break;
}

export default {
  api,
  tokenName: process.env.VUE_APP_TOKEN_NAME,
  candidateId,
  contract: 'https://participe.votolegal.com.br/files/Termo%20de%20uso%20e%20Politica%20de%20privacidade%20(unificado)%20-%20Voto%20Legal%20-%202020%402020-09-23.pdf',
  ToS: 'tos/Termo%20de%20uso%20e%20Politica%20de%20privacidade%20(unificado)%20-%20Voto%20Legal%20-%202022.pdf',
  taxes: {
    credit_card: {
      label: 'cartão de crédito',
      text: '5,5%',
      percent: 5.5,
      tax: 0,
    },
    boleto: {
      label: 'boleto pago',
      text: '3,5% + R$ 3,90',
      percent: 3.5,
      tax: 390,
    },
    pix: {
      label: 'PIX',
      text: '2,99%',
      percent: 2.99,
      tax: 0,
    },
  },
};
