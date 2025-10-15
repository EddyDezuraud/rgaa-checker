import { defineNuxtPlugin } from '#app'
import { h } from 'vue'
import * as lucide from 'lucide-vue-next'

type IconName = keyof typeof lucide

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Icon', {
    props: {
      name: {
        type: String,
        required: true
      },
      size: {
        type: [Number, String],
        default: 20
      }
    },
    setup (props) {
      return () => {
        const component = lucide[(props.name.split(':')[1] ?? props.name) as IconName] ?? lucide.Activity
        return h(component, { size: props.size })
      }
    }
  })
})
