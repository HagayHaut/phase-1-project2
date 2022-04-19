// HTTP requests

// GET request
function getUser() {
    fetch('https://randomuser.me/api/')
    .then(resp => resp.json())
    .then(data => handleData(data.results[0]))
}

// POST request
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
        .then(userObj => renderUser(userObj))
}

// Global variables
const btn = document.querySelector('#generate')

// Global event listeners
btn.addEventListener('click', getUser)

// Handlers
function handleData(dataObj) {
    const user = {
        name: dataObj.name,
        dob: dataObj.dob,
        email: dataObj.email,
        gender: dataObj.gender,
        location: dataObj.location,
        cell: dataObj.cell,
        image: 'https://100k-faces.glitch.me/random-image'
    }
    postUser(user)
}

// prints date from date instance
function makeDate(date) {
    const days = date.substr(8, 2)
    const year = date.substr(0,4)
    const month = date.substr(5,2)
    return `${month}/${days}/${year}`
}

// Renders
function renderUser(userObj) {
    console.log(userObj)
    const container = document.querySelector('#licence-container')
    console.log(container)
    const img = document.createElement('img')
    img.src = userObj.image;
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
    container.append(name,location,img,gender,dob,cell)
}



// const img = document.createElement('img')
// img.src = 'https://100k-faces.glitch.me/random-image'
// document.querySelector('body').append(img)