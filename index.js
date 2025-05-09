const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

// Routes
const validateCodeRouter = require('./routes/validate-code');
const chatOpenAiRouter = require('./routes/chat-openai');

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'https://morkx.melvicgomez.com',
  })
);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15, // Allow 5 requests per minute
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Routes
app.use(validateCodeRouter);
app.use(chatOpenAiRouter);

app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
  console.log('Server running!');
});
