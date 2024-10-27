import React, { useState } from 'react';
import style from './Login.module.css'; 
import { Link } from 'react-router-dom';


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // aqui verifica no back se o usuario existe
      try {
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: username,  // Substitua pelo username correto
            password: password,
          }),
        });
  
        if (response.ok) { //se o usuario existir, ele sera redirecionado para a home
          const data = await response.json();
          // Armazenar o token de autenticação
          localStorage.setItem('token', data.token);
          window.location.href = "/"
        } else {
          setError('Credenciais inválidas.');
        }
      } catch (error) {
        setError('Erro de conexão com o servidor.');
      }
    };

  return (
    <>
        <main>
            <form className={style.login_form}  onSubmit={handleSubmit}>
                <h3 id="Titulo3">Login</h3>

                <p id="conta">Não tem uma conta? <a href="/register">Cadastre-se no Movinews agora</a></p>

                <p><label for="username">Usuário</label></p><br/>

                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/><br/>

                <label for="password">Senha</label><br/>

                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/><br/><br/>

                <button type="submit">Conecte-se</button>
                <p><Link to="/password">Esqueceu sua senha?</Link></p>
                {error && <p className="error">Usuario ou senha incorretos.</p>}

            </form>
        </main>
        <footer></footer>
    </>
  );
};

export default Login;