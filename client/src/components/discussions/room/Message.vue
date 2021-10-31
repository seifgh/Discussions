<template>
  <div class="message" :class="{ 'current-user-layout': senderIsCurrentUser }">
    <avatar v-if="showAvatar" :userData="message.sender" class="sm dark" />
    <span v-else-if="!senderIsCurrentUser" class="empty-avatar" />
    <div
      class="content"
      :class="{
        first: !isSenderOfPreviousMessage,
        last: !isSenderOfNextMessage,
      }"
    >
      {{ message.content }}
      <span>{{ messageFormatedDate }}</span>
    </div>
  </div>
</template>

<script>
import Avatar from "../Avatar.vue";
import { isToday } from "../../../utils";
export default {
  components: { Avatar },
  props: {
    message: Object,
    previousMessage: Object,
    nextMessage: Object,
  },
  computed: {
    senderIsCurrentUser() {
      return this.$store.getters.isCurrentUser(this.message.sender._id);
    },
    isSenderOfPreviousMessage() {
      return (
        this.previousMessage &&
        this.previousMessage.sender._id == this.message.sender._id
      );
    },
    isSenderOfNextMessage() {
      return (
        this.nextMessage &&
        this.nextMessage.sender._id == this.message.sender._id
      );
    },
    showAvatar() {
      return !this.senderIsCurrentUser && !this.isSenderOfPreviousMessage;
    },
    messageFormatedDate() {
      const date = new Date(this.message.createdAt);
      const timeString = date.getHours() + ":" + date.getMinutes();
      if (isToday(date)) {
        return timeString;
      }
      const dateString = date.toDateString();
      return dateString + " | " + timeString;
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  @apply flex w-full justify-start items-center pt-1;
}
.current-user-layout {
  @apply justify-end;
  .content {
    @apply relative bg-primary
     border-primary text-white-gray 
      rounded-2xl rounded-r-sm
       m-0;
    &.first {
      @apply rounded-2xl rounded-br-sm;
    }
    &.last {
      @apply rounded-br-2xl;
    }
    span {
      @apply right-full left-auto m-0 mr-2;
    }
  }
}
.content {
  max-width: 50%;
  @apply relative text-base w-auto p-3 border 
    bg-white ml-1 break-words
     rounded-2xl rounded-l-sm;
  &.first {
    @apply rounded-2xl rounded-bl-sm;
  }
  &.last {
    @apply rounded-bl-2xl;
  }
  &:hover {
    span {
      @apply block;
    }
  }
  span {
    width: max-content;
    @apply absolute left-full top-0 ml-2 z-10 hidden
       text-xs text-gray-600 mt-2 bg-white-gray 
       rounded-xl border p-2;
  }
}
.empty-avatar {
  width: 42px;
  @apply block;
}
</style>