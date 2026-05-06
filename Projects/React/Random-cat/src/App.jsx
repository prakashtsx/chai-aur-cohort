import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCat = () => {
    setLoading(true);
    setError("");

    fetch("https://api.freeapi.app/api/v1/public/cats/cat/random")
      .then((response) => response.json())
      .then((result) => {
        setCat(result.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch cat");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch("https://api.freeapi.app/api/v1/public/cats/cat/random")
      .then((response) => response.json())
      .then((result) => {
        setCat(result.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch cat");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <div className="cat-card">
        <h1>Random Cat Viewer</h1>

        {loading && <p className="message">Loading cat...</p>}
        {error && <p className="message error">{error}</p>}

        {cat && !loading && (
          <>
            <img src={cat.image} alt={cat.name} />
            <h2>{cat.name}</h2>
            <p className="origin">Origin: {cat.origin}</p>
            <p>{cat.description}</p>
            <p className="temperament">{cat.temperament}</p>
          </>
        )}

        <button onClick={fetchCat} disabled={loading}>
          {loading ? "Fetching..." : "Show New Cat"}
        </button>
      </div>
    </div>
  );
}

export default App;
