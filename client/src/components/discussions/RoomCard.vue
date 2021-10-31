<template>
  <router-link
    :to="'/discussions/room/' + room._id"
    class="room-card"
    @click.native="scrollToBottom"
  >
    <h2 :title="room.name">{{ room.name }}</h2>

    <small class="last-message" v-if="room.lastMessage">
      <b>{{ room.lastMessage.sender.fullName }}:</b>
      <span :title="room.lastMessage.content">
        {{ formatedLastMessageContent }}</span
      >
    </small>
    <small v-else>New room</small>
  </router-link>
</template>

<script>
const MSG_CONTENT_MAX_LENGTH = 60;
export default {
  props: {
    room: Object,
  },
  computed: {
    formatedLastMessageContent() {
      const { content } = this.room.lastMessage;
      if (content.length <= MSG_CONTENT_MAX_LENGTH) return content;
      return content.slice(0, MSG_CONTENT_MAX_LENGTH) + "...";
    },
  },
  methods: {
    scrollToBottom() {
      ("hiiiiiiiiii");
      document.scrollingElement.scrollTo(
        0,
        document.scrollingElement.scrollHeight * 2
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.room-card {
  &:last-child {
    @apply rounded-b-xl;
  }
  &:first-child {
    @apply rounded-t-xl border-t;
  }
  @apply block px-4 py-5 bg-white border border-gray-100 border-t-0 shadow-sm;
  &.router-link-active {
    @apply bg-white-gray;
  }
}
h2 {
  @apply block font-bold text-lg truncate;
}
small {
  @apply text-gray-500;
}
.last-message {
  @apply max-w-full block overflow-hidden overflow-ellipsis;
}
</style>