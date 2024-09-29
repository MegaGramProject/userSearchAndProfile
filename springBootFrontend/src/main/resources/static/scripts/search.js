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
const clearAllRecentSearches = document.getElementById('clearAllRecentSearches');

let displayDOMElementsForRecentSearches = true;
let authenticatedUsername = "";
let recentSearchesOfUser = [];
let DOMElementsForRecentSearches = [recentHeader];
let DOMElementsForSearchResults = [topicsHeader, topics, usersHeader];
let searchResults = [];
let recentUserSearches = [];
let recentTopicSearches = [];
let usersFollowed = ['rishavry4', 'rishavry5', 'rishavry7', 'rishavry2'];
let userBlockings = ['rishavry7'];
let currentlyHoveredSearchId = "";
let currentlyHoveredSearchIdBeforeMouseEnter = "";

async function authenticateUser() {
    const username = document.getElementById('usernameInURL').textContent;
    authenticatedUsername = username;
    fetchRecentSearchesOfAuthenticatedUser();
    //fetchUsersFollowedByAuthenticatedUser();
    //fetchUserBlockingsInvolvingAuthenticatedUser();


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
        `fetchRecentSearchesOfAuthenticatedUser();
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
                fetchRecentSearchesOfAuthenticatedUser();
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
                    fetchRecentSearchesOfAuthenticatedUser();
                    return;
                }
                }
            }
            window.location.href = "http://localhost:8000/login";
            }
            */
}

async function fetchUsersFollowedByAuthenticatedUser() {
    const response = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query {
                getAllUserFollowings(filter: { username: "${authenticatedUsername}" }) {
                    followee
                }
            }
            `
            })
        });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    usersFollowed = await response2.json();
    usersFollowed = usersFollowed['data']['getAllUserFollowings'];
    usersFollowed = usersFollowed.filter(userFollowed => userFollowed['followee']!==authenticatedUsername);
}

