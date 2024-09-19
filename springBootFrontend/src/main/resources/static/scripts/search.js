const textarea = document.getElementById('searchTextArea');
const recentHeader = document.getElementById('recentHeader');
const noRecentSearches = document.getElementById('noRecentSearches');
const recentSearches = document.getElementById('recentSearches');
const deleteSearchTextButton = document.getElementById('deleteSearchTextButton');
const topicsHeader = document.getElementById('topicsHeader');
const topics = document.getElementById('topics');
const usersHeader = document.getElementById('usersHeader');
const noUsers = document.getElementById('noUsers');
const users = document.getElementById('users');

let displayDOMElementsForRecentSearches = true;
let authenticatedUsername = "";
let recentSearchesOfUser = [];
let DOMElementsForRecentSearches = [recentHeader];
let DOMElementsForSearchResults = [topicsHeader, topics, usersHeader];
let searchResults = [];


async function authenticateUser() {
    const username = document.getElementById('usernameInURL').textContent;
    authenticatedUsername = username;
    /*
    const response = await fetch('http://localhost:8003/cookies/authenticateUser/'+username, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
        });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    const isAuth = await response.json();
    if(isAuth) {
        authenticatedUsername = username;
        await fetchRecentSearchesOfAuthenticatedUser();
        return;
    }
    else {
        const data = {'username':username};
        const response2 = await fetch('http://localhost:8003/cookies/updateAuthToken', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if(!response2.ok) {
            throw new Error('Network response not ok');
        }
        const response2Data = await response2.text();
        if(response2Data === "Cookie updated successfully") {
            const response3 = await fetch('http://localhost:8003/cookies/authenticateUser/'+username, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if(!response3.ok) {
                throw new Error('Network response not ok');
            }
            const isAuth = await response.json();
            if(isAuth) {
                authenticatedUsername = username;
                await fetchRecentSearchesOfAuthenticatedUser();
                return;
            }
        }
        else if(response2Data === "Invalid refresh token for username") {
            const response4 = await fetch('http://localhost:8003/cookies/updateRefreshToken', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            if(!response4.ok) {
                throw new Error('Network response not ok');
            }
            const response4Data = await response4.text();
            if(response4Data === "Cookie updated successfully"){
                const response5 = await fetch('http://localhost:8003/cookies/authenticateUser/'+username, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                if(!response5.ok) {
                    throw new Error('Network response not ok');
                }
                const isAuth = await response.json();
                if(isAuth) {
                    authenticatedUsername = username;
                    await fetchRecentSearchesOfAuthenticatedUser();
                    return;
                }
                }
            }
            window.location.href = "http://localhost:8000/login";
            }
            */
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

                newElementDiv.addEventListener('click', function() {
                    window.location.href = "http://localhost:8019/profilePage/" + authenticatedUsername+"/" + recentSearch.search;
                });

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

                newElementDiv.addEventListener('click', function() {
                    window.location.href = "http://localhost:8019/postsMatchingTopic/"+authenticatedUsername+"/" + recentSearch.search;
                });

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
    for(let element of DOMElementsForSearchResults) {
        element.classList.add('hidden');
    }
    deleteSearchTextButton.classList.add('hidden');
    displayDOMElementsForRecentSearches = true;
}


async function handleInputChange(event) {
    const value = event.target.value;

    if(value.length==0) {
        for(let element of DOMElementsForRecentSearches) {
            element.classList.remove('hidden');
        }
        for(let element of DOMElementsForSearchResults) {
            element.classList.add('hidden');
        }
        deleteSearchTextButton.classList.add('hidden');
        displayDOMElementsForRecentSearches = true;
    }
    else {
        while(topics.firstChild) {
            topics.removeChild(topics.firstChild);
        }
        while(users.firstChild) {
            users.removeChild(users.firstChild);
        }

        await fetchSearchResults(value);
        let displayUsersDiv = false;

        const newElement = document.createElement('div');
        newElement.className = 'hoverableElement';
        newElement.style.width = '95%';
        newElement.style.cursor = 'pointer';
        newElement.style.height = '5em';
        newElement.style.display = 'flex';
        newElement.style.justifyContent = 'start';
        newElement.style.alignItems = 'center';
        newElement.style.borderRadius = '1em';
        newElement.style.padding = '0.5em 1em';

        const newImg = document.createElement('img');
        newImg.src = '/images/searchIcon.png';
        newImg.style.height = '85%';
        newImg.style.width = '7%';
        newImg.style.objectFit = 'contain';

        const newP = document.createElement('p');
        newP.textContent = value;

        newElement.appendChild(newImg);
        newElement.appendChild(newP);

        newElement.addEventListener('click', function() {
            window.location.href = "http://localhost:8019/postsMatchingTopic/"+authenticatedUsername+"/"+value;
        });

        topics.appendChild(newElement);

        for(let searchResult of searchResults) {
            if(searchResult.type_of_search==='username') {
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
                b.textContent = searchResult.search;
                if(searchResult.search_isVerified) {
                    const verifiedCheckImgElement = document.createElement('img');
                    verifiedCheckImgElement.src = '/images/verifiedCheck.png';
                    verifiedCheckImgElement.style.height = '1.2em';
                    verifiedCheckImgElement.style.width = '1.2em';
                    verifiedCheckImgElement.style.objectFit = 'contain';
                    b.appendChild(verifiedCheckImgElement);
                }
                const p = document.createElement('p');
                p.style.color = 'gray';
                p.textContent = searchResult.search_fullname;
        
                innerDiv.appendChild(b);
                innerDiv.appendChild(p);

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(innerDiv);

                newElementDiv.addEventListener('click', function() {
                    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername+"/"+searchResult.search;
                });

                users.appendChild(newElementDiv);
                displayUsersDiv = true;
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
                p.textContent = searchResult.search;

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(p);

                newElementDiv.addEventListener('click', function() {
                    window.location.href = "http://localhost:8019/postsMatchingTopic/"+authenticatedUsername+"/" + searchResult.search;
                });

                topics.appendChild(newElementDiv);
            }
        }
        if(displayDOMElementsForRecentSearches) {
            for(let element of DOMElementsForRecentSearches) {
                element.classList.add('hidden');
            }
            for(let element of DOMElementsForSearchResults) {
                element.classList.remove('hidden');
            }
            deleteSearchTextButton.classList.remove('hidden');
            displayDOMElementsForRecentSearches = false;
        }
        if(displayUsersDiv) {
            users.classList.remove('hidden');
            noUsers.classList.add('hidden');
        }
        else {
            users.classList.add('hidden');
            noUsers.classList.remove('hidden');
        }
    }
}

async function fetchSearchResults(searchText) {
    /*
    const response = await fetch('http://localhost:8020/searchResults/'+authenticatedUsername+'/'+searchText);
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    searchResults = await response.json();
    */
    searchResults = [
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
        }
    ];

}


textarea.addEventListener('input', handleInputChange);
authenticateUser();