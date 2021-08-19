<template>
  <Header :title="'PIM Logs'" :sidebarEmitter="sideBarStateEmitter"></Header>
  <SideNav ref="sidenav" :sidebarEmitter="sideBarStateEmitter">
    <PageBody :sideBarStateEmitter="sideBarStateEmitter">
      <SearchBlock
        :isBusy="false"
        :searchStream="settingsService.searchStream"
        :lookFor="'Search text:'"
      ></SearchBlock>
      <LogsListComponent :sideBarStateEmitter="sideBarStateEmitter"></LogsListComponent>
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
// components
import Header from "@/components/layout/Header.vue";
import SideNav from "@/components/layout/SideNav.vue";
import PageBody from "@/components/layout/PageBody.vue";
import SearchBlock from "@/components/layout/SearchBlock.vue";
import ExpandableBlock from "@/components/layout/ExpandableBlock.vue";
import LogsListComponent from "@/components/log/LogsListComponent.vue";
// utils
import RxVariable from "./utils/rx/VariableRx";

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
  @Ref() readonly sidenav!: SideNav;
  public readonly sideBarStateEmitter = new RxVariable<Boolean>(false, true);

  private disposables: (() => void)[] = [];

  public mounted(): void {
    this.disposables.push(
      this.settingsService.livetypeLoadingStream.on((isEnabled) => {
        if (isEnabled) {
          this.signalRService.connect(this.logsService.logsStream);
        } else {
          this.signalRService.disconnect();
        }
      })
    );
  }
  public async unmounted(): Promise<void> {
    for (const disposable of this.disposables) {
      disposable();
    }
    this.disposables.length = 0;
    await this.signalRService.disconnect();
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
</style>
