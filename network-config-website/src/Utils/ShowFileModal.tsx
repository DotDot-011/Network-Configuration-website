import React, {ChangeEvent} from 'react';
import {Modal, Button, Form, Row, Col} from 'react-bootstrap'
import Highlight from 'react-highlight';

interface props{
    isShow : boolean
    handleClose : (() => void)
    handleShow : (() => void)
    handleConfirm : (() => void)
    config : string
}

function ShowConfigModal(props: props) {
  return (
    <>
        <Modal show={props.isShow} onHide={props.handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextHost">
                    <Highlight className='cisco'>{props.config}</Highlight>
                </Form.Group>

                <Button variant="secondary" onClick={props.handleClose}>
                Close
                </Button>
                <Button variant="primary" onClick={props.handleConfirm}>
                    Save to Database
                </Button>
            </Form>
            
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowConfigModal;
