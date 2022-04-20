// HTTP requests

// GET request for user info
// send to data handler
function getUser() {
    fetch('https://randomuser.me/api/')
        .then(resp => resp.json())
        .then(data => handleData(data.results[0]))
}

// POST request
// post user data in db.json
// pessimistically send response data to handleNewUser
function postUser(userObj) {
    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userObj)
    })
        .then(resp => resp.json())
        .then(userObj => handleNewUser(userObj))
}

fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(data => handleUserList(data))

// Global variables
const btn = document.querySelector('#generate')

// Global event listeners
btn.addEventListener('click', getUser)

// Handlers
// takes in response from db.json
// pessimistically renders in top and bottom container
function handleNewUser(userObj) {
    renderMainUser(userObj)
    addToUserList(userObj)
}

function handleUserList(userArray) {
    userArray.forEach(userObj => addToUserList(userObj))
}

// Recieves data from API fetch
function handleData(dataObj) {
    // GET request for unique AI face img
    // Defining user obj within .then (async)
    // Sending user obj to postUser
    fetch('https://fakeface.rest/face/json')
        .then(resp => resp.json())
        .then(data => {
            // console.log(data)
            const user = {
                name: dataObj.name,
                dob: dataObj.dob,
                email: dataObj.email,
                gender: data.gender,
                location: dataObj.location,
                cell: dataObj.cell,
                image: data.image_url
            }
            postUser(user)
        })
}



// prints date from date instance
function makeDate(date) {
    const days = date.substr(8, 2)
    const year = date.substr(0, 4)
    const month = date.substr(5, 2)
    return `${month}/${days}/${year}`
}

// Renders
// Renders the main user card in top container
function renderMainUser(userObj) {
    const container = document.querySelector('#licence-container')
    container.innerHTML = ''
    const div = document.createElement('div')
    div.className = 'main-info'
    const img = document.createElement('img')
    img.src = userObj.image;
    img.className = 'main-img'
    const name = document.createElement('h2')
    name.textContent = `${userObj.name.first} ${userObj.name.last}`
    const location = document.createElement('h3')
    location.textContent = `${userObj.location.city}, ${userObj.location.state}, ${userObj.location.country}`
    const gender = document.createElement('p')
    gender.textContent = `Gender: ${userObj.gender}`
    const cell = document.createElement('p')
    cell.textContent = `Cell: ${userObj.cell}`
    const dob = document.createElement('p')
    dob.textContent = `DOB: ${makeDate(userObj.dob.date)}`
    div.append(name, location, gender, dob, cell)
    container.append(div, img)
}

// Adds rendered card to bottom container
// Adds mouse events to each card
function addToUserList(userObj) {
    const container = document.querySelector('#bottom-container')
    const card = document.createElement('div')
    card.className = 'card'
    const div = document.createElement('div')
    const img = document.createElement('img')
    const name = document.createElement('h4')
    const info = document.createElement('div')
    info.innerHTML = `<p>Gender: ${userObj.gender}</p><p>DOB: ${makeDate(userObj.dob.date)}</p><p>Cell: ${userObj.cell}</p>`
    info.style.display = 'none'
    name.textContent = `${userObj.name.first} ${userObj.name.last}`
    img.src = userObj.image
    const p = document.createElement('p')
    p.textContent = `${userObj.location.city}, ${userObj.location.country}`
    card.onmouseover = () => info.style.display = 'block';
    card.onmouseout = () => info.style.display = 'none';
    div.append(name, p, info)
    card.append(div, img)
    container.prepend(card)
}
