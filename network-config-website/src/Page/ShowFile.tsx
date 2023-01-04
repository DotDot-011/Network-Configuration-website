import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import './Home.css'
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { isPropertySignature } from 'typescript';
import { GetRepoNames, GetFileConfig } from '../API/API';
import Highlight from 'react-highlight';
import { useParams } from 'react-router-dom';

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

}

function ShowFile() {

    const [repositories, setRepositories] = useState<Array<RepoInfo>>([])
    const {fileId} = useParams()
    const [config, setConfig] = useState("")

    useEffect(()=> {
        
        DownloadRepoNames()
        DownloadConfig()
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

    async function DownloadConfig() {
    
        const username = localStorage.getItem("username")
        if(fileId !== undefined){
            const response = await GetFileConfig(username, parseInt(fileId)) 
            if(response.state === false)
            {
                alert(response.data)
                window.location.replace("/login")
            }
            
            console.log(response.data)
            setConfig(response.data.fileData)
        }
    
      }

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {repositories.map((repository) => {
                    const repo: RepoTag = {repositoryId: repository.repositoryId, repositoryName: repository.repositoryName};
                    return repo
            })}></RepoList>
                <Highlight className='cisco'>{config}</Highlight>
            </div>
        </div>
    );
}

export default ShowFile;
