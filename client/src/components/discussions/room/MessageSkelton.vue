<template>
  <div class="message-skelton">
    <skelton-line height="96px" width="40%" />
  </div>
</template>

<script>
import SkeltonLine from "../../SkeltonLine.vue";
export default {
  components: { SkeltonLine },
};
</script>

<style lang="scss" scoped>
.message-skelton {
  @apply flex w-full justify-start mt-8;

  &:nth-child(odd) {
    @apply justify-end;
  }
  .skelton-line {
    @apply rounded-md;
  }
}
</style>