const leftSidebar = document.getElementById('leftSidebar');
const mainSection = document.getElementById('mainSection');
const accountNotFound = document.getElementById('accountNotFound');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');
const reelsIcon = document.getElementById('reelsIcon');
const reelsIcon2 = document.getElementById('reelsIcon2');
const reelsText = document.getElementById('reelsText');
const soundsIcon = document.getElementById('soundsIcon');
const soundsIcon2 = document.getElementById('soundsIcon2');
const soundsText = document.getElementById('soundsText');
const postsGridIcon = document.getElementById('postsGridIcon');
const postsGridIcon2 = document.getElementById('postsGridIcon2');
const postsText = document.getElementById('postsText');
const imageGridForSavedPosts = document.getElementById('imageGridForSavedPosts');
const imageGridForSavedReels= document.getElementById('imageGridForSavedReels');
const imageGridForSavedSounds= document.getElementById('imageGridForSavedSounds')
const noSavedPosts = document.getElementById('noSavedPosts');
const noSavedReels = document.getElementById('noSavedReels');
const noSavedSounds = document.getElementById('noSavedSounds');

let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let relevantProfileUserInfo = {};
let currentlyShownSection = 'POSTS';
let savedPosts = [];
let savedReels = [];
let savedSounds = [];

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
        mainSection.classList.add('hidden');
        accountNotFound.classList.remove('hidden');
        return;
    }
    relevantProfileUserInfo = await response.json();

    const response1 = await fetch('http://localhost:8003/getProfilePhoto/'+authenticatedUsername);
    if(!response1.ok) {
        throw new Error('Network response not ok');
    }
    let profilePhotoBlob = await response1.blob();
    relevantProfileUserInfo['profilePhotoString'] = URL.createObjectURL(profilePhotoBlob);
    profileIconInLeftSidebar.src = relevantProfileUserInfo['profilePhotoString'];
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

function showSavedPosts() {
    if(currentlyShownSection!=='POSTS') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForSavedReels.classList.add('hidden');
            noSavedReels.classList.add('hidden');
        }
        else if(currentlyShownSection==='SOUNDS') {
            soundsIcon.classList.remove('hidden');
            soundsIcon2.classList.add('hidden');
            soundsText.style['color'] = "";
            soundsText.style['font-size'] = "";
            imageGridForSavedSounds.classList.add('hidden');
            noSavedSounds.classList.add('hidden');
        }
        postsGridIcon.classList.add('hidden');
        postsGridIcon2.classList.remove('hidden');
        postsText.style['color'] = "black";
        postsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'POSTS';

        if(savedPosts.length>0) {
            imageGridForSavedPosts.classList.remove('hidden');
        }
        else {
            noSavedPosts.classList.remove('hidden');
        }
    }
}

function showSavedReels() {
    if(currentlyShownSection!=='REELS') {
        if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
            imageGridForSavedPosts.classList.add('hidden');
            noSavedPosts.classList.add('hidden');
            
        }
        else if(currentlyShownSection==='SOUNDS') {
            soundsIcon.classList.remove('hidden');
            soundsIcon2.classList.add('hidden');
            soundsText.style['color'] = "";
            soundsText.style['font-size'] = "";
            imageGridForSavedSounds.classList.add('hidden');
            noSavedSounds.classList.add('hidden');
        }
        reelsIcon.classList.add('hidden');
        reelsIcon2.classList.remove('hidden');
        reelsText.style['color'] = "black";
        reelsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'REELS';

        if(savedReels.length>0) {
            imageGridForSavedReels.classList.remove('hidden');
        }
        else {
            noSavedReels.classList.remove('hidden');
        }
    }
}

function showSavedSounds() {
    if(currentlyShownSection!=='SOUNDS') {
        if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
            imageGridForSavedPosts.classList.add('hidden');
            noSavedPosts.classList.add('hidden');
        }
        else if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForSavedReels.classList.add('hidden');
            noSavedReels.classList.add('hidden');
        }
    
        soundsIcon.classList.add('hidden');
        soundsIcon2.classList.remove('hidden');
        soundsText.style['color'] = "black";
        soundsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'SOUNDS';

        if(savedSounds.length>0) {
            imageGridForSavedSounds.classList.remove('hidden');
        }
        else {
            noSavedSounds.classList.remove('hidden');
        }
    }
}

authenticateUserAndFetchData();