async function fetchUserBlockingsInvolvingAuthenticatedUser() {
    const response = await ('http://localhost:8013/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query {
                getAllUserBlockings(filter: { username: "${authenticatedUsername}" }) {
                    blocker
                    blockee
                }
            }
            `
            })
        });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    userBlockings = await response.json();
    userBlockings = userBlockings['data']['getAllUserBlockings'];
    for(let i=0; i<userBlockings.length; i++) {
        if(userBlockings[i]['blocker']===authenticatedUsername) {
            userBlockings[i] = userBlockings[i]['blockee'];
        }
        else {
            userBlockings[i] = userBlockings[i]['blocker'];
        }
    }
}

async function fetchRecentSearchesOfAuthenticatedUser() {
    const response = await fetch('http://localhost:8020/api/recentSearchesOfUser/'+authenticatedUsername);
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    recentSearchesOfUser = await response.json();

    if(recentSearchesOfUser.length==0) {
        noRecentSearches.classList.remove('hidden');
        recentSearches.classList.add('hidden');
        clearAllRecentSearches.classList.add('hidden');
        DOMElementsForRecentSearches.push(noRecentSearches);
    }
    else {
        noRecentSearches.classList.add('hidden');
        recentSearches.classList.remove('hidden');
        clearAllRecentSearches.classList.remove('hidden');
        DOMElementsForRecentSearches.push(recentSearches);
        DOMElementsForRecentSearches.push(clearAllRecentSearches);

        for(let i=0; i<recentSearchesOfUser.length; i++) {
            const recentSearch = recentSearchesOfUser[i];
            if(recentSearch.type_of_search==='user') {
                recentUserSearches.push(recentSearch.search);
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "recentSearch"+i;
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em'
                newElementDiv.style.position = 'relative';

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
                if(recentSearch.search_isverified) {
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

                const deleteRecentSearchIcon = document.createElement('img');
                deleteRecentSearchIcon.src = '/images/thinGrayXIcon.png';
                deleteRecentSearchIcon.style.height = '30%';
                deleteRecentSearchIcon.style.width = '30%';
                deleteRecentSearchIcon.style.objectFit = 'contain';
                deleteRecentSearchIcon.style.position = 'absolute';
                deleteRecentSearchIcon.style.left = '70%';
                deleteRecentSearchIcon.style.top = '40%';
                deleteRecentSearchIcon.style.display = 'none';
                deleteRecentSearchIcon.addEventListener('click', async function(event) {
                    event.stopPropagation();
                    const response = await fetch('http://localhost:8020/api/deleteRecentSearch', {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'user',
                            search: recentSearch.search
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    recentSearchesOfUser.splice(i,1);
                    DOMElementsForRecentSearches = [recentHeader];
                    recentUserSearches = [];
                    recentTopicSearches = [];
                    currentlyHoveredSearchId = "";
                    updateUIAfterRemovingRecentSearches();
                    
                });


                newElementDiv.appendChild(img);
                newElementDiv.appendChild(innerDiv);
                newElementDiv.appendChild(deleteRecentSearchIcon);

                newElementDiv.addEventListener('click', async function() {
                    const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'user',
                            search: recentSearch.search,
                            date_time_of_search: new Date()
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    window.location.href = "http://localhost:8019/profilePage/" + authenticatedUsername+"/" + recentSearch.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    deleteRecentSearchIcon.style.display = 'inline-block';
                    currentlyHoveredSearchIdBeforeMouseEnter = currentlyHoveredSearchId;
                    if(currentlyHoveredSearchIdBeforeMouseEnter!=='recentSearch'+i) {
                        updateCurrentlyHoveredSearchId("recentSearch"+i);
                    }
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    deleteRecentSearchIcon.style.display = 'none';
                    if(currentlyHoveredSearchIdBeforeMouseEnter!==currentlyHoveredSearchId) {
                        updateCurrentlyHoveredSearchId('');
                    }
                });

                recentSearches.appendChild(newElementDiv);
            }
            else {
                recentTopicSearches.push(recentSearch.search);
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "recentSearch"+i;
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.alignItems = 'center';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em';
                newElementDiv.style.position = 'relative';

                const img = document.createElement('img');
                img.src = '/images/searchIcon.png';
                img.style.height = '85%';
                img.style.width = '7%';
                img.style.objectFit = 'contain';

                const p = document.createElement('p');
                p.textContent = recentSearch.search;

                const deleteRecentSearchIcon = document.createElement('img');
                deleteRecentSearchIcon.src = '/images/thinGrayXIcon.png';
                deleteRecentSearchIcon.style.height = '30%';
                deleteRecentSearchIcon.style.width = '30%';
                deleteRecentSearchIcon.style.objectFit = 'contain';
                deleteRecentSearchIcon.style.position = 'absolute';
                deleteRecentSearchIcon.style.left = '70%';
                deleteRecentSearchIcon.style.top = '40%';
                deleteRecentSearchIcon.style.display = 'none';
                deleteRecentSearchIcon.addEventListener('click', async function(event) {
                    event.stopPropagation();
                    const response = await fetch('http://localhost:8020/api/deleteRecentSearch', {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'topic',
                            search: recentSearch.search
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    recentSearchesOfUser.splice(i,1);
                    DOMElementsForRecentSearches = [recentHeader];
                    recentUserSearches = [];
                    recentTopicSearches = [];
                    currentlyHoveredSearchId = "";
                    updateUIAfterRemovingRecentSearches();
                    
                });

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(p);
                newElementDiv.appendChild(deleteRecentSearchIcon);

                newElementDiv.addEventListener('click', async function() {
                    const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'topic',
                            search: recentSearch.search,
                            date_time_of_search: new Date()
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    window.location.href = "http://localhost:8019/topicMatches/"+authenticatedUsername+"/" + recentSearch.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    deleteRecentSearchIcon.style.display = 'inline-block';
                    currentlyHoveredSearchIdBeforeMouseEnter = currentlyHoveredSearchId;
                    if(currentlyHoveredSearchIdBeforeMouseEnter!=='recentSearch'+i) {
                        updateCurrentlyHoveredSearchId("recentSearch"+i);
                    }
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    deleteRecentSearchIcon.style.display = 'none';
                    if(currentlyHoveredSearchIdBeforeMouseEnter!==currentlyHoveredSearchId) {
                        updateCurrentlyHoveredSearchId('');
                    }
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
    noUsers.classList.add('hidden');
    users.classList.add('hidden');
    deleteSearchTextButton.classList.add('hidden');
    displayDOMElementsForRecentSearches = true;
}

async function deleteAllRecentSearches() {
    const response = await fetch('http://localhost:8020/api/clearAllRecentSearches/'+authenticatedUsername, {
        method: 'DELETE'
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    DOMElementsForRecentSearches = [recentHeader];
    recentSearchesOfUser = [];
    recentUserSearches = [];
    recentTopicSearches = [];
    while(recentSearches.firstChild) {
        recentSearches.removeChild(recentSearches.firstChild);
    }
    clearAllRecentSearches.classList.add('hidden');
    DOMElementsForRecentSearches.push(noRecentSearches);
    noRecentSearches.classList.remove('hidden');
    recentSearches.classList.add('hidden');

}

function takeUserHome() {
    window.location.href = "http://localhost:3100/"+authenticatedUsername;
}


async function handleInputChange(event) {
    const value = event.target.value;
    if (value.includes('\n') || value[0]===" ") {
        return;
    }
    updateCurrentlyHoveredSearchId("");

    if(value.length==0) {
        for(let element of DOMElementsForRecentSearches) {
            element.classList.remove('hidden');
        }
        for(let element of DOMElementsForSearchResults) {
            element.classList.add('hidden');
        }
        noUsers.classList.add('hidden');
        users.classList.add('hidden');
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

        
        const response = await fetch('http://localhost:8020/api/searchResults/'+authenticatedUsername+'/'+value, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userBlockings: userBlockings,
                usersFollowed: usersFollowed,
                recentUserSearches: recentUserSearches,
                recentTopicSearches: recentTopicSearches
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        searchResults = await response.json();
        if(value in searchResults) {
            searchResults = searchResults[value];
        }
        else {
            return;
        }

        let displayUsersDiv = false;

        for(let i=0; i<searchResults.length; i++) {
            const searchResult = searchResults[i];
            if(searchResult.type_of_search==='user') {
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "searchResult"+i;
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
                if(searchResult.search_isverified) {
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

                newElementDiv.addEventListener('click', async function() {
                    if(recentUserSearches.includes(searchResult.search)) {
                        const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                            method: 'PATCH',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username: authenticatedUsername,
                                type_of_search: 'user',
                                search: searchResult.search,
                                date_time_of_search: new Date()
                            })
                        });
                        if(!response.ok) {
                            throw new Error('Network response not ok');
                        }
                    }
                    else {
                        const response = await fetch('http://localhost:8020/api/addRecentSearch', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username: authenticatedUsername,
                                type_of_search: 'user',
                                search: searchResult.search,
                                date_time_of_search: new Date(),
                                search_isverified: searchResult.search_isverified,
                                search_fullname: searchResult.search_fullname
                            })
                        });
                        if(!response.ok) {
                            throw new Error('Network response not ok');
                        }
                    }
                    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername+"/"+searchResult.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    currentlyHoveredSearchIdBeforeMouseEnter = currentlyHoveredSearchId;
                    if(currentlyHoveredSearchIdBeforeMouseEnter!=="searchResult"+i) {
                        updateCurrentlyHoveredSearchId("searchResult"+i);
                    }
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    if(currentlyHoveredSearchIdBeforeMouseEnter!==currentlyHoveredSearchId) {
                        updateCurrentlyHoveredSearchId('');
                    }
                });

                users.appendChild(newElementDiv);
                displayUsersDiv = true;
            }
            else {
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "searchResult"+i;
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

                newElementDiv.addEventListener('click', async function() {
                    if(recentUserSearches.includes(searchResult.search)) {
                        const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                            method: 'PATCH',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username: authenticatedUsername,
                                type_of_search: 'topic',
                                search: searchResult.search,
                                date_time_of_search: new Date()
                            })
                        });
                        if(!response.ok) {
                            throw new Error('Network response not ok');
                        }
                    }
                    else {
                        const response = await fetch('http://localhost:8020/api/addRecentSearch', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username: authenticatedUsername,
                                type_of_search: 'topic',
                                search: searchResult.search,
                                date_time_of_search: new Date(),
                                search_isverified: null,
                                search_fullname: null
                            })
                        });
                        if(!response.ok) {
                            throw new Error('Network response not ok');
                        }
                    }
                    window.location.href = "http://localhost:8019/topicMatches/"+authenticatedUsername+"/" + searchResult.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    currentlyHoveredSearchIdBeforeMouseEnter = currentlyHoveredSearchId;
                    if(currentlyHoveredSearchIdBeforeMouseEnter!=="searchResult"+i) {
                        updateCurrentlyHoveredSearchId("searchResult"+i);
                    }
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    if(currentlyHoveredSearchIdBeforeMouseEnter!==currentlyHoveredSearchId) {
                        updateCurrentlyHoveredSearchId('');
                    }
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

function updateUIAfterRemovingRecentSearches() {
    while(recentSearches.firstChild) {
        recentSearches.removeChild(recentSearches.firstChild);
    }
    if(recentSearchesOfUser.length==0) {
        noRecentSearches.classList.remove('hidden');
        recentSearches.classList.add('hidden');
        clearAllRecentSearches.classList.add('hidden');
        DOMElementsForRecentSearches.push(noRecentSearches);
    }
    else {
        noRecentSearches.classList.add('hidden');
        recentSearches.classList.remove('hidden');
        clearAllRecentSearches.classList.remove('hidden');
        DOMElementsForRecentSearches.push(recentSearches);
        DOMElementsForRecentSearches.push(clearAllRecentSearches);

        for(let i=0; i<recentSearchesOfUser.length; i++) {
            const recentSearch = recentSearchesOfUser[i];
            if(recentSearch.type_of_search==='user') {
                recentUserSearches.push(recentSearch.search);
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "recentSearch"+i;
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em'
                newElementDiv.style.position = 'relative';

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
                if(recentSearch.search_isverified) {
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

                const deleteRecentSearchIcon = document.createElement('img');
                deleteRecentSearchIcon.src = '/images/thinGrayXIcon.png';
                deleteRecentSearchIcon.style.height = '30%';
                deleteRecentSearchIcon.style.width = '30%';
                deleteRecentSearchIcon.style.objectFit = 'contain';
                deleteRecentSearchIcon.style.position = 'absolute';
                deleteRecentSearchIcon.style.left = '70%';
                deleteRecentSearchIcon.style.top = '40%';
                deleteRecentSearchIcon.style.display = 'none';
                deleteRecentSearchIcon.addEventListener('click', async function(event) {
                    event.stopPropagation();
                    const response = await fetch('http://localhost:8020/api/deleteRecentSearch', {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'user',
                            search: recentSearch.search
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    recentSearchesOfUser.splice(i,1);
                    DOMElementsForRecentSearches = [recentHeader];
                    recentUserSearches = [];
                    recentTopicSearches = [];
                    currentlyHoveredSearchId = "";
                    updateUIAfterRemovingRecentSearches();
                    
                });


                newElementDiv.appendChild(img);
                newElementDiv.appendChild(innerDiv);
                newElementDiv.appendChild(deleteRecentSearchIcon);

                newElementDiv.addEventListener('click', async function() {
                    const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'user',
                            search: recentSearch.search,
                            date_time_of_search: new Date()
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    window.location.href = "http://localhost:8019/profilePage/" + authenticatedUsername+"/" + recentSearch.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    deleteRecentSearchIcon.style.display = 'inline-block';
                    currentlyHoveredSearchIdBeforeMouseEnter = currentlyHoveredSearchId;
                    if(currentlyHoveredSearchIdBeforeMouseEnter!=='recentSearch'+i) {
                        updateCurrentlyHoveredSearchId("recentSearch"+i);
                    }
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    deleteRecentSearchIcon.style.display = 'none';
                    if(currentlyHoveredSearchIdBeforeMouseEnter!==currentlyHoveredSearchId) {
                        updateCurrentlyHoveredSearchId('');
                    }
                });

                recentSearches.appendChild(newElementDiv);
            }
            else {
                recentTopicSearches.push(recentSearch.search);
                const newElementDiv = document.createElement('div');
                newElementDiv.id = "recentSearch"+i;
                newElementDiv.style.width = '95%';
                newElementDiv.style.cursor = 'pointer';
                newElementDiv.style.height = '5em';
                newElementDiv.style.display = 'flex';
                newElementDiv.style.justifyContent = 'start';
                newElementDiv.style.alignItems = 'center';
                newElementDiv.style.borderRadius = '1em';
                newElementDiv.style.padding = '0.5em 1em';
                newElementDiv.style.position = 'relative';

                const img = document.createElement('img');
                img.src = '/images/searchIcon.png';
                img.style.height = '85%';
                img.style.width = '7%';
                img.style.objectFit = 'contain';

                const p = document.createElement('p');
                p.textContent = recentSearch.search;

                const deleteRecentSearchIcon = document.createElement('img');
                deleteRecentSearchIcon.src = '/images/thinGrayXIcon.png';
                deleteRecentSearchIcon.style.height = '30%';
                deleteRecentSearchIcon.style.width = '30%';
                deleteRecentSearchIcon.style.objectFit = 'contain';
                deleteRecentSearchIcon.style.position = 'absolute';
                deleteRecentSearchIcon.style.left = '70%';
                deleteRecentSearchIcon.style.top = '40%';
                deleteRecentSearchIcon.style.display = 'none';
                deleteRecentSearchIcon.addEventListener('click', async function(event) {
                    event.stopPropagation();
                    const response = await fetch('http://localhost:8020/api/deleteRecentSearch', {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'topic',
                            search: recentSearch.search
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    recentSearchesOfUser.splice(i,1);
                    DOMElementsForRecentSearches = [recentHeader];
                    recentUserSearches = [];
                    recentTopicSearches = [];
                    currentlyHoveredSearchId = "";
                    updateUIAfterRemovingRecentSearches();
                    
                });

                newElementDiv.appendChild(img);
                newElementDiv.appendChild(p);
                newElementDiv.appendChild(deleteRecentSearchIcon);

                newElementDiv.addEventListener('click', async function() {
                    const response = await fetch('http://localhost:8020/api/editRecentSearch', {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            username: authenticatedUsername,
                            type_of_search: 'topic',
                            search: recentSearch.search,
                            date_time_of_search: new Date()
                        })
                    });
                    if(!response.ok) {
                        throw new Error('Network response not ok');
                    }
                    window.location.href = "http://localhost:8019/topicMatches/"+authenticatedUsername+"/" + recentSearch.search;
                });

                newElementDiv.addEventListener('mouseenter', function() {
                    deleteRecentSearchIcon.style.display = 'inline-block';
                    updateCurrentlyHoveredSearchId('recentSearch'+i);
                });

                newElementDiv.addEventListener('mouseleave', function() {
                    deleteRecentSearchIcon.style.display = 'none';
                    updateCurrentlyHoveredSearchId('');
                });

                recentSearches.appendChild(newElementDiv);
            }
        }
    }

}

function updateCurrentlyHoveredSearchId(searchId) {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if(currentlyHoveredSearchId.length>0) {
        if(isDarkMode) {
            document.getElementById(currentlyHoveredSearchId).style['background-color'] = '#232324';
        }
        else {
            document.getElementById(currentlyHoveredSearchId).style['background-color'] = 'white';
        }
    }
    if(searchId.length>0) {
        if(isDarkMode) {
            document.getElementById(searchId).style['background-color'] = 'rgba(0,0,0,0.1)';
        }
        else {
            document.getElementById(searchId).style['background-color'] = '#dbdbdb';
        }
    }
    currentlyHoveredSearchId = searchId;
}

textarea.addEventListener('input', handleInputChange);
textarea.addEventListener('click', function() {
    updateCurrentlyHoveredSearchId("");
});


document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        if(currentlyHoveredSearchId.startsWith('recentSearch')) {
            let idNumber = parseInt(currentlyHoveredSearchId.substring(12));
            if(idNumber+1==recentSearchesOfUser.length) {
                updateCurrentlyHoveredSearchId('recentSearch0');
            }
            else {
                idNumber++;
                updateCurrentlyHoveredSearchId('recentSearch'+idNumber);
            }
        }
        else if(currentlyHoveredSearchId.startsWith('searchResult')) {
            let idNumber = parseInt(currentlyHoveredSearchId.substring(12));
            if(idNumber+1==searchResults.length) {
                updateCurrentlyHoveredSearchId('searchResult0');
            }
            else {
                idNumber++;
                updateCurrentlyHoveredSearchId('searchResult'+idNumber);
            }
        }
        else if(currentlyHoveredSearchId==="") {
            if(displayDOMElementsForRecentSearches) {
                if(recentSearchesOfUser.length>0) {
                    updateCurrentlyHoveredSearchId('recentSearch0');
                }
            }
            else {
                updateCurrentlyHoveredSearchId('searchResult0');
            }
        }

    } else if (event.key === 'ArrowUp') {
        if(currentlyHoveredSearchId.startsWith('recentSearch')) {
            let idNumber = parseInt(currentlyHoveredSearchId.substring(12));
            if(idNumber==0) {
                idNumber = recentSearchesOfUser.length - 1;
                updateCurrentlyHoveredSearchId('recentSearch'+idNumber);
            }
            else {
                idNumber--;
                updateCurrentlyHoveredSearchId('recentSearch'+idNumber);
            }
        }
        else if(currentlyHoveredSearchId.startsWith('searchResult')) {
            let idNumber = parseInt(currentlyHoveredSearchId.substring(12));
            if(idNumber==0) {
                idNumber = searchResults.length-1;
                updateCurrentlyHoveredSearchId('searchResult'+idNumber);
            }
            else {
                idNumber--;
                updateCurrentlyHoveredSearchId('searchResult'+idNumber);
            }
        }
        else if(currentlyHoveredSearchId==="") {
            if(displayDOMElementsForRecentSearches) {
                idNumber = recentSearchesOfUser.length - 1;
                updateCurrentlyHoveredSearchId('recentSearch'+idNumber);
            }
            else {
                idNumber = searchResults.length-1;
                updateCurrentlyHoveredSearchId('searchResult'+idNumber);
            }
        }
        
    }
    else if(event.key === 'Enter') {
        if(currentlyHoveredSearchId!=="") {
            document.getElementById(currentlyHoveredSearchId).click();
        }
    }
});





authenticateUser();