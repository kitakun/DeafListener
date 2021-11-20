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
      <Waypoint
        v-for="item in fetchetData"
        :key="item?.logId ?? item?.scopeId"
        @change="onChange"
        v-bind:id="
          'wp_' +
          (item.logId !== undefined
            ? `log_${item.logId}`
            : `scope_${item.scopeId}`)
        "
      >
        <LogRecordComponent
          :log="item"
          :sharedData="fetchetData"
          :sideBarStateEmitter="sideBarStateEmitter"
          :verticalViewType="verticalViewType"
        />
      </Waypoint>
    </transition-group>
  </div>
  <div v-else>empty :c</div>
  <div v-if="isLoading"><Loader></Loader></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Inject, Prop, Provide } from "vue-property-decorator";
// components
import { Going, Waypoint, WaypointState } from "vue-waypoint";
import LogRecordComponent from "./LogRecordComponent.vue";
import Loader from "@/components/layout/Loader.vue";
// services
import LogsService from "@/services/LogsService";
import MapService from "@/services/MapService";
import SettingsService from "@/services/SettingsService";
import LoadingService from "@/services/LoadingService";
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
    Waypoint,
  },
})
/* here we loading all logs that can show to client */
export default class LogsListComponent extends Vue {
  @Prop() readonly sideBarStateEmitter!: RxVariable<Boolean>;
  @Inject() readonly logsService!: LogsService;
  @Inject() readonly settingsService!: SettingsService;
  @Inject() readonly mapService!: MapService;
  @Inject() readonly loadingService!: LoadingService;

  public fetchetData: (DeafScope | DeafLog)[] = [];
  public isLoading = false;
  private searchQuery?: string;
  private verticalViewType = Header_LogDirectionViewTypeEnum.Grid;

  private disposables: (() => void)[] = [];

  public async mounted(): Promise<void> {
    this.disposables.push(
      this.logsService.logsStream.on((newLog) => {
        // validate fitlers
        if (this.isLogAcceptFilter(newLog)) {
          this.realtimeUpdate(newLog);
        }
      })
    );

    this.disposables.push(
      this.settingsService.emitSearchStream.on((_) => this.fetchLogsAndRender())
    );

    this.disposables.push(
      this.settingsService.selectedProjectStream.on(
        (selectedProjects: string[]) => {
          // TODO add multiple protection with timer
          this.fetchLogsAndRender();
        }
      )
    );

    this.disposables.push(
      this.settingsService.selectedEnvStream.on((selectedEnvs: string[]) => {
        // TODO add multiple protection with timer
        this.fetchLogsAndRender();
      })
    );

    this.disposables.push(
      this.settingsService.logDirectionViewType.on((newVal) => {
        this.verticalViewType = newVal;
      })
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

  public onChange(waypointState: WaypointState): void {
    if (!waypointState.el || !waypointState.el.id) return;
    const elementId = Number.parseInt(waypointState.el.id.split("_")[2]);
    const isItScope = waypointState.el.id.indexOf("_scope_") >= 0;
    const changedElement = this.fetchetData.find((f) => {
      if (!isItScope && f instanceof DeafLog) {
        if (f.logId! === elementId) {
          return true;
        }
      } else if (isItScope && f instanceof DeafScope) {
        if (f.scopeId! === elementId) {
          return true;
        }
      }

      return false;
    });
    if (changedElement && waypointState.going) {
      changedElement.isVisible = waypointState.going === Going.In;
    }
  }

  private isLogAcceptFilter(newLog: HubLog | HubScope): boolean {
    // we dont load livetime when we make search with query
    if (this.searchQuery && this.searchQuery.length) return false;

    if (newLog instanceof HubScope) {
      const currentSelectedProjects =
        this.settingsService.selectedProjectStream.value;
      const currentSelectedEnvs = this.settingsService.selectedEnvStream.value;
      // not selected project
      if (
        currentSelectedProjects.length > 0 &&
        currentSelectedProjects.indexOf(newLog.project) < 0
      )
        return false;

      // not selected env
      if (
        currentSelectedEnvs.length > 0 &&
        currentSelectedEnvs.indexOf(newLog.environment) < 0
      )
        return false;
    } else if (newLog instanceof HubLog) {
      // no filters for logs
      // because its hard
    }

    return true;
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
    if (this.fetchetData.length > this.logsService.TakeFetchCount) {
      this.fetchetData.length = this.logsService.TakeFetchCount;
    }
  }

  private async fetchLogsAndRender(): Promise<void> {
    this.isLoading = true;
    try {
      const pingLoader = this.loadingService.createNewLoading();
      if (await this.logsService.ping(pingLoader)) {

        // filer values
        const searchQuery = this.settingsService.searchStream.value;
        const selectedEnvs = this.settingsService.selectedEnvStream.value;
        const selectedProjects = this.settingsService.selectedProjectStream.value;
        const selectedDates = this.settingsService.dateFilerStream.value;

        const loadDataLoader = this.loadingService.createNewLoading();
        const loadedData = await this.logsService.fetch(void 0, {
          searchQuery: searchQuery,
          selectedEnvs: selectedEnvs,
          selectedProjects: selectedProjects,
          selectedDates: selectedDates
        }, loadDataLoader);
        if (loadedData.length > 20) {
          console.log("recieved count", loadedData.length);
          loadedData.length = 20;
        }
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
  min-width: 570px;
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
