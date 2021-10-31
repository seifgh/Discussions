<template>
  <div class="top-bar">
    <h1>Settings</h1>

    <div class="links">
      <router-link :to="{ name: 'account' }" class="btn sm">
        <user-icon />
        Account</router-link
      >
      <router-link :to="{ name: 'themeColor' }" class="btn sm">
        <theme-color-icon />
        Theme color</router-link
      >
    </div>
  </div>
</template>

<script>
import ThemeColorIcon from "../../icons/ThemeColorIcon.vue";
import UserIcon from "../../icons/UserIcon.vue";
export default {
  components: { UserIcon, ThemeColorIcon },
};
</script>

<style lang="scss" scoped>
.top-bar {
  height: var(--settings-top-bar-height);
  @apply sticky top-0 flex w-full bg-white items-center 
  justify-between pr-2 border-b border-gray-300 border-dashed z-10;
}
h1 {
  @apply text-3xl font-black;
}
.links {
  .btn:first-child {
    @apply mr-4;
  }
  .btn {
    @apply px-5;
  }
  .btn:not(.router-link-active) {
    @apply border;
  }
  @apply flex items-center;
}
</style>