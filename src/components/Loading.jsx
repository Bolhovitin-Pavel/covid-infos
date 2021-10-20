import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function Loading() {
    
    return (
        <Container fluid>
            <Row className="justify-content-center">
            <Col md="auto">
                <div className="lds-facebook justify-content-center"><div></div><div></div><div></div></div>
            </Col>
            </Row>

            <Row className="justify-content-center">
            <Col md="auto">
                <h1>Loading</h1>
            </Col>
            </Row>
        </Container>
    );
}
