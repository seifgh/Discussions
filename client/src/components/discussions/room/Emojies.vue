<template>
  <div class="emojies-input">
    <dropdown direction="rt">
      <template #toggler>
        <span class="icon" title="Open emojies"> <emojie-icon /></span>
      </template>
      <template #content>
        <div class="dropdown-content">
          <div class="info">
            <small>Emojies - {{ emojies.length }}</small>
          </div>
          <div class="emojies">
            <span
              v-for="(emojie, i) in emojies"
              :key="i"
              @click.stop="$emit('appendToMessage', emojie)"
            >
              {{ emojie }}
            </span>
          </div>
        </div>
      </template>
    </dropdown>
  </div>
</template>

<script>
import Dropdown from "../../Dropdown.vue";
import EmojieIcon from "../../icons/EmojieIcon.vue";
import { emojies } from "./emojies.json";
export default {
  components: { Dropdown, EmojieIcon },
  computed: {
    emojies() {
      return emojies;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  @apply block mr-4 cursor-pointer;
}
.emojies {
  max-height: 300px;
  @apply p-2 overflow-auto flex flex-wrap justify-center select-none;
  span {
    @apply cursor-pointer text-2xl p-1 rounded-md;
    &:hover {
      @apply bg-gray-100;
    }
  }
}
.emojies-input {
  @apply md:flex hidden items-center justify-center;
}
.dropdown-content {
  max-width: 100%;
  width: 300px;
}
</style>