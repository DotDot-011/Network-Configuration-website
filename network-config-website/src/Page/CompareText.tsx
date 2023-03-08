import React, { useState, useEffect } from 'react';
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { useParams, } from 'react-router-dom';
import Highlight from 'react-highlight';
import { GetFileConfig, GetRepoNames, AnalyzConfig} from '../API/API';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import "./CompareText.css";

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
    const [oldAnalyzeResult, setOldAnalyzeResult] = useState()
    const [newAnalyzeResult, setNewAnalyzeResult] = useState()

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

    useEffect(() => {
        downloadOldAnalyzeFile()
    }, [oldFileData])

    useEffect(() => {
        downloadNewAnalyzeFile()
    }, [newFileData])

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

    async function downloadNewAnalyzeFile() {

        const username = localStorage.getItem("username")
        if(username !== null)
        {
            const newFileResponse = await AnalyzConfig(username, newFileData)

            setNewAnalyzeResult(newFileResponse.data)
        }


    }

    async function downloadOldAnalyzeFile() {

        const username = localStorage.getItem("username")
        if(username !== null)
        {
            const oldFileResponse = await AnalyzConfig(username, oldFileData)

            setOldAnalyzeResult(oldFileResponse.data)
        }

    }

    function GenerateBullet(data: any){
        if(Array.isArray(data)){
            if (data[0] === 2)
            {
                return (
                    <>
                        <li className='okay'>{data[1]}</li>
    
                    </>
                    )
            }
            if (data[0] === 1)
            {
                return (
                    <>
                        <li className='warning'>{data[1]}</li>
                        <li>{data[2]}</li>
    
                    </>
                    )
            }
            
            if (data[0] === 0)
            {
                return (
                <>
                    <li className='danger'>{data[1]}</li>
                    <li>{data[2]}</li>
                </>
                )
            }

            return (
                <>
                    <li>{data[1]}</li>
                </>
                )
            
        }

        if(typeof data === 'object'){
            console.log(data)
            return(
                <>
                    {Object.keys(data).map((key) => {
                        return (
                        <>
                            <li id = {key}>{key}</li>
                            <ul id={key + "Children"}>{GenerateBullet(data[key])}</ul>
                        </>
                        )
                    })}
                </>
            )
        }
        
        return <li>{data}</li>
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
                <div id = "AnalyzeCompare">
                    <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>{oldFileName}</th>
                            <th>{newFileName}</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td>
                                <ul>
                                {GenerateBullet(oldAnalyzeResult)}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                {GenerateBullet(newAnalyzeResult)}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                    </table>
              
                </div>
            
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
      </div>
    )
}
 
export default CompareCode;
{/* <tr><td colspan="3" class="css-17uc4if-title-block"><pre class="css-o1u8iu-content-text">EnableSnmp</pre></td><td colspan="3" class="css-17uc4if-title-block"><pre class="css-o1u8iu-content-text">demofile2.txt</pre></td></tr> */}