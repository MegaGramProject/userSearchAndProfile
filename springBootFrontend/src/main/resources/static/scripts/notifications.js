const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const redDotForFollowRequests = document.getElementById('redDotForFollowRequests');
const followRequestsText = document.getElementById('followRequestsText');
const redDotForNotifications = document.getElementById('redDotForNotifications');
const notificationsText = document.getElementById('notificationsText');
const notificationsSection = document.getElementById('notificationsSection');
const followRequestsSection = document.getElementById('followRequestsSection');
const accountNotFound = document.getElementById('accountNotFound');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');
const totalAndUnreadNotificationsText = document.getElementById('totalAndUnreadNotificationsText');
const totalAndUnreadFollowRequestsText = document.getElementById('totalAndUnreadFollowRequestsText');



let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let numNotifications = 6;
let numUnreadNotifications = 3;
let numFollowRequests = 0;
let numUnreadFollowRequests = 0;
let haveDOMElementsForFollowRequestsBeenCreated = false;
let followRequestsReceivedByUser = [];
let relevantUserInfo = {};
let userBlockings = []; //usernames of users that authUser blocks or is blocked by
let userFollowings = []; //usernames of users that authUser follows
let userRequestings = []; //usernames of users that authUser requested to follow




async function authenticateUserAndFetchData() {
    let username = document.getElementById('authenticatedUsername').textContent;
    authenticatedUsername = username;
    localStorage.setItem('authenticatedUsername', authenticatedUsername);
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
        localStorage.setItem('authenticatedUsername', authenticatedUsername);
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
                localStorage.setItem('authenticatedUsername', authenticatedUsername);
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
                    localStorage.setItem('authenticatedUsername', authenticatedUsername);
                }
                }
            }
            window.location.href = "http://localhost:8000/login";
            }
            */
    
    const response = await fetch('http://localhost:8001/getRelevantUserInfoFromUsername/'+authenticatedUsername);
    if(!response.ok) {
        //user probably doesn't exist
        leftSidebar.classList.add('hidden');
        notificationsSection.classList.add('hidden');
        accountNotFound.classList.remove('hidden');
        return;
    }
    const relevantAuthUserInfo = await response.json();

    const response0b = await fetch('http://localhost:8013/graphql', {
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
    if(!response0b.ok) {
        throw new Error('Network response not ok');
    }
    let userBlockings = await response0b.json();
    userBlockings = userBlockings['data']['getAllUserBlockings'];
    userBlockings = userBlockings.map(x=> {
        if(x['blocker']===authenticatedUsername) {
            return x['blockee'];
        }
        return x['blocker'];
    });

    if(!relevantAuthUserInfo['isPrivate']) {
        redDotForFollowRequests.classList.add('hidden');
        followRequestsText.classList.add('hidden');
    }
    else {
        const responseToGetReceivedFollowRequests = await fetch('http://localhost:8021/graphql/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                query {
                    followRequestsReceivedByUser(username: "${authenticatedUsername}" ) {
                        requester
                        isRead
                    }
                }
                `
                })
        });
        if(!responseToGetReceivedFollowRequests.ok) {
            throw new Error('Network response not ok');
        }
        followRequestsReceivedByUser = await responseToGetReceivedFollowRequests.json();
        followRequestsReceivedByUser = followRequestsReceivedByUser['data']['followRequestsReceivedByUser'];
        followRequestsReceivedByUser = followRequestsReceivedByUser.filter(x=>!userBlockings.includes(x['requester']));
        numFollowRequests = followRequestsReceivedByUser.length;
        numUnreadFollowRequests = followRequestsReceivedByUser.filter(x=>!x['isRead']).length;

        followRequestsText.textContent = "Follower Requests";
        if(numUnreadFollowRequests>0) {
            followRequestsText.textContent += " (" + numUnreadFollowRequests + ")";
            redDotForFollowRequests.classList.remove('hidden');
        }
    
        totalAndUnreadFollowRequestsText.textContent = numFollowRequests + " total";
        if(numUnreadFollowRequests>0) {
            totalAndUnreadFollowRequestsText.textContent+= ", " + numUnreadFollowRequests + " unread";
        }
    
    }

    const response1 = await fetch('http://localhost:8003/getProfilePhoto/'+authenticatedUsername);
    if(!response1.ok) {
        throw new Error('Network response not ok');
    }
    let profilePhotoBlob = await response1.blob();
    profileIconInLeftSidebar.src =  URL.createObjectURL(profilePhotoBlob);

}

function toggleLeftSidebarPopup() {
    displayLeftSidebarPopup = !displayLeftSidebarPopup;
    if(displayLeftSidebarPopup) {
        leftSidebarPopup.classList.remove('hidden');
        toggleLeftSidebarPopupMoreOrLessText.textContent = 'Less';
    }
    else {
        leftSidebarPopup.classList.add('hidden');
        toggleLeftSidebarPopupMoreOrLessText.textContent = 'More';
    }
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

function takeUserToOwnProfile() {
    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername;
}

function takeUserToLogin() {
    window.location.href = "http://localhost:8000/login";
}

async function removeNotification(index) {
    document.getElementById('notification'+index).classList.add('hidden');
}

function showDeleteNotificationIcon(index) {
    document.getElementById('notification'+index+'DeleteIcon').classList.remove('hidden');
}

function hideDeleteNotificationIcon(index) {
    document.getElementById('notification'+index+'DeleteIcon').classList.add('hidden');
}

function takeToProfile(profileUsername) {
    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername + "/" + profileUsername;
}

async function toggleNotificationFollow(index) {
    const targetedFollowButton = document.getElementById('notification'+index+'FollowButton');
    const targetedFollowingButton = document.getElementById('notification'+index+'FollowingButton');

    if(targetedFollowButton.classList.contains('hidden')) {
        targetedFollowButton.classList.remove('hidden');
        targetedFollowingButton.classList.add('hidden');
    }
    else {
        targetedFollowButton.classList.add('hidden');
        targetedFollowingButton.classList.remove('hidden');
    }

}

async function showFollowRequests() {
    notificationsSection.classList.add('hidden');
    followRequestsSection.classList.remove('hidden');
    numUnreadNotifications = 0;
    totalAndUnreadNotificationsText.textContent = numNotifications + " total";
    notificationsText.textContent = "Notifications";
    redDotForNotifications.classList.add('hidden');
    document.title = "Follow Requests";
    if(!haveDOMElementsForFollowRequestsBeenCreated) {
        await createDOMElementsForFollowRequests();
        haveDOMElementsForFollowRequestsBeenCreated = true;
    }
}

function showNotifications() {
    notificationsSection.classList.remove('hidden');
    followRequestsSection.classList.add('hidden');
    numUnreadFollowRequests = 0;
    totalAndUnreadFollowRequestsText.textContent = numFollowRequests + " total";
    followRequestsText.textContent = "Follow Requests";
    redDotForFollowRequests.classList.add('hidden');
    document.title = "Notifications";
}

async function createDOMElementsForFollowRequests() {
    if(followRequestsReceivedByUser.length>0) {
        let followRequesterUsernames = followRequestsReceivedByUser.map(x=>x['requester']);
        const response = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listOfUsers: followRequesterUsernames
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        relevantUserInfo = await response.json();

        const response1 = await fetch('http://localhost:8003/getProfilePhotosOfMultipleUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listOfUsers: followRequesterUsernames
            })
        });
        if(!response1.ok) {
            throw new Error('Network response not ok');
        }
        const profilePhotoInfoMappings = await response1.json();
        for(let username of Object.keys(profilePhotoInfoMappings)) {
            relevantUserInfo[username]['profilePhotoString'] = 'data:image/png;base64,'+profilePhotoInfoMappings[username];
        }
        const response2 = await fetch('http://localhost:8013/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `query {
                    getAllUserFollowings(filter: {username: "${authenticatedUsername}", justFollowersOfUser: ${false}}) {
                        followee
                    }
                }
                `
            })
        });
        if(!response2.ok) {
            throw new Error('Network response not ok');
        }
        userFollowings = await response2.json();
        userFollowings = userFollowings['data']['getAllUserFollowings'];
        userFollowings = userFollowings.map(x=>x['followee']);

        const response3 = await fetch('http://localhost:8021/graphql/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `query {
                    followRequestsMadeByUser(username: "${authenticatedUsername}" )
                }`
            })
        });
        if(!response3.ok) {
            throw new Error('Network response not ok');
        }
        userRequestings = await response3.json();
        userRequestings = userRequestings['data']['followRequestsMadeByUser'];

    }
    else {
        return;
    }
    let counter=-1;
    for(let followRequest of followRequestsReceivedByUser) {
        counter++;
        const currCounterValue = counter;
        const mainDiv = document.createElement('div');
        mainDiv.id = 'followRequest'+counter;
        mainDiv.style.display = 'flex';
        mainDiv.style.justifyContent = 'space-between';
        mainDiv.style.width = '85%';
        mainDiv.style.height = '5em';
        mainDiv.style.alignItems = 'center';
        mainDiv.style.borderRadius = '0.85em';

        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';
        leftDiv.style.gap = '1.7em';

        const img = document.createElement('img');
        img.style.height = '3em';
        img.style.width = '3em';
        img.style.objectFit = 'contain';
        img.style.cursor = 'pointer';
        img.onclick = () => takeToProfile(followRequest['requester']);
        img.src = relevantUserInfo[followRequest['requester']]['profilePhotoString'];

        const userDetailsDiv = document.createElement('div');
        userDetailsDiv.style.display = 'flex';
        userDetailsDiv.style.flexDirection = 'column';
        userDetailsDiv.style.marginTop = '0.7em';

        const boldNameDiv = document.createElement('div');
        boldNameDiv.style.display = 'flex';
        boldNameDiv.style.alignItems = 'center';
        boldNameDiv.style.gap = '0.36em';

        const boldName = document.createElement('b');
        boldName.style.cursor = 'pointer';
        boldName.onclick = () => takeToProfile(followRequest['requester']);
        boldName.textContent = followRequest['requester'];

        boldNameDiv.appendChild(boldName);

        if(relevantUserInfo[followRequest['requester']]['isVerified']) {
            const verifiedImg = document.createElement('img');
            verifiedImg.src = '/images/verifiedCheck.png';
            verifiedImg.style.objectFit = 'contain';
            verifiedImg.style.height = '1.3em';
            verifiedImg.style.width = '1.3em';
            boldNameDiv.appendChild(verifiedImg);
        }

        const followSpan = document.createElement('span');
        followSpan.id = 'followRequest' + counter + 'FollowRequester';
        followSpan.className = 'hidden';
        followSpan.style.marginLeft = '0.35em';
        followSpan.style.color = '#4e8eed';
        followSpan.style.fontWeight = 'bold';
        followSpan.style.cursor = 'pointer';
        followSpan.textContent = '· Follow';
        followSpan.onclick = () => {
            followRequester(followRequest['requester'], currCounterValue)
        };
        boldNameDiv.appendChild(followSpan);

        const requestedSpan = document.createElement('span');
        requestedSpan.id = 'followRequest' + counter + 'RequestedRequester';
        requestedSpan.className = 'hidden';
        requestedSpan.style.marginLeft = '0.35em';
        requestedSpan.style.color = 'darkgray';
        requestedSpan.style.fontWeight = 'bold';
        requestedSpan.style.cursor = 'pointer';
        requestedSpan.textContent = '· Requested';
        requestedSpan.onclick = () => {
            cancelFollowRequestMadeToRequester(followRequest['requester'], currCounterValue);
        };
        boldNameDiv.appendChild(requestedSpan);

        if(!userFollowings.includes(followRequest['requester'])) {
            if(userRequestings.includes(followRequest['requester'])) {
                requestedSpan.classList.remove('hidden');
            }
            else {
                followSpan.classList.remove('hidden');
            }

        }

        const fullName = document.createElement('p');
        fullName.style.color = 'gray';
        fullName.style.marginTop = '0.45em';
        fullName.textContent = relevantUserInfo[followRequest['requester']]['fullName'];

        userDetailsDiv.appendChild(boldNameDiv);
        userDetailsDiv.appendChild(fullName);

        leftDiv.appendChild(img);
        leftDiv.appendChild(userDetailsDiv);

        const rightDiv = document.createElement('div');
        rightDiv.style.display = 'flex';
        rightDiv.style.justifyContent = 'end';
        rightDiv.style.alignItems = 'center';
        rightDiv.style.gap = '1.7em';

        const acceptButton = document.createElement('button');
        acceptButton.id = 'followRequest' + counter + 'AcceptButton';
        acceptButton.classList.add('blueButton');
        acceptButton.style.height = '36%';
        acceptButton.textContent = 'Accept';
        acceptButton.onclick = () => {
            acceptFollowRequest(followRequest['requester'], currCounterValue);
        };

        const declineButton = document.createElement('button');
        declineButton.id = 'followRequest' + counter + 'DeclineButton';
        declineButton.style.height = '36%';
        declineButton.style.backgroundColor = '#f0f0f0';
        declineButton.style.padding = '0.6em 1.2em';
        declineButton.style.borderRadius = '0.5em';
        declineButton.style.border = 'none';
        declineButton.style.fontWeight = 'bold';
        declineButton.style.cursor = 'pointer';
        declineButton.textContent = 'Decline';
        declineButton.onclick = () => {
            declineFollowRequest(followRequest['requester'], currCounterValue);
        };

        rightDiv.appendChild(acceptButton);
        rightDiv.appendChild(declineButton);

        mainDiv.appendChild(leftDiv);
        mainDiv.appendChild(rightDiv);

        followRequestsSection.appendChild(mainDiv);
    }

}

async function acceptFollowRequest(userToAccept, index) {
    const response = await fetch('http://localhost:8021/graphql/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeFollowRequest(requester: "${userToAccept}", requestee: "${authenticatedUsername}") {
                    wasDeleteSuccessful
                }
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }

    const response1 = await fetch('http://localhost:8013/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
                mutation {
                    addUserFollowing(newUserFollowing: { follower: "${userToAccept}", followee: "${authenticatedUsername}" })
                }
                `
                })
        });
        if(!response1.ok) {
            throw new Error('Network response not ok');
        }

    document.getElementById('followRequest'+index).classList.add('hidden');
    numFollowRequests--;
    totalAndUnreadFollowRequestsText.textContent = numFollowRequests + " total";
    if(numUnreadFollowRequests>0) {
        totalAndUnreadFollowRequestsText.textContent+= ", " + numUnreadFollowRequests + " unread";
    }
}

