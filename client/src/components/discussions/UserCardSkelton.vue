<template>
  <div class="skelton-card">
    <skelton-line
      class="rounded-full"
      height="52px"
      width="52px"
    ></skelton-line>
    <div>
      <skelton-line height="1rem" width="60%"></skelton-line>
      <skelton-line width="90%"></skelton-line>
    </div>
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
  @apply relative flex px-2 py-4 w-full items-center;
  & > div {
    @apply ml-4 w-4/5;
  }
}
</style>
