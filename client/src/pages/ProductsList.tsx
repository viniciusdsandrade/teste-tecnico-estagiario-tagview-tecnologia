import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {listProducts} from '../api/products';
import type {Product} from '../types';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Pagination from '../components/Pagination';
import Alert from '../components/Alert';

type LimitOption = 10 | 20 | 50 | 'all';

export default function ProductsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const limitParam = searchParams.get('limit') ?? '10';
    const pageParam = searchParams.get('page') ?? '1';
    const idProdutoParam = searchParams.get('idProduto');

    const [limit, setLimit] = useState<LimitOption>(
        limitParam === 'all' ? 'all' : (parseInt(limitParam, 10) as 10 | 20 | 50)
    );
    const [page, setPage] = useState(Math.max(parseInt(pageParam, 10) || 1, 1));

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Product | null>(null);
    const [flash, setFlash] = useState<string | null>(() => (location.state as any)?.message ?? null);

    const limitNumber = useMemo(() => (typeof limit === 'number' ? limit : undefined), [limit]);

    useEffect(() => {
        // sincroniza URL quando limit/page mudam via UI
        const next = new URLSearchParams(searchParams);
        next.set('limit', String(limit));
        next.set('page', String(page));
        setSearchParams(next, {replace: true});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page]);

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
    }, [limit, page]);

    // Abre modal pela query ?idProduto=... sem alterar listagem/paginação.
    useEffect(() => {
        let inFlight = true;
        if (!idProdutoParam) return;
        // tenta na página atual
        const found = items.find((p) => p.id === idProdutoParam);
        if (found) {
            setSelected(found);
            return;
        }
        // tenta buscar "all" para localizar
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
            // limpa a flash da history para não reaparecer em refresh
            navigate(location.pathname + location.search, {replace: true, state: {}});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasNext = !!limitNumber && items.length === limitNumber;

    return (
        <div>
            {flash && <Alert kind="success" onClose={() => setFlash(null)}>Novo Produto Cadastrado!</Alert>}
            <h1>Produtos</h1>

            <div className="toolbar">
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
            </div>

            {loading && <p className="muted">Carregando...</p>}
            {error && <Alert kind="error" onClose={() => setError(null)}>{error}</Alert>}

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
