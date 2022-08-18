<template>
  <header class="site-header home__header" id="home__header">
    <nav class="skip-links">
      <ul>
        <li class="to-content"><a href="#conteudo">conteúdo</a></li>
        <li class="to-menu"><a href="#menu">menu</a></li>
      </ul>
    </nav>
    <nav class="main-menu">
      <div class="menu-container">
        <button class="mobile-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="brand-wrap">
          <a href="#home__header" v-scroll-to="'#home__header'" class="logo-campaign">
            <img v-if="headerLogo" :src="headerLogo" :alt="`Doe ${candidate.popular_name}`" />
          </a>
        </div>
        <ul class="menu-wrap">
          <li class="menu-icon">
            <a :href="'https://twitter.com/intent/tweet?hashtags=VotoLegal&twitter&text=Eu%20apoiei%20' + candidate.popular_name + ',%20apoie%20você%20também!%20' + encodeURIComponent(location.href)"
              target="_blank" class="twitter"></a>
          </li>
          <li class="menu-icon">
            <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href) + '&src=sdkpreparse'"
              target="_blank" class="fb-xfbml-parse-ignore facebook"></a>
          </li>
          <li class="menu-item donate-nav">
            <a href="#doar" v-scroll-to="'#doar'">
              Doar
            </a>
          </li>
          <li class="menu-item">
            <a href="#home__knowMore" v-scroll-to="'#home__knowMore'">
              Saiba mais
            </a>
          </li>
          <li class="menu-item">
            <a href="#home__donors" v-scroll-to="'#home__donors'">
              Doadores
            </a>
          </li>
          <li class="menu-item" v-if="faq && faq.length">
            <a href="#home__faq" v-scroll-to="'#home__faq'">
              Perguntas frequentes
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div id="home__greetings">
      <div class="site-label">
        <h1 v-if="siteTitle" v-html="siteTitle" />
        <h2 v-if="siteTagline" v-html="siteTagline" />

        <router-link to="#doar" class="call-to-action" v-for="(hashtag, i) in
        hashtags" v-html="hashtag" :key="i" />
      </div>
    </div>

    <Picture class="site-header__image" :images="headerImages" />

    <button id="open-modal" @click="toggleModal()" class="play-button" v-if="candidateVideoId">
      assista ao vídeo
    </button>

    <template v-if="candidateVideoId">
      <div class="modal-overlay closed" @click="toggleModal()" id="modal-overlay"></div>

      <div class="modal closed" id="modal">
        <button class="close-button" id="close-button" @click="toggleModal()">&times;</button>
        <div class="embed-container">
          <iframe width="560" height="315"
            :src="`https://www.youtube-nocookie.com/embed/${candidateVideoId}?rel=0&amp;showinfo=0&enablejsapi=1`"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen id="iframeYoutube" />
        </div>
      </div>
    </template>
  </header>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { slugify } from '../../utilities';
import parser from '../../vendor/markdown.min';
import Picture from '../Picture.vue';

export default {
  name: 'Header',

  components: {
    Picture,
  },

  data() {
    return {
      location: window.location,
    };
  },

  computed: {
    headerImages({ candidateWithProjectAndDonations } = this) {
      const { header_images: headerImages = [] } = candidateWithProjectAndDonations?.candidate;

      return headerImages;
    },

    siteTitle({ candidateWithProjectAndDonations } = this) {
      const { siteTitle = '' } = candidateWithProjectAndDonations.candidate;

      return siteTitle
        ? parser.parse(`${siteTitle}`).firstChild.innerHTML
        : '';
    },

    siteTagline({ candidateWithProjectAndDonations } = this) {
      const { siteTagline = '' } = candidateWithProjectAndDonations.candidate;

      return siteTagline
        ? parser.parse(`${siteTagline}`).firstChild.innerHTML
        : '';
    },

    headerLogo({ candidateWithProjectAndDonations } = this) {
      const { header_logo: headerLogo = '' } = candidateWithProjectAndDonations.candidate;

      return headerLogo;
    },

    hashtags({ candidateWithProjectAndDonations } = this) {
      const { hashtags = [] } = candidateWithProjectAndDonations.candidate;

      return Array.isArray(hashtags)
        ? hashtags.map((x) => x.split(' ').filter(Boolean).map((y) => slugify(y)).map((y, i) => (i % 2 === 0 ? y : `<span class="heavy">${y}</span>`))
          .join('')).map((y) => `<span>#</span>${y}`)
        : [];
    },
    ...mapState(['candidate']),
    ...mapGetters(['candidateWithProjectAndDonations', 'candidateVideoId', 'faq']),
  },

  methods: {
    toggleModal() {
      const modal = document.querySelector('#modal');
      const modalOverlay = document.querySelector('#modal-overlay');
      const iframeYoutube = document.querySelector('#iframeYoutube');
      const func = modal.className.indexOf('closed') === -1 ? 'pauseVideo' : 'playVideo';

      modal.classList.toggle('closed');
      modalOverlay.classList.toggle('closed');

      iframeYoutube.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
    },
    scrollMenu() {
      const element = document.querySelector('.main-menu');
      window.addEventListener('scroll', () => {
        const newOffset = window.scrollY;

        if (newOffset > 13 && window.matchMedia('').matches) {
          element.classList.add('animate');
        } else {
          element.classList.remove('animate');
        }
      });
    },
    showMenu() {
      const element = document.querySelector('.mobile-button');
      const menu = document.querySelector('.menu-wrap');
      element.addEventListener('click', () => {
        menu.classList.toggle('show');
      });
    },
  },

  created() {
    this.$nextTick(() => {
      this.scrollMenu();
      this.showMenu();
    });
  },
};
</script>
