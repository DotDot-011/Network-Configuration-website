import React, { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { useParams, } from 'react-router-dom';
import Highlight from 'react-highlight';
import { GetFile, GetFileConfig, GetRepoNames} from '../API/API';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';

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

interface File{
    fileId: number;
    fileName: string;
    fileTimestamp: Date;
    fileOwnerName: string;
    fileType: string;
    fileRepositoryId: number;
    fileData: string
}

function CompareCode (){

    const {id} = useParams()
    const {fileid1} = useParams();
    const {fileid2} = useParams(); 

    const [repositories, setRepositories] = useState<Array<RepoInfo>>([])

    const [oldFile, setOldFile] = useState<File>();
    const [newFile, setNewFile] = useState<File>();
    const [oldFileName, setOldFileName] = useState("Version A");
    const [newFileName, setNewFileName] = useState("Version B");
    const [oldFileData, setOldFileData] = useState("");
    const [newFileData, setNewFileData] = useState("");

    useEffect(()=>{
        
        downloadFiles()
        DownloadRepoNames()
    }, [])

    useEffect(()=>{

        if(oldFile !== undefined)
        {
            setOldFileData(oldFile.fileData)
            setOldFileName(oldFile.fileName)
        }
        

    }, [oldFile])

    useEffect(()=>{

        if(newFile !== undefined)
        {
            setNewFileData(newFile.fileData)
            setNewFileName(newFile.fileName)
        }

    }, [newFile])

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

    async function downloadFiles() {

        if (fileid1 !== undefined && id !== undefined && fileid2 !== undefined){
            const username = localStorage.getItem("username")

            const response1 = await GetFileConfig(username, parseInt(fileid1))
            const response2 = await GetFileConfig(username, parseInt(fileid2))

            if(response1.data.fileTimestamp > response2.data.fileTimestamp)
            {
                setOldFile(response2.data)
                setNewFile(response1.data)
                return
            }

            setOldFile(response1.data)
            setNewFile(response2.data)

        }

    }

    const oldStr = ``
    
    const newStr = ``

    return (
        <div>
        <MyNavbar></MyNavbar>
        <div className='content'>
            <RepoList Repositories = {repositories.map((repository) => {
                        const repo: RepoTag = {repositoryId: repository.repositoryId, repositoryName: repository.repositoryName};
                        return repo
                })}></RepoList>
            <ReactDiffViewer
            oldValue={oldFileData}
            newValue={newFileData}
            splitView={true}
            compareMethod={DiffMethod.WORDS}
            leftTitle={oldFileName}
            rightTitle={newFileName}
            // renderContent={highlightSyntax}
            />
        </div>
      </div>
    )
}
 
export default CompareCode;