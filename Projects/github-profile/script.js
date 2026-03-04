const form = document.getElementById("search-form");
const usernameInput = document.getElementById("username");
const profileContainer = document.getElementById("profile-container");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value;

    fetchUser(username);
});

async function fetchUser(username) {
    const res = await fetch(`https://api.github.com/users/${username}`);

    const data = await res.json();

    displayProfile(data);
}

function displayProfile(user) {
    profileContainer.innerHTML = `
  
    <div class="profile-card">

      <img src="${user.avatar_url}" width="120">

      <h2>${user.name}</h2>

      <p>@${user.login}</p>

      <p>${user.bio || "No bio available"}</p>

      <p>Followers: ${user.followers}</p>

      <p>Public Repos: ${user.public_repos}</p>

    </div>
  `;
}

function showContributionGraph(username) {
    const graph = document.getElementById("contribution-graph");
    graph.src = `https://ghchart.rshah.org/${username}`;
}
showContributionGraph(username);

function displayProfile(user) {
    profileContainer.innerHTML = `
  
  <div class="profile-card">

    <img src="${user.avatar_url}" width="120">

    <h2>${user.name}</h2>

    <p>@${user.login}</p>

    <p>Followers: ${user.followers}</p>

    <p>Repos: ${user.public_repos}</p>

    <h3>Contribution Graph</h3>

    <img src="https://ghchart.rshah.org/${user.login}" />

  </div>
  
  `;
}