
async function fetchQuote() {
      const category = document.getElementById('category').value;
      let apiURL = 'https://go-quote.azurewebsites.net/api/quotes/random';
      if (category) apiURL += `?tags=${category}`;

      try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        document.getElementById('quote').innerText = `"${data.text}"`;
        document.getElementById('author').innerText = `— ${data.author}`;
      } catch (error) {
        document.getElementById('quote').innerText = `"Believe you can and you're halfway there."`;
        document.getElementById('author').innerText = "— Theodore Roosevelt";
      }
    }
    
    
    function saveReflection() {
      const reflectionText = document.getElementById('reflection').value.trim();
      if (reflectionText === '') {
        alert("Please write something first!");
        return;
      }

      const entry = {
        text: reflectionText,
        time: new Date().toLocaleString()
      };

      let reflections = JSON.parse(localStorage.getItem('reflections')) || [];
      reflections.push(entry);
      localStorage.setItem('reflections', JSON.stringify(reflections));
      displayReflections();
      document.getElementById('reflection').value = '';
    }

    function displayReflections() {
      const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
      const history = document.getElementById('historyList');
      history.innerHTML = '';

      reflections.forEach(r => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `<p>${r.text}</p><small>${r.time}</small>`;
        history.appendChild(div);
      });
    }

    function saveFavorite() {
      const quote = document.getElementById('quote').innerText;
      const author = document.getElementById('author').innerText;

      const fav = { quote, author };
      let favs = JSON.parse(localStorage.getItem('favorites')) || [];

      if (!favs.some(f => f.quote === fav.quote && f.author === fav.author)) {
        favs.push(fav);
        localStorage.setItem('favorites', JSON.stringify(favs));
        displayFavorites();
        alert("Quote added to favorites!");
      } else {
        alert("Quote already in favorites.");
      }
    }

    function displayFavorites() {
      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      const favList = document.getElementById('favoritesList');
      favList.innerHTML = '';

      favs.forEach((fav, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `
          <p><strong>Quote:</strong> ${fav.quote}</p>
          <p><strong>Author:</strong> ${fav.author}</p>
          <button onclick="removeFavorite(${index})">🗑 Remove</button>
        `;
        favList.appendChild(div);
      });
    }

    function removeFavorite(index) {
      let favs = JSON.parse(localStorage.getItem('favorites')) || [];
      favs.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favs));
      displayFavorites();
    }

    function exportFavorites() {
      const favs = JSON.parse(localStorage.getItem('favorites')) || [];
      if (favs.length === 0) {
        alert("No favorites to export.");
        return;
      }

      let content = "My Favorite Quotes:\n\n";
      favs.forEach((fav, i) => {
        content += `${i + 1}. ${fav.quote} ${fav.author}\n\n`;
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favorite_quotes.txt';
      a.click();
      URL.revokeObjectURL(url);
    }

    // Load data on page ready
    window.onload = () => {
      fetchQuote();
      displayReflections();
      displayFavorites();
      
    };