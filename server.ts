import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type Request = express.Request;
type Response = express.Response;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data folder and json files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Seed default "스테판" user if users.json does not exist
if (!fs.existsSync(USERS_FILE)) {
  const initialUsers: User[] = [
    {
      id: 'USR-STEPHEN-01',
      name: '스테판',
      email: 'stephen@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    },
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

export interface Order {
  id: string; // e.g. ORD-20261007-8492
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  memo: string;
  paymentMethod: 'transfer' | 'card' | 'simple' | 'naver' | 'kakao' | 'toss';
  productName: string;
  quantity: number;
  totalPrice: number;
  status: '입금대기' | '주문접수' | '결제확인' | '배송준비' | '배송중' | '배송완료' | '주문취소';
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  updatedAt: string;
}

function readOrders(): Order[] {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

app.use(express.json());

// ========================
// Authentication Endpoints
// ========================

// 1. POST /api/auth/register (회원가입)
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: '성함(이름)을 입력해 주세요.',
    });
  }

  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({
      success: false,
      message: '올바른 이메일 주소(예: stephen@example.com)를 입력해 주세요.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: '비밀번호를 입력해 주세요.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: `비밀번호는 최소 6자 이상이어야 합니다. (현재 ${password.length}자 입력됨)`,
    });
  }

  const users = readUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: '이미 가입된 이메일 주소입니다. 로그인해 주세요.',
    });
  }

  const newUser: User = {
    id: `USR-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  console.log(`[신규 회원가입] ${newUser.name} (${newUser.email})`);

  res.status(201).json({
    success: true,
    message: `${newUser.name} 님, 회원가입이 완료되었습니다!`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

// 2. POST /api/auth/login (로그인)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: '이메일 주소를 입력해 주세요.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: '비밀번호를 입력해 주세요.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: `비밀번호는 6자 이상이어야 합니다. (현재 ${password.length}자 입력됨)`,
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: '가입되지 않은 이메일 주소입니다. 먼저 회원가입을 진행해 주세요.',
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
    });
  }

  console.log(`[로그인 성공] ${user.name} (${user.email})`);

  res.json({
    success: true,
    message: `${user.name} 님 환영합니다.`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// 3. GET /api/auth/users (Admin / debug list)
app.get('/api/auth/users', (req: Request, res: Response) => {
  const users = readUsers();
  const safeUsers = users.map(({ id, name, email, createdAt }) => ({
    id,
    name,
    email,
    createdAt,
  }));
  res.json({ success: true, count: safeUsers.length, users: safeUsers });
});

// 1. GET /api/orders (Optionally filter by phone or status)
app.get('/api/orders', (req: Request, res: Response) => {
  const { phone, status } = req.query;
  let orders = readOrders();

  if (typeof phone === 'string' && phone.trim()) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    orders = orders.filter((o) => o.phone.replace(/[^0-9]/g, '').includes(cleanPhone));
  }

  if (typeof status === 'string' && status.trim()) {
    orders = orders.filter((o) => o.status === status);
  }

  // Sort latest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, count: orders.length, orders });
});

// 2. GET /api/orders/:id (Lookup single order by ID)
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: '주문 내역을 찾을 수 없습니다.' });
  }

  res.json({ success: true, order });
});

// 3. POST /api/orders (Create new customer order)
app.post('/api/orders', (req: Request, res: Response) => {
  const {
    customerName,
    phone,
    address,
    detailAddress = '',
    memo = '',
    paymentMethod = 'transfer',
    quantity = 1,
    totalPrice = 42000,
  } = req.body;

  if (!customerName || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: '성함, 연락처, 주소는 필수 입력 사항입니다.',
    });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ORD-${dateStr}-${randomSuffix}`;

  const newOrder: Order = {
    id: orderId,
    customerName: customerName.trim(),
    phone: phone.trim(),
    address: address.trim(),
    detailAddress: detailAddress.trim(),
    memo: memo.trim(),
    paymentMethod,
    productName: '하루한잔 자연담은 50곡 생식 (30포/1개월분)',
    quantity: Number(quantity) || 1,
    totalPrice: Number(totalPrice) || 42000,
    status: paymentMethod === 'transfer' ? '입금대기' : '결제확인',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const orders = readOrders();
  orders.unshift(newOrder);
  writeOrders(orders);

  console.log(`[새 주문 접수] ${newOrder.id} - ${newOrder.customerName} (${newOrder.phone}), 수량: ${newOrder.quantity}`);

  res.status(201).json({
    success: true,
    message: '주문이 성공적으로 접수되었습니다.',
    order: newOrder,
  });
});

// 4. PATCH /api/orders/:id (Update order status or tracking number)
app.patch('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, courier } = req.body;

  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
  }

  if (status) orders[index].status = status;
  if (trackingNumber !== undefined) orders[index].trackingNumber = trackingNumber;
  if (courier !== undefined) orders[index].courier = courier;
  orders[index].updatedAt = new Date().toISOString();

  writeOrders(orders);

  res.json({ success: true, order: orders[index] });
});

// 5. DELETE /api/orders/:id (Delete or cancel order)
app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let orders = readOrders();
  const initialLength = orders.length;
  orders = orders.filter((o) => o.id !== id);

  if (orders.length === initialLength) {
    return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
  }

  writeOrders(orders);
  res.json({ success: true, message: '주문이 삭제되었습니다.' });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
