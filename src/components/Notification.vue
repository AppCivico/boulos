<template>
  <transition name="toogle-donation">
    <div class="notification" v-if="show">
      <div class="notification__title">
        {{ title }}
      </div>
      <div class="notification__message">
        {{ message }}
      </div>
      <div class="notification__footer" v-if="candidate.notification_footer">
        {{ candidate.notification_footer }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  data() {
    return {
      show: false,
      showingNotification: 0,
    };
  },
  props: {
    title: String,
    message: String,
    duration: {
      default: 5000,
      type: Number,
    },
  },
  watch: {
    title() {
      this.$data.show = !this.$data.show;
      this.$data.showingNotification = setTimeout(() => {
        this.$data.show = !this.$data.show;
      }, this.$props.duration);
    },
    message() {
      this.$data.show = !this.$data.show;
      this.$data.showingNotification = setTimeout(function _() {
        this.$data.show = !this.$data.show;
      }, this.$props.duration);
    },
  },
  computed: {
    candidate() {
      return this.$store.getters.candidateWithProjectAndDonations?.candidate;
    },
  },
};
</script>
