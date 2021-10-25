<template>
  <div class="top-bar" :class="{ 'menu-hidden': !showMenu }">
    <div class="left-side">
      <button
        title="Toggle menu"
        class="toggle-menu-btn"
        @click="toggleMenu"
        :class="{ active: showMenu }"
      >
        <left-menu-icon />
      </button>
      <logo :withText="true" class="sm" />
    </div>
    <dropdown transitionName="fade">
      <template #toggler>
        <avatar :userData="userData" class="sm" title="Click to open menu" />
      </template>
      <template #content>
        <div class="dropdown-content">
          <div class="info">
            <small :title="userData.fullName">{{ userData.fullName }}</small>
            <small class="mt-1" :title="userData.email">{{
              userData.email
            }}</small>
          </div>
          <button>
            <settings-icon />
            Settings
          </button>
          <button @click="$store.dispatch('logout')">
            <logout-icon />
            Logout
          </button>
        </div>
      </template>
    </dropdown>
  </div>
</template>

<script>
import Dropdown from "../Dropdown.vue";
import LeftMenuIcon from "../icons/LeftMenuIcon.vue";
import LogoutIcon from "../icons/LogoutIcon.vue";
import SettingsIcon from "../icons/SettingsIcon.vue";
import Logo from "../Logo.vue";
import Avatar from "./Avatar.vue";
export default {
  components: {
    Avatar,
    Dropdown,
    SettingsIcon,
    LogoutIcon,
    LeftMenuIcon,
    Logo,
  },
  computed: {
    userData() {
      return this.$store.state.user.data;
    },
    showMenu() {
      return this.$store.state.togglers.showMenu;
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit("toggleMenu");
    },
  },
};
</script>
<style lang="scss" scoped>
.top-bar {
  @apply sticky top-0 w-full flex items-center justify-between pb-4 px-2 pt-2
  bg-white border-b border-gray-300 border-dashed;
  &.menu-hidden {
    @apply border-none;
  }
}
h1 {
  @apply text-primary font-bold text-3xl;
}

.left-side {
  @apply flex items-center;
}
.toggle-menu-btn {
  @apply p-3 border-2 border-transparent rounded-xl 
  mr-4 transition-colors bg-gray-50 md:hidden;
  &.active {
    @apply shadow-sm bg-gray-100;
  }
}
</style>