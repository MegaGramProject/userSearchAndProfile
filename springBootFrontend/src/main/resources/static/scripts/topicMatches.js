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
const imageGridForMatchingPosts = document.getElementById('imageGridForMatchingPosts');
const imageGridForMatchingReels= document.getElementById('imageGridForMatchingReels');
const imageGridForMatchingSounds= document.getElementById('imageGridForMatchingSounds')
const noMatchingPosts = document.getElementById('noMatchingPosts');
const noMatchingReels = document.getElementById('noMatchingReels');
const noMatchingSounds = document.getElementById('noMatchingSounds');
const topicHeader = document.getElementById('topicHeader');
const topic = document.getElementById('topic').textContent;

let authenticatedUsername = "";
let displayLeftSidebarPopup = false;
let relevantProfileUserInfo = {};
let currentlyShownSection = 'POSTS';
let listOfMatchingPosts = [];
let listOfMatchingReels = [];
let listOfMatchingSounds = [];
let userBlockings = [];

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

    //get list of postIds whose captions include a hashtag of the topic
    const response2 = await fetch('http://localhost:5022/graphql/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `query {
                postIdsThatAreHashtaggedWithTopic (topic: "${topic}")
            }`
        })
    });
    if(!response2.ok) {
        throw new Error('Network response not ok');
    }

    let postIdsWithCaptionsHashtaggingTopic = await response2.json();

    postIdsWithCaptionsHashtaggingTopic = postIdsWithCaptionsHashtaggingTopic['data']['postIdsThatAreHashtaggedWithTopic'];

    let postIdToPostMappings = [];

    const response2b = await fetch('http://localhost:8013/graphql', {
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
    if(!response2b.ok) {
        throw new Error('Network response not ok');
    }
    userBlockings = await response2b.json();
    userBlockings = userBlockings['data']['getAllUserBlockings'];
    userBlockings = userBlockings.map(userBlocking => {
        if(userBlocking['blockee']===authenticatedUsername) {
            return userBlocking['blocker'];
        }
        return userBlocking['blockee'];
    });


    //get list of posts whose category is the topic or whose postId is in the array of postIds
    const response3 = await fetch('http://localhost:8003/getPostsRelatedToTopic/'+topic, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            postIds: postIdsWithCaptionsHashtaggingTopic
        })
    });

    postIdToPostMappings = await response3.json(); //key: postId, value: relevant info on post
    


    //get list of videos whose category is the topic or whose postId is in the array of postIds
    const response4 = await fetch('http://localhost:8004/getVideosRelatedToTopic/'+topic, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            postIds: postIdsWithCaptionsHashtaggingTopic
        })
    });
    if(!response4.ok) {
        throw new Error('Network response not ok');
    }

    let postIdToVidMappings = await response4.json(); //key: postId, value: relevant info on video

    for(let postId of postIdsWithCaptionsHashtaggingTopic) {
        let postInfo = {};
        postInfo['postId'] = postId;
        if(postId in postIdToPostMappings && postIdToPostMappings[postId]['smallestSlidesNumber']==0) {
            postInfo = postIdToPostMappings[postId];
            postInfo['base64StringOfImageWithSmallestSlideNumber'] = 'data:image/png;base64,'+ postInfo['base64StringOfImageWithSmallestSlideNumber'];
            if(!postInfo['hasMoreThanOneSlide']) {
                if(postId in postIdToVidMappings) {
                    postInfo['hasMoreThanOneSlide'] = true;
                }
            }
        }
        else {
            postInfo = postIdToVidMappings[postId];
            const response = await fetch('http://localhost:8004/getVideo/'+postInfo['videoId']);
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            const videoBlob = await response.blob();
            const videoURL = URL.createObjectURL(videoBlob);
            postInfo['videoURL'] = videoURL;
            
            if(!postInfo['hasMoreThanOneSlide']) {
                if(postId in postIdToPostMappings) {
                    postInfo['hasMoreThanOneSlide'] = true;
                }
            }
        }
        listOfMatchingPosts.push(postInfo);
        delete postIdToPostMappings[postId];
        delete postIdToVidMappings[postId];
    }

    
    for(let postId of Object.keys(postIdToVidMappings)) {
        //this means that this is a video that has been categorized as the topic but has not hashtagged the topic
        if(postIdToVidMappings[postId]['smallestSlideNumber']!==0) {
            continue;
        }
        let postInfo = {};
        postInfo = postIdToVidMappings[postId];
        const response = await fetch('http://localhost:8004/getVideo/'+postInfo['videoId']);
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        const videoBlob = await response.blob();
        const videoURL = URL.createObjectURL(videoBlob);
        postInfo['videoURL'] = videoURL;
        
        if(!postInfo['hasMoreThanOneSlide']) {
            if(postId in postIdToPostMappings) {
                postInfo['hasMoreThanOneSlide'] = true;
            }
        }

        delete postIdToPostMappings[postId];
        listOfMatchingPosts.push(postInfo);
    }

    for(let postId of Object.keys(postIdToPostMappings)) {
        //this means that this is an image-post that has been categorized as the topic but has not hashtagged the topic
        let postInfo = {};
        postInfo = postIdToPostMappings[postId];
        
        postInfo['base64StringOfImageWithSmallestSlideNumber'] = 'data:image/png;base64,'+ postInfo['base64StringOfImageWithSmallestSlideNumber'];
        if(!postInfo['hasMoreThanOneSlide']) {
            if(postId in postIdToVidMappings) {
                postInfo['hasMoreThanOneSlide'] = true;
            }
        }

        listOfMatchingPosts.push(postInfo);
    }


    if(listOfMatchingPosts.length>0) {
        let listOfPostIds = listOfMatchingPosts.map(x => x['postId']);

        const response5 = await fetch('http://localhost:8004/getNumLikesAndCommentsOfMultiplePosts', { //numComments also includes replies
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfPostIds: listOfPostIds
        })
        });
        if(!response5.ok) {
            throw new Error('Network response not ok');
        }
        let postIdToNumLikesMappings = await response5.json(); //key: postId, value: [numLikesOfPost, numCommentsOfPost]
        for(let post of listOfMatchingPosts) {
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
        listOfMatchingPosts.sort((a, b) => new Date(b['dateTimeOfPost']) - new Date(a['dateTimeOfPost']));
        createDOMElementsForMatchingPosts();
    }
    else {
        imageGridForMatchingPosts.classList.add('hidden');
        noMatchingPosts.classList.remove('hidden');
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

function showMatchingPosts() {
    if(currentlyShownSection!=='POSTS') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForMatchingReels.classList.add('hidden');
            noMatchingReels.classList.add('hidden');
        }
        else if(currentlyShownSection==='SOUNDS') {
            soundsIcon.classList.remove('hidden');
            soundsIcon2.classList.add('hidden');
            soundsText.style['color'] = "";
            soundsText.style['font-size'] = "";
            imageGridForMatchingSounds.classList.add('hidden');
            noMatchingSounds.classList.add('hidden');
        }
        postsGridIcon.classList.add('hidden');
        postsGridIcon2.classList.remove('hidden');
        postsText.style['color'] = "black";
        postsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'POSTS';
        topicHeader.textContent = 'Posts for \''+ topic + '\'';

        if(listOfMatchingPosts.length>0) {
            imageGridForMatchingPosts.classList.remove('hidden');
        }
        else {
            noMatchingPosts.classList.remove('hidden');
        }
    }
}

function showMatchingReels() {
    if(currentlyShownSection!=='REELS') {
        if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
            imageGridForMatchingPosts.classList.add('hidden');
            noMatchingPosts.classList.add('hidden');
            
        }
        else if(currentlyShownSection==='SOUNDS') {
            soundsIcon.classList.remove('hidden');
            soundsIcon2.classList.add('hidden');
            soundsText.style['color'] = "";
            soundsText.style['font-size'] = "";
            imageGridForMatchingSounds.classList.add('hidden');
            noMatchingSounds.classList.add('hidden');
        }
        reelsIcon.classList.add('hidden');
        reelsIcon2.classList.remove('hidden');
        reelsText.style['color'] = "black";
        reelsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'REELS';
        topicHeader.textContent = 'Reels for \''+ topic + '\'';

        if(listOfMatchingReels.length>0) {
            imageGridForMatchingReels.classList.remove('hidden');
        }
        else {
            noMatchingReels.classList.remove('hidden');
        }
    }
}

function showMatchingSounds() {
    if(currentlyShownSection!=='SOUNDS') {
        if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
            imageGridForMatchingPosts.classList.add('hidden');
            noMatchingPosts.classList.add('hidden');
        }
        else if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForMatchingReels.classList.add('hidden');
            noMatchingReels.classList.add('hidden');
        }
    
        soundsIcon.classList.add('hidden');
        soundsIcon2.classList.remove('hidden');
        soundsText.style['color'] = "black";
        soundsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'SOUNDS';
        topicHeader.textContent = 'Sounds for \''+ topic + '\'';

        if(listOfMatchingSounds.length>0) {
            imageGridForMatchingSounds.classList.remove('hidden');
        }
        else {
            noMatchingSounds.classList.remove('hidden');
        }
    }
}

function togglePlayMatchingSound(matchingSoundNumber) {
    const playIconToToggle = document.getElementById('playMatchingSound'+matchingSoundNumber);
    const pauseIconToToggle = document.getElementById('pauseMatchingSound'+matchingSoundNumber);
    
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

function createDOMElementsForMatchingPosts() {
    let counter = 0;
    let index=0;
    let newRowDiv = document.createElement('div');
    newRowDiv.style.display = 'flex';
    newRowDiv.style.justifyContent = 'start';
    newRowDiv.style.alignItems = 'center';
    newRowDiv.style.width = '100%';
    newRowDiv.style.gap = '0.3em';

    for(let post of listOfMatchingPosts) {
        let isAnyPosterOfThisPostInUserBlockings = false;
        for(let username of post['usernames']) {
            if(userBlockings.includes(username)) {
                isAnyPosterOfThisPostInUserBlockings = true;
                break;
            }
        }
        if(isAnyPosterOfThisPostInUserBlockings) {
            continue;
        }
        counter++;
        index++;
        if(counter>3) {
            imageGridForMatchingPosts.appendChild(newRowDiv);
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

    imageGridForMatchingPosts.appendChild(newRowDiv);
}


authenticateUserAndFetchData();