const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const showSimilarAccountsIcon = document.getElementById('showSimilarAccountsIcon');
const showSimilarAccountsIcon2 = document.getElementById('showSimilarAccountsIcon2');
const followButton = document.getElementById('followButton');
const followingButton = document.getElementById('followingButton');
const postsGridIcon = document.getElementById('postsGridIcon');
const postsGridIcon2 = document.getElementById('postsGridIcon2');
const postsText = document.getElementById('postsText');
const reelsIcon = document.getElementById('reelsIcon');
const reelsIcon2 = document.getElementById('reelsIcon2');
const reelsText = document.getElementById('reelsText');
const taggedPostsIcon = document.getElementById('taggedPostsIcon');
const taggedPostsIcon2 = document.getElementById('taggedPostsIcon2');
const taggedText = document.getElementById('taggedText');
const suggestedAccounts = document.getElementById('suggestedAccounts');
const listOfFollowersPopup = document.getElementById('listOfFollowersPopup');
const mainSection = document.getElementById('mainSection');
const listOfFollowingsPopup = document.getElementById('listOfFollowingsPopup');
const listOfMutualFollowersPopup = document.getElementById('listOfMutualFollowersPopup');
const optionsPopup = document.getElementById('optionsPopup');

let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let displaySimilarAccounts = false;
let isFollowingUser = false;
let currentlyShownSection = "POSTS";
let displayListOfFollowersPopup = false;
let displayListOfFollowingsPopup = false;
let displayListOfMutualFollowersPopup = false;


async function authenticateUser() {
    const username = document.getElementById('authenticatedUsername').textContent;
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

function takeUserHome() {
    window.location.href = "http://localhost:3100/" + authenticatedUsername;
}

function takeUserToSearch() {
    window.location.href = "http://localhost:8019/search/" + authenticatedUsername;
}

function takeUserToMessages() {
    window.location.href = "http://localhost:8011/directMessaging/" + authenticatedUsername;
}

function toggleLeftSidebarPopup() {
    displayLeftSidebarPopup = !displayLeftSidebarPopup;
    if(displayLeftSidebarPopup) {
        leftSidebarPopup.classList.remove('hidden');
    }
    else {
        leftSidebarPopup.classList.add('hidden');
    }

}

function takeUserToOwnProfile() {
    window.location.href = "http://localhost:8019/profilePage/" + authenticatedUsername;
}

function takeUserToLogin() {
    window.location.href = "http://localhost:8000/login";
}

function toggleSimilarAccounts() {
    displaySimilarAccounts = !displaySimilarAccounts;
    if(displaySimilarAccounts) {
        showSimilarAccountsIcon.classList.add('hidden');
        showSimilarAccountsIcon2.classList.remove('hidden');
        suggestedAccounts.classList.remove('hidden');
    }
    else {
        showSimilarAccountsIcon.classList.remove('hidden');
        showSimilarAccountsIcon2.classList.add('hidden');
        suggestedAccounts.classList.add('hidden');
    }
}

function toggleFollow() {
    isFollowingUser = !isFollowingUser;
    if(isFollowingUser) {
        followButton.classList.add('hidden');
        followingButton.classList.remove('hidden');
    }
    else {
        followButton.classList.remove('hidden');
        followingButton.classList.add('hidden');
    }
}

function showReels() {
    if(currentlyShownSection!=='REELS') {
        if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
        }
        else if(currentlyShownSection==='TAGGED') {
            taggedPostsIcon.classList.remove('hidden');
            taggedPostsIcon2.classList.add('hidden');
            taggedText.style['color'] = "";
            taggedText.style['font-size'] = "";
        }

        reelsIcon.classList.add('hidden');
        reelsIcon2.classList.remove('hidden');
        reelsText.style['color'] = "black";
        reelsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'REELS';
    }
    else {
        //refresh the reels
    }
}

function showPosts() {
    if(currentlyShownSection!=='POSTS') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
        }
        else if(currentlyShownSection==='TAGGED') {
            taggedPostsIcon.classList.remove('hidden');
            taggedPostsIcon2.classList.add('hidden');
            taggedText.style['color'] = "";
            taggedText.style['font-size'] = "";
        }

        postsGridIcon.classList.add('hidden');
        postsGridIcon2.classList.remove('hidden');
        postsText.style['color'] = "black";
        postsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'POSTS';
    }
    else {
        //refresh the posts
    }

}

