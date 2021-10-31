<template>
  <router-link to="/" class="logo">
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 0C14.356 0 0 14.356 0 32V62C0 63.104 0.896 64 2 64H32C49.644 64 64 49.644 64 32C64 14.356 49.644 0 32 0Z"
        fill="#2c47e2"
      />
      <path
        d="M34 40H18C16.896 40 16 39.104 16 38C16 36.896 16.896 36 18 36H34C35.104 36 36 36.896 36 38C36 39.104 35.104 40 34 40Z"
        fill="white"
      />
      <path
        d="M46 28H18C16.896 28 16 27.104 16 26C16 24.896 16.896 24 18 24H46C47.104 24 48 24.896 48 26C48 27.104 47.104 28 46 28Z"
        fill="white"
      />
    </svg>
    <h3 v-if="withText">Iscussions</h3>
  </router-link>
</template>
<script>
export default {
  props: {
    withText: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.logo {
  @apply flex items-center;
  svg {
    width: 64px;
    * {
      fill: var(--secondary-color);
    }
    *:nth-child(1) {
      fill: var(--primary-color);
    }
  }
  h3 {
    @apply font-bold text-4xl ml-2 text-primary;
  }
  &.sm {
    svg {
      width: 32px;
    }
    h3 {
      @apply text-xl;
    }
  }
  &.lg {
    svg {
      width: 64px;
    }
    h3 {
      @apply text-4xl;
    }
  }
  &.dark {
    svg {
      * {
        fill: var(--primary-color);
      }
      *:nth-child(1) {
        fill: var(--secondary-color);
      }
    }
    h3 {
      @apply text-secondary;
    }
  }
}
</style>
