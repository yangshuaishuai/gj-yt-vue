<template>
  <div class="table-page">
    <el-card>
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>客户列表</span>
          <div>
            <el-input
              v-model="searchName"
              placeholder="搜索客户姓名"
              size="small"
              style="width: 200px; margin-right: 10px;"
              clearable
              @clear="loadData"
              @keyup.enter.native="loadData"
            ></el-input>
            <el-button type="primary" size="small" icon="el-icon-search" @click="loadData">搜索</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
          </div>
        </el-row>
      </div>

      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="customerNo" label="客户编号" width="120"></el-table-column>
        <el-table-column prop="nameMasked" label="姓名" width="120"></el-table-column>
        <el-table-column prop="phoneMasked" label="手机号" width="140"></el-table-column>
        <el-table-column prop="idCardMasked" label="身份证号"></el-table-column>
        <el-table-column prop="customerLevel" label="客户等级" width="100">
          <template slot-scope="scope">
            <el-tag :type="getLevelType(scope.row.customerLevel)" size="small">{{ scope.row.customerLevel || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentAum" label="AUM(万元)" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px; text-align: right;"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item label="客户编号" prop="customerNo">
          <el-input v-model="editForm.customerNo" placeholder="请输入客户编号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="editForm.idCard" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="客户等级">
          <el-select v-model="editForm.customerLevel" placeholder="请选择" style="width: 100%;">
            <el-option label="普通" value="普通"></el-option>
            <el-option label="富嘉" value="富嘉"></el-option>
            <el-option label="钻石" value="钻石"></el-option>
            <el-option label="私行" value="私行"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { customerApi } from '@/api'

export default {
  name: 'TablePage',
  data() {
    return {
      tableData: [],
      loading: false,
      searchName: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '新增客户',
      editForm: {
        id: null,
        customerNo: '',
        name: '',
        phone: '',
        idCard: '',
        customerLevel: '普通',
        status: 1
      },
      editRules: {
        customerNo: [{ required: true, message: '请输入客户编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    getLevelType(level) {
      const map = { '普通': 'info', '富嘉': 'success', '钻石': 'warning', '私行': 'danger' }
      return map[level] || ''
    },
    async loadData() {
      this.loading = true
      try {
        let res
        if (this.searchName) {
          res = await customerApi.search({ name: this.searchName })
        } else {
          res = await customerApi.list()
        }
        const list = res.data || []
        this.total = list.length
        const start = (this.currentPage - 1) * this.pageSize
        this.tableData = list.slice(start, start + this.pageSize)
      } catch (error) {
        this.$message.error('加载数据失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData()
    },
    handlePageChange(val) {
      this.currentPage = val
      this.loadData()
    },
    handleAdd() {
      this.dialogTitle = '新增客户'
      this.editForm = { id: null, customerNo: '', name: '', phone: '', idCard: '', customerLevel: '普通', status: 1 }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑客户'
      this.editForm = { ...row }
      this.dialogVisible = true
    },
    submitForm() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        try {
          if (this.editForm.id) {
            await customerApi.update(this.editForm)
            this.$message.success('更新成功')
          } else {
            await customerApi.create(this.editForm)
            this.$message.success('创建成功')
          }
          this.dialogVisible = false
          this.loadData()
        } catch (error) {
          this.$message.error('操作失败：' + error.message)
        }
      })
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除客户 ' + (row.nameMasked || row.name) + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await customerApi.delete(row.id)
        this.$message.success('删除成功')
        this.loadData()
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
.table-page { padding: 0; }
</style>
