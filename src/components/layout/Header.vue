<template>
  <div class="header">
    <div class="sidenav-btn">
      <button class="btn-expand" v-on:click="toggleSidebar()">≡</button>
    </div>
    <div class="half">
      <h1>{{ title }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// utils
import RxSource from "@/utils/rx/SourceRx";

export default class Header extends Vue {
  @Prop() title!: string;
  @Prop() sidebarEmitter!: RxSource<Boolean>;
  private isSidebarActive = false;

  public toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
    this.sidebarEmitter.emit(this.isSidebarActive);
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
  justify-content: flex-start;;
  align-items: center;
  .sidenav-btn {
    width: 40px;
    padding-right: 60px;
    padding-left: 20px;
  }
}
</style>
