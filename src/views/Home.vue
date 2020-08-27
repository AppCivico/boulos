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

      <p>
        É hora de mostrar que outro projeto de Brasil é possível e ele pode
        começar em São Paulo.  Agora, temos a chance de ser a capital da
        resistência e da esperança.  Resistência ao Bolsonarismo, ao atraso, ao
        autoritarismo. Esperança em sermos um polo de defesa democrática no
        Brasil através de uma chapa formada por um encontro de gerações.
      </p>
      <p>
        Nossa pré-candidatura representa o combate à desigualdade. Desigualdade
        também refletida nas campanhas, com os candidatos da elite que têm mais
        tempo na TV, no rádio e mais recursos graças a apertos de mão com o
        fascismo e negociatas por baixo dos panos.
      </p>
      <p>
        Vamos inverter a ordem de prioridades no orçamento municipal, colocar
        educação, saúde e moradia em primeiro lugar. Transformar o transporte
        num direito de todos e não mais em máquina de lucro das máfias.
      </p>
      <p>
        A cidade e a economia estarão, de uma vez por todas, a serviço das
        pessoas e não o ontrário.
      </p>
      <p>
        Nossa política é feita com o povo que vem da luta dos movimentos sociais
        e com a ética de quem já governou São Paulo e combateu a ditadura.
        Precisamos de você, que não desistiu de uma sociedade mais justa para
        todas e todos e que acredita numa cidade de direitos e não de
        privilégios. Ajude a financiar o nosso projeto de solidariedade.
      </p>
      <p>
        Começar uma virada no Brasil é possível e ela pode partir aqui de São
        Paulo. <strong>Doe para Boulos e Erundina.</strong>
      </p>

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
            {{ totalDonors | thousandsSeparator }} doações realizadas
        </p>

        <div role="progressbar" aria-valuemin="0"
          :aria-valuenow="totalAmount" :aria-valuemax="expected"
          v-if="donationSources.length > 1">

          <div v-for="(source, i) in donationSources" :key="i"
            :style="progressBarStyle(source)"
            :title="`${porcentage(source.total_donated)}% via ${source.name}`"
            v-if="source.total_donated">
            {{ porcentage(source.total_donated) }}
          </div>
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
        </p>

        <div v-if="donationSources.length > 1" class="donations-sources">
          <p>Sendo:</p>
          <ul>
            <li v-for="(source, i) in donationSources" :key="i">
              <strong class="donations-sources__amount">
                R$ {{ source.total_donated | formatBRL }}
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
        Saiba mais
      </h2>

      <p>
        <strong>Guilherme Boulos</strong> é professor, ativista social do
        Movimento dos Trabalhadores Sem Teto (MTST) e da Frente Povo Sem Medo.
        Foi candidato a Presidência da República pelo PSOL em 2018, sendo o mais
        jovem a postulante ao cargo na história do Brasil. Sua atuação é marcada
        na luta contra as desigualdades e por um novo modelo de sociedade.
      </p>
      <p>
        Aos 20 anos, deixou sua casa para morar e atuar em uma ocupação sem
        teto. Liderança social consolidada, é formado em Filosofia pela USP,
        especializado em Psicanálise pelo Cogeae/PUC e Mestre em Psiquiatria
        pela USP. Já deu aulas na rede pública de ensino do Estado de São Paulo
        e em várias Instituições. Atualmente, ministra Cursos de Extensão na
        Escola de Sociologia e Política (ESP) e Cursos Livres pelo Instituto
        Democratize, iniciativa que coordena.
      </p>
      <p>
        Sua atuação rendeu o prêmio Santos Dias de Direitos Humanos, concedido
        pela Assembléia Legislativa de São Paulo em 2017, além da Medalha do
        Mérito Legislativo em 2016, concedida pela Câmara dos Deputados em
        Brasília, dentre outros.
      </p>
      <p>
        Após as eleições, retomou sua atividade como professor e sua atuação no
        MTST e na Povo Sem Medo e segue como uma das lideranças sociais de
        oposição ao Governo Bolsonaro.
      </p>
       <p>
        É pai da Sofia e da Laura e marido da Natalia.
      </p>

      <p>
        <strong>Luiza Erundina</strong> já governou a maior cidade da América
        Latina, sendo Prefeita de São Paulo entre os anos de 1989 e 1992. Hoje,
        está em seu 6º mandato de deputada federal. Tem atuado em defesa da
        classe trabalhadora, das minorias e dos excluídos.
      </p>
      <p>
        Nos mandatos que exerceu, foram apresentados mais de 80 projetos em
        defesa da Mulher, das Gestantes, das Crianças e Adolescentes, da Cultura
        e dos Direitos Humanos. Dentre as proposições, nove já viraram leis,
        além de uma emenda à Constituição.
      </p>
      <p>
        Na atual legislatura, atua na coordenação da Frente Parlamentar pela
        Liberdade de Expressão e o Direito à Comunicação com participação
        popular, que reúne parlamentares e representantes da sociedade civil
        para assegurar o exercício da liberdade de expressão e o direito à
        comunicação.
      </p>
      <p>
        Faz parte da Comissão de Ciência e Tecnologia, Comunicação e Informática
        (CCTCI), da Comissão de Legislação Participativa, (CLP) da qual foi sua
        primeira presidente, e integra a Comissão de Direitos Humanos e Minorias
        (CDHM).
      </p>
      <p>
        Luiza Erundina representa  ética e luta por dignidade do povo de São
        Paulo.
      </p>


    </div>
  </article>

  <article id="home__goals" class="home__goals">
    <div class="container" id="donation-wrap">
      <h2>
        Metas
      </h2>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 2800000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 2800000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 1 - R$&nbsp;28.000,00
        </h3>

        <p>
          Este valor representa 2% do patrimônio declarado do picolé de chuchu,
          que trata professores na base da porrada apesar de ter a fama de “Santo”
          . Para nós, esta quantia viabiliza a estrutura de comícios, como palco,
          iluminação, som e montagem.
        </p>
      </div>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 4400000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 4400000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 2 - R$&nbsp;44.000,00
        </h3>

        <p>
          Este valor representa 2% do patrimônio declarado daquele que em 20 anos
          como deputado só aprovou 2 projetos, mas conseguiu adquirir 5 imóveis -
          sendo que para um deles contratou a caseira como sendo funcionária da
          Câmara Federal. Para nós, esta quantia viabiliza a produção de novos
          materiais de campanha como panfletos e adesivos.
        </p>
      </div>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 6000000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 6000000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 3 - R$&nbsp;60.000,00
        </h3>

        <p>
          Este valor representa 2% do patrimônio declarado daquele que acha que
          pode refundar a República, mas, apoiou todas a medidas que retiraram
          direitos do povo brasileiro e foi um dos patrocinadores do golpe. O
          primeiro nome começa com A e o último com D. Para nós, esta quantia
          viabiliza mais dois comícios e viagens pelo país levando nossas
          propostas.
        </p>
      </div>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 9400000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 9400000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 4 - R$&nbsp;94.000,00
        </h3>

        <p>
          A nossa próxima meta é modesta, somente 0,025% do patrimônio de um
          candidato a presidente. Mas não é qualquer patrimônio, é o do
          Meirelles, aquele que fez fortuna no mercado financeiro e quer
          transformar o Brasil numa agência bancária dos grandes grupos
          internacionais. Este dinheiro é fundamental para fortalecer a nossa
          presença em atividades pelo Brasil, especialmente os comícios de
          Salvador e Fortaleza, e lavar a mais e mais pessoas a ideia de que não
          é o povo que tem que servir à economia, mas sim a economia que tem que
          servir ao povo.
        </p>
      </div>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 12000000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 12000000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 5 - R$&nbsp;120.000,00
        </h3>

        <p>
          Este valor viabilizará a realização do último comício do primeiro
          turno, no dia 03/10, no Rio de Janeiro. Levar o nosso debate contra o
          fascismo para uma cidade onde Bolsonaro tem 35% da intenção de votos é
          urgente e necessário, especialmente nesta reta final. Para isso,
          precisamos da sua doação mais do que nunca.
        </p>

      </div>

      <div class="goal-description"
        :class="{ 'goal-description--reached': (candidate.total_donated >= 13500000) }">
        <h3>
          <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= 13500000">
            <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z"/>
          </svg>
          META 6 - R$&nbsp;135.000,00
        </h3>

        <p>
          Precisamos imprimir novos materiais com as nossas mensagens para que
          elas cheguem ao máximo de pessoas pelo Brasil em uma missão didática
          nesta reta final. Assim, nosso enfrentamento contra o machismo, as
          medidas de Temer, os grandes privilégios e o direito à moradia sairão
          mais fortes deste primeiro turno e podemos debatê-los com mais
          facilidade no futuro.
        </p>

      </div>

    </div>
  </article>

  <article id="home__donors" class="home__donors">
    <div class="container" id="donation-wrap">
      <h2>
      Doadores
      </h2>

      <p>
        Veja aqueles sem medo de transformar o Brasil que já contribuíram para
        que nossas propostas alcancem cada vez mais pessoas, nesta batalha
        encabeçada por <strong>Guilherme Boulos</strong> e <strong>Sônia
        Guajajara</strong>, na esperança de acabar com os privilégios e as
        desigualdades.
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


</main>
</template>

<script>
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
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
    const candidateId = (window.location.host === 'doeboulos.com.br' || window.location.host === 'test.doeboulos.com.br') ? 230 : 200;
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
          (accumulator, currentValue) =>
            accumulator + currentValue.total_donated
          , 0,
        )
        : (this.candidate.total_donated || 0);
    },
    totalDonors() {
      return this.donationSources.length
        ? this.donationSources.reduce(
          (accumulator, currentValue) =>
            accumulator + Number.parseInt(currentValue.people_donated || 0, 10)
          , 0,
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
      return (this.candidate || {}).raising_goal || 0;
    },
  },
  methods: {
    porcentage(amount = this.totalAmount) {
      return Math.round((parseFloat(amount) * 100) / Math.max(this.totalAmount, this.expected));
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
