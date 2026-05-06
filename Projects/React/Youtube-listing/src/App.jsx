import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.freeapi.app/api/v1/public/youtube/videos")
      .then((response) => response.json())
      .then((result) => {
        setVideos(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch videos");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 className="message">Loading videos...</h2>;
  }

  if (error) {
    return <h2 className="message error">{error}</h2>;
  }

  return (
    <div className="app">
      <h1>YouTube Videos</h1>

      <div className="video-list">
        {videos.map((video) => {
          const videoData = video.items;
          const snippet = videoData.snippet;
          const stats = videoData.statistics;

          return (
            <div className="video-card" key={videoData.id}>
              <div className="thumbnail-box">
                <img
                  src={snippet.thumbnails.high.url}
                  alt={snippet.title}
                />
                <span className="quality">
                  {videoData.contentDetails.definition}
                </span>
              </div>

              <div className="video-info">
                <h2>{snippet.title}</h2>
                <p className="channel">{snippet.channelTitle}</p>
                <p className="description">{snippet.description}</p>

                <div className="video-stats">
                  <span>{Number(stats.viewCount).toLocaleString()} views</span>
                  <span>{Number(stats.likeCount).toLocaleString()} likes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
