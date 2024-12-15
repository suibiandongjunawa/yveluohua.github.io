const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// 跨域中间件，方便前端本地开发访问（在实际部署时，要根据具体的前端域名等配置好允许的跨域源）
app.use(cors());
// 解析JSON格式的请求体
app.use(bodyParser.json());

// 模拟用户数据存储（实际应使用数据库）
let users = [];
// 模拟文章数据存储
let articles = [];
// 模拟聊天房间数据存储
let chatRooms = [];

// 注册接口
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    res.json({ success: false, message: 'Username already exists' });
  } else {
    const newUser = { username, password };
    users.push(newUser);
    res.json({ success: true, user: newUser });
  }
});

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: 'Invalid username or password' });
  }
});

// 获取文章列表接口
app.get('/articles', (req, res) => {
  res.json(articles);
});

// 提交文章接口
app.post('/articles', (req, res) => {
  const newArticle = req.body;
  articles.push(newArticle);
  res.json({ success: true });
});

// 获取聊天房间列表接口
app.get('/chatRooms', (req, res) => {
  res.json(chatRooms);
});

// 创建聊天房间接口
app.post('/chatRooms', (req, res) => {
  const newChatRoom = req.body;
  chatRooms.push(newChatRoom);
  res.json({ success: true });
});

// 向指定聊天房间发送消息接口（这里简单模拟添加消息到对应房间的消息列表，实际要处理更多逻辑比如广播等）
app.post('/chatRooms/:roomId/messages', (req, res) => {
  const roomId = req.params.roomId;
  const { message } = req.body;
  const chatRoom = chatRooms.find(room => room.id === parseInt(roomId));
  if (chatRoom) {
    chatRoom.messages.push(message);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Chat room not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});