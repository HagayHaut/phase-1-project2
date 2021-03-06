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
    .then(data => {
        handleUserList(data);
    })

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
            countSpan.textContent = --count;
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
            count = 0;
            countSpan.textContent = count;
        })
}

// Global variables
const btn = document.querySelector('#generate')
const deleteAllBtn = document.querySelector('#deleteAll')
// const cardListContainer = document.querySelector('#bottom-container')
// const cardList = cardListContainer.querySelectorAll('.card')
// const humanCount = document.querySelector('#human-count')
// console.log(cardList)
// console.log(Array.from(cardList))

const countSpan = document.querySelector('#human-count')

let count = 0;

//gets current date and parses to mm/dd string
// vairable storing today's date
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

// stores current date as string to check birthdays during render
const todayStr = `${mm}/${dd}`

// Global event listeners
btn.addEventListener('click', getUser)
deleteAllBtn.addEventListener('click', deleteAllRequest)

// render current user count
// humanCount.textContent = Array.from(cardList).length;

// Handlers
// takes in response from db.json
// pessimistically renders in top and bottom container
function handleNewUser(userObj) {
    renderMainUser(userObj)
    addToUserList(userObj)
}

// Renders card list and most recent user on page load
function handleUserList(userArray) {
    renderMainUser(userArray[userArray.length-1])
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



// converts date instance to mm/dd/yyyy string
function makeDate(date) {
    const days = date.substr(8, 2)
    const year = date.substr(0, 4)
    const month = date.substr(5, 2)
    return `${month}/${days}/${year}`
}

// Renders
// Renders the main user card in top container
function renderMainUser(userObj) {
    // make tags
    const container = document.querySelector('#licence-container')
    const div = document.createElement('div')
    const img = document.createElement('img')
    const name = document.createElement('h2')
    const location = document.createElement('h3')
    const gender = document.createElement('p')
    const cell = document.createElement('p')
    const dob = document.createElement('p')
    // clear main user from #licence-container
    container.innerHTML = ''
    // spill object data to tags
    div.className = 'main-info'
    img.src = userObj.image;
    img.className = 'main-img'
    name.textContent = `${userObj.name.first} ${userObj.name.last}`
    location.textContent = `${userObj.location.city}, ${userObj.location.state}, ${userObj.location.country}`
    gender.textContent = `Gender: ${userObj.gender}`
    cell.textContent = `Cell: ${userObj.cell}`
    dob.textContent = `DOB: ${makeDate(userObj.dob.date)}`
    // check birthday
    if(makeDate(userObj.dob.date).slice(0,5) === todayStr) {
       container.style.backgroundColor = '#a67c00'
       dob.textContent += ' IT\'S MY BIRTHDAY!'
    }
    else {
        container.style.backgroundColor = '#7F9183'
    }
    // append to DOM
    div.append(name, location, gender, dob, cell)
    container.append(img, div)
}

// Adds rendered card to bottom container
// Adds mouse events to each card
function addToUserList(userObj) {
    // increment list count
    countSpan.textContent = ++count;
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
    // checks for birthday
    if(makeDate(userObj.dob.date).slice(0,5) === todayStr) {
        card.style.backgroundColor = '#a67c00'
        info.innerHTML += ' IT\'S MY BIRTHDAY!'
     }
     else {
         card.style.backgroundColor = '#7F9183'
     }
    // events
    trash.onclick = (e) => deleteRequest(e.target.parentNode.parentNode)
    card.onmouseover = () => info.style.display = 'block';
    card.onmouseout = () => info.style.display = 'none';
    img.onclick = () => renderMainUser(userObj);
    //append
    div.append(name, trash, p, info)
    card.append(div, img)
    card.draggable = 'false'
    container.prepend(card)
}
