<template>
  <transition name="toogle-donation">
    <div class="notification" v-if="show">
      <div class="notification__title">
        {{ title }}
      </div>
      <div class="notification__message">
        {{ message }}
      </div>
      <div class="notification__footer">
        #doeBoulos
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
      this.$data.showingNotification = setTimeout(function () {
        this.$data.show = !this.$data.show;
      }, this.$props.duration);
    },
  },
};
</script>

