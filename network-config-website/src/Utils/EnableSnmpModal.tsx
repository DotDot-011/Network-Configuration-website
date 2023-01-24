import React, {ChangeEvent, useState} from 'react';
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import Highlight from 'react-highlight';

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

interface props{
    isShow : boolean
    host : string | undefined
    community : string
    device : AvailableDevice
    handleClose : (() => void)
    handleConfirm : (() => void)
    handleCommunityChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handlePortChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handleUsernameChange : ((e: React.ChangeEvent<HTMLInputElement>) => void)
    handlePasswordChange : ((e : React.ChangeEvent<HTMLInputElement>) => void)
}

function EnableSnmnpModal(props: props) {

  return (
    <>
        <Modal show={props.isShow} onHide={props.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
            <Modal.Footer>
            <Form>
                
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

                <Form.Group as={Row} className="mb-3" controlId="formBasicCommunity">
                    <Form.Label column sm="2">
                    Community
                    </Form.Label>
                    <Col sm="10">
                    <Form.Control onChange={(e : React.ChangeEvent<HTMLInputElement>) => {props.handleCommunityChange(e)}} type="input" placeholder="Enter Community" />
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

export default EnableSnmnpModal;
