<template>
  <footer v-if="isShowFooter" class="app-footer">
    <ul class="freelog-info">
      <li><a href="/about">{{ $t('routes.aboutView') }} freelog</a></li>
      <li><a href="/help">{{ $t('routes.helpView') }}</a></li>
      <li><a href="http://www.miibeian.gov.cn" target="_blank">{{$t('layout.ICP')}}</a></li>
      <li><b>Copyright© {{year}} {{ $t('company.name')}} freelog.com{{$t('company.copyright')}}</b></li>
    </ul>
  </footer>
</template>

<script>
import Footer from './index'

export default Footer
</script>

<style scoped lang="less">
  .app-footer {
    border-top: 1px solid #E5E5E5;
    line-height: 80px; text-align: center; background-color: #FAFBFB;
    &.gray-theme { background-color: #fff; }
  }

  a {
    color: black;
  }

  .freelog-info {
    li {
      display: inline-block;
      margin: 0 20px;
      font-size: 14px;
    }
  }
</style>
