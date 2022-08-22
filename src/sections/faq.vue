<template>
  <article id="home__faq" class="home__faq" v-if="faq && faq.length">
    <div class="container" id="donation-wrap">
      <h2>
        Perguntas Frequentes
      </h2>
      <details v-for="item, idx in faq" :key="idx">
        <summary>
          <span class="caret"></span>
          {{ item.question }}
        </summary>
        <div v-html="parseMD(item.answer)" />
      </details>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import { parseMD } from '../utilities';

export default {
  name: 'FAQ',
  computed: {
    ...mapGetters(['faq']),
  },
  methods: {
    parseMD,
  },
};
</script>
