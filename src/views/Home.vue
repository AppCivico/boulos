<template>
<main id="conteudo">
  <div class="fb-customerchat"
    attribution=setup_tool
    page_id="398845206932703"
    logged_in_greeting="Faltam poucos dias pro primeiro turno! Doe, participe e vamos juntos!"
    logged_out_greeting="Faltam poucos dias pro primeiro turno! Doe, participe e vamos juntos!"
    theme_color="#5a0197">
  </div>
  <article class="home__intro">
    <div class="container">
      <h2>
        Por que doar?
      </h2>

      <p>
        <strong>
          Vamos revogar as medidas de Michel Temer
        </strong>, devolver e ampliar direitos que foram retirados do povo para
        agradar os super ricos.
        <strong>
          A economia estará a serviço das pessoas, não o contrário.
        </strong>
      </p>

      <p>
        Os privilégios também se refletem nas campanhas políticas, com
        candidatos super ricos e mais tempo na TV e no rádio graças a leilões de
        cargos e negociatas por baixo dos panos.
      </p>

      <p>
        <strong>
          Não venderemos cargos públicos, apoio e nem alianças em troca de
          favore$.
        </strong>
        Nossa política é feita com você, que não desistiu dos direitos
        trabalhistas, da previdência social e de uma sociedade mais justa para
        todos. Ajude a financiar a campanha e faça com que as nossas propostas
        cheguem a mais pessoas.
      </p>

      <p>
        <strong>
          Doe para Boulos e Sônia.
        </strong>
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
        <strong>Guilherme Boulos</strong> é professor, escritor, ativista
        político, psicanalista e coordenador nacional do Movimento dos
        Trabalhadores Sem Teto (MTST). É o candidato mais jovem da história a
        disputar a presidência. Sua atuação é marcada na luta contra as
        desigualdades esteve papel central na resistência democrática ao golpe
        de 2016.
      </p>

      <blockquote>
        “Guilherme Boulos é uma das mais jovens e promissoras lideranças de
        movimentos sociais brasileiros. Dotado de boa formação ética e
        intelectual, fez uma opção radical, evangélica, pelos mais pobres,
        concentrando sua atividade no segmento da população sem acesso ao
        direito de moradia. Modesto, despojado, inteligente, Boulos pôs a sua
        vida a serviço dos direitos humanos fundamentais” (Frei Betto).
      </blockquote>

      <p>
        Boulos foi um dos fundadores da Frente Povo Sem Medo e da Plataforma
        “Vamos! Sem medo de mudar o Brasil”, iniciativa inovadora de construção
        de programa que realizou centenas de reuniões pelo país e envolveu
        militantes e lideranças de movimentos sociais, partidos, artistas,
        intelectuais, religiosos e pessoas comuns na discussão sobre o novo
        Brasil que queremos.
      </p>

      <p>
        <strong>Sonia Guajajara</strong> é hoje uma das maiores lideranças
        indígenas e ambientais do mundo. Nascida no Maranhão, é professora.
        Sônia coordena a Articulação dos Povos Indígenas do Brasil (APIB) e
        esteve à frente das principais lutas travadas unificando mais de 305
        povos em torno de pautas que combatem os interesses dos setores mais
        poderosos da sociedade brasileira.
      </p>

      <p>
        Esteve à frente da luta contra as propostas que visam retirar direitos
        duramente conquistados pelas nações indígenas e que afetam as nossas
        florestas. Liderança indígena de fala contundente e reconhecida
        internacionalmente, fez discurso contra o governo Temer e pela
        demarcação de terras indígenas durante o Rock in Rio convidada por
        Alicia Keys. Tem voz no Conselho de Direitos Humanos da ONU e já levou
        denúncias às Conferências Mundiais do Clima (COP) de 2009 à 2017, ao
        Parlamento Europeu e outras instâncias internacionais.
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
