<template>
  <article id="home__donors" class="home__donors">
    <div class="container" id="donation-wrap">
      <h2>
        Doadores
      </h2>

      <div v-if="donorsMessage" class="content" v-html="parseMD(donorsMessage)" />

      <p>
        <span v-for="(person, i) in donors" :key="i">
          {{ person | titleCase }}{{ i !== donors.length - 1 ? ',' : '' }}
        </span>
      </p>

      <div class="nav-link-donations-wrap">
        <router-link class="nav-link-donations" :to="{ name: 'donors' }" target="_blank">
          ver dados completos
        </router-link>
      </div>
    </div>
  </article>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { parseMD } from '../utilities';

export default {
  name: 'Donors',
  computed: {
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
    donorsMessage({ candidate } = this) {
      return candidate?.donors_message || '';
    },
    ...mapState(['donors']),
  },
  mounted({ candidate } = this) {
    this.GetDonorsNames(candidate.id);
  },
  methods: {
    parseMD,
    ...mapActions(['GetDonorsNames']),
  },
};
</script>
