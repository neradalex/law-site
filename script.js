const STORAGE_KEY = "louispissios-posts";

const postForm = document.getElementById("post-form");
const postsContainer = document.getElementById("posts");
const clearPostsBtn = document.getElementById("clear-posts");
const yearNode = document.getElementById("year");

const getPosts = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const renderPosts = () => {
  if (!postsContainer) return;

  const posts = getPosts();

  if (!posts.length) {
    postsContainer.innerHTML =
      '<p class="card">No updates yet. Publish the first post above.</p>';
    return;
  }

  postsContainer.innerHTML = posts
    .map(
      (post) => `
      <article class="post">
        <div class="post-meta">${formatDate(post.createdAt)}</div>
        <h4>${post.title}</h4>
        <p>${post.content.replace(/\n/g, "<br>")}</p>
      </article>
    `
    )
    .join("");
};

if (postForm) {
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(postForm);
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();

    if (!title || !content) return;

    const post = {
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = [post, ...getPosts()];
    savePosts(updatedPosts);
    postForm.reset();
    renderPosts();
  });
}

if (clearPostsBtn) {
  clearPostsBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderPosts();
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

renderPosts();
