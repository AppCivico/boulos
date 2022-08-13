<template>
  <section v-if="candidate.followers_activated">
    <h2>Seguidor</h2>

    <h3 v-if="candidate.followers_count">
      No momento somos acompanhados por
      <strong>{{ candidate.followers_count }}</strong>
      <template v-if="candidate.followers_count === 1">
        seguidor!
      </template>
      <template v-else>
        seguidores!
      </template>
    </h3>
    <h3 v-else>
      Ainda não há seguidores
    </h3>

    <p v-if="candidate.followers_page_text">
      {{ followers_page_text }}
    </p>

    <template v-else>
      <p>Seguidores são pessoas físicas que estão acompanhando a campanha
        {{ candidatePreposition }}

        <strong>
          {{ candidate.popular_name }}
        </strong>
        por aqui.
      </p>
    </template>

    <p>Caso queira começar a seguir de perto, basta preencher o <a
    href="#acompanhar">formulário</a>.</p>
    <p>Todos os seguidores estão compartilhando seus dados pessoais nos termos
    da nova lei de proteção de dados pessoais.</p>

    <p class="helper-text ">
      <button type="button" class="like-a__link" @click="stopToFollow()">Deixar de acompanhar?</button>
    </p>
  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'Followers',
  computed: {
    email: {
      get() {
        return this.$store.state.email;
      },
      set(value) {
        this.storeToState({ name: 'email', data: value });
      },
    },

    ...mapGetters(['candidatePreposition']),
    ...mapState(['candidate']),
  },

  methods: {
    stopToFollow({ candidate, email } = this) {
      const emailFromPrompt = window.prompt('Qual o seu email?', email);

      if (!emailFromPrompt) return;

      const payload = {
        email: emailFromPrompt.trim(),
        candidate_id: candidate.id,
      };

      this.$store
        .dispatch('requestToUnfollowCandidate', payload)
        .then(() => {
          window.alert('A equipe da campanha foi solicitada a remover seu endereço de sua comunicação.');
        })
        .catch((err) => {
          this.handleErrorMessage(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
