module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8082,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
