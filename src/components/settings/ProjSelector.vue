<template>
  <div class="setting-block">
    <span>Projects</span>
    <ul class="tab">
      <li v-for="proj in mappedProjects" v-bind:key="proj">
        <input
          v-bind:id="'proj_tab_' + proj.value"
          :checked="proj.active"
          v-on:click="selectProj(proj)"
          type="checkbox"
          v-bind:name="'proj_tab' + proj.value"
        />
        <label v-bind:for="'proj_tab_' + proj.value">{{ proj.text }}</label>
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

export default class ProjSelector extends Vue {
  @Inject() readonly settingsService!: SettingsService;
  private mappedProjects: ITogglable<string>[] = [];

  public get selectedProject(): string[] {
    return this.settingsService.selectedProjectStream.value;
  }

  private disposable: (() => void)[] = [];

  public beforeMount() {
    this.disposable.push(
      this.settingsService.allEnvsWithProjectsStream.on((_) =>
        this.updateProjectsList()
      )
    );

    this.disposable.push(
      this.settingsService.selectedEnvStream.on((_) =>
        this.updateProjectsList()
      )
    );

    this.disposable.push(
      this.settingsService.selectedProjectStream.on((selectedProjects) => {
        this.mappedProjects.forEach((f) => {
          const selectedEnvInside = selectedProjects.find(
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

  public selectProj(selectedProject: ITogglable<string>): void {
    selectedProject.active = !selectedProject.active;
    this.settingsService.selectedProjectStream.setValue(
      this.mappedProjects.filter((f) => f.active).map((m) => m.value)
    );
  }

  private updateProjectsList(): void {
    const rawProjects: string[] = [];
    const selectedEnvs = this.settingsService.selectedEnvStream.value;
    Object.keys(this.settingsService.allEnvsWithProjectsStream.value).forEach(
      (m) => {
        if (selectedEnvs.indexOf(m) >= 0) {
          const projectsInEnv =
            this.settingsService.allEnvsWithProjectsStream.value[m];
          for (const env_proj of projectsInEnv) {
            if (rawProjects.indexOf(env_proj) < 0) {
              rawProjects.push(env_proj);
            }
          }
        }
      }
    );

    this.mappedProjects = rawProjects.map((rp) => {
      return {
        text: rp,
        active: this.selectedProject.indexOf(rp) >= 0,
        value: rp,
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.setting-block {
  display: flex;
  flex-direction: column;
}
</style>
