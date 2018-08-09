<template>
<main id="conteudo">
    <article class="home__intro">
      <div class="container">
    <h2>
      É possível construir um&nbsp;Brasil sem&nbsp;desigualdades
    </h2>

    <p>Mas para mudar este quadro é preciso enfrentar os privilégios e o domínio
    da velha política. A candidatura de Guilherme Boulos e Sonia Guajajara é a
    expressão da indignação com o modelo político existente e com a exclusão de
    milhões de brasileiros e brasileiras de condições de ter uma vida digna.</p>
    <p>Vamos sem medo de enfrentar os poderosos e precisamos de sua ajuda.</p>

    <section id="campaign-progress" class="campaign-progress">
    <p>
      <span class="currency">R$</span>
      <strong class="amount" v-inview="isAmountOnViewport">
      <template v-if="candidate.total_donated">
        <span>
          <animated-number
            :value="amountInView ? candidate.total_donated : 0"
            :formatValue="FormatFixedBRL"
            :duration="1000"/>
        </span>
      </template>
      <template v-else>0</template>
      </strong>
    </p>
    <p class="campaign-progress-amount">
      {{ candidate.people_donated | thousandsSeparator }} doações realizadas
    </p>

    <progress :value="candidate.total_donated" :max="expected">
      <div class="progress-bar">
      <span :style="{width: `${porcentage}%`}">
        {{ porcentage }}
      </span>
      </div>
    </progress>

    <p class="campaign-progress-porcentage">
      {{ porcentage }}% da meta de R$ {{ expected | formatBRL }}
    </p>

    <p>
      <a href="#home__donors" class="campaign-progress__link" v-scroll-to="'#home__donors'">
        Veja quem doou
      </a>
    </p>

    </section>
  </div>
  </article>

  <article id="doar" class="home__donate">
    <div class="container" id="donation-wrap">
      <Payment />
    </div>
  </article>

  <article id="home__donors" class="home__donors">
  <div class="container" id="donation-wrap">
    <h2>
    Doadores
    </h2>

    <p>Terra, teto, trabalho e liberdade. Justiça, segurança e um futuro digno.
      Muito além da renda, é em torno desses direitos que se expressa a radical
      desigualdade brasileira. E é em nome desses direitos que nossa democracia, mais uma vez,
      precisa ser reconstruída.</p>
    <p>Veja quem está com Boulos e Sônia sem medo de mudar o Brasil:</p>

      <p>
      <span v-for="(person, i) in donors" :key="i">
      {{ person | titleCase }}{{ i < donors.length -1 ? ',' : '' }}
      </span>
      </p>

      <div class="nav-link-donations-wrap">
        <a class="nav-link-donations" href="/doadores" target="_blank">
          ver dados completos
        </a>
      </div>
  </div>
  </article>


</main>
</template>

<script>
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
import AnimatedNumber from 'animated-number-vue';

export default {
  data() {
    return {
      amountInView: false,
    };
  },
  name: 'home',
  components: {
    Payment,
    AnimatedNumber,
  },
  mounted() {
    const candidateId = (window.location.host === 'doeboulos.com.br' || window.location.host === 'test.doeboulos.com.br') ? 230 : 200;
    this.$store.dispatch('GET_CANDIDATE_INFO', candidateId);
    this.$store.dispatch('GetDonorsNames', candidateId);
    this.$store.dispatch('UPDATE_DONATIONS_SUMMARY', candidateId);
  },
  computed: {
    candidate() {
      return this.$store.state.candidate;
    },
    donors() {
      return this.$store.state.donors;
    },
    donationsRecentCount() {
      return this.$store.state.donationsRecentCount;
    },
    donationsRecent() {
      return this.$store.state.donationsRecent;
    },
    hasMoreDonations() {
      return this.$store.state.hasMoreDonations;
    },
    expected() {
      if (this.candidate) {
        if (this.candidate.raising_goal) {
          return this.candidate.raising_goal;
        }
      }
      return 0;
    },
    porcentage() {
      if (this.candidate) {
        const value = (this.candidate.total_donated * 100) / this.expected;
        return Math.round(value);
      }
      return 0;
    },
  },
  methods: {
    FormatFixedBRL(amount) {
      let formated = `${(amount / 100).toFixed(2)}`;

      formated = formated
        .substring(0, formated.length - 2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
        .replace(/\.+$/, '');
      return formated;
    },
    isAmountOnViewport(evt, el) {
      const rect = el.getBoundingClientRect();
      const inView = (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );

      this.$data.amountInView = inView;

      return this.$data.amountInView;
    },
  },
  directives: {
    inview: {
      inserted: (el, binding) => {
        const f = (evt) => {
          if (binding.value(evt, el)) {
            window.removeEventListener('scroll', f);
          }
        };
        window.addEventListener('scroll', f);
        f();
      },
    },
  },
};
</script>
