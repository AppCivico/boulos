<template>
<main id="conteudo">
  <div class="fb-customerchat"
    attribution=setup_tool
    page_id="398845206932703"
    logged_in_greeting="Agradecemos a todos que depositaram seus sonhos nas urnas votando 50"
    logged_out_greeting="Agradecemos a todos que depositaram seus sonhos nas urnas votando 50"
    theme_color="#5a0197">
  </div>
  <article class="home__intro">
    <div class="container">
      <h2>
        Por que doar?
      </h2>

      <p>É hora de reconstruir o país e de acabar com o poder do Centrão, que
      hoje faz o que quer no Congresso Nacional: controla o Orçamento da União e
      decide quem governa e quem cai.</p>

      <p>Por isso, temos a missão de eleger Guilherme Boulos como o Deputado
      Federal mais bem votado de São Paulo e formar a maior bancada de esquerda
      da Câmara dos Deputados. Só assim conseguiremos revogar a reforma
      trabalhista e o teto de gastos, criar condições para combater a fome, o
      desemprego e a recessão econômica. Vamos fazer uma profunda reforma
      tributária e retomar investimentos públicos.</p>

      <p>Precisamos provar que o Brasil é mais forte do que Bolsonaro e seus
      filhos. E para isso, precisamos de você, que não desistiu de uma sociedade
      mais justa e que acredita num país que não está à venda. Ajude a financiar
      o nosso projeto de retomada da democracia.
      </p>

      <p>Vamos sem medo. O futuro é a gente que faz. Doe para Boulos Federal.</p>

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
              :title="`${porcentage(source.total_donated)}% via ${source.name}`"
            >
              {{ porcentage(source.total_donated) }}
            </div>
          </template>
        </div>
        <progress :value="totalAmount" :max="expected" v-else>
          <div role="progressbar" :aria-valuenow="totalAmount" :aria-valuemax="expected">
            <div :style="{width: `${porcentage(totalAmount)}%`}">
              {{ porcentage(totalAmount) }}
            </div>
          </div>
        </progress>

        <p class="campaign-progress-porcentage">
          {{ porcentage() }}% da meta de R$&nbsp;{{ expected | formatBRL }}
          <a
            :href="`#goal-description__${expected}`"
            v-if="summary"
          >{{ summary }}</a>
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

      <h2>
        Projetos prioritários
      </h2>
      <h3>
        Revogação da Reforma Trabalhista
      </h3>
      <p>
        A reforma foi vendida com a promessa da criação de cinco milhões de empregos. Como resultado, tivemos as maiores taxas de desemprego dos últimos anos. Precisamos de propostas para a parcela precarizada das trabalhadoras e trabalhadores, como um novo marco regulatório das relações trabalhistas que garantam bem-estar e segurança para os trabalhadores sem direitos, além do fortalecimento dos sindicatos, impactados negativamente pelas medidas pós-golpe.
      </p>

      <h3>
        Fim do teto de gastos
      </h3>
      <p>
        O Teto de Gastos impede a economia de voltar a crescer e impossibilita a
        distribuição de renda e a inclusão social. E este não é só um caso
        brasileiro: países que implementaram o ajuste fiscal tiveram baixo
        crescimento. A regra do Teto de Gastos levou o país à crise econômica e
        social que estamos hoje. Precisamos de uma regra fiscal com
        responsabilidade social para que haja uma agenda de mudanças do país:
        acabar com a fome, desemprego e ter direito ao futuro.
      </p>

      <h3>
        Defesa dos serviços públicos e do patrimônio nacional
      </h3>
      <p>
        Depois de 2008, os países redescobriram a importância do papel do Estado
        para que a economia cresça, principalmente em momento de crise. Hoje, as
        nossas empresas nacionais servem ao interesse de poucos acionistas, para
        fins de acumulação privada, inclusive estrangeira. Um exemplo é a
        Política de Preços da Petrobrás que distribui renda dos mais pobres, que
        compram gasolina cara na bomba, enquanto os mais ricos acumulam ações da
        estatal. Retomar nossas empresas e torná-las públicas significa
        recuperar a responsabilidade do Estado na garantia de empregos e
        direitos para o povo brasileiro.
      </p>

    </div>
  </article>

  <article id="doar" class="home__donate">
    <div class="container" id="donation-wrap">
      <Payment />
    </div>
  </article>

  <article id="home__knowMore" class="home__knowMore">
    <div class="container" id="donation-wrap">
      <h2>
        Conheça o candidato
      </h2>

      <p>Guilherme Boulos é professor, ativista social do Movimento dos
      Trabalhadores Sem Teto (MTST) e da Frente Povo Sem Medo. Concorreu no
      primeiro e segundo turno à Prefeitura de São Paulo em 2020 e à Presidência
      da República pelo PSOL em 2018, sendo o mais jovem a postulante ao cargo
      na história do Brasil.</p>

      <p>Sua atuação é marcada na luta contra as desigualdades e por um novo
      modelo de sociedade. Aos 20 anos, deixou sua casa para morar e atuar em
      uma ocupação sem teto. Liderança social consolidada, é formado em
      Filosofia pela USP, especializado em Psicanálise pelo Cogeae/PUC e Mestre
      em Psiquiatria pela USP. Já deu aulas na rede pública de ensino do Estado
      de São Paulo e em várias Instituições.</p>

      <p>Atualmente, ministra Cursos de Extensão na Escola de Sociologia e
      Política (ESP) e Cursos Livres pelo Instituto Democratize, iniciativa que
      coordena. Sua atuação rendeu o prêmio Santos Dias de Direitos Humanos,
      concedido pela Assembléia Legislativa de São Paulo em 2017, além da
      Medalha do Mérito Legislativo em 2016, concedida pela Câmara dos Deputados
      em Brasília, dentre outros.</p>

      <p>Após as eleições, retomou sua atividade como professor e sua atuação no
      MTST e na Povo Sem Medo e segue como uma das lideranças sociais de
      oposição ao Governo Bolsonaro.</p>

      <p>É pai da Sofia e da Laura e marido da Natalia.</p>

    </div>
  </article>

  <article id="home__goals" class="home__goals">
    <div class="container" id="donation-wrap">
      <h2>
        Metas
      </h2>

    <div
        v-for="(item, index) in goalsWithDescription"
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

        <h4>
            {{ porcentage(totalAmount, item.goal) }}% da primeira meta,
            necessária para a contratação de uma equipe de comunicação em agosto
        </h4>

        <p>{{ item.description }}</p>
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
        Eleição 2020 Guilherme Castro Boulos Prefeito
      </p>
      <p
        class="candidate-footer__cnpj"
      >
        <abbr title="Cadastro Nacional Pessoa Jurídica">CNPJ</abbr>
        38.642.015/0001-26
      </p>
  </div>

</main>
</template>

<script>
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
import { root } from '@/data/goals.json';
// eslint-disable-next-line
import AnimatedNumber from 'animated-number-vue';

export default {
  data() {
    return {
      amountInView: false,
      goals: root,
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

      return (goals.find((x) => x.goal > totalAmount)
        || goals[goals.length - 1]).goal
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
  },
  methods: {
    porcentage(amount = this.totalAmount, expected = this.expected) {
      return Math.round((parseFloat(amount) * 100) / Math.max(this.totalAmount, expected))
        || 0;
    },
    progressBarStyle(source) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${source.opacity}), rgba(0, 0, 0, ${source.opacity}))`,
        width: `${this.porcentage(source.total_donated)}%`,
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
