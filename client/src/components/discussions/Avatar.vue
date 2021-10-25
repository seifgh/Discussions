<template>
  <img
    :title="title"
    class="avatar"
    v-if="profileImageUrl"
    :src="profileImageUrl"
  />
  <div :title="title" v-else class="avatar">
    {{ avatarContent }}
  </div>
</template>

<script>
export default {
  props: {
    userData: Object,
  },
  computed: {
    profileImageUrl() {
      return this.userData.profileImageUrl;
    },
    avatarContent() {
      const fullName = this.userData.fullName.replaceAll(" ", "");
      return fullName[0].toUpperCase() + fullName[1].toLowerCase();
    },
    title() {
      return this.userData.fullName + "\n" + this.userData.email;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 52px;
  height: 52px;
  @apply bg-white-gray cursor-pointer select-none 
  flex object-cover items-center 
  justify-center font-bold rounded-xl shadow-sm transition-colors;
  &.sm {
    width: 42px;
    height: 42px;
    @apply text-sm;
  }
  &.dark {
    @apply bg-primary text-white-gray;
  }
}
</style>
