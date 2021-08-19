<template>
  <div class="log-preview">
    <!-- render all scopes OR render only root scope -->
    <ExpandableBlock
      v-if="isScope && couldUseScopesInRender"
      :datetime="log.createdAt"
      :preview="log.text"
    >
      <div
        class="content elepsis"
        :key="index"
        v-for="(previewLog, index) in log.innerLogs"
      >
        <LogPreviewComponent
          :log="previewLog"
          :sharedData="sharedData"
          :key="index"
        ></LogPreviewComponent>
      </div>
    </ExpandableBlock>
    <!-- render messages without scopes -->
    <div v-else-if="isScope && !couldUseScopesInRender">
      <div
        class="content elepsis"
        :key="index"
        v-for="(previewLog, index) in log.innerLogs"
      >
        <LogPreviewComponent
          :log="previewLog"
          :sharedData="sharedData"
          :key="index"
        ></LogPreviewComponent>
      </div>
    </div>
    <!-- render log body -->
    <div v-else>
      <LogMessageComponent
        :log="log"
        :sharedData="sharedData"
      ></LogMessageComponent>
    </div>
  </div>
</template>

<script lang="ts">
// decorators
import { Options, Vue } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
// types
import { LogPreviewData } from "@/types/LogRenderModels";
import { DeafLog, DeafScope } from "@/types/FetchModels";
import { Header_LogViewTypeEnum } from "@/types/SettingEnums";
// components
import ExpandableBlock from "@/components/layout/ExpandableBlock.vue";
import LogMessageComponent from "@/components/log/LogMessageComponent.vue";
// services
import SettingsService from "@/services/SettingsService";

@Options({
  components: {
    ExpandableBlock,
    LogMessageComponent,
  },
})
/* here we rendering log message or scope (which contains another log or scopes) */
export default class LogPreviewComponent extends Vue {
  // props
  @Prop() public log!: LogPreviewData;
  @Prop() public sharedData!: (DeafScope | DeafLog)[];
  // services
  @Inject() settingsService!: SettingsService;

  public get isScope(): boolean {
    return this.log.isScope;
  }
  public get isException(): boolean {
    return this.log?.isException ?? false;
  }
  // how to render
  public get couldUseScopesInRender(): boolean {
    return (
      this.settingsService.logViewType.value ===
        Header_LogViewTypeEnum.ShowOnlyMainScope ||
      this.settingsService.logViewType.value ===
        Header_LogViewTypeEnum.ShowAllScopes
    );
  }
  public get couldRenderOnlyMainScope(): boolean {
    return (
      this.settingsService.logViewType.value ===
      Header_LogViewTypeEnum.ShowOnlyMainScope
    );
  }
}
</script>

<style scoped lang="scss">
</style>
