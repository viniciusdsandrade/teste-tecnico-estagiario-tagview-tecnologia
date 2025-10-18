export type UUID = string;

export interface Product {
    id: UUID;
    nome: string;
    preco: number;
    imagem: string | null;
    descricao: string;
}

export interface ApiError {
    erros: string[];
}
