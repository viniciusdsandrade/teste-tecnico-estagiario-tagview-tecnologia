import api from './client';
import type {Product} from '../types';

export async function listProducts(
    limit: number | 'all',
    page = 1
): Promise<Product[]> {
    const params: Record<string, string | number> = {page};
    params.limit = typeof limit === 'number' ? limit : 'all';
    const res = await api.get<Product[]>('/api/v1/produtos', {params});
    return res.data;
}

export async function createProduct(
    payload: Omit<Product, 'id'>
): Promise<Product> {
    const res = await api.post<Product>('/api/v1/produtos', payload);
    return res.data;
}

export async function importProductsCsv(file: File): Promise<void> {
    const fd = new FormData();
    fd.append('file', file, file.name || 'produtos.csv');
    await api.post('/api/v1/produtos/importacao', fd);
}
