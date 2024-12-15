// 全局变量声明
let currentUser = null;
let articles = [];
let chatRooms = [];
let currentChatRoom = null;

// 显示注册页面
function showRegister() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('register-container').style.display = 'block';
}

// 显示登录页面
function showLogin() {
  document.getElementById('register-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

// 注册功能
function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password === confirmPassword) {
    // 这里假设通过fetch向后端发送注册请求（下面有模拟后端示例）
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
          alert('Registration successful!');
          showLogin();
        } else {
          alert('Registration failed: '+ data.message);
        }
      })
    .catch(error => {
        console.error('Error during registration:', error);
        alert('An error occurred during registration.');
      });
  } else {
    alert('Passwords do not match.');
  }
}

// 登录功能
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  // 向模拟后端发送登录请求
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
        currentUser = data.user;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('content-container').style.display = 'block';
        loadArticles();
        loadChatRooms();
      } else {
        alert('Invalid username or password.');
      }
    })
  .catch(error => {
      console.error('Error during login:', error);
      alert('An error occurred during login.');
    });
}

// 加载文章列表
function loadArticles() {
  const articleList = document.getElementById('article-list');
  articleList.innerHTML = '';
  // 向模拟后端请求获取文章列表
  fetch('http://localhost:3000/articles')
  .then(response => response.json())
  .then(data => {
      articles = data;
      for (let article of articles) {
        const listItem = document.createElement('li');
        listItem.textContent = article.text;
        articleList.appendChild(listItem);
      }
    })
  .catch(error => {
      console.error('Error loading articles:', error);
    });
}

// 提交文章功能
function submitArticle() {
  const articleText = document.getElementById('article-textarea').value;
  if (articleText.trim()!== '') {
    const newArticle = {
      id: Date.now(),
      text: articleText,
      author: currentUser.username
    };
    // 向后端发送文章提交请求
    fetch('http://localhost:3000/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newArticle)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
          alert('Article submitted successfully!');
          loadArticles();
          document.getElementById('article-textarea').value = '';
        } else {
          alert('Failed to submit article: '+ data.message);
        }
      })
    .catch(error => {
        console.error('Error submitting article:', error);
        alert('An error occurred while submitting the article.');
      });
  } else {
    alert('Please write something in the article textarea.');
  }
}

// 创建聊天房间功能
function createChatRoom() {
  const chatRoomName = document.getElementById('new-chat-room-name').value;
  if (chatRoomName.trim()!== '') {
    const newChatRoom = {
      id: Date.now(),
      name: chatRoomName,
      messages: []
    };
    chatRooms.push(newChatRoom);
    // 向后端发送创建聊天房间请求（这里只是示意，实际需按后端接口来）
    fetch('http://localhost:3000/chatRooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newChatRoom)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
          alert('Chat room created successfully!');
          loadChatRooms();
          document.getElementById('new-chat-room-name').value = '';
        } else {
          alert('Failed to create chat room: '+ data.message);
        }
      })
    .catch(error => {
        console.error('Error creating chat room:', error);
        alert('An error occurred while creating the chat room.');
      });
  } else {
    alert('Please enter a chat room name.');
  }
}

// 加载聊天房间列表
function loadChatRooms() {
  const chatRoomList = document.getElementById('chat-room-ul');
  chatRoomList.innerHTML = '';
  // 向后端请求获取聊天房间列表
  fetch('http://localhost:3000/chatRooms')
  .then(response => response.json())
  .then(data => {
      chatRooms = data;
      for (let chatRoom of chatRooms) {
        const listItem = document.createElement('li');
        listItem.textContent = chatRoom.name;
        listItem.addEventListener('click', function () {
          selectChatRoom(chatRoom);
        });
        chatRoomList.appendChild(listItem);
      }
    })
  .catch(error => {
      console.error('Error loading chat rooms:', error);
    });
}

// 选择聊天房间
function selectChatRoom(room) {
  currentChatRoom = room;
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  for (let message of room.messages) {
    const listItem = document.createElement('li');
    listItem.textContent = message;
    chatMessages.appendChild(listItem);
  }
}

// 发送聊天消息功能
function sendChatMessage() {
  const message = document.getElementById('chat-input').value;
  if (message.trim()!== '') {
    if (currentChatRoom) {
      currentChatRoom.messages.push(message);
      // 向后端发送聊天消息（实际需完善和后端交互逻辑）
      fetch('http://localhost:3000/chatRooms/' + currentChatRoom.id + '/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
            const chatMessages = document.getElementById('chat-messages');
            const listItem = document.createElement('li');
            listItem.textContent = message;
            chatMessages.appendChild(listItem);
            document.getElementById('chat-input').value = '';
          } else {
            alert('Failed to send message: '+ data.message);
          }
        })
      .catch(error => {
          console.error('Error sending chat message:', error);
          alert('An error occurred while sending the chat message.');
        });
    } else {
      alert('Please select a chat room first.');
    }
  } else {
    alert('Please type a message.');
  }
}