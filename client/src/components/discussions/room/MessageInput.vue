<template>
  <form @submit.prevent="handleSubmit" class="message-input">
    <input
      ref="input"
      type="text"
      spellcheck="true"
      v-model="textMessage"
      placeholder="Type your message here."
    />
    <div class="right">
      <emojies @appendToMessage="appendEmojieToMessage" />
      <button :disabled="isLoading" class="send-btn">
        <spinner-loading v-if="isLoading" />
        <send-icon v-else />
      </button>
    </div>
  </form>
</template>

<script>
import { API_ROUTES, axiosApi } from "../../../api";
import SendIcon from "../../icons/SendIcon.vue";
import SpinnerLoading from "../../SpinnerLoading.vue";
import { emojiesWithCodes } from "./emojies.json";

import Emojies from "./Emojies.vue";
export default {
  components: {
    SendIcon,
    SpinnerLoading,
    Emojies,
  },
  data() {
    return {
      textMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.textMessage = this.textMessage.trim();
      if (this.textMessage.length && !this.isLoading) {
        this.isLoading = true;
        await this.sendMessage({ content: this.textMessage });
        this.textMessage = "";
        this.isLoading = false;
      }
    },
    async sendMessage({ content }) {
      try {
        await axiosApi.post(
          API_ROUTES.sendRoomMessage(this.$store.state.openRoom.data._id),
          { content }
        );
      } catch (err) {
        this.handleSendMessageApiErrors(err);
      }
    },
    handleSendMessageApiErrors() {
      // no errors expected
      this.$notify({
        type: "error",
        title: "Unexpected error",
        content: "Something went wrong, please try later.",
      });
    },
    appendEmojieToMessage(emojie) {
      const beforeEmojie = this.textMessage.length ? " " : "";
      this.textMessage = this.textMessage.trim() + beforeEmojie + emojie;
      this.$refs.input.focus();
    },
    formatTextEmojieCodes() {
      emojiesWithCodes.forEach(({ code, emojie }) => {
        const message = this.textMessage;

        let codeToReplace;
        if (message.includes(code)) {
          codeToReplace = code;
        }

        if (message.includes(code.toLowerCase())) {
          codeToReplace = code.toLowerCase();
        }
        if (message.includes(code.toUpperCase())) {
          codeToReplace = code.toUpperCase();
        }
        if (codeToReplace)
          this.textMessage = message.replace(codeToReplace, emojie);
      });
    },
  },
  watch: {
    textMessage() {
      this.formatTextEmojieCodes();
    },
  },
};
</script>
<style lang="scss" scoped>
.message-input {
  height: var(--room-message-input-height);
  @apply sticky bottom-0 flex w-full items-center 
  justify-between pr-2 pl-4 rounded-xl border bg-white z-0;
}
.right {
  @apply flex items-center;
}
.send-btn {
  @apply bg-primary rounded-xl flex items-center justify-center w-14 h-14;

  .spinner::after {
    @apply w-5 h-5;
  }
}
input {
  @apply outline-none focus:outline-none w-full border-r mr-4 pr-2 h-1/2;
}
</style>