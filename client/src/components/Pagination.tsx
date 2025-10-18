type Props = {
    page: number;
    onPageChange: (p: number) => void;
    hasNext: boolean;
    disabled?: boolean;
};

export default function Pagination({ page, onPageChange, hasNext, disabled }: Props) {
    return (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <button disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
                ◀ Anterior
            </button>
            <span style={{ padding: '8px 12px' }}>Página {page}</span>
            <button disabled={disabled || !hasNext} onClick={() => onPageChange(page + 1)}>
                Próxima ▶
            </button>
        </div>
    );
}