async function declineFollowRequest(userToDecline, index) {
    const response = await fetch('http://localhost:8021/graphql/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeFollowRequest(requester: "${userToDecline}", requestee: "${authenticatedUsername}") {
                    wasDeleteSuccessful
                }
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    
    document.getElementById('followRequest'+index).classList.add('hidden');
    numFollowRequests--;
    totalAndUnreadFollowRequestsText.textContent = numFollowRequests + " total";
    if(numUnreadFollowRequests>0) {
        totalAndUnreadFollowRequestsText.textContent+= ", " + numUnreadFollowRequests + " unread";
    }
}

async function followRequester(userToFollow, index) {
    if(relevantUserInfo[userToFollow]['isPrivate']) {
        const response = await fetch('http://localhost:8021/graphql/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
                mutation {
                    addFollowRequest(requester: "${authenticatedUsername}", requestee: "${userToFollow}") {
                        followRequest {
                            requester
                            requestee
                        }
                    }
                }
                `
                })
            });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }

        document.getElementById('followRequest'+index+'FollowRequester').classList.add('hidden');
        document.getElementById('followRequest'+index+'RequestedRequester').classList.remove('hidden');
    }
    else {
        const response = await fetch('http://localhost:8013/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
                mutation {
                    addUserFollowing(newUserFollowing: { follower: "${authenticatedUsername}", followee: "${userToFollow}" })
                }
                `
                })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        document.getElementById('followRequest'+index+'FollowRequester').classList.add('hidden');
    }

}

async function cancelFollowRequestMadeToRequester(userToCancel, index) {
    const response = await fetch('http://localhost:8021/graphql/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeFollowRequest(requester: "${authenticatedUsername}", requestee: "${userToCancel}") {
                    wasDeleteSuccessful
                }
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    document.getElementById('followRequest'+index+'RequestedRequester').classList.add('hidden');
    document.getElementById('followRequest'+index+'FollowRequester').classList.remove('hidden');
}



authenticateUserAndFetchData();
