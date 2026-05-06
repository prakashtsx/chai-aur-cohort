import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jokes, setJokes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cleanOnly, setCleanOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://api.freeapi.app/api/v1/public/randomjokes?page=${page}`)
      .then((response) => response.json())
      .then((result) => {
        setJokes(result.data.data);
        setTotalPages(result.data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch jokes");
        setLoading(false);
      });
  }, [page]);

  const changePage = (newPage) => {
    setLoading(true);
    setError("");
    setPage(newPage);
  };

  const visibleJokes = cleanOnly
    ? jokes.filter((joke) => !joke.categories.includes("explicit"))
    : jokes;

  return (
    <main className="app">
      <section className="header">
        <p>Random Jokes API</p>
        <h1>Jokes Viewer</h1>
      </section>

      <section className="controls">
        <button onClick={() => changePage(page - 1)} disabled={page === 1}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>

        <label>
          <input
            type="checkbox"
            checked={cleanOnly}
            onChange={() => setCleanOnly(!cleanOnly)}
          />
          Clean jokes only
        </label>
      </section>

      {loading && <h2 className="message">Loading jokes...</h2>}
      {error && <h2 className="message error">{error}</h2>}

      {!loading && !error && (
        <section className="joke-list">
          {visibleJokes.length === 0 ? (
            <p className="empty">No clean jokes found on this page.</p>
          ) : (
            visibleJokes.map((joke) => (
              <article className="joke-card" key={joke.id}>
                <span>#{joke.id}</span>
                <p>{joke.content}</p>
                <small>
                  {joke.categories.length > 0
                    ? joke.categories.join(", ")
                    : "general"}
                </small>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default App;
