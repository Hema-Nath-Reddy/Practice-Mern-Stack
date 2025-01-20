import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import "./App.css";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import ArticlesListPage from "./pages/ArticlesListPage";
import Layout from "./Layout";
import ArticlePage from "./pages/ArticlePage";
import NotPageFound from "./pages/NotPageFound";
import { loader as articleLoader } from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotPageFound />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/articles",
        element: <ArticlesListPage />,
      },
      {
        path: "/articles/:name",
        element: <ArticlePage />,
        loader: articleLoader,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/create-account",
        element: <CreateAccountPage />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
