import express from "express";

const app = express();
app.use(express.json());

// Псевдо-база пользователей (вместо MySQL)
let users = {
  1: { id: 1, username: "Player1", balance: 1000 },
  2: { id: 2, username: "Player2", balance: 500 }
};

// 🔹 Получить баланс
app.get("/balance/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ balance: user.balance });
});

// 🔹 Пополнение
app.post("/deposit", (req, res) => {
  const { id, amount } = req.body;
  const user = users[id];
  if (!user) return res.status(404).json({ error: "User not found" });

  user.balance += amount;
  res.json({ success: true, balance: user.balance });
});

// 🔹 Ставка
app.post("/bet", (req, res) => {
  const { id, amount, result } = req.body; // result: "win" или "lose"
  const user = users[id];
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.balance < amount) {
    return res.status(400).json({ error: "Недостаточно средств" });
  }

  user.balance -= amount;
  if (result === "win") {
    user.balance += amount * 2; // выигрыш х2
  }

  res.json({ success: true, balance: user.balance });
});

// 🔹 Вывод
app.post("/withdraw", (req, res) => {
  const { id, amount } = req.body;
  const user = users[id];
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.balance < amount) {
    return res.status(400).json({ error: "Недостаточно средств" });
  }

  user.balance -= amount;
  res.json({ success: true, balance: user.balance });
});

export default app;
