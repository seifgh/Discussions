<template>
  <div class="container-1">
    <div class="part-1" anim="fade-down">
      <logo :withText="true" class="dark" />
      <h2>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </h2>
      <img src="@/assets/images/signup-img.svg" />
    </div>
    <div class="part-2" anim="fade-up">
      <div class="content">
        <h1>Sign Up</h1>
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
            </template>
          </text-input>

          <text-input
            :class="{ 'has-err': $v.email.$error && submited }"
            label="Email"
            placeholder="jhone.doe@example.com"
            v-model="$v.email.$model"
          >
            <template v-if="$v.email.$error">
              <small class="err" v-if="!$v.email.required"
                >This field is required!</small
              >
              <small class="err" v-if="!$v.email.email"
                >Please insert a valid email!</small
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
          </text-input>

          <p class="text-sm">
            You have an account?
            <router-link to="/sign-in" class="font-semibold text-primary"
              >Sign in</router-link
            >
          </p>

          <button :disabled="isLoading" class="btn primary sm mt-4">
            <spinner-loading v-if="isLoading" />
            <span v-else>Sign up</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
import TextInput from "../components/TextInput.vue";
import SpinnerLoading from "../components/SpinnerLoading.vue";
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
import { API_ROUTES, axiosApi } from "../api";

export default {
  components: { Logo, TextInput, SpinnerLoading },
  mixins: [validationMixin],
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      submited: false,
      isLoading: false,
    };
  },
  validations: {
    fullName: {
      required,
      minLength: minLength(2),
    },
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
  },
  methods: {
    async handleSubmit() {
      this.submited = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.isLoading = true;
        await this.signUp(this.$data);
        this.isLoading = false;
      }
    },
    async signUp({ fullName, email, password }) {
      try {
        const {
          data: { user, authToken },
        } = await axiosApi.post(API_ROUTES.signUp, {
          fullName,
          email,
          password,
        });
        this.$store.dispatch("setUser", { user, authToken });
        this.$notify({
          type: "success",
          title: "Successful",
          content:
            "Welcome to our platform!<br/>You account created successfully",
        });
      } catch (err) {
        this.handleSignUpApiError(err);
      }
    },
    handleSignUpApiError(err) {
      const notification = {
        type: "error",
        title: "Unexpected error",
        content: "Some thing went wrong!<br/> Please repeate later.",
        hideDuration: 6000,
      };
      const error = err?.response?.data?.error;
      if (error) {
        if (error == "EMAIL_EXISTS") {
          notification.title = "User already exists";
          notification.content =
            "A user with this email already exists!<br/> Please try another email or sign in to your account.";
        } else if (error == "INPUTS") {
          notification.title = "Invalid inputs";
          notification.content = "Please re-check your fields again!";
        }
      }
      this.$notify(notification);
    },
  },
  mounted() {
    axiosApi.defaults.headers["Authorization"];
  },
};
</script>

<style lang="scss" scoped>
</style>