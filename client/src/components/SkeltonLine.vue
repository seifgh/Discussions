 <template>
  <div class="skelton-line" :style="{ width, height }"></div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "0.5rem",
    },
  },
};
</script>

<style lang="scss" scoped>
.skelton-line {
  background-color: #e0e0e0;
  @apply relative block mt-2  overflow-hidden;
  &:first-child {
    @apply mt-0;
  }

  &::after {
    content: "";
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.3) 30%,
      rgba(#fff, 0.6) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    @apply absolute top-0 left-0 right-0 bottom-0;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
