import { Link, useNavigate } from "react-router-dom";
import useUser from "./useUser";
import AccountSettings from "./AccountSettings";

export default function NavBar() {
  const navigate = useNavigate();
  const { isLoading, user } = useUser();

  return (
    <>
      <nav>
        <Link to="/">Home</Link>

        <Link to="/about">About</Link>

        <Link to="/articles">Articles</Link>
        <AccountSettings />
      </nav>
   
    </>
  );
}
