import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Error from 'next/error';
import { addToFavourites, removeFromFavourites } from '../utils/userData';

function ArtworkCardDetail({ objectID }) {
  // Get the favourites list and setFavouritesList function from Jotai atom
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  
  // Track whether the artwork is in the favourites list
  const [showAdded, setShowAdded] = useState(false);

  // Use effect to update the showAdded state
  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  // Function to handle adding/removing from favourites
  const favouritesClicked = async () => {
    if (showAdded) {
      // Remove the artwork from favourites and update state
      setFavouritesList(await removeFromFavourites(objectID));
    } else {
      // Add the artwork to favourites and update state
      setFavouritesList(await addToFavourites(objectID));
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
