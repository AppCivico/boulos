let api = 'https://votolegal-test-api.appcivico.com';
let tokenName = 'dev_dat22_token';

switch (window.location.host) {
  case 'votolegal.com.br':
  case 'votolegal.com':
  case '2022.votolegal.com.br':
  case '2022.votolegal.com':
  case 'doeboulos.com':
  case 'doeboulos.com.br':
    api = 'https://api2022vl.appcivico.com';
    tokenName = 'prod_dat22_token';
    break;

  default:
    break;
}

export default {
  api,
  tokenName,
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
