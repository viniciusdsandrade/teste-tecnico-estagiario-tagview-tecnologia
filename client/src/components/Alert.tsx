import type {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{ kind?: 'success' | 'error' | 'info'; onClose?: () => void }>;

export default function Alert({ kind = 'info', onClose, children }: Props) {
    const bg = kind === 'success' ? '#093' : kind === 'error' ? '#933' : '#335';
    return (
        <div style={{
            background: bg, color: 'white', padding: '12px 16px', borderRadius: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16
        }} role="status" aria-live="polite">
            <div>{children}</div>
            {onClose && (
                <button onClick={onClose} style={{ marginLeft: 16 }}>
                    Fechar
                </button>
            )}
        </div>
    );
}
