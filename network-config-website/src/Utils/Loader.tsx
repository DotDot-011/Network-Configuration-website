import React, {ChangeEvent, useState} from 'react';
import {Modal} from 'react-bootstrap'
import "./Loader.css"

type  AvailableDevice = "cisco_ios" | "dell_os6" | "huawei" | "zyxel_os"

interface props{
    isShow : boolean
}

function Loader(props: props) {

  return (
    <>
        <Modal show={props.isShow} id='LoaderModal' >

            <Modal.Body ><div className="loader"></div></Modal.Body>
      </Modal>
    </>
  );
}

export default Loader;
