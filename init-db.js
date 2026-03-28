const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 连接数据库
const MONGODB_URI = 'mongodb://localhost:27017/englishcommunity';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// 定义User模型
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// 创建管理员用户
async function createAdmin() {
  try {
    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('管理员用户已存在');
      mongoose.disconnect();
      return;
    }
    
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // 创建管理员用户
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true
    });
    
    await admin.save();
    console.log('管理员用户创建成功');
    mongoose.disconnect();
  } catch (error) {
    console.error('创建管理员用户错误:', error);
    mongoose.disconnect();
  }
}

// 运行初始化
createAdmin();
