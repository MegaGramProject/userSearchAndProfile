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
const blackScreenForLeftSidebar = document.getElementById('blackScreenForLeftSidebar');
const blackScreenForMainSection = document.getElementById('blackScreenForMainSection');
const accountIsPrivate = document.getElementById('accountIsPrivate');
const aboutAccountPopup = document.getElementById('aboutAccountPopup');
const aboutAccountProfilePhoto = document.getElementById('aboutAccountProfilePhoto');
const aboutAccountUsername = document.getElementById('aboutAccountUsername');
const aboutAccountVerifiedIcon = document.getElementById('aboutAccountVerifiedIcon');
const aboutAccountDateJoined = document.getElementById('aboutAccountDateJoined');
const aboutAccountBasedIn = document.getElementById('aboutAccountBasedIn');
const aboutAccountShowIfVerifiedDiv = document.getElementById('aboutAccountShowIfVerifiedDiv');
const profilePhotoAtTop = document.getElementById('profilePhotoAtTop');
const postOrPostsText = document.getElementById('postOrPostsText');
const imageGridForProfileUserPosts = document.getElementById('imageGridForProfileUserPosts');
const imageGridForReels = document.getElementById('imageGridForReels');
const imageGridForTaggedPosts = document.getElementById('imageGridForTaggedPosts');
const noProfileUserPosts = document.getElementById('noProfileUserPosts');
const noProfileUserReels = document.getElementById('noProfileUserReels');
const noProfileUserTaggedPosts = document.getElementById('noProfileUserTaggedPosts');
const editProfileButton = document.getElementById('editProfileButton');
const messageProfileUserButton = document.getElementById('messageProfileUserButton');
const optionsDot = document.getElementById('optionsDot');
const seeOwnSavedPosts = document.getElementById('seeOwnSavedPosts');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');

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
let authenticatedUserRequested = []; //all the users that the authenticated user requested to follow
let profileUserFollowers = [];
let profileUserFollowing = [];
let relevantProfileUserInfo = {};
let isRequestingFollow;
let mutualFollowers = []; //followers of profileUser that authenticatedUser follows
let relevantUserInfo = {}; //key: username(for all users in authenticatedUserFollowing, profileUserFollowers, and profileUserFollowing); value: relevantUserInfo
let userBlockingUsernames = [];
let haveListOfFollowersElementsBeenCreated = false;
let haveListOfFollowingsElementsBeenCreated = false;
let haveListOfMutualFollowersElementsBeenCreated = false;
let flattenedListOfFollowingsAndFollowers = [];
let profileUserPosts = [];
let profileUserReels = [];
let profileUserTaggedPosts = [];
let haveReelDOMElementsBeenCreated = false;
let haveTaggedPostDOMElementsBeenCreated = false;


