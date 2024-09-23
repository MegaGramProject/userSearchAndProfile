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
const profileUsername = document.getElementById('profileUsername').textContent;
const leftSidebar = document.getElementById('leftSidebar');
const accountNotFoundOrBlocksYou = document.getElementById('accountNotFoundOrBlocksYou');
const postsReelsTaggedSection = document.getElementById('postsReelsTaggedSection');
const profileUsernameAtTop = document.getElementById('profileUsernameAtTop');
const profileUsernameVerifiedCheck = document.getElementById('profileUsernameVerifiedCheck');
const profileFullName = document.getElementById('profileFullName');
const profileUserNumFollowers = document.getElementById('profileUserNumFollowers');
const profileUserNumFollowings = document.getElementById('profileUserNumFollowings');
const unblockButton = document.getElementById('unblockButton');
const unrequestButton = document.getElementById('unrequestButton');
const profileUserNumPosts = document.getElementById('profileUserNumPosts');
const optionToBlockOrUnblock = document.getElementById('optionToBlockOrUnblock');
const followedByText = document.getElementById('followedByText');


let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let displaySimilarAccounts = false;
let isFollowingUser = false;
let currentlyShownSection = "POSTS";
let displayListOfFollowersPopup = false;
let displayListOfFollowingsPopup = false;
let displayListOfMutualFollowersPopup = false;
let isUserBlocked = false;
let authenticatedUserFollowing = [];
let profileUserFollowers = [];
let profileUserFollowing = [];
let relevantProfileUserInfo;
let isRequestingFollow;
let mutualFollowers = []; //followers of profileUser that authenticatedUser follows
let relevantUserInfo = {}; //key: username(for all users in authenticatedUserFollowing, profileUserFollowers, and profileUserFollowing); value: relevantUserInfo


