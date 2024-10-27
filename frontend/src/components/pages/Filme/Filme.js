import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './movie.module.css'; 
import disney from '../../../assets/images/disney.png'; // Importa a logo
import prime from '../../../assets/images/prime.png'; // Importa a logo
import star from '../../../assets/images/star.png'; //star
import grayStar from '../../../assets/images/grayStar.png'; //star vazia
import defaultImg from '../../../assets/images/defaultImg.png'; //img de erro padrão
import { Navigate} from 'react-router-dom';

const Filme = () => {
    const [filme, setFilme] = useState(null);
    const [recomendacao, setRecomendacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = new URLSearchParams(useLocation().search);
    const nomeFilme = query.get('nome');
    const token = localStorage.getItem('token');
    
    const defaultRatings = [
        { Source: "Internet Movie Database", Value: "N/A" },
        { Source: "Rotten Tomatoes", Value: "N/A" },
        { Source: "Metacritic", Value: "N/A" },
        ];

    useEffect(() => { //aqui é buscado no back as informacoes do filme e recomendacoes
        const fetchFilme = async () => {
            if (nomeFilme) {
                setLoading(true); // Começa o carregamento
                try {
                    const response = await fetch(`http://localhost:8000/api/filme/?filme=${encodeURIComponent(nomeFilme)}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setFilme(data); // Atualiza o estado do filme
                } catch (error) {
                    setError(error.message); // Define o erro
                } finally {
                    setLoading(false); // Finaliza o carregamento
                }
            }
        };

        const fetchRecomendacao = async () => {
            if (nomeFilme) {
                try {
                    const response = await fetch(`http://localhost:8000/api/recomendacao/?filme=${encodeURIComponent(nomeFilme)}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data2 = await response.json();
                    setRecomendacao(data2); // Atualiza o estado da recomendação
                } catch (error) {
                    setError(error.message); // Define o erro
                }
            }
        };

        fetchFilme();
        fetchRecomendacao();
    }, [nomeFilme]); // Remover 'recomendacao' como dependência

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    // Verifica se o filme está carregado
    if (!filme) return <div>Nenhum filme encontrado.</div>;

    // Função para padronizar as avaliacoes
    const normalizeRating = (source, value) => {
        const ratingValue = parseFloat(value);
        switch (source) {
            case 'Internet Movie Database':
                return ratingValue / 2; // De 0 a 10 para 0 a 5
            case 'Rotten Tomatoes':
                return ratingValue / 20; // De 0% a 100% para 0 a 5
            case 'Metacritic':
                return ratingValue / 20; // De 0 a 100 para 0 a 5
            default:
                return 0; // Para qualquer outra fonte ou valor inválido
        }
    };

    // Função para calcular as estrelas das avaliacoes
    const getStars = (normalizedRating) => {
        const stars = Math.min(Math.floor(normalizedRating), 5); // Limita a 5 estrelas
        const starArray = [];

        // Preencher estrelas cheias
        for (let i = 0; i < stars; i++) {
            starArray.push(<img key={i} src={star} alt="Star" />);
        }

        // Preencher estrelas vazias
        for (let i = stars; i < 5; i++) {
            starArray.push(<img key={i} src={grayStar} alt="Star" />);
        }

        return starArray;
    };

    return (
        <>
            <div className={style.body}>
                <h2 className={style.titulo}>{filme.Title}</h2>

                <main>
                    <div className={style.alinha}>
                        <div className={style.img_film1}>
                            <img src={filme.Poster || defaultImg} alt={filme.Title} onError={(e) => { e.target.src = defaultImg }}/>
                         </div>

                        <div className={style.sobreporfilm}>
                            <p>Avaliado: {filme.Rated}</p>
                            <p>Data de Lançamento: {filme.Released}</p>
                            <p>Duração: {filme.Runtime}</p>
                            <p>Gênero: {filme.Genre}</p>
                            <p>Diretor: {filme.Director}</p>
                            <p>Escritor: {filme.Writer}</p>
                            <p>Atores: {filme.Actors}</p>
                            <p>Idioma: {filme.Language}</p>
                            <p>País: {filme.Country}</p>
                            <p>Prêmios: {filme.Awards}</p>
                            <p id="inline">Trama: {filme.Plot}</p>

                            <div className={style.avaliacoes}>
                            {defaultRatings.map((defaultRating, idx) => {
                                // Encontra a avaliação correspondente
                                const rating = filme.Ratings.find(r => r.Source === defaultRating.Source) || defaultRating;

                                // Converte a avaliação para um número
                                const normalizedRating = rating.Value !== "N/A" ? normalizeRating(rating.Source, rating.Value) : NaN;
                                const fullStars = Math.round(normalizedRating);
                                let stars = [];

                                // Se não houver avaliação válida, exibe estrelas cinzas
                                if (isNaN(normalizedRating) || normalizedRating <= 0) {
                                for (let i = 0; i < 5; i++) {
                                    stars.push(<img key={`gray-${idx}-${i}`} src={grayStar} alt="Estrela cinza" />);
                                }
                                } else {
                                // Adiciona estrelas cheias
                                for (let i = 0; i < fullStars; i++) {
                                    stars.push(<img key={`full-${idx}-${i}`} src={star} alt="Estrela cheia" />);
                                }
                                // Adiciona estrelas cinzas até completar 5
                                for (let i = fullStars; i < 5; i++) {
                                    stars.push(<img key={`gray-${idx}-${i}`} src={grayStar} alt="Estrela cinza" />);
                                }
                                }

                                return (
                                <div className={style.avaliacao_item} key={idx}>
                                    <p>{rating.Source}:</p>
                                    <p>{rating.Value}</p>
                                    <div className={style.stars}>{stars}</div>
                                </div>
                                );
                            })}
                            </div>


                        </div>
                        {nomeFilme.includes("Toy Story") ? (
                            <img className={style.netflix} src={disney} alt="img" />
                        ) : <img className={style.netflix} src={prime} alt="img" />}
                    </div>

                    <div className={style.related_movies}>
                        <h2>Filmes Relacionados</h2><br/><br/>

                        <div className={style.movie_list}>
                        {Array.isArray(recomendacao) && recomendacao.length > 0 ? (
                            recomendacao
                                .filter((rec) => !(rec.Response === 'False' && rec.Error === 'Movie not found!')) // Filtrando os itens
                                .slice(0, 3) // Pegando os três primeiros itens filtrados
                                .map((rec) => {
                                return rec.Title && (
                                    <a href={'/filme?nome=' + rec.Title} key={rec.Title}><div className={style.movie_item} key={rec.Title}> {/* Adicione uma chave única para cada item */}
                                    <img src={rec.Poster || defaultImg} alt={rec.Title} onError={(e) => { e.target.src = defaultImg }} />
                                    <p>{rec.Title}</p>
                                    </div></a>
                                );
                                })
                            ) : (
                            <li>Carregando.</li>
                            )}


                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Filme;
