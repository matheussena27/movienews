import React, { useState } from 'react';
import style from './Register.module.css'; 
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Erro ao criar usuário');
            } else {
                setSuccess('Usuário criado com sucesso!');
                console.log(success)
                window.location.href = "/login"
            }
        } catch (err) {
            setError('Erro ao fazer a requisição');
            console.log(error)
        }
    };

    return (
    <>
        <form className={style.login_form} onSubmit={handleRegister}>
            <h3 id="Titulo3">Cadastre-se</h3>
            <p>
                <label htmlFor="email">E-mail</label>
                <br/>
                <input type="text" id="email" name="e-mail" value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                /><br/>
                <label htmlFor="usuario">Nome de Usuário</label>
                <br/>
                <input type="text" id="usuario" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br/>

                <label htmlFor="senha">Senha</label>
                <br/>
                <input type="password" id="senha" name="senha" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br/><br/>

                <button type="submit">Cadastre-se</button>
            </p>
            <p>Tem uma conta? <Link to="/login">Conecte-se</Link></p>
            {error && <p>Dados invalidos</p>}
        </form>
    </>
    );
}

export default Register;
