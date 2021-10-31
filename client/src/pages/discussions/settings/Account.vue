<template>
  <div class="account">
    <h2>Change full name</h2>
    <change-user-name-form />
    <h2>Change password</h2>
    <change-password-form />
  </div>
</template>

<script>
import ChangePasswordForm from "../../../components/discussions/settings/ChangePasswordForm.vue";
import ChangeUserNameForm from "../../../components/discussions/settings/ChangeUserNameForm.vue";

export default {
  components: { ChangeUserNameForm, ChangePasswordForm },
};
</script>

<style lang="scss" scoped>
h2 {
  @apply text-gray-600 text-2xl font-bold mt-8 mb-3 pb-4 border-b;
}
</style>