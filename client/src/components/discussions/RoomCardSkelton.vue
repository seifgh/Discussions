<template>
  <div class="skelton-card">
    <skelton-line height="1rem" width="180px"></skelton-line>
    <skelton-line width="100%"></skelton-line>
  </div>
</template>
<script>
import SkeltonLine from "../SkeltonLine.vue";
export default {
  components: { SkeltonLine },
};
</script>
<style lang="scss" scoped>
.skelton-card {
  @apply block px-2 py-8 w-full items-center;
}
</style>
