import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store'; 
import { useRouter } from 'next/router';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import styles from '@/styles/History.module.css';

export default function History() {
  // Step 1: Get the search history from Jotai atom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // Step 2: Parse the search history into an array of objects
  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  // Step 3: Define the functions for handling clicks
  const router = useRouter();

  // Function to navigate to a search query
  const historyClicked = (e, index) => {
    router.push(`/artwork?${searchHistory[index]}`);
  };

  // Function to remove an item from search history
  const removeHistoryClicked = (e, index) => {
    e.stopPropagation(); // Prevent other event propagation
    setSearchHistory(current => {
      let x = [...current];
      x.splice(index, 1);
      return x;
    });
  };

  return (
    <Container>
      <h1 className="my-4">Search History</h1>
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here. Try searching for some artwork.</h4>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={(e) => historyClicked(e, index)}
              className={styles.historyListItem}
            >
              {/* Render all properties of the historyItem */}
              {Object.keys(historyItem).map(key => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button 
                className="float-end" 
                variant="danger" 
                size="sm" 
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
