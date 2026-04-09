// Simple LocalStorage based Mock Database for Veridian Bank

const INITIAL_DATA = {
  users: [
    {
      id: "1",
      name: "Austin Aeden",
      email: "austinaeden@gmail.com",
      phone: "+1 234 567 890",
      password: "password123",
      role: "USER"
    },
    {
      id: "admin-1",
      name: "System Admin",
      email: "admin@gmail.com",
      phone: "+1 000 000 000",
      password: "password123",
      role: "ADMIN"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 555 123 456",
      password: "password123",
      role: "USER"
    },
    {
      id: "3",
      name: "Marcus Johnson",
      email: "marcus@example.com",
      phone: "+1 444 987 654",
      password: "password123",
      role: "USER"
    }
  ],
  accounts: [
    { id: "acc1", userId: "1", type: "Checking", balance: 12450.50, accountNumber: "**** 4421" },
    { id: "acc2", userId: "1", type: "Savings", balance: 45200.00, accountNumber: "**** 8892" },
    { id: "acc3", userId: "1", type: "Investment", balance: 8900.25, accountNumber: "**** 1103" },
    { id: "acc4", userId: "2", type: "Checking", balance: 3400.00, accountNumber: "**** 6721" },
    { id: "acc5", userId: "3", type: "Savings", balance: 120500.00, accountNumber: "**** 9012" }
  ],
  transactions: [
    { id: "t1", userId: "1", date: "2024-03-20", payee: "Apple Store", amount: -1299.00, type: "withdrawal", category: "Electronics" },
    { id: "t2", userId: "1", date: "2024-03-19", payee: "Salary Deposit", amount: 4500.00, type: "deposit", category: "Income" },
    { id: "t3", userId: "1", date: "2024-03-18", payee: "Starbucks", amount: -12.50, type: "withdrawal", category: "Food" },
    { id: "t4", userId: "2", date: "2024-03-17", payee: "Rent Payment", amount: -1800.00, type: "withdrawal", category: "Housing" },
    { id: "t5", userId: "3", date: "2024-03-15", payee: "Amazon", amount: -85.20, type: "withdrawal", category: "Shopping" },
    { id: "t6", userId: "1", date: "2024-03-14", payee: "Grocery Store", amount: -150.00, type: "withdrawal", category: "Food" },
    { id: "t7", userId: "2", date: "2024-03-12", payee: "Netflix", amount: -15.99, type: "withdrawal", category: "Entertainment" },
    { id: "t8", userId: "3", date: "2024-03-10", payee: "Client Payment", amount: 12000.00, type: "deposit", category: "Income" }
  ]
};

const STORAGE_KEY = 'veridian_bank_db';

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

const saveDb = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const mockDb = {
  login: (email, password) => {
    const db = getDb();
    // Support migrating old db format where 'user' is a single object
    const users = db.users || [db.user]; 
    if (!db.users && db.user) {
      db.users = INITIAL_DATA.users; 
      saveDb(db);
    }
    
    const user = (db.users || []).find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user };
    }
    return { success: false, message: "Invalid credentials" };
  },

  getUserData: (userId) => {
    const db = getDb();
    const userAccounts = db.accounts.filter(a => a.userId === userId);
    const userTransactions = db.transactions.filter(t => t.userId === userId);
    const user = (db.users || []).find(u => u.id === userId) || db.user;
    return { accounts: userAccounts, transactions: userTransactions, user };
  },

  getAdminData: () => {
    const db = getDb();
    const allUsers = db.users || [];
    const allAccounts = db.accounts || [];
    const allTransactions = db.transactions || [];
    
    const totalLiquidity = allAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      stats: {
        totalLiquidity,
        activeUsers: allUsers.length,
        totalTransactions: allTransactions.length,
        systemHealth: 'Optimal'
      },
      allUsers,
      allAccounts,
      allTransactions
    };
  },

  transfer: (fromAccountId, toAccountName, amount, userId) => {
    const db = getDb();
    const account = db.accounts.find(a => a.id === fromAccountId);
    
    if (!account || account.balance < amount) {
      return { success: false, message: "Insufficient funds" };
    }

    account.balance -= amount;
    const newTx = {
      id: `t${Date.now()}`,
      userId: userId,
      date: new Date().toISOString().split('T')[0],
      payee: toAccountName,
      amount: -amount,
      type: "withdrawal",
      category: "Transfer"
    };
    db.transactions.unshift(newTx);
    
    saveDb(db);
    return { success: true, balance: account.balance };
  },

  updateProfile: (profileData, userId) => {
    const db = getDb();
    if (db.users) {
      const idx = db.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...profileData };
      }
    } else {
      db.user = { ...db.user, ...profileData };
    }
    saveDb(db);
    return { success: true, user: db.users ? db.users.find(u => u.id === userId) : db.user };
  }
};
