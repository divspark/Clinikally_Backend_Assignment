import express from 'express';
import { searchProductsController } from '../controllers/productController';

const router = express.Router();

router.get('/search', searchProductsController);

export default router;