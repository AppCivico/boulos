<template>
  <section id="home__goals" class="home__goals">
    <h2>
      Metas
    </h2>

    <div v-for="(item, index) in currentAndPastGoals" :key="index" :id="`goal-description__${item.goal}`"
      class="goal-description" :class="{ 'goal-description--reached': (candidate.total_donated >= item.goal) }">
      <h3>
        <svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"
          v-if="candidate.total_donated >= item.goal">
          <path d="M1 14 L5 10 L13 18 L27 4 L31 8 L13 26 z" />
        </svg>
        META {{ currentAndPastGoals.length - index }} - R$&nbsp;{{ FormatFixedBRL(item.goal) }}
      </h3>

      <h4 v-if="item.summary">{{ item.summary }}</h4>
      <div v-html="parseMD(item.description)"></div>
    </div>
  </section>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { FormatFixedBRL, parseMD } from "../../utilities";

export default {
  name: "Goals",

  computed: {
    ...mapGetters(['currentAndPastGoals', 'donationSources', 'expected', 'goals', 'totalAmount']),
    ...mapState(['candidate']),
  },

  methods: {
    FormatFixedBRL,
    parseMD,
  },
}
</script>
<style lang="scss" scoped>
</style>
