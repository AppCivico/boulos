import parser from '../vendor/markdown.min';

function parseMD(content) {
  return parser.parse(content).innerHTML;
}

function pad(n, width, z = '0') {
  const s = String(n);
  return s.length >= width ? s : new Array(width - s.length + 1).join(z) + s;
}

function scrollTo($eventOrId) {
  const targetQuery = typeof $eventOrId === 'string'
    ? `#${$eventOrId}`
    : $eventOrId.target.getAttribute('href');
  const targetEl = document.querySelector(targetQuery);

  targetEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  window.history.pushState(null, null, targetQuery);
}

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
  let formatted = `${amount}`;
  formatted = formatted.replace(/([0-9]{2})$/g, ',$1');

  if (formatted.length > 6) {
    formatted = formatted.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
  }

  return formatted.replace(/^[0.]+/, '');
}

function thousandsSeparator(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatBRL(amount) {
  let formatted = `${amount}`;

  formatted = formatted
    .substring(0, formatted.length - 2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return formatted;
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
  return value.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  );
}

function getQueryString(url) {
  const queryString = url.indexOf('?') !== -1
    ? url.split('?')[1]
    : [];
  const params = {};
  const queries = queryString.indexOf('&') !== -1
    ? queryString.split('&')
    : [queryString];

  for (let i = 0; i < queries.length; i += 1) {
    const element = queries[i].indexOf('=') !== -1
      ? queries[i].split('=')
      : [queries[i], null];
    params[decodeURIComponent(element[0])] = decodeURIComponent(element[1] || '');
  }
  return params;
}

const randomString = (len = 40) => [...crypto.getRandomValues(new Uint8Array(999))].map((c) => String.fromCharCode(c).replace(/[^a-zA-Z0-9]/i, '')).join('').substr(0, len);

function FormatFixedBRL(amount) {
  const formatted = `${(amount / 100).toFixed(2)}`;

  return formatted
    .substring(0, formatted.length - 2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    .replace(/\.+$/, '');
}

function formatCPF(value) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)
    ? value
    : value.trim().replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4');
}

function maskCPF(value) {
  return formatCPF(value).replace(/^\d{3}/, '***').replace(/\d{2}$/, '**');
}

function maskName(value) {
  return value.trim().split(' ').map((x, i) => (i === 0 ? x : x.replace(/(?!^).(?!$)/g, '*'))).join(' ');
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((resolve, reject) => {
    try {
      return document.execCommand('copy')
        ? resolve()
        : reject();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  });
}

function copyTextToClipboard(text) {
  return !navigator.clipboard
    ? fallbackCopyTextToClipboard(text)
    : navigator.clipboard.writeText(text);
}

export {
  validate,
  formatBRL,
  FormatFixedBRL,
  formatCPF,
  maskCPF,
  maskName,
  cleanPhone,
  formatDate,
  formatCNPJ,
  removeAccented,
  formatDateBasic,
  formatBRLDec,
  thousandsSeparator,
  getQueryString,
  scrollTo,
  parseMD,
  pad,
  copyTextToClipboard,
  randomString,
};
