<template>
  <div class="logs-list" v-if="!!fetchetData">
    <LogRecordComponent
      v-for="(item, index) in fetchetData"
      :log="item"
      :sharedData="fetchetData"
      :key="index"
    ></LogRecordComponent>
  </div>
  <div v-else>empty :c</div>
  <div v-if="isLoading"><Loader></Loader></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Inject } from "vue-property-decorator";
// components
import LogRecordComponent from "./LogRecordComponent.vue";
import Loader from "@/components/layout/Loader.vue";
// services
import LogsService from "@/services/LogsService";
import { DeafLog, DeafScope } from "@/types/FetchModels";
import HeaderService from "@/services/HeaderService";
import { isDebug } from "@/utils/environments";

@Options({
  components: {
    LogRecordComponent,
    Loader,
  },
})
/* here we loading all logs that can show to client */
export default class LogsListComponent extends Vue {
  @Inject() logsService!: LogsService;
  @Inject() headerService!: HeaderService;

  public fetchetData: (DeafScope | DeafLog)[] = [];
  public isLoading = false;

  private disposables: (() => void)[] = [];

  public async mounted(): Promise<void> {
    const unsub = this.logsService.logsStream.on((newLog) => {
      this.fetchLogsAndRender();
    });
    this.disposables.push(unsub);

    const unsub2 = this.headerService.searchStream.on((searchQuery: string) => {
      this.fetchLogsAndRender(searchQuery);
    });
    this.disposables.push(unsub2);

    await this.fetchLogsAndRender();
  }

  public unmounted(): void {
    if (this.disposables.length) {
      for (const disposable of this.disposables) {
        disposable();
      }
      this.disposables.length = 0;
    }
  }

  private async fetchLogsAndRender(searchQuery?: string): Promise<void> {
    this.isLoading = true;
    try {
      if (await this.logsService.ping()) {
        const loadedData = await this.logsService.fetch(void 0, searchQuery);
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

<style scoped>
.logs-list {
  width: calc(100% - 20px);
  padding-left: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
}
</style>
