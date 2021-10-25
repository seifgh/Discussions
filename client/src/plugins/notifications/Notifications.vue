<template>
  <transition-group name="fade-down" class="notifications">
    <div
      @click="$closeNotification(not.id)"
      v-for="not in $notifications.list"
      :key="not.id"
      class=""
    >
      <div class="notification-card">
        <div class="icon" :class="not.type">
          <success v-if="not.type == 'success'" />
          <error v-else-if="not.type == 'error'" />
          <info v-else />
        </div>
        <div class="details">
          <h3 :class="not.type">{{ not.title }}</h3>
          <p v-html="not.content" />
        </div>
        <button class="close-not" title="Close">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 8L8 24"
              stroke="#A3A3A3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 8L24 24"
              stroke="#A3A3A3"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition-group>
</template>

<script>
import Error from "./icons/Error.vue";
import Info from "./icons/Info.vue";
import Success from "./icons/Success.vue";
export default {
  components: { Success, Error, Info },
};
</script>


<style lang="scss" scoped>
.notifications {
  @apply fixed right-0 top-0 overflow-y-auto max-h-screen h-auto;
}
.notification-card {
  --min-height: 80px;
  width: 500px;
  min-height: var(--min-height);
  max-width: 100%;
  z-index: 1000;
  box-shadow: 0px 1px 4px 0px #00000026;
  @apply relative flex items-start justify-start max-w-full
   p-4 pr-8 rounded-2xl border border-dotted m-4 bg-white;
}
.close-not {
  @apply absolute right-0 top-0 m-2;
}
.icon {
  @apply flex items-center justify-center h-20 w-20 rounded-xl mr-4;
  svg {
    @apply w-14 h-14;
  }
  &.error {
    background: #fff2f2;
  }
  &.success {
    background: #e6f8f0;
  }
  &.info {
    background: #f3f3ff;
  }
}
.details {
  min-height: var(--min-height);
  @apply relative w-5/6 flex flex-col justify-center;
}
h3 {
  @apply uppercase font-bold text-lg;
  &.error {
    color: #f5504e;
  }
  &.success {
    color: #26bf60;
  }
  &.info {
    color: #3250ec;
  }
}
p {
  @apply text-sm mt-1;
}
</style>