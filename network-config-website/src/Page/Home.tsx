import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import '../App.css';
import './Home.css'
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import { isPropertySignature } from 'typescript';
import { GetRepoNames } from '../API/API';
import { MDBContainer } from "mdbreact";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement);
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

    const data = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          datasets: [
            {
              label: "test #",
              data: [2, 5, 6, 7, 3],
              backgroundColor: ["blue", "green", "yellow", "pink", "orange"],
            }
          ]
      }

      const option = {
        title:{display:true,text:'Average Rainfall per month',fontSize:20},
                            legend:{display:true, position:'right'}
      }
    return (
        <div>
            <MyNavbar></MyNavbar>
            
                
                <div id="wrapper">
                    <RepoList Repositories = {repositories.map((repository) => {
                    const repo: RepoTag = {repositoryId: repository.repositoryId, repositoryName: repository.repositoryName};
                    return repo
                    })}></RepoList>
                    <div id="page-content-wrapper">
                    <Doughnut width={"30%"}
                        data={data}
                        />
                    {/* <header className="App-header">
                        
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
                    </header> */}
                    </div>
                </div>
            
        </div>
    );
}

export default Home;