async function authenticateUserAndFetchData() {
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

    const response1 = await fetch('http://localhost:8003/getProfilePhoto/'+profileUsername);
    if(!response1.ok) {
        throw new Error('Network response not ok');
    }
    let profilePhotoBlob = await response1.blob();
    relevantProfileUserInfo['profilePhotoString'] = URL.createObjectURL(profilePhotoBlob);
    

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
        if(userBlockings[i]['blockee']===profileUsername && profileUsername!==authenticatedUsername) {
            isUserBlocked = true;
            unblockButton.classList.remove('hidden');
            postsReelsTaggedSection.classList.add('hidden');
            optionToBlockOrUnblock.textContent = 'Unblock';
            optionToBlockOrUnblock.onclick= unblockUser;
            userBlockingUsernames.push(profileUsername);
        }
        else if(userBlockings[i]['blocker']===profileUsername && profileUsername!==authenticatedUsername){
            leftSidebar.classList.add('hidden');
            mainSection.classList.add('hidden');
            accountNotFoundOrBlocksYou.classList.remove('hidden');
            return;
        }
        else {
            if(userBlockings[i]['blockee']!==authenticatedUsername) {
                userBlockingUsernames.push(userBlockings[i]['blockee']);
            }
            else {
                userBlockingUsernames.push(userBlockings[i]['blocker']);
            }
        }
    }


    profileUsernameAtTop.classList.remove('hidden');
    if(relevantProfileUserInfo['isVerified']) {
        profileUsernameVerifiedCheck.classList.remove('hidden');
    }
    profileFullName.textContent = relevantProfileUserInfo['fullName'];
    profilePhotoAtTop.src = relevantProfileUserInfo['profilePhotoString'];
    aboutAccountProfilePhoto.src = relevantProfileUserInfo['profilePhotoString'];
    profileIconInLeftSidebar.src = relevantProfileUserInfo['profilePhotoString'];
    if(relevantProfileUserInfo['isVerified']) {
        aboutAccountVerifiedIcon.classList.remove('hidden');
        aboutAccountShowIfVerifiedDiv.classList.remove('hidden');
    }
    aboutAccountBasedIn.textContent = relevantProfileUserInfo['accountBasedIn'];
    aboutAccountDateJoined.textContent = formatDate(relevantProfileUserInfo['created']);

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
    profileUserNumFollowers.textContent = formatNumber(profileUserFollowers.length);
    profileUserNumFollowings.textContent = formatNumber(profileUserFollowing.length);

    if(authenticatedUsername===profileUsername) {
        editProfileButton.classList.remove('hidden');
        messageProfileUserButton.classList.add('hidden');
        seeOwnSavedPosts.classList.remove('hidden');
        optionsDot.classList.add('hidden');
    }
    else if(authenticatedUserFollowing.includes(profileUsername)) {
        followingButton.classList.remove('hidden')
        isFollowingUser = true;
    }
    else {
        //check if isRequestingUser
        followButton.classList.remove('hidden');
        if(relevantProfileUserInfo['isPrivate']) {
            postsReelsTaggedSection.classList.add('hidden');
            accountIsPrivate.classList.remove('hidden');
            accountIsPrivate.getElementsByTagName('img')[0].classList.remove('hidden');
            accountIsPrivate.getElementsByTagName('b')[0].classList.remove('hidden');
            accountIsPrivate.getElementsByTagName('p')[0].classList.remove('hidden');
        }
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

    flattenedListOfFollowingsAndFollowers = [authenticatedUserFollowing, profileUserFollowers, profileUserFollowing].flat();
    const response4 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: flattenedListOfFollowingsAndFollowers
        })
    });
    if(!response4.ok) {
        throw new Error('Network response not ok');
    }
    relevantUserInfo = await response4.json();

    const response5 = await fetch('http://localhost:8003/getProfilePhotosOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: flattenedListOfFollowingsAndFollowers
        })
    });
    if(!response5.ok) {
        throw new Error('Network response not ok');
    }
    const profilePhotoInfoMappings = await response5.json();
    for(let username of Object.keys(profilePhotoInfoMappings)) {
        relevantUserInfo[username]['profilePhotoString'] = 'data:image/png;base64,'+profilePhotoInfoMappings[username];
    }

    //fetch images posted by profile user
    const response6 = await fetch('http://localhost:8003/getPosts/'+profileUsername);
    if(!response6.ok) {
        throw new Error('Network response not ok');
    }
    let imagePosts = await response6.json();

    //fetch videos posted by profile user
    const response7 = await fetch('http://localhost:8004/getVideos/'+profileUsername);
    if(!response7.ok) {
        throw new Error('Network response not ok');
    }
    fetchedVideos = await response7.json();
    postIdToVideoMappings = {}; //key: overallPostId value: list of fetched videos with that overallPostId
    for(let video of fetchedVideos) {
        if(video['overallPostId'] in postIdToVideoMappings) {
            postIdToVideoMappings[video['overallPostId']].push(video);
        }
        else {
            postIdToVideoMappings[video['overallPostId']] = [video];
        }
    }

    listOfPostIds = [];
    for(let i=0; i<imagePosts.length; i++) {
        let post = imagePosts[i];
        let postId = post['id'];
        listOfPostIds.push(postId);
        let postMappings = {}; //key: slideNumber; value: infoOnSlide
        postMappings['dateTimeOfPost'] = post['dateTimeOfPost']; //same for all slides of post
        postMappings['locationOfPost'] = post['locationOfPost']; //same for all slides of post
        postMappings['usernames'] = post['usernames']; //same for all slides of post
        postMappings['postId'] = post['id']; //same for all slides of post
        let videosOfThisPost = [];
        if(postId in postIdToVideoMappings) {
            videosOfThisPost = postIdToVideoMappings[postId];
        }
        for(let j=0; j<post['slides'].length; j++) {
            postMappings[post['slides'][j]] = {
                taggedAccounts: post['taggedAccounts'][j],
                post: 'data:image/png;base64,'+post['posts'][j]
            };
        }
        for(let video of videosOfThisPost) {
            const response = await fetch('http://localhost:8004/getVideo/'+video['videoId']);
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            const videoBlob = await response.blob();
            const videoURL = URL.createObjectURL(videoBlob);

            postMappings[video['slideNumber']] = {
                taggedAccounts: video['taggedAccounts'],
                sections: video['sections'],
                category: video['category'],
                videoURL: videoURL
            };
        }

        profileUserPosts.push(postMappings);
        delete postIdToVideoMappings[postId];
    }

    //some videos posted by the user may not associated with an image-post
    for(let postId of Object.keys(postIdToVideoMappings)) {
        let postMappings = {};
        let vidInCurrPost;
        listOfPostIds.push(postId);
        for(let video of postIdToVideoMappings[postId]) {
            vidInCurrPost = video;
            const response = await fetch('http://localhost:8004/getVideo/'+video['videoId']);
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            const videoBlob = await response.blob();
            const videoURL = URL.createObjectURL(videoBlob);

            postMappings[video['slideNumber']] = {
                taggedAccounts: video['taggedAccounts'],
                sections: video['sections'],
                category: video['category'],
                videoURL: videoURL
            };
        }
        postMappings['dateTimeOfPost'] = vidInCurrPost['dateTimeOfPost']; //same for all slides of post
        postMappings['locationOfPost'] = vidInCurrPost['locationOfPost']; //same for all slides of post
        postMappings['usernames'] = vidInCurrPost['usernames']; //same for all slides of post
        postMappings['postId'] = vidInCurrPost['overallPostId']; //same for all slides of post
        profileUserPosts.push(postMappings);
    }

    profileUserNumPosts.textContent = profileUserPosts.length;
    if(profileUserPosts.length!==1) {
        postOrPostsText.textContent = 'posts';
    }
    else {
        postOrPostsText.textContent = 'post';
    }
    if(profileUserPosts.length==0) {
        noProfileUserPosts.classList.remove('hidden');
    }

    //then fetch reels

    if(listOfPostIds.length>0) {
        const response8 = await fetch('http://localhost:8004/getNumLikesAndCommentsOfMultiplePosts', { //numComments also includes replies
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfPostIds: listOfPostIds
        })
        });
        if(!response8.ok) {
            throw new Error('Network response not ok');
        }
        let postIdToNumLikesMappings = await response8.json(); //key: postId, value: [numLikesOfPost, numCommentsOfPost]
        for(let post of profileUserPosts) {
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
        profileUserPosts.sort((a, b) => new Date(b['dateTimeOfPost']) - new Date(a['dateTimeOfPost']));
        createDOMElementsForProfileUserPosts();
    }
    
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function takeUserHome() {
    window.location.href = "http://localhost:3100/" + authenticatedUsername;
}

function takeUserToEditProfile() {
    window.location.href = "http://localhost:8019/editProfile/"+authenticatedUsername;
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
        toggleLeftSidebarPopupMoreOrLessText.textContent = 'Less';
    }
    else {
        leftSidebarPopup.classList.add('hidden');
        toggleLeftSidebarPopupMoreOrLessText.textContent = 'More';
    }

}

