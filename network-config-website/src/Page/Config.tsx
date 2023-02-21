import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, } from 'react-router-dom';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import './Config.css'
import GetConfigModal from '../Utils/GetConfigModal';
import {GetRepoNames, GetFileNames, GetConfig, UploadConfig, AnalyzConfig} from '../API/API'
import FileTable from '../Utils/FileTable';
import PageNav from '../Utils/PageNav';
import UploadConfigModal from '../Utils/UploadConfigModal';

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
    IsSnmpEnable: boolean
    SnmpCommunity: string
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
    const [config, setConfig] = useState("")
    const [isUploadConfig, setIsUploadConfig] = useState(false)
    const [toBeUploadedFile, setToBeUploadedFile] = useState<File>()
    const [toBeUploadedFileContent, setToBeUploadedFileContent] = useState("")

    const [isAnalizing, setIsAnalizing] = useState<boolean>(false)
    const [analyzeResult, setAnalyzeResult] = useState({})

    const [currentPage, setCurrentPage] = useState(1);
    const [files, setFiles] = useState([])
    const totalPages = Math.ceil(files.length / 10);
    const [repositories, setRepositories] = useState<Array<RepoInfo>>([])
    
    const [compareFile, SetCompareFile] = useState<Array<Array<string>>>([])
    
    let numberOfFile = compareFile.length

    useEffect(() => {
        
        DownloadRepoNames()
        DownloadFileNames()
    }, [])

    useEffect(()=> {

        console.log(compareFile)
        console.log(numberOfFile)
    }, [compareFile])

    useEffect(() => {
        setIsAnalizing(false)
        console.log(analyzeResult)
    }, [analyzeResult])

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

    function handleShowGetConfig(){
        setIsGetConfig(true)
    }

    function handleCloseGetConfig(){
        setIsGetConfig(false)
        setConfig("")
    }

    function handleShowUploadConfig(){
        setIsUploadConfig(true)
        setAnalyzeResult({})
    }

    function handleCloseUploadConfig(){
        setIsUploadConfig(false)
        setConfig("")
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

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>){

        if(event.target.files !== null)
        {
            const content = await event.target.files[0].text()
            console.log(event.target.files[0])
            setIsAnalizing(true)
            const response = await AnalyzConfig(localStorage.getItem("username") as string, content)
            setAnalyzeResult(response.data)
            setToBeUploadedFile(event.target.files[0])
            setToBeUploadedFileContent(content)
        }
    }

    async function handleConfirm(){
        
        const userId = localStorage.getItem("username")
        if(id !== undefined){
            const response = await GetConfig(device_type, host, Username, Password, userId, parseInt(id))
            setConfig(response.data)
            if(response.data !== undefined)
            {
                handleCloseUploadConfig()
            }
        }
        
    }

    function handleCheck(event: React.ChangeEvent<HTMLInputElement>){

        const filename = event.target.value
        console.log(filename[1])
        if(event.target.checked && numberOfFile == 2)
        {
            event.target.checked = false
            return
        }

        if(!event.target.checked)
        {
            
            const result = compareFile.filter((fileName)=>{return fileName[0] !== filename});
            SetCompareFile(result)
            return
        }

        const temp = [filename]
        SetCompareFile(compareFile.concat(temp))
        
    }

    async function handleUploadConfig(){

        console.log("upload")
        const userId = localStorage.getItem("username")
        if(toBeUploadedFile === undefined){
            alert("There is no file")
            return
        }

        if(isAnalizing){
            alert("Wait for Analizing")
            return
        }

        if(id !== undefined){
            const response = await UploadConfig(toBeUploadedFile.name, toBeUploadedFileContent,device_type, host, Username, Password, userId, parseInt(id))
            setConfig(response.data)
            handleCloseUploadConfig()
        }
    }

    function handleCompare(){
        if (numberOfFile !== 2)
        {
            alert("Please select 2 file for Comparing")
            return
        }
        
        window.location.assign('/Compare/' + id + "/" + compareFile[0] + "/" + compareFile[1])
        
    }

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
                    <FileTable files={files} currentPage={currentPage} checkHandle={handleCheck}/>
                    <PageNav totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                    <div className='Function-List'>
                        <Button onClick={handleShowGetConfig}>Get Config</Button>
                        <Button onClick={handleShowUploadConfig}>Upload Config</Button>
                        <Button onClick={handleCompare}>Compare</Button>
                    </div>
                    <GetConfigModal config={config} isShow={isGetConfig} host={host} device={device_type} handleClose={handleCloseGetConfig} handleShow={handleShowGetConfig} handleConfirm={handleConfirm} handlePasswordChange={handleChangePassword} handleUsernameChange={handleChangeUsername} handlePortChange={handleChangePort}></GetConfigModal>
                    <UploadConfigModal AnalyzeResult={analyzeResult} handleFileChange={handleFileChange} config={config} isShow={isUploadConfig} host={host} device={device_type} handleClose={handleCloseUploadConfig} handleShow={handleShowUploadConfig} handleConfirm={handleUploadConfig} handlePasswordChange={handleChangePassword} handleUsernameChange={handleChangeUsername} handlePortChange={handleChangePort}></UploadConfigModal>
                </header>
                </div>
            </div>
        </div>
    );
}

export default Config;
