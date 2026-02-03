const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обработки JSON
app.use(express.json());
app.use(express.static(__dirname));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint для расчета
app.post('/api/calculate', (req, res) => {
  const { area, height, externalWalls, energyEfficient } = req.body;

  // Базовая формула расчета вентиляции: Q = S * H * 40
  let power = area * height * 40;

  // +20% за каждую внешнюю стену (дополнительная нагрузка)
  power = power * (1 + (externalWalls * 0.20));

  // -15% за энергосберегающие окна (меньше утечек воздуха)
  if (energyEfficient) {
    power = power * 0.85;
  }

  res.json({
    power: Math.round(power),
    area,
    height,
    volume: area * height
  });
});

app.listen(PORT, () => {
  console.log(`💨 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 Калькулятор системы вентиляции готов к работе`);
});
