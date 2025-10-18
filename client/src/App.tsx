import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ProductsListPage from './pages/ProductsList';
import ProductCreatePage from './pages/ProductCreate';
import './App.css';

function NotFound() {
    return <h2>Oooops. Essa página não existe.</h2>;
}

export default function App() {
    return (
        <>
            <nav className="topbar">
                <Link to="/produtos/exibir">Exibir</Link>
                <Link to="/produtos/cadastro">Cadastro</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/produtos/exibir" replace />} />
                <Route path="/produtos/exibir" element={<ProductsListPage />} />
                <Route path="/produtos/cadastro" element={<ProductCreatePage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
