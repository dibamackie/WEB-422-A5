import { useAtom } from 'jotai';
import { favouritesAtom } from '../store'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArtworkCard from '../components/ArtworkCard'; 
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from 'react';

export default function Favourites() {
  // Get the favourites list from Jotai atom
  const [favouritesList] = useAtom(favouritesAtom);

  // Ensure that favouritesList is loaded before rendering
  if (!favouritesList) return null;

  return (
    <Container>
      <h1 className="my-4">Favourites</h1>
      {favouritesList.length > 0 ? (
        <Row className="gy-4">
          {favouritesList.map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <h4>Nothing Here. Try adding some new artwork to the list.</h4>
      )}
    </Container>
  );
}
