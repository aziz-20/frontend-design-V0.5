<template>
  <component :is="type" :to="to" v-bind="linkProps">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    to: {
      type: [String, Object],
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps() {
      if (this.isExternal) {
        return {
          href: this.to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: this.to
      }
    }
  }
})
</script>
