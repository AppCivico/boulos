<template>
<main id="conteudo">
  <article class="home__intro">
    <div class="container">
      <template v-if="candidate.summary">
        <h2>Por que doar?</h2>

        <div v-html="parseMD(candidate.summary)"></div>
      </template>

      <section id="campaign-progress" class="campaign-progress">
        <p>
          <span class="currency">R$</span>
          <strong class="amount" v-inview="isAmountOnViewport">
          <template v-if="totalAmount">
            <span>
              <animated-number
                :value="amountInView ? totalAmount : 0"
                :formatValue="FormatFixedBRL"
                :duration="1000"/>
                <small v-if="centsOfTotal"
                class="campaign-progress__meta-cents">,{{ centsOfTotal }}</small>
            </span>
          </template>
          <template v-else>0</template>
          </strong>
        </p>
        <p class="campaign-progress-amount">
            {{ totalDonors | thousandsSeparator }} doações realizadas
        </p>

        <div role="progressbar" aria-valuemin="0"
          :aria-valuenow="totalAmount" :aria-valuemax="expected"
          v-if="donationSources.length > 1">

          <template
            v-if="source.total_donated"
          >
            <div v-for="(source, i) in donationSources" :key="i"
              :style="progressBarStyle(source)"
              :title="`${percentage(source.total_donated)}% via ${source.name}`"
            >
              {{ percentage(source.total_donated) }}
            </div>
          </template>
        </div>
        <progress :value="totalAmount" :max="expected" v-else>
          <div role="progressbar" :aria-valuenow="totalAmount" :aria-valuemax="expected">
            <div :style="{width: `${percentage(totalAmount)}%`}">
              {{ percentage(totalAmount) }}
            </div>
          </div>
        </progress>

        <p class="campaign-progress-percentage">
          {{ percentage() }}% da meta de R$&nbsp;{{ expected | formatBRL }}
          <a
            :href="`#goal-description__${expected}`"
            v-if="summary"
          >{{ summary.toLowerCase() }}</a>
        </p>

        <div v-if="donationSources.length > 1" class="donations-sources">
          <p>Sendo:</p>
          <ul>
            <li v-for="(source, i) in donationSources" :key="i">
              <strong class="donations-sources__amount">
                R$ {{ source.total_donated | formatBRLDec }}
              </strong> /
              <em class="donations-sources__donations">
                {{ source.people_donated }}
              </em>
              doações via
              <details v-if="source.cnpj || source.social_name">
                <summary>{{ source.name }}</summary>
                <p v-if="source.cnpj">
                  <em>
                    <abbr title="Cadastro Nacional de Pessoa Jurídica">CNPJ</abbr>:
                  </em>
                  {{ source.cnpj | formatCNPJ }}
                </p>
                <p v-if="source.social_name">
                  <em>
                    Razão social:
                  </em>
                  {{ source.social_name }}
                </p>
              </details>
              <template v-else>
                {{ source.name }}
              </template>
            </li>
          </ul>
        </div>

        <p>
          <a href="#home__donors" class="campaign-progress__link" v-scroll-to="'#home__donors'">
            Veja quem doou
          </a>
        </p>

      </section>

      <template v-if="candidate.projects">
        <h2>
          Projetos prioritários
        </h2>
        <template v-for="project in candidate.projects">
          <h3 :key="project.id + '__title'">{{ project.title }}</h3>
          <div :key="project.id + '__scope'" v-html="parseMD(project.scope)"></div>
        </template>
      </template>
    </div>
  </article>

  <article id="doar" class="home__donate">
    <div class="container" id="donation-wrap">
      <Payment />
    </div>
  </article>

  <article id="home__knowMore" class="home__knowMore" v-if="candidate.biography">
    <div class="container" id="donation-wrap">
      <h2>
        Conheça o candidato
      </h2>

      <div v-html="parseMD(candidate.biography)"></div>
    </div>
  </article>

  <article id="home__goals" class="home__goals">
    <div class="container" id="donation-wrap">
      <h2>
        Metas
      </h2>

    <div
        v-for="(item, index) in currentAndPastGoals"
        :key="index"
        :id="`goal-description__${item.goal}`"
        class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= item.goal) }"
      >
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= item.goal">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META {{ index + 1 }} - R$&nbsp;{{ FormatFixedBRL(item.goal) }}
        </h3>

        <h4 v-if="item.summary">{{ item.summary }}</h4>
        <div v-html="parseMD(item.description)"></div>
      </div>
    </div>
  </article>

  <article id="home__donors" class="home__donors">
    <div class="container" id="donation-wrap">
      <h2>
      Doadores
      </h2>

      <p>
        Veja aqueles sem medo de transformar o Congresso Nacional que já
        contribuíram para que nossas propostas alcancem cada vez mais pessoas,
        nesta batalha encabeçada por <strong>Guilherme Boulos</strong>, na
        esperança de acabar com os privilégios e as desigualdades.
      </p>

      <p>
        <span v-for="(person, i) in donors" :key="i">
        {{ person | titleCase }}{{ i !== donors.length -1 ? ',' : '' }}
        </span>
      </p>

      <div class="nav-link-donations-wrap">
        <a class="nav-link-donations" href="/doadores" target="_blank">
          ver dados completos
        </a>
      </div>
    </div>
  </article>

  <article id="home__faq" class="home__faq">
    <div class="container" id="donation-wrap">
      <h2>
        Perguntas Frequentes
      </h2>
      <details>
        <summary>
          <span class="caret"></span>
          Como fazer a doação?
        </summary>
        <p>
          Siga os passos nessa plataforma. Você pode doar no cartão de crédito
          ou boleto bancário.
        </p>
      </details>
      <details>
        <summary>
          <span class="caret"></span>
          É seguro?
        </summary>
        <p>
          Claro. A plataforma é cadastrada no TSE e foi escolhida por que
          permite a segurança de nossos doadores.
        </p>
      </details>
      <details>
        <summary>
          <span class="caret"></span>
          Terei algum comprovante?
        </summary>
        <p>
          Será enviado um recibo provisório logo após sua doação ser aprovada.
          Depois será enviado o recibo de doação eleitoral.
        </p>
      </details>
      <details>
        <summary>
          <span class="caret"></span>
          Quanto posso doar?
        </summary>
        <p>
          Para apoiar uma candidatura você pode doar até 10% de sua renda
          declarada para a Receita no ano anterior. No caso de não ter declarado
          renda o limite este ano é de R$&nbsp;2855,00.
        </p>
        <p>
          Agora, aqui na plataforma, o limite máximo é de R$&nbsp;1064,10. Caso
          queira doar mais, aí será necessário transferência direta para a conta
          de nossa candidatura.
        </p>
      </details>
    </div>
  </article>

  <div class="candidate-footer">
      <img
        src="../assets/images/icons/logo__slogan.svg"
        alt="Logotipo campanha"
        class="candidate-footer__logo">
      <p>
        Eleição 2022 {{ candidate.name }}
      </p>

      <p
        v-if="candidate.cnpj"
        class="candidate-cnpj"
      >
        <strong>
          <abbr title="Cadastro Nacional de Pessoa Jurídica">CNPJ</abbr>
          da campanha:
        </strong>
        {{ candidate.cnpj | formatCNPJ }}
      </p>
  </div>

