<template>
  <div class="setting-block">
    <span>Environments</span>
    <ul class="tab">
      <li v-for="env in mappedEnvs" v-bind:key="env">
        <input
          v-bind:id="'env_tab_' + env.value"
          :checked="env.active"
          v-on:click="selectEnv(env)"
          type="checkbox"
          v-bind:name="'env_tab' + env.value"
        />
        <label v-bind:for="'env_tab_' + env.value">{{ env.text }}</label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
// vue stuff
import { Vue } from "vue-class-component";
import { Inject } from "vue-property-decorator";
// service
import SettingsService from "@/services/SettingsService";

interface ITogglable<T> {
  text: string;
  active: boolean;
  value: T;
}

export default class EnvSelector extends Vue {
  @Inject() readonly settingsService!: SettingsService;
  private mappedEnvs: ITogglable<string>[] = [];

  public get selectedEnv(): string[] {
    return this.settingsService.selectedEnvStream.value;
  }

  private disposable: (() => void)[] = [];

  public beforeMount() {
    this.disposable.push(
      this.settingsService.allEnvsWithProjectsStream.on((allPhojectsVal) => {
        this.mappedEnvs = Object.keys(allPhojectsVal).map((m) => {
          return {
            text: m,
            active: this.selectedEnv.indexOf(m) >= 0,
            value: m,
          };
        });
      })
    );
    this.disposable.push(
      this.settingsService.selectedEnvStream.on((selectedEnvs) => {
        this.mappedEnvs.forEach((f) => {
          const selectedEnvInside = selectedEnvs.find(
            (find) => find === f.value
          );
          if (!!selectedEnvInside && f.value === selectedEnvInside) {
            f.active = true;
          } else {
            f.active = false;
          }
        });
      })
    );
  }
  public beforeUnmount() {
    if (this.disposable && this.disposable.length > 0) {
      this.disposable.forEach((f) => f());
      this.disposable.length = 0;
    }
  }

  public selectEnv(selectedEnv: ITogglable<string>): void {
    selectedEnv.active = !selectedEnv.active;
    this.settingsService.selectedEnvStream.setValue(
      this.mappedEnvs.filter((f) => f.active).map((m) => m.value)
    );
  }
}
</script>

<style lang="scss">
.setting-block {
  padding: 4px;
  margin: 4px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  min-height: 65px;
  min-width: 235px;
}
</style>
