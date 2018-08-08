function validate(fields) {
  const keys = Object.keys(fields);
  const errors = {};
  let valid = true;

  // eslint-disable-next-line
  keys.map(item => {
    if (fields[item] === '') {
      valid = false;
      errors[item] = 'Campo obrigatório';
    }
  });

  return { valid, errors };
}

function formatBRLDec(amount) {
  let formated = `${amount}`;
  formated = formated.replace(/([0-9]{2})$/g, ',$1');

  if (formated.length > 6) {
    formated = formated.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
  }

  return formated;
}

function thousandsSeparator(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatBRL(amount) {
  let formated = `${amount}`;

  formated = formated.substring(0, formated.length - 2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return formated;
}

function cleanPhone(phone) {
  return `+55${phone
    .trim()
    .replace(/\W+/g, '')
    .replace(/\D+/g, '')}`;
}

function formatDate(data) {
  const week = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const date = new Date(data);

  const weekDay = week[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const time = data
    .split('T')[1]
    .replace(':', 'h')
    .split(':')[0];

  return `${weekDay}, ${day} de ${month} de ${year} - ${time}`;
}

function removeAccented(value) {
  let newString = value.toLowerCase();
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g,
  };
  const keys = Object.keys(mapaAcentosHex);

  keys.map((item) => {
    const expressaoRegular = mapaAcentosHex[item];
    newString = newString.replace(expressaoRegular, item);
  });

  return newString;
}

function formatDateBasic(date) {
  if (date) {
    const newDate = date.split(' ')[0].split('-');
    return newDate.reverse().join('/');
  }
  return date;
}

function formatCNPJ(value) {
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// eslint-disable-next-line
export {
  validate,
  formatBRL,
  cleanPhone,
  formatDate,
  formatCNPJ,
  removeAccented,
  formatDateBasic,
  formatBRLDec,
  thousandsSeparator,
};
