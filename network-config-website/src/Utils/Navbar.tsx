import React from 'react';
import {Navbar, Container} from 'react-bootstrap'

function MyNavbar() {
  return (
    <>
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href='/home'>Home</Navbar.Brand>
                <Navbar.Brand href='/createRepo'>Create Repository</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Brand href='/login'>Signed out</Navbar.Brand>
                </Navbar.Collapse >
            </Container>
        </Navbar>
    </>
  );
}

export default MyNavbar;
