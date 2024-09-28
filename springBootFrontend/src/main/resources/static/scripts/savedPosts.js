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
const savedHeader = document.getElementById('savedHeader');

let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let relevantProfileUserInfo = {};
let currentlyShownSection = 'POSTS';
let listOfSavedPosts = [];
let listOfSavedReels = [];
let listOfSavedSounds = [];

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

    const response2 = await fetch('http://localhost:8004/getSavedPostsOfUser/'+authenticatedUsername);
    if(!response2.ok) {
        throw new Error('Network response not ok');
    }
    const listOfSavedPostIds = await response2.json();
    
    if(listOfSavedPostIds.length>0) {
        //getImagePosts that were saved
        const response3 = await fetch('http://localhost:8003/getPostsForMultiplePostIds', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                postIds: listOfSavedPostIds
            })
        });
        if(!response3.ok) {
            throw new Error('Network response not ok');
        }
        const postIdToPostInfoMappings = await response3.json(); //key: postId; value: relevant info of post such as dateTimeOfPost,
        //base64-string of the slide with the smallest number, that slideNumber, and whether or not there are multiple slides
        
        const response4 = await fetch('http://localhost:8004/getVideosForMultiplePostIds', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                postIds: listOfSavedPostIds
            })
        });
        if(!response4.ok) {
            throw new Error('Network response not ok');
        }
        const postIdToVidInfoMappings = await response4.json(); //key: postId; value: relevant info of post such as dateTimeOfPost,
        //videoId of slide with smallest number, that slideNumber, and whether or not there are multiple slides

        for(let postId of listOfSavedPostIds) {
            let postInfo = {};
            if(postId in postIdToPostInfoMappings && postIdToPostInfoMappings[postId]['smallestSlideNumber']==0) {
                postInfo = postIdToPostInfoMappings[postId];
                postInfo['base64StringOfImageWithSmallestSlideNumber'] = 'data:image/png;base64,'+ postInfo['base64StringOfImageWithSmallestSlideNumber'];
                postInfo['postId'] = postId;
                if(!postInfo['hasMoreThanOneSlide']) {
                    if(postId in postIdToVidInfoMappings) {
                        postInfo['hasMoreThanOneSlide'] = true;
                    }
                }
            }
            else if(postId in postIdToVidInfoMappings && postIdToVidInfoMappings[postId]['smallestSlideNumber']==0) {
                postInfo = postIdToVidInfoMappings[postId];
                const response = await fetch('http://localhost:8004/getVideo/'+postInfo['videoId']);
                if(!response.ok) {
                    throw new Error('Network response not ok');
                }
                const videoBlob = await response.blob();
                const videoURL = URL.createObjectURL(videoBlob);
                postInfo['videoURL'] = videoURL;
                postInfo['postId'] = postId;
                if(!postInfo['hasMoreThanOneSlide']) {
                    if(postId in listOfSavedPostIds) {
                        postInfo['hasMoreThanOneSlide'] = true;
                    }
                }
            }
            listOfSavedPosts.push(postInfo);
        }

        const response5 = await fetch('http://localhost:8004/getNumLikesAndCommentsOfMultiplePosts', { //numComments also includes replies
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfPostIds: listOfSavedPostIds
        })
        });
        if(!response5.ok) {
            throw new Error('Network response not ok');
        }
        let postIdToNumLikesMappings = await response5.json(); //key: postId, value: [numLikesOfPost, numCommentsOfPost]
        for(let post of listOfSavedPosts) {
            if(post['postId'] in postIdToNumLikesMappings) {
                post['numLikes'] = postIdToNumLikesMappings[post['postId']][0];
                if(postIdToNumLikesMappings[post['postId']].length==2) {
                    post['numComments'] = postIdToNumLikesMappings[post['postId']][1];
                }
                else {
                    postIdToNumLikesMappings[post['postId']].push(0);
                    post['numComments'] = 0;
                }
            }
            else {
                postIdToNumLikesMappings[post['postId']] = [0,0];
                post['numLikes'] = 0;
                post['numComments'] = 0;
            }
        }



        listOfSavedPosts.sort((a, b) => new Date(b['dateTimeOfPost']) - new Date(a['dateTimeOfPost']));
        
        createDOMElementsForSavedPosts();
        
    }
    else {
        noSavedPosts.classList.remove('hidden');
        imageGridForSavedPosts.classList.add('hidden');
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
        savedHeader.textContent = 'Saved Posts';

        if(listOfSavedPosts.length>0) {
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
        savedHeader.textContent = 'Saved Reels';

        if(listOfSavedReels.length>0) {
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
        savedHeader.textContent = 'Saved Sounds';

        if(listOfSavedSounds.length>0) {
            imageGridForSavedSounds.classList.remove('hidden');
        }
        else {
            noSavedSounds.classList.remove('hidden');
        }
    }
}

function togglePlaySavedSound(savedSoundNumber) {
    const playIconToToggle = document.getElementById('playSavedSound'+savedSoundNumber);
    const pauseIconToToggle = document.getElementById('pauseSavedSound'+savedSoundNumber);
    
    if(playIconToToggle.classList.contains('hidden')) {
        playIconToToggle.classList.remove('hidden');
        pauseIconToToggle.classList.add('hidden');
    }
    else {
        playIconToToggle.classList.add('hidden');
        pauseIconToToggle.classList.remove('hidden');
    }
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
    let postImage = document.getElementById(postId+"Image");
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

function createDOMElementsForSavedPosts() {
    let counter = 0;
    let index=0;
    let newRowDiv = document.createElement('div');
    newRowDiv.style.display = 'flex';
    newRowDiv.style.justifyContent = 'start';
    newRowDiv.style.alignItems = 'center';
    newRowDiv.style.width = '100%';
    newRowDiv.style.gap = '0.3em';

    for(let post of listOfSavedPosts) {
        counter++;
        index++;
        if(counter>3) {
            imageGridForSavedPosts.appendChild(newRowDiv);
            counter=1;
            newRowDiv = document.createElement('div');
            newRowDiv.style.display = 'flex';
            newRowDiv.style.justifyContent = 'start';
            newRowDiv.style.alignItems = 'center';
            newRowDiv.style.width = '100%';
            newRowDiv.style.gap = '0.3em';
        }

        const postDiv = document.createElement('div');
        postDiv.id = 'post'+index;
        postDiv.style.position = 'relative';
        postDiv.style.height = '25em';
        postDiv.style.width = '23em';
        postDiv.style.cursor = 'pointer';

        const imgOfFirstSlideOfPost = document.createElement('img');
        imgOfFirstSlideOfPost.id = 'post'+index+'Image';
        imgOfFirstSlideOfPost.style.position = 'absolute';
        imgOfFirstSlideOfPost.style.top = '0%';
        imgOfFirstSlideOfPost.style.left = '0%';
        imgOfFirstSlideOfPost.style.height = '100%';
        imgOfFirstSlideOfPost.style.width = '100%';

        if('base64StringOfImageWithSmallestSlideNumber' in post) {
            //first slide is an image
            imgOfFirstSlideOfPost.src = post['base64StringOfImageWithSmallestSlideNumber'];
        }
        else {
            //first slide is a video
            const video = document.createElement('video');
            video.src = post['videoURL'];

            video.muted = true;

            video.addEventListener('loadeddata', () => {
                video.currentTime = 5;
            });

            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageDataUrl = canvas.toDataURL('image/png');

                imgOfFirstSlideOfPost.src = imageDataUrl;
            });
        }

        postDiv.onmouseenter = (() => {
            const currentIndex = index;
            return () => showNumLikesAndCommentsOfPost('post' + currentIndex);
        })();
        
        postDiv.onmouseleave = (() => {
            const currentIndex = index;
            return () => hideNumLikesAndCommentsOfPost('post' + currentIndex);
        })();
        
        postDiv.appendChild(imgOfFirstSlideOfPost);

        if(post['hasMoreThanOneSlide']) {
            const iconOverlay = document.createElement('img');
            iconOverlay.src = '/images/multipleSlidesIcon.png';
            iconOverlay.style.position = 'absolute';
            iconOverlay.style.left = '87%';
            iconOverlay.style.top = '3%';
            iconOverlay.style.height = '1.9em';
            iconOverlay.style.width = '1.9em';
            iconOverlay.style.objectFit = 'contain';
            
            postDiv.appendChild(iconOverlay);
        }

        const heartIcon = document.createElement('img');
        heartIcon.id = 'post'+index+'WhiteHeartIcon';
        heartIcon.classList.add('hidden');
        heartIcon.src = '/images/whiteHeartIcon.png';
        heartIcon.style.objectFit = 'contain';
        heartIcon.style.height = '2em';
        heartIcon.style.width = '2em';
        heartIcon.style.position = 'absolute';
        heartIcon.style.left = '20%';
        heartIcon.style.top = '45%';
        
        postDiv.appendChild(heartIcon);

        const numLikesElement = document.createElement('b');
        numLikesElement.id = 'post'+index+'NumLikes';
        numLikesElement.classList.add('hidden');
        numLikesElement.style.color = 'white';
        numLikesElement.style.position = 'absolute';
        numLikesElement.style.left = '33%';
        numLikesElement.style.top = '47%';
        numLikesElement.textContent =  post['numLikes'];
        
        postDiv.appendChild(numLikesElement);

        const commentIcon = document.createElement('img');
        commentIcon.id = 'post'+index+'WhiteCommentIcon';
        commentIcon.classList.add('hidden');
        commentIcon.src = '/images/whiteCommentIcon.png';
        commentIcon.style.objectFit = 'contain';
        commentIcon.style.height = '2em';
        commentIcon.style.width = '2em';
        commentIcon.style.position = 'absolute';
        commentIcon.style.left = '53%';
        commentIcon.style.top = '45%';
        
        postDiv.appendChild(commentIcon);

        const numCommentsElement = document.createElement('b');
        numCommentsElement.id = 'post'+index+'NumComments'
        numCommentsElement.classList.add('hidden');
        numCommentsElement.style.color = 'white';
        numCommentsElement.style.position = 'absolute';
        numCommentsElement.style.left = '65%';
        numCommentsElement.style.top = '47%';
        numCommentsElement.textContent = post['numComments'];
        
        postDiv.appendChild(numCommentsElement);

        newRowDiv.appendChild(postDiv);

    }

    imageGridForSavedPosts.appendChild(newRowDiv);
}


authenticateUserAndFetchData();