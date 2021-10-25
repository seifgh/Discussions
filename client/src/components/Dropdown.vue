<template>
  <div class="uil-dropdown">
    <div @click.stop="toggleContent">
      <slot name="toggler" :open="open" />
    </div>
    <transition :name="transitionName">
      <div :class="contentClassName" v-show="open">
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    transitionName: {
      // transitions names in anims.scss
      type: String,
      default: "fade",
    },
    direction: {
      type: String,
      default: "rb", // left bottom
    },
  },
  data() {
    return {
      open: this.show,
    };
  },
  computed: {
    contentClassName() {
      return `ct d-${this.direction}`;
    },
  },
  methods: {
    toggleContent() {
      this.open = !this.open;
      if (this.open) {
        document.addEventListener("click", this.toggleContent);
      } else {
        document.removeEventListener("click", this.toggleContent);
      }
    },
  },
  mounted() {
    if (this.show) {
      document.addEventListener("click", this.toggleContent);
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.toggleContent);
  },
};
</script>

<style lang="scss" scoped>
.uil-dropdown {
  @apply relative inline-block;
}
.ct {
  /* content */
  @apply absolute z-20;
}
/* direction */
.d-lb {
  /* left bottom */
  top: 100%;
  @apply left-0 mt-3;
}
.d-lt {
  /* left top */
  bottom: 100%;
  @apply left-0 mb-3;
}
.d-rb {
  /* right bottom */
  top: 100%;
  @apply right-0 mt-3;
}
.d-rt {
  /* right top */
  bottom: 100%;
  @apply right-0 mb-3;
}
</style>
<style lang="scss">
.dropdown-content {
  @apply w-48 rounded-md border border-gray-50 shadow-md bg-white py-3 z-20;
  & > button,
  & > a,
  .drop-btn {
    @apply p-2 px-4 w-full flex items-center font-normal 
    transition-colors bg-white text-sm;
    svg {
      @apply mr-4;
    }
    .spinner::after {
      @apply w-4 h-4 mr-4 border-dark-white;
    }
    &:hover {
      @apply bg-gray-50;
    }
    &.red-btn {
      @apply text-red-400;
      .spinner::after {
        @apply border-red-400;
      }
    }
  }
  .info {
    @apply block font-semibold px-4 pb-2 mb-2 border-b border-dashed;
  }
  small {
    @apply block font-semibold text-xs truncate;
  }
}
</style>