function createDOMElementsForProfileUserPosts() {
    let counter = 0;
    let index=0;
    let newRowDiv = document.createElement('div');
    newRowDiv.style.display = 'flex';
    newRowDiv.style.justifyContent = 'start';
    newRowDiv.style.alignItems = 'center';
    newRowDiv.style.width = '100%';
    newRowDiv.style.gap = '0.4em';

    for(let post of profileUserPosts) {
        counter++;
        index++;
        if(counter>3) {
            imageGridForProfileUserPosts.appendChild(newRowDiv);
            counter=1;
            newRowDiv = document.createElement('div');
            newRowDiv.style.display = 'flex';
            newRowDiv.style.justifyContent = 'start';
            newRowDiv.style.alignItems = 'center';
            newRowDiv.style.width = '100%';
            newRowDiv.style.gap = '0.4em';
        }

        const postDiv = document.createElement('div');
        postDiv.style.position = 'relative';
        postDiv.style.width = '37%';

        const imgOfFirstSlideOfPost = document.createElement('img');
        imgOfFirstSlideOfPost.id = 'post'+index;
        imgOfFirstSlideOfPost.style.cursor = 'pointer';
        imgOfFirstSlideOfPost.style.height = '20em';
        imgOfFirstSlideOfPost.style.width = '100%';

        if('post' in post[0]) {
            //first slide is an image
            imgOfFirstSlideOfPost.src = post[0]['post'];
        }
        else {
            //first slide is a video
            const video = document.createElement('video');
            video.src = post[0]['videoURL'];

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

        imgOfFirstSlideOfPost.onmouseenter = (() => {
            const currentIndex = index;
            return () => showNumLikesAndCommentsOfPost('post' + currentIndex);
        })();
        
        imgOfFirstSlideOfPost.onmouseleave = (() => {
            const currentIndex = index;
            return () => hideNumLikesAndCommentsOfPost('post' + currentIndex);
        })();
        
        postDiv.appendChild(imgOfFirstSlideOfPost);

        if(1 in post) {
            //this means that there is at-least 2 slides
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

    imageGridForProfileUserPosts.appendChild(newRowDiv);
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
            profileUserNumFollowers.textContent = formatNumber(profileUserFollowers.length);
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
        profileUserNumFollowers.textContent = formatNumber(profileUserFollowers.length);
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
    userBlockingUsernames.splice(userBlockingUsernames.indexOf(profileUsername),1);

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

        
        flattenedListOfFollowingsAndFollowers = [authenticatedUserFollowing, profileUserFollowers, profileUserFollowing].flat();
        const response2 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: flattenedListOfFollowingsAndFollowers
            })
        });
        if(!response2.ok) {
            throw new Error('Network response not ok');
        }
        relevantUserInfo = await response2.json();
        
    }
    profileUserNumFollowers.textContent = formatNumber(profileUserFollowers.length);
    profileUserNumFollowings.textContent = formatNumber(profileUserFollowing.length);
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
            imageGridForProfileUserPosts.classList.add('hidden');
            noProfileUserPosts.classList.add('hidden');
        }
        else if(currentlyShownSection==='TAGGED') {
            taggedPostsIcon.classList.remove('hidden');
            taggedPostsIcon2.classList.add('hidden');
            taggedText.style['color'] = "";
            taggedText.style['font-size'] = "";
            imageGridForTaggedPosts.classList.add('hidden');
            noProfileUserTaggedPosts.classList.add('hidden');
        }
        reelsIcon.classList.add('hidden');
        reelsIcon2.classList.remove('hidden');
        reelsText.style['color'] = "black";
        reelsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'REELS';


        if(!haveReelDOMElementsBeenCreated) {
            profileUserReels = [];
            haveReelDOMElementsBeenCreated = true;
        }
        if(profileUserReels.length>0) {
            imageGridForReels.classList.remove('hidden');
        }
        else {
            noProfileUserReels.classList.remove('hidden');
        }

    }
}

function showPosts() {
    if(currentlyShownSection!=='POSTS') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForReels.classList.add('hidden');
            noProfileUserReels.classList.add('hidden');

        }
        else if(currentlyShownSection==='TAGGED') {
            taggedPostsIcon.classList.remove('hidden');
            taggedPostsIcon2.classList.add('hidden');
            taggedText.style['color'] = "";
            taggedText.style['font-size'] = "";
            imageGridForTaggedPosts.classList.add('hidden');
            noProfileUserTaggedPosts.classList.add('hidden');
        }

        postsGridIcon.classList.add('hidden');
        postsGridIcon2.classList.remove('hidden');
        postsText.style['color'] = "black";
        postsText.style['font-size'] = "1.15em";
        currentlyShownSection = 'POSTS';

        if(profileUserPosts.length>0) {
            imageGridForProfileUserPosts.classList.remove('hidden');
        }
        else {
            noProfileUserPosts.classList.remove('hidden');
        }
    }

}

