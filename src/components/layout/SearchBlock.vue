<template>
  <div class="root-search-block">
    <div>
      <div class="search-block">
        <div class="line">
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
          </div>
        </div>
        <div class="line">
          <div class="part title">
            <h2>{{ lookFor2 }}</h2>
          </div>
          <div class="part inline">
            <span>from:</span>
            <Datepicker
              v-model="pickedFrom"
              :disabled="isBusy"
              :inputFormat="dateFormat"
              :upperLimit="pickedTo"
              :clearable="true"
            />
            <span>to:</span>
            <Datepicker
              v-model="pickedTo"
              :inputFormat="dateFormat"
              :disabled="isBusy"
              :lowerLimit="pickedFrom"
              :clearable="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <button
        class="btn-expand search-btn"
        :disabled="isBusy"
        type="button"
        v-on:click="search()"
      >
        <img src="@/assets/msg-icons/note-search-outline.png" />
        <span>Filter</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";
// thirdparty
import Datepicker from "vue3-datepicker";
// utils
import RxSource from "@/utils/rx/SourceRx";
import RxVariable from "@/utils/rx/VariableRx";

@Options({
  components: {
    Datepicker,
  },
})
export default class SearchBlock extends Vue {
  @Prop() lookFor!: string;
  lookFor2 = "Filter Dates:";
  @Prop() isBusy = false;
  @Prop() searchStream?: RxVariable<string>;
  @Prop() filterDatesStream?: RxVariable<{ from?: Date; to?: Date }>;
  @Prop() emitSearchStream?: RxSource<void>;

  public dateFormat = 'dd.MM.yyyy';

  public get pickedFrom(): Date | undefined {
    return this.filterDatesStream?.value.from;
  }
  public set pickedFrom(val: Date | undefined) {
    this.filterDatesStream?.setValue({
      from: val,
      to: this.pickedTo,
    });
  }

  public get pickedTo(): Date | undefined {
    return this.filterDatesStream?.value.to;
  }
  public set pickedTo(val: Date | undefined) {
    this.filterDatesStream?.setValue({
      from: this.pickedFrom,
      to: val,
    });
  }

  public searchQuery: string = "";

  public beforeMount() {
    this.pickedFrom = this.filterDatesStream?.value.from;
    this.pickedTo = this.filterDatesStream?.value.to;
  }

  public search(): void {
    this.searchStream?.setValue(this.searchQuery);
    this.filterDatesStream?.setValue({
      from: this.pickedFrom,
      to: this.pickedTo,
    });
    this.emitSearchStream?.emit();
  }
}
</script>

<style scoped lang="scss">
.root-search-block {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: calc(100% - 40px);
  min-width: 570px;
  height: 120px;
  padding: 20px;
  margin: 20px auto 20px auto;
  box-shadow: 0px 2px 6px -2px grey;
  background-color: white;
  justify-content: space-between;
}

.search-block {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  .line {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding-bottom: 5px;

    .part {
      width: 50%;
      margin-right: 40px;
      &.title {
        text-align: right;
        margin: 0px;
        padding-right: 20px;
        * {
          margin: 0px;
        }
      }
      &.inline {
        display: inline-flex;
        align-items: flex-end;
        span {
          margin: 0px 6px;
        }
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
    }
  }
}

.search-btn {
  // padding: 4px 8px;
  width: 135px;
  span {
    font-size: 26px;
  }
  img {
    float: left;
    width: 26px;
    height: 26px;
    filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(88deg)
      brightness(100%) contrast(95%);
  }
}
</style>
