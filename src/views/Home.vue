<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #409EFF;">
              <i class="el-icon-user"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.customerCount }}</div>
              <div class="stat-label">客户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #67C23A;">
              <i class="el-icon-office-building"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.companyCount }}</div>
              <div class="stat-label">公司总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #E6A23C;">
              <i class="el-icon-s-home"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.customerVisitCount }}</div>
              <div class="stat-label">客户走访记录</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background-color: #F56C6C;">
              <i class="el-icon-s-marketing"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.companyVisitCount }}</div>
              <div class="stat-label">公司走访记录</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>快捷操作</span>
          </div>
          <el-row>
            <el-col :span="6" v-for="item in shortcuts" :key="item.title">
              <div class="shortcut-item" @click="handleShortcut(item)">
                <i :class="item.icon" :style="{ color: item.color }"></i>
                <span>{{ item.title }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>系统信息</span>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">框架版本</span>
              <span class="info-value">Vue 2.7.16</span>
            </div>
            <div class="info-item">
              <span class="info-label">UI 框架</span>
              <span class="info-value">Element UI 2.15.14</span>
            </div>
            <div class="info-item">
              <span class="info-label">后端服务</span>
              <span class="info-value">Spring Boot</span>
            </div>
            <div class="info-item">
              <span class="info-label">后端端口</span>
              <span class="info-value">8080</span>
            </div>
            <div class="info-item">
              <span class="info-label">主题</span>
              <span class="info-value">暗黑模式</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { customerApi, companyApi, customerVisitApi, companyVisitApi } from '@/api'

export default {
  name: 'HomePage',
  data() {
    return {
      stats: {
        customerCount: 0,
        companyCount: 0,
        customerVisitCount: 0,
        companyVisitCount: 0
      },
      shortcuts: [
        { title: '客户管理', icon: 'el-icon-user-solid', color: '#409EFF', path: '/table' },
        { title: '走访人员', icon: 'el-icon-s-custom', color: '#67C23A', path: '/form' },
        { title: '公司管理', icon: 'el-icon-office-building', color: '#E6A23C' },
        { title: '系统设置', icon: 'el-icon-setting', color: '#F56C6C' }
      ]
    }
  },
  created() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const [customerRes, companyRes, customerVisitRes, companyVisitRes] = await Promise.all([
          customerApi.list().catch(() => ({ data: [] })),
          companyApi.list().catch(() => ({ data: [] })),
          customerVisitApi.list().catch(() => ({ data: [] })),
          companyVisitApi.list().catch(() => ({ data: [] }))
        ])
        this.stats.customerCount = (customerRes.data || []).length
        this.stats.companyCount = (companyRes.data || []).length
        this.stats.customerVisitCount = (customerVisitRes.data || []).length
        this.stats.companyVisitCount = (companyVisitRes.data || []).length
      } catch (error) {
        console.error('加载统计数据失败', error)
      }
    },
    handleShortcut(item) {
      if (item.path) {
        this.$router.push(item.path)
      } else {
        this.$message.info('点击了：' + item.title)
      }
    }
  }
}
</script>

<style scoped>
.home { padding: 0; }
.stat-card { display: flex; align-items: center; padding: 10px 0; }
.stat-icon { width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
.stat-icon i { font-size: 24px; color: #fff; }
.stat-value { font-size: 22px; font-weight: 600; color: #e0e0e0; }
.stat-label { font-size: 13px; color: #999; margin-top: 4px; }
.shortcut-item { display: flex; flex-direction: column; align-items: center; padding: 20px 0; cursor: pointer; transition: opacity 0.3s; }
.shortcut-item:hover { opacity: 0.8; }
.shortcut-item i { font-size: 28px; margin-bottom: 8px; }
.shortcut-item span { font-size: 13px; color: #999; }
.info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333; }
.info-item:last-child { border-bottom: none; }
.info-label { color: #999; }
.info-value { color: #e0e0e0; }
</style>
