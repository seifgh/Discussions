<template>
  <div class="container-1">
    <div class="part-1" anim="fade-up">
      <logo :withText="true" class="dark" />
      <h2>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </h2>
      <img src="@/assets/images/signin-img.svg" />
    </div>
    <div class="part-2" anim="fade-down">
      <div class="content">
        <h1>Sign In</h1>
        <form @submit.prevent="handleSubmit">
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
            You don't have an account?
            <router-link to="/sign-up" class="font-semibold text-primary"
              >Sign up</router-link
            >
          </p>

          <button :disabled="isLoading" class="btn primary sm mt-4">
            <spinner-loading v-if="isLoading" />
            <span v-else>Sign in</span>
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
import { axiosApi, API_ROUTES } from "./../api";
import EnsureNotAuthMixin from "./mixins/EnsureNotAuthMixin";

export default {
  components: { Logo, TextInput, SpinnerLoading },
  mixins: [validationMixin, EnsureNotAuthMixin],
  data() {
    return {
      email: "",
      password: "",
      submited: false,
      isLoading: false,
    };
  },
  validations: {
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
        await this.signIn(this.$data);
        this.isLoading = false;
      }
    },
    async signIn({ email, password }) {
      try {
        const {
          data: { user, authToken },
        } = await axiosApi.post(API_ROUTES.signIn, {
          email,
          password,
        });
        this.$store.dispatch("setUser", { user, authToken });
      } catch (err) {
        this.handleSignInApiError(err);
      }
    },
    handleSignInApiError(err) {
      const notification = {
        type: "error",
        title: "Unexpected error",
        content: "Some thing went wrong!<br/> Please repeate later.",
        hideDuration: 6000,
      };
      const error = err?.response?.data?.error;
      if (error) {
        if (error == "USER_NOT_FOUND") {
          notification.title = "Account not found";
          notification.content = `A user with this email doesn't exists!<br/> Please re-check your email to sign in.`;
        } else if (error == "WRONG_PASSWORD") {
          notification.title = "Wrong password";
          notification.content =
            "The password you entered was wrong! <br/> Please re-check your password to sign in.";
        } else if (error == "INPUTS") {
          notification.title = "Invalid inputs";
          notification.content = "PLease re-check your fields again!";
        }
      }
      this.$notify(notification);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>