function showTaggedPosts() {
    if(currentlyShownSection!=='TAGGED') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
        }
        else if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
        }

        taggedPostsIcon.classList.add('hidden');
        taggedPostsIcon2.classList.remove('hidden');
        taggedText.style['color'] = "black";
        taggedText.style['font-size'] = "1.15em";
        currentlyShownSection = 'TAGGED';
    }
    else {
        //refresh the reels
    }

}

function closeListOfFollowersPopup() {
    displayListOfFollowersPopup = false;
    listOfFollowersPopup.classList.add('hidden');
    mainSection.style['background-color']= 'white';
    mainSection.style['pointer-events']= 'auto';
}

function messageUser() {
    window.location.href = "http://localhost:8011/directMessaging/"+authenticatedUsername;
}

function showListOfFollowersPopup() {
    displayListOfFollowersPopup = true;
    listOfFollowersPopup.classList.remove('hidden');
    mainSection.style['background-color'] = 'gray';
    mainSection.style['pointer-events']= 'none';
    listOfFollowersPopup.style['pointer-events']= 'auto';
}

function takeToUsersProfile(username) {
    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername + "/" + username;
}

function showListOfFollowingsPopup() {
    displayListOfFollowingsPopup = true;
    listOfFollowingsPopup.classList.remove('hidden');
    mainSection.style['background-color'] = 'gray';
    mainSection.style['pointer-events']= 'none';
    listOfFollowingsPopup.style['pointer-events']= 'auto';
}

function closeListOfFollowingsPopup() {
    displayListOfFollowingsPopup = false;
    listOfFollowingsPopup.classList.add('hidden');
    mainSection.style['background-color']= 'white';
    mainSection.style['pointer-events']= 'auto';
}


function toggleFollowInPopup(popupName, username) {
    let followButtonToToggle = document.getElementById(popupName+"Follow"+username);
    let followingButtonToToggle = document.getElementById(popupName+"Following"+username);

    if(followButtonToToggle.classList.contains('hidden')) {
        followButtonToToggle.classList.remove('hidden');
        followingButtonToToggle.classList.add('hidden');
    }
    else {
        followButtonToToggle.classList.add('hidden');
        followingButtonToToggle.classList.remove('hidden');
    }
}

function removeSuggestedAccount(username) {
    const suggestedAccountDivToRemove = document.getElementById('suggestedAccount' + username);
    suggestedAccountDivToRemove.style['display'] = 'none';
}

function showListOfMutualFollowersPopup() {
    displayListOfMutualFollowersPopup = true;
    listOfMutualFollowersPopup.classList.remove('hidden');
    mainSection.style['background-color'] = 'gray';
    mainSection.style['pointer-events']= 'none';
    listOfMutualFollowersPopup.style['pointer-events']= 'auto';
}

function closeListOfMutualFollowersPopup() {
    displayListOfMutualFollowersPopup = false;
    listOfMutualFollowersPopup.classList.add('hidden');
    mainSection.style['background-color']= 'white';
    mainSection.style['pointer-events']= 'auto';
}

function cancelOptionsPopup() {
    optionsPopup.classList.add('hidden');
    mainSection.style['background-color']= 'white';
    mainSection.style['pointer-events']= 'auto';
}


function showOptionsPopup() {
    optionsPopup.classList.remove('hidden');
    mainSection.style['background-color'] = 'gray';
    mainSection.style['pointer-events']= 'none';
    optionsPopup.style['pointer-events']= 'auto';
}

function showNumLikesAndCommentsOfPost(postId) {
    let DOMElementsToShow =
    [
        document.getElementById(postId+'WhiteHeartIcon'),
        document.getElementById(postId+'NumLikes'),
        document.getElementById(postId+'WhiteCommentIcon'),
        document.getElementById(postId+'NumComments'),
    ];
    for(let element of DOMElementsToShow) {
        element.classList.remove('hidden');
    }
    let postImage = document.getElementById(postId);
    postImage.style['opacity'] = '0.85';
}


function hideNumLikesAndCommentsOfPost(postId) {
    let DOMElementsToHide =
    [
        document.getElementById(postId+'WhiteHeartIcon'),
        document.getElementById(postId+'NumLikes'),
        document.getElementById(postId+'WhiteCommentIcon'),
        document.getElementById(postId+'NumComments'),
    ];
    for(let element of DOMElementsToHide) {
        element.classList.add('hidden');
    }
    let postImage = document.getElementById(postId);
    postImage.style['opacity'] = '1';
}



authenticateUser();