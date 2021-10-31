<template>
  <div class="text-input">
    <label>{{ label }}</label>
    <input
      :type="type"
      :value="value"
      :name="label"
      :placeholder="placeholder"
      @input="(e) => $emit('input', e.target.value)"
    />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    type: { type: String, default: "text" },
    placeholder: String,
  },
};
</script>

<style lang="scss" scoped>
.text-input {
  @apply w-full block mb-4;
  &.has-err {
    input {
      animation: shake 0.3s;
      @apply border-red-500;
    }
    .err {
      @apply text-red-500;
    }
  }
}
label {
  @apply font-semibold mb-2 ml-1 text-sm;
}
input {
  @apply block w-full border-2 shadow-sm border-gray-200 outline-none
  focus:outline-none p-3 rounded-lg transition-all
  focus:border-primary border-dotted focus:shadow-md;
}

.err {
  @apply block text-primary text-xs;
}
.info {
  @apply block text-gray-400 text-xs font-bold mt-1;
}
</style>