import { useEffect, useState } from "react";
import "./Quotes.css";

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(
          "https://api.freeapi.app/api/v1/public/quotes?page=1&limit=10&query=human",
        );

        const data = await res.json();
        console.log(data);

        setQuotes(data.data.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quotes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <div className="quotes-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading inspiring quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quotes-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h1>Inspiring Quotes</h1>
        <p className="subtitle">Discover wisdom and motivation</p>
      </div>
      <div className="quotes-grid">
        {quotes.map((q) => (
          <div key={q._id} className="quote-card">
            <div className="quote-content">
              <svg
                className="quote-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-8.016 4-8 10.5 0 5.591 3 10 6 10zm12 0c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-6 0-8.016 4-8 10.5 0 5.591 3 10 6 10z" />
              </svg>
              <p className="quote-text">{q.content}</p>
            </div>
            <div className="quote-author">
              <span>— {q.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quotes;
