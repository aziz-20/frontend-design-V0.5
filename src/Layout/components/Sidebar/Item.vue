<template>
  <div>
    <svg-icon v-if="icon" :icon-class="icon" />
  </div>
</template>

<script>

export default {
  name: 'MenuItem',
  functional: true,
  data() {
    return {
      props: this.$props,
    };
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
