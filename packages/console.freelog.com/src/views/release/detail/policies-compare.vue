<i18n src="./detail.i18n.json"></i18n>
<template>
  <div>
    <div class="r-d-w-r-p-compare" v-for="(item, index) in compareBox" :key="'c-p-' + index">
      <div class="r-d-w-r-p-btn" 
        :class="{'active': item.activeIndex === index}" 
        v-for="(p, index) in policies" 
        :key="'p-btn-' + index"
        @click="exchangeComparePolicy(item, index)">{{p.policyName}}</div>
      <div class="r-d-w-r-p-box">
        <h4>{{policies[item.activeIndex].policyName}}</h4>
        <pre class="r-d-w-r-p-text" v-html="policies[item.activeIndex].policyText"></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "release-detail-policies-compare",
  props: {
    selectedRelease: Object,
  },
  data() {
    return {
      compareBox: [
        { activeIndex: 0 },
        { activeIndex: 1 },
      ],
    }
  },
  computed: {
    policies() {
      return this.selectedRelease != null ? selectedRelease.policies : []
    }
  },
  methods: {
    exchangeComparePolicy(item, index) {
      item.activeIndex = index
    },
  },
}
</script>

<style lang="less" type="text/less" scoped>
.r-d-w-r-p-compare {
  box-sizing: border-box;
  float: left; width: 50%; padding: 20px 0 30px 40px; border-top: 1px solid #D8D8D8;
  &:first-child {
    border-right: 1px solid #D8D8D8;
  }

  .r-d-w-r-p-btn {
    display: inline-block; cursor: pointer;
    margin-right: 15px; margin-bottom: 10px; padding: 3px 12px; border: 1px solid #D4D4D4; border-radius: 15px;
    font-size: 12px;

    &.active {
      border-color: #409EFF; box-shadow: 0 2px 5px rgba(143, 188, 234, 1);
    }
  }

  .r-d-w-r-p-box {
    margin-top: 15px; margin-right: 40px; border-radius: 4px;
    box-shadow: 1px 2px 5px #D8D8D8;
    h4 {
      padding: 10px 12px; border-bottom: 1px solid #D8D8D8;
    }
    .r-d-w-r-p-text {
      overflow: auto; white-space: pre-wrap;
      height: 280px; padding: 12px;
    }
  }
}
</style>