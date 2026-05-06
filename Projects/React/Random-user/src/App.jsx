import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.freeapi.app/api/v1/public/randomusers")
      .then((response) => response.json())
      .then((result) => {
        setUsers(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 className="message">Loading users...</h2>;
  }

  if (error) {
    return <h2 className="message error">{error}</h2>;
  }

  return (
    <div className="app">
      <h1>Random Users</h1>

      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <img src={user.picture.large} alt={user.name.first} />

            <h2>
              {user.name.first} {user.name.last}
            </h2>

            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>
              {user.location.city}, {user.location.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
