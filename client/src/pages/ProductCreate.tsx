import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {fileToDataUrl} from '../utils/file';
import {createProduct} from '../api/products';
import type {ApiError, Product} from '../types';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

const schema = z.object({
    nome: z.string().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
    preco: z.coerce.number().min(10, 'Preço mínimo é 10'),
    descricao: z.string().min(30, 'Mínimo 30 caracteres').max(255, 'Máximo 255 caracteres'),
    imagem: z
        .any()
        .optional()
        .refine((f) => !f || f.length <= 1, 'Envie apenas um arquivo')
        .refine((f) => !f || f.length === 0 || f[0].size <= 5 * 1024 * 1024, 'Imagem deve ter no máximo 5MB')
        .refine((f) => !f || f.length === 0 || ['image/png', 'image/jpeg'].includes(f[0].type), 'Apenas PNG ou JPG'),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export default function ProductCreatePage() {
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const {register, handleSubmit, formState: {errors, isSubmitting}} =
        useForm<FormInput, undefined, FormData>({resolver: zodResolver(schema)})


    async function onSubmit(data: FormData) {
        setServerErrors([]);
        const fileList: FileList | undefined = (data.imagem as never) ?? undefined;
        const file = fileList?.[0];
        const imagem: string | null = file ? await fileToDataUrl(file) : null;

        const payload: Omit<Product, 'id'> = {
            nome: data.nome.trim(),
            preco: data.preco,
            descricao: data.descricao.trim(),
            imagem,
        };

        try {
            const created = await createProduct(payload);
            navigate(`/produtos/exibir?idProduto=${created.id}`, {state: {message: 'Novo Produto Cadastrado!'}});
        } catch (err: unknown) {
            if (axios.isAxiosError<ApiError>(err)) {
                const status = err.response?.status;
                const erros = err.response?.data?.erros;

                if (status === 422 && Array.isArray(erros)) {
                    setServerErrors(erros);
                } else if (status === 401) {
                    setServerErrors(['Não autorizado (X-API-KEY ausente ou inválida).']);
                } else {
                    setServerErrors([err.message || 'Erro inesperado ao cadastrar. Tente novamente.']);
                }
            } else if (err instanceof Error) {
                setServerErrors([err.message]);
            } else {
                setServerErrors(['Erro inesperado ao cadastrar. Tente novamente.']);
            }
        }
    }

    return (
        <div>
            <h1>Novo Produto</h1>
            {serverErrors.length > 0 && (
                <div className="error-list" role="alert">
                    {serverErrors.map((err, i) => (<div key={i}>• {err}</div>))}
                </div>
            )}

            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-row">
                    <label htmlFor="nome">Nome do Produto</label>
                    <input id="nome" type="text" placeholder="Ex.: Teclado Mecânico"
                           {...register('nome')} aria-invalid={!!errors.nome}/>
                    {errors.nome && <span className="err">{errors.nome.message}</span>}
                </div>

                <div className="form-row">
                    <label htmlFor="preco">Preço (R$)</label>
                    <input id="preco" type="number" step="0.01" min={10} placeholder="Ex.: 199.90"
                           {...register('preco')} aria-invalid={!!errors.preco}/>
                    {errors.preco && <span className="err">{errors.preco.message}</span>}
                </div>

                <div className="form-row">
                    <label htmlFor="descricao">Descrição Completa</label>
                    <textarea id="descricao" rows={5} placeholder="Descreva o produto..." {...register('descricao')}
                              aria-invalid={!!errors.descricao}/>
                    {errors.descricao && <span className="err">{errors.descricao.message}</span>}
                </div>

                <div className="form-row">
                    <label htmlFor="imagem">Imagem (PNG ou JPG, até 5MB) — opcional</label>
                    <input id="imagem" type="file" accept="image/png,image/jpeg" {...register('imagem')} />
                    {errors.imagem && <span className="err">{errors.imagem.message as string}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Cadastrar'}</button>
                    <button type="button" onClick={() => navigate('/produtos/exibir')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
