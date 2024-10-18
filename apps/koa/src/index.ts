// const WebSocket = require('ws')
import WebSocket from 'ws'

const run = () => {
  let register
  try {
    register = require('node-network-devtools').register
  } catch {
    setTimeout(run, 1000)
    return
  }

  const axios = require('axios')
  const Koa = require('koa')
  const Router = require('koa-router')
  const { createFetch } = require('ofetch')

  register({
    port: 5222,
    serverPort: 5333,
    autoOpenDevtool: true
  })

  const app = new Koa()
  const router = new Router()
  router.get('/', async (ctx: any) => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
    ctx.body = res.data
  })

  router.get('/ofetch', async (ctx: any) => {
    const fetch = createFetch()
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    ctx.body = res
  })

  router.get('/post', async (ctx: any) => {
    const res = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
      type: 'post'
    })
    ctx.body = res.data
  })

  router.get('/put', async (ctx: any) => {
    const res = await axios.put('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'foo',
      body: 'bar',
      userId: 101,
      type: 'put'
    })
    ctx.body = res.data
  })

  router.get('/patch', async (ctx: any) => {
    const res = await axios.patch('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'xxx'
    })
    ctx.body = res.data
  })

  router.get('/delete', async (ctx: any) => {
    const res = await axios.delete('https://jsonplaceholder.typicode.com/posts/1')
    ctx.body = res.data
  })

  router.get('/img', async (ctx: any) => {
    const res = await axios.get('https://picsum.photos/30/30')
    ctx.body = res.data
  })

  router.get('/baidu', async (ctx: any) => {
    const res = await axios.get('http://www.baidu.com')
    ctx.body = res.data
  })

  router.get('/fetch', async (ctx: any) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await res.json()
    ctx.body = data
  })

  let ws: any
  router.get('/ws', async (ctx: any) => {
    if (ws) {
      // 拿到 params 中的 message
      const message = ctx.query.message
      ws.send(message || 'Hello from Koa')
      ctx.body = 'WebSocket: Send'
      return
    }
    ws = new WebSocket('wss://echo.websocket.org/')
    ws.onopen = () => {
      ws.send('Hello from Koa')
    }
    ws.onmessage = (event: any) => {
      console.log('WebSocket message:', event.data)
    }
    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }
    ctx.body = 'WebSocket connection established'
  })

  app.use(router.routes())
  app.listen(3000)

  process.on('message', (msg) => {
    console.log('Message from parent:', msg)
  })
}

run()