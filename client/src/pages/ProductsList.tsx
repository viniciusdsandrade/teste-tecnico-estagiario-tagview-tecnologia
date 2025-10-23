import {useEffect, useMemo, useState, useRef} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {listProducts} from '../api/products';
import api from '../api/client';
import type {ApiError, Product} from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Pagination from '../components/Pagination';
import Alert from '../components/Alert';
import axios from "axios";
import * as React from "react";

type LimitOption = 10 | 20 | 50 | 'all';

function getFlashMessage(state: unknown): string | null {
    if (state && typeof state === 'object' && 'message' in state) {
        const msg = (state as Record<string, unknown>).message;
        return typeof msg === 'string' ? msg : null;
    }
    return null;
}

function ImportCsvButton({onImported, onError}: {
    onImported: () => void;
    onError: (msg: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.currentTarget.value = '';
        if (!file) return;

        const form = new FormData();
        form.append('file', file);

        try {
            setUploading(true);
            await api.post('/api/v1/produtos/importacao', form, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            onImported();
        } catch (err: unknown) {
            let msg = 'Falha ao importar CSV.';

            if (axios.isAxiosError<ApiError>(err)) {
                const lista = err.response?.data?.erros;
                if (Array.isArray(lista) && lista.length) {
                    msg = lista.join('\n');
                } else if (err.message) {
                    msg = err.message;
                }
            } else if (err instanceof Error) {
                msg = err.message || msg;
            }

            onError(msg);
        } finally {
            setUploading(false);
        }
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                title="Importar produtos via CSV"
            >
                {uploading ? 'Importando…' : 'Import'}
            </button>
        </>
    );
}

export default function ProductsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const limitParam = searchParams.get('limit') ?? '10';
    const pageParam = searchParams.get('page') ?? '1';
    const idProdutoParam = searchParams.get('idProduto');

    const [limit, setLimit] = useState<LimitOption>(
        limitParam === 'all' ? 'all' : (parseInt(limitParam, 10) as 10 | 20 | 50),
    );
    const [page, setPage] = useState(Math.max(parseInt(pageParam, 10) || 1, 1));

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Product | null>(null);
    const [flash, setFlash] = useState<string | null>(() => getFlashMessage(location.state));

    const [reloadToken, setReloadToken] = useState(0);

    const limitNumber = useMemo(() => (typeof limit === 'number' ? limit : undefined), [limit]);

    useEffect(() => {
        const next = new URLSearchParams(searchParams);
        next.set('limit', String(limit));
        next.set('page', String(page));
        setSearchParams(next, {replace: true});
    }, [limit, page, searchParams, setSearchParams]);

    useEffect(() => {
        let inFlight = true;
        setLoading(true);
        setError(null);
        listProducts(limit, page)
            .then((data) => {
                if (!inFlight) return;
                setItems(data);
            })
            .catch(() => {
                if (!inFlight) return;
                setError('Erro ao carregar produtos. Tente novamente.');
            })
            .finally(() => inFlight && setLoading(false));
        return () => {
            inFlight = false;
        };
    }, [limit, page, reloadToken]);

    useEffect(() => {
        let inFlight = true;
        if (!idProdutoParam) return;
        const found = items.find((p) => p.id === idProdutoParam);
        if (found) {
            setSelected(found);
            return;
        }
        (async () => {
            try {
                const all = await listProducts('all', 1);
                if (!inFlight) return;
                const match = all.find((p) => p.id === idProdutoParam);
                if (match) setSelected(match);
            } catch {
                // silencioso: se não achar, não abre modal
            }
        })();
        return () => {
            inFlight = false;
        };
    }, [idProdutoParam, items]);

    useEffect(() => {
        if (flash) {
            navigate(location.pathname + location.search, {replace: true, state: {}});
        }
    }, [flash, location.pathname, location.search, navigate]);

    const hasNext = !!limitNumber && items.length === limitNumber;

    return (
        <div>
            {flash && (
                <Alert kind="success" onClose={() => setFlash(null)}>
                    {flash}
                </Alert>
            )}
            <h1>Produtos</h1>

            <div className="toolbar" style={{gap: 12}}>
                <div className="limit">
                    <label htmlFor="limit">Exibir:</label>{' '}
                    <select
                        id="limit"
                        value={String(limit)}
                        onChange={(e) => {
                            const v = e.target.value;
                            setLimit(v === 'all' ? 'all' : (parseInt(v, 10) as LimitOption));
                            setPage(1);
                        }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="all">Todos</option>
                    </select>
                </div>

                <ImportCsvButton
                    onImported={() => {
                        setFlash('Produtos importados com sucesso!');
                        setReloadToken((n) => n + 1);
                    }}
                    onError={(msg) => setError(msg)}
                />
            </div>

            {loading && <p className="muted">Carregando...</p>}
            {error && (
                <Alert kind="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <div className="grid">
                {items.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => setSelected(p)}/>
                ))}
            </div>

            {limit !== 'all' && (
                <Pagination page={page} onPageChange={setPage} hasNext={hasNext} disabled={loading}/>
            )}

            {selected && <ProductModal product={selected} onClose={() => setSelected(null)}/>}
        </div>
    );
}
