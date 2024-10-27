import React, { useState } from 'react';
import { Navigate, useNavigate} from 'react-router-dom';
import style from './Home.module.css'

const Home = () => {
    const token = localStorage.getItem('token');
    const [nomeFilme, setNomeFilme] = useState('');
    const navigate = useNavigate();
  
    const handleSearch = (e) => {
        e.preventDefault();
        if (nomeFilme) {
            // Redireciona para a página Resultados com o nome do filme como parâmetro de consulta
            navigate(`/resultados?nome=${encodeURIComponent(nomeFilme)}`);
        }
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <main>
                <div className={style.pesquisa}>
                    <h3>Movienews: Descubra tudo sobre seus filmes favoritos</h3> 
                    <form className={style.search_form_home} onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Pesquisar filmes..."
                            value={nomeFilme}
                            onChange={(e) => setNomeFilme(e.target.value)}
                            required
                        />
                        <button type="submit">Pesquisar</button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Home;
