import { Product } from '../types';

export const loadProducts = async (): Promise<Product[]> => {
  const data = await import('../data/product.json');
  return data.products;
};