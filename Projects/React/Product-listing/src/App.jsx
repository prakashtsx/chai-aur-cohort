import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://api.freeapi.app/api/v1/public/randomproducts";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const firstResponse = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!firstResponse.ok) {
          throw new Error("Could not fetch products. Please try again.");
        }

        const firstResult = await firstResponse.json();
        const firstPage = firstResult?.data;
        const firstProducts = firstPage?.data ?? [];
        const totalPages = firstPage?.totalPages ?? 1;

        const remainingRequests = Array.from(
          { length: Math.max(totalPages - 1, 0) },
          (_, index) =>
            fetch(`${API_URL}?page=${index + 2}`, {
              signal: controller.signal,
            }).then((response) => {
              if (!response.ok) {
                throw new Error("Could not fetch all products.");
              }

              return response.json();
            }),
        );

        const remainingResults = await Promise.all(remainingRequests);
        const remainingProducts = remainingResults.flatMap(
          (result) => result?.data?.data ?? [],
        );

        setProducts([...firstProducts, ...remainingProducts]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <main className="product-page">
      <section className="page-header">
        <p className="eyebrow">FreeAPI Store</p>
        <h1>Product Listing</h1>
        <p className="intro">
          Browse products fetched live from the FreeAPI random products API.
        </p>
      </section>

      {loading && (
        <section className="status-panel">
          <span className="loader" aria-hidden="true"></span>
          <p>Loading products...</p>
        </section>
      )}

      {error && !loading && (
        <section className="status-panel error-panel">
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>
          <div className="list-summary">
            <span>{products.length} products found</span>
          </div>

          <section className="products-grid">
            {products.map((product) => {
              const finalPrice = Math.round(
                product.price -
                  (product.price * product.discountPercentage) / 100,
              );

              return (
                <article className="product-card" key={product.id}>
                  <div className="image-wrap">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                    />
                    <span className="discount">
                      {Math.round(product.discountPercentage)}% off
                    </span>
                  </div>

                  <div className="product-info">
                    <div className="meta-row">
                      <span>{product.brand}</span>
                      <span>{product.category}</span>
                    </div>

                    <h2>{product.title}</h2>
                    <p className="description">{product.description}</p>

                    <div className="product-footer">
                      <div>
                        <span className="price">${finalPrice}</span>
                        <span className="old-price">${product.price}</span>
                      </div>
                      <span className="rating">Star {product.rating}</span>
                    </div>

                    <p className="stock">{product.stock} items in stock</p>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
