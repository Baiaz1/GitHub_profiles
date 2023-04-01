const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

async function getUser(userName){
    try{
        const { data } = await axios(APIURL + userName)
        createUserCard(data)
        getRepos(userName)
    }catch(error){
        if(error.response.status === 404){
            createErrorCard('No profile with this user name')
        }
    }
}

async function getRepos(userName){
    try{
        const { data } = await axios(APIURL + userName + '/repos?sort=created')
        addReposToCard(data)
    }catch(error){
            createErrorCard('Problem fetching repos')
    }
}

function createUserCard(user){

    const { avatar_url, name, bio, followers, following, public_repos  } = user;

    const cardHTML = `
        <div class="card">
            <div>
                <img src="${avatar_url}" alt="${name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${name}</h2>
                <p>${bio}</p>

                <ul>
                    <li>${followers} <strong>Followers</strong></li>
                    <li>${following} <strong>Following</strong></li>
                    <li>${public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos">
                    
                </div>
            </div>
        </div>
    `

    main.innerHTML = cardHTML
}

function createErrorCard(msg){
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos){
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        });
}

form.addEventListener('submit', e => {
    e.preventDefault()
    const user = search.value

    if(user){
        getUser(user)

        search.value = ''
    }
})