<template>
  <div class="member">
    <div class="user">
      <avatar :userData="user" />
      <div class="details">
        <h4>{{ user.fullName }}</h4>
        <small>{{ user.email }}</small>
      </div>
    </div>
    <div class="action">
      <button
        type="button"
        @click="$emit(isMember ? 'remove' : 'add')"
        class="btn light sm"
      >
        <span v-if="isMember">Remove</span>
        <span v-else>Add</span>
      </button>
    </div>
  </div>
</template>

<script>
import Avatar from "./Avatar.vue";
export default {
  components: { Avatar },
  props: {
    user: Object,
    isMember: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.member {
  @apply flex items-center justify-between border-b px-2 py-4 w-full overflow-hidden;
  &:last-child {
    @apply border-b-0;
  }
  .user {
    @apply relative flex items-center w-4/6 overflow-hidden;
  }
  .details {
    @apply relative block ml-4 w-4/5;
  }
  h4 {
    @apply font-semibold truncate max-w-full;
  }
  small {
    @apply block truncate max-w-full;
  }
  .action {
    @apply ml-4;
  }
}
</style>