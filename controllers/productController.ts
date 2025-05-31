import { Request, Response } from 'express';
import { Product, ApiResponse } from '../types';
import { loadProducts } from '../models/product';

// Service logic: Search products with scoring and pagination
const searchProducts = async (
  query: string,
  limit: number,
  skip: number
): Promise<Product[]> => {
  const products = await loadProducts();
  const normalizedQuery = query.toLowerCase().trim();

  // Scoring: +2 for title starting with query, +1 for brand containing query
  const scoreProduct = (product: Product): number => {
    let score = 0;
    const titleLower = product.title.toLowerCase();
    const brandLower = product.brand.toLowerCase();
    if (titleLower.startsWith(normalizedQuery)) score += 2;
    else if (titleLower.includes(normalizedQuery)) score += 1;
    if (brandLower.includes(normalizedQuery)) score += 1;
    return score;
  };

  // Filter and score
  const filteredProducts = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery)
    )
    .sort((a, b) => {
      const scoreA = scoreProduct(a);
      const scoreB = scoreProduct(b);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.title.localeCompare(b.title);
    });

  // Pagination
  return filteredProducts.slice(skip, skip + limit);
};

// Controller
export const searchProductsController = async (req: Request, res: Response): Promise<void> => {
  const { q, limit = '10', skip = '0' } = req.query;

  // Validate query
  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Query must be at least 2 characters long',
      error: 'Invalid query',
    };
    res.status(400).json(response);
    return;
  }

  // Validate pagination parameters
  const limitNum = parseInt(limit as string, 10);
  const skipNum = parseInt(skip as string, 10);
  if (isNaN(limitNum) || isNaN(skipNum) || limitNum < 1 || skipNum < 0) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Invalid pagination parameters',
      error: 'Limit must be positive and skip must be non-negative',
    };
    res.status(400).json(response);
    return;
  }

  try {
    const products = await searchProducts(q as string, limitNum, skipNum);
    const response: ApiResponse<typeof products> = {
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};