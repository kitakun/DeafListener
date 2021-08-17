<template>
  <div class="expandable-block" v-bind:class="{ expanded: p_isExpanded }">
    <div class="line flex-line">
      <button v-if="!p_isExpanded" v-on:click="toggle" class="btn-expand">
        ►
      </button>
      <button v-else class="btn-expand" v-on:click="toggle">◄</button>
      <span class="exp-title">
        <span v-bind:class="{ small: !p_isExpanded, huge: p_isExpanded }">{{
          datetime
        }}</span>
        <span v-if="!p_isExpanded">{{ preview }}</span>
      </span>
    </div>
    <div class="line" v-if="p_isExpanded">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class ExpandableBlock extends Vue {
  @Prop() datetime: string = "";
  @Prop() preview: string = "";
  // privates
  private p_isExpanded: boolean = false;

  // cycle methods
  mounted() {
    this.p_isExpanded = false;
  }

  // public methods
  public toggle(): void {
    this.p_isExpanded = !this.p_isExpanded;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.expandable-block {
  border: 2px solid #29668f;
  border-radius: 4px;
  box-shadow: 0px 10px 10px -8px #828586;
  // width: 240px;
  height: 40px;
  margin-right: 4px;
  margin-top: 4px;
  padding: 4px;
  transition: all 0.2s ease-in-out;
  &.expanded {
    border: 4px solid #29668f;
    width: 100%;
    height: 100%;
    .title {
      overflow-x: auto;
      text-overflow: initial;
      &::-webkit-scrollbar {
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
      }
    }
  }
  .line {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: flex-start;
    align-items: flex-start;
    .exp-title {
      padding: 5px 0px 0px 5px;
      transition: all 0.2s ease-in-out;
      .small {
        padding-right: 5px;
        font-size: 12px;
      }
      .huge {
        font-size: 16px;
      }
    }
    &.flex-line {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .title {
      font-size: 20px;
      height: 26px;
      vertical-align: middle;
      width: 100%;
      text-align: left;
      padding-left: 5px;
    }
  }
  .content {
    background-color: #276873;
  }
}
</style>