async function authenticateUser() {
    const username = document.getElementById('authenticatedUsername').textContent;
    if(username.length==0) {
        if(localStorage.getItem('authenticatedUsername')) {
            authenticatedUsername = localStorage.getItem('authenticatedUsername')
        }
        else {
            leftSidebar.classList.add('hidden');
            mainSection.classList.add('hidden');
            accountNotFoundOrBlocksYou.classList.remove('hidden');
            return;
        }
    }
    else {
        authenticatedUsername = username;
        localStorage.setItem('authenticatedUsername', authenticatedUsername);
    }
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

    const response = await fetch('http://localhost:8001/getRelevantUserInfoFromUsername/'+profileUsername);
    if(!response.ok) {
        //user probably doesn't exist
        leftSidebar.classList.add('hidden');
        mainSection.classList.add('hidden');
        accountNotFoundOrBlocksYou.classList.remove('hidden');
        return;
    }
    relevantProfileUserInfo = await response.json();


    const response2 = await fetch('http://localhost:8013/graphql', {
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
    if(!response2.ok) {
        throw new Error('Network response not ok');
    }
    let userBlockings = await response2.json();
    userBlockings = userBlockings['data']['getAllUserBlockings'];
    for(let i=0; i<userBlockings.length; i++) {
        if(userBlockings[i]['blocker']===authenticatedUsername && userBlockings[i]['blockee']===profileUsername) {
            isUserBlocked = true;
            unblockButton.classList.remove('hidden');
            postsReelsTaggedSection.classList.add('hidden');
            optionToBlockOrUnblock.textContent = 'Unblock';
            optionToBlockOrUnblock.onclick= unblockUser;
            break;
        }
        else if(userBlockings[i]['blocker']===profileUsername && userBlockings[i]['blockee']===authenticatedUsername){
            leftSidebar.classList.add('hidden');
            mainSection.classList.add('hidden');
            accountNotFoundOrBlocksYou.classList.remove('hidden');
            return;
        }
    }


    profileUsernameAtTop.classList.remove('hidden');
    if(relevantProfileUserInfo['isVerified']) {
        profileUsernameVerifiedCheck.classList.remove('hidden');
    }
    profileFullName.textContent = relevantProfileUserInfo['fullName'];

    //get bio and link

    if(isUserBlocked) {
        return;
    }


    //get my following list, their followers, and their following list
    const response3 = await fetch('http://localhost:8013/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: `
        query {
            getUserFollowingsForTwoUsers(users: { user1: "${authenticatedUsername}", user2: "${profileUsername}" })
        }
        `
        })
    });
    if(!response3.ok) {
        throw new Error('Network response not ok');
    }

    let followingsData = await response3.json();

    followingsData = followingsData['data']['getUserFollowingsForTwoUsers'];

    authenticatedUserFollowing = followingsData[0];
    profileUserFollowers = followingsData[1];
    profileUserFollowing = followingsData[2];
    profileUserNumFollowers.textContent = profileUserFollowers.length;
    profileUserNumFollowings.textContent = profileUserFollowing.length;
    if(authenticatedUserFollowing.includes(profileUsername)) {
        followingButton.classList.remove('hidden')
        isFollowingUser = true;
    }
    else {
        //check if isRequestingUser
        followButton.classList.remove('hidden');
    }
    mutualFollowers = authenticatedUserFollowing.filter(x=>profileUserFollowers.includes(x));
    if(mutualFollowers.length==1) {
        followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0];
        followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
        followedByText.classList.remove('hidden');
    }
    else if(mutualFollowers.length==2) {
        followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0] + ", " + "& " + mutualFollowers[1];
        followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
        followedByText.classList.remove('hidden');
    }
    else if(mutualFollowers.length>2) {
        followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0]+ ", " +  mutualFollowers[1] + ", + " + (mutualFollowers.length-2) + " more";
        followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
        followedByText.classList.remove('hidden');
    }

    const response4 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: [authenticatedUserFollowing, profileUserFollowers, profileUserFollowing].flat()
        })
    });
    if(!response4.ok) {
        throw new Error('Network response not ok');
    }
    relevantUserInfo = await response4.json();

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

async function toggleFollow() {
    if(!isFollowingUser) {
        if(relevantProfileUserInfo['isPrivate']) {
            //add follow-request via API-call
            followButton.classList.add('hidden');
            unrequestButton.classList.remove('hidden');
            isRequestingFollow = true;
        }
        else {
            const response = await fetch('http://localhost:8013/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        addUserFollowing(newUserFollowing: { follower: "${authenticatedUsername}", followee: "${profileUsername}" })
                    }
                    `
                    })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            followButton.classList.add('hidden');
            followingButton.classList.remove('hidden');
            profileUserFollowers.push(authenticatedUsername);
            profileUserNumFollowers.textContent = profileUserFollowers.length;
            isFollowingUser = true;
        }
    }
    else {
        const response = await fetch('http://localhost:8013/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        removeUserFollowing(userFollowingToRemove: { follower: "${authenticatedUsername}", followee: "${profileUsername}" })
                    }
                    `
                    })
            });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        followButton.classList.remove('hidden');
        followingButton.classList.add('hidden');
        profileUserFollowers = profileUserFollowers.filter(x=>x!==authenticatedUsername);
        profileUserNumFollowers.textContent = profileUserFollowers.length;
        isFollowingUser = false;
    }
}

async function unblockUser() {
    const response = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeUserBlocking(userBlockingToRemove: { blocker: "${authenticatedUsername}", blockee: "${profileUsername}" })
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }

    isUserBlocked = false;
    unblockButton.classList.add('hidden');
    postsReelsTaggedSection.classList.remove('hidden');
    followButton.classList.remove('hidden');
    optionToBlockOrUnblock.textContent = 'Block';
    optionToBlockOrUnblock.onclick= blockUser;

    if(authenticatedUserFollowing.length==0 && profileUserFollowers.length==0 && profileUserFollowing.length==0) {
        const response = await fetch('http://localhost:8013/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                query {
                    getUserFollowingsForTwoUsers(users: { user1: "${authenticatedUsername}", user2: "${profileUsername}" })
                }
                `
                })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
        
            let followingsData = await response.json();
        
            followingsData = followingsData['data']['getUserFollowingsForTwoUsers'];
        
            authenticatedUserFollowing = followingsData[0];
            profileUserFollowers = followingsData[1];
            profileUserFollowing = followingsData[2];
            mutualFollowers = authenticatedUserFollowing.filter(x=>profileUserFollowers.includes(x));
            if(mutualFollowers.length==1) {
                followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0];
                followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
                followedByText.classList.remove('hidden');
            }
            else if(mutualFollowers.length==2) {
                followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0] + ", " + "& " + mutualFollowers[1];
                followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
                followedByText.classList.remove('hidden');
            }
            else if(mutualFollowers.length>2) {
                followedByText.getElementsByTagName('span')[0].textContent = mutualFollowers[0]+ ", " +  mutualFollowers[1] + ", + " + (mutualFollowers.length-2) + " more";
                followedByText.getElementsByTagName('span')[0].classList.remove('hidden');
                followedByText.classList.remove('hidden');
            }

        const response2 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: [authenticatedUserFollowing, profileUserFollowers, profileUserFollowing].flat()
            })
        });
        if(!response2.ok) {
            throw new Error('Network response not ok');
        }
        relevantUserInfo = await response2.json();
        
    }
    profileUserNumFollowers.textContent = profileUserFollowers.length;
    profileUserNumFollowings.textContent = profileUserFollowing.length;
    cancelOptionsPopup();
}

async function cancelFollowRequest() {
    unrequestButton.classList.add('hidden');
    followButton.classList.remove('hidden');
    isRequestingFollow = false;
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

async function blockUser() {
    const response = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                addUserBlocking(newUserBlocking: { blocker: "${authenticatedUsername}", blockee: "${profileUsername}" })
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }

    isUserBlocked = true;
    followButton.classList.add('hidden');
    followingButton.classList.add('hidden');
    unrequestButton.classList.add('hidden');
    unblockButton.classList.remove('hidden');
    postsReelsTaggedSection.classList.add('hidden');

    if(isFollowingUser) {
        profileUserFollowers = profileUserFollowers.filter(x=>x!==authenticatedUsername);
    }
    profileUserFollowing = profileUserFollowing.filter(x=>x!==authenticatedUsername);
    isFollowingUser = false;
    profileUserNumFollowers.textContent = "";
    profileUserNumFollowings.textContent = "";
    optionToBlockOrUnblock.textContent = 'Unblock';
    optionToBlockOrUnblock.onclick= unblockUser;
    followedByText.classList.add('hidden');
    cancelOptionsPopup();

}



authenticateUser();