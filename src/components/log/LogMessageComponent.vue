<template>
  <div class="log-message">
    <img
      :alt="iconType"
      :title="iconType"
      class="icon"
      :class="iconType"
      :src="iconSrc"
    />
    <span class="date">{{ log.createdAt }}</span>
    <span>{{ log.text }}</span>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// types
import { LogPreviewData } from "@/types/LogRenderModels";
import { DeafLog, DeafScope } from "@/types/FetchModels";
import { LogLevel } from "@/proto/generated/logi_client_pb";

export default class LogMessageComponent extends Vue {
  // props
  @Prop() public log!: LogPreviewData;
  @Prop() public sharedData!: (DeafScope | DeafLog)[];

  public get iconType(): string {
    return this.getIconType(this.log) ?? "-";
  }

  public get iconSrc(): string {
    switch (this.iconType) {
      case "ERROR":
        return require("@/assets/msg-icons/close-octagon.png");
      case "WARNING":
        return require("@/assets/msg-icons/alert-outline.png");
      case "INFORMATION":
        return require("@/assets/msg-icons/information-outline.png");
      case "DEBUG":
        return require("@/assets/msg-icons/microsoft-visual-studio-code.png");
      case "VERBOSE":
        return require("@/assets/msg-icons/information-outline.png");
      default:
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=";
    }
  }

  private getIconType(lookIn: LogPreviewData): string | null {
    if (lookIn.id) {
      for (const el of this.sharedData) {
        if (el instanceof DeafScope) {
          const resl = this.getIconTypeFromInnerScope(lookIn.id, el);
          if (resl) {
            return resl;
          }
        }
        if (el instanceof DeafLog && el.logId === lookIn.id) {
          // is log
          return this.logLevelToStr(el.level);
        }
      }
    }
    return null;
  }

  private getIconTypeFromInnerScope(
    logId: number,
    innScope: DeafScope
  ): string | null {
    for (const innPrv of innScope.innerLogs) {
      if (innPrv.logId === logId) {
        return this.logLevelToStr(innPrv.level);
      }
    }
    for (const innScopeEl of innScope.innerScopes) {
      const res = this.getIconTypeFromInnerScope(logId, innScopeEl);
      if (res) {
        return res;
      }
    }
    return null;
  }

  private logLevelToStr(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return "ERROR";
      case LogLevel.WARNING:
        return "WARNING";
      case LogLevel.INFORMATION:
        return "INFORMATION";
      case LogLevel.DEBUG:
        return "DEBUG";
      case LogLevel.VERBOSE:
        return "VERBOSE";
      default:
        console.warn(`Type ${level} not implemented!`);
        return "INFORMATION";
    }
  }
}
</script>

<style scoped lang="scss">
.log-message {
  font-size: 16px;
}
.icon {
  width: 24px;
  height: 24px;
  position: relative;
  top: 5px;
  margin-right: 4px;
  &.VERBOSE {
    filter: invert(60%) sepia(65%) saturate(2968%) hue-rotate(192deg)
      brightness(103%) contrast(95%);
  }
  &.INFORMATION {
    filter: invert(59%) sepia(63%) saturate(5979%) hue-rotate(165deg)
      brightness(99%) contrast(101%);
  }
  &.WARNING {
    filter: invert(86%) sepia(81%) saturate(3392%) hue-rotate(345deg)
      brightness(86%) contrast(110%);
  }
  &.ERROR {
    filter: invert(16%) sepia(90%) saturate(6231%) hue-rotate(358deg)
      brightness(108%) contrast(113%);
  }
  &.DEBUG {
    filter: invert(59%) sepia(97%) saturate(400%) hue-rotate(2deg)
      brightness(86%) contrast(88%);
  }
}
.date {
  font-size: 14px;
  color: cadetblue;
  margin-right: 4px;
}
</style>
