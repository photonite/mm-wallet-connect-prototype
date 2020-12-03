const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      pathRewrite: {
        '^/api': '', //remove /api
      },
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  )
}
