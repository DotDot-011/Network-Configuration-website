import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import './Home.css'
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { isPropertySignature } from 'typescript';
import { GetRepoNames } from '../API/API';

interface RepoTag {
    repositoryName: string,
    repositoryId: number
}

interface RepoInfo {
    repositoryDeviceType: string
    repositoryHost: string
    repositoryId: number
    repositoryName: string
    repositoryOwnerName: string
    repositoryTimestamp: Date
    IsSnmpEnable: boolean
    SnmpCommunity: string
}

function Home() {

    const [repositories, setRepositories] = useState<Array<RepoInfo>>([])

    useEffect(()=> {
        
        DownloadRepoNames()
    }, [])

    useEffect(()=> {

        console.log(repositories)

    }, [repositories])

    async function DownloadRepoNames()
    {
        const username = localStorage.getItem("username")
        const response = await GetRepoNames(username)
        
        if(response.state === false)
        {
            alert(response.data)
            window.location.replace("/login")
        }
        
        console.log(response.data)
        setRepositories(response.data)
    }

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {repositories.map((repository) => {
                    const repo: RepoTag = {repositoryId: repository.repositoryId, repositoryName: repository.repositoryName};
                    return repo
            })}></RepoList>
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
