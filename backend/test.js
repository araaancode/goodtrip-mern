// pL = 5
// capacity = 10
// seats = 8

// subtrack = capacity - seats // subtrack = 10 - 8 = 2

// let seatNums = []

// for (let i = 0; i < pL; i++) {
//     seatNums.push((i + 1) + subtrack)
// }

// console.log(seatNums);


function isTicketValid(ticket) {
    const currentDate = new Date();

    const expirationDate = new Date(ticket.expirationDate);

    return currentDate <= expirationDate;
}

const ticket = {
    id: '12345',
    expirationDate: '2024-10-15' // Expiration date in YYYY-MM-DD format
};

console.log(isTicketValid(ticket)); // Output: true or false

