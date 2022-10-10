import React from 'react';
import {Navbar, Container} from 'react-bootstrap'

function MyNavbar() {
  return (
    <>
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand >Home</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Brand >Signed out</Navbar.Brand>
                </Navbar.Collapse >
            </Container>
        </Navbar>
    </>
  );
}

export default MyNavbar;
