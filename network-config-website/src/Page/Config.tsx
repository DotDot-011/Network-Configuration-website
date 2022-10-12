import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import logo from '../logo.svg';
import MyNavbar from '../Utils/Navbar';
import RepoList from '../Utils/Repolist';
import './Config.css'
import GetConfigModal from '../Utils/GetConfigModal';
import {GetFile, GetFilePath} from '../API/API'

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

interface AccessPoint{
    device_type : AvailableDevice | undefined;
    host : string | undefined;
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

    return (
        <div>
            <MyNavbar></MyNavbar>
            <div className='content'>
                <RepoList Repositories = {['RepoTest01', 'RepoTest02']}></RepoList>
                <div className="Config-menu">
                <header className="Config-menu-header">
                    <h1>Host: {host}</h1>
                    <h1>Device: {device}</h1>
                    
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