async function showTaggedPosts() {
    if(currentlyShownSection!=='TAGGED') {
        if(currentlyShownSection==='REELS') {
            reelsIcon.classList.remove('hidden');
            reelsIcon2.classList.add('hidden');
            reelsText.style['color'] = "";
            reelsText.style['font-size'] = "";
            imageGridForReels.classList.add('hidden');
            noProfileUserReels.classList.add('hidden');
        }
        else if(currentlyShownSection==='POSTS') {
            postsGridIcon.classList.remove('hidden');
            postsGridIcon2.classList.add('hidden');
            postsText.style['color'] = "";
            postsText.style['font-size'] = "";
            imageGridForProfileUserPosts.classList.add('hidden');
            noProfileUserPosts.classList.add('hidden');
        }

        taggedPostsIcon.classList.add('hidden');
        taggedPostsIcon2.classList.remove('hidden');
        taggedText.style['color'] = "black";
        taggedText.style['font-size'] = "1.15em";
        currentlyShownSection = 'TAGGED';
        imageGridForTaggedPosts.classList.remove('hidden');

        if(!haveTaggedPostDOMElementsBeenCreated) {
            const response = await fetch('http://localhost:8003/getTaggedPosts/'+profileUsername);
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            const taggedPosts = await response.json();

            const response2 = await fetch('http://localhost:8004/getTaggedVideos/'+profileUsername);
            if(!response2.ok) {
                throw new Error('Network response not ok');
            }
            const taggedVideos = await response2.json();

            const postIdToTaggedVideoMappings = {}; //key: postId, value: taggedVideoForThatPostId
            for(let taggedVideo of taggedVideos) {
                postIdToTaggedVideoMappings[taggedVideo['postId']] = taggedVideo;
            }

            let listOfPostIds = [];
            for(let taggedPost of taggedPosts) {
                const postId = taggedPost['postId'];
                let taggedPostInfo = {};
                if(postId in postIdToTaggedVideoMappings) {
                    if(taggedPost['smallestSlideNumberWhereUserIsTagged'] > postIdToTaggedVideoMappings[postId]['smallestSlideNumberWhereUserIsTagged']) {
                        taggedPostInfo = postIdToTaggedVideoMappings[postId];
                        const response = await fetch('http://localhost:8004/getVideo/'+postIdToTaggedVideoMappings[postId]['videoId']);
                        if(!response.ok) {
                            throw new Error('Network response not ok');
                        }
                        const videoBlob = await response.blob();
                        const videoURL = URL.createObjectURL(videoBlob);
                        taggedPostInfo['videoURL'] = videoURL;
                    }
                    else {
                        taggedPostInfo = taggedPost;
                        taggedPostInfo['slideImage'] = 'data:image/png;base64,'+ taggedPostInfo['slideImage']
                    }
                    delete postIdToTaggedVideoMappings[postId];
                }
                else {
                    taggedPostInfo = taggedPost;
                    taggedPostInfo['slideImage'] = 'data:image/png;base64,'+ taggedPostInfo['slideImage']
                }
                profileUserTaggedPosts.push(taggedPostInfo);
                listOfPostIds.push(postId);
            }

            //some tagged videos may not be associated with an image-post
            for(let postId of Object.keys(postIdToTaggedVideoMappings)) {
                const response = await fetch('http://localhost:8004/getVideo/'+postIdToTaggedVideoMappings[postId]['videoId']);
                if(!response.ok) {
                    throw new Error('Network response not ok');
                }
                const videoBlob = await response.blob();
                const videoURL = URL.createObjectURL(videoBlob);
                let taggedPostInfo = postIdToTaggedVideoMappings[postId];
                taggedPostInfo['videoURL'] = videoURL;
                profileUserTaggedPosts.push(taggedPostInfo);
                listOfPostIds.push(postId);
            }

            if(listOfPostIds.length>0) {
                    const response8 = await fetch('http://localhost:8004/getNumLikesAndCommentsOfMultiplePosts', { //numComments also includes replies
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        listOfPostIds: listOfPostIds
                    })
                    });
                    if(!response8.ok) {
                        throw new Error('Network response not ok');
                    }
                    let postIdToNumLikesMappings = await response8.json(); //key: postId, value: [numLikesOfPost, numCommentsOfPost]
                    for(let post of profileUserTaggedPosts) {
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
                    profileUserTaggedPosts.sort((a, b) => new Date(b['dateTimeOfPost']) - new Date(a['dateTimeOfPost']));
                    createDOMElementsForTaggedPosts();
                }
                haveTaggedPostDOMElementsBeenCreated = true;
            }

        if(profileUserTaggedPosts.length>0) {
            imageGridForTaggedPosts.classList.remove('hidden');
        }
        else{
            noProfileUserTaggedPosts.classList.remove('hidden');
        }
            
    }

}

