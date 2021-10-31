<template>
  <div class="create-new-room">
    <modal>
      <template #toggler>
        <button class="btn primary sm">
          <create-new-icon />
          New Room
        </button>
      </template>
      <template #content>
        <div class="content" anim="fade-up">
          <h2>Create new room</h2>

          <form autocomplete="off" @submit.prevent="handleSubmit">
            <text-input
              :class="{ 'has-err': $v.name.$error && submited }"
              label="Room name"
              placeholder="#RoomName"
              v-model="$v.name.$model"
            >
              <template v-if="$v.name.$error">
                <small class="err" v-if="!$v.name.required"
                  >This field is required!</small
                >
                <small class="err" v-if="!$v.name.minLength"
                  >The room name must contain at least two letters!</small
                >
              </template>
            </text-input>

            <div v-if="members.length" class="added-members">
              <b>Members</b>

              <div class="members">
                <transition-group name="fade-up">
                  <user-card
                    :isMember="true"
                    v-for="(user, i) in members"
                    :key="user._id"
                    :user="user"
                    @remove="removeMember(i)"
                  />
                </transition-group>
              </div>
            </div>

            <text-input
              :class="{ 'has-err': noMemberSelectedError && submited }"
              label="Add members"
              placeholder="Search a member by full name or email"
              v-model="searchMembersData.searchKey"
            >
              <small class="err" v-if="noMemberSelectedError"
                >At least add one member to the room!</small
              >
            </text-input>

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
                  @add="members.push(user)"
                />
              </template>

              <p v-else-if="searchMembersData.searchKey">
                Sorry, no users found for "{{ searchMembersData.searchKey }}".
              </p>
            </div>

            <div class="submit-btn">
              <button :disabled="isLoading" class="btn primary">
                <spinner-loading v-if="isLoading" />

                <template v-else>
                  <create-new-icon />
                  <span>Create room</span>
                </template>
              </button>
              <button
                type="button"
                ref="close-dropwdown-btn"
                class="hidden"
                role="close"
              ></button>
            </div>
          </form>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { API_ROUTES, axiosApi } from "../../api";
import CreateNewIcon from "../icons/CreateNewIcon.vue";
import Modal from "../Modal.vue";
import SpinnerLoading from "../SpinnerLoading.vue";
import TextInput from "../TextInput.vue";
import UserCard from "./UserCard.vue";
import UserCardSkelton from "./UserCardSkelton.vue";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

const initData = () => ({
  name: "",
  members: [],
  searchMembersData: {
    searchKey: "",
    users: [],
    isLoading: false,
  },
  noMemberSelectedError: false,
  isLoading: false,
  submited: false,
});

export default {
  components: {
    Modal,
    CreateNewIcon,
    TextInput,
    UserCard,
    UserCardSkelton,
    SpinnerLoading,
  },
  mixins: [validationMixin],
  data: initData,
  validations: {
    name: {
      required,
      minLength: minLength(2),
    },
  },
  computed: {
    filtredSearchMembersResults() {
      const membersIds = this.members.map(({ _id }) => _id);
      return this.searchMembersData.users.filter(
        (user) => !membersIds.includes(user._id)
      );
    },
  },
  methods: {
    removeMember(index) {
      this.members.splice(index, 1);
      this.members;
    },
    async searchMembers() {
      const { searchMembersData } = this.$data;
      if (searchMembersData.searchKey.length) {
        searchMembersData.isLoading = true;
        searchMembersData.users =
          (
            await axiosApi.post(API_ROUTES.searchUsers, {
              excludedUsers: this.members.map(({ _id }) => _id),
              searchKey: searchMembersData.searchKey,
            })
          ).data.foundUsers || [];
        searchMembersData.isLoading = false;
      } else {
        searchMembersData.users = [];
      }
    },
    closeDropdown() {
      this.$refs["close-dropwdown-btn"].click();
    },
    async handleSubmit() {
      this.submited = true;
      this.noMemberSelectedError = this.members.length == 0;
      this.$v.$touch();
      if (!this.$v.$invalid && !this.noMemberSelectedError) {
        this.isLoading = true;
        await this.createRoom({
          name: this.name,
          members: this.members.map(({ _id }) => _id),
        });
        this.isLoading = false;
      }
    },
    async createRoom({ name, members }) {
      try {
        await axiosApi.post(API_ROUTES.createNewRoom, {
          name,
          members,
        });
        this.$notify({
          title: "Room created",
          content: "Your room created successfuly",
        });
        this.closeDropdown();
        Object.assign(this.$data, initData());
        this.$v.$reset();
      } catch (err) {
        ({ err });
        this.handleCreateRoomApiErrors(err);
      }
    },
    handleCreateRoomApiErrors(err) {
      const notification = {
        type: "error",
        title: "Unexpected error",
        content: "Some thing went wrong!<br/> Please repeate later.",
        hideDuration: 6000,
      };
      const error = err?.response?.data?.error;
      if (error) {
        if (error == "INPUTS") {
          notification.title = "Invalid inputs";
          notification.content = "Please re-check your fields again!";
        }
      }
      this.$notify(notification);
    },
  },
  mouted() {},
  watch: {
    "searchMembersData.searchKey"() {
      // timeout for start searching until the user stop typing
      clearTimeout(this.searchMembersTimeOut);
      this.searchMembersTimeOut = setTimeout(this.searchMembers, 300);
    },
    members() {
      this.noMemberSelectedError = this.members.length == 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.create-new-room {
  bottom: 10px;
  @apply sticky left-0 w-full flex justify-center mt-8;
}
.content {
  max-height: 95%;
  max-width: 95%;
  width: 600px;
  @apply relative block bg-white  shadow rounded-lg  p-8 pb-0  overflow-auto;
}
h2 {
  @apply text-2xl font-bold pb-4 border-b;
}
form {
  @apply mt-8;
}
.added-members {
  @apply mb-4;
  b {
    @apply font-semibold mb-2 ml-1 text-sm;
  }
  // .list {
  //   @apply w-full flex flex-wrap mt-2;
  // }
  // .member {
  //   @apply flex items-center mr-2 mb-2 rounded-xl p-2  border bg-gray-50;
  //   span {
  //     @apply ml-2 cursor-pointer;
  //   }
  // }
}

.members {
  @apply block w-full mb-8;
}
.submit-btn {
  bottom: -1px;
  @apply sticky left-0 p-4 border-t w-full bg-white;
}
</style>