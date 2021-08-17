<template>
  <div class="header">
    <div class="half">
      <h1>{{ title }}</h1>
    </div>
    <div class="half">
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
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Inject, Prop } from "vue-property-decorator";
// service
import HeaderService, {
  Header_LogViewTypeEnum,
} from "@/services/HeaderService";

interface ITogglable<T> {
  text: string;
  active: boolean;
  value: T;
}

export default class Header extends Vue {
  @Prop() title!: string;
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

  private disposables?: () => void;

  public mounted(): void {
    this.disposables = this.headerService.logViewType.on((newVal) => {
      this.items.forEach((f) => {
        f.active = f.value === newVal;
      });
    });
    this.items.forEach((f) => {
      f.active = f.value === this.headerService.logViewType.value;
    });
  }
  public unmounted(): void {
    if (this.disposables) {
      this.disposables();
      this.disposables = void 0;
    }
  }

  public toggleActive(item: ITogglable<Header_LogViewTypeEnum>) {
    this.headerService.logViewType.setValue(item.value);
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
  justify-content: space-around;
  align-items: center;
}
</style>
