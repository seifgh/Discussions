<template>
  <div class="theme-color">
    <h2>Select a theme color</h2>
    <div class="colors">
      <span
        v-for="(color, i) in colors"
        :key="i"
        @click="selectColor(color)"
        class="color-box"
        :class="{ active: color == selectedColor }"
        :style="{ background: color }"
      >
      </span>
    </div>
  </div>
</template>

<script>
import {
  COLORS,
  getCurrentThemeColor,
  setThemeColor,
} from "./../../../theme-colors";
export default {
  data() {
    return { selectedColor: getCurrentThemeColor() };
  },
  beforeMount() {
    this.colors = COLORS;
  },
  methods: {
    selectColor(color) {
      this.selectedColor = color;
      setThemeColor(color);
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  @apply text-3xl font-bold mt-8 mb-12;
}
.theme-color {
  @apply flex flex-col items-center;
}
.colors {
  width: 700px;
  @apply flex flex-wrap items-center justify-center
    max-w-full;
}
.color-box {
  @apply relative w-32 h-32 flex items-center justify-center m-4
  rounded-xl shadow-md cursor-pointer;
  &.active {
    &::before {
      content: " ";
      @apply absolute left-0 top-0 m-2 w-6 h-6 rounded-lg bg-white;
    }
  }
}
</style>