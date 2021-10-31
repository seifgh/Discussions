<template>
  <button :disabled="isLoading" class="red-btn" @click.stop="deleteRoom">
    <spinner-loading v-if="isLoading" />
    <trash-icon v-else />
    Delete room
  </button>
</template>

<script>
import { API_ROUTES, axiosApi } from "../../../api";
import TrashIcon from "../../icons/TrashIcon.vue";
import SpinnerLoading from "../../SpinnerLoading.vue";
export default {
  components: { SpinnerLoading, TrashIcon },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    openRoomData() {
      return this.$store.state.openRoom.data;
    },
  },
  methods: {
    async deleteRoom() {
      this.isLoading = true;
      try {
        await axiosApi.delete(API_ROUTES.deleteRoom(this.openRoomData._id));
        this.$notify({
          title: this.openRoomData.name + " - room deleted successfuly",
        });
        this.$store.dispatch("removeRoom", this.openRoomData._id);
      } catch (err) {
        err;
        this.handleDeleteRoomApiErrors(err);
      }
      this.isLoading = false;
    },
    handleDeleteRoomApiErrors() {
      // no errors expected
      this.$notify({
        type: "error",
        title: "Unexpected error",
        content: "Something went wrong, please try later.",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>