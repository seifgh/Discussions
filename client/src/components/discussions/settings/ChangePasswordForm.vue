<template>
  <form @submit.prevent="handleSubmit">
    <text-input
      :class="{ 'has-err': $v.newPassword.$error && submited }"
      label="New"
      placeholder="*************"
      type="password"
      v-model="$v.newPassword.$model"
    >
      <template v-if="$v.newPassword.$error">
        <small class="err" v-if="!$v.newPassword.required"
          >This field is required!</small
        >
        <small class="err" v-if="!$v.newPassword.minLength"
          >The password must contain at least 8 characters!</small
        >
      </template>
    </text-input>

    <text-input
      :class="{ 'has-err': $v.confirmPassword.$error && submited }"
      label="Re-type new"
      placeholder="*************"
      type="password"
      v-model="$v.confirmPassword.$model"
    >
      <template v-if="$v.confirmPassword.$error">
        <small class="err" v-if="!$v.confirmPassword.required"
          >This field is required!</small
        >
        <small class="err" v-if="!$v.confirmPassword.minLength"
          >The password must contain at least 8 characters!</small
        >
        <small class="err" v-if="!$v.confirmPassword.isEqual"
          >The Re-typed password doesn't match the new password!</small
        >
      </template>
    </text-input>

    <text-input
      class="mt-8"
      :class="{ 'has-err': $v.currentPassword.$error && submited }"
      label="Current password"
      placeholder="*************"
      type="password"
      v-model="$v.currentPassword.$model"
    >
      <template v-if="$v.currentPassword.$error">
        <small class="err" v-if="!$v.currentPassword.required"
          >This field is required!</small
        >
        <small class="err" v-if="!$v.currentPassword.minLength"
          >The password must contain at least 8 characters!</small
        >
      </template>
      <small class="info">Current password required to apply changes.</small>
    </text-input>

    <button :disabled="isLoading" class="btn primary sm mt-2">
      <spinner-loading v-if="isLoading" />
      <span v-else>Save</span>
    </button>
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { API_ROUTES, axiosApi } from "../../../api";
import SpinnerLoading from "../../SpinnerLoading.vue";
import TextInput from "../../TextInput.vue";
const initData = () => ({
  newPassword: "",
  confirmPassword: "",
  currentPassword: "",
  submited: false,
  isLoading: false,
});
export default {
  components: { TextInput, SpinnerLoading },
  mixins: [validationMixin],
  data() {
    return initData();
  },
  validations() {
    return {
      newPassword: {
        required,
        minLength: minLength(8),
      },
      confirmPassword: {
        required,
        minLength: minLength(8),
        isEqual: (v) => v == this.newPassword,
      },
      currentPassword: {
        required,
        minLength: minLength(8),
      },
    };
  },
  methods: {
    async handleSubmit() {
      this.submited = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.isLoading = true;
        await this.updateUserPassword(this.$data);
        this.isLoading = false;
      }
    },
    async updateUserPassword({ newPassword, currentPassword }) {
      try {
        await axiosApi.put(API_ROUTES.updateUserPassword, {
          newPassword,
          currentPassword,
        });
        this.$notify({
          content: "Your password updated successfuly",
        });
        this.$v.$reset();
        Object.assign(this.$data, initData());
      } catch (err) {
        this.handleUpdateUserPasswordApiErrors(err);
      }
    },
    handleUpdateUserPasswordApiErrors(err) {
      const notification = {
        type: "error",
        title: "Unexpected error",
        content: "Some thing went wrong!<br/> Please repeate later.",
        hideDuration: 5000,
      };
      const error = err?.response?.data?.error;
      if (error) {
        if (error == "WRONG_PASSWORD") {
          notification.title = "Wrong password";
          notification.content =
            "The password you entered was wrong! <br/> Please re-check your password to sign in.";
        } else if (error == "INPUTS") {
          notification.title = "Invalid inputs";
          notification.content = "Please re-check your fields again!";
        }
      }
      this.$notify(notification);
    },
  },
};
</script>
