<template>
  <div class="fl-search-input-wrap">
    <el-input size="medium" v-model="input"
              v-if="showInput"
              ref="input"
              :placeholder="placeholder"
              :style="{width: width}"
              @blur="hideInputHandler"
              class="search-input"
              @keyup.enter.native="searchHandler">
      <i class="el-icon-search el-input__icon" slot="suffix" @click="searchHandler"></i>
    </el-input>
    <el-button type="text" @click="showInputHandler" v-else><i class="el-icon-search"></i></el-button>
  </div>
</template>

<script>
import FreelogSearchInput from './index'

export default FreelogSearchInput
</script>

<style lang="less" scoped>
  .fl-search-input-wrap {
    i {
      font-size: 18px; color: #666; cursor: pointer;
    }
  }
</style>
