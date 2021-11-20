<template>
  <div class="header">
    <div class="sidenav-btn">
      <button class="btn-expand" v-on:click="toggleSidebar()">≡</button>
    </div>
    <div class="half">
      <h1>{{ title }}</h1>
    </div>
    <div class="half fw">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// utils
import RxVariable from "@/utils/rx/VariableRx";

export default class Header extends Vue {
  @Prop() title!: string;
  @Prop() sidebarEmitter!: RxVariable<Boolean>;

  public toggleSidebar(): void {
    this.sidebarEmitter.setValue(!this.sidebarEmitter.value);
  }
}
</script>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid gray;
  height: 57px;
  max-height: 57px;
  box-shadow: 0px 10px 10px -8px grey;
  /* positioning */
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  .sidenav-btn {
    width: 40px;
    padding-right: 60px;
    padding-left: 20px;
  }
  .half {
    &.fw {
      min-width: 100px;
      width: calc(100% - 300px);
    }
  }
}
</style>
