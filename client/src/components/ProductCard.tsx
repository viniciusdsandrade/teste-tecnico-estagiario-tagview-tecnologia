import type { Product } from '../types';

const FALLBACK_SVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'>
     <rect width='100%' height='100%' fill='#444'/>
     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
           fill='#ccc' font-size='20' font-family='Arial, sans-serif'>Sem imagem</text>
   </svg>`
);

function formatBRL(n: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

type Props = { product: Product; onClick?: () => void };

export default function ProductCard({ product, onClick }: Props) {
    const src = product.imagem || `data:image/svg+xml;charset=utf-8,${FALLBACK_SVG}`;
    return (
        <div className="product-card" onClick={onClick} role="button" tabIndex={0}
             onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
            <img src={src} alt={`Imagem do produto ${product.nome}`} className="product-image" />
            <div className="product-body">
                <div className="product-name">{product.nome}</div>
                <div className="product-price">{formatBRL(product.preco)}</div>
            </div>
        </div>
    );
}
