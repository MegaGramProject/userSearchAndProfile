const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const darkScreenCoveringEntirePage = document.getElementById('darkScreenCoveringEntirePage');
const darkScreenCoveringRightSideOfPage = document.getElementById('darkScreenCoveringRightSideOfPage');
const leftSidebar = document.getElementById('leftSidebar');
const mainSection = document.getElementById('mainSection');
const goToNextSlideArrow = document.getElementById('goToNextSlideArrow');
const goToPreviousSlideArrow = document.getElementById('goToPreviousSlideArrow');
const slideDotsDiv = document.getElementById('slideDotsDiv');
const currSlideImg = document.getElementById('currSlideImg');
const currSlideVid = document.getElementById('currSlideVid');
const seeTaggedAccountsIcon = document.getElementById('seeTaggedAccountsIcon');
const mainSectionLeft = document.getElementById('mainSectionLeft');
const mainSectionRight = document.getElementById('mainSectionRight');
const blackBackgroundForVids = document.getElementById('blackBackgroundForVids');
const textareaToAddComment = document.getElementById('textareaToAddComment');
const postCommentButton = document.getElementById('postCommentButton');
const postIsNotSavedIcon = document.getElementById('postIsNotSavedIcon');
const postIsSavedIcon = document.getElementById('postIsSavedIcon');
const postIsNotLikedIcon = document.getElementById('postIsNotLikedIcon');
const postIsLikedIcon = document.getElementById('postIsLikedIcon');
const postNumLikesText = document.getElementById('postNumLikesText');
const commentOptionsPopup = document.getElementById('commentOptionsPopup');
const playBackgroundSoundIcon = document.getElementById('playBackgroundSoundIcon');
const pauseBackgroundSoundIcon = document.getElementById('pauseBackgroundSoundIcon');
const accountNotFoundOrBlocksYou = document.getElementById('accountNotFoundOrBlocksYou');
const changeBackgroundText = document.getElementById('changeBackgroundText');
const profileIconInLeftSidebar = document.getElementById('profileIconInLeftSidebar');
const locationOfPostText = document.getElementById('locationOfPostText');
const followPostAuthorText = document.getElementById('followPostAuthorText');
const followingPostAuthorText = document.getElementById('followingPostAuthorText');
const postAuthorOrAuthorsText = document.getElementById('postAuthorOrAuthorsText');
const relativeDateTimeOfPostText = document.getElementById('relativeDateTimeOfPostText');
const backgroundSongName = document.getElementById('backgroundSongName');
const postBackgroundMusicDiv = document.getElementById('postBackgroundMusicDiv');
const authUserProfilePhotoNextToCommentTextarea = document.getElementById('authUserProfilePhotoNextToCommentTextarea');
const commentsDiv = document.getElementById('commentsDiv');
const mainPostAuthorProfilePhoto = document.getElementById('mainPostAuthorProfilePhoto');

let displayLeftSidebarPopup = false;
let currBackground = 0;
let currSlide = 0;
let hasUserClickedOnVid = false;
let hasUserClickedOnMainSectionRight = false;
let commentToReplyTo = [];
let commentSelectedForOptions = [];
let backgroundSound;
let relevantUserInfo = {};
let authUserFollowings = [];
let slideDots = [];
let postInfo = {};
let postId = "";
let numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments;
let commentsOfPost = [];
let repliesOfPost = [];

let commentsMadeByAuthUser = [];

let parentCommentsOfRepliesMadeByAuthUser = [];

let repliesMadeByAuthUser = [];

let setOfIdsOfUniqueRepliesAlreadyDone = new Set();

let setOfIdsOfCommentsAlreadyDone = new Set();

let repliesOfCommentMappings = {}; //key: commentid, value: listOfRepliesOfComment

let commentsThatMentionAuthUser = [];

let parentCommentsOfRepliesThatMentionAuthUser = [];

let repliesThatMentionAuthUser = [];

let commentsMadeByAuthUserFollowing = [];

let parentCommentsOfRepliesMadeByAuthUserFollowing = []

let repliesMadeByAuthUserFollowing = [];

let commentsMadeByPostAuthor = [];

let parentCommentsOfRepliesMadeByPostAuthor = [];

let repliesMadeByPostAuthor = [];

let regularComments= [];



