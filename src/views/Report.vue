<template>
  <div class="report-page">
    <el-card>
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>客户走访报表</span>
          <el-button type="success" size="small" icon="el-icon-download" @click="handleExport">导出CSV</el-button>
        </el-row>
      </div>

      <!-- 查询条件 -->
      <el-form :inline="true" :model="query" size="small" class="filter-form">
        <el-form-item label="客户编号">
          <el-input v-model="query.customerNo" placeholder="精确匹配" clearable @keyup.enter.native="loadData"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.nameMasked" placeholder="模糊搜索" clearable @keyup.enter.native="loadData"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="query.idCard" placeholder="精确匹配" clearable @keyup.enter.native="loadData"></el-input>
        </el-form-item>
        <el-form-item label="身份证(脱敏)">
          <el-input v-model="query.idCardMasked" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号(脱敏)">
          <el-input v-model="query.phoneMasked" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司ID">
          <el-input v-model.number="query.companyId" placeholder="精确匹配" clearable></el-input>
        </el-form-item>
        <el-form-item label="管户网点">
          <el-input v-model="query.currentBranch" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否自营">
          <el-select v-model="query.isSelfOperated" placeholder="全部" clearable style="width: 100px;">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="删除标记">
          <el-select v-model="query.deleted" placeholder="全部" clearable style="width: 100px;">
            <el-option label="未删除" :value="0"></el-option>
            <el-option label="已删除" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="走访人员类型">
          <el-input v-model="query.visitorType" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="走访地址">
          <el-input v-model="query.visitAddress" placeholder="模糊搜索" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 16px;">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>查询结果（共 {{ tableData.length }} 条）</span>
        </el-row>
      </div>

      <el-table :data="pagedData" style="width: 100%" stripe v-loading="loading" border size="small">
        <el-table-column prop="customerNo" label="客户编号" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nameMasked" label="姓名(脱敏)" width="100"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idCardMasked" label="身份证(脱敏)" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phoneMasked" label="手机号(脱敏)" width="120"></el-table-column>
        <el-table-column prop="companyId" label="公司ID" width="80" align="center"></el-table-column>
        <el-table-column prop="currentBranch" label="管户网点" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isSelfOperated" label="是否自营" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isSelfOperated === 1 ? 'success' : 'info'" size="mini">
              {{ scope.row.isSelfOperated === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deleted" label="删除标记" width="90" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.deleted === 1 ? 'danger' : 'success'" size="mini">
              {{ scope.row.deleted === 1 ? '已删除' : '未删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visitCreateTime" label="走访创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.visitCreateTime ? formatDate(scope.row.visitCreateTime) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="visitorType" label="走访人员类型" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="visitAddress" label="走访地址" min-width="200" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 16px; text-align: right;"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { customerVisitReportApi } from '@/api'

export default {
  name: 'ReportPage',
  data: function() {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      query: {
        customerNo: '',
        nameMasked: '',
        idCard: '',
        idCardMasked: '',
        phoneMasked: '',
        companyId: null,
        currentBranch: '',
        isSelfOperated: null,
        deleted: null,
        visitorType: '',
        visitAddress: ''
      }
    }
  },
  computed: {
    pagedData: function() {
      var start = (this.currentPage - 1) * this.pageSize
      return this.tableData.slice(start, start + this.pageSize)
    }
  },
  created: function() {
    this.loadData()
  },
  methods: {
    loadData: function() {
      this.loading = true
      this.currentPage = 1
      var params = this.buildParams()
      customerVisitReportApi.list(params).then(function(res) {
        this.tableData = res.data || []
      }.bind(this)).catch(function(err) {
        this.$message.error('查询失败：' + err.message)
      }.bind(this)).finally(function() {
        this.loading = false
      }.bind(this))
    },
    resetQuery: function() {
      this.query = {
        customerNo: '', nameMasked: '', idCard: '', idCardMasked: '',
        phoneMasked: '', companyId: null, currentBranch: '',
        isSelfOperated: null, deleted: null, visitorType: '', visitAddress: ''
      }
      this.loadData()
    },
    handleExport: function() {
      var params = this.buildParams()
      var url = customerVisitReportApi.exportUrl(params)
      window.open(url, '_blank')
    },
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handlePageChange: function(val) {
      this.currentPage = val
    },
    formatDate: function(val) {
      if (!val) return ''
      var d = new Date(val)
      var pad = function(n) { return n < 10 ? '0' + n : n }
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    },
    buildParams: function() {
      var params = {}
      var q = this.query
      Object.keys(q).forEach(function(key) {
        if (q[key] !== '' && q[key] !== null && q[key] !== undefined) {
          params[key] = q[key]
        }
      })
      return params
    }
  }
}
</script>

<style scoped>
.report-page { padding: 0; }
.filter-form .el-form-item { margin-bottom: 10px; margin-right: 12px; }
.filter-form .el-input { width: 150px; }
</style>
