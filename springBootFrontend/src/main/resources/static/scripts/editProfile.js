const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const authUserProfilePhoto = document.getElementById('authUserProfilePhoto');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');
const fullNameTextarea = document.getElementById('fullNameTextarea');
const websiteTextarea = document.getElementById('websiteTextarea');
const bioTextarea = document.getElementById('bioTextarea');
const accountBasedInTextarea = document.getElementById('accountBasedInTextarea');
const mainSection = document.getElementById('mainSection');
const accountNotFoundOrBlocksYou = document.getElementById('accountNotFoundOrBlocksYou');
const fullNameInTopDiv = document.getElementById('fullNameInTopDiv');
const numCharactersInBio = document.getElementById('numCharactersInBio');
const accountVisibilitySelection = document.getElementById('accountVisibilitySelection');
const submissionErrorMessage1 = document.getElementById('submissionErrorMessage1');
const submissionErrorMessage2 = document.getElementById('submissionErrorMessage2');
const submissionSuccessMessage = document.getElementById('submissionSuccessMessage');
const submitButton = document.getElementById('submitButton');
const userAlreadyExists = document.getElementById('userAlreadyExists');


let displayLeftSidebarPopup = false;
let relevantProfileUserInfo = {};
let userSelectedAccountVisibility = "";
let originalAccountVisibility = "";
let authenticatedUsername = "";

async function authenticateUserAndFetchData() {
    const username = document.getElementById('authenticatedUsername').textContent;
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
        accountNotFoundOrBlocksYou.classList.remove('hidden');
        return;
    }
    relevantProfileUserInfo = await response.json();
    fullNameTextarea.placeholder = relevantProfileUserInfo['fullName'];
    fullNameInTopDiv.textContent = relevantProfileUserInfo['fullName'];
    accountBasedInTextarea.placeholder = relevantProfileUserInfo['accountBasedIn'];

    const publicOption = document.createElement('option');
    publicOption.value = 'Public';
    publicOption.textContent = 'Public';
    const privateOption = document.createElement('option');
    privateOption.value = 'Private';
    privateOption.textContent = 'Private';


    if(relevantProfileUserInfo['isPrivate']) {
        accountVisibilitySelection.appendChild(privateOption);
        accountVisibilitySelection.appendChild(publicOption);
        originalAccountVisibility = 'Private';
        userSelectedAccountVisibility = 'Private';
    }
    else {
        accountVisibilitySelection.appendChild(publicOption);
        accountVisibilitySelection.appendChild(privateOption);
        originalAccountVisibility = 'Public';
        userSelectedAccountVisibility = 'Public';
    }

    const response1 = await fetch('http://localhost:8003/getProfilePhoto/'+authenticatedUsername);
    if(!response1.ok) {
        throw new Error('Network response not ok');
    }
    let profilePhotoBlob = await response1.blob();
    relevantProfileUserInfo['profilePhotoString'] = URL.createObjectURL(profilePhotoBlob);
    authUserProfilePhoto.src = relevantProfileUserInfo['profilePhotoString'];
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

function takeUserToLogin() {
    window.location.href = "http://localhost:8000/login";
}

bioTextarea.addEventListener('input', function() {
    const currentBioText = bioTextarea.value;
    if(currentBioText.length<250) {
        numCharactersInBio.textContent = currentBioText.length;
        numCharactersInBio.style['color'] = '';
    }
    else {
        numCharactersInBio.textContent = 250;
        numCharactersInBio.style['color'] = 'red';
    }
});

accountVisibilitySelection.addEventListener('change', function() {
    userSelectedAccountVisibility = accountVisibilitySelection.value;
});

async function onSubmit() {
    const changedFields = {};
    
    if(fullNameTextarea.value.length>0 && fullNameTextarea.value!==relevantProfileUserInfo['fullName']) {
        changedFields['fullName'] = fullNameTextarea.value;
    }

    if(accountBasedInTextarea.value.length>0 && accountBasedInTextarea.value!==relevantProfileUserInfo['accountBasedIn']) {
        changedFields['accountBasedIn'] = accountBasedInTextarea.value;
    }

    if(userSelectedAccountVisibility!==originalAccountVisibility) {
        changedFields['isPrivate'] = userSelectedAccountVisibility === 'Private' ? true : false;
    }

    if(Object.keys(changedFields).length>0) {
        const responseToEditProfile = await fetch('http://localhost:8001/updateUser/'+authenticatedUsername, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(changedFields)
        });
        if(!responseToEditProfile.ok) {
            submitButton.classList.add('hidden');
            submissionErrorMessage2.classList.remove('hidden');
            setTimeout(function() {
                submitButton.classList.remove('hidden');
                submissionErrorMessage2.classList.add('hidden');
            }, 3000);
            return;
        }
        submitButton.classList.add('hidden');
        submissionSuccessMessage.classList.remove('hidden');
        setTimeout(function() {
            window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername;
        }, 2000);
    }
    else {
        submitButton.classList.add('hidden');
        submissionErrorMessage1.classList.remove('hidden');
        setTimeout(function() {
            submitButton.classList.remove('hidden');
            submissionErrorMessage1.classList.add('hidden');
        }, 3000);
    }

}

authenticateUserAndFetchData();