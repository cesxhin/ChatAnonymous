const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/chat', createProxyMiddleware('ws://localhost:12345/chat', {changeOrigin: true}));
app.use('/*', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true}));
app.listen(5000);