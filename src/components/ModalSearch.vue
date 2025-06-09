<template>
  <!-- Modal backdrop -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-100 ease-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-show="modalOpen"  class="fixed inset-0 z-50 transition-opacity bg-gray-900 bg-opacity-30" aria-hidden="true"></div>
  </transition>
  <!-- Modal dialog -->
  <transition
    enter-active-class="transition duration-200 ease-in-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in-out"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div v-show="modalOpen" ref="modalContent" class="fixed inset-0 z-50 flex items-start justify-center px-4 mb-4 overflow-hidden transform top-20 sm:px-6" role="dialog" aria-modal="true">
      <div class="w-full max-h-full overflow-auto bg-white rounded shadow-lg" :class="{ 'max-w-2xl': !size, 'max-w-5xl': size === '5xl', 'max-w-7xl': size === '7xl' }">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue'

export default {
  name: 'ModalSearch',
  props: ['modalOpen', 'size'],
  setup(props, { emit }) {

    const modalContent = ref(null)
    
    // close on click outside
    const clickHandler = ({ target }) => {
      if (modalContent.value==target) emit('close-modal')
    }

    // close if the esc key is pressed
   

    onMounted(() => {
      document.addEventListener('click', clickHandler)
    })

    onUnmounted(() => {
      document.removeEventListener('click', clickHandler)
    }) 
    
    const buttonClass = computed(() => {
      return twMerge('font-bold text-3xl justify-center text-red-500 ', attrs.class)
    })

    return {
      modalContent,
    }
  },
  data() {
    return {
    }
  },
}
</script>