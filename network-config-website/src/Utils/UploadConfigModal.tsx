import { stat } from 'fs';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import Highlight from 'react-highlight';
import { AnalyzConfig } from '../API/API';
import "./UploadConfigModal.css";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

interface props{
    isShow : boolean
    host : string | undefined
    device : AvailableDevice
    config : string
    AnalyzeResult : any
    handleClose : (() => void)
    handleShow : (() => void)
    handleConfirm : (() => void)
    handlePortChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handleFileChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handleUsernameChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handlePasswordChange : ((e : React.ChangeEvent<HTMLInputElement>) => void)
}

function UploadConfigModal(props: props) {

    const dangerStatus = 0
    const okayStatus = 2
    const warningStatus = 1

    function isObjectEmpty(obj : object){
        return JSON.stringify(obj) === "{}";
    }
    function GenerateBullet(data: any, status: number){
        if(Array.isArray(data)){
            if(!haveStatus(data, status))
            {
                return
            }
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

        if(typeof data === 'object' && haveStatus(data, status)){
            // console.log(data)
            return(
                <>
                    {Object.keys(data).map((key) => {
                        if(!haveStatus(data[key], status))
                        {
                            return
                        }
                        return (
                        <>
                            <li id = {key} onClick={(e) => {

                                const element = document.getElementById(key + "Children");
                                if(element !== null)
                                {
                                    if(element.style.display === "block" || element.style.display === "")
                                    {
                                        element.style.display = "none"
                                    }
                                    else
                                    {
                                        element.style.display = "block"
                                    }
                                    
                                }

                                console.log(element)
                            }}><button className="Parent btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{key}</button></li>
                            <ul id={key + "Children"} className={"Children"}>{GenerateBullet(data[key], status)}</ul>
                        </>
                        )
                    })}
                </>
            )
        }
        
        else{
            return
        }
        
        return <li>{data}</li>
    }

    function haveStatus(data: any, status: number): boolean{
        if(Array.isArray(data)){
            if(data[0] === status)
            {
                return true
            }

            return false
        }
        
        if(typeof data === 'object'){
            const result: boolean = Object.keys(data).reduce((accumulator, currentValue : string) => 
            {
                return haveStatus(data[currentValue], status) || accumulator
            }, false)
            
            return result
        }

        return false
    }

    function countStatus(data: any, status: number){
        if(Array.isArray(data)){
            if(data[0] === status)
            {
                
                return 1
            }

            return 0
        }

        if(typeof data === 'object'){
            const result: number = Object.keys(data).reduce((accumulator, currentValue:string) => 
            {
                // console.log(countStatus(data[currentValue], status) + accumulator)
                return countStatus(data[currentValue], status) + accumulator
            }, 0)
            return result
        }

        return 0
    }

    function handleClickDangerSummary(){
        const element = document.getElementById("DangerResult")
        if(element !== null)
        {
            if(element.style.display === "none" || element.style.display === "")
            {
                element.style.display = "block"
            }

            else {
                element.style.display = "none"
            }
        }
    }

    function handleClickWarningSummary(){
        const element = document.getElementById("WarningResult")
        if(element !== null)
        {
            if(element.style.display === "none" || element.style.display === "")
            {
                element.style.display = "block"
            }

            else {
                element.style.display = "none"
            }
        }
    }

    function handleClickOkaySummary(){
        const element = document.getElementById("OkayResult")
        if(element !== null)
        {
            if(element.style.display === "none" || element.style.display === "")
            {
                element.style.display = "block"
            }

            else {
                element.style.display = "none"
            }
        }
    }
  return (
    <>
        <Modal show={props.isShow} onHide={props.handleClose} onChange={props.handleFileChange}>
            <Modal.Header closeButton>
            <Modal.Title>กรอกข้อมูล Upload</Modal.Title>
            </Modal.Header>
            <Modal.Body><input type="file" name="file" />
            {/* <ul>
            {GenerateBullet(props.AnalyzeResult)}
            </ul> */}
            {!isObjectEmpty(props.AnalyzeResult)?<div>
                <Pie data = {{
                    labels:["Danger", "Warning", "Okay"],
                    datasets: [
                        {
                        label: "#",
                        data: [countStatus(props.AnalyzeResult, dangerStatus), countStatus(props.AnalyzeResult, warningStatus), countStatus(props.AnalyzeResult, okayStatus)],
                        backgroundColor: ["red", "yellow", "green"],
                        }
                    ]
                }}></Pie>
            </div>:<></>}
            
            <div onClick={handleClickDangerSummary} className="card border-left-danger shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                Danger Count : </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{countStatus(props.AnalyzeResult, dangerStatus)}</div>
                                        </div>
                                    </div>
                                </div>
            </div>
            <ul id = "DangerResult" className= 'AnalyzeResult'>
            {GenerateBullet(props.AnalyzeResult, dangerStatus)}
            </ul>
            <div onClick={handleClickWarningSummary} className="card border-left-warning shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                            Warning Count : </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{countStatus(props.AnalyzeResult, warningStatus)}</div>
                                        </div>
                                    </div>
                                </div>
            </div>
            <ul id = "WarningResult" className= 'AnalyzeResult'>
            {GenerateBullet(props.AnalyzeResult, warningStatus)}
            </ul>
            <div onClick={handleClickOkaySummary} className="card border-left-success shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Okay Count : </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{countStatus(props.AnalyzeResult, okayStatus)}</div>
                                        </div>
                                    </div>
                                </div>
            </div>
            <ul id = "OkayResult" className= 'AnalyzeResult'>
            {GenerateBullet(props.AnalyzeResult, okayStatus)}
            </ul>
            {/* <Highlight className="json">{JSON.stringify(props.AnalyzeResult, null, 4)}</Highlight> */}
            </Modal.Body>
            <Modal.Footer>
            <Form className='DeviceInput'>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextHost">
                    <Form.Label column sm="2">
                    Host
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={props.host} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextDevice">
                    <Form.Label column sm="2">
                    Device
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={props.device} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
                    <Form.Label column sm="2">
                    Username
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={(e : React.ChangeEvent<HTMLInputElement>) => {props.handleUsernameChange(e)}} type="input" placeholder="Enter Username" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                    <Form.Label column sm="2">
                    Password
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={(e : React.ChangeEvent<HTMLInputElement>) => {props.handlePasswordChange(e)}} type="password" placeholder="Password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBasicPort">
                    <Form.Label column sm="2">
                    Port
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={(e : React.ChangeEvent<HTMLInputElement>) => {props.handlePortChange(e)}} type="input" value={22} />
                    </Col>
                </Form.Group>

                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.handleConfirm}>
                    Confirm
                </Button>
            </Form>
            
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UploadConfigModal;
