<template>
  <div
    class="log-record"
    v-bind:class="{
      expanded: p_isExpanded,
      isVerticalView: verticalViewType === 1,
      sideBarIsOpened: sideBarStateEmitter.value && verticalViewType === 1,
    }"
  >
    <div class="log-record-header">
      <button v-if="!p_isExpanded" v-on:click="toggle" class="btn-expand">
        ►
      </button>
      <button v-else class="btn-expand" v-on:click="toggle">◄</button>
      <div class="title elepsis">{{ log.message }}</div>
      <span class="created-at">{{ createdAt }}</span>
    </div>
    <div
      class="content elepsis"
      :key="index"
      v-for="(previewLog, index) in log.logsBlockPreviev"
    >
      <LogPreviewComponent
        :log="previewLog"
        :sharedData="sharedData"
        :verticalViewType="verticalViewType"
        :key="index"
      ></LogPreviewComponent>
    </div>
  </div>
</template>

<script lang="ts">
// decorators
import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// unilts
import { formatLogTime } from "@/utils/datetime";
import RxVariable from "@/utils/rx/VariableRx";
// types
import { DeafLog, DeafScope } from "@/types/FetchModels";
import { Header_LogDirectionViewTypeEnum } from "@/types/SettingEnums";
// components
import LogPreviewComponent from "./LogPreviewComponent.vue";

@Options({
  components: {
    LogPreviewComponent,
  },
})
/* here we building View for root logs container */
export default class LogRecordComponent extends Vue {
  @Prop() readonly sideBarStateEmitter!: RxVariable<Boolean>;
  // props
  @Prop() public log!: DeafScope | DeafLog;
  @Prop() public sharedData!: (DeafScope | DeafLog)[];
  @Prop() public isExpanded: boolean = false;
  @Prop() public verticalViewType!: Header_LogDirectionViewTypeEnum;

  // computed
  public get isScope(): boolean {
    if (this.log instanceof DeafScope) {
      return true;
    }
    return false;
  }

  public get createdAt(): string {
    if (this.isScope && this.log.createdAt) {
      return `${formatLogTime(this.log.createdAt)}`;
    }

    if (this.log instanceof DeafLog && this.log.createdAt) {
      return `${formatLogTime(this.log.createdAt)}`;
    }

    return "-";
  }

  // privates
  private p_isExpanded: boolean = false;

  // cycle methods
  mounted() {
    this.p_isExpanded = this.isExpanded;
  }

  // public methods
  public toggle(): void {
    this.p_isExpanded = !this.p_isExpanded;
  }
}
</script>

<style scoped lang="scss">
.log-record {
  overflow: hidden;
  border: 2px solid #29668f;
  border-radius: 4px;
  box-shadow: 0px 10px 10px -8px #828586;
  width: 240px;
  height: 180px;
  margin-right: 5px;
  margin-top: 5px;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  &.sideBarIsOpened,
  &.isVerticalView {
    width: 100%;
  }
  &.expanded {
    border: 4px solid #29668f;
    width: 100%;
    height: 380px;
    overflow-y: auto;
    .title {
      overflow-x: auto;
      text-overflow: initial;
      &::-webkit-scrollbar {
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
      }
    }
  }
  .log-record-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .title {
      font-size: 20px;
      height: 26px;
      vertical-align: middle;
      width: 100%;
      text-align: left;
      padding-left: 5px;
    }
    .created-at {
      font-size: 14px;
      white-space: nowrap;
    }
  }
  .content {
    // background-color: #276873;
    text-align: left;
  }
}
</style>
