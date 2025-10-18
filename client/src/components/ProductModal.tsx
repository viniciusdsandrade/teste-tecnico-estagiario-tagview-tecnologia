import { useEffect, useRef } from 'react';
import type { Product } from '../types';

type Props = { product: Product; onClose: () => void };

export default function ProductModal({ product, onClose }: Props) {
    const closeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose} aria-hidden>
            <div className="modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${product.nome}`}
                 onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2 style={{ margin: 0 }}>{product.nome}</h2>
                    <button ref={closeRef} onClick={onClose} aria-label="Fechar">✕</button>
                </header>
                <div className="modal-content">
                    <img
                        src={product.imagem ?? ''}
                        alt={product.imagem ? `Imagem de ${product.nome}` : 'Sem imagem'}
                        style={{ maxWidth: '100%', borderRadius: 8, display: product.imagem ? 'block' : 'none' }}
                    />
                    <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{product.descricao}</p>
                </div>
            </div>
        </div>
    );
}
