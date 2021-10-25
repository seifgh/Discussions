<template>
  <div class="top-bar">
    <h1>{{ openRoomData.name }}</h1>

    <dropdown transitionName="fade">
      <template #toggler>
        <button class="menu-btn">
          <menu-dots-icon />
        </button>
      </template>
      <template #content>
        <div class="dropdown-content">
          <div class="info">
            <small
              >Created by
              <span :title="openRoomData.creator.fullName">
                {{ openRoomData.creator.fullName }}
              </span></small
            >
          </div>
          <button @click.stop="showManageMembers = true">
            <members-icon /> Manage members
          </button>
          <delete-room v-if="userIsCreator" />
        </div>
      </template>
    </dropdown>
    <transition name="fade-right">
      <manage-members
        v-if="showManageMembers"
        @close="showManageMembers = false"
    /></transition>
  </div>
</template>

<script>
import Dropdown from "../../Dropdown.vue";
import MembersIcon from "../../icons/MembersIcon.vue";
import MenuDotsIcon from "../../icons/MenuDotsIcon.vue";
import DeleteRoom from "./DeleteRoom.vue";
import ManageMembers from "./ManageMembers.vue";
export default {
  components: {
    Dropdown,
    MenuDotsIcon,
    MembersIcon,
    ManageMembers,
    DeleteRoom,
  },
  data() {
    return { showManageMembers: false };
  },
  computed: {
    openRoomData() {
      return this.$store.state.openRoom.data;
    },
    userData() {
      return this.$store.state.user.data;
    },
    userIsCreator() {
      return this.openRoomData.creator._id == this.userData._id;
    },
    showMenu() {
      return this.$store.state.togglers.showMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-bar {
  height: var(--room-top-bar-height);
  @apply relative top-0 flex w-full bg-white items-center 
  justify-between pr-2 border-b border-gray-300 border-dashed z-10;
}
.menu-btn {
  @apply p-3 bg-gray-50 rounded-xl;
}

h1 {
  @apply text-3xl font-black;
}
</style>