<template>
  <div class="nav-root">
    <div ref="sidenavRoot" class="sidenav">
      <div class="setting-block">
        <span>Livetime logs</span>
        <input
          :checked="isLivetimeEnabled"
          v-on:click="toggleLivetimeLoading()"
          type="checkbox"
        />
      </div>
      <div class="setting-block">
        <span>Logs view type:</span>
        <ul class="tab">
          <li
            v-for="(item, index) in logsScopeViewsItems"
            v-bind:key="index"
            v-bind:class="{ active: item.active }"
          >
            <input
              v-bind:id="'tab' + index"
              :checked="item.active"
              v-on:click="toggleScopesViewState(item)"
              type="radio"
              v-bind:name="'tab' + index"
            />
            <label v-bind:for="'tab' + index">{{ item.text }}</label>
          </li>
        </ul>
      </div>
      <div class="setting-block">
        <span>Logs direction</span>
        <ul class="tab">
          <li
            v-for="(item, index) in logsDirectionViewsItems"
            v-bind:key="index"
            v-bind:class="{ active: item.active }"
          >
            <input
              v-bind:id="'d_tab' + index"
              :checked="item.active"
              v-on:click="toggleDirectionViewState(item)"
              type="radio"
              v-bind:name="'d_tab' + index"
            />
            <label v-bind:for="'d_tab' + index">{{ item.text }}</label>
          </li>
        </ul>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
// vue stuff
import { Vue } from "vue-class-component";
import { Inject, Prop, Ref } from "vue-property-decorator";
// service
import SettingsService from "@/services/SettingsService";
// components
// utils
import { Header_LogViewTypeEnum, Header_LogDirectionViewTypeEnum } from "@/types/SettingEnums";
import RxVariable from "@/utils/rx/VariableRx";

interface ITogglable<T> {
  text: string;
  active: boolean;
  value: T;
}

export default class SideNav extends Vue {
  public isOpened = false;
  @Ref() sidenavRoot!: HTMLDivElement;
  @Prop() sidebarEmitter!: RxVariable<Boolean>;
  private disposables: (() => void)[] = [];
  //
  @Inject() settingsService!: SettingsService;
  public get isLivetimeEnabled(): boolean {
    if (this.settingsService && this.settingsService.livetypeLoadingStream) {
      return this.settingsService.livetypeLoadingStream.value;
    }
    return false;
  }

  public logsScopeViewsItems: ITogglable<Header_LogViewTypeEnum>[] = [
    {
      text: "All scopes",
      active: true,
      value: Header_LogViewTypeEnum.ShowAllScopes,
    },
    // {
    //   text: "Root scopes",
    //   active: false,
    //   value: Header_LogViewTypeEnum.ShowOnlyMainScope,
    // },
    {
      text: "Default logs",
      active: false,
      value: Header_LogViewTypeEnum.DefaultLogsView,
    },
  ];

  public logsDirectionViewsItems: ITogglable<Header_LogDirectionViewTypeEnum>[] =
    [
      {
        text: "Grid",
        active: true,
        value: Header_LogDirectionViewTypeEnum.Grid,
      },
      {
        text: "Vertical",
        active: false,
        value: Header_LogDirectionViewTypeEnum.VerticalLine,
      },
    ];

  public mounted(): void {
    // open/close sidebar
    {
      this.disposables.push(
        this.sidebarEmitter.on((newState) => {
          if (newState) {
            this.open();
          } else {
            this.close();
          }
        })
      );
    }
    // logs view setting
    {
      this.disposables.push(
        this.settingsService.logViewType.on((newVal) => {
          this.logsScopeViewsItems.forEach((f) => {
            f.active = f.value === newVal;
          });
        })
      );
      this.logsScopeViewsItems.forEach((f) => {
        f.active = f.value === this.settingsService.logViewType.value;
      });
    }
    // logs direction view setting
    {
      this.disposables.push(
        this.settingsService.logDirectionViewType.on((newVal) => {
          this.logsDirectionViewsItems.forEach((f) => {
            f.active = f.value === newVal;
          });
        })
      );
      this.logsDirectionViewsItems.forEach((f) => {
        f.active = f.value === this.settingsService.logDirectionViewType.value;
      });
    }
  }
  public unmounted(): void {
    if (this.disposables.length) {
      for (const disposable of this.disposables) {
        disposable();
      }
      this.disposables.length = 0;
    }
  }

  public toggleLivetimeLoading(): void {
    this.settingsService.livetypeLoadingStream.setValue(
      !this.settingsService.livetypeLoadingStream.value
    );
  }
  public toggleDirectionViewState(
    item: ITogglable<Header_LogDirectionViewTypeEnum>
  ) {
    this.settingsService.logDirectionViewType.setValue(item.value);
  }
  public toggleScopesViewState(item: ITogglable<Header_LogViewTypeEnum>) {
    this.settingsService.logViewType.setValue(item.value);
  }
  // sidebar toggle
  public open(): void {
    this.isOpened = true;
    this.applyState();
  }
  public close(): void {
    this.isOpened = false;
    this.applyState();
  }
  private applyState(): void {
    this.sidenavRoot.style.width = this.isOpened ? "250px" : "0px";
  }
}
</script>

<style scoped lang="scss">
.nav-root {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
  .sidenav {
    height: 100%;
    width: 0;
    flex: 0 0 auto;
    z-index: 1; /* Stay on top */
    top: 0;
    background-color: #fff;
    border-right: 1px solid gray;
    box-shadow: 10px 0 10px -8px grey;
    overflow-x: hidden;
    transition: 0.5s;
    /* The navigation menu links */
    a {
      padding: 8px 8px 8px 32px;
      text-decoration: none;
      font-size: 25px;
      color: #818181;
      display: block;
      transition: 0.3s;
      &:hover {
        color: #f1f1f1;
      }
    }
    .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
    }
  }
}
.setting-block {
  padding: 4px;
  margin: 4px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  min-height: 65px;
  min-width: 235px;
}
</style>
