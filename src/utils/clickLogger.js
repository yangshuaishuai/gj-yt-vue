/**
 * 全局点击日志记录工具
 * 通过事件委托捕获页面所有点击行为，发送到后端持久化存储
 */
import { clickLogApi } from '@/api'

var clickCount = 0
var batchQueue = []
var batchTimer = null
var sessionId = ''
var BATCH_SIZE = 5
var BATCH_INTERVAL = 3000

// 生成会话ID
function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
}

function getComponentName(el) {
  var node = el
  while (node) {
    if (node.__vue__) {
      return node.__vue__.$options.name || node.__vue__.$options._componentTag || 'Anonymous'
    }
    node = node.parentElement
  }
  return null
}

function getElementDesc(el) {
  var tag = el.tagName.toLowerCase()
  var text = (el.innerText || el.value || '').trim().substring(0, 50)
  var cls = el.className ? '.' + String(el.className).split(' ')[0] : ''
  return text ? '<' + tag + cls + '> "' + text + '"' : '<' + tag + cls + '>'
}

function getRoutePath() {
  try {
    var app = document.querySelector('#app')
    if (app && app.__vue__ && app.__vue__.$router) {
      return app.__vue__.$route ? app.__vue__.$route.path : 'unknown'
    }
  } catch (e) {}
  return window.location.pathname
}

// 批量发送队列中的日志
function flushBatch() {
  if (batchQueue.length === 0) return
  var batch = batchQueue.splice(0, batchQueue.length)
  clickLogApi.batchCreate(batch).catch(function(err) {
    console.warn('[ClickLogger] 批量上报失败，数据重新入队', err)
    batchQueue = batch.concat(batchQueue)
  })
}

// 定时器触发批量上报
function scheduleFlush() {
  if (batchTimer) return
  batchTimer = setTimeout(function() {
    batchTimer = null
    flushBatch()
  }, BATCH_INTERVAL)
}

function handleClickLog(event) {
  var el = event.target
  if (!el || el === document || el === document.body) return

  clickCount++

  var log = {
    routePath:     getRoutePath(),
    componentName: getComponentName(el),
    elementDesc:   getElementDesc(el),
    clickX:        event.clientX,
    clickY:        event.clientY,
    sessionId:     sessionId
  }

  batchQueue.push(log)

  // 控制台输出
  console.log(
    '%c[Click #%d] route=%s  component=%s  element=%s',
    'color:#409EFF;font-weight:bold',
    clickCount, log.routePath, log.componentName, log.elementDesc
  )

  // 达到批量阈值立即发送，否则走定时器
  if (batchQueue.length >= BATCH_SIZE) {
    if (batchTimer) { clearTimeout(batchTimer); batchTimer = null }
    flushBatch()
  } else {
    scheduleFlush()
  }
}

export function installClickLogger() {
  sessionId = generateSessionId()
  document.addEventListener('click', handleClickLog, true)
  console.log('%c[ClickLogger] 全局点击日志已启用（写入数据库） sessionId=' + sessionId, 'color:#67C23A;font-weight:bold')
}

export function uninstallClickLogger() {
  document.removeEventListener('click', handleClickLog, true)
  // 停用前把队列中的数据发送出去
  flushBatch()
  console.log('%c[ClickLogger] 全局点击日志已停用', 'color:#F56C6C')
}
