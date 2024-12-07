// Utility to get token from local storage
export function getToken() {
    return localStorage.getItem('token');
}

// Add to history
export async function addToHistory(queryString) {
    const token = getToken(); // Get the JWT token

    try {
        const response = await fetch('http://localhost:5000/api/user/history', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: queryString }),
        });

        const data = await response.json();
        if (response.ok) {
            return data.history; // Return the updated history from the server
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error adding to history:', error);
    }

    return []; // Return an empty array if there was an error
}

// Get favourites
export function getFavourites() {
    const favourites = localStorage.getItem('favourites');
    return favourites ? JSON.parse(favourites) : [];
}

// Get history
export function getHistory() {
    const history = localStorage.getItem('history');
    return history ? JSON.parse(history) : [];
}

// Add other utility functions as needed
