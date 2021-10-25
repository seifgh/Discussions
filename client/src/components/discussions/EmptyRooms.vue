<template>
  <div class="empty-rooms">
    <img src="@/assets/images/empty-rooms.svg" alt="empty" />
    <p>
      <span>Oops!</span><br />
      Looks like you have no rooms
      <template v-if="searchKey.length"
        >with the name "{{ searchKey }}".</template
      >

      <template v-else
        ><br />
        Press the button below to create one
      </template>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    searchKey: String,
  },
};
</script>
<style lang="scss" scoped>
.empty-rooms {
  @apply mt-8  flex flex-col items-center text-center;
}
img {
  max-height: 40vh;
  @apply p-6;
}
p {
  span {
    @apply text-xl font-semibold;
  }
}
</style>