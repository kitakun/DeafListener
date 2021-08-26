<template>
  <Header :title="'PIM Logs'" :sidebarEmitter="sideBarStateEmitter"></Header>
  <SideNav ref="sidenav" :sidebarEmitter="sideBarStateEmitter">
    <PageBody :sideBarStateEmitter="sideBarStateEmitter">
      <SearchBlock
        :isBusy="false"
        :searchStream="settingsService.searchStream"
        :lookFor="'Search text:'"
      ></SearchBlock>
      <LogsListComponent
        :sideBarStateEmitter="sideBarStateEmitter"
      ></LogsListComponent>
    </PageBody>
  </SideNav>
</template>

<script lang="ts">
import "reflect-metadata";
// vue
import { Vue } from "vue-class-component";
import { Options } from "vue-class-component";
// 3rdparty
import { Provide, Ref } from "vue-property-decorator";
// services
import LogsService from "./services/LogsService";
import MapService from "./services/MapService";
import SettingsService from "./services/SettingsService";
import SignalRService from "./services/SignalrService";
import StorageService from "./services/StorageService";
// components
import Header from "@/components/layout/Header.vue";
import SideNav from "@/components/settings/SideNav.vue";
import PageBody from "@/components/layout/PageBody.vue";
import SearchBlock from "@/components/layout/SearchBlock.vue";
import ExpandableBlock from "@/components/layout/ExpandableBlock.vue";
import LogsListComponent from "@/components/log/LogsListComponent.vue";
// utils
import RxVariable from "./utils/rx/VariableRx";
import { IEnvsToProjects } from "./types/SettingsModels";
import { isDebug } from "./utils/environments";

@Options({
  components: {
    Header,
    PageBody,
    SideNav,
    SearchBlock,
    ExpandableBlock,
    LogsListComponent,
  },
})
export default class App extends Vue {
  @Provide() readonly logsService = new LogsService();
  @Provide() readonly mapService = new MapService();
  @Provide() readonly settingsService = new SettingsService();
  @Provide() readonly signalRService = new SignalRService();
  @Provide() readonly storeService = new StorageService();
  @Ref() readonly sidenav!: SideNav;
  public readonly sideBarStateEmitter = new RxVariable<Boolean>(false, true);

  private disposables: (() => void)[] = [];

  public async mounted(): Promise<void> {
    const projectsInfo = await this.logsService.Hello();
    if (projectsInfo) {
      if (isDebug()) {
        console.log(`DB Size=${projectsInfo.databasesize}`);
      }
      // pass envs + projects to services
      const envsToProjsMap = {} as IEnvsToProjects;
      projectsInfo.envsToProjectsList.forEach((f) => {
        envsToProjsMap[f.key] = f.valueList;
      });
      this.settingsService.allEnvsWithProjectsStream.setValue(envsToProjsMap);
      // connect live-updates only if we connected to server
      this.disposables.push(
        this.settingsService.livetypeLoadingStream.on((isEnabled) => {
          if (isEnabled) {
            this.signalRService.connect(this.logsService.logsStream);
          } else {
            this.signalRService.disconnect(true);
          }
        })
      );
    }
    this.settingsService.setStore(this.storeService);
  }
  public async unmounted(): Promise<void> {
    for (const disposable of this.disposables) {
      disposable();
    }
    this.disposables.length = 0;
    await this.signalRService.disconnect(true);
  }
}
</script>

<style lang="scss">
html,
body {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

/* shared */
.elepsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* components */
.btn-expand {
  box-shadow: inset 0px 1px 0px 0px #276873;
  background: linear-gradient(to bottom, #599bb3 5%, #408c99 100%);
  background-color: #599bb3;
  border: 1px solid #828586;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 13px;
  font-weight: bold;
  padding: 6px 12px;
  text-decoration: none;
  &[disabled] {
    cursor: default;
    background-color: #36484e;
    background: linear-gradient(to bottom, #4b7585 5%, #3b7079 100%);
  }
  &:hover:enabled {
    background: linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
    background-color: #408c99;
  }
  &:active:enabled {
    position: relative;
    top: 1px;
  }
}
/* togglable group */
ul.tab {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-radius: 5px;
  li {
    float: left;
    padding: 0;
    label {
      background: white;
      padding: 6px;
      border: 1px solid #ccc;
      display: inline-block;
    }
  }
  * > input[type="radio"] {
    opacity: 0;
    width: 1px;
    height: 1px;
    &:checked ~ label {
      box-shadow: inset 0px 1px 0px 0px #276873;
      background: linear-gradient(to bottom, #599bb3 5%, #408c99 100%);
      background-color: #599bb3;
      border: 1px solid #828586;
      color: white;
    }
  }
}

input[type="checkbox"] {
  width: 24px;
  height: 24px;
  position: relative;
  top: 6px;
}

/* vue - animations */
.slide-fade-enter-active {
  transition: all 0.1s ease !important;
  opacity: 0 !important;
  transform: scale(0.9);
  background-color: #72c7d6;
}
.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1) !important;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0 !important;
  transform: translateY(400) !important;
  transform: scale(0.9);
}
</style>
