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
          <a href="#home__header" v-scroll-to="'#home__header'" class="logo-campaign">Doe Boulos</a>
        </div>
        <ul class="menu-wrap">
          <li class="menu-icon">
            <a href="https://twitter.com/intent/tweet?text=Com%20Boulos%20%2C%20somos%20n%C3%B3s%20l%C3%A1!%20https%3A%2F%2Fdoeboulos.com" target="_blank" class="twitter"></a>
          </li>
          <li class="menu-icon">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdoeboulos.com%2F&amp;src=sdkpreparse" target="_blank" class="fb-xfbml-parse-ignore facebook"></a>
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
          <li class="menu-item">
            <a href="#home__faq" v-scroll-to="'#home__faq'">
              Perguntas frequentes
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div id="home__greetings">
      <div class="site-label">
        <h1>
          Um novo <span>Congresso Nacional</span> é possível
        </h1>

        <h2>
          Eleger <span>Boulos</span> como o Deputado Federal para garantir a
          retomada de direitos do povo.
        </h2>

        <a href="#doar" class="call-to-action">
          <span>#</span>doe<span class="heavy">Boulos</span>
        </a>
        <a href="#doar" class="call-to-action">
          <span>#</span>pra<span class="heavy">cima</span>deles
        </a>
      </div>
    </div>
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
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen id="iframeYoutube"></iframe>
        </div>
      </div>
    </template>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapGetters(['candidateVideoId']),
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
