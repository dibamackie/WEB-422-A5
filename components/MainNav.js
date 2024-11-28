import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store'; // Adjust the path if necessary
import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';

function MainNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchField = e.target.elements.search.value;
    const queryString = `title=true&q=${searchField}`;

    // Add the search to the search history
    setSearchHistory(current => [...current, queryString]);

    // Redirect to the artwork page with the query string
    router.push(`/artwork?${queryString}`);
    setIsExpanded(false); // Collapse the Navbar after submitting
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
            <Nav.Link href="/favourites" active={router.pathname === "/favourites"} onClick={() => setIsExpanded(false)}>
              Favourites
            </Nav.Link>
          </Nav>

          &nbsp;
          <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control type="text" name="search" placeholder="Search" className="me-2" />
            <Button className='me-3' type="submit" variant="outline-light">Search</Button>
          </Form>
          &nbsp;

          {/* User Dropdown Nav */}
          <Nav className="ms-auto">
            <NavDropdown title="User Name" id="user-dropdown">
              {/* Favourites Link */}
              <NavDropdown.Item as="span" active={router.pathname === "/favourites"}>
                <Link href="/favourites" passHref>
                  <a className="dropdown-item" onClick={() => setIsExpanded(false)}>Favourites</a>
                </Link>
              </NavDropdown.Item>

              {/* Search History Link */}
              <NavDropdown.Item as="span" active={router.pathname === "/history"}>
                <Link href="/history" passHref>
                  <a className="dropdown-item" onClick={() => setIsExpanded(false)}>Search History</a>
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <br />
    </>
  );
}

export default MainNav;
