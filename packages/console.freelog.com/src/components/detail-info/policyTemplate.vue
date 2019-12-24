<template>
  <el-form label-position="right"
           class="small-el-form"
           label-width="100px">
    <el-form-item label="ID">
      {{data.id}}
    </el-form-item>
    <el-form-item :label="$t('policy.tplName')">
      {{data.name}}
    </el-form-item>
    <el-form-item :label="$t('policy.policyType')">
      {{resolveType(data.templateType) | pageBuildFilter}}
    </el-form-item>
    <el-form-item :label="$t('policy.state')">
      {{resolveStatus(data.status)}}
    </el-form-item>
    <el-form-item :label="$t('policy.createDate')">
      {{data.createDate|fmtDate}}
    </el-form-item>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  name: 'policy-template-detail-info',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  mounted() {
  },

  methods: {
    resolveType(type) {
      return type === 1 ? this.$t('policy.types.resource') : this.$t('policy.types.user')
    },
    resolveStatus(status) {
      return status === 0 ? this.$t('policy.states[0]') : this.$t('policy.states[1]')
    }
  }
}
</script>
