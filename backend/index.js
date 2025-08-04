import express from 'express';
import cors from 'cors';
import blogRouter from './lib/routes/blogRoute.js';
import adminRouter from './lib/routes/adminRoute.js';
import { ConnectDB } from './lib/config/db.js';

const app = express();
await ConnectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});