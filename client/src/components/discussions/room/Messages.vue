<template>
  <div class="messages">
    <empty-messages v-if="noMessagesFound" />
    <small v-else-if="!messages.hasMore" class="mb-8">No more messages</small>
    <button
      v-show="messages.hasMore"
      ref="observeTarget"
      class="btn sm light"
      :disabled="messages.isLoading"
      @click="fetchMessages"
    >
      <spinner-loading v-if="messages.isLoading" />
      <span v-else> More messages</span>
    </button>
    <message
      v-for="(message, i) in messages.data"
      :key="message._id"
      :message="message"
      :previousMessage="messages.data[i - 1]"
      :nextMessage="messages.data[i + 1]"
    />
  </div>
</template>

<script>
import { socketIo } from "../../../socket-io";
import SpinnerLoading from "../../SpinnerLoading.vue";
import EmptyMessages from "./EmptyMessages.vue";
import Message from "./Message.vue";
export default {
  components: { Message, SpinnerLoading, EmptyMessages },
  computed: {
    messages() {
      return this.$store.state.openRoom.messages;
    },
    noMessagesFound() {
      return !this.messages.isLoading && !this.messages.data.length;
    },
  },
  methods: {
    fetchMessages() {
      if (this.messages.hasMore && !this.messages.isLoading) {
        this.stopObserving();
        this.$store.dispatch(
          "fetchOpenRoomMessages",
          this.handleFetchMessagesDone
        );
      }
    },
    handleFetchMessagesDone() {
      const { observeTarget } = this.$refs;
      const scrollArea = this.$el;
      scrollArea.scrollTo(0, observeTarget.clientHeight * 2);
      this.startObserving();
    },
    handleFirstFetchMessagesDone() {
      this.fetchMessagesOnScrollToTop();
      this.scrollToBottom();
    },
    // fetch messages with infinit scroll system
    fetchMessagesOnScrollToTop() {
      const scrollArea = this.$el;
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.fetchMessages();
          }
        },
        {
          root: scrollArea,
        }
      );
      this.startObserving();
    },
    stopObserving() {
      const { observeTarget } = this.$refs;
      if (this.intersectionObserver && observeTarget) {
        this.intersectionObserver.unobserve(observeTarget);
      }
    },
    startObserving() {
      const { observeTarget } = this.$refs;
      if (this.intersectionObserver && observeTarget) {
        this.intersectionObserver.observe(observeTarget);
      }
    },
    scrollToBottom() {
      const scrollArea = this.$el;
      setTimeout(() => scrollArea.scrollTo(0, scrollArea.scrollHeight));
    },
    // -------------------
    handleReceiveMessage(message) {
      if (this.$store.getters.isCurrentOpenRoom(message.room)) {
        this.$store.dispatch("pushOpenRoomNewMessage", message);
        this.scrollToBottom();
      }
    },
    listenToWebsocketEvents() {
      socketIo.on("receive-message", this.handleReceiveMessage);
    },
    removeWebsocketListners() {
      socketIo.removeListener("receive-message", this.handleReceiveMessage);
    },
  },
  mounted() {
    this.$store.dispatch(
      "fetchOpenRoomMessages",
      this.handleFirstFetchMessagesDone
    );
    this.listenToWebsocketEvents();
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.removeWebsocketListners();
  },
};
</script>

<style lang="scss" scoped>
.messages {
  height: var(--room-messages-height);
  @apply relative flex flex-col items-center justify-start
   overflow-auto p-4;
}
.spinner::after {
  @apply w-4 h-4 border-primary my-2;
}
</style>