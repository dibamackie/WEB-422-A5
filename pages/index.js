import { useState } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse'; // Bootstrap component to handle sliding

export default function Home() {
  const [open, setOpen] = useState(false); // State to control the visibility of the search form
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form action (which would cause a page reload)
    const searchValue = e.target.elements.search.value; // Get the value from the input field

    if (searchValue) {
      window.location.href = `/artwork?q=${searchValue}`; // Redirect to the artwork page with the query string
    }
  };

  return (
    <Container>
      <Collapse in={open}>
        <div id="search-collapse-text">
          <Form onSubmit={handleSearchSubmit} className="mb-4">
            <Form.Group>
              <Form.Control type="text" name="search" placeholder="Search for artworks..." />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Search
            </Button>
          </Form>
        </div>
      </Collapse>

      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg"
        fluid
        rounded
        className="my-4"
      />
      <Row>
        <Col md={6}>
          <p>
            The Metropolitan Museum of Art of New York City, colloquially known as "the Met", is the largest art museum in the Americas. Its permanent collection contains over two million works, divided among 17 curatorial departments.
          </p>
        </Col>
        <Col md={6}>
          <p>
            Visit the full description on{' '}
            <a href="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art" target="_blank" rel="noreferrer">
              Wikipedia
            </a>
            .
          </p>
        </Col>
      </Row>
    </Container>
  );
}
