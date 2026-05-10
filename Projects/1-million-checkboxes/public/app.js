const state = {
  user: null,
  socket: null,
  start: 0,
  count: 1000,
  total: 1000000,
  values: []
};

const grid = document.querySelector("#grid");
const connectionText = document.querySelector("#connectionText");
const windowText = document.querySelector("#windowText");
const rateText = document.querySelector("#rateText");
const userLabel = document.querySelector("#userLabel");
const loginLink = document.querySelector("#loginLink");
const logoutForm = document.querySelector("#logoutForm");
const jumpInput = document.querySelector("#jumpInput");
const jumpButton = document.querySelector("#jumpButton");

function setConnection(text, tone = "") {
  connectionText.textContent = text;
  connectionText.dataset.tone = tone;
}

function updateAuthUi() {
  if (state.user) {
    userLabel.textContent = state.user.name;
    loginLink.hidden = true;
    logoutForm.hidden = false;
  } else {
    userLabel.textContent = "Anonymous read-only";
    loginLink.hidden = false;
    logoutForm.hidden = true;
  }
}

async function fetchMe() {
  const response = await fetch("/api/me");
  const data = await response.json();
  state.user = data.user;
  updateAuthUi();
}

async function loadRange(start = 0) {
  const response = await fetch(`/api/checkboxes?start=${start}&count=${state.count}`);
  if (!response.ok) throw new Error("Unable to load checkbox state.");
  const data = await response.json();
  state.start = data.start;
  state.count = data.count;
  state.total = data.total;
  state.values = data.values;
  jumpInput.max = String(state.total - 1);
  renderGrid();
}

function renderGrid() {
  const fragment = document.createDocumentFragment();
  grid.textContent = "";

  state.values.forEach((checked, offset) => {
    const index = state.start + offset;
    const label = document.createElement("label");
    label.className = "cell";
    label.title = `Checkbox ${index}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.dataset.index = String(index);
    input.disabled = !state.user;

    const span = document.createElement("span");
    span.textContent = index.toLocaleString();

    label.append(input, span);
    fragment.append(label);
  });

  grid.append(fragment);
  const end = state.start + state.values.length - 1;
  windowText.textContent = `${state.start.toLocaleString()} - ${end.toLocaleString()} of ${state.total.toLocaleString()}`;
}

function applyRemoteUpdate(index, checked) {
  if (index < state.start || index >= state.start + state.values.length) return;
  const offset = index - state.start;
  state.values[offset] = checked;
  const input = grid.querySelector(`input[data-index="${index}"]`);
  if (input) {
    input.checked = checked;
    input.closest(".cell").classList.add("pulse");
    setTimeout(() => input.closest(".cell")?.classList.remove("pulse"), 350);
  }
}

function connectSocket() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}/ws`);
  state.socket = socket;

  socket.addEventListener("open", () => setConnection("Connected", "good"));
  socket.addEventListener("close", () => {
    setConnection("Disconnected. Reconnecting...", "bad");
    setTimeout(connectSocket, 1200);
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.event === "socket:ready") {
      setConnection(message.payload.authenticated ? "Connected as authenticated user" : "Connected read-only", "good");
    }
    if (message.event === "checkbox:update") {
      applyRemoteUpdate(message.payload.index, message.payload.checked);
      rateText.textContent = `Updated by ${message.payload.user?.name || "another user"}`;
    }
    if (message.event === "checkbox:ack") {
      rateText.textContent = `${message.payload.remaining} toggles left in this short window`;
    }
    if (message.event === "rate:limited" || message.event === "error") {
      rateText.textContent = message.payload.message;
    }
  });
}

grid.addEventListener("change", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "checkbox") return;
  const index = Number(input.dataset.index);
  const checked = input.checked;
  state.values[index - state.start] = checked;

  if (!state.socket || state.socket.readyState !== WebSocket.OPEN) {
    input.checked = !checked;
    return;
  }

  state.socket.send(JSON.stringify({
    event: "checkbox:toggle",
    payload: { index, checked }
  }));
});

jumpButton.addEventListener("click", () => {
  const value = Math.max(0, Math.min(Number(jumpInput.value || 0), state.total - state.count));
  loadRange(value).catch((error) => {
    rateText.textContent = error.message;
  });
});

jumpInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") jumpButton.click();
});

fetchMe()
  .then(() => loadRange(0))
  .then(connectSocket)
  .catch((error) => {
    setConnection(error.message, "bad");
  });
