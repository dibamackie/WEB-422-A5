import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store'; // Import atoms
import { getFavourites, getHistory } from '../utils/userData'; // Import functions to get data from storage

export default function RouteGuard({ children }) {
  const router = useRouter();
  
  // Reference atoms for favorites and search history
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  
  useEffect(() => {
    const authCheck = () => {
      const publicPaths = ['/', '/login', '/register'];
      const path = router.asPath.split('?')[0];
      const token = localStorage.getItem('token');

      // Redirect to login if not authenticated
      if (!token && !publicPaths.includes(path)) {
        router.push('/login');
      }
    };

    // Update the atoms for favorites and history when RouteGuard mounts
    const updateAtoms = async () => {
      const favourites = await getFavourites();
      const history = await getHistory();
      setFavouritesList(favourites);
      setSearchHistory(history);
    };

    // Call both authCheck and updateAtoms on mount
    authCheck();
    updateAtoms();

    // Check authentication on route change
    const handleRouteChange = () => authCheck();
    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup listener
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, setFavouritesList, setSearchHistory]);

  return <>{children}</>;
}
