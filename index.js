document.addEventListener("DOMContentLoaded", () => {
    
  const movieDetails = document.querySelector("#movie-details");
  //console.log(movieDetails)
  const filmsList = document.querySelector("#films");
  const buyTicketButton = document.querySelector("#buy-ticket");


  function fetchFirstMovie() {
      //console.log (fetchFirstMovie)
    fetch("http://localhost:3000/films/1")
      .then((response) => response.json())
      .then((movie) =>{ console.log (movie)
           renderMovieDetails(movie) })
  }

  function fetchAllMovies() {
      //console.log(fetchAllMovies)
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((movies) =>{ console.log(movies)
          renderMovieMenu(movies)})
     
  }

  function renderMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    console.log(`Rendering details for "${movie.title}" (Available: ${availableTickets})`);
    movieDetails.querySelector("#poster").src = movie.poster;
    movieDetails.querySelector("#title").textContent = movie.title;
    movieDetails.querySelector("#runtime").textContent = `${movie.runtime} minutes`;
    movieDetails.querySelector("#showtime").textContent = `Showtime: ${movie.showtime}`;
    movieDetails.querySelector("#available-tickets").textContent = `Available Tickets: ${availableTickets}`;
    movieDetails.querySelector("#description").textContent = movie.description;

    if (availableTickets === 0) {
      buyTicketButton.textContent = "Sold Out";
      buyTicketButton.disabled = true;
    } else {
      buyTicketButton.textContent = "Buy Ticket";
      buyTicketButton.disabled = false;
    }

    buyTicketButton.onclick = () => buyTicket(movie);
  }

  function renderMovieMenu(movies) {
    filmsList.innerHTML = ""; 
    //console.log (renderMovieMenu)
    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = movie.title;
     li.classList.add("film", "item")
//console.log(li)
      if (movie.capacity - movie.tickets_sold === 0) {
        li.classList.add("sold-out");
      }

      const deleteButton = document.createElement("button");
     // console.log(deleteButton)
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteMovie(movie.id, li));
         // console.log(`Deleting movie: ${movie.title} (ID: ${movie.id})`);
          
      li.appendChild(deleteButton);
      filmsList.appendChild(li);
//console.log(filmsList)
      li.addEventListener("click", () => {
        fetch(`${"http://localhost:3000/films"}/${movie.id}`)
          .then((response) => response.json())
          .then((movie) =>{ console.log(movie)
              renderMovieDetails(movie)
          })
      });
    });
  }
  function buyTicket(movie) {
    const updatedTicketsSold = movie.tickets_sold + 1;
    const availableTickets = movie.capacity - updatedTicketsSold;
//console.log(availableTickets)
    if (availableTickets >= 0) {
      fetch(`${"http://localhost:3000/films"}/${movie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
      })
        .then((response) => response.json())
        .then((updatedMovie) => {
          console.log(updatedMovie)
          renderMovieDetails(updatedMovie);
          fetch("http://localhost:3000/tickets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              film_id: movie.id,
              number_of_tickets: 1
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log("Ticket posted:", data))
            .catch((error) => console.error("Error posting ticket:", error));
        })
      
    }
  }
    
    
  function deleteMovie(movieId, li) {
    fetch(`${"http://localhost:3000/films"}/${movieId}`, {
      method: "DELETE",
    })
      .then(() =>console.log(li.remove()))

   
  }

  fetchFirstMovie();
  fetchAllMovies();
});

