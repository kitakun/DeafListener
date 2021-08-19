<template>
  <div class="root-container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class PageBody extends Vue {}
</script>

<style scoped>
.root-container {
  min-height: calc(100% - 57px);
  background-color: rgb(25 20 97 / 3%);
}
</style>
