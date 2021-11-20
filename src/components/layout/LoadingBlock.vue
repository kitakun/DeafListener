<template>
  <div class="root-loading-block" v-if="loadersCount > 0">
    <div v-for="index in loadersCount" :key="index" class="loader"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { onMounted, onUnmounted } from "vue";
// utils
import LoadingService from "@/services/LoadingService";

@Options({
  components: {},
})
export default class LoadingBlock extends Vue {
  @Inject() readonly loadingService!: LoadingService;

  private unsubscribe?: () => void;
  private loadersCount = 0;

  created() {
    onMounted(() => {
      this.unsubscribe = this.loadingService.loadingActions.on((newLoaders) => {
        this.loadersCount = newLoaders.length;
      });
    });
    onUnmounted(() => {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = void 0;
      }
      this.loadersCount = 0;
    });
  }
}
</script>

<style scoped lang="scss">
.root-loading-block {
  display: flex;
  column-gap: 10px;
  width: 100%;
  padding: 10px;
  margin: 20 px auto 20 px 20px;
  box-shadow: 0px 2px 6px -2px grey;
  background-color: white;
}
.loader {
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
