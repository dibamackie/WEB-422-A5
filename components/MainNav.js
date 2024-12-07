import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { addToHistory } from '../utils/userData'; // Import addToHistory function

function MainNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchField = e.target.elements.search.value;
    const queryString = `title=true&q=${searchField}`;

    console.log('Submitting search:', queryString);

    try {
      // Add the search to the search history
      const updatedHistory = await addToHistory(queryString);
      console.log('Updated History:', updatedHistory);
      setSearchHistory(updatedHistory);

      // Redirect to the artwork page with the query string
      router.push(`/artwork?${queryString}`);
      setIsExpanded(false); // Collapse the Navbar after submitting
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const handleNavigation = (path) => {
    setIsExpanded(false); // Collapse the Navbar after clicking
    router.push(path); // Navigate to the specified path
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsAuthenticated(false);
    handleNavigation('/');
  };

  return (
    <>
      <Navbar expanded={isExpanded} expand="lg" className="fixed-top navbar-dark bg-primary">
        <Navbar.Toggle
          onClick={() => setIsExpanded(!isExpanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Brand className='ms-3'>Diba Makki</Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" active={router.pathname === "/"} onClick={() => setIsExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link href="/search" active={router.pathname === "/search"} onClick={() => setIsExpanded(false)}>
              Advanced Search
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link href="/favourites" active={router.pathname === "/favourites"} onClick={() => setIsExpanded(false)}>
                  Favourites
                </Nav.Link>
                <Nav.Link href="/history" active={router.pathname === "/history"} onClick={() => setIsExpanded(false)}>
                  Search History
                </Nav.Link>
              </>
            )}
          </Nav>

          &nbsp;
          <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control type="text" name="search" placeholder="Search" className="me-2" />
            <Button className='me-3' type="submit" variant="outline-light">Search</Button>
          </Form>
          &nbsp;

          {/* User Dropdown Nav */}
          <Nav className="ms-auto">
            {!isAuthenticated && (
              <>
                <Nav.Link href="/login" onClick={() => setIsExpanded(false)}>
                  Login
                </Nav.Link>
                <Nav.Link href="/register" onClick={() => setIsExpanded(false)}>
                  Register
                </Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <NavDropdown title="User Name" id="user-dropdown">
                <NavDropdown.Item
                  onClick={() => handleNavigation('/favourites')}
                  active={router.pathname === "/favourites"}
                >
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleNavigation('/history')}
                  active={router.pathname === "/history"}
                >
                  Search History
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <br />
    </>
  );
}

export default MainNav;
