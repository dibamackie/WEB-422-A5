import Card from 'react-bootstrap/Card';
import useSWR from 'swr';
import Error from 'next/error';

function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      <Card.Img variant="top" src={data.primaryImageSmall || "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"} />
      <Card.Body>
        <Card.Title>{data.title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Artist:</strong> {data.artistDisplayName || "N/A"} <br />
          <strong>Date:</strong> {data.objectDate || "N/A"} <br />
          <strong>Medium:</strong> {data.medium || "N/A"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ArtworkCard;
