import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Notfound from "./Pages/Notfound/Notfound";
import Profile from "./Pages/Profile/Profile";
import Register from "./Pages/Register/Register";
import CounterContextProvider from "./Context/CounterContext";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import  { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from './Pages/PostDetails/PostDetails';

const query = new QueryClient();
const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <Notfound />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <CounterContextProvider>
            <Toaster />
            <RouterProvider router={routes}></RouterProvider>
          </CounterContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
