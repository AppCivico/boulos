<template>
  <section v-if="reviews">
    <h2>Depoimentos</h2>

    <p>Conheça o motivo pelo qual algumas pessoas apoiam {{ candidate.popular_name }} em 2022!</p>

    <p>Gostaria de <a href="#testemunhar">falar</a> sobre a sua experiência também?</p>

    <div v-if="reviews.length" class="reviews-list">

      <div v-for="review in reviews" :key="review.id" class="reviews-list__item"
        :class="{'reviews-list__item--to-remove': reviewsToRemove.indexOf(review.id) > -1}">
        <figure class="reviews-list__figure" :key="`review__${review.id}`">
          <blockquote v-html="parseMD(review.content)" />
          <figcaption>{{ review.first_name }} {{ review.family_name }}</figcaption>
        </figure>

        <div class="reviews-list__reply" v-if="review.reply" :key="`reply__${review.id}`">
          <p class="reviews-list__reply-message">
            {{ review.reply }}
          </p>
          <footer class="reviews-list__reply-author">
            {{ candidate.popular_name }}
          </footer>
        </div>

        <template v-if="allowRemoval">
          <p class="warning" v-if="removalsWaiting.indexOf(review.id) > -1" :key="`warning__${review.id}`">
            Confirme a exclusão desse depoimento por e-mail
          </p>

          <p class="error" v-else-if="removalsFailed.indexOf(review.id) > -1" :key="`error__${review.id}`">
            Houve falha ao solicitar a exclusão desse depoimento
          </p>

          <div class="checkbox-wrapper" v-else :key="`checkboxes__${review.id}`">
            <input :id="`removal-check__${review.id}`" v-model="reviewsToRemove" type="checkbox" :value="review.id" />
            <label :for="`removal-check__${review.id}`">
              <span class="label-container" v-if="reviewsToRemove.indexOf(review.id) > -1">
                depoimento a ser removido
              </span>
              <span class="label-container" v-else>solicitar remoção</span>
            </label>
          </div>

          <form @submit.prevent="requestToGetOut()" v-if="reviewsToRemove[reviewsToRemove.length - 1] === review.id"
            :key="'requestToGetOut'">
            <legend>Solicitar remoção</legend>
            <fieldset>
              <div class="input-wrapper">
                <label for="email">Email</label>
                <input v-model="email" type="email" name="email" autocomplete="email" required />
                <div v-if="validation.errors.email" class="error">
                  {{ validation.errors.email }}
                </div>
              </div>

            </fieldset>
            <p v-show="errorMessage" ref="errorMessageEl" class="error" tabindex="-1">
              {{ errorMessage }}
            </p>

            <button type="submit">solicitar</button>

            <p v-if="messages.length === 1">
              {{ messages[0] }}
            </p>
            <ul v-else-if="messages.length">
              <li v-for="(message, idx) in messages" :key="idx" v-text="message" />
            </ul>
          </form>
        </template>
      </div>
    </div>

    <h3 v-else>
      Ainda não há depoimentos
    </h3>

    <button v-if="hasMore.reviews" class="button--load-more" type="button" @click.prevent="getCandidateReviews()">
      Carregar mais
    </button>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CONFIG from '../../config';

import { parseMD, validate } from '../../utilities';

