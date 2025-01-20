import { useState } from "react";
import useUser from "./useUser";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export default function AccountSettings() {
  const { isLoading, user } = useUser();
  const [visibility, setVisibility] = useState(false);
  const navigate = useNavigate();
  const handleMouseEnter = () => setVisibility(true);
  const handleMouseLeave = () => setVisibility(false);
  const handleCreateArticleClicked = () => {
    if (!user) {
      alert("Please sign in to create an article");
      navigate("/login");
    } else {
      navigate("/create-article");
    }
  };
  return (
    <div
      className="container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inner">
        {visibility &&
          (user ? (
            <button
              onClick={() => {
                signOut(getAuth());
                navigate("/");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </svg>
              Sign Out
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
              </svg>
              Sign In
            </button>
          ))}
        {visibility && user && <p>{user?.email.substring(0, 22)}...</p>}
      </div>

      <div className="settings">
        <hr></hr>
        {user ? (
          <p className="settings">{user.displayName}</p>
        ) : (
          <p className="settings">Account settings</p>
        )}
      </div>
    </div>
  );
}
