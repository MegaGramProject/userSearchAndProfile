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
let numNotifications = 0;
let numUnreadNotifications = 0;
let numFollowRequests = 0;
let numUnreadFollowRequests = 0;
let haveDOMElementsForFollowRequestsBeenCreated = false;
let followRequestsReceivedByUser = [];
let relevantUserInfo = {};
let userBlockings = []; //usernames of users that authUser blocks or is blocked by
let userFollowings = []; //usernames of users that authUser follows
let userRequestings = []; //usernames of users that authUser requested to follow
let userNotifications = [];
let haveUserFollowingsAndRequestingsBeenFetched = false;




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

    const response2 = await fetch('http://localhost:8022/getAllNotificationsOfUser/'+authenticatedUsername);
    if(!response2.ok) {
        throw new Error('Network response not ok');
    }
    userNotifications = await response2.json();
    numNotifications = userNotifications.length;
    numUnreadNotifications = userNotifications.filter(x=>!x.isread).length;

    notificationsText.textContent = "Notifications";
    
    totalAndUnreadNotificationsText.textContent = numNotifications + " total";
    if(numUnreadNotifications>0) {
        totalAndUnreadNotificationsText.textContent+= ", " + numUnreadNotifications + " unread";
    }

    if(numNotifications>0) {
        createDOMElementsForNotifications();
    }

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

async function removeNotification(recipient, subject, action, index) {
    const response = await fetch('http://localhost:8022/deleteNotification', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            recipient: recipient,
            subject: subject,
            action: action
        })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    document.getElementById('notification'+index).classList.add('hidden');
    numNotifications--;
    totalAndUnreadNotificationsText.textContent = numNotifications + " total";
    if(numUnreadNotifications>0) {
        totalAndUnreadFollowRequestsText.textContent+= ", " + numUnreadNotifications + " unread";
    }
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

async function toggleNotificationFollow(notificationSubject, index) {
    const targetedFollowButton = document.getElementById('notification'+index+'FollowButton');
    const targetedFollowingButton = document.getElementById('notification'+index+'FollowingButton');
    const targetedRequestedButton = document.getElementById('notification'+index+'RequestedButton');

    if(targetedFollowButton.classList.contains('hidden')) {
        //notificationSubject is to be unfollowed
        const response = await fetch('http://localhost:8013/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
                mutation {
                    removeUserFollowing(userFollowingToRemove: { follower: "${authenticatedUsername}", followee: "${notificationSubject}" })
                }
                `
                })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        targetedFollowButton.classList.remove('hidden');
        targetedFollowingButton.classList.add('hidden');
    }
    else {
         //notificationSubject is to be followed
        if(relevantUserInfo[notificationSubject]['isPrivate']) {
            const response = await fetch('http://localhost:8021/graphql/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        addFollowRequest(requester: "${authenticatedUsername}", requestee: "${notificationSubject}") {
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
            targetedFollowButton.classList.add('hidden');
            targetedRequestedButton.classList.remove('hidden');
        }
        else {
            const response = await fetch('http://localhost:8013/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        addUserFollowing(newUserFollowing: { follower: "${authenticatedUsername}", followee: "${notificationSubject}" })
                    }
                    `
                })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
        }
        targetedFollowButton.classList.add('hidden');
        targetedFollowingButton.classList.remove('hidden');
    }

}

async function cancelNotificationFollowRequest(notificationSubject, index) {
    const targetedFollowButton = document.getElementById('notification'+index+'FollowButton');
    const targetedRequestedButton = document.getElementById('notification'+index+'RequestedButton');

    const response = await fetch('http://localhost:8021/graphql/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeFollowRequest(requester: "${authenticatedUsername}", requestee: "${notificationSubject}") {
                    wasDeleteSuccessful
                }
            }
            `
        })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }

    targetedRequestedButton.classList.add('hidden');
    targetedFollowButton.classList.remove('hidden');
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
    if(numUnreadFollowRequests>0) {
        const response = await fetch('http://localhost:8021/graphql/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    markUnreadFollowRequestsOfUserAsRead(username: "${authenticatedUsername}") {
                        wasOperationSuccessful
                    }
                }`
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
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

