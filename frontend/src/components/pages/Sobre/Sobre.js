import React from 'react';
import style from './Sobre.module.css'; 


const Sobre = () => {
  return (
    <>
        <main>
            <div className={style.sobre}>
                <h3>Movienews: Descubra tudo sobre seus filmes favoritos</h3> 
                <p>O Movienews é uma plataforma voltada para os amantes de cinema de todos os gêneros. Através do site, os usuários podem pesquisar pelo nome de qualquer filme e acessar uma variedade de informações detalhadas, como ano de lançamento, duração, gênero, idioma, roteirista, diretor, elenco, prêmios, entre outros.</p>
            </div>
        </main>
    </>
  );
};

export default Sobre;