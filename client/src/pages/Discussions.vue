<template>
  <div class="discussions">
    <div class="menu">
      <div>
        <menu-top-bar />
        <transition name="fade-down">
          <div v-if="showMenu">
            <div class="p-2">
              <search-input
                v-if="rooms.data.length"
                class="my-4"
                v-model="searchRoomsKey"
              />
              <div class="rooms">
                <template v-if="rooms.isLoading">
                  <room-card-skelton v-for="i in 10" :key="i" />
                </template>
                <empty-rooms
                  v-else-if="filteredRoomsData.length == 0"
                  :searchKey="searchRoomsKey"
                />
                <template v-else>
                  <room-card
                    v-for="room in filteredRoomsData"
                    :key="room._id"
                    :room="room"
                  />
                </template>
              </div>
            </div>
            <create-new-room />
          </div>
        </transition>
      </div>
    </div>
    <div class="room">
      <router-view v-if="$route.params.roomId"></router-view>
      <div v-else class="intro">
        <h2>Please select a chat room from the menu.</h2>
      </div>
    </div>
  </div>
</template>

<script>
import EnsureAuth from "./mixins/EnsureAuthMixin";
// import socketIo from "./../socketIo";
import MenuTopBar from "../components/discussions/MenuTopBar.vue";
import SearchInput from "../components/discussions/SearchInput.vue";
import RoomCard from "../components/discussions/RoomCard.vue";
import RoomCardSkelton from "../components/discussions/RoomCardSkelton.vue";
import EmptyRooms from "../components/discussions/EmptyRooms.vue";
import CreateNewRoom from "../components/discussions/CreateNewRoom.vue";
import { connectWebsocket, closeWebsocket, socketIo } from "./../socket-io";
import { mapGetters } from "vuex";

export default {
  components: {
    MenuTopBar,
    SearchInput,
    RoomCard,
    RoomCardSkelton,
    EmptyRooms,
    CreateNewRoom,
  },
  mixins: [EnsureAuth],
  data() {
    return {
      searchRoomsKey: "",
    };
  },
  computed: {
    filteredRoomsData() {
      let { data } = this.rooms;
      data = data.filter(({ name }) => {
        if (this.searchRoomsKey) {
          return name.toLowerCase().includes(this.searchRoomsKey.toLowerCase());
        }
        return true;
      });
      return data;
    },
    showMenu() {
      return this.$store.state.togglers.showMenu;
    },
    ...mapGetters(["rooms"]),
  },
  methods: {
    notifyNewRoomCreated(room) {
      if (!this.$store.getters.isCurrentUser(room.creator._id)) {
        this.$notify({
          type: "info",
          title: "New room created",
          content: `${this.userData.fullName}, 
                  your are a new member of '${room.name}' room, created by ${room.creator.fullName}.`,
          hideDuration: 10000,
        });
      }
    },
    handleNewRoomCreatedEvent(room) {
      this.notifyNewRoomCreated(room);
      delete room.creator;
      this.$store.dispatch("pushNewRoom", room);
    },
    notifyReceiveMessage(message) {
      if (
        !this.$store.getters.isCurrentUser(message.sender._id) &&
        !this.$store.getters.isCurrentOpenRoom(message.room)
      ) {
        const roomName = this.$store.getters.getRoomById(message.room).name;
        this.$notify({
          type: "info",
          title: roomName + " - message",
          content: `<b>${message.sender.fullName}</b><br/>
          ${message.content}
        `,
          hideDuration: 2000,
        });
      }
    },
    handleReceiveMessage(message) {
      this.notifyReceiveMessage(message);
      this.$store.dispatch("updateRoomsLastMessage", message);
    },

    handleRoomDeleted(room) {
      if (room.creator != this.userData._id) {
        this.$notify({
          type: "info",
          title: room.name + " - room deleted",
        });
        this.$store.dispatch("removeRoom", room._id);
      }
    },

    handleRoomMembersUpdated({ room }) {
      console.log("new room added");
      this.$store.dispatch("updateRoomMembers", room);
    },

    listenToWebsocketEvents() {
      socketIo.on("connect", () => {
        socketIo.emit("join");
      });
      socketIo.on("joined", (msg) => {
        console.log(msg);
      });
      socketIo.on("disconnect", () => console.log("socket closed"));
      socketIo.on("new-room-created", this.handleNewRoomCreatedEvent);
      socketIo.on("receive-message", this.handleReceiveMessage);
      socketIo.on("room-deleted", this.handleRoomDeleted);
      socketIo.on("room-members-updated", this.handleRoomMembersUpdated);
    },
  },
  beforeMount() {
    this.$store.dispatch("fetchUserRooms");
    connectWebsocket();
    this.listenToWebsocketEvents();
  },
  beforeDestroy() {
    closeWebsocket();
  },
};
</script>

<style lang="scss" scoped>
.discussions {
  @apply relative md:flex flex-wrap p-2 h-screen items-stretch;
}

.hidden-menu {
  .room {
    @apply w-full;
  }
}

.menu {
  @screen md {
    width: var(--menu-width);
  }
  @apply relative block md:h-full h-auto max-h-screen w-full 
    bg-white border rounded-2xl pt-2 z-10 shadow-sm;

  & > div {
    @apply relative overflow-hidden  block h-full px-2 pt-0 z-0;
    &:hover {
      @apply overflow-auto;
    }
  }
}
.room {
  @screen md {
    width: calc(100% - var(--menu-width));
  }
  @apply relative block md:pl-4 md:py-0 pb-2 z-0 h-full w-full;
  .intro {
    @apply flex flex-col w-full h-full items-center justify-center;
    h2 {
      @apply font-bold text-2xl text-center;
    }
  }
}
</style>