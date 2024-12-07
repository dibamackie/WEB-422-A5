import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store'; 
import { useRouter } from 'next/router';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import styles from '@/styles/History.module.css';
import { useEffect, useState } from 'react';
import { getHistory, removeFromHistory } from '../utils/userData'; 

export default function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState([]);

  // Fetch search history from the server
  useEffect(() => {
    const fetchSearchHistory = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/user/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setSearchHistory(data.history); // Update the searchHistory from fetched data
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };

    fetchSearchHistory();
  }, []);

  // Parse the search history
  let parsedHistory = [];
  searchHistory.forEach(h => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  // Function to navigate to a search query
  const historyClicked = (e, index) => {
    router.push(`/artwork?${searchHistory[index]}`);
  };

  // Function to remove an item from search history
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // Prevent other event propagation

    // Remove from backend
    const updatedHistory = await removeFromHistory(searchHistory[index]);
    setSearchHistory(updatedHistory);
  };

  // Corrected return statement
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
