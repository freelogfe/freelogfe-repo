<template>
  <section>
    <el-form label-position="right"
             class="small-el-form"
             ref="detailForm"
             :model="detail"
             :rules="rules"
             :inline-message="true"
             label-width="120px">
      <el-form-item label="ID" class="flex-grid">
        {{detail.id}}
      </el-form-item>
      <el-form-item label="策略模板描述" prop="name" class="flex-grid" style="height: 40px" :required="isEditMode">
        <el-input v-model="detail.name" v-if="isEditMode" style="width:600px"></el-input>
        <span v-else>{{detail.name}}</span>
      </el-form-item>
      <el-form-item label="策略模板类型" class="flex-grid">
        {{resolveType(detail.templateType) | pageBuildFilter}}
      </el-form-item>
      <el-form-item label="状态" class="flex-grid">
        {{resolveStatus(detail.status)}}
      </el-form-item>
      <el-form-item label="创建时间" class="flex-grid">
        {{detail.createDate|fmtDate}}
      </el-form-item>
      <el-form-item label="策略" :required="isEditMode" prop="template">
        <el-input type="textarea"
                  :rows="10"
                  style="width:600px"
                  v-model="detail.template"
                  v-if="isEditMode"></el-input>
        <pre v-else>{{detail.template}}</pre>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeModeHandler">{{(isEditMode ? '保存' : '修改')}}</el-button>
        <el-button type="primary" plain @click="cancelEditMode" v-show="isEditMode">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import PolicyTplDetail from './index'

export default PolicyTplDetail
</script>

<style lang="less" scoped>

</style>
