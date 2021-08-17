<template>
  <div class="search-block">
    <div class="part title">
      <h2>{{ lookFor }}</h2>
    </div>
    <div class="part inline">
      <input
        class="search-input"
        :disabled="isBusy"
        v-model="searchQuery"
        type="text"
      />
      <button
        class="btn-expand search-btn"
        :disabled="isBusy"
        type="button"
        v-on:click="search()"
      >
        <img src="@/assets/msg-icons/note-search-outline.png" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import RxVariable from "@/utils/rx/VariableRx";
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class SearchBlock extends Vue {
  @Prop() lookFor!: string;
  @Prop() isBusy = false;
  @Prop() searchStream?: RxVariable<string>;

  public searchQuery: string = "";

  public search(): void {
    if (this.searchStream && this.searchQuery) {
      this.searchStream.setValue(this.searchQuery);
    }
  }
}
</script>

<style scoped lang="scss">
.search-block {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: calc(100% - 40px);
  height: 60px;
  padding: 20px;
  margin: 20px auto 20px auto;
  box-shadow: 0px 2px 6px -2px grey;
  background-color: white;
  .part {
    width: 50%;
    margin-right: 40px;
    &.title {
      text-align: right;
      padding-right: 20px;
    }
    &.inline {
      display: inline-flex;
    }
    .search-input {
      border: 1px solid rgb(202, 202, 202);
      width: 100%;
      height: 40px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      &[disabled] {
        background-color: gainsboro;
      }
      &:hover {
        border: 1px solid darkgray;
      }
      &:active {
        border: 1px solid gray;
      }
    }
    .search-btn {
      padding: 4px 8px;
      img {
        float: left;
        width: 26px;
        height: 26px;
        filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(88deg)
          brightness(100%) contrast(95%);
      }
    }
  }
}
</style>
