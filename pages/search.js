import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store'; 
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function AdvancedSearch() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const submitForm = (data) => {
    // Construct the query string
    let queryString = `searchBy=${data.searchBy}`;

    if (data.q) queryString += `&q=${data.q}`;
    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    if (data.isOnView) queryString += `&isOnView=true`;
    if (data.isHighlight) queryString += `&isHighlight=true`;

    // Add the search to the search history
    setSearchHistory(current => [...current, queryString]);

    // Redirect to /artwork with the query string
    router.push(`/artwork?${queryString}`);
  };

  return (
    <Container>
      <h1 className="my-4">Advanced Search</h1>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search Query</Form.Label>
              <Form.Control
                type="text"
                {...register("q")}
                placeholder="Enter your search term"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search By</Form.Label>
              <Form.Select {...register("searchBy")}>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="object">Object</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Geo Location</Form.Label>
              <Form.Control
                type="text"
                {...register("geoLocation")}
                placeholder='Case Sensitive String (e.g., "Europe", "Paris")'
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Medium</Form.Label>
              <Form.Control
                type="text"
                {...register("medium")}
                placeholder='Case Sensitive String (e.g., "Paintings", "Ceramics")'
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Highlighted"
            {...register("isHighlight")}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            {...register("isOnView")}
          />
        </Form.Group>

        <Button type="submit" variant="primary">Submit</Button>
      </Form>
    </Container>
  );
}
