<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h2>后台管理</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          background-color="#1d1e1f"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/table">
            <i class="el-icon-s-grid"></i>
            <span slot="title">表格</span>
          </el-menu-item>
          <el-menu-item index="/form">
            <i class="el-icon-edit"></i>
            <span slot="title">表单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            <span class="title">Vue2 + Element UI Demo</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                管理员<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局暗黑色主题 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #141414;
  color: #e0e0e0;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #1d1e1f;
  border-right: 1px solid #333;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #333;
}

.logo h2 {
  color: #409EFF;
  margin: 0;
  font-size: 18px;
}

.el-header {
  background-color: #1d1e1f;
  color: #e0e0e0;
  border-bottom: 1px solid #333;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-content .title {
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #e0e0e0;
}

.el-main {
  background-color: #141414;
  color: #e0e0e0;
}

/* Element UI 暗黑色覆盖样式 */
.el-table {
  background-color: #1d1e1f;
  color: #e0e0e0;
}

.el-table th.el-table__cell {
  background-color: #252526;
  color: #e0e0e0;
}

.el-table tr {
  background-color: #1d1e1f;
}

.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #2a2d2e;
}

.el-table td.el-table__cell {
  border-bottom: 1px solid #333;
}

.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #333;
}

.el-table::before {
  background-color: #333;
}

.el-card {
  background-color: #1d1e1f;
  border-color: #333;
  color: #e0e0e0;
}

.el-card__header {
  border-bottom: 1px solid #333;
}

.el-breadcrumb__inner,
.el-breadcrumb__separator {
  color: #999 !important;
}

.el-dropdown-menu {
  background-color: #1d1e1f;
  border-color: #333;
}

.el-dropdown-menu__item {
  color: #e0e0e0;
}

.el-dropdown-menu__item:hover {
  background-color: #2a2d2e;
  color: #409EFF;
}

.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: #1d1e1f;
}

.el-input__inner {
  background-color: #252526;
  border-color: #444;
  color: #e0e0e0;
}

.el-input__inner:focus {
  border-color: #409EFF;
}

.el-form-item__label {
  color: #e0e0e0;
}

.el-select-dropdown {
  background-color: #1d1e1f;
  border-color: #333;
}

.el-select-dropdown__item {
  color: #e0e0e0;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #2a2d2e;
}

.el-pagination {
  color: #e0e0e0;
}

.el-pagination button {
  background-color: #1d1e1f;
  color: #e0e0e0;
}

.el-pager li {
  background-color: #1d1e1f;
  color: #e0e0e0;
}

.el-pager li.active {
  color: #409EFF;
}

.el-dialog {
  background-color: #1d1e1f;
}

.el-dialog__title {
  color: #e0e0e0;
}

.el-dialog__headerbtn .el-dialog__close {
  color: #999;
}

.el-message-box {
  background-color: #1d1e1f;
  border-color: #333;
}

.el-tag {
  border-color: #444;
}
</style>