function formatComment(comment) {
    const usernameRegex = /@([a-z0-9._]+)/g;

    const formattedComment = comment.replace(usernameRegex, (match, username) => {
        return `<span onclick="takeToProfile('${username}')" style="cursor: pointer; color: #2a72a8;">${match}</span>`;
    });

    return formattedComment;
}

async function createDOMElementsForNotifications() {
    let userNotificationSubjectUsernames = userNotifications.map(x=>x['subject']);
    userNotificationSubjectUsernames = [...new Set(userNotificationSubjectUsernames)];
    if(Object.keys(relevantUserInfo).length>0) {
        userNotificationSubjectUsernames = userNotificationSubjectUsernames.filter(x=>!(x in relevantUserInfo));
    }
    if(userNotificationSubjectUsernames.length>0) {
        const response = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listOfUsers: userNotificationSubjectUsernames
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }

        const newlyFetchedUserInfo = await response.json();
        if(Object.keys(relevantUserInfo).length==0) {
            relevantUserInfo = newlyFetchedUserInfo;
        }
        else {
            for(let key of Object.keys(newlyFetchedUserInfo)) {
                relevantUserInfo[key] = newlyFetchedUserInfo[key];
            }
        }

        const response1 = await fetch('http://localhost:8003/getProfilePhotosOfMultipleUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listOfUsers: userNotificationSubjectUsernames
            })
        });
        if(!response1.ok) {
            throw new Error('Network response not ok');
        }
        const profilePhotoInfoMappings = await response1.json();
        for(let username of Object.keys(profilePhotoInfoMappings)) {
            relevantUserInfo[username]['profilePhotoString'] = 'data:image/png;base64,'+profilePhotoInfoMappings[username];
        }

        if(!haveUserFollowingsAndRequestingsBeenFetched) {
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
            haveUserFollowingsAndRequestingsBeenFetched = true;
        }

    }

    let counter = -1;
    for(let notification of userNotifications) {
        counter++;
        const currCounterValue = counter;

        if (notification.action==='subject-started-following' || notification.action==='recipient-accepted-follow-req') {
            const notificationDiv = document.createElement('div');
            notificationDiv.id = 'notification'+currCounterValue;
            notificationDiv.style.display = 'flex';
            notificationDiv.style.justifyContent = 'space-between';
            notificationDiv.style.width = '85%';
            notificationDiv.style.height = '5em';
            notificationDiv.style.alignItems = 'center';
            notificationDiv.style.borderRadius = '0.85em';

            const leftDiv = document.createElement('div');
            leftDiv.style.display = 'flex';
            leftDiv.style.alignItems = 'end';
            leftDiv.style.gap = '1em';

            const profileImage = document.createElement('img');
            profileImage.style.height = '3em';
            profileImage.style.width = '3em';
            profileImage.style.objectFit = 'contain';
            profileImage.style.cursor = 'pointer';
            profileImage.onclick = () => takeToProfile(notification.subject);
            profileImage.src = '/images/profilePhoto.png';

            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'flex';
            contentDiv.style.flexDirection = 'column';
            contentDiv.style.marginTop = '0.7em';

            const paragraph = document.createElement('p');
            paragraph.style.maxWidth = '50em';

            const nameBold = document.createElement('b');
            nameBold.style.cursor = 'pointer';
            nameBold.onclick = () => takeToProfile(notification.subject);
            nameBold.textContent = notification.subject;

            paragraph.appendChild(nameBold);
            if(relevantUserInfo[notification.subject]['isVerified']) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.style.height = '1.55em';
                verifiedCheck.style.width = '1.55em';
                verifiedCheck.style.objectFit = 'contain';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.src = '/images/verifiedCheck2.png';
                paragraph.appendChild(verifiedCheck);
            }
            paragraph.appendChild(document.createTextNode(' started following you. '));

            const timeSpan = document.createElement('span');
            timeSpan.style.color = 'gray';
            timeSpan.textContent = '30s';

            paragraph.appendChild(timeSpan);
            contentDiv.appendChild(paragraph);

            leftDiv.appendChild(profileImage);
            leftDiv.appendChild(contentDiv);

            const rightDiv = document.createElement('div');
            rightDiv.style.display = 'flex';
            rightDiv.style.alignItems = 'center';
            rightDiv.style.gap = '1.7em';
            rightDiv.onmouseenter = () => showDeleteNotificationIcon(currCounterValue);
            rightDiv.onmouseleave = () => hideDeleteNotificationIcon(currCounterValue);

            const followButton = document.createElement('button');
            followButton.id = 'notification'+currCounterValue+'FollowButton';
            followButton.className = 'blueButton hidden';
            followButton.style.height = '36%';
            followButton.textContent = 'Follow';
            followButton.onclick = () => toggleNotificationFollow(notification.subject, currCounterValue);

            const followingButton = document.createElement('button');
            followingButton.id = 'notification'+currCounterValue+'FollowingButton';
            followingButton.className = 'hidden';
            followingButton.style.height = '36%';
            followingButton.style.backgroundColor = '#f0f0f0';
            followingButton.style.padding = '0.6em 1.2em';
            followingButton.style.borderRadius = '0.5em';
            followingButton.style.border = 'none';
            followingButton.style.fontWeight = 'bold';
            followingButton.style.cursor = 'pointer';
            followingButton.textContent = 'Following';
            followingButton.onclick = () => toggleNotificationFollow(notification.subject, currCounterValue);

            const requestedButton = document.createElement('button');
            requestedButton.id = 'notification'+currCounterValue+'RequestedButton';
            requestedButton.className = 'hidden';
            requestedButton.style.height = '36%';
            requestedButton.style.backgroundColor = '#f0f0f0';
            requestedButton.style.padding = '0.6em 1.2em';
            requestedButton.style.borderRadius = '0.5em';
            requestedButton.style.border = 'none';
            requestedButton.style.fontWeight = 'bold';
            requestedButton.style.cursor = 'pointer';
            requestedButton.textContent = 'Requested';
            requestedButton.onclick = () => cancelNotificationFollowRequest(notification.subject, currCounterValue);

            if(!userFollowings.includes(notification.subject)) {
                if(userRequestings.includes(notification.subject)) {
                    requestedButton.classList.remove('hidden');
                }
                else {
                    followButton.classList.remove('hidden');
                }
            }
            else {
                followingButton.classList.remove('hidden');
            }

            const deleteIcon = document.createElement('img');
            deleteIcon.id = 'notification'+currCounterValue+'DeleteIcon';
            deleteIcon.className = 'hidden';
            deleteIcon.style.height = '1.3em';
            deleteIcon.style.width = '1.3em';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.src = '/images/thinGrayXIcon.png';
            deleteIcon.onclick = () => removeNotification(notification.recipient, notification.subject, notification.action, currCounterValue);

            rightDiv.appendChild(followButton);
            rightDiv.appendChild(followingButton);
            rightDiv.appendChild(requestedButton);
            rightDiv.appendChild(deleteIcon);

            notificationDiv.appendChild(leftDiv);
            notificationDiv.appendChild(rightDiv);

            notificationsSection.appendChild(notificationDiv);
        }
        else {
            const notificationDiv = document.createElement('div');
            notificationDiv.id = 'notification'+currCounterValue;
            notificationDiv.style.display = 'flex';
            notificationDiv.style.justifyContent = 'space-between';
            notificationDiv.style.width = '85%';
            notificationDiv.style.height = '5em';
            notificationDiv.style.alignItems = 'center';
            notificationDiv.style.borderRadius = '0.85em';

            const leftDiv = document.createElement('div');
            leftDiv.style.display = 'flex';
            leftDiv.style.alignItems = 'end';
            leftDiv.style.gap = '1em';

            const profileImg = document.createElement('img');
            profileImg.style.height = '3em';
            profileImg.style.width = '3em';
            profileImg.style.objectFit = 'contain';
            profileImg.style.cursor = 'pointer';
            profileImg.src = '/images/profilePhoto.png';
            profileImg.onclick = function() { takeToProfile(notification.subject); };

            const textDiv = document.createElement('div');
            textDiv.style.display = 'flex';
            textDiv.style.flexDirection = 'column';
            textDiv.style.marginTop = '0.7em';

            const messageP = document.createElement('p');
            messageP.style.maxWidth = '50em';
            if(notification.action.startsWith('tag')) {
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> tagged you in a post. <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> tagged you in a post. <span style="color: gray;">26m</span>`;
                }
            }
            else if(notification.action.startsWith('like')) {
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> liked your post. <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> liked your post. <span style="color: gray;">26m</span>`;
                }
            }
            else if(notification.action.startsWith('comment ')) {
                //const comment = formatComment(notification.action.substring(45));
                const comment = formatComment(notification.action.substring(15));
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> commented on your post: ${comment} <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> commented on your post: ${comment} <span style="color: gray;">26m</span>`;
                }
            }
            else if(notification.action.startsWith('comment-like')) {
                //const comment = formatComment(notification.action.substring(50));
                const comment = formatComment(notification.action.substring(20));
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> liked your comment: ${comment} <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> liked your comment: ${comment} <span style="color: gray;">26m</span>`;
                }
            }
            else if(notification.action.startsWith('reply')) {
                //const comment = formatComment(notification.action.substring(43));
                const comment = formatComment(notification.action.substring(13));
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> replied to your comment with this: ${comment} <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> replied to your comment with this: ${comment} <span style="color: gray;">26m</span>`;
                }
            }
            else {
                //const comment = formatComment(notification.action.substring(45));
                const comment = formatComment(notification.action.substring(15));
                if(relevantUserInfo[notification.subject]['isVerified']) {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject} <img src="/images/verifiedCheck2.png" style="height: 1.55em; width: 1.55em; pointer-events: none; object-fit: contain;"></b> mentioned in you in comment: ${comment} <span style="color: gray;">26m</span>`;
                }
                else {
                    messageP.innerHTML = `<b onclick="takeToProfile(\'${notification.subject}\')" style="cursor: pointer;">${notification.subject}</b> mentioned in you in comment: ${comment} <span style="color: gray;">26m</span>`;
                }
            }

            textDiv.appendChild(messageP);

            leftDiv.appendChild(profileImg);
            leftDiv.appendChild(textDiv);

            const rightDiv = document.createElement('div');
            rightDiv.style.display = 'flex';
            rightDiv.style.justifyContent = 'end';
            rightDiv.style.alignItems = 'center';
            rightDiv.style.gap = '1.7em';
            rightDiv.onmouseenter = function() { showDeleteNotificationIcon(currCounterValue); };
            rightDiv.onmouseleave = function() { hideDeleteNotificationIcon(currCounterValue); };

            const sampleImg = document.createElement('img');
            sampleImg.style.height = '4em';
            sampleImg.style.width = '4em';
            sampleImg.style.cursor = 'pointer';
            sampleImg.src = '/images/sampleImg.webp';

            const deleteIcon = document.createElement('img');
            deleteIcon.id = 'notification'+currCounterValue+'DeleteIcon';
            deleteIcon.classList.add('hidden');
            deleteIcon.style.height = '1.3em';
            deleteIcon.style.width = '1.3em';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.src = '/images/thinGrayXIcon.png';
            deleteIcon.onclick = () => removeNotification(notification.recipient, notification.subject, notification.action, currCounterValue);

            rightDiv.appendChild(sampleImg);
            rightDiv.appendChild(deleteIcon);

            notificationDiv.appendChild(leftDiv);
            notificationDiv.appendChild(rightDiv);

            notificationsSection.appendChild(notificationDiv);
        }
    }
    //mark all notifications as read.
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
        haveUserFollowingsAndRequestingsBeenFetched = true;

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
