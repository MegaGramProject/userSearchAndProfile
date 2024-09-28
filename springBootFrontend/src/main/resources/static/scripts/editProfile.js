const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const authUserProfilePhoto = document.getElementById('authUserProfilePhoto');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');
const fullNameTextarea = document.getElementById('fullNameTextarea');
const websiteTextarea = document.getElementById('websiteTextarea');
const bioTextarea = document.getElementById('bioTextarea');
const accountBasedInTextarea = document.getElementById('accountBasedInTextarea');
const mainSection = document.getElementById('mainSection');
const accountNotFound = document.getElementById('accountNotFound');
const fullNameInTopDiv = document.getElementById('fullNameInTopDiv');
const numCharactersInBio = document.getElementById('numCharactersInBio');
const accountVisibilitySelection = document.getElementById('accountVisibilitySelection');
const submissionErrorMessage = document.getElementById('submissionErrorMessage');
const submissionSuccessMessage = document.getElementById('submissionSuccessMessage');
const submitButton = document.getElementById('submitButton');
const changeProfilePhotoPopup = document.getElementById('changeProfilePhotoPopup');
const darkScreen = document.getElementById('darkScreen');
const deleteAccountConfirmationPopup = document.getElementById('deleteAccountConfirmationPopup');
const finalDeleteAccountConfirmationPopup = document.getElementById('finalDeleteAccountConfirmationPopup');
const oneLastUsernameTextarea = document.getElementById('oneLastUsernameTextarea');
const goodbyeButton = document.getElementById('goodbyeButton');
const fileInputForProfilePhoto = document.getElementById('fileInputForProfilePhoto');
const usernameTextarea = document.getElementById('usernameTextarea');
const usernameError = document.getElementById('usernameError');


let displayLeftSidebarPopup = false;
let relevantProfileUserInfo = {};
let userSelectedAccountVisibility = "";
let originalAccountVisibility = "";
let authenticatedUsername = "";
let userSelectedProfilePhoto = null;


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
        accountNotFound.classList.remove('hidden');
        return;
    }
    relevantProfileUserInfo = await response.json();
    usernameTextarea.placeholder = authenticatedUsername;
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

function validateFields() {
    let isAtLeastOneFieldInvalid = false
    if(usernameTextarea.value.length>0 && !isUsernameValid()) {
        usernameError.classList.remove('hidden');
        isAtLeastOneFieldInvalid = true;
    }
    if(fullNameTextarea.value.length>0 && !isFullNameValid()) {
        fullNameError.classList.remove('hidden');
        isAtLeastOneFieldInvalid = true;
    }
    
    if(isAtLeastOneFieldInvalid) {
        submitButton.classList.add('hidden');
        submissionErrorMessage.textContent = "Please address the error(s) above";
        submissionErrorMessage.classList.remove('hidden');
        setTimeout(function() {
            submitButton.classList.remove('hidden');
            submissionErrorMessage.classList.add('hidden');
        }, 3000);
        return false;
    }
    return true;
}

