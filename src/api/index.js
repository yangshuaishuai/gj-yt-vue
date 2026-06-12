import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

// ========== 用户管理 ==========
export const userApi = {
  list: () => request.get('/user/list'),
  getById: (id) => request.get('/user/' + id),
  search: (params) => request.get('/user/search', { params }),
  create: (data) => request.post('/user', data),
  update: (data) => request.put('/user', data),
  delete: (id) => request.delete('/user/' + id),
  batchDelete: (ids) => request.delete('/user/batch', { data: ids })
}

// ========== 客户管理 ==========
export const customerApi = {
  list: () => request.get('/customer/list'),
  getById: (id) => request.get('/customer/' + id),
  getByNo: (customerNo) => request.get('/customer/no/' + customerNo),
  search: (params) => request.get('/customer/search', { params }),
  create: (data) => request.post('/customer', data),
  update: (data) => request.put('/customer', data),
  delete: (id) => request.delete('/customer/' + id),
  batchDelete: (ids) => request.delete('/customer/batch', { data: ids })
}

// ========== 公司管理 ==========
export const companyApi = {
  list: () => request.get('/company/list'),
  getById: (id) => request.get('/company/' + id),
  search: (params) => request.get('/company/search', { params }),
  create: (data) => request.post('/company', data),
  update: (data) => request.put('/company', data),
  delete: (id) => request.delete('/company/' + id),
  batchDelete: (ids) => request.delete('/company/batch', { data: ids })
}

// ========== 公司走访 ==========
export const companyVisitApi = {
  list: () => request.get('/company-visit/list'),
  getByCompanyId: (companyId) => request.get('/company-visit/list', { params: { companyId } }),
  getById: (id) => request.get('/company-visit/' + id),
  create: (data) => request.post('/company-visit', data),
  update: (data) => request.put('/company-visit', data),
  delete: (id) => request.delete('/company-visit/' + id),
  batchDelete: (ids) => request.delete('/company-visit/batch', { data: ids })
}

// ========== 客户走访 ==========
export const customerVisitApi = {
  list: () => request.get('/customer-visit/list'),
  getByCustomerId: (customerId) => request.get('/customer-visit/list', { params: { customerId } }),
  getById: (id) => request.get('/customer-visit/' + id),
  create: (data) => request.post('/customer-visit', data),
  update: (data) => request.put('/customer-visit', data),
  delete: (id) => request.delete('/customer-visit/' + id),
  batchDelete: (ids) => request.delete('/customer-visit/batch', { data: ids })
}

// ========== 走访人员 ==========
export const visitPersonApi = {
  list: () => request.get('/visit-person/list'),
  getById: (id) => request.get('/visit-person/' + id),
  create: (data) => request.post('/visit-person', data),
  update: (data) => request.put('/visit-person', data),
  delete: (id) => request.delete('/visit-person/' + id),
  batchDelete: (ids) => request.delete('/visit-person/batch', { data: ids })
}

// ========== 网格员 ==========
export const gridMemberApi = {
  list: (companyId) => request.get('/grid-member/list', { params: { companyId } }),
  getById: (id) => request.get('/grid-member/' + id),
  create: (data) => request.post('/grid-member', data),
  update: (data) => request.put('/grid-member', data),
  delete: (id) => request.delete('/grid-member/' + id),
  batchDelete: (ids) => request.delete('/grid-member/batch', { data: ids })
}


// ========== 点击日志 ==========
export const clickLogApi = {
  list: () => request.get('/click-log/list'),
  create: (data) => request.post('/click-log', data),
  batchCreate: (data) => request.post('/click-log/batch', data)
}


// ========== 客户走访报表 ==========
export const customerVisitReportApi = {
  list: (params) => request.get('/report/customer-visit/list', { params }),
  exportUrl: (params) => {
    const query = Object.entries(params || {})
      .filter(([, v]) => v !== '' && v !== null && v !== undefined)
      .map(([k, v]) => k + '=' + encodeURIComponent(v))
      .join('&')
    return '/api/report/customer-visit/export' + (query ? '?' + query : '')
  }
}

export default request
