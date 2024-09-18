const textarea = document.getElementById('searchTextArea');
const recentHeader = document.getElementById('recentHeader');
const noRecentSearches = document.getElementById('noRecentSearches');
const recentSearches = document.getElementById('recentSearches');
const deleteSearchTextButton = document.getElementById('deleteSearchTextButton');

let displayDOMElementsForRecentSearches = true;
let authenticatedUsername = "";
let recentSearchesOfUser = [];
let DOMElementsForRecentSearches = [recentHeader];


async function authenticateUser() {
    const username = document.getElementById('usernameInURL').textContent;
    //code to authenticate this user

    //the following lines assume user is authenticated
    authenticatedUsername = username;
    await fetchRecentSearchesOfAuthenticatedUser();
}

async function fetchRecentSearchesOfAuthenticatedUser() {
    //code to fetch the recent searches(last 10 searches made in the last week)
    //the result will be a list of objects, ordered by how recent they are(DATE DESC)
    /*
    const response = await fetch('http://localhost:8020/recentSearchesOfUser/'+authenticatedUsername);
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    const responseData = await response.json();
    */
    recentSearchesOfUser = [
        {
            date_time_of_search: new Date(),
            type_of_search: 'text',
            search: 'apples',
            search_fullname: null,
            search_isVerified: null
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'text',
            search: 'How to fly a kite',
            search_fullname: null,
            search_isVerified: null
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'text',
            search: 'Tesla Cybertrucks',
            search_fullname: null,
            search_isVerified: null
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'username',
            search: 'jb',
            search_fullname: 'Justin Bieber',
            search_isVerified: true
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'username',
            search: 'charlieputh',
            search_fullname: 'Charlie Puth',
            search_isVerified: true
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'username',
            search: 'packerfan2014',
            search_fullname: 'SB Soon',
            search_isVerified: false
        },
        {
            date_time_of_search: new Date(),
            type_of_search: 'username',
            search: 'pun_bible',
            search_fullname: 'Puns 4 Life',
            search_isVerified: false
        },

    ];
    if(recentSearchesOfUser.length==0) {
        noRecentSearches.classList.remove('hidden');
        recentSearches.classList.add('hidden');
        DOMElementsForRecentSearches.push(noRecentSearches);
    }
    else {
        noRecentSearches.classList.add('hidden');
        recentSearches.classList.remove('hidden');
        DOMElementsForRecentSearches.push(recentSearches);

        for(let recentSearch of recentSearchesOfUser) {
            if(recentSearch.type_of_search==='username') {
                const newElementDiv = document.createElement('div');
                newElementDiv.className = 'hoverableElement';
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em';

                const img = document.createElement('img');
                img.src = '/images/profilePhoto.png';
                img.style.height = '85%';
                img.style.width = '7%';
                img.style.objectFit = 'contain';

                const innerDiv = document.createElement('div');
                innerDiv.style.display = 'flex';
                innerDiv.style.flexDirection = 'column';
                innerDiv.style.alignItems = 'start';

                const b = document.createElement('b');
                b.textContent = recentSearch.search;
                if(recentSearch.search_isVerified) {
                    const verifiedCheckImgElement = document.createElement('img');
                    verifiedCheckImgElement.src = '/images/verifiedCheck.png';
                    verifiedCheckImgElement.style.height = '1.2em';
                    verifiedCheckImgElement.style.width = '1.2em';
                    verifiedCheckImgElement.style.objectFit = 'contain';
                    b.appendChild(verifiedCheckImgElement);
                }
                const p = document.createElement('p');
                p.style.color = 'gray';
                p.textContent = recentSearch.search_fullname;
        
                innerDiv.appendChild(b);
                innerDiv.appendChild(p);

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(innerDiv);

                recentSearches.appendChild(newElementDiv);
            }
            else {
                const newElementDiv = document.createElement('div');
                newElementDiv.className = 'hoverableElement';
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.alignItems = 'center';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em';

                const img = document.createElement('img');
                img.src = '/images/searchIcon.png';
                img.style.height = '85%';
                img.style.width = '7%';
                img.style.objectFit = 'contain';

                const p = document.createElement('p');
                p.textContent = recentSearch.search;

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(p);

                recentSearches.appendChild(newElementDiv);
            }
        }
    }
}


function deleteSearchText() {
    textarea.value = "";
    for(let element of DOMElementsForRecentSearches) {
        element.classList.remove('hidden');
    }
    deleteSearchTextButton.classList.add('hidden');
    displayDOMElementsForRecentSearches = true;
}


function handleInputChange(event) {
    const value = event.target.value;

    if(value.length==0) {
        for(let element of DOMElementsForRecentSearches) {
            element.classList.remove('hidden');
        }
        deleteSearchTextButton.classList.add('hidden');
        displayDOMElementsForRecentSearches = true;
    }
    else {
        if(displayDOMElementsForRecentSearches) {
            for(let element of DOMElementsForRecentSearches) {
                element.classList.add('hidden');
            }
            deleteSearchTextButton.classList.remove('hidden');
            displayDOMElementsForRecentSearches = false;
        }
    }
}


textarea.addEventListener('input', handleInputChange);
authenticateUser();