</main>
</template>

<script>
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
import { root as fallbackGoals } from '@/data/goals.json';
import { parseMD } from '../utilities';
// eslint-disable-next-line
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
    const candidateId = process.env.VUE_APP_CANDIDATE_ID;
    this.$store.dispatch('GET_CANDIDATE_INFO', candidateId);
    this.$store.dispatch('GetDonorsNames', candidateId);
    this.$store.dispatch('UPDATE_DONATIONS_SUMMARY', candidateId);
  },
  computed: {
    candidate() {
      return this.$store.state.candidate;
    },
    goals({ candidate } = this) {
      return candidate.multiple_goals && candidate.multiple_goals.length
        ? candidate.multiple_goals
        : fallbackGoals;
    },
    donationSources() {
      let opacity = 0;
      return this.$store.state.donationSources
        .map((x) => {
          const y = x;
          y.opacity = opacity;
          opacity += 0.25;
          return y;
        });
    },
    totalAmount() {
      return this.donationSources.length
        ? this.donationSources.reduce(
          (accumulator, currentValue) => accumulator + currentValue.total_donated,
          0,
        )
        : (this.candidate.total_donated || 0);
    },
    centsOfTotal() {
      const stringOfTotalAmount = String(this.totalAmount);
      const cents = stringOfTotalAmount.substring(stringOfTotalAmount.length - 2);
      return cents !== '00' ? cents : '';
    },
    totalDonors() {
      return this.donationSources.length
        ? this.donationSources.reduce(
          (accumulator, currentValue) => accumulator
            + Number.parseInt(currentValue.people_donated || 0, 10),
          0,
        )
        : Number.parseInt(this.candidate.people_donated || 0, 10);
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
      const { totalAmount, goals } = this;

      return (goals.find((x) => x.goal > totalAmount) || goals[goals.length - 1]).goal
        || (this.candidate || {}).raising_goal
        || 0;
    },
    summary() {
      const { totalAmount, goals } = this;

      return (goals.find((x) => x.goal > totalAmount)
        || goals[goals.length - 1]).summary
        || '';
    },
    goalsWithDescription() {
      return (this.goals || []).filter((x) => !!x.description);
    },
    currentAndPastGoals() {
      const { expected, goalsWithDescription } = this;

      return goalsWithDescription.filter((x) => x.goal <= expected);
    },
  },
  methods: {
    percentage(amount = this.totalAmount, expected = this.expected) {
      return Math.floor((parseFloat(amount) * 100) / Math.max(this.totalAmount, expected))
        || 0;
    },
    progressBarStyle(source) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${source.opacity}), rgba(0, 0, 0, ${source.opacity}))`,
        width: `${this.percentage(source.total_donated)}%`,
      };
    },
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
        rect.width > 0
        && rect.height > 0
        && rect.top >= 0
        && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );

      this.$data.amountInView = inView;

      return this.$data.amountInView;
    },
    parseMD,
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
