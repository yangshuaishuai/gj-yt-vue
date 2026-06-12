<template>
  <div class="form-page">
    <el-card>
      <div slot="header">
        <span>走访人员管理</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="max-width: 600px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType">
          <el-select v-model="form.roleType" placeholder="请选择角色类型" style="width: 100%;">
            <el-option label="二分行领导" value="二分行领导"></el-option>
            <el-option label="客户经理" value="客户经理"></el-option>
            <el-option label="渠道专员" value="渠道专员"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>走访人员列表</span>
      </div>
      <el-table :data="personList" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="roleType" label="角色类型" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { visitPersonApi } from '@/api'

export default {
  name: 'FormPage',
  data() {
    return {
      loading: false,
      personList: [],
      form: {
        id: null,
        name: '',
        roleType: '',
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择角色类型', trigger: 'change' }]
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    async loadList() {
      this.loading = true
      try {
        const res = await visitPersonApi.list()
        this.personList = res.data || []
      } catch (error) {
        this.$message.error('加载列表失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请检查表单填写是否正确')
          return
        }
        try {
          if (this.form.id) {
            await visitPersonApi.update(this.form)
            this.$message.success('更新成功')
          } else {
            await visitPersonApi.create(this.form)
            this.$message.success('创建成功')
          }
          this.resetForm()
          this.loadList()
        } catch (error) {
          this.$message.error('操作失败：' + error.message)
        }
      })
    },
    resetForm() {
      this.form = { id: null, name: '', roleType: '', status: 1 }
      this.$refs.form.clearValidate()
    },
    handleEdit(row) {
      this.form = { ...row }
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除走访人员 ' + row.name + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await visitPersonApi.delete(row.id)
        this.$message.success('删除成功')
        this.loadList()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + error.message)
        }
      }
    }
  }
}
</script>

<style scoped>
.form-page { padding: 0; }
</style>
