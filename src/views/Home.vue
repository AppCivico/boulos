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
        começar em São Paulo. Agora, temos a chance de ser a capital da
        resistência e da esperança. Resistência ao atraso, ao autoritarismo.
        Esperança em sermos um polo de defesa democrática no Brasil através de
        uma chapa dos sonhos, formada por um encontro de gerações. A esperança
        em construir um outro Brasil, democrático, diverso e mais igual, sem
        tantos muros que nos separam.
      </p>
      <p>
        Nossa pré-candidatura representa o combate à desigualdade. Queremos uma
        cidade a serviço das pessoas e não o contrário.
      </p>
      <p>
        E para isso, precisamos recuperar o que foi bom e aprender com os erros
        do passado. Vamos inverter a ordem de prioridades no orçamento
        municipal, colocar educação, saúde e moradia em primeiro lugar.
        Transformar o transporte num direito de todos e não mais em máquina de
        lucro das máfias.
      </p>
      <p>
        Para que a transformação aconteça, precisamos de você! Que não desistiu
        de uma sociedade mais justa e que acredita numa cidade de direitos.
        Ajude a financiar o nosso projeto de solidariedade e vamos juntos nos
        tornar a capital da esperança!
      </p>
      <p>
        Começar uma virada no Brasil é possível e pode partir aqui de São Paulo.
      </p>
      <p>
        Doe para Boulos e Erundina.
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
          {{ porcentage() }}% da meta de R$&nbsp;{{ expected | formatBRL }},
          <a
            :href="`#goal-description__${expected}`"
          >que garantirá mais um mês de ação, impressão de material gráfico e
          logística de entrega.</a>.
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

      <h2>
        Projetos prioritários
      </h2>
      <h3>
        Políticas públicas para a população em situação de rua
      </h3>
      <p>
        A população de rua tem o direito de viver sem violência! É preciso, em
        primeiro lugar, estancar e coibir as várias formas de violência contra a
        população em situação de rua - seja a violência policial, por parte das
        seguranças privadas, ou ainda o descaso e péssima qualidade dos serviços
        e atendimentos nos equipamentos estatais e/ou geridos pelas OS´s. As
        políticas de atendimento devem garantir o acolhimento e atendimento
        integral previsto no SUAS e avançar na garantia de acesso à moradia,
        educação, saúde, alimentação, trabalho, cultura e lazer, tendo a
        perspectiva de sair das ruas. Políticas de moradia que integrem os
        vários níveis de atenção e assistência social, trabalho e renda devem
        ser prioridade. Essas políticas devem ser discutidas, elaboradas e
        implementadas através da participação dos movimentos e entidades
        parceiras, garantindo as especificidades dos modos de viver dos diversos
        perfis que estão nas ruas.
      </p>

      <h3>
        Economia, trabalho e renda a serviço do povo
      </h3>
      <p>
        A construção de um projeto econômico que permita a recuperação da
        esperança em condições melhores de vida para a população de São Paulo é
        o primeiro passo para a renovação das forças progressistas em todo
        Brasil. Em um cenário de crise profunda, com a expansão da
        informalidade, dos trabalhadores por conta própria e de diversas formas
        de sub-ocupação e desalento, a atuação direta do poder público na
        reconstrução das atividades econômicas se faz necessária, assim como na
        geração de empregos e na criação de renda. Assim, surge a obrigação de
        se construir um projeto de economia voltado às pessoas, ao atendimento
        das necessidades sociais e à geração de oportunidades de trabalho para
        aqueles e aquelas que mais precisam.
      </p>

      <h3>
        Educação por quem teve Paulo Freire como secretário
      </h3>
      <p>
        A educação será pautada pela melhor gestão pública educacional da
        história da cidade: a de Paulo Freire quando esteve à frente da
        Secretaria Municipal de Educação, no mandato de Luiza Erundina.
        Prioridades: Educação pública de qualidade para todas e todos, em todas
        as regiões da cidade; Democratização das creches e a universalização de
        vagas na educação infantil, especialmente na periferia; Matrículas de
        qualidade em todas as etapas e modalidades da educação básica, fazendo o
        melhor e mais correto uso do recurso público; Valorização dos
        profissionais da rede municipal de educação, pois todas e todos são
        especialistas capazes de transformar São Paulo em uma capital
        pedagógica, capaz de garantir qualidade de vida ao seu povo. A Revolução
        Solidária também tomará como referência o projeto de educação integral
        de Anísio Teixeira, transformando toda unidade escolar e todo território
        paulistano em uma cidade educadora: justa, feminista, ecossocialista,
        antirracista, anti-lgbtfobica e emancipadora.
      </p>

      <h3>
        Transporte é direito social
      </h3>
      <p>
        O transporte é um direito social constitucional desde setembro de 2015,
        tal como a saúde e educação, o que só se concretiza com políticas
        públicas orientadas pela ótica do combate às desigualdades sociais. Por
        isso, nosso programa se coloca na perspectiva de que transporte não é
        mercadoria e propõe uma reorganização do serviço ao mesmo tempo que
        lutará com força para que o princípio constitucional se concretize tal
        como o SUS, que é gratuito. Nosso Programa estará pautado na priorização
        do transporte público, coletivo e ativo (pedestres e ciclistas),
        impulsionados nas formas de locomoção não centradas no automóvel
        individual e particular, dando às pessoas condições de definirem e
        controlarem as políticas públicas em torno da mobilidade urbana de forma
        democrática.
      </p>

      <h3>
        Fortalecimento do SUS
      </h3>
      <p>
        Abordar as desigualdades sociais é abordar a saúde. A comparação dos
        índices de condições de vida e serviços de saúde entre os bairros de São
        Paulo é um exemplo concreto disso. A mortalidade e a letalidade são
        muito maiores na periferia quando comparada ao centro. A reestruturação
        desastrada e enxugamento da gestão Bruno Covas contraria o
        fortalecimento do SUS e o planejamento público, realizando uma
        privatização da gestão de todos os espaços assistenciais ao
        desconsiderar as necessidades em saúde. Vamos reverter essa lógica.
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
        Conheça os pré- candidatos
      </h2>

      <p>
        <strong>Guilherme Boulos</strong> é professor, ativista social do
        Movimento dos Trabalhadores Sem Teto (MTST) e da Frente Povo Sem Medo.
        Foi candidato a Presidência da República pelo PSOL em 2018, sendo o mais
        jovem a postulante ao cargo na história do Brasil. Sua atuação é marcada
        na luta contra as desigualdades e por um novo modelo de sociedade.
      </p>
      <p>
        Aos 20 anos, deixou sua casa para morar e atuar em uma ocupação sem
        teto. Liderança social consolidada, é formado em Filosofia pela USP,
        especializado em Psicanálise pelo Cogeae/PUC e Mestre em Psiquiatria
        pela USP. Já deu aulas na rede pública de ensino do Estado de São Paulo
        e em várias Instituições. Atualmente, ministra Cursos de Extensão na
        Escola de Sociologia e Política (ESP) e Cursos Livres pelo Instituto
        Democratize, iniciativa que coordena.
      </p>
      <p>
        Sua atuação rendeu o prêmio Santos Dias de Direitos Humanos, concedido
        pela Assembléia Legislativa de São Paulo em 2017, além da Medalha do
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

      <div
        v-for="(item, index) in goals" :key="index"
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
        Veja aqueles sem medo de transformar São Paulo que já contribuíram para
        que nossas propostas alcancem cada vez mais pessoas, nesta batalha
        encabeçada por <strong>Guilherme Boulos</strong> e <strong>Luiza
        Erundina</strong>, na esperança de acabar com os privilégios e as
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

  <div class="candidate-footer">
      <img
        src="../assets/images/icons/Boulos_Erundina_Logo_Coligacao_21.png"
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
// eslint-disable-next-line
import AnimatedNumber from 'animated-number-vue';

import { root } from '@/data/goals.json';

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
    const candidateId = (window.location.host === 'doeboulos.com' || window.location.host === 'test.doeboulos.com') ? 10129 : 200;
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
      const { totalAmount, goals } = this;

      return (goals.find(x => x.goal > totalAmount)
        || goals[goals.length - 1]).goal
        || (this.candidate || {}).raising_goal
        || 0;
    },
  },
  methods: {
    porcentage(amount = this.totalAmount) {
      return Math.round((parseFloat(amount) * 100) / Math.max(this.totalAmount, this.expected))
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
