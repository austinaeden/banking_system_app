// Simple LocalStorage based Mock Database for Veridian Bank

const INITIAL_DATA = {
  user: {
    id: "1",
    name: "Austin Aeden",
    email: "austinaeden@gmail.com",
    phone: "+1 234 567 890",
    password: "password123"
  },
  accounts: [
    { id: "acc1", userId: "1", type: "Checking", balance: 12450.50, accountNumber: "**** 4421" },
    { id: "acc2", userId: "1", type: "Savings", balance: 45200.00, accountNumber: "**** 8892" },
    { id: "acc3", userId: "1", type: "Investment", balance: 8900.25, accountNumber: "**** 1103" }
  ],
  transactions: [
    { id: "t1", userId: "1", date: "2024-03-20", payee: "Apple Store", amount: -1299.00, type: "withdrawal", category: "Electronics" },
    { id: "t2", userId: "1", date: "2024-03-19", payee: "Salary Deposit", amount: 4500.00, type: "deposit", category: "Income" },
    { id: "t3", userId: "1", date: "2024-03-18", payee: "Starbucks", amount: -12.50, type: "withdrawal", category: "Food" },
    { id: "t4", userId: "1", date: "2024-03-17", payee: "Rent Payment", amount: -1800.00, type: "withdrawal", category: "Housing" },
    { id: "t5", userId: "1", date: "2024-03-15", payee: "Amazon", amount: -85.20, type: "withdrawal", category: "Shopping" },
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
    if (db.user.email === email && db.user.password === password) {
      return { success: true, user: db.user };
    }
    return { success: false, message: "Invalid credentials" };
  },

  getUserData: () => {
    const db = getDb();
    return { accounts: db.accounts, transactions: db.transactions, user: db.user };
  },

  transfer: (fromAccountId, toAccountName, amount) => {
    const db = getDb();
    const account = db.accounts.find(a => a.id === fromAccountId);
    
    if (!account || account.balance < amount) {
      return { success: false, message: "Insufficient funds" };
    }

    account.balance -= amount;
    const newTx = {
      id: `t${Date.now()}`,
      userId: db.user.id,
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

  updateProfile: (profileData) => {
    const db = getDb();
    db.user = { ...db.user, ...profileData };
    saveDb(db);
    return { success: true, user: db.user };
  }
};
