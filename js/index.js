document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  if (username === '') {
    alert('Please enter a GitHub username');
    return;
  }

  searchUsers(username);
});

async function searchUsers(username) {
  const apiUrl = `https://api.github.com/search/users?q=${username}`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const data = await response.json();
    displaySearchResults(data.items);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displaySearchResults(users) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  users.forEach(user => {
    const userCard = document.createElement('div');
    userCard.classList.add('user-card');
    userCard.innerHTML = `
      <img src="${user.avatar_url}" alt="Avatar">
      <p>${user.login}</p>
    `;
    userCard.addEventListener('click', () => showUserRepos(user.login));
    resultsContainer.appendChild(userCard);
  });
}

async function showUserRepos(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const data = await response.json();
    displayUserRepos(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayUserRepos(repos) {
  const reposContainer = document.getElementById('userRepos');
  reposContainer.innerHTML = '';

  repos.forEach(repo => {
    const repoItem = document.createElement('div');
    repoItem.innerHTML = `
      <p><strong>${repo.name}</strong></p>
      <p>${repo.description || 'No description'}</p>
      <p>Language: ${repo.language || 'Unknown'}</p>
      <hr>
    `;
    reposContainer.appendChild(repoItem);
  });

  reposContainer.style.display = 'block';
}
