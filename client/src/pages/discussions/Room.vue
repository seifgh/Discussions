<template>
  <div class="open-room">
    <div v-if="openRoom.isLoading" class="loading">
      <spinner-loading />
    </div>
    <template v-else-if="openRoom.data">
      <room-top-bar />
      <messages />
      <message-input />
    </template>
  </div>
</template>

<script>
import MessageInput from "../../components/discussions/room/MessageInput.vue";
import Messages from "../../components/discussions/room/Messages.vue";
import RoomTopBar from "../../components/discussions/room/RoomTopBar.vue";
import SpinnerLoading from "../../components/SpinnerLoading.vue";

export default {
  components: { SpinnerLoading, RoomTopBar, MessageInput, Messages },
  computed: {
    openRoom() {
      return this.$store.state.openRoom;
    },
  },
  methods: {
    fetchOpenRoom() {
      const { roomId } = this.$route.params;
      this.$store.dispatch("fetchOpenRoom", roomId);
    },
  },
  mounted() {
    this.fetchOpenRoom();
  },
  watch: {
    "$route.params.roomId"() {
      this.fetchOpenRoom();
    },
  },
};
</script>
<style lang="scss" scoped>
.open-room {
  @apply relative w-full h-full rounded-xl overflow-y-hidden;
  &:hover {
    @apply overflow-y-auto;
  }
}
.loading {
  .spinner::after {
    @apply w-20 h-20 border-primary border-2;
  }
  @apply flex w-full h-full items-center justify-center;
}
</style>