<template>
<main id="conteudo">
  <article class="home__intro">
    <div class="container">
      <h2>
        Por que doar?
      </h2>

      <p>
        Vamos revogar as medidas de Michel Temer, devolver e ampliar direitos
        que foram retirados do povo para agradar os super ricos. A economia
        estará a serviço das pessoas, não o contrário.
      </p>

      <p>
        Os privilégios também se refletem nas campanhas políticas, com
        candidatos super ricos e mais tempo na TV e no rádio graças a leilões de
        cargos e negociatas por baixo dos panos.
      </p>

      <p>
        Não venderemos cargos públicos, apoio e nem alianças em troca de
        favore$. Nossa política é feita com você, que não desistiu dos direitos
        trabalhistas, da previdência social e de uma sociedade mais justa para
        todos. Ajude a financiar a campanha e faça com que as nossas propostas
        cheguem a mais pessoas.
      </p>

      <p>
        Doe para Boulos e Sônia.
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
          {{ porcentage }}% da meta de R$&nbsp;{{ expected | formatBRL }}
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

      <h3>
        META 1 - R$&nbsp;28.000,00
      </h3>

      <p>
        Este valor representa 2% do patrimônio declarado do picolé de chuchu,
        que trata professores na base da porrada apesar de ter a fama de “Santo”
        . Para nós, esta quantia viabiliza a estrutura de comícios, como palco,
        iluminação, som e montagem.
      </p>

      <h3>
        META 2 - R$&nbsp;44.000,00
      </h3>

      <p>
        Este valor representa 2% do patrimônio declarado daquele que em 20 anos
        como deputado só aprovou 2 projetos, mas conseguiu adquirir 5 imóveis -
        sendo que para um deles contratou a caseira como sendo funcionária da
        Câmara Federal. Para nós, esta quantia viabiliza a produção de novos
        materiais de campanha como panfletos e adesivos.
      </p>

      <h3>
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

      <h3>
        META 4 - R$&nbsp;120.000,00
      </h3>

      <p>
        Esta valor representa 2% do patrimônio declarado daquele democrata
        cristão mais conhecido pelo seu <em>jingle</em> do que por suas propostas, e que
        está disputando a presidência pela 4 vez. Para nós, esta quantia permite
        lançarmos nosso caderno de propostas resumido a partir do programa de
        governo formulado com a contribuição de centenas de pessoas.
      </p>


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
