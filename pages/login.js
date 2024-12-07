import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store'; 
import { getFavourites, getHistory } from '../utils/userData';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to home if the user is already logged in
      router.push('/');
    }
  }, []);

  async function updateAtoms() {
    try {
      setFavouritesList(await getFavourites());
      setSearchHistory(await getHistory());
    } catch (error) {
      console.error('Error updating atoms:', error);
    }
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store the JWT token in local storage
        localStorage.setItem('token', data.token);

        // Update atoms with user data
        await updateAtoms();

        // Redirect to the homepage or any other secured page
        router.push('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={loginUser}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </Container>
  );
}
