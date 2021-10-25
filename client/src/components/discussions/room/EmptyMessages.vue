<template>
  <div class="empty-messages">
    <img src="@/assets/images/empty-messages.svg" />
    <h2>No messages found.</h2>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.empty-messages {
  @apply w-full h-full flex flex-col items-center justify-center;
}
h2 {
  @apply font-bold text-2xl;
}
img {
  @apply h-64 my-8;
}
</style>