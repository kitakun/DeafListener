<template>
  <div
    class="logs-list"
    v-if="!!fetchetData"
    v-bind:class="{
      grid: verticalViewType === 0,
      vertical: verticalViewType === 1,
    }"
  >
    <transition-group name="slide-fade">
      <LogRecordComponent
        v-for="item in fetchetData"
        :log="item"
        :key="item?.logId ?? item?.scopeId"
        :sharedData="fetchetData"
        :sideBarStateEmitter="sideBarStateEmitter"
        :verticalViewType="verticalViewType"
      ></LogRecordComponent>
    </transition-group>
  </div>
  <div v-else>empty :c</div>
  <div v-if="isLoading"><Loader></Loader></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
// components
import LogRecordComponent from "./LogRecordComponent.vue";
import Loader from "@/components/layout/Loader.vue";
// services
import LogsService from "@/services/LogsService";
import MapService from "@/services/MapService";
import SettingsService from "@/services/SettingsService";
// types | utils
import { DeafLog, DeafScope } from "@/types/FetchModels";
import { isDebug } from "@/utils/environments";
import { HubLog, HubScope } from "@/types/HubModels";
import RxVariable from "@/utils/rx/VariableRx";
import { Header_LogDirectionViewTypeEnum } from "@/types/SettingEnums";

@Options({
  components: {
    LogRecordComponent,
    Loader,
  },
})
/* here we loading all logs that can show to client */
export default class LogsListComponent extends Vue {
  @Prop() readonly sideBarStateEmitter!: RxVariable<Boolean>;
  @Inject() readonly logsService!: LogsService;
  @Inject() readonly settingsService!: SettingsService;
  @Inject() readonly mapService!: MapService;

  public fetchetData: (DeafScope | DeafLog)[] = [];
  public isLoading = false;
  private searchQuery?: string;
  private verticalViewType = Header_LogDirectionViewTypeEnum.Grid;

  private disposables: (() => void)[] = [];

  public async mounted(): Promise<void> {
    this.disposables.push(
      this.logsService.logsStream.on((newLog) => {
        // we dont load livetime when we make search with query
        if (this.searchQuery === null || this.searchQuery === void 0) {
          this.realtimeUpdate(newLog);
        }
      })
    );

    this.disposables.push(
      this.settingsService.searchStream.on((searchQuery: string) => {
        this.searchQuery = searchQuery;
        this.fetchLogsAndRender(
          this.searchQuery,
          this.settingsService.selectedEnvStream.value,
          this.settingsService.selectedProjectStream.value
        );
      })
    );

    this.disposables.push(
      this.settingsService.selectedProjectStream.on((selectedProjects: string[]) => {
        this.fetchLogsAndRender(
          this.searchQuery,
          this.settingsService.selectedEnvStream.value,
          this.settingsService.selectedProjectStream.value
        );
      })
    );

     this.disposables.push(
      this.settingsService.selectedEnvStream.on((selectedEnvs: string[]) => {
        this.fetchLogsAndRender(
          this.searchQuery,
          this.settingsService.selectedEnvStream.value,
          this.settingsService.selectedProjectStream.value
        );
      })
    );

    this.disposables.push(
      this.settingsService.logDirectionViewType.on((newVal) => {
        this.verticalViewType = newVal;
      })
    );

    await this.fetchLogsAndRender(
      void 0,
      this.settingsService.selectedEnvStream.value,
      this.settingsService.selectedProjectStream.value
    );
  }

  public unmounted(): void {
    if (this.disposables.length) {
      for (const disposable of this.disposables) {
        disposable();
      }
      this.disposables.length = 0;
    }
  }

  private realtimeUpdate(newLog: HubLog | HubScope): void {
    if (newLog instanceof HubScope) {
      this.fetchetData = this.mapService.applyHubScopeToData(
        newLog,
        this.fetchetData
      );
    } else if (newLog instanceof HubLog) {
      this.fetchetData = this.mapService.applyHubLogToData(
        newLog,
        this.fetchetData
      );
    }
  }

  private async fetchLogsAndRender(
    searchQuery?: string,
    selectedEnvs?: string[],
    selectedProjects?: string[]
  ): Promise<void> {
    this.isLoading = true;
    try {
      if (await this.logsService.ping()) {
        const loadedData = await this.logsService.fetch(void 0, {
          searchQuery: searchQuery,
          selectedEnvs: selectedEnvs,
          selectedProjects: selectedProjects,
        });
        // remove logs withoud scopes and scopes without logs
        this.fetchetData = loadedData.filter(
          (f) => f instanceof DeafScope && f.logsBlockPreviev.length > 0
        );
        if (isDebug()) {
          console.log("Fetched", Array.from(this.fetchetData));
        }
      } else {
        console.error("service is unavailable?");
      }
    } finally {
      this.isLoading = false;
    }
  }
}
</script>

<style scoped lang="scss">
.logs-list {
  width: calc(100% - 20px);
  padding-left: 20px;
  padding-bottom: 20px;
  overflow: auto;
  height: calc(100% - 172px);
  &.grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
  }
}
</style>
