function loadMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(movies => {
            const filmsList = document.getElementById("films");
            filmsList.innerHTML = '';

            if (movies.length === 0) {
                filmsList.innerHTML = '<li>No movies available</li>';
                return;
            }

            movies.forEach(movie => {
                const li = document.createElement("li");
                li.classList.add("film", "item");
                li.textContent = movie.title;

                li.addEventListener('click', () => loadMovieDetails(movie));
                filmsList.appendChild(li);
            });
        })
        .catch(error => {
            console.log("Error loading movies:", error);
            filmsList.innerHTML = '<li>Error loading movies. Please try again later.</li>';
        });
}

function loadMovieDetails(movie) {
    document.getElementById("poster").src = movie.poster;
    document.getElementById("poster").alt = movie.title;
    document.getElementById("title").textContent = movie.title;
    document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
    document.getElementById("film-info").textContent = movie.description;
    document.getElementById("showtime").textContent = movie.showtime;

    const availableTickets = movie.capacity - movie.tickets_sold;
    const ticketNum = document.getElementById("ticket-num");
    ticketNum.textContent = `${availableTickets} remaining tickets`;

    const buyTicketButton = document.getElementById("buy-ticket");
    buyTicketButton.disabled = availableTickets <= 0;
    buyTicketButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";

    buyTicketButton.onclick = () => buyTicket(movie, ticketNum, buyTicketButton);
}

function buyTicket(movie, ticketNum, buyButton) {
    const availableTickets = movie.capacity - movie.tickets_sold;

    if (availableTickets > 0) {
        const updatedTicketsSold = movie.tickets_sold + 1;

        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "tickets_sold": updatedTicketsSold })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            const newAvailableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
            ticketNum.textContent = `${newAvailableTickets} remaining tickets`;

            if (newAvailableTickets === 0) {
                buyButton.disabled = true;
                buyButton.textContent = 'Sold Out';
            }
        })
        .catch(error => console.log("Error updating tickets:", error));
    }
}

window.onload = () => {
    loadMovies();
}
