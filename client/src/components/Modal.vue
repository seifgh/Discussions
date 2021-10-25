<template>
  <div class="uil-modal">
    <div @click="toggleContent">
      <slot name="toggler" />
    </div>
    <transition :name="transitionName">
      <div
        @click="handleContainerClick"
        ref="modalContainer"
        v-show="open"
        :class="modalContainerClassName"
      >
        <button v-if="closeBtn" title="Close modal" @click="toggleContent">
          <svg
            class="c-i"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <slot name="closeBtn" />
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
      default: "c", // center
    },
    closeBtn: { type: Boolean, default: true },
  },
  data() {
    return {
      open: this.show,
    };
  },
  computed: {
    modalContainerClassName() {
      return `m-c d-${this.direction}`;
    },
  },
  methods: {
    toggleContent() {
      this.open = !this.open;
      document.scrollingElement.style.overflow = this.open ? "hidden" : "auto";
    },
    handleContainerClick({ target }) {
      if (
        target === this.$refs.modalContainer ||
        target.getAttribute("role") === "close"
      ) {
        this.toggleContent();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-c {
  /* modal container */
  z-index: 999;
  @apply fixed  left-0 top-0 flex w-screen h-screen bg-black bg-opacity-50;
}
.c-i {
  /* close icon */
  @apply fixed z-30 left-0 top-0 m-4 w-8 text-gray-300;
  &:active {
    @apply transform scale-90;
  }
}
/* dirention */
.d-c {
  @apply items-center justify-center;
}
.d-l {
  @apply justify-start;
}
.d-r {
  @apply justify-end;
  .c-i {
    @apply left-0;
  }
}
</style>