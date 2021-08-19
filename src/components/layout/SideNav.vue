<template>
  <div class="nav-root">
    <div ref="sidenavRoot" class="sidenav">
      <div class="setting-block">
        <span>Logs view type:</span>
        <ul class="tab">
          <li
            v-for="(item, index) in items"
            v-bind:key="index"
            v-bind:class="{ active: item.active }"
          >
            <input
              v-bind:id="'tab' + index"
              :checked="item.active"
              v-on:click="toggleActive(item)"
              type="radio"
              v-bind:name="'tab' + index"
            />
            <label v-bind:for="'tab' + index">{{ item.text }}</label>
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
import HeaderService, {
  Header_LogViewTypeEnum,
} from "@/services/HeaderService";
// components
// utils
import RxSource from "@/utils/rx/SourceRx";

interface ITogglable<T> {
  text: string;
  active: boolean;
  value: T;
}

export default class SideNav extends Vue {
  public isOpened = false;
  @Ref() sidenavRoot!: HTMLDivElement;
  @Prop() sidebarEmitter!: RxSource<Boolean>;
  private _disposable: (() => void)[] = [];
  //
  @Inject() headerService!: HeaderService;

  public items: ITogglable<Header_LogViewTypeEnum>[] = [
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

  public mounted(): void {
    // open/close sidebar
    this._disposable.push(
      this.sidebarEmitter.on((newState) => {
        if (newState) {
          this.open();
        } else {
          this.close();
        }
      })
    );
    // logs view setting
    this._disposable.push(
      this.headerService.logViewType.on((newVal) => {
        this.items.forEach((f) => {
          f.active = f.value === newVal;
        });
      })
    );
    this.items.forEach((f) => {
      f.active = f.value === this.headerService.logViewType.value;
    });
  }
  public unmounted(): void {
    if (this._disposable.length) {
      for (const disposable of this._disposable) {
        disposable();
      }
      this._disposable.length = 0;
    }
  }

  public toggleActive(item: ITogglable<Header_LogViewTypeEnum>) {
    this.headerService.logViewType.setValue(item.value);
  }
  // sidebar toggle
  public toggle(): void {
    this.isOpened = !this.isOpened;
    this.applyState();
  }
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
