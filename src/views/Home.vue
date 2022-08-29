<template>
  <main id="conteudo">
    <article id="doar" class="home__donate">
      <div class="container" id="donation-wrap">
        <Payment />
      </div>
    </article>

    <article class="home__intro">
      <div class="container">
        <template v-if="candidate.summary">
          <h2>Por que doar?</h2>

          <div class="content" v-html="parseMD(candidate.summary)" />
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

          <div role="progressbar" aria-valuemin="0" :aria-valuenow="totalAmount"
          :aria-valuemax="expected" v-if="donationSources.length > 0">
            <template v-for="(source, i) in donationSources">
              <div v-if="source.total_donated" :key="i" :style="progressBarStyle(source)"
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
            summary
            }}</a>
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

        <template v-if="candidate.projects && candidate.projects.length">
          <h2>
            Projetos prioritários
          </h2>
          <template v-for="project in candidate.projects">
            <h3 :key="project.id + '__title'">{{ project.title }}</h3>
            <div :key="project.id + '__scope'" class="content" v-html="parseMD(project.scope)" />
          </template>
        </template>
      </div>
    </article>

    <article id="home__knowMore" class="home__knowMore" v-if="candidate.biography">
      <div class="container" id="donation-wrap">
        <h2>
          Conheça {{ candidateArticle }} {{ campaignStateWithGender.toLowerCase() }}
        </h2>

        <Picture class="knowMore__image" :images="candidate.know_more_images" />

        <div class="content" v-html="parseMD(candidate.biography)" />
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
          <div class="content" v-html="parseMD(item.description)" />
        </div>
      </div>
    </article>

    <faqVue />

    <donorsVue />

    <div class="candidate-footer" v-if="candidate.footer_logo">
      <img :src="candidate.footer_logo" alt="Logotipo campanha" class="candidate-footer__logo" />
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
import { mapActions, mapGetters } from 'vuex';
// @ is an alias to /src
import Payment from '@/components/Payment.vue';
import Picture from '@/components/Picture.vue';
import AnimatedNumber from 'animated-number-vue';
import { FormatFixedBRL, parseMD } from '../utilities';

import donorsVue from '../sections/donors.vue';
import faqVue from '../sections/faq.vue';

export default {
  data() {
    return {
      amountInView: false,
    };
  },
  name: 'home',
  components: {
    faqVue,
    donorsVue,
    Payment,
    Picture,
    AnimatedNumber,
  },
  mounted({ candidate } = this) {
    this.UPDATE_DONATIONS_SUMMARY(candidate.id);
  },
  computed: {
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
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

    ...mapGetters(['campaignStateWithGender', 'candidateArticle', 'currentAndPastGoals', 'donationSources', 'expected', 'goals', 'totalAmount']),
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

    ...mapActions(['UPDATE_DONATIONS_SUMMARY']),
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
  head: {
    title() {
      return this.candidate?.popular_name
        ? {
          inner: this.candidate?.popular_name,
          complement: 'Voto Legal',
        }
        : {
          inner: 'Voto Legal',
          complement: 'Financiamento coletivo eleitoral',
        };
    },

    link() {
      return [
        {
          id: 'apple-touch-icon',
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: `/assets/${this.candidate.username}/apple-touch-icon.png`,
        },
        {
          id: 'icon:32x32',
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: `/assets/${this.candidate.username}/favicon-32x32.png`,
        },
        {
          id: 'icon:16x16',
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: `/assets/${this.candidate.username}/favicon-16x16.png`,
        },
        {
          id: 'manifest',
          rel: 'manifest',
          href: `/assets/${this.candidate.username}/site.webmanifest`,
        },
        {
          id: 'mask-icon',
          rel: 'mask-icon',
          href: `/assets/${this.candidate.username}/safari-pinned-tab.svg`,
          color: this.candidate.mask_icon_color,
        },
        {
          id: 'favicon',
          rel: 'shortcut icon',
          href: `/assets/${this.candidate.username}/favicon.ico`,
        },
      ];
    },

    meta() {
      return [
        {
          id: 'msapplication-TileColor',
          name: 'msapplication-TileColor',
          content: this.candidate.ms_application_tile_color,
        },
        {
          id: 'msapplication-config',
          name: 'msapplication-config',
          content: `/assets/${this.candidate.username}/browserconfig.xml`,
        },
        {
          id: 'theme-color',
          name: 'theme-color',
          content: this.candidate.theme_color,
        },
        {
          id: 'description',
          name: 'description',
          content: this.candidate?.description || this.defaultDescription,
        },
        {
          id: 'og:locale',
          property: 'og:locale',
          content: 'pt_BR',
        },
        {
          id: 'fb:admins',
          property: 'fb:admins',
          content: '1063503096997131',
        },
        {
          id: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          id: 'twitter:card',
          name: 'twitter:card',
          content: 'summary',
        },
        {
          id: 'twitter:creator',
          name: 'twitter:creator',
          content: '@appcivico',
        },
        {
          id: 'twitter:description',
          itemprop: 'description',
          name: 'twitter:description',
          property: 'og:description',
          content: this.candidate?.description || this.defaultDescription,
        },
        {
          id: 'image',
          itemprop: 'image',
          name: 'image',
          content: this.candidate?.sharing_image_avatar || this.candidate?.picture || '',
        },
        {
          id: 'twitter:title',
          itemprop: 'name',
          name: 'twitter:title',
          property: 'og:title',
          content: `Eu apoio ${this.candidate?.popular_name || this.candidateId
          }! Apoie você também!`,
        },
        {
          id: 'twitter:url',
          name: 'twitter:url',
          property: 'og:url',
          content: `${window.location.origin}/${this.candidate?.slug}`,
        },
        {
          id: 'twitter:site',
          name: 'twitter:site',
          content: this.candidate?.twitter_profile || '',
        },
        {
          id: 'og:image',
          name: 'twitter:image:src',
          property: 'og:image',
          content: this.candidate?.sharing_image_avatar || this.candidate?.picture || '',
        },
      ];
    },
  },
};
</script>
