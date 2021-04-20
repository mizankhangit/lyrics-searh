const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

async function searchSong(term) {
  try {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    console.log(data);
    showData(data);
  } catch (error) {
    console.error(error);
  }
}

function showData(data) {
  result.innerHTML = `
    <ul class="songs">
    ${data.data
      .map(
        (song) => `<li>
    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
  </li>`
      )
      .join("")}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
    ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
        : ""
    }
    ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
        : ""
    }
    `;
  } else {
    more.innerHTML = "";
  }
}

async function getMoreSongs(url) {
  try {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSong(searchTerm);
  }
});

async function getLyrics(artist, songTitle) {
  try {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    console.log(lyrics);
    result.innerHTML = `
      <h2><strong>${artist}</strong></h2>
      <span>${lyrics}</span>
    `;
  } catch (error) {
    console.error(error);
  }
}

result.addEventListener("click", (e) => {
  const clickEl = e.target;
  if (clickEl.tagName === "BUTTON") {
    const artist = clickEl.getAttribute("data-artist");
    const songTitle = clickEl.getAttribute("data-songtitle");
    getLyrics(artist, songTitle);
  }
});
