import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import './Home.css'
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { isPropertySignature } from 'typescript';

function Home() {

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {['RepoTest01', 'RepoTest02']}></RepoList>
                <div className="App">
                <header className="App-header">
                    
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Learn React
                    </a>
                </header>
                </div>
            </div>
        </div>
    );
}

export default Home;
