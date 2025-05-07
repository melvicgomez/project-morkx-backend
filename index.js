const express = require('express');
const rateLimit = require('express-rate-limit');

const cors = require('cors');

require('dotenv').config();

// routes
const validateCodeRouter = require('./routes/validate-code');
const chatOpenAiRouter = require('./routes/chat-openai');

const app = express();

// Body Parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 requests every 1 minute
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(validateCodeRouter);
app.use(chatOpenAiRouter);

// Start server
app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
  console.log('Server running on http://localhost:8000');
});
