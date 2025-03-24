document.addEventListener("DOMContentLoaded", () => {
    
  const movieDetails = document.querySelector("#movie-details");
  //console.log(movieDetails)
  const filmsList = document.querySelector("#films");
  const buyTicketButton = document.querySelector("#buy-ticket");


  function getFirstMovie() {
      //console.log (fetchFirstMovie)
    fetch("http://localhost:3000/films/1")
      .then((response) => response.json())
      .then((movie) =>{ console.log (movie)
           renderMovieDetails(movie) })
  }

  function getAllMovies() {
      //console.log(fetchAllMovies)
    fetch("http://localhost:3000/films",{
    method: "GET",
    headers : {
      "Accept" : "application/json"
    }
   })
      .then((response) => response.json())
      .then((movies) =>{ console.log(movies)
          renderMovieMenu(movies)})
     
  }

  function renderMovieDetails(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    buyTicketButton.onclick = () => buyTicket(movie);
   
    const movieData= {
      "#title": movie.title,
      "#runtime": `${movie.runtime} minutes`,
      "#showtime": `Showtime: ${movie.showtime}`,
      "#available-tickets": `Available Tickets: ${movie.capacity - movie.tickets_sold}`,
      "#description": movie.description,
    };
    
    for (let key in movieData) {
      movieDetails.querySelector(key).textContent = movieData[key];
    }
    
    movieDetails.querySelector("#poster").src = movie.poster;
  
    if (availableTickets === 0) {
      buyTicketButton.textContent = "Sold Out";
      buyTicketButton.disabled = true;
    } else {
      buyTicketButton.textContent = "Buy Ticket";
      buyTicketButton.disabled = false;
    }

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
            .then((data) => console.log(data))
        
        })
      
    }
  }
    
    
  function deleteMovie(movieId, li) {
    fetch(`${"http://localhost:3000/films"}/${movieId}`, {
      method: "DELETE",
    })
      .then(() =>console.log(li.remove()))

   
  }

  getFirstMovie();
  getAllMovies();
});

