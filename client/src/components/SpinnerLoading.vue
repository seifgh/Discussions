<template>
  <span class="spinner"></span>
</template>
<style lang="scss" scoped>
.spinner {
  &::after {
    @apply relative block border-2 rounded-full;
    border-top-color: transparent !important;
    content: "";
    animation: spin 1s linear infinite;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>