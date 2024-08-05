/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          await loginUser(email, password);
      });
  }

  checkAuthentication();
});

async function loginUser(email, password) {
  try {
      const response = await fetch('https://your-api-url/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html';
      } else {
          alert('Login failed: ' + response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }
}

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token) {
      loginLink.style.display = 'block';
  } else {
      loginLink.style.display = 'none';
      fetchPlaces(token);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
  try {
      const response = await fetch('https://your-api-url/places', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          const places = await response.json();
          displayPlaces(places);
      } else {
          console.error('Failed to fetch places:', response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  places.forEach(place => {
      const placeElement = document.createElement('div');
      placeElement.innerHTML = `
          <h3>${place.name}</h3>
          <p>${place.description}</p>
          <p>${place.location}</p>
      `;
      placesList.appendChild(placeElement);
  });
}

document.getElementById('country-filter').addEventListener('change', (event) => {
  const selectedCountry = event.target.value;
  const places = document.querySelectorAll('#places-list > div');

  places.forEach(place => {
      if (place.querySelector('p:last-child').textContent.includes(selectedCountry) || selectedCountry === 'all') {
          place.style.display = 'block';
      } else {
          place.style.display = 'none';
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const token = checkAuthentication();
  const placeId = getPlaceIdFromURL();

  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
      reviewForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const reviewText = document.getElementById('review').value;
          await submitReview(token, placeId, reviewText);
      });
  }
});

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('placeId');
}

async function fetchPlaceDetails(token, placeId) {
  try {
      const response = await fetch(`https://your-api-url/places/${placeId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          const place = await response.json();
          displayPlaceDetails(place);
      } else {
          console.error('Failed to fetch place details:', response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

function displayPlaceDetails(place) {
  const placeDetails = document.getElementById('place-details');
  placeDetails.innerHTML = '';

  const placeElement = document.createElement('div');
  placeElement.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <p>${place.location}</p>
      ${place.images.map(image => `<img src="${image}" alt="${place.name}">`).join('')}
  `;
  placeDetails.appendChild(placeElement);
}

async function submitReview(token, placeId, reviewText) {
  try {
      const response = await fetch(`https://your-api-url/places/${placeId}/reviews`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ review: reviewText })
      });

      if (response.ok) {
          alert('Review submitted successfully!');
          document.getElementById('review-form').reset();
      } else {
          alert('Failed to submit review');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }
}
