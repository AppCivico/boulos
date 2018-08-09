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
          <a href="#home__header" v-scroll-to="'#home__header'" class="logo-psol">Doe Boulos</a>
        </div>
        <ul class="menu-wrap">
          <li class="menu-icon">
            <a href="https://twitter.com/intent/tweet?text=Boulos%20precisa%20de%20n%C3%B3s%20para%20equilibrar%20a%20disputa%21%20https%3A%2F%2Fdoeboulos.com.br" target="_blank" class="twitter"></a>
          </li>
          <li class="menu-icon">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdoeboulos.com.br%2F&amp;src=sdkpreparse" target="_blank" class="fb-xfbml-parse-ignore facebook"></a>
          </li>
          <li class="menu-item">
            <a href="#home__donors" v-scroll-to="'#home__donors'">
              Doadores
            </a>
          </li>
          <li class="menu-item donate-nav">
            <a href="#doar" v-scroll-to="'#doar'">
              Doar
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div id="home__greetings">
      <div class="site-label">
        <h1>
          <span>Sem</span> medo de
        </h1>
        <h1>
          Mudar o
          <span>Brasil</span>!
        </h1>
        <a href="#doar" class="call-to-action">
          <span>#</span>doe<span class="heavy">Boulos</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
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

