const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// پایگاه داده ساده در حافظه
let products = [
  { id: 1, name: 'محصول 1', price: 50000, category: 'الکترونیکی' },
  { id: 2, name: 'محصول 2', price: 75000, category: 'خانگی' },
  { id: 3, name: 'محصول 3', price: 120000, category: 'پوشاک' }
];

// دریافت همه محصولات
app.get('/api/products', (req, res) => {
  res.json(products);
});

// افزودن محصول جدید
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// حذف محصول
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  products = products.filter(product => product.id !== productId);
  res.status(204).send();
});

// به‌روزرسانی محصول
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const updatedProduct = { id: productId, ...req.body };
  products = products.map(product => (product.id === productId ? updatedProduct : product));
  res.json(updatedProduct);
});

// شروع سرور
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; // کاربران ذخیره‌شده

// ثبت‌نام کاربر
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('کاربر با موفقیت ثبت شد');
});

// ورود کاربر
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('نام کاربری یا رمز عبور اشتباه است');
  }
  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// مسیر محافظت‌شده
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('توکن یافت نشد');

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.status(403).send('توکن نامعتبر است');
    res.json({ message: 'این اطلاعات محافظت‌شده است', user });
  });
});
