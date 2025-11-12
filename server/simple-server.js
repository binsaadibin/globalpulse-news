import express from 'express';
import cors from 'cors';

const app = express();

// CORS for production
app.use(cors({
  origin: ['https://your-app.netlify.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Simple mock data
const articles = [
  {
    id: '1',
    title: 'Global Climate Summit Reaches New Agreement',
    summary: 'World leaders unite on climate action with historic agreement...',
    content: 'Full article content about the climate summit...',
    category: 'politics',
    imageUrl: '/api/placeholder/400/200',
    date: '2024-01-15',
    author: 'Global News Desk'
  }
];

// API Routes
app.get('/api/articles', (req, res) => {
  res.json(articles);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobalPulse News API is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('🚀 GlobalPulse News API running on port ' + PORT);
});
