// HTTP requests

// GET request for user info
// send to data handler
function getUser() {
    fetch('https://randomuser.me/api/')
        .then(resp => resp.json())
        .then(data => handleData(data.results[0]))
}

// GET users from db.json for bottom list
fetch('http://localhost:3000/users')
    .then(resp => resp.json())
    .then(data => handleUserList(data))

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

// DELETE request
function deleteRequest(card) {
    const id = card.querySelector('img').id
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            card.remove()
        })
}

// Handles delete all button event
function deleteAllRequest(e) {

    // Get all current users, store their ids in an array
    const ids = []
    fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(data => {
            data.forEach(userObj => {
                ids.push(userObj.id)
            })

            // Iterate through ids, delete from server using ids
            ids.forEach(id => {
                fetch(`http://localhost:3000/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => data)
            })
            // optimistically delete contents of containers on 
            document.querySelector('#bottom-container').innerHTML = ''
            document.querySelector('#licence-container').innerHTML = ''
        })
}

// Global variables
const btn = document.querySelector('#generate')
const deleteAllBtn = document.querySelector('#deleteAll')
//gets current date and parses
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
// stores current date as string to check birthdays
const todayStr = `${mm}/${dd}`



// vairable storing today's date

// Global event listeners
btn.addEventListener('click', getUser)
deleteAllBtn.addEventListener('click', deleteAllRequest)


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
    if(makeDate(userObj.dob.date).slice(0,5) === todayStr) {
       container.style.backgroundColor = 'gold'
    }
    else {
        container.style.backgroundColor = '#7F9183'
    }
    dob.textContent = `DOB: ${makeDate(userObj.dob.date)}`
    div.append(name, location, gender, dob, cell)
    container.append(img, div)
}

// Adds rendered card to bottom container
// Adds mouse events to each card
function addToUserList(userObj) {
    // variables
    const container = document.querySelector('#bottom-container')
    const card = document.createElement('div')
    const div = document.createElement('div')
    const img = document.createElement('img')
    const name = document.createElement('h4')
    const info = document.createElement('div')
    const trash = document.createElement('img')
    // styles and classes
    card.className = 'card'
    trash.id = userObj.id
    trash.style.width = '50px'
    trash.style.height = 'auto'
    trash.className = 'trash'
    trash.style.position = 'absolute'
    trash.style.right = '4px'
    trash.style.top = '6px'
    trash.src = 'https://i.redd.it/k15gv84q33441.png';
    info.innerHTML = `<p>Gender: ${userObj.gender}</p><p>DOB: ${makeDate(userObj.dob.date)}</p><p>Cell: ${userObj.cell}</p>`
    info.style.display = 'none'
    name.textContent = `${userObj.name.first} ${userObj.name.last}`
    img.src = userObj.image
    const p = document.createElement('p')
    p.textContent = `${userObj.location.city}, ${userObj.location.country}`
    // events
    trash.onclick = (e) => deleteRequest(e.target.parentNode.parentNode)
    card.onmouseover = () => info.style.display = 'block';
    card.onmouseout = () => info.style.display = 'none';
    card.onclick = () => renderMainUser(userObj);
    // card.addEventListener('dragstart', dragStart)
    // card.addEventListener('dragend', dragEnd)
    //append
    div.append(name, trash, p, info)
    card.append(div, img)
    card.draggable = 'false'
    container.prepend(card)
}

// Drag event callbacks
// function dragStart(e) {
//     this.className += ' hold';
    // this.style.display = 'none'
// }

// function dragEnd(e) {
//     console.log('end')
// }
