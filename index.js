document.addEventListener("DOMContentLoaded", () => {
    
    const movieDetails = document.querySelector("#movie-details");
    const filmsList = document.querySelector("#films");
    const buyTicketButton = document.querySelector("#buy-ticket");
  
    const filmsUrl = "http://localhost:3000/films";
    const firstMovieUrl = "http://localhost:3000/films/1";
  
    
    function fetchFirstMovie() {
        //console.log (fetchFirstMovie)
      fetch(firstMovieUrl)
        .then((response) => response.json())
        .then((movie) =>{ console.log (movie)
             renderMovieDetails(movie) })
        
        .catch((error) => console.error("Error fetching first movie:", error));
    }
  
    
    function fetchAllMovies() {
        //console.log(fetchAllMovies)
      fetch(filmsUrl)
        .then((response) => response.json())
        .then((movies) =>{ console.log(movies)
            renderMovieMenu(movies)})
        .catch((error) => console.error("Error fetching all movies:", error));
    }
  
    // display
    function renderMovieDetails(movie) {
      const availableTickets = movie.capacity - movie.tickets_sold;
      console.log(`Rendering details for "${movie.title}" (Available: ${availableTickets})`);
      movieDetails.querySelector("#poster").src = movie.poster;
      movieDetails.querySelector("#title").textContent = movie.title;
      movieDetails.querySelector("#runtime").textContent = `${movie.runtime} minutes`;
      movieDetails.querySelector("#showtime").textContent = `Showtime: ${movie.showtime}`;
      movieDetails.querySelector("#available-tickets").textContent = `Available Tickets: ${availableTickets}`;
      movieDetails.querySelector("#description").textContent = movie.description;
  
      // Update Buy Ticket button
      if (availableTickets === 0) {
        buyTicketButton.textContent = "Sold Out";
        buyTicketButton.disabled = true;
      } else {
        buyTicketButton.textContent = "Buy Ticket";
        buyTicketButton.disabled = false;
      }
  
      // Add event listener 
      buyTicketButton.onclick = () => buyTicket(movie);
    }
  
    function renderMovieMenu(movies) {
      filmsList.innerHTML = ""; 
      //console.log (renderMovieMenu)
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.textContent = movie.title;
       li.classList.add("film", "item")
  
        if (movie.capacity - movie.tickets_sold === 0) {
          li.classList.add("sold-out");
        }
  
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteMovie(movie.id, li));
           // console.log(`Deleting movie: ${movie.title} (ID: ${movie.id})`);
            
  
        li.appendChild(deleteButton);
        filmsList.appendChild(li);

        li.addEventListener("click", () => {
          fetch(`${filmsUrl}/${movie.id}`)
            .then((response) => response.json())
            .then((movie) =>{ console.log(movie)
                renderMovieDetails(movie)
            })
            .catch((error) => console.error("Error fetching movie details:", error));
        });
      });
    }
  
    
    function buyTicket(movie) {
      const updatedTicketsSold = movie.tickets_sold + 1;
      const availableTickets = movie.capacity - updatedTicketsSold;
  
      if (availableTickets >= 0) {
        // Updating server
        fetch(`${filmsUrl}/${movie.id}`, {
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
          })
          .catch((error) => console.error("Error updating tickets:", error));
      }
    }
  
    
    function deleteMovie(movieId, li) {
      fetch(`${filmsUrl}/${movieId}`, {
        method: "DELETE",
      })
        .then(() => li.remove())
        .catch((error) => console.error("Error deleting movie:", error));
    }
  
    // Initialize  app
    fetchFirstMovie();
    fetchAllMovies();
  });