export default {
  name: 'Reviews',

  data() {
    return {
      allowRemoval: false,
      CONFIG,
      email: '',
      errorMessage: '',
      pending: false,
      removalsFailed: [],
      removalsWaiting: [],
      reviewsToRemove: [],
      validation: {
        errors: {
          email: '',
        },
      },
    };
  },

  methods: {
    toggleToRemovalList(id, { reviewsToRemove } = this) {
      const index = reviewsToRemove.indexOf(id);

      if (index === -1) {
        reviewsToRemove.push(id);
      } else {
        reviewsToRemove.splice(index, 1);
      }
    },
    requestToGetOut({
      email, reviewsToRemove, removalsFailed, removalsWaiting,
    } = this) {
      const validation = validate({ email });

      if (!validation.valid) {
        this.errorMessage = 'Todos os campos são obrigatórios';
        this.$refs.errorMessageEl.focus();
        return;
      }

      const promises = reviewsToRemove.map((id) => {
        const payload = {
          email: email.trim(),
          review_id: id,
        };

        return this.requestToUnpublishTestimony(payload)
          .then(() => {
            removalsWaiting.push(id);
          })
          .catch(() => {
            removalsFailed.push(id);
          })
          .finally(() => {
            const index = reviewsToRemove.indexOf(id);

            reviewsToRemove.splice(index, 1);
          });
      });

      this.pending = true;

      Promise.allSettled(promises)
        .then(() => {
          this.pending = false;
        });
    },

    controlSession() {
      const dataSession = JSON.parse(sessionStorage.getItem('donor-data'));
      if (dataSession != null) {
        this.email = dataSession.email;
      }
    },

    parseMD,
    ...mapActions(['getCandidateReviews', 'requestToUnpublishTestimony']),
  },

  computed: {
    ...mapState(['candidate', 'candidatePreposition', 'messages', 'reviews', 'hasMore']),
  },
};
</script>

<style lang="scss" scoped>
form {
  position: relative;
  z-index: 10;

  display: table;

  float: none;
  width: 100%;
  max-width: none;
  padding-top: 0.9375rem;
  padding-right: 1.875rem;
  padding-bottom: 1.875rem;
  padding-left: 1.875rem;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  overflow: hidden;

  color: hsl(0, 0%, 40%);
  background-color: hsl(0, 0%, 94.5%);

  border-radius: 1.875rem;
}

label {
  cursor: pointer;
  line-height: 1.35em;
}

.checkbox-wrapper {
  text-align: right;
}

.label-container {
  max-width: 0%;
  padding-left: 0.25em;
  overflow: hidden;
  display: inline-block;
  height: 1.35em;
  transition-property: max-width;
  transition-duration: 300ms;

  :checked + * > &,
  :hover > & {
    max-width: 100%;
  }
}

input[type='checkbox'],
input[type='radio'] {
  position: absolute;
  width: 0;
  height: 0;
  visibility: hidden;
  opacity: 1;
}

[type='checkbox'] + label {
  margin-right: 0;
  margin-left: auto;

  &::before {
    content: url('../../assets/images/icons/Trashcan.png');
    opacity: 0.5;
    display: inline-block;
  }
}

:checked + label {
  &::before {
    content: url('../../assets/images/icons/Trash-Full.png');
  }

  font-weight: bold;
}

.warning,
.error {
  font-size: small;
  font-style: italic;
  clear: none;
  max-width: none;
}

.warning {
  color: gray;
}

.reviews-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(21.75em, 1fr));
  grid-gap: 1.5rem;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  margin-top: 4.5rem;
}

.reviews-list__item {
  margin-bottom: 1.5rem;
}

.reviews-list__item--to-remove figure,
.reviews-list__item--to-remove .reviews-list__reply {
  text-decoration: line-through;
  color: gray;
  text-decoration-color: red;
}

.reviews-list__reply {
  font-size: small;

  &::before,
  &::after {
    display: table;

    border-collapse: collapse;

    content: '';
  }

  &::after {
    clear: both;
  }
}

.reviews-list__reply-message {
  max-width: none;
  background-color: hsl(0, 0%, 94.5%);
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: 0;
  max-width: 65%;
  width: max-content;
}

.reviews-list__reply-author {
  text-align: right;
  color: hsl(0, 0%, 60%);
  float: right;
  position: relative;
  padding-left: 8px;

  &::after {
    content: '';
    position: absolute;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0 8px 8px 0;
    border-color: transparent hsl(0, 0%, 94.5%) transparent transparent;
    transform: rotate(0deg);
    top: 0;
    right: 100%;
  }
}
</style>
