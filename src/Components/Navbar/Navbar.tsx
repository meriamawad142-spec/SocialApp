
import  { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Navbar() {
  const { userToken, setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    navigate("/login");
  }

  return (
    <nav className="bg-gray-950 text-white px-10 py-5 flex items-center justify-between border-b border-gray-800">
      <h1 className="text-2xl font-bold tracking-wide">
        My<span className="text-blue-500">App</span>
      </h1>

      <div className="flex items-center gap-8">
        {userToken ? (
          <>
            <Link
              to="/"
              className="text-gray-300 hover:text-blue-400 transition duration-200"
            >
              Home
            </Link>

            <Link
              to="/profile"
              className="text-gray-300 hover:text-blue-400 transition duration-200"
            >
              Profile
            </Link>

            <button
              className="text-gray-300 hover:text-red-400 transition duration-200 cursor-pointer"
              onClick={logout}
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-blue-400 transition duration-200"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition duration-200 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

