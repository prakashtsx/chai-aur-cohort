import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://api.freeapi.app/api/v1/public/meals?page=${page}`)
      .then((response) => response.json())
      .then((result) => {
        setMeals(result.data.data);
        setTotalPages(result.data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch meals");
        setLoading(false);
      });
  }, [page]);

  const changePage = (newPage) => {
    setLoading(true);
    setError("");
    setPage(newPage);
  };

  const getIngredients = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 5; i++) {
      const ingredient = meal[`strIngredient${i}`];

      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    return ingredients;
  };

  return (
    <main className="app">
      <section className="header">
        <p>Meals API</p>
        <h1>Meals Listing</h1>
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
      </section>

      {loading && <h2 className="message">Loading meals...</h2>}
      {error && <h2 className="message error">{error}</h2>}

      {!loading && !error && (
        <section className="meal-list">
          {meals.map((meal) => (
            <article className="meal-card" key={meal.idMeal}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />

              <div className="meal-info">
                <div className="meal-tags">
                  <span>{meal.strCategory}</span>
                  <span>{meal.strArea}</span>
                </div>

                <h2>{meal.strMeal}</h2>
                <p>{meal.strInstructions}</p>

                <div className="ingredients">
                  {getIngredients(meal).map((ingredient) => (
                    <span key={ingredient}>{ingredient}</span>
                  ))}
                </div>

                {meal.strYoutube && (
                  <a href={meal.strYoutube} target="_blank">
                    Watch Recipe
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
