import {useCallback, useRef, useState} from 'react';
import {importProductsCsv} from '../api/products';
import Alert from './Alert';
import {extractApiErrorMessage} from "../error.ts";
import * as React from "react";

type Props = {
    onSuccess?: () => void;
    onError?: (msg: string) => void;
};

export default function ImportCsvButton({onSuccess, onError}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [localErr, setLocalErr] = useState<string | null>(null);

    async function handlePick() {
        setLocalErr(null);
        inputRef.current?.click();
    }

    const handleChange = useCallback(async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setBusy(true);
        setLocalErr(null);

        try {
            await importProductsCsv(file);
            onSuccess?.();
        } catch (err: unknown) {
            const msg = extractApiErrorMessage(err);
            setLocalErr(msg);
            onError?.(msg);
        } finally {
            setBusy(false);
        }
    }, [onSuccess, onError]);

    return (
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                style={{display: 'none'}}
                onChange={handleChange}
            />
            <button onClick={handlePick} disabled={busy} aria-busy={busy}>
                {busy ? 'Importando…' : 'Import'}
            </button>
            {localErr && <Alert kind="error" onClose={() => setLocalErr(null)}>{localErr}</Alert>}
        </div>
    );
}