function isUsernameValid() {
    let usernameInput = usernameTextarea.value;
    if (usernameInput.length > 30) {
        return false;
    }

    for (let i = 0; i < usernameInput.length; i++) {
        let char = usernameInput[i];
        if (!(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z') &&
            !(char >= '0' && char <= '9') && char !== '.' && char!="_") {
            return false;
        }
    }
}

function isFullNameValid() {
    let fullNameInput = fullNameTextarea.value;
    if(fullNameInput.length > 30 || fullNameInput[0]===" ") {
        console.log("A");
        return false;
    }
    if (fullNameInput.indexOf(' ') === -1) {
        console.log("B");
        return false;
    }

    for (let i = 0; i < fullNameInput.length; i++) {
        let char = fullNameInput[i];
        if (char !== ' ' && !(char >= 'A' && char <= 'Z') && !(char >= 'a' && char <= 'z')) {
            console.log("C");
            return false;
        }
    }

    return true;
}

async function onSubmit() {
    const changedFields = {};

    let areFieldsValidated = validateFields();
    if(!areFieldsValidated) {
        return;
    }

    if(userSelectedProfilePhoto!==null) {
        const formData = new FormData();
        if(userSelectedProfilePhoto==='defaultPfp') {
            const response0 = await fetch('http://localhost:8003/images/defaultPfp.png');
            const blob = await response0.blob();
            userSelectedProfilePhoto = new File([blob], 'defaultPfp.png', { type: blob.type });
        }
        formData.append('newProfilePhoto', userSelectedProfilePhoto);
        const response = await fetch('http://localhost:8003/editProfilePhoto/'+authenticatedUsername, {
            method: 'PATCH',
            body: formData
        });
        if(!response.ok) {
            submitButton.classList.add('hidden');
            submissionErrorMessage.textContent = "Couldn't update profile-photo";
            submissionErrorMessage.classList.remove('hidden');
            userSelectedProfilePhoto = null;
            authUserProfilePhoto.src = relevantProfileUserInfo['profilePhotoString'];
            setTimeout(function() {
                submitButton.classList.remove('hidden');
                submissionErrorMessage.classList.add('hidden');
            }, 3000);
            return;
        }
    }

    if(usernameTextarea.value.length>0 && usernameTextarea.value!==authenticatedUsername) {
        const response = await fetch('http://localhost:8001/doesUserExist', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: usernameTextarea.value
            })
        });
        if(!response.ok) {
            submitButton.classList.add('hidden');
            submissionErrorMessage.textContent = "Couldn't check if username is taken or not";
            submissionErrorMessage.classList.remove('hidden');
            setTimeout(function() {
                submitButton.classList.remove('hidden');
                submissionErrorMessage.classList.add('hidden');
            }, 3000);
            return;
        }
        const responseData = await response.json();
        if('userExists' in responseData) {
            changedFields['username'] = usernameTextarea;
        }
        else {
            submitButton.classList.add('hidden');
            submissionErrorMessage.textContent = "Username is already taken";
            submissionErrorMessage.classList.remove('hidden');
            setTimeout(function() {
                submitButton.classList.remove('hidden');
                submissionErrorMessage.classList.add('hidden');
            }, 3000);
            return;
        }
    }

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
            submissionErrorMessage.textContent = "Error updating your username/fullName/accountBasedIn/accountVisibility";
            submissionErrorMessage.classList.remove('hidden');
            setTimeout(function() {
                submitButton.classList.remove('hidden');
                submissionErrorMessage.classList.add('hidden');
            }, 3000);
            return;
        }
        submitButton.classList.add('hidden');
        submissionSuccessMessage.classList.remove('hidden');
        setTimeout(function() {
            if('username' in changedFields) {
                //better yet: update everything related to username even the tokens and then redirect to profilePage of new username
                localStorage.setItem('authenticatedUsername', changedFields['username']);
                window.location.href = "http://localhost:8000/profilePage/"+changedFields['username'];
            }
            else {
                window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername;
            }
        }, 2000);
    }
    else if(userSelectedProfilePhoto!==null) {
        submitButton.classList.add('hidden');
        submissionSuccessMessage.classList.remove('hidden');
        setTimeout(function() {
            window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername;
        }, 2000);
    }
    else {
        submitButton.classList.add('hidden');
        submissionErrorMessage.textContent = "You didn't change anything!"
        submissionErrorMessage.classList.remove('hidden');
        setTimeout(function() {
            submitButton.classList.remove('hidden');
            submissionErrorMessage.classList.add('hidden');
        }, 3000);
    }

}

function showChangeProfilePhotoPopup() {
    darkScreen.classList.remove('hidden');
    changeProfilePhotoPopup.classList.remove('hidden');
}

function closeChangeProfilePhotoPopup() {
    darkScreen.classList.add('hidden');
    changeProfilePhotoPopup.classList.add('hidden');
}

function showDeleteAccountConfirmationPopup() {
    darkScreen.classList.remove('hidden');
    deleteAccountConfirmationPopup.classList.remove('hidden');
}

function closeDeleteAccountConfirmationPopup() {
    darkScreen.classList.add('hidden');
    deleteAccountConfirmationPopup.classList.add('hidden');
}

function showFinalConfirmationPopup() {
    deleteAccountConfirmationPopup.classList.add('hidden');
    finalDeleteAccountConfirmationPopup.classList.remove('hidden');
}

function closeFinalConfirmationPopup() {
    oneLastUsernameTextarea.value = "";
    darkScreen.classList.add('hidden');
    finalDeleteAccountConfirmationPopup.classList.add('hidden');
}

async function deleteAccount(){
    const response = await fetch('http://localhost:8001/removeUser/'+authenticatedUsername, {
        method: 'DELETE'
    });
    if(!response.ok) {
        closeFinalConfirmationPopup();
        submitButton.classList.add('hidden');
        submissionErrorMessage.textContent = "Couldn't delete account. Please try again later.";
        submissionErrorMessage.classList.remove('hidden');
        setTimeout(function() {
            submitButton.classList.remove('hidden');
            submissionErrorMessage.classList.add('hidden');
        }, 3000);
        return;
    }
    window.location.href = "http://localhost:8000/login"
}

oneLastUsernameTextarea.oninput = function() {
    if(oneLastUsernameTextarea.value===authenticatedUsername) {
        goodbyeButton.classList.remove('hidden');
    }
    else {
        goodbyeButton.classList.add('hidden');
    }
}

function removeCurrentPhoto() {
    userSelectedProfilePhoto = 'defaultPfp';
    authUserProfilePhoto.src = '/images/defaultPfp.png'
    closeChangeProfilePhotoPopup();
}

function uploadNewPhoto() {
    fileInputForProfilePhoto.click();
    closeChangeProfilePhotoPopup();
}

fileInputForProfilePhoto.addEventListener('change', function(event) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];
    if(allowedImageTypes.includes(event.target.files[0].type)) {
        userSelectedProfilePhoto = event.target.files[0];
        authUserProfilePhoto.src =  URL.createObjectURL(event.target.files[0]);
    }
});


authenticateUserAndFetchData();