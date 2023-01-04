import React, { useState } from 'react';
import { Login } from '../API/API';

interface LoginProps {
  // Props for the login component
}

interface LoginState {
  username: string;
  password: string;
}

function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        
        const response = await Login(username, password) 
        
        if( response.data.isSuccess === false)
        {
            alert(response.data.message);
            return
        }

        localStorage.setItem('username', username);
        localStorage.setItem('TOKEN', response.data.token)
        alert('Successful login!');
        window.location.replace("/home");
    }

    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input type="submit" value="Submit" />
      </form>
    );

}

export default LoginPage