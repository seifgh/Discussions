<template>
  <div class="intro">
    <h3>Developed by Seif Gharres</h3>
    <logo :withText="true" class="mt-4 mb-8" />
    <spinner-loading />
  </div>
</template>

<script>
import Logo from "./Logo.vue";
import SpinnerLoading from "./SpinnerLoading.vue";
export default {
  components: { SpinnerLoading, Logo },
};
</script>
<style lang="scss" scoped>
.spinner::after {
  @apply w-32 h-32 border-4 border-primary;
}
h3 {
  @apply font-semibold text-sm;
}
.intro {
  @apply h-screen w-screen flex flex-col items-center justify-center;
}
</style>