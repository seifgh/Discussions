<template>
  <div class="settings">
    <settings-top-bar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import SettingsTopBar from "../../components/discussions/settings/SettingsTopBar.vue";
export default {
  components: { SettingsTopBar },
};
</script>

<style lang="scss" scoped>
.settings {
  @apply h-full overflow-auto;
}
.content {
  @apply px-4;
}
</style>