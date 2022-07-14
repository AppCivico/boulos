<template>
  <main id="conteudo">
    <article class="home__intro">
      <div class="container">
        <template v-if="candidate.summary">
          <h2>Por que doar?</h2>

          <div v-html="parseMD(candidate.summary)" />
        </template>

        <section id="campaign-progress" class="campaign-progress">
          <p>
            <span class="currency">R$</span>
            <strong class="amount" v-inView="isAmountOnViewport">
              <template v-if="totalAmount">
                <span>
                  <animated-number :value="amountInView ? totalAmount : 0" :formatValue="FormatFixedBRL"
                    :duration="1000" />
                  <small v-if="centsOfTotal" class="campaign-progress__meta-cents">,{{ centsOfTotal
                    }}</small>
                </span>
              </template>
              <template v-else>0</template>
            </strong>
          </p>
          <p class="campaign-progress-amount">
            {{ totalDonors | thousandsSeparator }} doações realizadas
          </p>

          <div role="progressbar" aria-valuemin="0" :aria-valuenow="totalAmount" :aria-valuemax="expected"
            v-if="donationSources.length > 1">

            <template v-if="source.total_donated">
              <div v-for="(source, i) in donationSources" :key="i" :style="progressBarStyle(source)"
                :title="`${percentage(source.total_donated)}% via ${source.name}`">
                {{ percentage(source.total_donated) }}
              </div>
            </template>
          </div>
          <progress :value="totalAmount" :max="expected" v-else>
            <div role="progressbar" :aria-valuenow="totalAmount" :aria-valuemax="expected">
              <div :style="{ width: `${percentage(totalAmount)}%` }">
                {{ percentage(totalAmount) }}
              </div>
            </div>
          </progress>

          <p class="campaign-progress-percentage">
            {{ percentage() }}% da meta de R$&nbsp;{{ expected | formatBRL }}
            <a :href="`#goal-description__${expected}`" v-if="summary">{{
            summary }}</a>
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
            <div :key="project.id + '__scope'" v-html="parseMD(project.scope)" />
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

        <div v-html="parseMD(candidate.biography)" />
      </div>
    </article>

    <article id="home__goals" class="home__goals" v-if="currentAndPastGoals.length">
      <div class="container" id="donation-wrap">
        <h2>
          Metas
        </h2>

        <div v-for="(item, index) in currentAndPastGoals" :key="index" :id="`goal-description__${item.goal}`"
          class="goal-description" :class="{
            'goal-description--reached': (candidate.total_donated >=
              item.goal)
          }">
          <h3>
            <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
              v-if="candidate.total_donated >= item.goal">
              <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z" />
            </svg>
            META {{ currentAndPastGoals.length - index }} - R$&nbsp;{{ FormatFixedBRL(item.goal) }}
          </h3>

          <h4 v-if="item.summary">{{ item.summary }}</h4>
          <div v-html="parseMD(item.description)" />
        </div>
      </div>
    </article>

    <article id="home__donors" class="home__donors">
      <div class="container" id="donation-wrap">
        <h2>
          Doadores
        </h2>

        <div v-if="candidateWithProjectAndDonations.candidate &&
        candidateWithProjectAndDonations.candidate.donors_message"
        v-html="parseMD(candidateWithProjectAndDonations.candidate.donors_message)"></div>

        <p>
          <span v-for="(person, i) in donors" :key="i">
            {{ person | titleCase }}{{ i !== donors.length - 1 ? ',' : '' }}
          </span>
        </p>

        <div class="nav-link-donations-wrap">
          <router-link class="nav-link-donations" to="/doadores" target="_blank">
            ver dados completos
          </router-link>
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
            Siga os passos nessa plataforma. Você pode doar através de PIX,
            cartão de crédito ou boleto bancário.
          </p>
        </details>
        <details>
          <summary>
            <span class="caret"></span>
            É seguro?
          </summary>
          <p>
            Claro. A plataforma é cadastrada no TSE e foi escolhida porque
            permite a segurança de nossos doadores.
          </p>
        </details>
        <details>
          <summary>
            <span class="caret"></span>
            Terei algum comprovante?
          </summary>
          <p>
            Os recibos são enviados para o seu e-mail, cadastrado no momento da
            doação. No período de pré-campanha, será enviado um recibo
            provisório logo após sua doação ser aprovada. Já no período de
            campanha, será enviado o recibo de doação eleitoral.
          </p>
        </details>
        <details>
          <summary>
            <span class="caret"></span>
            Quanto posso doar?
          </summary>
          <p>
            Para apoiar uma candidatura você pode doar até 10% de sua renda
            declarada para a Receita no ano anterior. No
            caso de não ter declarado renda o limite este ano é de R$&nbsp;2.855,00.
          </p>
          <p>
            Agora, aqui na plataforma, o limite máximo diário é de R$&nbsp;1.064,09.
            Caso queira doar mais, aí será
            necessário realizar mais de uma doação em dias diferentes.
          </p>
        </details>
      </div>
    </article>

    <div class="candidate-footer">
      <img src="../assets/images/icons/logo__slogan.svg" alt="Logotipo campanha" class="candidate-footer__logo" />
      <p>
        Eleição 2022 {{ candidate.name }}
      </p>

      <p v-if="candidate.cnpj" class="candidate-cnpj">
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
import { mapActions, mapGetters, mapState } from 'vuex';
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
import CONFIG from "@/config";
import AnimatedNumber from 'animated-number-vue';
import { FormatFixedBRL, parseMD } from '../utilities';

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
  mounted({ candidateId } = this) {
    this.GET_CANDIDATE_INFO(candidateId).finally(() => {
      this.$nextTick(() => {
        this.$emit('updateHead');
        window.prerenderReady = true;
      });
    });
    this.GetDonorsNames(candidateId);
    this.UPDATE_DONATIONS_SUMMARY(candidateId);
  },
  computed: {
    candidateId() {
      switch (true) {
        case window.location.hostname === ('localhost'):
        case window.location.hostname.indexOf('192.168') === 0:
        case window.location.hostname.indexOf('dev.') === 0:
        case window.location.hostname.indexOf('test.') === 0:
        case window.location.hostname.indexOf('.local') > -1:
          return this.$route?.query?.candidate_id || CONFIG.candidateId;

        default:
          return CONFIG.candidateId;
      }
    },

    footerLogo({ candidateWithProjectAndDonations } = this) {
      return candidateWithProjectAndDonations?.candidate?.footer_logo;
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

    summary() {
      const { totalAmount, goals } = this;

      return (goals.find((x) => x.goal > totalAmount)
        || goals[goals.length - 1] || {}).summary
        || '';
    },

    ...mapGetters(['currentAndPastGoals', 'donationSources', 'candidateWithProjectAndDonations', 'expected', 'goals', 'totalAmount']),
    ...mapState(['candidate', 'donors']),
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
    isAmountOnViewport(_evt, el) {
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
    FormatFixedBRL,
    parseMD,

    ...mapActions(['GET_CANDIDATE_INFO', 'GetDonorsNames', 'UPDATE_DONATIONS_SUMMARY']),
  },
  directives: {
    inView: {
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
