const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const redDotForFollowRequests = document.getElementById('redDotForFollowRequests');
const followRequestsText = document.getElementById('followRequestsText');
const redDotForNotifications = document.getElementById('redDotForNotifications');
const notificationsText = document.getElementById('notificationsText');
const notificationsSection = document.getElementById('notificationsSection');
const followRequestsSection = document.getElementById('followRequestsSection');



let authenticatedUsername = "";
let displayLeftSidebarPopup = false;


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

function showFollowRequests() {
    notificationsSection.classList.add('hidden');
    followRequestsSection.classList.remove('hidden');
    document.title = "Follow Requests";
}

function showNotifications() {
    notificationsSection.classList.remove('hidden');
    followRequestsSection.classList.add('hidden');
    document.title = "Notifications";
}

async function acceptFollowRequest(index) {
    document.getElementById('followRequest'+index).classList.add('hidden');
}

async function declineFollowRequest(index) {
    document.getElementById('followRequest'+index).classList.add('hidden');
}





authenticateUserAndFetchData();
