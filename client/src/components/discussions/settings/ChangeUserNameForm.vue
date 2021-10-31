<template>
  <form @submit.prevent="handleSubmit">
    <text-input
      :class="{ 'has-err': $v.fullName.$error && submited }"
      label="Full Name"
      placeholder="Jhone Doe"
      v-model="$v.fullName.$model"
    >
      <template v-if="$v.fullName.$error">
        <small class="err" v-if="!$v.fullName.required"
          >This field is required!</small
        >
        <small class="err" v-if="!$v.fullName.minLength"
          >The full name must contain at least two letters!</small
        >
        <small class="err" v-if="!$v.fullName.changed"
          >The full name stays the same!</small
        >
      </template>
    </text-input>

    <text-input
      :class="{ 'has-err': $v.password.$error && submited }"
      label="Password"
      placeholder="*************"
      type="password"
      v-model="$v.password.$model"
    >
      <template v-if="$v.password.$error">
        <small class="err" v-if="!$v.password.required"
          >This field is required!</small
        >
        <small class="err" v-if="!$v.password.minLength"
          >The password must contain at least 8 characters!</small
        >
      </template>
      <small class="info">Password required to apply changes.</small>
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
const initData = (fullName) => ({
  fullName,
  password: "",
  submited: false,
  isLoading: false,
});
export default {
  components: { TextInput, SpinnerLoading },
  mixins: [validationMixin],
  data() {
    return initData(this.$store.state.user.data.fullName);
  },
  validations() {
    return {
      fullName: {
        required,
        minLength: minLength(2),
        changed: (v) => v != this.$store.state.user.data.fullName,
      },
      password: {
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
        await this.updateUserFullName(this.$data);
        this.isLoading = false;
      }
    },
    async updateUserFullName({ fullName, password }) {
      try {
        await axiosApi.put(API_ROUTES.updateUserFullName, {
          fullName,
          password,
        });
        this.$notify({
          content: "Your full name updated successfuly",
        });
        this.$store.commit("setUser", {
          ...this.$store.state.user.data,
          fullName,
        });
        this.$v.$reset();
        Object.assign(this.$data, initData(fullName));
      } catch (err) {
        this.handleUpdateUserFullNameApiErrors(err);
      }
    },
    handleUpdateUserFullNameApiErrors(err) {
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
