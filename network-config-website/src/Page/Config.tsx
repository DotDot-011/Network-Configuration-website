import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, } from 'react-router-dom';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import './Config.css'
import GetConfigModal from '../Utils/GetConfigModal';
import {GetFile, GetFilePath, GetRepoNames, GetFileNames} from '../API/API'
import FileTable from '../Utils/FileTable';
import PageNav from '../Utils/PageNav';

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

interface AccessPoint{
    device_type : AvailableDevice | undefined;
    host : string | undefined;
}

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

function Config() {

    const {id} = useParams();
    const {host} = useParams();
    const {device}= useParams(); 
    const device_type: AvailableDevice = device as AvailableDevice;

    const [isGetConfig, setIsGetConfig] = useState(false)
    const [Port, setPort] = useState("22")
    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")

    async function GetConfig(){
        const filename = await GetFilePath(device_type, host, Username, Password, id)
        console.log(filename)
        await GetFile(filename)
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [files, setFiles] = useState([])
    const totalPages = Math.ceil(files.length / 10);
    const [repositories, setRepositories] = useState<Array<RepoInfo>>([])

    useEffect(()=> {
        
        DownloadRepoNames()
        DownloadFileNames()
    }, [])

    useEffect(()=> {

        console.log(repositories)

    }, [repositories])

    async function DownloadFileNames(){

        const username = localStorage.getItem("username")
        if(id !== undefined)
        {
            const response = await GetFileNames(username, id)
            if(response.state === false)
            {
                alert(response.data)
                window.location.replace("/login")
            }

            console.log(response.data)
            setFiles(response.data)
        }
    }

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

    function UploadConfig(){
        console.log("Uploadconfig")
    }

    function handleShowGetConfig(){
        setIsGetConfig(true)
    }

    function handleCloseGetConfig(){
        setIsGetConfig(false)
    }

    function handleChangePort(event: React.ChangeEvent<HTMLInputElement>){
        setPort(event.target.value)
    }

    function handleChangeUsername(event: React.ChangeEvent<HTMLInputElement>){
        setUsername(event.target.value)
    }

    function handleChangePassword(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value)
    }

    function handlePageChange(page: number){
        setCurrentPage(page);
      };

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {repositories.map((repository) => {
                        const repo: RepoTag = {repositoryId: repository.repositoryId, repositoryName: repository.repositoryName};
                        return repo
                })}></RepoList>
                <div className="Config-menu">
                <header className="Config-menu-header">
                    <h1>Host: {host}</h1>
                    <h1>Device: {device}</h1>
                    <FileTable files={files} currentPage={currentPage} />
                    <PageNav totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                    <div className='Function-List'>
                        <Button onClick={handleShowGetConfig}>Get Config</Button>
                        <Button onClick={UploadConfig}>Upload Config</Button>
                    </div>
                    <GetConfigModal isShow={isGetConfig} host={host} device={device_type} handleClose={handleCloseGetConfig} handleShow={handleShowGetConfig} handleConfirm={GetConfig} handlePasswordChange={handleChangePassword} handleUsernameChange={handleChangeUsername} handlePortChange={handleChangePort}></GetConfigModal>
                </header>
                </div>
            </div>
        </div>
    );
}

export default Config;