async function createDOMElementsForTaggedPosts() {
    let counter = 0;
    let index=0;
    let newRowDiv = document.createElement('div');
    newRowDiv.style.display = 'flex';
    newRowDiv.style.justifyContent = 'start';
    newRowDiv.style.alignItems = 'center';
    newRowDiv.style.width = '100%';
    newRowDiv.style.gap = '0.4em';

    for(let taggedPost of profileUserTaggedPosts) {
        counter++;
        index++;
        if(counter>3) {
            imageGridForTaggedPosts.appendChild(newRowDiv);
            counter=1;
            newRowDiv = document.createElement('div');
            newRowDiv.style.display = 'flex';
            newRowDiv.style.justifyContent = 'start';
            newRowDiv.style.alignItems = 'center';
            newRowDiv.style.width = '100%';
            newRowDiv.style.gap = '0.4em';
        }

        const postDiv = document.createElement('div');
        postDiv.style.position = 'relative';
        postDiv.style.width = '37%';

        const imgOfFirstSlideOfPost = document.createElement('img');
        imgOfFirstSlideOfPost.id = 'taggedPost'+index;
        imgOfFirstSlideOfPost.style.cursor = 'pointer';
        imgOfFirstSlideOfPost.style.height = '20em';
        imgOfFirstSlideOfPost.style.width = '100%';

        if('slideImage' in taggedPost) {
            //first slide is an image
            imgOfFirstSlideOfPost.src = taggedPost['slideImage'];
        }
        else {
            //first slide is a video
            const video = document.createElement('video');
            video.src = taggedPost['videoURL'];

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

        imgOfFirstSlideOfPost.onmouseenter = (() => {
            const currentIndex = index;
            return () => showNumLikesAndCommentsOfPost('taggedPost' + currentIndex);
        })();
        
        imgOfFirstSlideOfPost.onmouseleave = (() => {
            const currentIndex = index;
            return () => hideNumLikesAndCommentsOfPost('taggedPost' + currentIndex);
        })();
        
        postDiv.appendChild(imgOfFirstSlideOfPost);

        const heartIcon = document.createElement('img');
        heartIcon.id = 'taggedPost'+index+'WhiteHeartIcon';
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
        numLikesElement.id = 'taggedPost'+index+'NumLikes';
        numLikesElement.classList.add('hidden');
        numLikesElement.style.color = 'white';
        numLikesElement.style.position = 'absolute';
        numLikesElement.style.left = '33%';
        numLikesElement.style.top = '47%';
        numLikesElement.textContent = taggedPost['numLikes'];
        
        postDiv.appendChild(numLikesElement);

        const commentIcon = document.createElement('img');
        commentIcon.id = 'taggedPost'+index+'WhiteCommentIcon';
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
        numCommentsElement.id = 'taggedPost'+index+'NumComments'
        numCommentsElement.classList.add('hidden');
        numCommentsElement.style.color = 'white';
        numCommentsElement.style.position = 'absolute';
        numCommentsElement.style.left = '65%';
        numCommentsElement.style.top = '47%';
        numCommentsElement.textContent = taggedPost['numComments'];
        
        postDiv.appendChild(numCommentsElement);

        newRowDiv.appendChild(postDiv);

    }

    imageGridForTaggedPosts.appendChild(newRowDiv);

}

function closeListOfFollowersPopup() {
    displayListOfFollowersPopup = false;
    listOfFollowersPopup.classList.add('hidden');
    blackScreenForLeftSidebar.classList.add('hidden');
    blackScreenForMainSection.classList.add('hidden');
}

function messageUser() {
    window.location.href = "http://localhost:8011/directMessaging/"+authenticatedUsername;
}

function showAboutAccountPopup() {
    if(!isFollowingUser && relevantProfileUserInfo['isPrivate']) {
        return;
    }
    optionsPopup.classList.add('hidden');
    aboutAccountPopup.classList.remove('hidden');
}

function closeAboutAccountPopup() {
    aboutAccountPopup.classList.add('hidden');
    cancelOptionsPopup();
}

function showListOfFollowersPopup() {
    if(!isFollowingUser && relevantProfileUserInfo['isPrivate']) {
        return;
    }
    displayListOfFollowersPopup = true;
    listOfFollowersPopup.classList.remove('hidden');
    blackScreenForLeftSidebar.classList.remove('hidden');
    blackScreenForMainSection.classList.remove('hidden');
    if(!haveListOfFollowersElementsBeenCreated) {
        for(let follower of profileUserFollowers) {
            if(!userBlockingUsernames.includes(follower) && follower!==authenticatedUsername) {
                const containerDiv = document.createElement('div');
                containerDiv.style.display = 'flex';
                containerDiv.style.width = '100%';
                containerDiv.style.justifyContent = 'space-between';
                containerDiv.style.alignItems = 'center';

                const profileDiv = document.createElement('div');
                profileDiv.style.display = 'flex';
                profileDiv.style.alignItems = 'center';
                profileDiv.style.gap = '0.3em';
                profileDiv.style.cursor = 'pointer';
                profileDiv.style.paddingLeft = '1em';
                profileDiv.setAttribute('onclick', "takeToUsersProfile('" + follower+"')");

                const profileImg = document.createElement('img');
                profileImg.src = relevantUserInfo[follower]['profilePhotoString'];
                profileImg.style.objectFit = 'contain';
                profileImg.style.height = '2.6em';
                profileImg.style.width = '2.6em';

                const userInfoDiv = document.createElement('div');
                userInfoDiv.style.display = 'flex';
                userInfoDiv.style.flexDirection = 'column';
                userInfoDiv.style.fontSize = '0.7em';
                userInfoDiv.style.gap = '0.1em';
                userInfoDiv.style.marginTop = '1em';

                const usernameAndVerifiedCheckDiv = document.createElement('div');
                usernameAndVerifiedCheckDiv.style.display = 'flex';
                usernameAndVerifiedCheckDiv.style.alignItems = 'center';
                const usernameBold = document.createElement('b');
                usernameBold.textContent = follower;
                usernameAndVerifiedCheckDiv.appendChild(usernameBold);
                if(relevantUserInfo[follower]['isVerified']) {
                    const verifiedCheck = document.createElement('img');
                    verifiedCheck.src = '/images/verifiedCheck.png';
                    verifiedCheck.style.objectFit = 'contain';
                    verifiedCheck.style.height = '1.3em';
                    verifiedCheck.style.width = '1.3em';
                    verifiedCheck.style.pointerEvents = 'none';
                    usernameAndVerifiedCheckDiv.appendChild(verifiedCheck);
                }

                const fullNameP = document.createElement('p');
                fullNameP.style.marginTop = '0.8em';
                fullNameP.textContent = relevantUserInfo[follower]['fullName'];

                userInfoDiv.appendChild(usernameAndVerifiedCheckDiv);
                userInfoDiv.appendChild(fullNameP);

                profileDiv.appendChild(profileImg);
                profileDiv.appendChild(userInfoDiv);

                containerDiv.appendChild(profileDiv);

                const followingButton = document.createElement('button');
                followingButton.setAttribute('onclick', "toggleFollowInPopup('listOfFollowers', '" + follower + "')");
                followingButton.id = 'listOfFollowersFollowing'+follower;
                followingButton.className = 'hidden';
                followingButton.type = 'button';
                followingButton.style.cursor = 'pointer';
                followingButton.style.backgroundColor = '#edeff0';
                followingButton.style.padding = '0.5em 1em';
                followingButton.style.borderStyle = 'none';
                followingButton.style.borderRadius = '0.4em';
                followingButton.style.fontWeight = 'bold';
                followingButton.textContent = 'Following';
                containerDiv.appendChild(followingButton);

                const requestedButton = document.createElement('button');
                requestedButton.setAttribute('onclick', "cancelFollowRequestInPopup('listOfFollowers', '" + follower + "')");
                requestedButton.id = 'listOfFollowersRequested'+follower;
                requestedButton.className = 'hidden';
                requestedButton.type = 'button';
                requestedButton.style.cursor = 'pointer';
                requestedButton.style.backgroundColor = '#edeff0';
                requestedButton.style.padding = '0.5em 1em';
                requestedButton.style.borderStyle = 'none';
                requestedButton.style.borderRadius = '0.4em';
                requestedButton.style.fontWeight = 'bold';
                requestedButton.textContent = 'Requested';
                containerDiv.appendChild(requestedButton);

                const followButton = document.createElement('button');
                followButton.setAttribute('onclick', "toggleFollowInPopup('listOfFollowers', '" + follower + "')");
                followButton.id = 'listOfFollowersFollow'+follower;
                followButton.className = 'blueButton hidden';
                followButton.type = 'button';
                followButton.style.fontSize = '0.8em';
                followButton.style.padding = '0.4em 0.8em';
                followButton.style.marginRight = '1.5em';
                followButton.textContent = 'Follow';
                containerDiv.appendChild(followButton);

                if(authenticatedUserFollowing.includes(follower)) {
                    followingButton.classList.remove('hidden');
                }
                else {
                    //if authUser requested to follow follower, remove the 'hidden' class from it
                    //else
                    followButton.classList.remove('hidden');
                }

                listOfFollowersPopup.appendChild(containerDiv);
            }
        }
        haveListOfFollowersElementsBeenCreated = true;
    }

}

function takeToUsersProfile(username) {
    window.location.href = "http://localhost:8019/profilePage/"+authenticatedUsername + "/" + username;
}

function showListOfFollowingsPopup() {
    if(!isFollowingUser && relevantProfileUserInfo['isPrivate']) {
        return;
    }
    displayListOfFollowingsPopup = true;
    listOfFollowingsPopup.classList.remove('hidden');
    blackScreenForLeftSidebar.classList.remove('hidden');
    blackScreenForMainSection.classList.remove('hidden');
    if(!haveListOfFollowingsElementsBeenCreated) {
        if(profileUserFollowing.includes(authenticatedUsername)) {
            const containerDiv = document.createElement('div');
            containerDiv.style.display = 'flex';
            containerDiv.style.width = '100%';
            containerDiv.style.justifyContent = 'space-between';
            containerDiv.style.alignItems = 'center';

            const profileDiv = document.createElement('div');
            profileDiv.style.display = 'flex';
            profileDiv.style.alignItems = 'center';
            profileDiv.style.gap = '0.3em';
            profileDiv.style.cursor = 'pointer';
            profileDiv.style.paddingLeft = '1em';
            profileDiv.setAttribute('onclick', "takeToUsersProfile('" + authenticatedUsername+"')");

            const profileImg = document.createElement('img');
            profileImg.src = relevantUserInfo[authenticatedUsername]['profilePhotoString'];
            profileImg.style.objectFit = 'contain';
            profileImg.style.height = '2.6em';
            profileImg.style.width = '2.6em';

            const userInfoDiv = document.createElement('div');
            userInfoDiv.style.display = 'flex';
            userInfoDiv.style.flexDirection = 'column';
            userInfoDiv.style.fontSize = '0.7em';
            userInfoDiv.style.gap = '0.1em';
            userInfoDiv.style.marginTop = '1em';

            const usernameAndVerifiedCheckDiv = document.createElement('div');
            usernameAndVerifiedCheckDiv.style.display = 'flex';
            usernameAndVerifiedCheckDiv.style.alignItems = 'center';
            const usernameBold = document.createElement('b');
            usernameBold.textContent = authenticatedUsername;
            usernameAndVerifiedCheckDiv.appendChild(usernameBold);
            if(relevantUserInfo[authenticatedUsername]['isVerified']) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.objectFit = 'contain';
                verifiedCheck.style.height = '1.3em';
                verifiedCheck.style.width = '1.3em';
                verifiedCheck.style.pointerEvents = 'none';
                usernameAndVerifiedCheckDiv.appendChild(verifiedCheck);
            }

            const fullNameP = document.createElement('p');
            fullNameP.style.marginTop = '0.8em';
            fullNameP.textContent = relevantUserInfo[authenticatedUsername]['fullName'];

            userInfoDiv.appendChild(usernameAndVerifiedCheckDiv);
            userInfoDiv.appendChild(fullNameP);

            profileDiv.appendChild(profileImg);
            profileDiv.appendChild(userInfoDiv);

            containerDiv.appendChild(profileDiv);
            listOfFollowingsPopup.appendChild(containerDiv);
        }
        for(let following of profileUserFollowing) {
            if(!userBlockingUsernames.includes(following) && following!==authenticatedUsername) {
                const containerDiv = document.createElement('div');
                containerDiv.style.display = 'flex';
                containerDiv.style.width = '100%';
                containerDiv.style.justifyContent = 'space-between';
                containerDiv.style.alignItems = 'center';

                const profileDiv = document.createElement('div');
                profileDiv.style.display = 'flex';
                profileDiv.style.alignItems = 'center';
                profileDiv.style.gap = '0.3em';
                profileDiv.style.cursor = 'pointer';
                profileDiv.setAttribute('onclick', "takeToUsersProfile('" + following+"')");

                const profileImg = document.createElement('img');
                profileImg.src = relevantUserInfo[following]['profilePhotoString'];
                profileImg.style.objectFit = 'contain';
                profileImg.style.height = '2.6em';
                profileImg.style.width = '2.6em';

                const userInfoDiv = document.createElement('div');
                userInfoDiv.style.display = 'flex';
                userInfoDiv.style.flexDirection = 'column';
                userInfoDiv.style.fontSize = '0.7em';
                userInfoDiv.style.gap = '0.1em';
                userInfoDiv.style.marginTop = '1em';

                const usernameAndVerifiedCheckDiv = document.createElement('div');
                usernameAndVerifiedCheckDiv.style.display = 'flex';
                usernameAndVerifiedCheckDiv.style.alignItems = 'center';
                const usernameBold = document.createElement('b');
                usernameBold.textContent = following;
                usernameAndVerifiedCheckDiv.appendChild(usernameBold);
                if(relevantUserInfo[following]['isVerified']) {
                    const verifiedCheck = document.createElement('img');
                    verifiedCheck.src = '/images/verifiedCheck.png';
                    verifiedCheck.style.objectFit = 'contain';
                    verifiedCheck.style.height = '1.3em';
                    verifiedCheck.style.width = '1.3em';
                    verifiedCheck.style.pointerEvents = 'none';
                    usernameAndVerifiedCheckDiv.appendChild(verifiedCheck);
                }

                const fullNameP = document.createElement('p');
                fullNameP.style.marginTop = '0.8em';
                fullNameP.textContent = relevantUserInfo[following]['fullName'];

                userInfoDiv.appendChild(usernameAndVerifiedCheckDiv);
                userInfoDiv.appendChild(fullNameP);

                profileDiv.appendChild(profileImg);
                profileDiv.appendChild(userInfoDiv);

                containerDiv.appendChild(profileDiv);

                const followingButton = document.createElement('button');
                followingButton.setAttribute('onclick', "toggleFollowInPopup('listOfFollowings', '" + following + "')");
                followingButton.id = 'listOfFollowingsFollowing'+following;
                followingButton.className = 'hidden';
                followingButton.type = 'button';
                followingButton.style.cursor = 'pointer';
                followingButton.style.backgroundColor = '#edeff0';
                followingButton.style.padding = '0.5em 1em';
                followingButton.style.borderStyle = 'none';
                followingButton.style.borderRadius = '0.4em';
                followingButton.style.fontWeight = 'bold';
                followingButton.textContent = 'Following';
                containerDiv.appendChild(followingButton);

                const requestedButton = document.createElement('button');
                requestedButton.setAttribute('onclick', "cancelFollowRequestInPopup('listOfFollowings', '" + following + "')");
                requestedButton.id = 'listOfFollowingsRequested'+following;
                requestedButton.className = 'hidden';
                requestedButton.type = 'button';
                requestedButton.style.cursor = 'pointer';
                requestedButton.style.backgroundColor = '#edeff0';
                requestedButton.style.padding = '0.5em 1em';
                requestedButton.style.borderStyle = 'none';
                requestedButton.style.borderRadius = '0.4em';
                requestedButton.style.fontWeight = 'bold';
                requestedButton.textContent = 'Requested';
                containerDiv.appendChild(requestedButton);

                const followButton = document.createElement('button');
                followButton.setAttribute('onclick', "toggleFollowInPopup('listOfFollowings', '" + following + "')");
                followButton.id = 'listOfFollowingsFollow'+following;
                followButton.className = 'blueButton hidden';
                followButton.type = 'button';
                followButton.style.fontSize = '0.8em';
                followButton.style.padding = '0.4em 0.8em';
                followButton.style.marginRight = '1.5em';
                followButton.textContent = 'Follow';
                containerDiv.appendChild(followButton);

                if(authenticatedUserFollowing.includes(following)) {
                    followingButton.classList.remove('hidden');
                }
                else {
                    //if authUser requested to follow following, remove the 'hidden' class from it
                    //else
                    followButton.classList.remove('hidden');
                }

                listOfFollowingsPopup.appendChild(containerDiv);
            }
        }
        haveListOfFollowingsElementsBeenCreated = true;
    }
}

