<template>
  <div id="app">
    <intro v-if="userIsLoading" />
    <router-view v-else />
    <notifications-plugin />
  </div>
</template>

<script>
import Intro from "./components/Intro.vue";
export default {
  components: { Intro },
  name: "App",
  computed: {
    userIsLoading() {
      return this.$store.state.user.isLoading;
    },
  },
  mounted() {
    this.$store.dispatch("loadAndAuthenticateUser");
  },
};
</script>

<style lang="scss">
.btn {
  @apply inline-flex items-center 
  py-3 md:px-8 px-4
  md:text-base text-sm
  md:font-bold font-semibold
  md:rounded-xl rounded-lg 
  focus:outline-none
  transform transition-transform shadow-sm;
  &:active {
    @apply scale-95;
  }
  .spinner::after {
    @apply w-5 h-5;
  }
  &.sm {
    @apply text-sm py-2 px-8 rounded-lg;
    .spinner::after {
      @apply w-4 h-4;
    }
    svg {
      @apply w-4 h-4;
      &:first-child {
        @apply m-0 mr-2;
      }
      &:last-child {
        @apply m-0 ml-2;
      }
    }
  }
  &.lg {
    @apply text-xl py-4 px-6;
    svg {
      @apply ml-5 w-8 h-8;
      &:first-child {
        @apply m-0 mr-5;
      }
    }
  }
  svg {
    @apply md:ml-3 ml-2 md:w-6 w-5 md:h-6 h-5;
  }
  &.flat {
    @apply w-full;
  }
  &.primary {
    @apply bg-primary text-white-gray border-primary;
    svg {
      path {
        stroke: white;
      }
      &:first-child {
        @apply m-0 mr-2;
      }
    }
  }
  &.light {
    @apply bg-white-gray text-primary;
    svg {
      path {
        stroke: var(--text-white-color);
      }
    }
  }
  &.dark {
    @apply bg-dark-white text-white-gray;
    svg {
      path {
        stroke: var(--text-cl-white);
      }
    }
  }
}

.container-1 {
  @apply flex items-center h-screen p-4;
  .part-1 {
    @apply h-full w-2/5 bg-primary p-8 rounded-2xl overflow-hidden;
    h2 {
      @apply text-white-gray my-8 font-semibold text-xl;
    }
    img {
      @apply mt-12;
    }
  }
  .part-2 {
    @apply h-full flex flex-col justify-center p-12;
    .content {
      @apply block w-96;
    }
    h1 {
      @apply text-6xl font-black mb-8;
    }
  }
}

::-webkit-scrollbar {
  @apply w-1;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-xl h-32;
}
</style>
