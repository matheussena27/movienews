import React, { useState } from "react";
import style from './EditPassword.module.css'

function EditPassword (){

    const [usuario, setUsuario] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleEditPassword = async (e) => { //aqui estou acessando o back para alterar a senha
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/edit-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, nova_senha: novaSenha }),
            });

            const data = await response.json();
            if (response.ok) {
                setMensagem(data.mensagem);
                console.log("ok")
            } else {
                setMensagem("usuario não existe");
            }
        } catch (error) {
            setMensagem("Erro ao tentar mudar a senha.");
        }
        alert(mensagem)
    };

    return(
        <main class="login-container">
            <form className={style.login_form} onSubmit={handleEditPassword}>
                <h3 id="Titulo3">Informe a nova senha</h3>
                    <br/>
                    <label for="usuario">Usuário</label>
                    <br/>

                    <input type="text"
                        id="usuario"
                        name="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    /><br/>

                    <label for="senha">Nova senha</label><br/>

                    <input type="password"
                        id="senha"
                        name="senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        required
                    /><br/><br/>

                <button type="submit">Redefinir senha</button>
            </form>
        </main>
    );
};

export default EditPassword;