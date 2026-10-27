const seatsData = [
    { id: 1, row: 1, col: 1, zone: "Standard", price: 20, isBooked: false },
    { id: 2, row: 1, col: 2, zone: "Standard", price: 20, isBooked: false },
    { id: 3, row: 1, col: 3, zone: "VIP", price: 40, isBooked: true },
    { id: 4, row: 1, col: 4, zone: "VIP", price: 40, isBooked: false },
    { id: 5, row: 2, col: 1, zone: "Standard", price: 20, isBooked: false },
    { id: 6, row: 2, col: 2, zone: "Standard", price: 20, isBooked: false },
    { id: 7, row: 2, col: 3, zone: "VIP", price: 40, isBooked: false },
    { id: 8, row: 2, col: 4, zone: "VIP", price: 40, isBooked: false },
    { id: 9, row: 3, col: 1, zone: "Standard", price: 20, isBooked: true },
    { id: 10, row: 3, col: 2, zone: "Standard", price: 20, isBooked: false },
    { id: 11, row: 3, col: 3, zone: "Standard", price: 20, isBooked: false },
    { id: 12, row: 3, col: 4, zone: "Standard", price: 20, isBooked: false }
];

let selectedSeatIds = [];
let filterText = "";

const seatGridEl = document.getElementById("seat-grid");
const messageBoxEl = document.getElementById("message-box");
const selectedCountEl = document.getElementById("selected-count");
const totalPriceEl = document.getElementById("total-price");
const bestSeatsBtn = document.getElementById("best-seats-btn");
const searchInput = document.getElementById("search-input");

function render() {
    seatGridEl.innerHTML = "";
    
    let filteredSeats = [];
    for (const seat of seatsData) {
        if (seat.zone.toLowerCase().includes(filterText.toLowerCase())) {
            filteredSeats.push(seat);
        }
    }

    if (filteredSeats.length === 0) {
        messageBoxEl.textContent = "No seats found matching your filter.";
    } else {
        messageBoxEl.textContent = "Select up to 6 seats.";
    }

    for (const seat of filteredSeats) {
        const seatBtn = document.createElement("button");
        seatBtn.textContent = "Seat " + seat.id + " (" + seat.zone + ")";
        seatBtn.classList.add("seat");
        seatBtn.classList.add(seat.zone.toLowerCase());
        seatBtn.dataset.id = seat.id;

        if (seat.isBooked) {
            seatBtn.classList.add("booked");
            seatBtn.disabled = true;
        } else if (selectedSeatIds.includes(seat.id)) {
            seatBtn.classList.add("selected");
        }

        seatGridEl.appendChild(seatBtn);
    }

    selectedCountEl.textContent = selectedSeatIds.length;

    let totalPrice = 0;
    for (const id of selectedSeatIds) {
        for (const seat of seatsData) {
            if (seat.id === id) {
                totalPrice += seat.price;
            }
        }
    }
    totalPriceEl.textContent = totalPrice;
}

function handleSeatClick(event) {
    const target = event.target;
    if (!target.classList.contains("seat") || target.classList.contains("booked")) {
        return;
    }

    const seatId = Number(target.dataset.id);
    const index = selectedSeatIds.indexOf(seatId);

    if (index > -1) {
        selectedSeatIds.splice(index, 1);
    } else {
        if (selectedSeatIds.length >= 6) {
            messageBoxEl.textContent = "Rule Error: You can select a maximum of 6 seats!";
            return;
        }
        selectedSeatIds.push(seatId);
    }

    render();
}

function handleSearch(event) {
    filterText = event.target.value;
    render();
}

function handleBestSeats() {
    selectedSeatIds = [];
    let freeSeats = [];
    for (const seat of seatsData) {
        if (!seat.isBooked) {
            freeSeats.push(seat);
        }
    }

    for (let i = 0; i < Math.min(2, freeSeats.length); i++) {
        selectedSeatIds.push(freeSeats[i].id);
    }

    messageBoxEl.textContent = "Best available seats selected automatically.";
    render();
}

seatGridEl.addEventListener("click", handleSeatClick);
searchInput.addEventListener("input", handleSearch);
bestSeatsBtn.addEventListener("click", handleBestSeats);

render();