function closeListOfFollowingsPopup() {
    displayListOfFollowingsPopup = false;
    listOfFollowingsPopup.classList.add('hidden');
    blackScreenForLeftSidebar.classList.add('hidden');
    blackScreenForMainSection.classList.add('hidden');
}


async function toggleFollowInPopup(popupName, username) {
    let followButtonToToggle = document.getElementById(popupName+"Follow"+username);
    let followingButtonToToggle = document.getElementById(popupName+"Following"+username);

    if(followButtonToToggle.classList.contains('hidden')) {
        const response = await fetch('http://localhost:8013/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        removeUserFollowing(userFollowingToRemove: { follower: "${authenticatedUsername}", followee: "${username}" })
                    }
                    `
                    })
            });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        followButtonToToggle.classList.remove('hidden');
        followingButtonToToggle.classList.add('hidden');
    }
    else {
        if(relevantUserInfo[username]['isPrivate']) {
            //API-call to add follow-request
            let requestedButtonToShow = document.getElementById(popupName+"Requested"+username);
            followButtonToToggle.classList.add('hidden');
            requestedButtonToShow.classList.remove('hidden');

        }
        else {
            const response = await fetch('http://localhost:8013/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `
                    mutation {
                        addUserFollowing(newUserFollowing: { follower: "${authenticatedUsername}", followee: "${username}" })
                    }
                    `
                    })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
            followButtonToToggle.classList.add('hidden');
            followingButtonToToggle.classList.remove('hidden');
        }
    
    }
}

async function cancelFollowRequestInPopup(popupName, username) {
    //API-call to remove follow-request
    let requestedButtonToCancel = document.getElementById(popupName+"Requested"+username);
    let followButtonToToggle = document.getElementById(popupName+"Follow"+username);
    requestedButtonToCancel.classList.add('hidden');
    followButtonToToggle.classList.remove('hidden');
}

function removeSuggestedAccount(username) {
    const suggestedAccountDivToRemove = document.getElementById('suggestedAccount' + username);
    suggestedAccountDivToRemove.style['display'] = 'none';
}

function showListOfMutualFollowersPopup() {
    displayListOfMutualFollowersPopup = true;
    listOfMutualFollowersPopup.classList.remove('hidden');
    blackScreenForLeftSidebar.classList.remove('hidden');
    blackScreenForMainSection.classList.remove('hidden');
    if(!haveListOfMutualFollowersElementsBeenCreated) {
        for(let follower of mutualFollowers) {
            if(!userBlockingUsernames.includes(follower) && follower!==authenticatedUsername) {
                const containerDiv = document.createElement('div');
                containerDiv.style.display = 'flex';
                containerDiv.style.width = '100%';
                containerDiv.style.justifyContent = 'space-between';
                containerDiv.style.alignItems = 'center';

                const profileDiv = document.createElement('div');
                profileDiv.style.display = 'flex';
                profileDiv.style.alignItems = 'center';
                profileDiv.style.gap = '0.3em';
                profileDiv.style.cursor = 'pointer';
                profileDiv.style.paddingLeft = '1em';
                profileDiv.setAttribute('onclick', "takeToUsersProfile('" + follower+"')");

                const profileImg = document.createElement('img');
                profileImg.src = relevantUserInfo[follower]['profilePhotoString'];
                profileImg.style.objectFit = 'contain';
                profileImg.style.height = '2.6em';
                profileImg.style.width = '2.6em';

                const userInfoDiv = document.createElement('div');
                userInfoDiv.style.display = 'flex';
                userInfoDiv.style.flexDirection = 'column';
                userInfoDiv.style.fontSize = '0.7em';
                userInfoDiv.style.gap = '0.1em';
                userInfoDiv.style.marginTop = '1em';

                const usernameAndVerifiedCheckDiv = document.createElement('div');
                usernameAndVerifiedCheckDiv.style.display = 'flex';
                usernameAndVerifiedCheckDiv.style.alignItems = 'center';
                const usernameBold = document.createElement('b');
                usernameBold.textContent = follower;
                usernameAndVerifiedCheckDiv.appendChild(usernameBold);
                if(relevantUserInfo[follower]['isVerified']) {
                    const verifiedCheck = document.createElement('img');
                    verifiedCheck.src = '/images/verifiedCheck.png';
                    verifiedCheck.style.objectFit = 'contain';
                    verifiedCheck.style.height = '1.3em';
                    verifiedCheck.style.width = '1.3em';
                    verifiedCheck.style.pointerEvents = 'none';
                    usernameAndVerifiedCheckDiv.appendChild(verifiedCheck);
                }

                const fullNameP = document.createElement('p');
                fullNameP.style.marginTop = '0.8em';
                fullNameP.textContent = relevantUserInfo[follower]['fullName'];

                userInfoDiv.appendChild(usernameAndVerifiedCheckDiv);
                userInfoDiv.appendChild(fullNameP);

                profileDiv.appendChild(profileImg);
                profileDiv.appendChild(userInfoDiv);

                containerDiv.appendChild(profileDiv);

                const followingButton = document.createElement('button');
                followingButton.setAttribute('onclick', "toggleFollowInPopup('listOfMutualFollowers', '" + follower + "')");
                followingButton.id = 'listOfMutualFollowersFollowing'+follower;
                followingButton.className = 'hidden';
                followingButton.type = 'button';
                followingButton.style.cursor = 'pointer';
                followingButton.style.backgroundColor = '#edeff0';
                followingButton.style.padding = '0.5em 1em';
                followingButton.style.borderStyle = 'none';
                followingButton.style.borderRadius = '0.4em';
                followingButton.style.fontWeight = 'bold';
                followingButton.textContent = 'Following';
                containerDiv.appendChild(followingButton);

                const requestedButton = document.createElement('button');
                requestedButton.setAttribute('onclick', "cancelFollowRequestInPopup('listOfMutualFollowers', '" + follower + "')");
                requestedButton.id = 'listOfMutualFollowersRequested'+follower;
                requestedButton.className = 'hidden';
                requestedButton.type = 'button';
                requestedButton.style.cursor = 'pointer';
                requestedButton.style.backgroundColor = '#edeff0';
                requestedButton.style.padding = '0.5em 1em';
                requestedButton.style.borderStyle = 'none';
                requestedButton.style.borderRadius = '0.4em';
                requestedButton.style.fontWeight = 'bold';
                requestedButton.textContent = 'Requested';
                containerDiv.appendChild(requestedButton);

                const followButton = document.createElement('button');
                followButton.setAttribute('onclick', "toggleFollowInPopup('listOfMutualFollowers', '" + follower + "')");
                followButton.id = 'listOfMutualFollowersFollow'+follower;
                followButton.className = 'blueButton hidden';
                followButton.type = 'button';
                followButton.style.fontSize = '0.8em';
                followButton.style.padding = '0.4em 0.8em';
                followButton.style.marginRight = '1.5em';
                followButton.textContent = 'Follow';
                containerDiv.appendChild(followButton);

                if(authenticatedUserFollowing.includes(follower)) {
                    followingButton.classList.remove('hidden');
                }
                else {
                    //if authUser requested to follow follower, remove the 'hidden' class from it
                    //else
                    followButton.classList.remove('hidden');
                }

                listOfMutualFollowersPopup.appendChild(containerDiv);
            }
        }
        haveListOfMutualFollowersElementsBeenCreated = true;
    }
}

function closeListOfMutualFollowersPopup() {
    displayListOfMutualFollowersPopup = false;
    listOfMutualFollowersPopup.classList.add('hidden');
    blackScreenForLeftSidebar.classList.add('hidden');
    blackScreenForMainSection.classList.add('hidden');
}

function cancelOptionsPopup() {
    optionsPopup.classList.add('hidden');
    blackScreenForLeftSidebar.classList.add('hidden');
    blackScreenForMainSection.classList.add('hidden');
}


function showOptionsPopup() {
    optionsPopup.classList.remove('hidden');
    blackScreenForLeftSidebar.classList.remove('hidden');
    blackScreenForMainSection.classList.remove('hidden');
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
    userBlockingUsernames.push(profileUsername);
    cancelOptionsPopup();

}

function formatNumber(num) {
    let output = "";
    if (num < 1000) {
        return num.toString();
    } else if (num >= 1000 && num < 10000) {
        output = num.toLocaleString();
    } else if (num >= 10000 && num < 1000000) {
        let k = num / 1000;
        output = (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
    } else if (num >= 1000000 && num < 1000000000) {
        let m = num / 1000000;
        output = (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
    } else if (num >= 1000000000) {
        let b = num / 1000000000;
        output = (b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)) + 'B';
    }

    if (output.endsWith('.0K')) {
        output = output.replace('.0K', 'K');
    } else if (output.endsWith('.0M')) {
        output = output.replace('.0M', 'M');
    } else if (output.endsWith('.0B')) {
        output = output.replace('.0B', 'B');
    }

    return output;
}



authenticateUserAndFetchData();