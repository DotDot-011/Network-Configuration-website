import React, {ChangeEvent, useState} from 'react';
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import Highlight from 'react-highlight';
import { AnalyzConfig } from '../API/API';
import "./UploadConfigModal.css";

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

    function GenerateBullet(data: any){
        if(Array.isArray(data)){
            if (data[0] == 2)
            {
                return (
                    <>
                        <li className='okay'>{data[1]}</li>
    
                    </>
                    )
            }
            if (data[0] == 1)
            {
                return (
                    <>
                        <li className='warning'>{data[1]}</li>
                        <li>{data[2]}</li>
    
                    </>
                    )
            }
            
            if (data[0] == 0)
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
                            <li>{key}</li>
                            <ul>{GenerateBullet(data[key])}</ul>
                        </>
                        )
                    })}
                </>
            )
        }
        
        return <li>{data}</li>
    }

  return (
    <>
        <Modal show={props.isShow} onHide={props.handleClose} onChange={props.handleFileChange}>
            <Modal.Header closeButton>
            <Modal.Title>กรอกข้อมูล Upload</Modal.Title>
            </Modal.Header>
            <Modal.Body><input type="file" name="file" />
            <ul>
            {GenerateBullet(props.AnalyzeResult)}
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
