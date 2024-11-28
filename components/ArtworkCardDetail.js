import { useState } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store'; // Adjust the path to store.js as needed
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Error from 'next/error';

function ArtworkCardDetail({ objectID }) {
  // Get the favourites list and setFavouritesList function from Jotai atom
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  
  // Track whether the artwork is in the favourites list
  const [showAdded, setShowAdded] = useState(favouritesList.includes(objectID));

  // Function to handle adding/removing from favourites
  const favouritesClicked = () => {
    if (showAdded) {
      // Remove the artwork from favourites
      setFavouritesList((current) => current.filter((fav) => fav !== objectID));
      setShowAdded(false);
    } else {
      // Add the artwork to favourites
      setFavouritesList((current) => [...current, objectID]);
      setShowAdded(true);
    }
  };

  // Use SWR to fetch data only if objectID is provided
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <Card>
      {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          {`Date: ${data.objectDate || 'N/A'}\nClassification: ${data.classification || 'N/A'}\nMedium: ${data.medium || 'N/A'}`}
        </Card.Text>
        <br /><br />
        {`Artist: ${data.artistDisplayName || 'N/A'}`}
        {data.artistDisplayName && <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer"> wiki</a>}
        <br />
        {`Credit Line: ${data.creditLine || 'N/A'}`}
        <br />
        {`Dimensions: ${data.dimensions || 'N/A'}`}
        <br /><br />

        {/* Favourites Button */}
        <Button 
          variant={showAdded ? "primary" : "outline-primary"} 
          onClick={favouritesClicked}
        >
          {showAdded ? "+ Favourite (added)" : "+ Favourite"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ArtworkCardDetail;
