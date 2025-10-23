import axios from 'axios';
import type {ApiError} from './types';

export function extractApiErrorMessage(err: unknown, fallback = 'Falha ao importar CSV. Verifique o arquivo e tente novamente.'): string {
    if (axios.isAxiosError<ApiError>(err)) {
        const msgs = err.response?.data?.erros;
        if (Array.isArray(msgs) && msgs.length) return msgs.join('\n');
        return err.message || fallback;
    }
    if (err instanceof Error) return err.message || fallback;
    return fallback;
}