async function authenticateUserAndFetchData() {
    let username = document.getElementById('authenticatedUsername').textContent;
     //insert actual user authentication code here
    authenticatedUsername = username;
    localStorage.setItem('authenticatedUsername', authenticatedUsername);
    postId = document.getElementById('postId').textContent;

    const response0 = await fetch('http://localhost:8001/getRelevantUserInfoFromUsername/'+authenticatedUsername);
    if(!response0.ok) {
        mainSection.classList.add('hidden');
        leftSidebar.classList.add('hidden');
        changeBackgroundText.classList.add('hidden');
        accountNotFoundOrBlocksYou.classList.remove('hidden');
        return;
    }
    relevantUserInfo = await response0.json();

    const response0b = await fetch('http://localhost:8003/getProfilePhoto/'+authenticatedUsername);
    if(!response0b.ok) {
        throw new Error('Network response not ok');
    }
    let profilePhotoBlob = await response0b.blob();
    const profilePhotoBlobURL = URL.createObjectURL(profilePhotoBlob);
    profileIconInLeftSidebar.src = profilePhotoBlobURL;
    authUserProfilePhotoNextToCommentTextarea.src = profilePhotoBlobURL;

    const response = await fetch('http://localhost:8003/getInDepthPostInfo/'+postId);
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
    const indepthPostInfo = await response.json();
    if(indepthPostInfo[0]===null && indepthPostInfo[1].length==0) {
        mainSection.classList.add('hidden');
        leftSidebar.classList.add('hidden');
        changeBackgroundText.classList.add('hidden');
        accountNotFoundOrBlocksYou.classList.remove('hidden');
        return;
    }

    const [imageSlidesData, videosData] = indepthPostInfo;
    if(imageSlidesData!==null) {
        postInfo['usernames'] = imageSlidesData['usernames'];
    }
    else {
        postInfo['usernames'] = videosData[0]['usernames'];
    }

    /* requires cloud mysql
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
    for(let blocking of userBlockings) {
        if(postInfo['usernames'].includes(blocking['blockee']) || postInfo['usernames'].includes(blocking['blocker'])) {
            mainSection.classList.add('hidden');
            leftSidebar.classList.add('hidden');
            changeBackgroundText.classList.add('hidden');
            accountNotFoundOrBlocksYou.classList.remove('hidden');
            return;
        }
    }
    */

    const response3 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: postInfo['usernames']
        })
    });
    if(!response3.ok) {
        throw new Error('Network response not ok');
    }
    const relevantUserInfoOfPostAuthors = await response3.json();
    for(let username of Object.keys(relevantUserInfoOfPostAuthors)) {
        relevantUserInfo[username] = relevantUserInfoOfPostAuthors[username];
    }

    /* requires Google Cloud MySQL
    const response4 = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `query {
                getAllUserFollowings(filter: {username: "${authenticatedUsername}", justFollowersOfUser: ${false}}) {
                    followee
                }
            }`
        })
    });
    if(!response4.ok) {
        throw new Error('Network response not ok');
    }
    */
    authUserFollowings = ['rishavry6'];

    if(postInfo['usernames'].length==1) {
        postAuthorOrAuthorsText.textContent = postInfo['usernames'][0];
        postAuthorOrAuthorsText.onclick = () => window.location.href = "http://localhost:8019/profilePage/"+postInfo['usernames'][0];
        if(authUserFollowings.includes(postInfo['usernames'][0])) {
            followingPostAuthorText.classList.remove('hidden');
        }
        else {
            followPostAuthorText.classList.remove('hidden');
        }
    }
    else {
        postAuthorOrAuthorsText.textContent = formatUsernames(postInfo['usernames']);
    }

    
    for(let profileAuthor of postInfo['usernames']) {
        if(profileAuthor!==authenticatedUsername && relevantUserInfo[profileAuthor].isPrivate && !authUserFollowings.includes(authenticatedUsername)) {
            mainSection.classList.add('hidden');
            leftSidebar.classList.add('hidden');
            changeBackgroundText.classList.add('hidden');
            accountNotFoundOrBlocksYou.classList.remove('hidden');
            return;
        }
    }

    if(imageSlidesData!==null) {
        postInfo['dateTimeOfPost'] = imageSlidesData['dateTimeOfPost'];
        postInfo['locationOfPost'] = imageSlidesData['locationOfPost'];
    }
    else {
        postInfo['dateTimeOfPost'] = videosData[0]['dateTimeOfPost'];
        postInfo['locationOfPost'] = videosData[0]['locationOfPost'];
    }
    locationOfPostText.textContent = postInfo['locationOfPost'];
    relativeDateTimeOfPostText.textContent = getRelativeDateTimeText(postInfo['dateTimeOfPost']);
    if(imageSlidesData==null) {
        postInfo['numSlides'] = videosData.length;
    }
    else {
        postInfo['numSlides'] = imageSlidesData['slides'].length + videosData.length;
        for(let i=0; i<imageSlidesData['slides'].length; i++) {
            const currSlide = imageSlidesData['slides'][i];
            postInfo[currSlide] = {};
            postInfo[currSlide].isVideo = false;
            postInfo[currSlide].src = 'data:image/png;base64,'+ imageSlidesData['posts'][i];
            postInfo[currSlide].taggedAccounts = imageSlidesData['taggedAccounts'][i];
        }
    }
    for(let vid of videosData) {
        const currSlide = vid['slideNumber'];
        postInfo[currSlide] = {};
        postInfo[currSlide].isVideo = true;
        postInfo[currSlide].taggedAccounts = vid['taggedAccounts'];
        const response = await fetch('http://localhost:8004/getVideo/'+vid['videoId']);
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        const videoBlob = await response.blob();
        const videoURL = URL.createObjectURL(videoBlob);
        postInfo[currSlide].src = videoURL;
    }

    if(!postInfo[currSlide].isVideo) {
        currSlideImg.src = postInfo[currSlide].src;
        currSlideImg.classList.remove('hidden');
        seeTaggedAccountsIcon.style.top = '87%';
    }
    else {
        currSlideVid.src = postInfo[currSlide].src;
        currSlideImg.classList.add('hidden');
        blackBackgroundForVids.classList.remove('hidden');
        currSlideVid.classList.remove('hidden');
        seeTaggedAccountsIcon.style.top = '80%';
    }
    if(postInfo.numSlides>0) {
        const currentSlideDot = document.createElement('img');
        currentSlideDot.src = '/images/solidWhiteDot.png';
        currentSlideDot.style.height = '1.2em';
        currentSlideDot.style.width = '1.2em';
        currentSlideDot.style.objectFit = 'contain';
        currentSlideDot.style.pointerEvents = 'none';
        slideDotsDiv.appendChild(currentSlideDot);
        for(let i=0; i<postInfo.numSlides-1; i++) {
            const additionalSlideDot = document.createElement('img');
            additionalSlideDot.src = '/images/solidGrayDot.png';
            additionalSlideDot.style.height = '1em';
            additionalSlideDot.style.width = '1em';
            additionalSlideDot.style.objectFit = 'contain';
            additionalSlideDot.style.pointerEvents = 'none';
            slideDotsDiv.appendChild(additionalSlideDot);
        }
        slideDots = slideDotsDiv.querySelectorAll('img');
    }
    else {
        goToPreviousSlideArrow.classList.add('hidden');
        goToNextSlideArrow.classList.add('hidden');
    }

    const response5 = await fetch('http://localhost:8006/getPostBackgroundMusic/'+postId);
    if(!response5.ok) {
        //post probably has no background music
    }
    else {
        const backgroundSoundBlob = await response5.blob();
        const backgroundSoundBlobURL = URL.createObjectURL(backgroundSoundBlob);
        backgroundSound = new Audio(backgroundSoundBlobURL);
        backgroundSongName.textContent = response5.headers.get('songName');
        postBackgroundMusicDiv.classList.remove('hidden');
    }

    const response6 = await fetch('http://localhost:8004/isPostSavedByUser/'+postId+'/'+authenticatedUsername);
    if(!response6.ok) {
        throw new Error('Network response not ok');
    }
    let isPostSavedByUser = await response6.json();
    isPostSavedByUser = isPostSavedByUser['isPostSavedByUser'];
    postInfo['isPostSavedByUser'] = isPostSavedByUser;
    if(isPostSavedByUser) {
        postIsSavedIcon.classList.remove('hidden');
    }
    else {
        postIsNotSavedIcon.classList.remove('hidden');
    }

    const response7 = await fetch('http://localhost:8004/getPostNumLikesAndIsLikedByUser/'+postId+'/'+authenticatedUsername);
    if(!response7.ok) {
        throw new Error('Network response not ok');
    }
    let postNumLikesAndIsLikedByUser = await response7.json();
    postInfo['numLikes'] = postNumLikesAndIsLikedByUser['numLikes'];
    postInfo['isLikedByUser'] = postNumLikesAndIsLikedByUser['isLikedByUser'];

    if(postInfo['numLikes']==1) {
        postNumLikesText.textContent = '1 like';
    }
    else {
        postNumLikesText.textContent = postInfo['numLikes'] + " likes";
    }
    if(postInfo['isLikedByUser']) {
        postIsLikedIcon.classList.remove('hidden');
    }
    else {
        postIsNotLikedIcon.classList.remove('hidden');
    }

    const response8 = await fetch('http://localhost:5022/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `query {
                comments(where: { postid: { eq: "${postId}" } }) {
                    commentid
                    comment
                    datetime
                    iscaption
                    isedited
                    username
            }
            }
            `
        })
    });
    if(!response8.ok) {
        throw new Error('Network response not ok');
    }
    commentsOfPost = await response8.json();
    commentsOfPost = commentsOfPost['data']['comments'];
   // commentsOfPost = commentsOfPost.filter(x=>!userBlockings.includes(x.username));

    const response9 = await fetch('http://localhost:5022/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `query {
            replies(where: { postid: { eq: "${postId}" } }) {
                commentid
                username
                comment
                datetime
                isedited
                replyid
            }
            }
            `
        })
    });
    if(!response9.ok) {
        throw new Error('Network response not ok');
    }
    repliesOfPost = await response9.json();
    repliesOfPost = repliesOfPost['data']['replies'];
    // repliesOfPost = repliesOfPost.filter(x=>!userBlockings.includes(x.username));

    const formattedUsernames = `[${postInfo['usernames'].map(name => `"${name}"`).join(", ")}]`;
    const response10 = await fetch('http://localhost:5022/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `query {
                numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments(postid: "${postId}", username: "${authenticatedUsername}", postAuthors: ${formattedUsernames}) {
                    commentId
                    numLikes
                    isLikedByUser
                    isLikedByPostAuthor
                }
            }
            `
        })
    });
    if(!response10.ok) {
        throw new Error('Network response not ok');
    }
    numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments = await response10.json();
    numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments = numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments['data']['numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments'];
    let placeholderDict = {};
    for(let elem of numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments) {
        placeholderDict[elem['commentId']] = [elem['numLikes'], elem['isLikedByUser'], elem['isLikedByPostAuthor']];
    }
    numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments = placeholderDict;

    //the set below will always include the username of the main post-author, since that person is the author of the caption comment
    const setOfCommentAuthors = new Set();
    for(let comment of commentsOfPost) {
        setOfCommentAuthors.add(comment['username']);
    }
    for(let reply of repliesOfPost) {
        setOfCommentAuthors.add(reply['username']);
    }

    const listOfCommentAuthors = Array.from(setOfCommentAuthors);

    const response11 = await fetch('http://localhost:8001/getRelevantUserInfoOfMultipleUsers', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                listOfUsers: listOfCommentAuthors
            })
        });
    if(!response11.ok) {
        throw new Error('Network response not ok');
    }
    const relevantInfoOfMultipleUsers = await response11.json();
    for(let username of Object.keys(relevantInfoOfMultipleUsers)) {
        relevantUserInfo[username] = relevantInfoOfMultipleUsers[username];
    }

    const response12 = await fetch('http://localhost:8003/getProfilePhotosOfMultipleUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            listOfUsers: listOfCommentAuthors
        })
    });
    if(!response12.ok) {
        throw new Error('Network response not ok');
    }
    const profilePhotoInfoMappings = await response12.json();
    for(let username of Object.keys(profilePhotoInfoMappings)) {
        relevantUserInfo[username]['profilePhotoString'] = 'data:image/png;base64,'+profilePhotoInfoMappings[username];
    }
    mainPostAuthorProfilePhoto.src = relevantUserInfo[postInfo['usernames'][0]]['profilePhotoString'];
    mainPostAuthorProfilePhoto.onclick = () => takeUserToOwnProfile();
    createDOMElementsForComments();
}

function createDOMElementsForComments() {
    createDOMElementsForCaption();
    createDOMElementsForAuthUserComments();
    createDOMElementsForAuthUserReplies();
    createDOMElementsForCommentsMentioningAuthUser();
    createDOMElementsForRepliesMentioningAuthUser();
    createDOMElementsForCommentsMadeByAuthUserFollowing();
    createDOMElementsForRepliesMadeByAuthUserFollowing();
    createDOMElementsForCommentsMadeByPostAuthor();
    createDOMElementsForRepliesMadeByPostAuthor();
    createDOMElementsForRegularCommentsThatArentReplies();
}

function createDOMElementsForCaption() {
    let captionComment;
    for(let i=0; i<commentsOfPost.length; i++) {
        if(commentsOfPost[i].iscaption) {
            captionComment = commentsOfPost[i];
            break;
        }
    }
    const postCaption = document.createElement('div');
    postCaption.id = 'postCaption';
    postCaption.style.display = 'flex';
    postCaption.style.alignItems = 'center';
    postCaption.style.position = 'relative';
    postCaption.style.gap = '0.7em';
    postCaption.style.marginTop = '-0.5em';
    postCaption.style.width = '100%';

    const profileImage = document.createElement('img');
    profileImage.src = relevantUserInfo[captionComment.username]['profilePhotoString'];
    profileImage.style.cursor = 'pointer';
    profileImage.style.height = '2em';
    profileImage.style.width = '2em';
    profileImage.style.objectFit = 'contain';
    profileImage.onclick = () => takeToProfile(captionComment.username);

    const innerDiv = document.createElement('div');
    innerDiv.style.display = 'flex';
    innerDiv.style.flexDirection = 'column';
    innerDiv.style.width = '100%';

    const p1 = document.createElement('p');
    p1.style.fontSize = '0.8em';
    p1.style.maxWidth = '80%';
    p1.style.overflowWrap = 'break-word';

    const boldText = document.createElement('b');
    boldText.style.cursor = 'pointer';
    boldText.textContent = captionComment.username;
    boldText.onclick = () => takeToProfile(captionComment.username);

    p1.appendChild(boldText);
    p1.appendChild(document.createTextNode(' ' + captionComment.comment));

    const p2 = document.createElement('p');
    p2.style.color = 'gray';
    p2.style.fontSize = '0.7em';
    p2.style.marginTop = '-0.8em';
    p2.textContent = getRelativeDateTimeText(captionComment.datetime);
    if(captionComment.isedited) {
        p2.textContent+= " · Edited";
    }

    innerDiv.appendChild(p1);
    innerDiv.appendChild(p2);

    postCaption.appendChild(profileImage);
    postCaption.appendChild(innerDiv);

    commentsDiv.appendChild(postCaption);

    setOfIdsOfCommentsAlreadyDone.add(captionComment.commentid);
}

function createDOMElementsForAuthUserComments() {
    for(let i=0; i<commentsOfPost.length; i++) {
        const currComment = commentsOfPost[i];
        if(currComment.username===authenticatedUsername && !currComment.iscaption) {
            const uniqueRepliesOfCurrComment = []; //list of replies of authUserComment that are made by authUser, mention authUser, made by authUserFollowing, or by made by a postAuthor
            let numRepliesOfCurrComment = 0; //num replies of currComment that aren't in the list uniqueRepliesOfCurrComment

            for(let j=0; j<repliesOfPost.length; j++) {
                const currReply = repliesOfPost[j];
                if(currReply.commentid === currComment.commentid) {
                    const currReplyNumReplies = repliesOfPost.filter(x=>x.commentid === currReply.replyid).length;
                    if(currReply.username===authenticatedUsername || currReply.comment.includes("@"+authenticatedUsername) ||
                    authUserFollowings.includes(currReply.username) || postInfo['usernames'].includes(currReply.username)) {
                        uniqueRepliesOfCurrComment.push({
                            id: currReply.replyid,
                            isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currReply.username,
                            isVerified: relevantUserInfo[currReply.username].isVerified,
                            content: currReply.comment,
                            numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currReply.datetime),
                            numReplies: currReplyNumReplies,
                            isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                            level: 1,
                            datetime: currReply.datetime,
                            isEdited: currReply.isedited
                        });
                        regularComments.push({
                            id: currReply.replyid,
                            idOfParentComment: currComment.commentid,
                            isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currReply.username,
                            isVerified: relevantUserInfo[currReply.username].isVerified,
                            content: currReply.comment,
                            numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currReply.datetime),
                            numReplies: currReplyNumReplies,
                            isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                            level: 1,
                            datetime: currReply.datetime,
                            isEdited: currReply.isedited
                        });
                        setOfIdsOfUniqueRepliesAlreadyDone.add(currReply.replyid);
                    }
                    else {
                        numRepliesOfCurrComment++;
                    }
                }
                
            }

            uniqueRepliesOfCurrComment.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            commentsMadeByAuthUser.push({
                id: currComment.commentid,
                idOfParentComment: null,
                isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                index: commentsMadeByAuthUser.length,
                author: currComment.username,
                isVerified: relevantUserInfo[authenticatedUsername].isVerified,
                content: currComment.comment,
                numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                date: getRelativeDateTimeText(currComment.datetime),
                numReplies: numRepliesOfCurrComment,
                isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                level: 0,
                datetime: currComment.datetime,
                uniqueReplies: uniqueRepliesOfCurrComment,
                isEdited: currComment.isedited
            });
            setOfIdsOfCommentsAlreadyDone.add(currComment.commentid);
        }
    }

    const sortedCommentsMadeByAuthUser = [...commentsMadeByAuthUser].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    for(let authUserComment of sortedCommentsMadeByAuthUser) {
        const commentIdx = authUserComment.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "authUserComment"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
        mainDiv.onmouseenter = () => showOptionsIcon("AuthUserComment"+commentIdx);
        mainDiv.onmouseleave = () => hideOptionsIcon("AuthUserComment"+commentIdx);

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[authUserComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(authUserComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivAuthUserComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = authenticatedUsername;
        usernameBold.onclick = () => takeToProfile(authUserComment.author);

        if(relevantUserInfo[authUserComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentAuthUserComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("AuthUserComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(authUserComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextAuthUserComment"+commentIdx;
        dateText.textContent = authUserComment.date;
        if(authUserComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextAuthUserComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(authUserComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${authUserComment.numLikes} likes`;
        }
        if(authUserComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("AuthUserComment", commentIdx);

        const optionsIcon = document.createElement("img");
        optionsIcon.id = "optionsIconForAuthUserComment"+commentIdx;
        optionsIcon.className = "hidden";
        optionsIcon.src = "/images/optionsDots.png";
        optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
        optionsIcon.onclick = () => showOptionsPopupForComment("AuthUserComment", commentIdx);
        metaDiv.append(dateText, likesText, replyButton, optionsIcon);

        if(authUserComment.isLikedByAuthor && !postInfo['usernames'].includes(authUserComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextAuthUserComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("AuthUserComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserComment.numReplies})</span>`;
        if(authUserComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextAuthUserComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("AuthUserComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const editModeDiv = document.createElement("div");
        editModeDiv.id = "editModeDivAuthUserComment"+commentIdx;
        editModeDiv.className = "hidden";
        editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";

        const textarea = document.createElement("textarea");
        textarea.id = "textareaForEditingAuthUserComment"+commentIdx;
        textarea.placeholder = "";
        textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
        textarea.oninput = () => onInputOfTextareaForEditingComment("AuthUserComment"+commentIdx);

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.type = "button";
        cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
        cancelButton.onclick = () => cancelCommentEdit("AuthUserComment", commentIdx);

        const confirmButton = document.createElement("button");
        confirmButton.id = "confirmEditButtonAuthUserComment"+commentIdx;
        confirmButton.className = "blueButton hidden";
        confirmButton.textContent = "Ok";
        confirmButton.type = "button";
        confirmButton.style = "font-size: 0.7em;";
        confirmButton.onclick = () => confirmCommentEdit("AuthUserComment", commentIdx);

        editModeDiv.append(textarea, cancelButton, confirmButton);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconAuthUserComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("AuthUserComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconAuthUserComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("AuthUserComment", commentIdx);

        if(authUserComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(editModeDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);

        commentsDiv.appendChild(mainDiv);

        for(let uniqueReply of authUserComment.uniqueReplies) {
            const commentIdx = uniqueReply.index;
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;
            if(uniqueReply.author===authenticatedUsername) {
                mainDiv.onmouseenter = () => showOptionsIcon("RegularComment"+commentIdx);
                mainDiv.onmouseleave = () => hideOptionsIcon("RegularComment"+commentIdx);
            }

            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);

            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";

            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);

            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            if(authUserFollowings.includes(uniqueReply.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(uniqueReply.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);

            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }

            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }

            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            const optionsIcon = document.createElement("img");
            optionsIcon.id = "optionsIconForRegularComment"+commentIdx;
            optionsIcon.className = "hidden";
            optionsIcon.src = "/images/optionsDots.png";
            optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
            optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", commentIdx);
            metaDiv.append(dateText, likesText, replyButton, optionsIcon);

            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';

                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);

                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);

                metaDiv.appendChild(authorDiv);
            }

            textContentDiv.appendChild(metaDiv);

            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }

            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

            textContentDiv.append(viewRepliesText, hideRepliesText);

            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }

            mainDiv.appendChild(textContentDiv);

            if(uniqueReply.author===authenticatedUsername) {
                const editModeDiv = document.createElement("div");
                editModeDiv.id = "editModeDivRegularComment"+commentIdx;
                editModeDiv.className = "hidden";
                editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";

                const textarea = document.createElement("textarea");
                textarea.id = "textareaForEditingRegularComment"+commentIdx;
                textarea.placeholder = "";
                textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
                textarea.oninput = () => onInputOfTextareaForEditingComment("RegularComment"+commentIdx);

                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.type = "button";
                cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
                cancelButton.onclick = () => cancelCommentEdit("RegularComment", commentIdx);

                const confirmButton = document.createElement("button");
                confirmButton.id = "confirmEditButtonRegularComment"+commentIdx;
                confirmButton.className = "blueButton hidden";
                confirmButton.textContent = "Ok";
                confirmButton.type = "button";
                confirmButton.style = "font-size: 0.7em;";
                confirmButton.onclick = () => confirmCommentEdit("RegularComment", commentIdx);

                editModeDiv.append(textarea, cancelButton, confirmButton);
                mainDiv.appendChild(editModeDiv);
            }
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);

            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForAuthUserReplies() {
    for(let i=0; i<repliesOfPost.length; i++) {
        const currReply = repliesOfPost[i];
        if(currReply.username===authenticatedUsername && !(setOfIdsOfUniqueRepliesAlreadyDone.has(currReply.replyid))) {
            let parentComment = commentsOfPost.filter(x=>x.commentid===currReply.commentid);
            if (parentComment.length==0) {
                continue; //only replies of comments are to be dealt with, not replies of replies
            }
            parentComment = parentComment[0];
            let uniqueRepliesOfParentComment = [];
            let authUserRepliesOfParentComment = [];
            let parentCommentNumReplies = 0;

            for(let j=0; j<repliesOfPost.length; j++) {
                const currentReply = repliesOfPost[j];
                if(currentReply.commentid === parentComment.commentid) {
                    if(currentReply.username===authenticatedUsername) {
                        authUserRepliesOfParentComment.push({
                            id: currentReply.replyid,
                            idOfParentComment: currentReply.commentid,
                            isLiked: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][1] : false,
                            index: repliesMadeByAuthUser.length,
                            author: currentReply.username,
                            isVerified: relevantUserInfo[currentReply.username].isVerified,
                            content: currentReply.comment,
                            numLikes: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currentReply.datetime),
                            numReplies: repliesOfPost.filter(x=>x.commentid===currentReply.replyid).length,
                            isLikedByAuthor: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][2] : false,
                            level: 1,
                            datetime: currentReply.datetime,
                            isEdited: currentReply.isedited
                        });
                        repliesMadeByAuthUser.push({
                            id: currentReply.replyid,
                            idOfParentComment: currentReply.commentid,
                            isLiked: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][1] : false,
                            index: repliesMadeByAuthUser.length,
                            author: currentReply.username,
                            isVerified: relevantUserInfo[currentReply.username].isVerified,
                            content: currentReply.comment,
                            numLikes: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currentReply.datetime),
                            numReplies: repliesOfPost.filter(x=>x.commentid===currentReply.replyid).length,
                            isLikedByAuthor: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][2] : false,
                            level: 1,
                            datetime: currentReply.datetime,
                            isEdited: currentReply.isedited
                        });
                        setOfIdsOfUniqueRepliesAlreadyDone.add(currentReply.replyid);
                    }
                    else if(currentReply.comment.includes("@"+authenticatedUsername) || postInfo['usernames'].includes(currentReply.username) ||
                    authUserFollowings.includes(currentReply.username)) {
                        uniqueRepliesOfParentComment.push({
                            id: currentReply.replyid,
                            idOfParentComment: currentReply.commentid,
                            isLiked: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currentReply.username,
                            isVerified: relevantUserInfo[currentReply.username].isVerified,
                            content: currentReply.comment,
                            numLikes: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currentReply.datetime),
                            numReplies: repliesOfPost.filter(x=>x.commentid===currentReply.replyid).length,
                            isLikedByAuthor: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][2] : false,
                            level: 1,
                            datetime: currentReply.datetime,
                            isEdited: currentReply.isedited
                        });
                        regularComments.push({
                            id: currentReply.replyid,
                            idOfParentComment: currentReply.commentid,
                            isLiked: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currentReply.username,
                            isVerified: relevantUserInfo[currentReply.username].isVerified,
                            content: currentReply.comment,
                            numLikes: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currentReply.datetime),
                            numReplies: repliesOfPost.filter(x=>x.commentid===currentReply.replyid).length,
                            isLikedByAuthor: currentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currentReply.replyid][2] : false,
                            level: 1,
                            datetime: currentReply.datetime,
                            isEdited: currentReply.isedited
                        });
                        setOfIdsOfUniqueRepliesAlreadyDone.add(currentReply.replyid);
                    }
                    else {
                        parentCommentNumReplies++;
                    }
                }
            }

            uniqueRepliesOfParentComment.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            authUserRepliesOfParentComment.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            parentCommentsOfRepliesMadeByAuthUser.push({
                id: parentComment.commentid,
                idOfParentComment: null,
                isLiked: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][1] : false,
                index: parentCommentsOfRepliesMadeByAuthUser.length,
                author: parentComment.username,
                isVerified: relevantUserInfo[parentComment.username].isVerified,
                content: parentComment.comment,
                numLikes: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][0] : 0,
                date: getRelativeDateTimeText(parentComment.datetime),
                numReplies: parentCommentNumReplies, //work on
                isLikedByAuthor: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][2] : false,
                level: 0,
                datetime: parentComment.datetime,
                isEdited: parentComment.isedited,
                uniqueReplies: uniqueRepliesOfParentComment,
                authUserReplies: authUserRepliesOfParentComment
            });
            setOfIdsOfCommentsAlreadyDone.add(parentComment.commentid);
            
        }
    }

    const sortedRepliesMadeByAuthUser = [...repliesMadeByAuthUser].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    const setOfIdsOfAuthUserRepliesWhoseDOMElementsHaveBeenCreated = new Set();

    for(let i=0; i<sortedRepliesMadeByAuthUser.length; i++) {
        const authUserReply = repliesMadeByAuthUser[i];
        if(!(setOfIdsOfAuthUserRepliesWhoseDOMElementsHaveBeenCreated.has(authUserReply.id))) {
            const parentComment = parentCommentsOfRepliesMadeByAuthUser.filter(x=>x.id===authUserReply.idOfParentComment)[0];
            const parentCommentIdx = parentComment.index;
            const mainDiv = document.createElement("div");
            mainDiv.id = "parentOfAuthUserReply"+parentCommentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[parentComment.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(parentComment.author);
            mainDiv.appendChild(profileImg);

            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivParentOfAuthUserReply"+parentCommentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";

            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = parentComment.author;
            usernameBold.onclick = () => takeToProfile(parentComment.author);

            if(relevantUserInfo[parentComment.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            if(authUserFollowings.includes(parentComment.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(parentComment.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentParentOfAuthUserReply"+parentCommentIdx;
            commentSpan.ondblclick = () => likeComment("ParentOfAuthUserReply", parentCommentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(parentComment.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);

            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

            const dateText = document.createElement("p");
            dateText.id = "dateTextParentOfAuthUserReply"+parentCommentIdx;
            dateText.textContent = parentComment.date;
            if(parentComment.isEdited) {
                dateText.textContent+= " · Edited";
            }

            const likesText = document.createElement("b");
            likesText.id = "numLikesTextParentOfAuthUserReply"+parentCommentIdx;
            likesText.style = "cursor: pointer;";
            if(parentComment.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${parentComment.numLikes} likes`;
            }
            if(parentComment.numLikes==0) {
                likesText.classList.add('hidden');
            }

            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("ParentOfAuthUserReply", parentCommentIdx);

            metaDiv.append(dateText, likesText, replyButton);

            if(parentComment.isLikedByAuthor && !postInfo['usernames'].includes(parentComment.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';

                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);

                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);

                metaDiv.appendChild(authorDiv);
            }

            textContentDiv.appendChild(metaDiv);

            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextParentOfAuthUserReply"+parentCommentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserReply", parentCommentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${parentComment.numReplies})</span>`;
            if(parentComment.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }

            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextParentOfAuthUserReply"+parentCommentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserReply", parentCommentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

            textContentDiv.append(viewRepliesText, hideRepliesText);

            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconParentOfAuthUserReply"+parentCommentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserReply", parentCommentIdx);

            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconParentOfAuthUserReply"+parentCommentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserReply", parentCommentIdx);

            if(parentComment.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }

            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);

            for(let authUserReplyOfParentComment of parentComment.authUserReplies) {
                const replyIndex = authUserReplyOfParentComment.index;
                const mainDiv = document.createElement("div");
                mainDiv.id = "authUserReply"+replyIndex;
                mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
                mainDiv.style.marginLeft = `${authUserReplyOfParentComment.level*5}em`;
                mainDiv.onmouseenter = () => showOptionsIcon("AuthUserReply"+replyIndex);
                mainDiv.onmouseleave = () => hideOptionsIcon("AuthUserReply"+replyIndex);
            
                const profileImg = document.createElement("img");
                profileImg.src = relevantUserInfo[authenticatedUsername]['profilePhotoString'];
                profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
                mainDiv.appendChild(profileImg);
            
                const textContentDiv = document.createElement("div");
                textContentDiv.id = "mainDivAuthUserReply"+replyIndex;
                textContentDiv.style = "display: flex; flex-direction: column;";
            
                const commentParagraph = document.createElement("p");
                commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
            
                const usernameBold = document.createElement("b");
                usernameBold.style = "cursor: pointer;";
                usernameBold.textContent = authenticatedUsername;
            
                if(relevantUserInfo[authenticatedUsername].isVerified) {
                    const verifiedCheck = document.createElement('img');
                    verifiedCheck.src = '/images/verifiedCheck.png';
                    verifiedCheck.style.pointerEvents = 'none';
                    verifiedCheck.style.height = '1.1em';
                    verifiedCheck.style.width = '1.1em';
                    verifiedCheck.style.objectFit = 'contain';
                    usernameBold.appendChild(verifiedCheck);
                }
                
                const commentSpan = document.createElement("span");
                commentSpan.id = "contentAuthUserReply"+replyIndex;
                commentSpan.ondblclick = () => likeComment("AuthUserReply", replyIndex);
                commentSpan.innerHTML = parseMentionsToSpans(authUserReplyOfParentComment.content);
                
                commentParagraph.appendChild(usernameBold);
                commentParagraph.append(" ");
                commentParagraph.appendChild(commentSpan);
                textContentDiv.appendChild(commentParagraph);
            
                const metaDiv = document.createElement("div");
                metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
            
                const dateText = document.createElement("p");
                dateText.id = "dateTextAuthUserReply"+replyIndex;
                dateText.textContent = authUserReplyOfParentComment.date;
                if(authUserReplyOfParentComment.isEdited) {
                    dateText.textContent+= " · Edited";
                }
            
                const likesText = document.createElement("b");
                likesText.id = "numLikesTextAuthUserReply"+replyIndex;
                likesText.style = "cursor: pointer;";
                if(authUserReplyOfParentComment.numLikes==1) {
                    likesText.textContent = "1 like";
                }
                else {
                    likesText.textContent = `${authUserReplyOfParentComment.numLikes} likes`;
                }
                if(authUserReplyOfParentComment.numLikes==0) {
                    likesText.classList.add('hidden');
                }
            
                const replyButton = document.createElement("b");
                replyButton.style = "cursor: pointer;";
                replyButton.textContent = "Reply";
                replyButton.onclick = () => startReplyToComment("AuthUserReply", replyIndex);
            
                const optionsIcon = document.createElement("img");
                optionsIcon.id = "optionsIconForAuthUserReply"+replyIndex;
                optionsIcon.className = "hidden";
                optionsIcon.src = "/images/optionsDots.png";
                optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
                optionsIcon.onclick = () => showOptionsPopupForComment("AuthUserReply", replyIndex);
            
                metaDiv.append(dateText, likesText, replyButton, optionsIcon);
                textContentDiv.appendChild(metaDiv);
            
                const viewRepliesText = document.createElement("b");
                viewRepliesText.id = "viewRepliesTextAuthUserReply"+replyIndex;
                viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
                viewRepliesText.onclick = () => toggleRepliesText("AuthUserReply", replyIndex);
                viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserReplyOfParentComment.numReplies})</span>`;
                if(authUserReplyOfParentComment.numReplies==0) {
                    viewRepliesText.classList.add('hidden');
                }
            
                const hideRepliesText = document.createElement("b");
                hideRepliesText.id = "hideRepliesTextAuthUserReply"+replyIndex;
                hideRepliesText.className = "hidden";
                hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
                hideRepliesText.onclick = () => toggleRepliesText("AuthUserReply", replyIndex);
                hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
            
                textContentDiv.append(viewRepliesText, hideRepliesText);
            
                const editModeDiv = document.createElement("div");
                editModeDiv.id = "editModeDivAuthUserReply"+replyIndex;
                editModeDiv.className = "hidden";
                editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";
            
                const textarea = document.createElement("textarea");
                textarea.id = "textareaForEditingAuthUserReply"+replyIndex;
                textarea.placeholder = "";
                textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
                textarea.oninput = () => onInputOfTextareaForEditingComment("AuthUserReply"+replyIndex);
            
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.type = "button";
                cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
                cancelButton.onclick = () => cancelCommentEdit("AuthUserReply", replyIndex);
            
                const confirmButton = document.createElement("button");
                confirmButton.id = "confirmEditButtonAuthUserReply"+replyIndex;
                confirmButton.className = "blueButton hidden";
                confirmButton.textContent = "Ok";
                confirmButton.type = "button";
                confirmButton.style = "font-size: 0.7em;";
                confirmButton.onclick = () => confirmCommentEdit("AuthUserReply", replyIndex);
            
                editModeDiv.append(textarea, cancelButton, confirmButton);
                textContentDiv.appendChild(editModeDiv);
            
                const blankHeartIcon = document.createElement("img");
                blankHeartIcon.id = "blankHeartIconAuthUserReply"+replyIndex;
                blankHeartIcon.src = "/images/blankHeart.png";
                blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
                blankHeartIcon.onclick = () => toggleLikeComment("AuthUserReply", replyIndex);
            
                const redHeartIcon = document.createElement("img");
                redHeartIcon.id = "redHeartIconAuthUserReply"+replyIndex;
                redHeartIcon.className = "hidden";
                redHeartIcon.src = "/images/redHeartIcon.webp";
                redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
                redHeartIcon.onclick = () => toggleLikeComment("AuthUserReply", replyIndex);
            
                mainDiv.appendChild(textContentDiv);
                mainDiv.appendChild(editModeDiv);
                mainDiv.appendChild(blankHeartIcon);
                mainDiv.appendChild(redHeartIcon);
                commentsDiv.appendChild(mainDiv);
                setOfIdsOfAuthUserRepliesWhoseDOMElementsHaveBeenCreated.add(authUserReplyOfParentComment.id);
            }

            for(let uniqueReplyOfParentComment of parentComment.uniqueReplies) {
                const commentIdx = uniqueReplyOfParentComment.index;
                const mainDiv = document.createElement("div");
                mainDiv.id = "regularComment"+commentIdx;
                mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
                mainDiv.style.marginLeft = `${uniqueReplyOfParentComment.level*5}em`;

                const profileImg = document.createElement("img");
                profileImg.src = relevantUserInfo[uniqueReplyOfParentComment.author]['profilePhotoString'];
                profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
                profileImg.onclick = () => takeToProfile(uniqueReplyOfParentComment.author);
                mainDiv.appendChild(profileImg);

                const textContentDiv = document.createElement("div");
                textContentDiv.id = "mainDivRegularComment"+commentIdx;
                textContentDiv.style = "display: flex; flex-direction: column;";

                const commentParagraph = document.createElement("p");
                commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

                const usernameBold = document.createElement("b");
                usernameBold.style = "cursor: pointer;";
                usernameBold.textContent = uniqueReplyOfParentComment.author;
                usernameBold.onclick = () => takeToProfile(uniqueReplyOfParentComment.author);

                if(relevantUserInfo[uniqueReplyOfParentComment.author].isVerified) {
                    const verifiedCheck = document.createElement('img');
                    verifiedCheck.src = '/images/verifiedCheck.png';
                    verifiedCheck.style.pointerEvents = 'none';
                    verifiedCheck.style.height = '1.1em';
                    verifiedCheck.style.width = '1.1em';
                    verifiedCheck.style.objectFit = 'contain';
                    usernameBold.appendChild(verifiedCheck);
                }

                if(authUserFollowings.includes(uniqueReplyOfParentComment.author)) {
                    const followingSpan = document.createElement('span');
                    followingSpan.textContent = " · Following";
                    followingSpan.style.color = "gray";
                    followingSpan.style.fontSize = '0.9em';
                    followingSpan.style.marginRight = '0.7em';
                    usernameBold.appendChild(followingSpan);
    
                }
                else if(postInfo['usernames'].includes(uniqueReplyOfParentComment.author)) {
                    const authorSpan = document.createElement('span');
                    authorSpan.textContent = " · Author";
                    authorSpan.style.color = "gray";
                    authorSpan.style.fontSize = '0.9em';
                    authorSpan.style.marginRight = '0.7em';
                    usernameBold.appendChild(authorSpan);
                }
                
                const commentSpan = document.createElement("span");
                commentSpan.id = "contentRegularComment"+commentIdx;
                commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
                commentSpan.innerHTML = parseMentionsToSpans(uniqueReplyOfParentComment.content);
                
                commentParagraph.appendChild(usernameBold);
                commentParagraph.append(" ");
                commentParagraph.appendChild(commentSpan);
                textContentDiv.appendChild(commentParagraph);

                const metaDiv = document.createElement("div");
                metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

                const dateText = document.createElement("p");
                dateText.id = "dateTextRegularComment"+commentIdx;
                dateText.textContent = uniqueReplyOfParentComment.date;
                if(uniqueReplyOfParentComment.isEdited) {
                    dateText.textContent+= " · Edited";
                }

                const likesText = document.createElement("b");
                likesText.id = "numLikesTextRegularComment"+commentIdx;
                likesText.style = "cursor: pointer;";
                if(uniqueReplyOfParentComment.numLikes==1) {
                    likesText.textContent = "1 like";
                }
                else {
                    likesText.textContent = `${uniqueReplyOfParentComment.numLikes} likes`;
                }
                if(uniqueReplyOfParentComment.numLikes==0) {
                    likesText.classList.add('hidden');
                }

                const replyButton = document.createElement("b");
                replyButton.style = "cursor: pointer;";
                replyButton.textContent = "Reply";
                replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

                const optionsIcon = document.createElement("img");
                optionsIcon.id = "optionsIconForRegularComment"+commentIdx;
                optionsIcon.className = "hidden";
                optionsIcon.src = "/images/optionsDots.png";
                optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
                optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", commentIdx);
                metaDiv.append(dateText, likesText, replyButton, optionsIcon);

                if(uniqueReplyOfParentComment.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReplyOfParentComment.author)) {
                    const authorDiv = document.createElement('div');
                    authorDiv.style.display = 'flex';
                    authorDiv.style.alignItems = 'center';
                    authorDiv.style.gap = '0.35em';

                    const redHeartIcon = document.createElement('img');
                    redHeartIcon.src = '/images/redHeartIcon.webp';
                    redHeartIcon.style.height = '1.2em';
                    redHeartIcon.style.width = '1.2em';
                    redHeartIcon.style.objectFit = 'contain';
                    redHeartIcon.style.pointerEvents = 'none';
                    authorDiv.appendChild(redHeartIcon);

                    const byAuthorText = document.createElement('small');
                    byAuthorText.textContent = 'by author';
                    authorDiv.appendChild(byAuthorText);

                    metaDiv.appendChild(authorDiv);
                }

                textContentDiv.appendChild(metaDiv);

                const viewRepliesText = document.createElement("b");
                viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
                viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
                viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
                viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReplyOfParentComment.numReplies})</span>`;
                if(uniqueReplyOfParentComment.numReplies==0) {
                    viewRepliesText.classList.add('hidden');
                }

                const hideRepliesText = document.createElement("b");
                hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
                hideRepliesText.className = "hidden";
                hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
                hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
                hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

                textContentDiv.append(viewRepliesText, hideRepliesText);

                const blankHeartIcon = document.createElement("img");
                blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
                blankHeartIcon.className = "hidden";
                blankHeartIcon.src = "/images/blankHeart.png";
                blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
                blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

                const redHeartIcon = document.createElement("img");
                redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
                redHeartIcon.className = "hidden";
                redHeartIcon.src = "/images/redHeartIcon.webp";
                redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
                redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

                if(uniqueReplyOfParentComment.isLiked) {
                    redHeartIcon.classList.remove('hidden');
                }
                else {
                    blankHeartIcon.classList.remove('hidden');
                }

                mainDiv.appendChild(textContentDiv);
                mainDiv.appendChild(blankHeartIcon);
                mainDiv.appendChild(redHeartIcon);
                commentsDiv.appendChild(mainDiv);
            }
        }
    }
}

function parseMentionsToSpans(comment) {
    const usernameRegex = /@([a-z0-9._]{1,30})\b/g;
    const hashtagRegex = /#(\w{1,30})\b/g;

    // Replace hashtags
    let result = comment.replace(hashtagRegex, (match, hashtag) => {
        return `<span onclick="takeToHashtagPage('${hashtag}')"
                    style="cursor: pointer; color:#2789f2;">
                ${match}
                </span>`;
    });

    // Replace mentions
    result = result.replace(usernameRegex, (match, username) => {
        return `<span onclick="takeToProfile('${username}')"
                    style="cursor: pointer; color:#2789f2;">
                ${match}
                </span>`;
    });

    return result;
}

function createDOMElementsForCommentsMentioningAuthUser() {
    for(let i=0; i<commentsOfPost.length; i++) {
        const currComment = commentsOfPost[i];
        if(currComment.comment.includes("@"+authenticatedUsername) && !(setOfIdsOfCommentsAlreadyDone.has(currComment.commentid))) {
            let currCommentNumReplies = 0;
            let uniqueRepliesOfCurrComment = [];
            for(let j=0; j<repliesOfPost.length; j++) {
                const currReply = repliesOfPost[j];
                if(currReply.commentid === currComment.commentid) {
                    if(currReply.comment.includes("@"+authenticatedUsername) || authUserFollowings.includes(currReply.username) || postInfo['usernames'].includes(currReply.username)) {
                        const currReplyNumReplies = repliesOfPost.filter(x=>x.commentid === currReply.replyid).length;
                        uniqueRepliesOfCurrComment.push({
                            id: currReply.replyid,
                            idOfParentComment: currReply.commentid,
                            isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currReply.username,
                            isVerified: relevantUserInfo[currReply.username].isVerified,
                            content: currReply.comment,
                            numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currReply.datetime),
                            numReplies: currReplyNumReplies,
                            isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                            level: 1,
                            datetime: currReply.datetime,
                            isEdited: currReply.isedited
                        });
                        regularComments.push({
                            id: currReply.replyid,
                            idOfParentComment: currReply.commentid,
                            isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                            index: regularComments.length,
                            author: currReply.username,
                            isVerified: relevantUserInfo[currReply.username].isVerified,
                            content: currReply.comment,
                            numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                            date: getRelativeDateTimeText(currReply.datetime),
                            numReplies: currReplyNumReplies,
                            isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                            level: 1,
                            datetime: currReply.datetime,
                            isEdited: currReply.isedited
                        });
                        setOfIdsOfUniqueRepliesAlreadyDone.add(currReply.replyid);
                    }
                    else {
                        currCommentNumReplies++;
                    }
                }
            }
            uniqueRepliesOfCurrComment.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            commentsThatMentionAuthUser.push({
                id: currComment.commentid,
                idOfParentComment: null,
                isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                index: commentsThatMentionAuthUser.length,
                author: currComment.username,
                isVerified: relevantUserInfo[currComment.username].isVerified,
                content: currComment.comment,
                numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                date: getRelativeDateTimeText(currComment.datetime),
                numReplies: currCommentNumReplies,
                isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                level: 0,
                datetime: currComment.datetime,
                isEdited: currComment.isedited,
                uniqueReplies: uniqueRepliesOfCurrComment
            });
            setOfIdsOfCommentsAlreadyDone.add(currComment.commentid);
        }
    }

    const sortedCommentsThatMentionAuthUser = [...commentsThatMentionAuthUser].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    for(let authUserMentionComment of sortedCommentsThatMentionAuthUser) {
        const commentIdx = authUserMentionComment.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "authUserMentionComment"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[authUserMentionComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(authUserMentionComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivAuthUserMentionComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = authUserMentionComment.author;
        usernameBold.onclick = () => takeToProfile(authUserMentionComment.author);

        if(relevantUserInfo[authUserMentionComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        if(authUserFollowings.includes(authUserMentionComment.author)) {
            const followingSpan = document.createElement('span');
            followingSpan.textContent = " · Following";
            followingSpan.style.color = "gray";
            followingSpan.style.fontSize = '0.9em';
            followingSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(followingSpan);

        }
        else if(postInfo['usernames'].includes(authUserMentionComment.author)) {
            const authorSpan = document.createElement('span');
            authorSpan.textContent = " · Author";
            authorSpan.style.color = "gray";
            authorSpan.style.fontSize = '0.9em';
            authorSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(authorSpan);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentAuthUserMentionComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("AuthUserMentionComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(authUserMentionComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextAuthUserMentionComment"+commentIdx;
        dateText.textContent = authUserMentionComment.date;
        if(authUserMentionComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextAuthUserMentionComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(authUserMentionComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${authUserMentionComment.numLikes} likes`;
        }
        if(authUserMentionComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("AuthUserMentionComment", commentIdx);


        metaDiv.append(dateText, likesText, replyButton);

        if(authUserMentionComment.isLikedByAuthor && !postInfo['usernames'].includes(authUserMentionComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextAuthUserMentionComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("AuthUserMentionComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserMentionComment.numReplies})</span>`;
        if(authUserMentionComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextAuthUserMentionComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("AuthUserMentionComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconAuthUserMentionComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("AuthUserMentionComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconAuthUserMentionComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("AuthUserMentionComment", commentIdx);

        if(authUserMentionComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let uniqueReply of authUserMentionComment.uniqueReplies) {
            const commentIdx = uniqueReply.index;
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;

            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);

            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";

            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);

            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            if(authUserFollowings.includes(uniqueReply.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(uniqueReply.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);

            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }

            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }

            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            const optionsIcon = document.createElement("img");
            optionsIcon.id = "optionsIconForRegularComment"+commentIdx;
            optionsIcon.className = "hidden";
            optionsIcon.src = "/images/optionsDots.png";
            optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
            optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", commentIdx);
            metaDiv.append(dateText, likesText, replyButton, optionsIcon);

            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';

                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);

                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);

                metaDiv.appendChild(authorDiv);
            }

            textContentDiv.appendChild(metaDiv);

            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }

            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

            textContentDiv.append(viewRepliesText, hideRepliesText);

            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }

            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);

            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForRepliesMentioningAuthUser() {
    for(let i=0; i<repliesOfPost.length; i++) {
        const currReply = repliesOfPost[i];
        if(currReply.comment.includes("@"+authenticatedUsername) && !setOfIdsOfUniqueRepliesAlreadyDone.has(currReply.replyid)) {
            let parentComment = commentsOfPost.filter(x=>x.commentid===currReply.commentid);
            if(parentComment.length==0) {
                continue;
            }
            parentComment = parentComment[0];
            const authUserMentionRepliesOfParentComment = [];
            const uniqueRepliesOfParentComment = [];
            let numRepliesOfParentComment = 0;
            for(let j=0; j<repliesOfPost.length; j++) {
                if(repliesOfPost[j].commentid!==parentComment.commentid) {
                    continue;
                }
                const parentCommentReply = repliesOfPost[j];

                if(parentCommentReply.comment.includes("@"+authenticatedUsername)) {
                    const numRepliesOfParentCommentReply = repliesOfPost.filter(x=>x.commentid===parentCommentReply.replyid).length;
                    authUserMentionRepliesOfParentComment.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesThatMentionAuthUser.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    repliesThatMentionAuthUser.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesThatMentionAuthUser.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(parentCommentReply.replyid);
                }
                else if(authUserFollowings.includes(parentCommentReply.username) || postInfo['usernames'].includes(parentCommentReply.username)) {
                    const numRepliesOfParentCommentReply = repliesOfPost.filter(x=>x.commentid===parentCommentReply.replyid).length;
                    uniqueRepliesOfParentComment.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: regularComments.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    regularComments.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: regularComments.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(parentCommentReply.replyid);
                }
                else {
                    numRepliesOfParentComment++;
                }
            }
            parentCommentsOfRepliesThatMentionAuthUser.push({
                id: parentComment.commentid,
                idOfParentComment: null,
                isLiked: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][1] : false,
                index: parentCommentsOfRepliesThatMentionAuthUser.length,
                author: parentComment.username,
                isVerified: relevantUserInfo[parentComment.username].isVerified,
                content: parentComment.comment,
                numLikes: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][0] : 0,
                date: getRelativeDateTimeText(parentComment.datetime),
                numReplies: numRepliesOfParentComment,
                isLikedByAuthor: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][2] : false,
                level: 0,
                datetime: parentComment.datetime,
                isEdited: parentComment.isedited,
                uniqueReplies: uniqueRepliesOfParentComment,
                authUserMentionReplies: authUserMentionRepliesOfParentComment
            });
            setOfIdsOfCommentsAlreadyDone.add(parentComment.commentid);

        }
    }
    repliesThatMentionAuthUser.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
    const setOfAuthUserMentionReplyIDsWhoseDOMElementsHaveBeenCreated = new Set();

    for(let authUserMentionReply of repliesThatMentionAuthUser) {
        if(setOfAuthUserMentionReplyIDsWhoseDOMElementsHaveBeenCreated.has(authUserMentionReply.id)) {
            continue;
        }
        let parentComment = parentCommentsOfRepliesThatMentionAuthUser.filter(x=>x.id===authUserMentionReply.idOfParentComment);
        parentComment = parentComment[0];
        let commentIdx = parentComment.index;

        const mainDiv = document.createElement("div");
        mainDiv.id = "parentOfAuthUserMentionReply"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[parentComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(parentComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivParentOfAuthUserMentionReply"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = parentComment.author;
        usernameBold.onclick = () => takeToProfile(parentComment.author);

        if(relevantUserInfo[parentComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        if(authUserFollowings.includes(parentComment.author)) {
            const followingSpan = document.createElement('span');
            followingSpan.textContent = " · Following";
            followingSpan.style.color = "gray";
            followingSpan.style.fontSize = '0.9em';
            followingSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(followingSpan);

        }
        else if(postInfo['usernames'].includes(parentComment.author)) {
            const authorSpan = document.createElement('span');
            authorSpan.textContent = " · Author";
            authorSpan.style.color = "gray";
            authorSpan.style.fontSize = '0.9em';
            authorSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(authorSpan);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentParentOfAuthUserMentionReply"+commentIdx;
        commentSpan.ondblclick = () => likeComment("ParentOfAuthUserMentionReply", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(parentComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextParentOfAuthUserMentionReply"+commentIdx;
        dateText.textContent = parentComment.date;
        if(parentComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextParentOfAuthUserMentionReply"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(parentComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${parentComment.numLikes} likes`;
        }
        if(parentComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("ParentOfAuthUserMentionReply", commentIdx);

        metaDiv.appendChild(dateText);
        metaDiv.appendChild(likesText);
        metaDiv.appendChild(replyButton);

        if(parentComment.isLikedByAuthor && !postInfo['usernames'].includes(parentComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextParentOfAuthUserMentionReply"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserMentionReply", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${parentComment.numReplies})</span>`;
        if(parentComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextParentOfAuthUserMentionReply"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserMentionReply", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconParentOfAuthUserMentionReply"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserMentionReply", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconParentOfAuthUserMentionReply"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserMentionReply", commentIdx);

        if(parentComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let authUserMentionReplyOfParentComment of parentComment.authUserMentionReplies) {
            commentIdx = authUserMentionReplyOfParentComment.index;
    
            const mainDiv = document.createElement("div");
            mainDiv.id = "authUserMentionReply"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${authUserMentionReplyOfParentComment.level*5}em`;
    
            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[authUserMentionReplyOfParentComment.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(authUserMentionReplyOfParentComment.author);
            mainDiv.appendChild(profileImg);
    
            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivAuthUserMentionReply"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";
    
            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
    
            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = authUserMentionReplyOfParentComment.author;
            usernameBold.onclick = () => takeToProfile(authUserMentionReplyOfParentComment.author);
    
            if(relevantUserInfo[authUserMentionReplyOfParentComment.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }
    
            if(authUserFollowings.includes(authUserMentionReplyOfParentComment.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(authUserMentionReplyOfParentComment.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentAuthUserMentionReply"+commentIdx;
            commentSpan.ondblclick = () => likeComment("AuthUserMentionReply", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(authUserMentionReplyOfParentComment.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);
    
            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
    
            const dateText = document.createElement("p");
            dateText.id = "dateTextAuthUserMentionReply"+commentIdx;
            dateText.textContent = authUserMentionReplyOfParentComment.date;
            if(authUserMentionReplyOfParentComment.isEdited) {
                dateText.textContent+= " · Edited";
            }
    
            const likesText = document.createElement("b");
            likesText.id = "numLikesTextAuthUserMentionReply"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(authUserMentionReplyOfParentComment.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${authUserMentionReplyOfParentComment.numLikes} likes`;
            }
            if(authUserMentionReplyOfParentComment.numLikes==0) {
                likesText.classList.add('hidden');
            }
    
            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("AuthUserMentionReply", commentIdx);

            metaDiv.appendChild(dateText);
            metaDiv.appendChild(likesText);
            metaDiv.appendChild(replyButton);
    
            if(authUserMentionReplyOfParentComment.isLikedByAuthor && !postInfo['usernames'].includes(authUserMentionReplyOfParentComment.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';
    
                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);
    
                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);
    
                metaDiv.appendChild(authorDiv);
            }
    
            textContentDiv.appendChild(metaDiv);
    
            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextAuthUserMentionReply"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("AuthUserMentionReply", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserMentionReplyOfParentComment.numReplies})</span>`;
            if(authUserMentionReplyOfParentComment.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }
    
            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextAuthUserMentionReply"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("AuthUserMentionReply", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
    
            textContentDiv.append(viewRepliesText, hideRepliesText);
    
            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconAuthUserMentionReply"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("AuthUserMentionReply", commentIdx);
    
            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconAuthUserMentionReply"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("AuthUserMentionReply", commentIdx);
    
            if(authUserMentionReplyOfParentComment.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }
    
            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
            setOfAuthUserMentionReplyIDsWhoseDOMElementsHaveBeenCreated.add(authUserMentionReplyOfParentComment.id);
        }

        for(let uniqueReply of parentComment.uniqueReplies) {
            commentIdx = uniqueReply.index;
    
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;
    
            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);
    
            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";
    
            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
    
            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);
    
            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }
    
            if(authUserFollowings.includes(uniqueReply.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(uniqueReply.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);
    
            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
    
            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }
    
            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }
    
            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            metaDiv.appendChild(dateText);
            metaDiv.appendChild(likesText);
            metaDiv.appendChild(replyButton);
    
            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';
    
                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);
    
                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);
    
                metaDiv.appendChild(authorDiv);
            }
    
            textContentDiv.appendChild(metaDiv);
    
            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }
    
            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
    
            textContentDiv.append(viewRepliesText, hideRepliesText);
    
            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);
    
            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);
    
            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }
    
            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForCommentsMadeByAuthUserFollowing() {
    for(let i=0; i<commentsOfPost.length; i++) {
        const currComment = commentsOfPost[i];
        if(authUserFollowings.includes(currComment.username) && !setOfIdsOfCommentsAlreadyDone.has(currComment.commentid)) {
            let numRepliesOfCurrComment = 0;
            const uniqueRepliesOfCurrComment = [];
            for(let j=0; j<repliesOfPost.length; j++) {
                const currReply = repliesOfPost[j];
                if(currReply.commentid!==currComment.commentid) {
                    continue;
                }
                if(authUserFollowings.includes(currReply.username) || postInfo['usernames'].includes(currReply.username)) {
                    const numRepliesOfCurrReply = repliesOfPost.filter(x=>x.commentid===currReply.replyid).length;
                    uniqueRepliesOfCurrComment.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: numRepliesOfCurrReply,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: 1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited,
                    });
                    regularComments.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: numRepliesOfCurrReply,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: 1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited,
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(currReply.replyid);
                }
                else {
                    numRepliesOfCurrComment++;
                }
            }
            commentsMadeByAuthUserFollowing.push({
                id: currComment.commentid,
                idOfParentComment: null,
                isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                index: commentsMadeByAuthUserFollowing.length,
                author: currComment.username,
                isVerified: relevantUserInfo[currComment.username].isVerified,
                content: currComment.comment,
                numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                date: getRelativeDateTimeText(currComment.datetime),
                numReplies: numRepliesOfCurrComment,
                isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                level: 0,
                datetime: currComment.datetime,
                isEdited: currComment.isedited,
                uniqueReplies: uniqueRepliesOfCurrComment
            });
            setOfIdsOfCommentsAlreadyDone.add(currComment.commentid);
        }
    }
    commentsMadeByAuthUserFollowing.sort((a,b)=> new Date(b.datetime)-new Date(a.datetime));

    for(let authUserFollowingComment of commentsMadeByAuthUserFollowing) {
        const commentIdx = authUserFollowingComment.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "authUserFollowingComment"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[authUserFollowingComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(authUserFollowingComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivAuthUserFollowingComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = authUserFollowingComment.author;
        usernameBold.onclick = () => takeToProfile(authUserFollowingComment.author);

        if(relevantUserInfo[authUserFollowingComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        const followingSpan = document.createElement('span');
        followingSpan.textContent = " · Following";
        followingSpan.style.color = "gray";
        followingSpan.style.fontSize = '0.9em';
        followingSpan.style.marginRight = '0.7em';
        usernameBold.appendChild(followingSpan);
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentAuthUserFollowingComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("AuthUserFollowingComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(authUserFollowingComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextAuthUserFollowingComment"+commentIdx;
        dateText.textContent = authUserFollowingComment.date;
        if(authUserFollowingComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextAuthUserFollowingComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(authUserFollowingComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${authUserFollowingComment.numLikes} likes`;
        }
        if(authUserFollowingComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("AuthUserFollowingComment", commentIdx);

        metaDiv.append(dateText, likesText, replyButton);

        if(authUserFollowingComment.isLikedByAuthor && !postInfo['usernames'].includes(authUserFollowingComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextAuthUserFollowingComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("AuthUserFollowingComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserFollowingComment.numReplies})</span>`;
        if(authUserFollowingComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextAuthUserFollowingComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("AuthUserFollowingComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconAuthUserFollowingComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("AuthUserFollowingComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconAuthUserFollowingComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("AuthUserFollowingComment", commentIdx);

        if(authUserFollowingComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let uniqueReply of authUserFollowingComment.uniqueReplies) {
            const commentIdx = uniqueReply.index;
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;

            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);

            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";

            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);

            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            if(authUserFollowings.includes(uniqueReply.author)) {
                const followingSpan = document.createElement('span');
                followingSpan.textContent = " · Following";
                followingSpan.style.color = "gray";
                followingSpan.style.fontSize = '0.9em';
                followingSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(followingSpan);

            }
            else if(postInfo['usernames'].includes(uniqueReply.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);

            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }

            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }

            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            metaDiv.append(dateText, likesText, replyButton);

            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';

                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);

                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);

                metaDiv.appendChild(authorDiv);
            }

            textContentDiv.appendChild(metaDiv);

            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }

            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

            textContentDiv.append(viewRepliesText, hideRepliesText);

            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }

            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForRepliesMadeByAuthUserFollowing() {
    for(let i=0; i<repliesOfPost.length; i++) {
        const currReply = repliesOfPost[i];
        if(authUserFollowings.includes(currReply.username) && !setOfIdsOfUniqueRepliesAlreadyDone.has(currReply.replyid)) {
            let parentComment = commentsOfPost.filter(x=>x.commentid===currReply.commentid);
            if(parentComment.length==0) {
                continue;
            }
            parentComment = parentComment[0];
            const authUserFollowingRepliesOfParentComment = [];
            const uniqueRepliesOfParentComment = [];
            let numRepliesOfParentComment = 0;
            for(let j=0; j<repliesOfPost.length; j++) {
                if(repliesOfPost[j].commentid!==parentComment.commentid) {
                    continue;
                }
                const parentCommentReply = repliesOfPost[j];

                if(authUserFollowings.includes(parentCommentReply.username)) {
                    const numRepliesOfParentCommentReply = repliesOfPost.filter(x=>x.commentid===parentCommentReply.replyid).length;
                    authUserFollowingRepliesOfParentComment.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesMadeByAuthUserFollowing.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    repliesMadeByAuthUserFollowing.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesMadeByAuthUserFollowing.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(parentCommentReply.replyid);
                }
                else if(postInfo['usernames'].includes(parentCommentReply.username)) {
                    const numRepliesOfParentCommentReply = repliesOfPost.filter(x=>x.commentid===parentCommentReply.replyid).length;
                    uniqueRepliesOfParentComment.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: regularComments.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    regularComments.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: regularComments.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(parentCommentReply.replyid);
                }
                else {
                    numRepliesOfParentComment++;
                }
            }
            parentCommentsOfRepliesMadeByAuthUserFollowing.push({
                id: parentComment.commentid,
                idOfParentComment: null,
                isLiked: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][1] : false,
                index: parentCommentsOfRepliesThatMentionAuthUser.length,
                author: parentComment.username,
                isVerified: relevantUserInfo[parentComment.username].isVerified,
                content: parentComment.comment,
                numLikes: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][0] : 0,
                date: getRelativeDateTimeText(parentComment.datetime),
                numReplies: numRepliesOfParentComment,
                isLikedByAuthor: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][2] : false,
                level: 0,
                datetime: parentComment.datetime,
                isEdited: parentComment.isedited,
                uniqueReplies: uniqueRepliesOfParentComment,
                authUserFollowingReplies: authUserFollowingRepliesOfParentComment
            });
            setOfIdsOfCommentsAlreadyDone.add(parentComment.commentid);

        }
    }
    repliesMadeByAuthUserFollowing.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
    const setOfAuthUserFollowingReplyIDsWhoseDOMElementsHaveBeenCreated = new Set();

    for(let authUserFollowingReply of repliesMadeByAuthUserFollowing) {
        if(setOfAuthUserFollowingReplyIDsWhoseDOMElementsHaveBeenCreated.has(authUserFollowingReply.id)) {
            continue;
        }
        let parentComment = parentCommentsOfRepliesMadeByAuthUserFollowing.filter(x=>x.id===authUserFollowingReply.idOfParentComment);
        parentComment = parentComment[0];
        let commentIdx = parentComment.index;

        const mainDiv = document.createElement("div");
        mainDiv.id = "parentOfAuthUserFollowingReply"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[parentComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(parentComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivParentOfAuthUserFollowingReply"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = parentComment.author;
        usernameBold.onclick = () => takeToProfile(parentComment.author);

        if(relevantUserInfo[parentComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        if(postInfo['usernames'].includes(parentComment.author)) {
            const authorSpan = document.createElement('span');
            authorSpan.textContent = " · Author";
            authorSpan.style.color = "gray";
            authorSpan.style.fontSize = '0.9em';
            authorSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(authorSpan);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentParentOfAuthUserFollowingReply"+commentIdx;
        commentSpan.ondblclick = () => likeComment("ParentOfAuthUserFollowingReply", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(parentComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextParentOfAuthUserFollowingReply"+commentIdx;
        dateText.textContent = parentComment.date;
        if(parentComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextParentOfAuthUserFollowingReply"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(parentComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${parentComment.numLikes} likes`;
        }
        if(parentComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("ParentOfAuthUserFollowingReply", commentIdx);

        metaDiv.appendChild(dateText);
        metaDiv.appendChild(likesText);
        metaDiv.appendChild(replyButton);

        if(parentComment.isLikedByAuthor && !postInfo['usernames'].includes(parentComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextParentOfAuthUserFollowingReply"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserFollowingReply", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${parentComment.numReplies})</span>`;
        if(parentComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextParentOfAuthUserFollowingReply"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("ParentOfAuthUserFollowingReply", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconParentOfAuthUserFollowingReply"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserFollowingReply", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconParentOfAuthUserFollowingReply"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("ParentOfAuthUserFollowingReply", commentIdx);

        if(parentComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let authUserFollowingReplyOfParentComment of parentComment.authUserFollowingReplies) {
            commentIdx = authUserFollowingReplyOfParentComment.index;
    
            const mainDiv = document.createElement("div");
            mainDiv.id = "authUserFollowingReply"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${authUserFollowingReplyOfParentComment.level*5}em`;
    
            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[authUserFollowingReplyOfParentComment.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(authUserFollowingReplyOfParentComment.author);
            mainDiv.appendChild(profileImg);
    
            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivAuthUserFollowingReply"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";
    
            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
    
            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = authUserFollowingReplyOfParentComment.author;
            usernameBold.onclick = () => takeToProfile(authUserFollowingReplyOfParentComment.author);
    
            if(relevantUserInfo[authUserFollowingReplyOfParentComment.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            const followingSpan = document.createElement('span');
            followingSpan.textContent = " · Following";
            followingSpan.style.color = "gray";
            followingSpan.style.fontSize = '0.9em';
            followingSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(followingSpan);
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentAuthUserFollowingReply"+commentIdx;
            commentSpan.ondblclick = () => likeComment("AuthUserFollowingReply", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(authUserFollowingReplyOfParentComment.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);
    
            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
    
            const dateText = document.createElement("p");
            dateText.id = "dateTextAuthUserFollowingReply"+commentIdx;
            dateText.textContent = authUserFollowingReplyOfParentComment.date;
            if(authUserFollowingReplyOfParentComment.isEdited) {
                dateText.textContent+= " · Edited";
            }
    
            const likesText = document.createElement("b");
            likesText.id = "numLikesTextAuthUserFollowingReply"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(authUserFollowingReplyOfParentComment.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${authUserFollowingReplyOfParentComment.numLikes} likes`;
            }
            if(authUserFollowingReplyOfParentComment.numLikes==0) {
                likesText.classList.add('hidden');
            }
    
            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("AuthUserFollowingReply", commentIdx);

            metaDiv.appendChild(dateText);
            metaDiv.appendChild(likesText);
            metaDiv.appendChild(replyButton);
    
            if(authUserFollowingReplyOfParentComment.isLikedByAuthor && !postInfo['usernames'].includes(authUserFollowingReplyOfParentComment.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';
    
                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);
    
                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);
    
                metaDiv.appendChild(authorDiv);
            }
    
            textContentDiv.appendChild(metaDiv);
    
            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextAuthUserFollowingReply"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("AuthUserFollowingReply", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${authUserFollowingReplyOfParentComment.numReplies})</span>`;
            if(authUserFollowingReplyOfParentComment.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }
    
            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextAuthUserFollowingReply"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("AuthUserFollowingReply", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
    
            textContentDiv.append(viewRepliesText, hideRepliesText);
    
            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconAuthUserFollowingReply"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("AuthUserFollowingReply", commentIdx);
    
            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconAuthUserFollowingReply"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("AuthUserFollowingReply", commentIdx);
    
            if(authUserFollowingReplyOfParentComment.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }
    
            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
            setOfAuthUserFollowingReplyIDsWhoseDOMElementsHaveBeenCreated.add(authUserFollowingReplyOfParentComment.id);
        }

        for(let uniqueReply of parentComment.uniqueReplies) {
            commentIdx = uniqueReply.index;
    
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;
    
            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);
    
            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";
    
            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
    
            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);
    
            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }
    
            if(postInfo['usernames'].includes(authUserMentionReplyOfParentComment.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);
    
            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
    
            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }
    
            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }
    
            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            metaDiv.appendChild(dateText);
            metaDiv.appendChild(likesText);
            metaDiv.appendChild(replyButton);
    
            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';
    
                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);
    
                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);
    
                metaDiv.appendChild(authorDiv);
            }
    
            textContentDiv.appendChild(metaDiv);
    
            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }
    
            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
    
            textContentDiv.append(viewRepliesText, hideRepliesText);
    
            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);
    
            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);
    
            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }
    
            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForCommentsMadeByPostAuthor() {
    for(let i=0; i<commentsOfPost.length; i++) {
        const currComment = commentsOfPost[i];
        if(postInfo['usernames'].includes(currComment.username) && !setOfIdsOfCommentsAlreadyDone.has(currComment.commentid)) {
            let numRepliesOfCurrComment = 0;
            const uniqueRepliesOfCurrComment = [];
            for(let j=0; j<repliesOfPost.length; j++) {
                const currReply = repliesOfPost[j];
                if(currReply.commentid!==currComment.commentid) {
                    continue;
                }
                if(postInfo['usernames'].includes(currReply.username)) {
                    const numRepliesOfCurrReply = repliesOfPost.filter(x=>x.commentid===currReply.replyid).length;
                    uniqueRepliesOfCurrComment.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: numRepliesOfCurrReply,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: 1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited,
                    });
                    regularComments.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: numRepliesOfCurrReply,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: 1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited,
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(currReply.replyid);
                }
                else {
                    numRepliesOfCurrComment++;
                }
            }
            commentsMadeByPostAuthor.push({
                id: currComment.commentid,
                idOfParentComment: null,
                isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                index: commentsMadeByPostAuthor.length,
                author: currComment.username,
                isVerified: relevantUserInfo[currComment.username].isVerified,
                content: currComment.comment,
                numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                date: getRelativeDateTimeText(currComment.datetime),
                numReplies: numRepliesOfCurrComment,
                isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                level: 0,
                datetime: currComment.datetime,
                isEdited: currComment.isedited,
                uniqueReplies: uniqueRepliesOfCurrComment
            });
            setOfIdsOfCommentsAlreadyDone.add(currComment.commentid);
        }
    }
    commentsMadeByPostAuthor.sort((a,b)=> new Date(b.datetime)-new Date(a.datetime));

    for(let postAuthorComment of commentsMadeByPostAuthor) {
        const commentIdx = postAuthorComment.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "postAuthorComment"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[postAuthorComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(postAuthorComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivPostAuthorComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = postAuthorComment.author;
        usernameBold.onclick = () => takeToProfile(postAuthorComment.author);

        if(relevantUserInfo[postAuthorComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        const authorSpan = document.createElement('span');
        authorSpan.textContent = " · Author";
        authorSpan.style.color = "gray";
        authorSpan.style.fontSize = '0.9em';
        authorSpan.style.marginRight = '0.7em';
        usernameBold.appendChild(authorSpan);
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentPostAuthorComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("PostAuthorComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(postAuthorComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextPostAuthorComment"+commentIdx;
        dateText.textContent = postAuthorComment.date;
        if(postAuthorComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextPostAuthorComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(postAuthorComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${postAuthorComment.numLikes} likes`;
        }
        if(postAuthorComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("PostAuthorComment", commentIdx);

        metaDiv.append(dateText, likesText, replyButton);

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextPostAuthorComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("PostAuthorComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${postAuthorComment.numReplies})</span>`;
        if(postAuthorComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextPostAuthorComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("PostAuthorComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconPostAuthorComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("PostAuthorComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconPostAuthorComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("PostAuthorComment", commentIdx);

        if(postAuthorComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let uniqueReply of postAuthorComment.uniqueReplies) {
            const commentIdx = uniqueReply.index;
            const mainDiv = document.createElement("div");
            mainDiv.id = "regularComment"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${uniqueReply.level*5}em`;

            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[uniqueReply.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(uniqueReply.author);
            mainDiv.appendChild(profileImg);

            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivRegularComment"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";

            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = uniqueReply.author;
            usernameBold.onclick = () => takeToProfile(uniqueReply.author);

            if(relevantUserInfo[uniqueReply.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            if(postInfo['usernames'].includes(uniqueReply.author)) {
                const authorSpan = document.createElement('span');
                authorSpan.textContent = " · Author";
                authorSpan.style.color = "gray";
                authorSpan.style.fontSize = '0.9em';
                authorSpan.style.marginRight = '0.7em';
                usernameBold.appendChild(authorSpan);
            }
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentRegularComment"+commentIdx;
            commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(uniqueReply.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);

            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

            const dateText = document.createElement("p");
            dateText.id = "dateTextRegularComment"+commentIdx;
            dateText.textContent = uniqueReply.date;
            if(uniqueReply.isEdited) {
                dateText.textContent+= " · Edited";
            }

            const likesText = document.createElement("b");
            likesText.id = "numLikesTextRegularComment"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(uniqueReply.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${uniqueReply.numLikes} likes`;
            }
            if(uniqueReply.numLikes==0) {
                likesText.classList.add('hidden');
            }

            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

            metaDiv.append(dateText, likesText, replyButton);

            if(uniqueReply.isLikedByAuthor && !postInfo['usernames'].includes(uniqueReply.author)) {
                const authorDiv = document.createElement('div');
                authorDiv.style.display = 'flex';
                authorDiv.style.alignItems = 'center';
                authorDiv.style.gap = '0.35em';

                const redHeartIcon = document.createElement('img');
                redHeartIcon.src = '/images/redHeartIcon.webp';
                redHeartIcon.style.height = '1.2em';
                redHeartIcon.style.width = '1.2em';
                redHeartIcon.style.objectFit = 'contain';
                redHeartIcon.style.pointerEvents = 'none';
                authorDiv.appendChild(redHeartIcon);

                const byAuthorText = document.createElement('small');
                byAuthorText.textContent = 'by author';
                authorDiv.appendChild(byAuthorText);

                metaDiv.appendChild(authorDiv);
            }

            textContentDiv.appendChild(metaDiv);

            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${uniqueReply.numReplies})</span>`;
            if(uniqueReply.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }

            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

            textContentDiv.append(viewRepliesText, hideRepliesText);

            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

            if(uniqueReply.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }

            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
        }
    }
}

function createDOMElementsForRepliesMadeByPostAuthor() {
    for(let i=0; i<repliesOfPost.length; i++) {
        const currReply = repliesOfPost[i];
        if(postInfo['usernames'].includes(currReply.username) && !setOfIdsOfUniqueRepliesAlreadyDone.has(currReply.replyid)) {
            let parentComment = commentsOfPost.filter(x=>x.commentid===currReply.commentid);
            if(parentComment.length==0) {
                continue;
            }
            parentComment = parentComment[0];
            const postAuthorRepliesOfParentComment = [];
            let numRepliesOfParentComment = 0;
            for(let j=0; j<repliesOfPost.length; j++) {
                if(repliesOfPost[j].commentid!==parentComment.commentid) {
                    continue;
                }
                const parentCommentReply = repliesOfPost[j];

                if(postInfo['usernames'].includes(parentCommentReply.username)) {
                    const numRepliesOfParentCommentReply = repliesOfPost.filter(x=>x.commentid===parentCommentReply.replyid).length;
                    postAuthorRepliesOfParentComment.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesMadeByPostAuthor.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    repliesMadeByPostAuthor.push({
                        id: parentCommentReply.replyid,
                        idOfParentComment: parentCommentReply.commentid,
                        isLiked: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][1] : false,
                        index: repliesMadeByPostAuthor.length,
                        author: parentCommentReply.username,
                        isVerified: relevantUserInfo[parentCommentReply.username].isVerified,
                        content: parentCommentReply.comment,
                        numLikes: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(parentComment.datetime),
                        numReplies: numRepliesOfParentCommentReply,
                        isLikedByAuthor: parentCommentReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentCommentReply.replyid][2] : false,
                        level: 1,
                        datetime: parentCommentReply.datetime,
                        isEdited: parentCommentReply.isedited
                    });
                    setOfIdsOfUniqueRepliesAlreadyDone.add(parentCommentReply.replyid);
                }
                else {
                    numRepliesOfParentComment++;
                }
            }
            parentCommentsOfRepliesMadeByPostAuthor.push({
                id: parentComment.commentid,
                idOfParentComment: null,
                isLiked: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][1] : false,
                index: parentCommentsOfRepliesThatMentionAuthUser.length,
                author: parentComment.username,
                isVerified: relevantUserInfo[parentComment.username].isVerified,
                content: parentComment.comment,
                numLikes: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][0] : 0,
                date: getRelativeDateTimeText(parentComment.datetime),
                numReplies: numRepliesOfParentComment,
                isLikedByAuthor: parentComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[parentComment.commentid][2] : false,
                level: 0,
                datetime: parentComment.datetime,
                isEdited: parentComment.isedited,
                postAuthorReplies: postAuthorRepliesOfParentComment
            });
            setOfIdsOfCommentsAlreadyDone.add(parentComment.commentid);

        }
    }
    repliesMadeByPostAuthor.sort((a,b) => new Date(b.datetime) - new Date(a.datetime));
    const setOfPostAuthorReplyIDsWhoseDOMElementsHaveBeenCreated = new Set();

    for(let postAuthorReply of repliesMadeByPostAuthor) {
        if(setOfPostAuthorReplyIDsWhoseDOMElementsHaveBeenCreated.has(postAuthorReply.id)) {
            continue;
        }
        let parentComment = parentCommentsOfRepliesMadeByPostAuthor.filter(x=>x.id===postAuthorReply.idOfParentComment);
        parentComment = parentComment[0];
        let commentIdx = parentComment.index;

        const mainDiv = document.createElement("div");
        mainDiv.id = "parentOfPostAuthorReply"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[parentComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(parentComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivParentOfPostAuthorReply"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = parentComment.author;
        usernameBold.onclick = () => takeToProfile(parentComment.author);

        if(relevantUserInfo[parentComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentParentOfPostAuthorReply"+commentIdx;
        commentSpan.ondblclick = () => likeComment("ParentOfPostAuthorReply", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(parentComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextParentOfPostAuthorReply"+commentIdx;
        dateText.textContent = parentComment.date;
        if(parentComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextParentOfPostAuthorReply"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(parentComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${parentComment.numLikes} likes`;
        }
        if(parentComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("ParentOfPostAuthorReply", commentIdx);

        metaDiv.appendChild(dateText);
        metaDiv.appendChild(likesText);
        metaDiv.appendChild(replyButton);

        if(parentComment.isLikedByAuthor) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextParentOfPostAuthorReply"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("ParentOfPostAuthorReply", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${parentComment.numReplies})</span>`;
        if(parentComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextParentOfPostAuthorReply"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("ParentOfPostAuthorReply", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconParentOfPostAuthorReply"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("ParentOfPostAuthorReply", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconParentOfPostAuthorReply"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("ParentOfPostAuthorReply", commentIdx);

        if(parentComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);

        for(let postAuthorReplyOfParentComment of parentComment.postAuthorReplies) {
            commentIdx = postAuthorReplyOfParentComment.index;
    
            const mainDiv = document.createElement("div");
            mainDiv.id = "postAuthorReply"+commentIdx;
            mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
            mainDiv.style.marginLeft = `${postAuthorReplyOfParentComment.level*5}em`;
    
            const profileImg = document.createElement("img");
            profileImg.src = relevantUserInfo[postAuthorReplyOfParentComment.author]['profilePhotoString'];
            profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
            profileImg.onclick = () => takeToProfile(postAuthorReplyOfParentComment.author);
            mainDiv.appendChild(profileImg);
    
            const textContentDiv = document.createElement("div");
            textContentDiv.id = "mainDivPostAuthorReply"+commentIdx;
            textContentDiv.style = "display: flex; flex-direction: column;";
    
            const commentParagraph = document.createElement("p");
            commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";
    
            const usernameBold = document.createElement("b");
            usernameBold.style = "cursor: pointer;";
            usernameBold.textContent = postAuthorReplyOfParentComment.author;
            usernameBold.onclick = () => takeToProfile(postAuthorReplyOfParentComment.author);
    
            if(relevantUserInfo[postAuthorReplyOfParentComment.author].isVerified) {
                const verifiedCheck = document.createElement('img');
                verifiedCheck.src = '/images/verifiedCheck.png';
                verifiedCheck.style.pointerEvents = 'none';
                verifiedCheck.style.height = '1.1em';
                verifiedCheck.style.width = '1.1em';
                verifiedCheck.style.objectFit = 'contain';
                usernameBold.appendChild(verifiedCheck);
            }

            const authorSpan = document.createElement('span');
            authorSpan.textContent = " · Author";
            authorSpan.style.color = "gray";
            authorSpan.style.fontSize = '0.9em';
            authorSpan.style.marginRight = '0.7em';
            usernameBold.appendChild(authorSpan);
            
            const commentSpan = document.createElement("span");
            commentSpan.id = "contentPostAuthorReply"+commentIdx;
            commentSpan.ondblclick = () => likeComment("PostAuthorReply", commentIdx);
            commentSpan.innerHTML = parseMentionsToSpans(postAuthorReplyOfParentComment.content);
            
            commentParagraph.appendChild(usernameBold);
            commentParagraph.append(" ");
            commentParagraph.appendChild(commentSpan);
            textContentDiv.appendChild(commentParagraph);
    
            const metaDiv = document.createElement("div");
            metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";
    
            const dateText = document.createElement("p");
            dateText.id = "dateTextPostAuthorReply"+commentIdx;
            dateText.textContent = postAuthorReplyOfParentComment.date;
            if(postAuthorReplyOfParentComment.isEdited) {
                dateText.textContent+= " · Edited";
            }
    
            const likesText = document.createElement("b");
            likesText.id = "numLikesTextPostAuthorReply"+commentIdx;
            likesText.style = "cursor: pointer;";
            if(postAuthorReplyOfParentComment.numLikes==1) {
                likesText.textContent = "1 like";
            }
            else {
                likesText.textContent = `${postAuthorReplyOfParentComment.numLikes} likes`;
            }
            if(postAuthorReplyOfParentComment.numLikes==0) {
                likesText.classList.add('hidden');
            }
    
            const replyButton = document.createElement("b");
            replyButton.style = "cursor: pointer;";
            replyButton.textContent = "Reply";
            replyButton.onclick = () => startReplyToComment("PostAuthorReply", commentIdx);

            metaDiv.appendChild(dateText);
            metaDiv.appendChild(likesText);
            metaDiv.appendChild(replyButton);
    
            textContentDiv.appendChild(metaDiv);
    
            const viewRepliesText = document.createElement("b");
            viewRepliesText.id = "viewRepliesTextPostAuthorReply"+commentIdx;
            viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            viewRepliesText.onclick = () => toggleRepliesText("PostAuthorReply", commentIdx);
            viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${postAuthorReplyOfParentComment.numReplies})</span>`;
            if(postAuthorReplyOfParentComment.numReplies==0) {
                viewRepliesText.classList.add('hidden');
            }
    
            const hideRepliesText = document.createElement("b");
            hideRepliesText.id = "hideRepliesTextPostAuthorReply"+commentIdx;
            hideRepliesText.className = "hidden";
            hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
            hideRepliesText.onclick = () => toggleRepliesText("PostAuthorReply", commentIdx);
            hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";
    
            textContentDiv.append(viewRepliesText, hideRepliesText);
    
            const blankHeartIcon = document.createElement("img");
            blankHeartIcon.id = "blankHeartIconPostAuthorReply"+commentIdx;
            blankHeartIcon.className = "hidden";
            blankHeartIcon.src = "/images/blankHeart.png";
            blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            blankHeartIcon.onclick = () => toggleLikeComment("PostAuthorReply", commentIdx);
    
            const redHeartIcon = document.createElement("img");
            redHeartIcon.id = "redHeartIconPostAuthorReply"+commentIdx;
            redHeartIcon.className = "hidden";
            redHeartIcon.src = "/images/redHeartIcon.webp";
            redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
            redHeartIcon.onclick = () => toggleLikeComment("PostAuthorReply", commentIdx);
    
            if(postAuthorReplyOfParentComment.isLiked) {
                redHeartIcon.classList.remove('hidden');
            }
            else {
                blankHeartIcon.classList.remove('hidden');
            }
    
            mainDiv.appendChild(textContentDiv);
            mainDiv.appendChild(blankHeartIcon);
            mainDiv.appendChild(redHeartIcon);
            commentsDiv.appendChild(mainDiv);
            setOfPostAuthorReplyIDsWhoseDOMElementsHaveBeenCreated.add(postAuthorReplyOfParentComment.id);
        }
    }
}

function createDOMElementsForRegularCommentsThatArentReplies() {
    const regularCommentsThatArentReplies = [];
    for(let i=0; i<commentsOfPost.length; i++) {
        const currComment = commentsOfPost[i];

        if(!(setOfIdsOfCommentsAlreadyDone.has(currComment.commentid))) {
                const currCommentNumReplies = repliesOfPost.filter(x=>x.commentid===currComment.commentid).length;
                regularCommentsThatArentReplies.push({
                    id: currComment.commentid,
                    idOfParentComment: null,
                    isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                    index: regularComments.length,
                    author: currComment.username,
                    isVerified: relevantUserInfo[currComment.username].isVerified,
                    content: currComment.comment,
                    numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                    date: getRelativeDateTimeText(currComment.datetime),
                    numReplies: currCommentNumReplies,
                    isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                    level: 0,
                    datetime: currComment.datetime,
                    isEdited: currComment.isedited
                });
                regularComments.push({
                    id: currComment.commentid,
                    idOfParentComment: null,
                    isLiked: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][1] : false,
                    index: regularComments.length,
                    author: currComment.username,
                    isVerified: relevantUserInfo[currComment.username].isVerified,
                    content: currComment.comment,
                    numLikes: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][0] : 0,
                    date: getRelativeDateTimeText(currComment.datetime),
                    numReplies: currCommentNumReplies,
                    isLikedByAuthor: currComment.commentid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currComment.commentid][2] : false,
                    level: 0,
                    datetime: currComment.datetime,
                    isEdited: currComment.isedited
                });
                setOfIdsOfCommentsAlreadyDone.add(currComment.commentid);
            }
    }

    const sortedRegularCommentsThatArentReplies = [...regularCommentsThatArentReplies].sort((a, b) => b.numLikes/(new Date(b.datetime).getTime()) - a.numLikes/(new Date(a.datetime).getTime()));

    for(let targetedComment of sortedRegularCommentsThatArentReplies) {
        const commentIdx = targetedComment.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "regularComment"+commentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[targetedComment.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(targetedComment.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivRegularComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = targetedComment.author;
        usernameBold.onclick = () => takeToProfile(targetedComment.author);

        if(relevantUserInfo[targetedComment.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentRegularComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(targetedComment.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextRegularComment"+commentIdx;
        dateText.textContent = targetedComment.date;
        if(targetedComment.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextRegularComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(targetedComment.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${targetedComment.numLikes} likes`;
        }
        if(targetedComment.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

        const optionsIcon = document.createElement("img");
        optionsIcon.id = "optionsIconForRegularComment"+commentIdx;
        optionsIcon.className = "hidden";
        optionsIcon.src = "/images/optionsDots.png";
        optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
        optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", commentIdx);
        metaDiv.append(dateText, likesText, replyButton, optionsIcon);

        if(targetedComment.isLikedByAuthor && !postInfo['usernames'].includes(targetedComment.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${targetedComment.numReplies})</span>`;
        if(targetedComment.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

        if(targetedComment.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);
        commentsDiv.appendChild(mainDiv);
    }
}

function getRelativeDateTimeText(datetimeString) {
    const inputDate = new Date(datetimeString);
    const now = new Date();
    
    const diffInMs = now - inputDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
    }
}

function formatUsernames(listOfUsernames) {
    const length = listOfUsernames.length;

    if (length === 2) return `${listOfUsernames[0]} & ${listOfUsernames[1]}`;

    const allExceptLast = listOfUsernames.slice(0, -1).join(", ");
    const last = listOfUsernames[length - 1];

    return `${allExceptLast}, & ${last}`;
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

function takeToProfile(username) {
    window.location.href = "http://localhost:8019/profilePage/"+username;
}

function takeToHashtagPage(hashtag) {
    window.location.href = "http://localhost:8019/topicMatches/"+authenticatedUsername +"/"+hashtag;
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

function changeBackground() {
    if(currBackground==0) {
        darkScreenCoveringRightSideOfPage.classList.remove('hidden');
        currBackground=1;
    }
    else if(currBackground==1) {
        darkScreenCoveringRightSideOfPage.classList.add('hidden');
        leftSidebar.classList.add('hidden');
        mainSection.style.left = '13.5%';
        darkScreenCoveringEntirePage.classList.remove('hidden');
        currBackground=2;
    }
    else {
        leftSidebar.classList.remove('hidden');
        mainSection.style.left = '19.5%';
        darkScreenCoveringEntirePage.classList.add('hidden');
        currBackground = 0;
    }
}


function goToNextSlide() {
    currSlide++;
    hasUserClickedOnVid = false;
    const taggedAccountsOfCurrSlide = document.querySelectorAll('.taggedAccountsOfCurrSlide');
    if(taggedAccountsOfCurrSlide.length>0){
        for(let elem of taggedAccountsOfCurrSlide) {
            mainSectionLeft.removeChild(elem);
        }
    }
    if(currSlide==postInfo.numSlides-1) {
        goToNextSlideArrow.classList.add('hidden');
    }
    if(currSlide==1) {
        goToPreviousSlideArrow.classList.remove('hidden');
    }
    if(postInfo[currSlide].isVideo) {
        currSlideImg.classList.add('hidden');
        blackBackgroundForVids.classList.remove('hidden');
        currSlideVid.classList.remove('hidden');
        currSlideVid.src = postInfo[currSlide].src;
        seeTaggedAccountsIcon.style.top = '80%';
    }
    else {
        currSlideImg.classList.remove('hidden');
        blackBackgroundForVids.classList.add('hidden');
        currSlideVid.classList.add('hidden');
        currSlideImg.src = postInfo[currSlide].src;
        seeTaggedAccountsIcon.style.top = '87%';
    }
    if(postInfo[currSlide].taggedAccounts.length>0) {
        seeTaggedAccountsIcon.classList.remove('hidden');
    }
    else {
        seeTaggedAccountsIcon.classList.add('hidden');
    }

    const previousSlideDot = slideDots[currSlide-1];
    const currentSlideDot = slideDots[currSlide];
    previousSlideDot.src = '/images/solidGrayDot.png';
    previousSlideDot.style.height = '1em';
    previousSlideDot.style.width = '1em';

    currentSlideDot.src = '/images/solidWhiteDot.png';
    currentSlideDot.style.height = '1.2em';
    currentSlideDot.style.width = '1.2em';
}

function goToPreviousSlide() {
    currSlide--;
    hasUserClickedOnVid = false;
    const taggedAccountsOfCurrSlide = document.querySelectorAll('.taggedAccountsOfCurrSlide');
    if(taggedAccountsOfCurrSlide.length>0){
        for(let elem of taggedAccountsOfCurrSlide) {
            mainSectionLeft.removeChild(elem);
        }
    }
    if(currSlide==0) {
        goToPreviousSlideArrow.classList.add('hidden');
    }
    else if(currSlide==postInfo.numSlides-2) {
        goToNextSlideArrow.classList.remove('hidden');
    }
    if(postInfo[currSlide].isVideo) {
        currSlideImg.classList.add('hidden');
        blackBackgroundForVids.classList.remove('hidden');
        currSlideVid.classList.remove('hidden');
        currSlideVid.src = postInfo[currSlide].src;
        seeTaggedAccountsIcon.style.top = '80%';
    }
    else {
        currSlideImg.classList.remove('hidden');
        blackBackgroundForVids.classList.add('hidden');
        currSlideVid.classList.add('hidden');
        currSlideImg.src = postInfo[currSlide].src;
        seeTaggedAccountsIcon.style.top = '87%';
    }
    if(postInfo[currSlide].taggedAccounts.length>0) {
        seeTaggedAccountsIcon.classList.remove('hidden');
    }
    else {
        seeTaggedAccountsIcon.classList.add('hidden');
    }

    const previousSlideDot = slideDots[currSlide+1];
    const currentSlideDot = slideDots[currSlide];
    previousSlideDot.src = '/images/solidGrayDot.png';
    previousSlideDot.style.height = '1em';
    previousSlideDot.style.width = '1em';

    currentSlideDot.src = '/images/solidWhiteDot.png';
    currentSlideDot.style.height = '1.2em';
    currentSlideDot.style.width = '1.2em';
}

function toggleShowTaggedAccountsOfCurrSlide() {
    const taggedAccountsOfCurrSlide = document.querySelectorAll('.taggedAccountsOfCurrSlide');
    if(taggedAccountsOfCurrSlide.length>0){
        for(let elem of taggedAccountsOfCurrSlide) {
            mainSectionLeft.removeChild(elem);
        }
        return;
    }
    for(let taggedAccountInfo of postInfo[currSlide].taggedAccounts) {
        const taggedAccountElem = document.createElement('p');
        taggedAccountElem.className = 'taggedAccountsOfCurrSlide';
        taggedAccountElem.style.position = 'absolute';
        taggedAccountElem.style.left = taggedAccountInfo[0].toString() + '%';
        taggedAccountElem.style.top = taggedAccountInfo[1].toString() + '%';
        taggedAccountElem.style.backgroundColor = 'black';
        taggedAccountElem.style.color = 'white';
        taggedAccountElem.style.cursor = 'pointer';
        taggedAccountElem.style.padding = '0.3em 0.6em';
        taggedAccountElem.textContent = taggedAccountInfo[2];
        taggedAccountElem.onclick = () => window.location.href = "http://localhost:8019/profilePage/"+taggedAccountInfo[2];
        mainSectionLeft.appendChild(taggedAccountElem);
    }
}

function setHasUserClickedOnVidToTrue() {
    hasUserClickedOnVid = true;
}

function toggleHasUserClickedOnMainSectionRight() {
    hasUserClickedOnMainSectionRight = !hasUserClickedOnMainSectionRight;
}


document.addEventListener('keydown', function(event) {
    if(hasUserClickedOnMainSectionRight) {
        return;
    }
    switch(event.key) {
        case 'ArrowUp':
            if(hasUserClickedOnVid) {
                currSlideVid.volume = Math.min(1, currSlideVid.volume+0.1);
            }
            break;

        case 'ArrowDown':
            if(hasUserClickedOnVid) {
                currSlideVid.volume = Math.max(0, currSlideVid.volume-0.1);
            }
            break;

        case 'j':
        case 'J':
        case 'ArrowLeft':
            if(hasUserClickedOnVid) {
                currSlideVid.currentTime-=5;
            }
            else if(currSlide>0) {
                goToPreviousSlide();
            }
            break;

        case 'l':
        case 'L':
        case 'ArrowRight':
            if(hasUserClickedOnVid) {
                currSlideVid.currentTime+=5;
            }
            else if(currSlide<postInfo.numSlides-1) {
                goToNextSlide();
            }
            break;

        case 'k':
        case 'K':
            if(hasUserClickedOnVid) {
                if (currSlideVid.paused || currSlideVid.ended) {
                    currSlideVid.play();
                } else {
                    currSlideVid.pause();
                }
            }
            break;

        case 'm':
        case 'M':
            currSlideVid.muted = !currSlideVid.muted;
            break;
        case 'f':
        case 'F':
            if(!hasUserClickedOnVid)  {
                return;
            }
            if (!document.fullscreenElement) {
                if (currSlideVid.requestFullscreen) {
                    currSlideVid.requestFullscreen();
                } else if (currSlideVid.mozRequestFullScreen) { // Firefox
                    currSlideVid.mozRequestFullScreen();
                } else if (currSlideVid.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    currSlideVid.webkitRequestFullscreen();
                } else if (currSlideVid.msRequestFullscreen) { // IE/Edge
                    currSlideVid.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
    }
});

textareaToAddComment.oninput = function() {
    if(textareaToAddComment.value.length==0) {
        postCommentButton.classList.add('hidden');
    }
    else {
        postCommentButton.classList.remove('hidden');
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

async function postComment() {
    const newCommentId = generateUUID();
    let currDateString= new Date();
    currDateString = currDateString.toISOString();

    if(commentToReplyTo.length==0) {
        commentsMadeByAuthUser.push(
            {
                id: newCommentId,
                idOfParentComment: null,
                isLiked: false,
                index: commentsMadeByAuthUser.length,
                author: authenticatedUsername,
                isVerified: false,
                content: textareaToAddComment.value,
                numLikes: 0,
                date: "Now",
                numReplies: 0,
                isLikedByAuthor: false,
                level: 0,
            }
        );
        const response = await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    addComment(comment: "${textareaToAddComment.value}", commentid: "${newCommentId}", datetime: "${currDateString}", isedited: false, postid: "${postId}", username: "${authenticatedUsername}") {
                        comment
                    }
                }`
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        createDOMElementsForNewAuthUserComment(textareaToAddComment.value)
    }
    else {
        let parentComment;
        let [parentCommentType, parentCommentIdx] = commentToReplyTo;
        if(parentCommentType==='RegularComment') {
            parentComment = regularComments[parentCommentIdx];
        }
        else if(parentCommentType==='PostAuthorComment') {
            parentComment = commentsMadeByPostAuthor[parentCommentIdx];
        }
        else if(parentCommentType==='AuthUserFollowingComment') {
            parentComment = commentsMadeByAuthUserFollowing[parentCommentIdx];
        }
        else if(parentCommentType==='AuthUserMentionComment') {
            parentComment = commentsThatMentionAuthUser[parentCommentIdx];
        }
        else if(parentCommentType==='AuthUserComment') {
            parentComment = commentsMadeByAuthUser[parentCommentIdx];
        }
        else if(parentCommentType==='ParentOfPostAuthorReply') {
            parentComment = parentCommentsOfRepliesMadeByPostAuthor[parentCommentIdx];
        }
        else if(parentCommentType==='PostAuthorReply') {
            parentComment = repliesMadeByPostAuthor[parentCommentIdx];
        }
        else if(parentCommentType==='ParentOfAuthUserFollowingReply') {
            parentComment = parentCommentsOfRepliesMadeByAuthUserFollowing[parentCommentIdx];
        }
        else if(parentCommentType==='AuthUserFollowingReply') {
            parentComment = repliesMadeByAuthUserFollowing[parentCommentIdx];
        }
        else if(parentCommentType==='ParentOfAuthUserMentionReply') {
            parentComment = parentCommentsOfRepliesThatMentionAuthUser[parentCommentIdx];
        }
        else if(parentCommentType==='AuthUserMentionReply') {
            parentComment = repliesThatMentionAuthUser[parentCommentIdx];
        }
        else if(parentCommentType==='ParentOfAuthUserReply') {
            parentComment = parentCommentsOfRepliesMadeByAuthUser[parentCommentIdx];
        }
        else {
            parentComment = repliesMadeByAuthUser[parentCommentIdx];
        }
        
        const newAuthUserReply = {
            id: newCommentId,
            idOfParentComment: parentComment.id,
            isLiked: false,
            index: regularComments.length,
            author: authenticatedUsername,
            isVerified: true,
            content: textareaToAddComment.value,
            numLikes: 0,
            date: "Now",
            numReplies: 0,
            isLikedByAuthor: false,
            level: parentComment.level+1,
        };
        parentComment.numReplies++;
        
        const response = await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    addReply(comment: "${textareaToAddComment.value}", commentid: "${parentComment.id}", replyid: "${newCommentId}", datetime: "${currDateString}", isedited: false, postid: "${postId}", username: "${authenticatedUsername}") {
                        comment
                    }
                }`
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        createDOMElementsForNewAuthUserReply(newAuthUserReply, parentCommentType, parentCommentIdx, parentComment);
        commentToReplyTo = [];
    }
    textareaToAddComment.value = "";
    textareaToAddComment.placeholder = "Add a comment...";
    postCommentButton.classList.add('hidden');
}

function createDOMElementsForNewAuthUserReply(newAuthUserReply, parentCommentType, parentCommentIdx, parentComment) {
    const replyIndex = newAuthUserReply.index;
    const targetedViewRepliesText = document.getElementById('viewRepliesText'+parentCommentType+parentCommentIdx);
    targetedViewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${parentComment.numReplies})</span>`;
    if(parentComment.numReplies==1) {
        targetedViewRepliesText.classList.remove('hidden');
    }

    if(!targetedViewRepliesText.classList.contains('hidden')) {
        toggleRepliesText(parentCommentType, parentCommentIdx);
    }

    const elemToAddNewReplyNextTo = document.getElementById(parentCommentType[0].toLowerCase() + parentCommentType.slice(1) +parentCommentIdx);
    
    const mainDiv = document.createElement("div");
    mainDiv.id = "regularComment"+replyIndex;
    mainDiv.className = "repliesOf"+parentCommentType+parentCommentIdx;
    mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
    mainDiv.style.marginLeft = `${newAuthUserReply.level*5}em`;
    mainDiv.onmouseenter = () => showOptionsIcon("RegularComment"+replyIndex);
    mainDiv.onmouseleave = () => hideOptionsIcon("RegularComment"+replyIndex);

    const profileImg = document.createElement("img");
    profileImg.src = relevantUserInfo[authenticatedUsername]['profilePhotoString'];
    profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
    mainDiv.appendChild(profileImg);

    const textContentDiv = document.createElement("div");
    textContentDiv.id = "mainDivRegularComment"+replyIndex;
    textContentDiv.style = "display: flex; flex-direction: column;";

    const commentParagraph = document.createElement("p");
    commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

    const usernameBold = document.createElement("b");
    usernameBold.style = "cursor: pointer;";
    usernameBold.textContent = authenticatedUsername;

    if(relevantUserInfo[authenticatedUsername].isVerified) {
        const verifiedCheck = document.createElement('img');
        verifiedCheck.src = '/images/verifiedCheck.png';
        verifiedCheck.style.pointerEvents = 'none';
        verifiedCheck.style.height = '1.1em';
        verifiedCheck.style.width = '1.1em';
        verifiedCheck.style.objectFit = 'contain';
        usernameBold.appendChild(verifiedCheck);
    }
    
    const commentSpan = document.createElement("span");
    commentSpan.id = "contentRegularComment"+replyIndex;
    commentSpan.ondblclick = () => likeComment("RegularComment", replyIndex);
    commentSpan.innerHTML = parseMentionsToSpans(newAuthUserReply.content);
    
    commentParagraph.appendChild(usernameBold);
    commentParagraph.append(" ");
    commentParagraph.appendChild(commentSpan);
    textContentDiv.appendChild(commentParagraph);

    const metaDiv = document.createElement("div");
    metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

    const dateText = document.createElement("p");
    dateText.id = "dateTextRegularComment"+replyIndex;
    dateText.textContent = "Now";

    const likesText = document.createElement("b");
    likesText.id = "numLikesTextRegularComment"+replyIndex;
    likesText.style = "cursor: pointer;";
    likesText.textContent = "0 likes";
    likesText.classList.add('hidden');

    const replyButton = document.createElement("b");
    replyButton.style = "cursor: pointer;";
    replyButton.textContent = "Reply";
    replyButton.onclick = () => startReplyToComment("RegularComment", replyIndex);

    const optionsIcon = document.createElement("img");
    optionsIcon.id = "optionsIconForRegularComment"+replyIndex;
    optionsIcon.className = "hidden";
    optionsIcon.src = "/images/optionsDots.png";
    optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
    optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", replyIndex);

    metaDiv.append(dateText, likesText, replyButton, optionsIcon);
    textContentDiv.appendChild(metaDiv);

    const viewRepliesText = document.createElement("b");
    viewRepliesText.id = "viewRepliesTextRegularComment"+replyIndex;
    viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
    viewRepliesText.onclick = () => toggleRepliesText("RegularComment", replyIndex);
    viewRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>View replies (0)</span>";
    viewRepliesText.classList.add('hidden');

    const hideRepliesText = document.createElement("b");
    hideRepliesText.id = "hideRepliesTextRegularComment"+replyIndex;
    hideRepliesText.className = "hidden";
    hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
    hideRepliesText.onclick = () => toggleRepliesText("RegularComment", replyIndex);
    hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

    textContentDiv.append(viewRepliesText, hideRepliesText);

    const editModeDiv = document.createElement("div");
    editModeDiv.id = "editModeDivRegularComment"+replyIndex;
    editModeDiv.className = "hidden";
    editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";

    const textarea = document.createElement("textarea");
    textarea.id = "textareaForEditingRegularComment"+replyIndex;
    textarea.placeholder = "";
    textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
    textarea.oninput = () => onInputOfTextareaForEditingComment("RegularComment"+replyIndex);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
    cancelButton.onclick = () => cancelCommentEdit("RegularComment", replyIndex);

    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmEditButtonRegularComment"+replyIndex;
    confirmButton.className = "blueButton hidden";
    confirmButton.textContent = "Ok";
    confirmButton.type = "button";
    confirmButton.style = "font-size: 0.7em;";
    confirmButton.onclick = () => confirmCommentEdit("RegularComment", replyIndex);

    editModeDiv.append(textarea, cancelButton, confirmButton);
    textContentDiv.appendChild(editModeDiv);

    const blankHeartIcon = document.createElement("img");
    blankHeartIcon.id = "blankHeartIconRegularComment"+replyIndex;
    blankHeartIcon.src = "/images/blankHeart.png";
    blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
    blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", replyIndex);

    const redHeartIcon = document.createElement("img");
    redHeartIcon.id = "redHeartIconRegularComment"+replyIndex;
    redHeartIcon.className = "hidden";
    redHeartIcon.src = "/images/redHeartIcon.webp";
    redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
    redHeartIcon.onclick = () => toggleLikeComment("RegularComment", replyIndex);

    mainDiv.appendChild(textContentDiv);
    mainDiv.appendChild(editModeDiv);
    mainDiv.appendChild(blankHeartIcon);
    mainDiv.appendChild(redHeartIcon);

    elemToAddNewReplyNextTo.insertAdjacentElement('afterend', mainDiv);
    regularComments.push(newAuthUserReply);
}

function createDOMElementsForNewAuthUserComment(commentContent) {
    const commentIdx = commentsMadeByAuthUser.length-1;
    const mainDiv = document.createElement("div");
    mainDiv.id = "authUserComment"+commentIdx;
    mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
    mainDiv.onmouseenter = () => showOptionsIcon("AuthUserComment"+commentIdx);
    mainDiv.onmouseleave = () => hideOptionsIcon("AuthUserComment"+commentIdx);

    const profileImg = document.createElement("img");
    profileImg.src = relevantUserInfo[authenticatedUsername]['profilePhotoString'];
    profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
    mainDiv.appendChild(profileImg);

    const textContentDiv = document.createElement("div");
    textContentDiv.id = "mainDivAuthUserComment"+commentIdx;
    textContentDiv.style = "display: flex; flex-direction: column;";

    const commentParagraph = document.createElement("p");
    commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

    const usernameBold = document.createElement("b");
    usernameBold.style = "cursor: pointer;";
    usernameBold.textContent = authenticatedUsername;

    if(relevantUserInfo[authenticatedUsername].isVerified==2) {
        const verifiedCheck = document.createElement('img');
        verifiedCheck.src = '/images/verifiedCheck.png';
        verifiedCheck.style.pointerEvents = 'none';
        verifiedCheck.style.height = '1.1em';
        verifiedCheck.style.width = '1.1em';
        verifiedCheck.style.objectFit = 'contain';
        usernameBold.appendChild(verifiedCheck);
    }
    
    const commentSpan = document.createElement("span");
    commentSpan.id = "contentAuthUserComment"+commentIdx;
    commentSpan.ondblclick = () => likeComment("AuthUserComment", commentIdx);
    commentSpan.textContent = commentContent;
    
    commentParagraph.appendChild(usernameBold);
    commentParagraph.append(" ");
    commentParagraph.appendChild(commentSpan);
    textContentDiv.appendChild(commentParagraph);

    const metaDiv = document.createElement("div");
    metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

    const dateText = document.createElement("p");
    dateText.id = "dateTextAuthUserComment"+commentIdx;
    dateText.textContent = "Now";

    const likesText = document.createElement("b");
    likesText.id = "numLikesTextAuthUserComment"+commentIdx;
    likesText.style = "cursor: pointer;";
    likesText.textContent = "0 likes";
    likesText.classList.add('hidden');

    const replyButton = document.createElement("b");
    replyButton.style = "cursor: pointer;";
    replyButton.textContent = "Reply";
    replyButton.onclick = () => startReplyToComment("AuthUserComment", commentIdx);

    const optionsIcon = document.createElement("img");
    optionsIcon.id = "optionsIconForAuthUserComment"+commentIdx;
    optionsIcon.className = "hidden";
    optionsIcon.src = "/images/optionsDots.png";
    optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
    optionsIcon.onclick = () => showOptionsPopupForComment("AuthUserComment", commentIdx);

    metaDiv.append(dateText, likesText, replyButton, optionsIcon);
    textContentDiv.appendChild(metaDiv);

    const viewRepliesText = document.createElement("b");
    viewRepliesText.id = "viewRepliesTextAuthUserComment"+commentIdx;
    viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
    viewRepliesText.onclick = () => toggleRepliesText("AuthUserComment", commentIdx);
    viewRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>View replies (0)</span>";
    viewRepliesText.classList.add('hidden');

    const hideRepliesText = document.createElement("b");
    hideRepliesText.id = "hideRepliesTextAuthUserComment"+commentIdx;
    hideRepliesText.className = "hidden";
    hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
    hideRepliesText.onclick = () => toggleRepliesText("AuthUserComment", commentIdx);
    hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

    textContentDiv.append(viewRepliesText, hideRepliesText);

    const editModeDiv = document.createElement("div");
    editModeDiv.id = "editModeDivAuthUserComment"+commentIdx;
    editModeDiv.className = "hidden";
    editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";

    const textarea = document.createElement("textarea");
    textarea.id = "textareaForEditingAuthUserComment"+commentIdx;
    textarea.placeholder = "";
    textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
    textarea.oninput = () => onInputOfTextareaForEditingComment("AuthUserComment"+commentIdx);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.type = "button";
    cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
    cancelButton.onclick = () => cancelCommentEdit("AuthUserComment", commentIdx);

    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmEditButtonAuthUserComment"+commentIdx;
    confirmButton.className = "blueButton hidden";
    confirmButton.textContent = "Ok";
    confirmButton.type = "button";
    confirmButton.style = "font-size: 0.7em;";
    confirmButton.onclick = () => confirmCommentEdit("AuthUserComment", commentIdx);

    editModeDiv.append(textarea, cancelButton, confirmButton);
    textContentDiv.appendChild(editModeDiv);

    const blankHeartIcon = document.createElement("img");
    blankHeartIcon.id = "blankHeartIconAuthUserComment"+commentIdx;
    blankHeartIcon.src = "/images/blankHeart.png";
    blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
    blankHeartIcon.onclick = () => toggleLikeComment("AuthUserComment", commentIdx);

    const redHeartIcon = document.createElement("img");
    redHeartIcon.id = "redHeartIconAuthUserComment"+commentIdx;
    redHeartIcon.className = "hidden";
    redHeartIcon.src = "/images/redHeartIcon.webp";
    redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
    redHeartIcon.onclick = () => toggleLikeComment("AuthUserComment", commentIdx);

    mainDiv.appendChild(textContentDiv);
    mainDiv.appendChild(editModeDiv);
    mainDiv.appendChild(blankHeartIcon);
    mainDiv.appendChild(redHeartIcon);

    document.getElementById('postCaption').insertAdjacentElement('afterend', mainDiv);
}

async function toggleSavePost() {
    if(postInfo['isPostSavedByUser']) {
        const response = await fetch('http://localhost:8004/removeSave/'+postId, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: authenticatedUsername
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        postInfo['isPostSavedByUser'] = false;
        postIsSavedIcon.classList.add('hidden');
        postIsNotSavedIcon.classList.remove('hidden');
    }
    else {
        const response = await fetch('http://localhost:8004/addSave/'+postId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: authenticatedUsername
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        postInfo['isPostSavedByUser'] = true;
        postIsSavedIcon.classList.remove('hidden');
        postIsNotSavedIcon.classList.add('hidden');
    }
}

async function toggleLikePost() {
    if(!postInfo['isLikedByUser']) {
        const response = await fetch('http://localhost:8004/addLike/'+postId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: authenticatedUsername
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        postIsLikedIcon.classList.remove('hidden');
        postIsNotLikedIcon.classList.add('hidden');
        postInfo.numLikes++;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
        postInfo['isLikedByUser'] = true;
    }
    else {
        const response = await fetch('http://localhost:8004/removeLike/'+postId, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: authenticatedUsername
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        postIsLikedIcon.classList.add('hidden');
        postIsNotLikedIcon.classList.remove('hidden');
        postInfo.numLikes--;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
        postInfo['isLikedByUser'] = false;
    }
}

async function likePost() {
    if(!postInfo['isLikedByUser']) {
        const response = await fetch('http://localhost:8004/addLike/'+postId, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: authenticatedUsername
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        postIsLikedIcon.classList.remove('hidden');
        postIsNotLikedIcon.classList.add('hidden');
        postInfo.numLikes++;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
        postInfo['isLikedByUser'] = true;
    }
}

function setFocusToCommentTextarea() {
    textareaToAddComment.focus();
}

async function toggleLikeComment(commentType, commentIdx) {
    const idSuffix = commentType+commentIdx;
    const targetedBlankHeartIcon = document.getElementById('blankHeartIcon'+idSuffix);
    const targetedRedHeartIcon = document.getElementById('redHeartIcon'+idSuffix);
    const targetedNumLikesText =  document.getElementById('numLikesText'+idSuffix);
    let targetedComment;
    if(commentType==='RegularComment') {
        targetedComment = regularComments[commentIdx];
    }
    else if(commentType==='PostAuthorComment') {
        targetedComment = commentsMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='AuthUserFollowingComment') {
        targetedComment = commentsMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserMentionComment') {
        targetedComment = commentsThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfPostAuthorReply') {
        targetedComment = parentCommentsOfRepliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='PostAuthorReply') {
        targetedComment = repliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserFollowingReply') {
        targetedComment = parentCommentsOfRepliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserFollowingReply') {
        targetedComment = repliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserMentionReply') {
        targetedComment = parentCommentsOfRepliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserMentionReply') {
        targetedComment = repliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserReply') {
        targetedComment = parentCommentsOfRepliesMadeByAuthUser[commentIdx];
    }
    else {
        targetedComment = repliesMadeByAuthUser[commentIdx];
    }

    if(targetedComment.isLiked) {
        const response =  await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    removeCommentLike(commentid: "${targetedComment.id}", username: "${authenticatedUsername}")
                }`
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        targetedComment.numLikes--;
        if(targetedComment.numLikes==1) {
            targetedNumLikesText.textContent = "1 like";
        }
        else {
            targetedNumLikesText.textContent = targetedComment.numLikes.toLocaleString() + " likes";
        }
        if(targetedComment.numLikes==0) {
            targetedNumLikesText.classList.add('hidden');
        }
        targetedBlankHeartIcon.classList.remove('hidden');
        targetedRedHeartIcon.classList.add('hidden');
    }
    else {
        const response =  await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    addCommentLike(commentid: "${targetedComment.id}", username: "${authenticatedUsername}", postid: "${postId}") {
                        commentid
                        username
                }
                }
                `
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        targetedComment.numLikes++;
        if(targetedComment.numLikes==1) {
            targetedNumLikesText.textContent = "1 like";
            targetedNumLikesText.classList.remove('hidden');
        }
        else {
            targetedNumLikesText.textContent = targetedComment.numLikes.toLocaleString() + " likes";
        }
        targetedBlankHeartIcon.classList.add('hidden');
        targetedRedHeartIcon.classList.remove('hidden');
    }
    targetedComment.isLiked = !targetedComment.isLiked;
}

async function likeComment(commentType, commentIdx) {
    const idSuffix = commentType+commentIdx;
    const targetedBlankHeartIcon = document.getElementById('blankHeartIcon'+idSuffix);
    const targetedRedHeartIcon = document.getElementById('redHeartIcon'+idSuffix);
    const targetedNumLikesText =  document.getElementById('numLikesText'+idSuffix);
    let targetedComment;
    if(commentType==='RegularComment') {
        targetedComment = regularComments[commentIdx];
    }
    else if(commentType==='PostAuthorComment') {
        targetedComment = commentsMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='AuthUserFollowingComment') {
        targetedComment = commentsMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserMentionComment') {
        targetedComment = commentsThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfPostAuthorReply') {
        targetedComment = parentCommentsOfRepliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='PostAuthorReply') {
        targetedComment = repliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserFollowingReply') {
        targetedComment = parentCommentsOfRepliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserFollowingReply') {
        targetedComment = repliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserMentionReply') {
        targetedComment = parentCommentsOfRepliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserMentionReply') {
        targetedComment = repliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserReply') {
        targetedComment = parentCommentsOfRepliesMadeByAuthUser[commentIdx];
    }
    else {
        targetedComment = repliesMadeByAuthUser[commentIdx];
    }
    
    if(!targetedComment.isLiked) {
        const response =  await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    addCommentLike(commentid: "${targetedComment.id}", username: "${authenticatedUsername}", postid: "${postId}") {
                        commentid
                        username
                }
                }
                `
            })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
        targetedComment.numLikes++;
        if(targetedComment.numLikes==1) {
            targetedNumLikesText.textContent = "1 like";
            targetedNumLikesText.classList.remove('hidden');
        }
        else {
            targetedNumLikesText.textContent = targetedComment.numLikes.toLocaleString() + " likes";
        }
        targetedBlankHeartIcon.classList.add('hidden');
        targetedRedHeartIcon.classList.remove('hidden');
        targetedComment.isLiked = true;
    }
}

function startReplyToComment(commentType, commentIdx) {
    if(commentToReplyTo[0]===commentType && commentToReplyTo[1]==commentIdx) {
        commentToReplyTo = [];
        textareaToAddComment.placeholder = "Add a comment...";
        return;
    }
    commentToReplyTo = [commentType, commentIdx];
    let targetedCommentToReplyTo;
    if(commentType==='RegularComment') {
        targetedCommentToReplyTo = regularComments[commentIdx];
    }
    else if(commentType==='PostAuthorComment') {
        targetedCommentToReplyTo = commentsMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='AuthUserFollowingComment') {
        targetedCommentToReplyTo = commentsMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserMentionComment') {
        targetedCommentToReplyTo = commentsThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserComment') {
        targetedCommentToReplyTo = commentsMadeByAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfPostAuthorReply') {
        targetedCommentToReplyTo = parentCommentsOfRepliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='PostAuthorReply') {
        targetedCommentToReplyTo = repliesMadeByPostAuthor[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserFollowingReply') {
        targetedCommentToReplyTo = parentCommentsOfRepliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='AuthUserFollowingReply') {
        targetedCommentToReplyTo = repliesMadeByAuthUserFollowing[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserMentionReply') {
        targetedCommentToReplyTo = parentCommentsOfRepliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='AuthUserMentionReply') {
        targetedCommentToReplyTo = repliesThatMentionAuthUser[commentIdx];
    }
    else if(commentType==='ParentOfAuthUserReply') {
        targetedCommentToReplyTo = parentCommentsOfRepliesMadeByAuthUser[commentIdx];
    }
    else {
        targetedCommentToReplyTo = repliesMadeByAuthUser[commentIdx];
    }
    textareaToAddComment.placeholder = "Reply to " + targetedCommentToReplyTo.author + ": " + targetedCommentToReplyTo.content;
}

function createDOMElementsForReplies(parentCommentType, parentCommentIdx, repliesOfComment) {
    const parentCommentElement = document.getElementById(parentCommentType[0].toLowerCase() + parentCommentType.slice(1) + parentCommentIdx);
    let currElemToAddNewReplyNextTo = parentCommentElement;
    for(let reply of repliesOfComment) {
        const commentIdx = reply.index;
        const mainDiv = document.createElement("div");
        mainDiv.id = "regularComment"+commentIdx;
        mainDiv.className = "repliesOf"+parentCommentType+parentCommentIdx;
        mainDiv.style = "display: flex; align-items: center; width: 100%; position: relative; gap: 0.7em;";
        mainDiv.style.marginLeft = `${reply.level*5}em`;
        if(reply.author===authenticatedUsername) {
            mainDiv.onmouseenter = () => showOptionsIcon("RegularComment"+commentIdx);
            mainDiv.onmouseleave = () => hideOptionsIcon("RegularComment"+commentIdx);
        }

        const profileImg = document.createElement("img");
        profileImg.src = relevantUserInfo[reply.author]['profilePhotoString'];
        profileImg.style = "cursor: pointer; height: 2em; width: 2em; object-fit: contain;";
        profileImg.onclick = () => takeToProfile(reply.author);
        mainDiv.appendChild(profileImg);

        const textContentDiv = document.createElement("div");
        textContentDiv.id = "mainDivRegularComment"+commentIdx;
        textContentDiv.style = "display: flex; flex-direction: column;";

        const commentParagraph = document.createElement("p");
        commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

        const usernameBold = document.createElement("b");
        usernameBold.style = "cursor: pointer;";
        usernameBold.textContent = reply.author;
        usernameBold.onclick = () => takeToProfile(reply.author);

        if(relevantUserInfo[reply.author].isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            usernameBold.appendChild(verifiedCheck);
        }

        //code to add Following span or Author span
        
        const commentSpan = document.createElement("span");
        commentSpan.id = "contentRegularComment"+commentIdx;
        commentSpan.ondblclick = () => likeComment("RegularComment", commentIdx);
        commentSpan.innerHTML = parseMentionsToSpans(reply.content);
        
        commentParagraph.appendChild(usernameBold);
        commentParagraph.append(" ");
        commentParagraph.appendChild(commentSpan);
        textContentDiv.appendChild(commentParagraph);

        const metaDiv = document.createElement("div");
        metaDiv.style = "display: flex; align-items: center; gap: 1.5em; color: gray; font-size: 0.7em; margin-top: -1em;";

        const dateText = document.createElement("p");
        dateText.id = "dateTextRegularComment"+commentIdx;
        dateText.textContent = reply.date;
        if(reply.isEdited) {
            dateText.textContent+= " · Edited";
        }

        const likesText = document.createElement("b");
        likesText.id = "numLikesTextRegularComment"+commentIdx;
        likesText.style = "cursor: pointer;";
        if(reply.numLikes==1) {
            likesText.textContent = "1 like";
        }
        else {
            likesText.textContent = `${reply.numLikes} likes`;
        }
        if(reply.numLikes==0) {
            likesText.classList.add('hidden');
        }

        const replyButton = document.createElement("b");
        replyButton.style = "cursor: pointer;";
        replyButton.textContent = "Reply";
        replyButton.onclick = () => startReplyToComment("RegularComment", commentIdx);

        const optionsIcon = document.createElement("img");
        optionsIcon.id = "optionsIconForRegularComment"+commentIdx;
        optionsIcon.className = "hidden";
        optionsIcon.src = "/images/optionsDots.png";
        optionsIcon.style = "height: 1.6em; width: 1.6em; object-fit: contain; cursor: pointer;";
        optionsIcon.onclick = () => showOptionsPopupForComment("RegularComment", commentIdx);
        metaDiv.append(dateText, likesText, replyButton, optionsIcon);

        if(reply.isLikedByAuthor && !postInfo['usernames'].includes(reply.author)) {
            const authorDiv = document.createElement('div');
            authorDiv.style.display = 'flex';
            authorDiv.style.alignItems = 'center';
            authorDiv.style.gap = '0.35em';

            const redHeartIcon = document.createElement('img');
            redHeartIcon.src = '/images/redHeartIcon.webp';
            redHeartIcon.style.height = '1.2em';
            redHeartIcon.style.width = '1.2em';
            redHeartIcon.style.objectFit = 'contain';
            redHeartIcon.style.pointerEvents = 'none';
            authorDiv.appendChild(redHeartIcon);

            const byAuthorText = document.createElement('small');
            byAuthorText.textContent = 'by author';
            authorDiv.appendChild(byAuthorText);

            metaDiv.appendChild(authorDiv);
        }

        textContentDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement("b");
        viewRepliesText.id = "viewRepliesTextRegularComment"+commentIdx;
        viewRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        viewRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
        viewRepliesText.innerHTML = `—— <span style='margin-left: 0.9em;'>View replies (${reply.numReplies})</span>`;
        if(reply.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }

        const hideRepliesText = document.createElement("b");
        hideRepliesText.id = "hideRepliesTextRegularComment"+commentIdx;
        hideRepliesText.className = "hidden";
        hideRepliesText.style = "cursor: pointer; color: gray; font-size: 0.74em; margin-top: 1em;";
        hideRepliesText.onclick = () => toggleRepliesText("RegularComment", commentIdx);
        hideRepliesText.innerHTML = "—— <span style='margin-left: 0.9em;'>Hide replies</span>";

        textContentDiv.append(viewRepliesText, hideRepliesText);

        const blankHeartIcon = document.createElement("img");
        blankHeartIcon.id = "blankHeartIconRegularComment"+commentIdx;
        blankHeartIcon.className = "hidden";
        blankHeartIcon.src = "/images/blankHeart.png";
        blankHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        blankHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

        const redHeartIcon = document.createElement("img");
        redHeartIcon.id = "redHeartIconRegularComment"+commentIdx;
        redHeartIcon.className = "hidden";
        redHeartIcon.src = "/images/redHeartIcon.webp";
        redHeartIcon.style = "height: 1em; width: 1em; cursor: pointer; object-fit: contain; position: absolute; left: 93%; top: 36%;";
        redHeartIcon.onclick = () => toggleLikeComment("RegularComment", commentIdx);

        if(reply.isLiked) {
            redHeartIcon.classList.remove('hidden');
        }
        else {
            blankHeartIcon.classList.remove('hidden');
        }

        mainDiv.appendChild(textContentDiv);

        if(reply.author===authenticatedUsername) {
            const editModeDiv = document.createElement("div");
            editModeDiv.id = "editModeDivRegularComment"+commentIdx;
            editModeDiv.className = "hidden";
            editModeDiv.style = "display: flex; align-items: center; gap: 0.5em; width: 100%;";

            const textarea = document.createElement("textarea");
            textarea.id = "textareaForEditingRegularComment"+commentIdx;
            textarea.placeholder = "";
            textarea.style = "outline: none; width:77%; resize: none; font-family: Arial; padding: 0.5em 1em;";
            textarea.oninput = () => onInputOfTextareaForEditingComment("RegularComment"+commentIdx);

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.type = "button";
            cancelButton.style = "border-radius:1em; color: white; padding: 0.5em 1em; cursor: pointer; background-color: black; font-size: 0.7em;";
            cancelButton.onclick = () => cancelCommentEdit("RegularComment", commentIdx);

            const confirmButton = document.createElement("button");
            confirmButton.id = "confirmEditButtonRegularComment"+commentIdx;
            confirmButton.className = "blueButton hidden";
            confirmButton.textContent = "Ok";
            confirmButton.type = "button";
            confirmButton.style = "font-size: 0.7em;";
            confirmButton.onclick = () => confirmCommentEdit("RegularComment", commentIdx);

            editModeDiv.append(textarea, cancelButton, confirmButton);
            mainDiv.appendChild(editModeDiv);
        }
        mainDiv.appendChild(blankHeartIcon);
        mainDiv.appendChild(redHeartIcon);

        commentsDiv.appendChild(mainDiv);

        currElemToAddNewReplyNextTo.insertAdjacentElement('afterend', mainDiv);
        currElemToAddNewReplyNextTo = mainDiv;
    }
}

function toggleRepliesText(commentType, commentIdx) {
    const targetedViewRepliesText = document.getElementById('viewRepliesText'+commentType+commentIdx);
    const targetedHideRepliesText = document.getElementById('hideRepliesText'+commentType+commentIdx);
    let replyElements;
    let repliesOfComment = [];
    let targetedComment;
    let targetedCommentId;

    if(!targetedViewRepliesText.classList.contains('hidden')) {
        targetedViewRepliesText.classList.add('hidden');
        targetedHideRepliesText.classList.remove('hidden');

        replyElements = document.querySelectorAll('.repliesOf'+commentType+commentIdx);
        if(replyElements.length>0) {
            for(let elem of replyElements) {
                elem.classList.remove('hidden');
            }
            return;
        }
        if(commentType==='RegularComment') {
            targetedComment = regularComments[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserComment') {
            targetedComment = commentsMadeByAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='ParentOfAuthUserReply') {
            targetedComment = parentCommentsOfRepliesMadeByAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserReply') {
            targetedComment = repliesMadeByAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserMentionComment') {
            targetedComment = commentsThatMentionAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='ParentOfAuthUserMentionReply') {
            targetedComment = parentCommentsOfRepliesThatMentionAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserMentionReply') {
            targetedComment = repliesThatMentionAuthUser[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserFollowingComment') {
            targetedComment = commentsMadeByAuthUserFollowing[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='ParentOfAuthUserFollowingReply') {
            targetedComment = parentCommentsOfRepliesMadeByAuthUserFollowing[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='AuthUserFollowingReply') {
            targetedComment = repliesMadeByAuthUserFollowing[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='PostAuthorComment') {
            targetedComment = commentsMadeByPostAuthor[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='ParentOfPostAuthorReply') {
            targetedComment = parentCommentsOfRepliesMadeByPostAuthor[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        else if(commentType==='PostAuthorReply') {
            targetedComment = repliesMadeByPostAuthor[commentIdx];
            targetedCommentId = targetedComment.id;
        }
        
        if(targetedCommentId in repliesOfCommentMappings) {
            repliesOfComment = repliesOfCommentMappings[targetedCommentId];
        }
        else {
            for(let i=0; i<repliesOfPost.length; i++) {
                const currReply = repliesOfPost[i];
                if(currReply.commentid===targetedCommentId && !(setOfIdsOfUniqueRepliesAlreadyDone.has(currReply.replyid))) {
                    const currReplyNumReplies = repliesOfPost.filter(x=>x.commentid === currReply.replyid).length;
                    repliesOfComment.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: currReplyNumReplies,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: targetedComment.level+1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited
                    });
                    regularComments.push({
                        id: currReply.replyid,
                        idOfParentComment: currReply.commentid,
                        isLiked: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][1] : false,
                        index: regularComments.length,
                        author: currReply.username,
                        isVerified: relevantUserInfo[currReply.username].isVerified,
                        content: currReply.comment,
                        numLikes: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][0] : 0,
                        date: getRelativeDateTimeText(currReply.datetime),
                        numReplies: currReplyNumReplies,
                        isLikedByAuthor: currReply.replyid in numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments ? numLikesAndIsLikedByUserAndIsLikedByPostAuthorForPostComments[currReply.replyid][2] : false,
                        level: targetedComment.level+1,
                        datetime: currReply.datetime,
                        isEdited: currReply.isedited
                    });
                }
            }
            repliesOfCommentMappings[targetedCommentId] = repliesOfComment;
        }
        

        createDOMElementsForReplies(commentType, commentIdx, repliesOfComment);
    }
    else {
        replyElements = document.querySelectorAll('.repliesOf'+commentType+commentIdx);
        for(let elem of replyElements) {
            elem.classList.add('hidden');
        }
        targetedViewRepliesText.classList.remove('hidden');
        targetedHideRepliesText.classList.add('hidden');
    }
}

function showOptionsIcon(idSuffix) {
    const targetedOptionsIcon = document.getElementById('optionsIconFor'+idSuffix);
    targetedOptionsIcon.classList.remove('hidden');
}

function hideOptionsIcon(idSuffix) {
    const targetedOptionsIcon = document.getElementById('optionsIconFor'+idSuffix);
    targetedOptionsIcon.classList.add('hidden');
}

function showOptionsPopupForComment(commentType, commentIdx) {
    commentSelectedForOptions = [commentType, commentIdx];
    mainSection.style.zIndex = "";
    commentOptionsPopup.classList.remove('hidden');
}

function cancelOptionsPopupForComment() {
    commentSelectedForOptions = [];
    mainSection.style.zIndex = "10";
    commentOptionsPopup.classList.add('hidden');
}

async function deleteComment() {
    let commentToDelete;
    if(commentSelectedForOptions[0]==='AuthUserComment') {
        commentsMadeByAuthUser[commentSelectedForOptions[1]].isDeleted = true;
        commentToDelete = commentsMadeByAuthUser[commentSelectedForOptions[1]];
    }
    else if(commentSelectedForOptions[0]==='AuthUserReply') {
        repliesMadeByAuthUser[commentSelectedForOptions[1]].isDeleted = true;
        commentToDelete = repliesMadeByAuthUser[commentSelectedForOptions[1]];
    }
    else if(commentSelectedForOptions[0]==='RegularComment') {
        regularComments[commentSelectedForOptions[1]].isDeleted = true;
        commentToDelete = regularComments[commentSelectedForOptions[1]];
    }
    let targetedCommentId = commentSelectedForOptions[0] + commentSelectedForOptions[1];
    targetedCommentId = targetedCommentId[0].toLowerCase() + targetedCommentId.slice(1);
    const targetedComment = document.getElementById(targetedCommentId);

    if(commentToDelete.idOfParentComment==null) {
        const response = await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    removeComment(commentid: "${commentToDelete.id}")
                }`
        })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
    }
    else {
        const response = await fetch('http://localhost:5022/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `mutation {
                    removeReply(replyid: "${commentToDelete.id}")
                }`
        })
        });
        if(!response.ok) {
            throw new Error('Network response not ok');
        }
    }
    targetedComment.remove();
    cancelOptionsPopupForComment();
}

function goToCommentEditMode() {
    const targetedTextarea = document.getElementById('textareaForEditing'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
    const targetedEditModeDiv = document.getElementById('editModeDiv'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
    const targetedMainDiv = document.getElementById('mainDiv'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
    let targetedComment;
    let targetedHeart;
    if(commentSelectedForOptions[0]==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentSelectedForOptions[1]];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        targetedHeart.classList.add('hidden');
    }
    else if(commentSelectedForOptions[0]==='AuthUserReply') {
        targetedComment = repliesMadeByAuthUser[commentSelectedForOptions[1]];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        targetedHeart.classList.add('hidden');
    }
    else if(commentSelectedForOptions[0]==='RegularComment') {
        targetedComment = regularComments[commentSelectedForOptions[1]];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentSelectedForOptions[0] + commentSelectedForOptions[1]);
        }
        targetedHeart.classList.add('hidden');
    }
    targetedTextarea.placeholder = targetedComment.content;
    targetedEditModeDiv.classList.remove('hidden');
    targetedMainDiv.classList.add('hidden');
    cancelOptionsPopupForComment();
}

function onInputOfTextareaForEditingComment(idSuffix) {
    const targetedTextarea = document.getElementById('textareaForEditing'+idSuffix);
    const targetedConfirmEditButton = document.getElementById('confirmEditButton'+idSuffix);
    if(targetedTextarea.value.length>0) {
        targetedConfirmEditButton.classList.remove('hidden');
    }
    else {
        targetedConfirmEditButton.classList.add('hidden');
    }
}

function cancelCommentEdit(commentType, commentIdx) {
    const targetedTextarea = document.getElementById('textareaForEditing'+commentType+commentIdx);
    const targetedConfirmEditButton = document.getElementById('confirmEditButton'+commentType+commentIdx);
    const targetedEditModeDiv = document.getElementById('editModeDiv'+commentType+commentIdx);
    const targetedMainDiv = document.getElementById('mainDiv'+commentType+commentIdx);

    let targetedComment;
    let targetedHeart;
    if(commentType==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentIdx];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }
    else if(commentType==='AuthUserReply') {
        targetedComment = repliesMadeByAuthUser[commentIdx];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }
    else if(commentType==='RegularComment') {
        targetedComment = regularComments[commentIdx];
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }

    targetedTextarea.value = "";
    targetedConfirmEditButton.classList.add('hidden');
    targetedEditModeDiv.classList.add('hidden');
    targetedMainDiv.classList.remove('hidden');
}

async function confirmCommentEdit(commentType, commentIdx) {
    const targetedTextarea = document.getElementById('textareaForEditing'+commentType+commentIdx);
    const targetedConfirmEditButton = document.getElementById('confirmEditButton'+commentType+commentIdx);
    const targetedEditModeDiv = document.getElementById('editModeDiv'+commentType+commentIdx);
    const targetedMainDiv = document.getElementById('mainDiv'+commentType+commentIdx);
    const targetedDateText = document.getElementById('dateText'+commentType+commentIdx);
    const targetedContent = document.getElementById('content'+commentType+commentIdx);

    let targetedComment;
    let targetedHeart;
    let wasThereAChangeInComment = false;
    if(commentType==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentIdx];
        if(targetedComment.content!==targetedTextarea.value) {
            wasThereAChangeInComment = true;
            targetedComment.content = targetedTextarea.value;
            targetedContent.textContent = targetedComment.content;
            targetedDateText.textContent = "Now • Edited";
        }
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }
    else if(commentType==='AuthUserReply') {
        targetedComment = repliesMadeByAuthUser[commentIdx];
        if(targetedComment.content!==targetedTextarea.value) {
            wasThereAChangeInComment = true;
            targetedComment.content = targetedTextarea.value;
            targetedContent.textContent = targetedComment.content;
            targetedDateText.textContent = "Now • Edited";
        }
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }
    else if(commentType==='RegularComment') {
        targetedComment = regularComments[commentIdx];
        if(targetedComment.content!==targetedTextarea.value) {
            wasThereAChangeInComment = true;
            targetedComment.content = targetedTextarea.value;
            targetedContent.textContent = targetedComment.content;
            targetedDateText.textContent = "Now • Edited";
        }
        if(targetedComment.isLiked) {
            targetedHeart = document.getElementById('redHeartIcon'+commentType + commentIdx);
        }
        else {
            targetedHeart = document.getElementById('blankHeartIcon'+commentType + commentIdx);
        }
        targetedHeart.classList.remove('hidden');
    }

    if(wasThereAChangeInComment) {
        let currDateString = new Date();
        currDateString = currDateString.toISOString();
        if(targetedComment.idOfParentComment==null) {
            const response = await fetch('http://localhost:5022/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `mutation {
                        editComment(commentid: "${targetedComment.id}", datetime: "${currDateString}", comment: "${targetedComment.content}") {
                            comment
                        }
                    }`
            })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
        }
        else {
            const response = await fetch('http://localhost:5022/graphql', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query: `mutation {
                        editReply(replyid: "${targetedComment.id}", datetime: "${currDateString}", comment: "${targetedComment.content}") {
                            comment
                        }
                    }`
            })
            });
            if(!response.ok) {
                throw new Error('Network response not ok');
            }
        }
    }

    targetedTextarea.value = "";
    targetedConfirmEditButton.classList.add('hidden');
    targetedEditModeDiv.classList.add('hidden');
    targetedMainDiv.classList.remove('hidden');
}

function playBackgroundSound() {
    backgroundSound.play();
    playBackgroundSoundIcon.classList.add('hidden');
    pauseBackgroundSoundIcon.classList.remove('hidden');
}

function pauseBackgroundSound() {
    backgroundSound.pause();
    playBackgroundSoundIcon.classList.remove('hidden');
    pauseBackgroundSoundIcon.classList.add('hidden');
}

async function followPostAuthor() {
    const response = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                addUserFollowing(newUserFollowing: { follower: "${authenticatedUsername}", followee: "${postInfo['usernames'][0]}" })
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
}

async function unfollowPostAuthor() {
    const response = await fetch('http://localhost:8013/graphql', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            mutation {
                removeUserFollowing(userFollowingToRemove: { follower: "${authenticatedUsername}", followee: "${postInfo['usernames'][0]}" })
            }
            `
            })
    });
    if(!response.ok) {
        throw new Error('Network response not ok');
    }
}

authenticateUserAndFetchData();