import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './Resultados.module.css'; 
import star from '../../../assets/images/star.png' //star
import grayStar from '../../../assets/images/grayStar.png' //star vazia
import defaultImg from '../../../assets/images/defaultImg.png' //img de erro padrao
import { Navigate} from 'react-router-dom';

const Resultados = () => {

  const [pesquisa_filme, setNomeFilme] = useState('');
  const token = localStorage.getItem('token');
  const handleInputChange = (event) => {
    setNomeFilme(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    // Verifica se o nome não está vazio antes de redirecionar
    if (pesquisa_filme.trim() !== '') {
      window.location.href = `/resultados?nome=${pesquisa_filme}`
    } else {
      alert('Por favor, insira um nome para a pesquisa');
    }
  };

  const stopForm = (event, movie) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Verifica se o nome não está vazio antes de redirecionar
    if (movie.trim() !== '') {
      window.location.href = `/filme?nome=${movie}`
    } else {
      alert('Por favor, insira um nome para a pesquisa');
    }
  }
  
  
  

    
    const [filmes, setFilmes] = useState([]); // Mudado para armazenar um único filme
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = new URLSearchParams(useLocation().search);
    const nomeFilme = query.get('nome'); // Use 'nome' que está sendo passado na URL
    const [imageStates, setImageStates] = useState([]);

    
    const normalizeRating = (source, value) => {
      const ratingValue = parseFloat(value);
      switch (source) {
        case 'Internet Movie Database':
          return (ratingValue / 2); // De 0 a 10 para 0 a 5
        case 'Rotten Tomatoes':
          return (ratingValue / 20); // De 0% a 100% para 0 a 5
        case 'Metacritic':
          return (ratingValue / 20); // De 0 a 100 para 0 a 5
        default:
          return 0; // Para qualquer outra fonte ou valor inválido
        }
      };

    useEffect(() => {
        const fetchFilme = async () => {
          if (nomeFilme) {
            try {
              const response = await fetch(`http://localhost:8000/api/filmes/?filme=${encodeURIComponent(nomeFilme)}`);
              console.log('Response:', response);

              if (!response.ok) {
                throw new Error('Network response was not ok');
              }

              const data = await response.json();
              console.log('Data:', data);

              const filmesFiltrados = data.filter(filme => !filme.Response || filme.Response !== 'False');
              setFilmes(filmesFiltrados);

            } catch (error) {
              console.error('Erro ao buscar filme:', error);
              setError(error.message);
            } finally {
              setLoading(false);
            }
          }
        };
    
        fetchFilme();
      }, []);

      
      if (!token) {
        return <Navigate to="/login" replace />;
    }

      if (loading) return <div>Carregando...</div>;


  return (
    <>

        <form className={style.search_form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pesquisar filmes..."
            value={pesquisa_filme}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Pesquisar</button>
        </form>

          {Array.isArray(filmes) && filmes.length > 0 ? (
            filmes.map((filme, index) => {
              // Definindo valores padrão para ratings
              const defaultRatings = [
                { Source: 'Internet Movie Database', Value: 'N/A' },
                { Source: 'Rotten Tomatoes', Value: 'N/A' },
                { Source: 'Metacritic', Value: 'N/A' }
              ];
  
              // Criar um conjunto para evitar duplicatas
              const uniqueSources = new Set();

              // Mesclando ratings do filme com os padrões, evitando duplicatas
              const ratingsToDisplay = (filme.Ratings || []).reduce((acc, rating) => {
                if (!uniqueSources.has(rating.Source)) {
                  uniqueSources.add(rating.Source);
                  acc.push(rating);
                }
                return acc;
              }, []);

              // Adicionando ratings padrão se ainda não tiver 3
              defaultRatings.forEach(defaultRating => {
                if (!uniqueSources.has(defaultRating.Source) && ratingsToDisplay.length < 3) {
                  uniqueSources.add(defaultRating.Source);
                  ratingsToDisplay.push(defaultRating);
                }
              });
  
              return (

              <div className={style.alinha}>
                <div className={style.img_film}><img alt="filme" src={filme.Poster || imageStates[index]}  onError={(e) => { e.target.src = defaultImg }} /></div>

                <div className={style.sobrepor}>

                  <ul><h2>{filme.Title}</h2></ul><br/>
                  <ul>Diretor:{filme.Director} </ul>
                  <ul>Atores:{filme.Actors} </ul><br/>

                  <ul><h3>Avaliações:</h3></ul><br/>

                  {ratingsToDisplay.map((rating, idx) => {
                    // Converte a avaliação para um número
                    const normalizedRating = normalizeRating(rating.Source, rating.Value);
                    const fullStars = Math.round(normalizedRating);
                    let stars = [];
                  
                  // Se não houver avaliação válida, exibe estrelas cinzas
                  if (isNaN(normalizedRating)) {
                    for (let i = 0; i < 5; i++) {
                      stars.push(<img key={`gray-${idx}-${i}`} src={grayStar} alt="Star" />);
                    }
                  } else {
                    // Adiciona estrelas cheias
                    for (let i = 0; i < fullStars; i++) {
                      stars.push(<img key={`full-${idx}-${i}`} src={star} alt="Star" />);
                    }
                    // Adiciona estrelas vazias até completar 5
                    for (let i = fullStars; i < 5; i++) {
                      stars.push(<img key={`empty-${idx}-${i}`} src={grayStar} alt="Star" />);
                    }
                  }

                  return(
                    <div className={style.sobrepor1}>
                      <p>{rating.Source}</p> <br/><p>{rating.Value}</p> {stars}
                    </div>
                  );
                  })} 

                  <br/><br/><br/><br/><br/>

                  <ul>Trama: {filme.Plot} </ul>
                  <form className="infosfilme-form" onSubmit={(event) => stopForm(event, filme.Title)}><br/>
                      <button type="submit" >Acessar informações do filme</button>
                  </form>
                </div>
          
              </div>
            );
            })
          ) : (
            <li>Nenhum filme encontrado.</li>
          )}
    </>
  );
};

export default Resultados;