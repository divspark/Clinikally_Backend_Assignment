import express, { Request, Response, Express } from 'express';
import productRoutes from './routes/productRoutes';

const app: Express = express();

app.use(express.json());
app.use('/products', productRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Api is Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
