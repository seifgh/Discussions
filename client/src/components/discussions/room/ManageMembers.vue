<template>
  <div class="manage-members" @click.stop>
    <div class="content">
      <div class="top-bar">
        <button @click="$emit('close')"><back-icon /></button>
        <h2>Manage members</h2>
      </div>

      <text-input
        label="Add members"
        placeholder="Search a member by full name or email"
        v-model="searchMembersData.searchKey"
      ></text-input>
      <div class="members">
        <template v-if="searchMembersData.isLoading">
          <user-card-skelton v-for="i in 4" :key="i" />
        </template>

        <template v-else-if="filtredSearchMembersResults.length">
          <user-card
            v-for="user in filtredSearchMembersResults"
            :key="user._id"
            :user="user"
            :isMember="false"
            @add="newMembers.push(user)"
          />
        </template>

        <p v-else-if="searchMembersData.searchKey">
          Sorry, no new members found for "{{ searchMembersData.searchKey }}".
        </p>
      </div>

      <template v-if="newMembers.length">
        <b>New members</b>
        <div class="members">
          <user-card
            v-for="(user, i) in newMembers"
            :key="user._id"
            :user="user"
            :isMember="true"
            @remove="newMembers.splice(i, 1)"
          />
        </div>
      </template>

      <template v-if="removedMembers.length">
        <b>Removed members</b>
        <div class="members">
          <user-card
            v-for="(user, i) in removedMembers"
            :key="user._id"
            :user="user"
            :isMember="false"
            @add="removedMembers.splice(i, 1)"
          />
        </div>
      </template>

      <template v-if="openRoomMembers.length">
        <b>Members</b>
        <div class="members">
          <user-card
            v-for="member in openRoomMembers"
            :key="member._id"
            :user="member"
            :isMember="true"
            @remove="removedMembers.push(member)"
          />
        </div>
      </template>

      <div class="submit-btn" v-if="newMembers.length || removedMembers.length">
        <button @click="handleSubmit" :disabled="isLoading" class="btn primary">
          <spinner-loading v-if="isLoading" />
          <template v-else>
            <span>Save</span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_ROUTES, axiosApi } from "../../../api";
import BackIcon from "../../icons/BackIcon.vue";
import SpinnerLoading from "../../SpinnerLoading.vue";
import TextInput from "../../TextInput.vue";
import UserCard from "../UserCard.vue";
import UserCardSkelton from "../UserCardSkelton.vue";
export default {
  components: {
    BackIcon,
    UserCard,
    TextInput,
    UserCardSkelton,
    SpinnerLoading,
  },
  data() {
    return {
      searchMembersData: {
        searchKey: "",
        users: [],
        isLoading: false,
      },
      newMembers: [],
      removedMembers: [],
      isLoading: false,
    };
  },
  computed: {
    openRoomMembers() {
      const removedMembersIds = this.removedMembers.map(({ _id }) => _id);
      return this.$store.getters.openRoomMembers.filter(
        ({ _id }) => !removedMembersIds.includes(_id)
      );
    },
    excludedMembersIdsFromSearch() {
      const updatedMembers = [
        ...this.newMembers,
        ...this.openRoomMembers,
        ...this.removedMembers,
      ];
      return updatedMembers.map(({ _id }) => _id);
    },
    filtredSearchMembersResults() {
      return this.searchMembersData.users.filter(
        ({ _id }) => !this.excludedMembersIdsFromSearch.includes(_id)
      );
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    async searchMembers() {
      const { searchMembersData } = this.$data;
      if (searchMembersData.searchKey.length) {
        searchMembersData.isLoading = true;
        searchMembersData.users =
          (
            await axiosApi.post(API_ROUTES.searchUsers, {
              excludedUsers: this.excludedMembersIdsFromSearch,
              searchKey: searchMembersData.searchKey,
            })
          ).data.foundUsers || [];
        searchMembersData.isLoading = false;
      } else {
        searchMembersData.users = [];
      }
    },
    async handleSubmit() {
      this.isLoading = true;
      await this.updateRoomMembers();
      this.isLoading = false;
    },
    async updateRoomMembers() {
      try {
        await axiosApi.put(
          API_ROUTES.updateRoomMembers(this.$store.state.openRoom.data._id),
          {
            newMembers: this.newMembers.map(({ _id }) => _id),
            removedMembers: this.removedMembers.map(({ _id }) => _id),
          }
        );
        this.$notify({
          title: "Success update",
          content: "Members updated successfuly",
        });
        this.closeModal();
      } catch (err) {
        this.handleUpdateRoomMembersApiErrors();
      }
    },
    handleUpdateRoomMembersApiErrors() {
      // no errors expected
      this.$notify({
        type: "error",
        title: "Unexpected error",
        content: "Something went wrong, please try later.",
      });
    },
  },
  beforeMount() {
    document.addEventListener("click", this.closeModal);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeModal);
  },

  watch: {
    "searchMembersData.searchKey"() {
      // timeout for start searching until the user stop typing
      clearTimeout(this.searchMembersTimeOut);
      this.searchMembersTimeOut = setTimeout(this.searchMembers, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-members {
  z-index: 999;
  width: 600px;
  @apply fixed right-0 top-0 flex h-screen p-4 max-w-full;
}
.content {
  @apply relative block bg-white w-full border shadow-lg rounded-2xl p-8 pb-0 overflow-auto;
}
h2 {
  @apply text-2xl font-bold ml-4;
}
.top-bar {
  @apply flex items-center pb-4 border-b border-dashed mb-8;
}
.members {
  @apply mt-4;
}
b {
  @apply block mt-8;
}
.submit-btn {
  bottom: -1px;
  @apply sticky left-0 p-4 border-t w-full bg-white;
}
</style>