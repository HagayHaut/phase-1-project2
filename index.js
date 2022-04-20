// HTTP requests

// GET request for user info
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
        .then(userObj => handleNewUser(userObj))
}

// Global variables
const btn = document.querySelector('#generate')

// Global event listeners
btn.addEventListener('click', getUser)

// Handlers
function handleNewUser(userObj) {
    renderMainUser(userObj)
    // MAX: addToUserList will render each new user in list at bottom
    // is declared below but empty
    addToUserList(userObj)
}

function handleData(dataObj) {
    // GET request for unique AI face img
    fetch('https://fakeface.rest/face/json')
    .then(resp => resp.json())
    .then(data => {
        const user = {
        name: dataObj.name,
        dob: dataObj.dob,
        email: dataObj.email,
        gender: dataObj.gender,
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

function addToUserList(userObj) {
    console.log(userObj)
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
    // card.addEventListener('onmouseover', () => showCardDetail(info))
    // card.addEventListener('onmouseout', () => hideCardDetail(info))
    card.onmouseover = () => info.style.display = 'block';
    card.onmouseout = () => info.style.display = 'none';
    div.append(name,p,info)
    card.append(div,img)
    container.prepend(card)
}

// function showCardDetail(info) {
//     info.style.display = 'block'
// }

// function hideCardDetail(info) {
//     info.style.display = 'none'
// }

// Hello
// Bye


// const img = document.createElement('img')
// img.src = 'https://100k-faces.glitch.me/random-image'
// document.querySelector('body').append(img)

// Comment for demo