<template>
  <div class="root-container" v-bind:class="{
      sideBarIsOpened: sideBarStateEmitter.value,
    }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// utils
import RxVariable from "@/utils/rx/VariableRx";

export default class PageBody extends Vue {
  @Prop() readonly sideBarStateEmitter!: RxVariable<Boolean>;
}
</script>

<style scoped lang="scss">
.root-container {
  width: 100%;
  min-height: calc(100% - 57px);
  background-color: #f8f8fa;
  transition: width 0.5s;
  &.sideBarIsOpened{
    width: calc(100% - 250px);
  }
}
</style>
