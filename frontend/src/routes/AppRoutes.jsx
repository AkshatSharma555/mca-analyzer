import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';

// Hum yahan apne application ke saare routes (paths) define karte hain
const router = createBrowserRouter([
  {
    // Yeh hamara main layout hai
    element: <Layout />,
    // Is layout ke andar yeh child routes dikhenge
    children: [
      {
        path: '/', // Jab user root URL (/) par jaayega
        element: <HomePage />, // Toh HomePage component dikhao
      },
      // Aap yahan aage aur bhi routes add kar sakte hain, jaise:
      // { path: '/about', element: <AboutPage /> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;