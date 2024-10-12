const leftSidebarPopup = document.getElementById('leftSidebarPopup');
const toggleLeftSidebarPopupMoreOrLessText = document.getElementById('toggleLeftSidebarPopupMoreOrLessText');
const darkScreenCoveringEntirePage = document.getElementById('darkScreenCoveringEntirePage');
const darkScreenCoveringRightSideOfPage = document.getElementById('darkScreenCoveringRightSideOfPage');
const leftSidebar = document.getElementById('leftSidebar');
const mainSection = document.getElementById('mainSection');
const goToPreviousPostArrow = document.getElementById('goToPreviousPostArrow');
const goToNextPostArrow = document.getElementById('goToNextPostArrow');
const goToNextSlideArrow = document.getElementById('goToNextSlideArrow');
const goToPreviousSlideArrow = document.getElementById('goToPreviousSlideArrow');
const slideDotsDiv = document.getElementById('slideDotsDiv');
const slideDots = slideDotsDiv.querySelectorAll('img');
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
const postCaption = document.getElementById('postCaption');

let displayLeftSidebarPopup = false;
let currBackground = 0;
let currSlide = 0;
let hasUserClickedOnVid = false;
let hasUserClickedOnMainSectionRight = false;
let commentToReplyTo = [];
let commentSelectedForOptions = [];
let postInfo = {
    numSlides: 4,
    numLikes: 82881,
    0: {
        isVideo: false,
        src: '/images/sampleImg.webp',
        taggedAccounts: [
            [20, 40, 'rishavry'],
            [46, 68, 'rishavry4']
        ]
    },
    1: {
        isVideo: false,
        src: '/images/sampleImg2.jpg',
        taggedAccounts: []
    },
    2: {
        isVideo: true,
        src: '/videos/storyOfMyLife.mp4',
        taggedAccounts: []
    },
    3: {
        isVideo: true,
        src: '/videos/fakePilot.mp4',
        taggedAccounts: [
            [35, 26, 'rishavry6'],
        ]
    }
};


let commentsMadeByAuthUser = [
    {
        id: "authUser_comment_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "rishavry",
        isVerified: false,
        content: "What a random collage of slides lmao, but 10/10!",
        numLikes: 15360,
        date: "3d",
        numReplies: 2,
        isLikedByAuthor: false,
        level: 0,
    }
];

let parentCommentsOfRepliesMadeByAuthUser = [
    {
        id: "parent_comment_of_authUser_reply_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "rishavry6",
        isVerified: false,
        content: "I'm gonna lie this stuff is amazing!",
        numLikes: 300,
        date: "16h",
        numReplies: 8,
        isLikedByAuthor: false,
        level: 0,
    }
];

let repliesMadeByAuthUser = [
    {
        id: "authUser_comment_0",
        idOfParentComment: "parent_comment_of_authUser_reply_0",
        isLiked: false,
        index: 0,
        author: "rishavry",
        isVerified: false,
        content: "I think you meant to say 'I'm not gonna lie'",
        numLikes: 28,
        date: "2m",
        numReplies: 3,
        isLikedByAuthor: false,
        level: 1,
    }
];

let commentsThatMentionAuthUser = [
    {
        id: "authUser_mention_comment_0",
        idOfParentComment: null,
        isLiked: true,
        index: 0,
        author: "rishavry6",
        isVerified: false,
        content: "Welcome to the jungle, we've got fun and games don't we @rishavry?",
        numLikes: 5,
        date: "1d",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 0,
    }
];

let parentCommentsOfRepliesThatMentionAuthUser = [
    {
        id: "parent_comment_of_reply_that_mentions_authUser_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "rishavry5",
        isVerified: false,
        content: "That pilot prank would've given me a heart attack if I was the passenger...",
        numLikes: 199,
        date: "5h",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 0,
    }
];

let repliesThatMentionAuthUser = [
    {
        id: "reply_that_mentions_authUser_0",
        idOfParentComment: "parent_comment_of_reply_that_mentions_authUser_0",
        isLiked: false,
        index: 0,
        author: "rishavry6",
        isVerified: false,
        content: "@rishavry & I were thinking the exact same thing. $$$ lawsuits!",
        numLikes: 0,
        date: "44s",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 1,
    }
];

let commentsMadeByAuthUserFollowing = [
    {
        id: "authUser_following_comment_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "rishavry4",
        isVerified: false,
        content: "This post reminds me of good times I had earlier",
        numLikes: 0,
        date: "2h",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 0,
    },
];

let parentCommentsOfRepliesMadeByAuthUserFollowing = [
    {
        id: "parent_comment_of_authUser_following_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "rishavry3",
        isVerified: true,
        content: "dude pick a genre",
        numLikes: 10,
        date: "18m",
        numReplies: 13,
        isLikedByAuthor: false,
        level: 0,
    }
]

let repliesMadeByAuthUserFollowing = [
    {
        id: "authUser_following_reply_0",
        idOfParentComment: "parent_comment_of_authUser_following_0",
        isLiked: true,
        index: 0,
        author: "rishavry9",
        isVerified: false,
        content: "dude pick a life",
        numLikes: 5,
        date: "1m",
        numReplies: 20,
        isLikedByAuthor: false,
        level: 1,
    }
];

let commentsMadeByPostAuthor = [
    {
        id: "post_author_comment_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "hurdles",
        isVerified: true,
        content: "i dont normally post this ik, but i thought it would be a nice change of pace lol",
        numLikes: 65,
        date: "52s",
        numReplies: 6,
        isLikedByAuthor: false,
        level: 0,
    },
];

let parentCommentsOfRepliesMadeByPostAuthor = [
    {
        id: "parent_comment_of_post_author_reply_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "uncertifiedhater",
        isVerified: false,
        content: "L post, hate everything about it",
        numLikes: 1400,
        date: "2d",
        numReplies: 50,
        isLikedByAuthor: false,
        level: 0,
    }
];

let repliesMadeByPostAuthor = [
    {
        id: "post_author_reply_0",
        idOfParentComment: "parent_comment_of_post_author_reply_0",
        isLiked: false,
        index: 0,
        author: "hurdles",
        isVerified: true,
        content: "ratio",
        numLikes: 1401,
        date: "15m",
        numReplies: 27,
        isLikedByAuthor: false,
        level: 1,
    }
];

let regularComments= [
    {
        id: "regular_comment_0",
        idOfParentComment: null,
        isLiked: false,
        index: 0,
        author: "deztrohester",
        isVerified: false,
        content: "nahhh Cam Ward didn't forget he was on live broadcast 😂😂😂",
        numLikes: 101,
        date: "3d",
        numReplies: 1,
        isLikedByAuthor: true,
        level: 0,
    },
    {
        id: "regular_comment_1",
        idOfParentComment: null,
        isLiked: true,
        index: 1,
        author: "xavier_dc85",
        isVerified: false,
        content: "that response to the shotgun is legendary",
        numLikes: 17,
        date: "2d",
        numReplies: 3,
        isLikedByAuthor: false,
        level: 0,
    },
    {
        id: "regular_comment_2",
        idOfParentComment: "regular_comment_0",
        isLiked: false,
        index: 2,
        author: "deztrohester2",
        isVerified: false,
        content: "did i find my twin who has the same belief and name as me?!",
        numLikes: 57,
        date: "2d",
        numReplies: 1,
        isLikedByAuthor: true,
        level: 1,
    },
    {
        id: "regular_comment_3",
        idOfParentComment: "regular_comment_2",
        isLiked: false,
        index: 3,
        author: "deztrohester",
        isVerified: true,
        content: "i think you did!",
        numLikes: 30,
        date: "10m",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 2,
    },
    {
        id: "regular_comment_4",
        idOfParentComment: "authUser_comment_0",
        isLiked: false,
        index: 4,
        author: "theogreplier",
        isVerified: false,
        content: "right? like is this not the work of an adhd patient? haha",
        numLikes: 80,
        date: "35m",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 1,
    },
    {
        id: "regular_comment_5",
        idOfParentComment: "authUser_comment_0",
        isLiked: false,
        index: 5,
        author: "brentsimmons",
        isVerified: true,
        content: "took the words right out of my fingers",
        numLikes: 18,
        date: "2m",
        numReplies: 2,
        isLikedByAuthor: true,
        level: 1,
    },
    {
        id: "regular_comment_6",
        idOfParentComment: "parent_comment_of_authUser_reply_0",
        isLiked: false,
        index: 6,
        author: "rishavry6",
        isVerified: false,
        content: "wow my comment is exploding!",
        numLikes: 10,
        date: "1h",
        numReplies: 0,
        isLikedByAuthor: false,
        level: 1,
    }

];

/*let allComments = [
    ...commentsMadeByAuthUser,
    ...parentCommentsOfRepliesMadeByAuthUser,
    ...repliesMadeByAuthUser,
    ...commentsThatMentionAuthUser,
    ...parentCommentsOfRepliesThatMentionAuthUser,
    ...repliesThatMentionAuthUser,
    ...commentsMadeByAuthUserFollowing,
    ...parentCommentsOfRepliesMadeByAuthUserFollowing,
    ...repliesMadeByAuthUserFollowing,
    ...commentsMadeByPostAuthor,
    ...parentCommentsOfRepliesMadeByPostAuthor,
    ...repliesMadeByPostAuthor,
    ...regularComments
];
*/


function authenticateUserAndFetchData() {
    let username = document.getElementById('authenticatedUsername').textContent;
     //insert actual user authentication code here
    authenticatedUsername = username;
    localStorage.setItem('authenticatedUsername', authenticatedUsername);

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
        goToPreviousPostArrow.style.left = '4%';
        goToNextPostArrow.style.left = '94%';
        darkScreenCoveringEntirePage.classList.remove('hidden');
        currBackground=2;
    }
    else {
        leftSidebar.classList.remove('hidden');
        mainSection.style.left = '19.5%';
        goToPreviousPostArrow.style.left = '15%';
        goToNextPostArrow.style.left = '96%';
        darkScreenCoveringEntirePage.classList.add('hidden');
        currBackground = 0;
    }
}

function goToNextPost() {

}

function goToPreviousPost() {

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
            else {
                goToPreviousPost();
            }
            break;

        case 'ArrowDown':
            if(hasUserClickedOnVid) {
                currSlideVid.volume = Math.max(0, currSlideVid.volume-0.1);
            }
            else {
                goToNextPost();
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

function postComment() {
    const newCommentId = generateUUID();
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
    mainDiv.style = "display: flex; align-items: start; width: 100%; position: relative; gap: 0.7em;";
    mainDiv.style.marginLeft = `${newAuthUserReply.level*5}em`;
    mainDiv.onmouseenter = () => showOptionsIcon("RegularComment"+replyIndex);
    mainDiv.onmouseleave = () => hideOptionsIcon("RegularComment"+replyIndex);

    const profileImg = document.createElement("img");
    profileImg.src = "/images/profilePhoto.png";
    profileImg.style = "cursor: pointer; height: 2.5em; width: 2.5em; object-fit: contain;";
    mainDiv.appendChild(profileImg);

    const textContentDiv = document.createElement("div");
    textContentDiv.id = "mainDivRegularComment"+replyIndex;
    textContentDiv.style = "display: flex; flex-direction: column;";

    const commentParagraph = document.createElement("p");
    commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

    const usernameBold = document.createElement("b");
    usernameBold.style = "cursor: pointer;";
    usernameBold.textContent = authenticatedUsername;

    //placeholder code assumes that authenticatatedUsername is verified
    if(2==2) {
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
    commentSpan.textContent = newAuthUserReply.content;
    
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
    mainDiv.style = "display: flex; align-items: start; width: 100%; position: relative; gap: 0.7em;";
    mainDiv.onmouseenter = () => showOptionsIcon("AuthUserComment"+commentIdx);
    mainDiv.onmouseleave = () => hideOptionsIcon("AuthUserComment"+commentIdx);

    const profileImg = document.createElement("img");
    profileImg.src = "/images/profilePhoto.png";
    profileImg.style = "cursor: pointer; height: 2.5em; width: 2.5em; object-fit: contain;";
    mainDiv.appendChild(profileImg);

    const textContentDiv = document.createElement("div");
    textContentDiv.id = "mainDivAuthUserComment"+commentIdx;
    textContentDiv.style = "display: flex; flex-direction: column;";

    const commentParagraph = document.createElement("p");
    commentParagraph.style = "font-size: 0.8em; max-width: 80%; overflow-wrap: break-word;";

    const usernameBold = document.createElement("b");
    usernameBold.style = "cursor: pointer;";
    usernameBold.textContent = authenticatedUsername;

    //placeholder code assumes that authenticatatedUsername is verified
    if(2==2) {
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

    postCaption.insertAdjacentElement('afterend', mainDiv);
}

function toggleSavePost() {
    if(postIsSavedIcon.classList.contains('hidden')) {
        postIsSavedIcon.classList.remove('hidden');
        postIsNotSavedIcon.classList.add('hidden');
    }
    else {
        postIsSavedIcon.classList.add('hidden');
        postIsNotSavedIcon.classList.remove('hidden');
    }
}

function toggleLikePost() {
    if(postIsLikedIcon.classList.contains('hidden')) {
        postIsLikedIcon.classList.remove('hidden');
        postIsNotLikedIcon.classList.add('hidden');
        postInfo.numLikes++;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
    }
    else {
        postIsLikedIcon.classList.add('hidden');
        postIsNotLikedIcon.classList.remove('hidden');
        postInfo.numLikes--;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
    }
}

function likePost() {
    if(postIsLikedIcon.classList.contains('hidden')) {
        postIsLikedIcon.classList.remove('hidden');
        postIsNotLikedIcon.classList.add('hidden');
        postInfo.numLikes++;
        if(postInfo.numLikes==1) {
            postNumLikesText.textContent = "1 like";
        }
        else {
            postNumLikesText.textContent = postInfo.numLikes.toLocaleString() + " likes";
        }
    }
}

function setFocusToCommentTextarea() {
    textareaToAddComment.focus();
}

function toggleLikeComment(commentType, commentIdx) {
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

function likeComment(commentType, commentIdx) {
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

function createDOMElementsForReplies(commentType, commentIdx, repliesOfComment) {
    const parentCommentElement = document.getElementById(commentType[0].toLowerCase() + commentType.slice(1) +commentIdx);
    let currElemToAddNewReplyNextTo = parentCommentElement;
    for(let reply of repliesOfComment) {
        const mainDiv = document.createElement('div');
        mainDiv.id = 'regularComment'+reply.index;
        mainDiv.className = 'repliesOf'+commentType+commentIdx;
        mainDiv.style.marginLeft = (5*reply.level).toString() + 'em';
        mainDiv.style.display = 'flex';
        mainDiv.style.alignItems = 'start';
        mainDiv.style.width = '100%';
        mainDiv.style.position = 'relative';
        mainDiv.style.gap = '0.7em';

        const profileImg = document.createElement('img');
        profileImg.src = '/images/profilePhoto.png';
        profileImg.style.cursor = 'pointer';
        profileImg.style.height = '2.5em';
        profileImg.style.width = '2.5em';
        profileImg.style.objectFit = 'contain';
        mainDiv.appendChild(profileImg);

        const innerDiv = document.createElement('div');
        innerDiv.id = 'mainDivRegularComment'+reply.index;
        innerDiv.style.display = 'flex';
        innerDiv.style.flexDirection = 'column';

        const commentPara = document.createElement('p');
        commentPara.style.fontSize = '0.8em';
        commentPara.style.maxWidth = '80%';
        commentPara.style.overflowWrap = 'break-word';

        const username = document.createElement('b');
        username.style.cursor = 'pointer';
        username.textContent = reply.author;

        if(reply.isVerified) {
            const verifiedCheck = document.createElement('img');
            verifiedCheck.src = '/images/verifiedCheck.png';
            verifiedCheck.style.pointerEvents = 'none';
            verifiedCheck.style.height = '1.1em';
            verifiedCheck.style.width = '1.1em';
            verifiedCheck.style.objectFit = 'contain';
            username.appendChild(verifiedCheck);
        }

        commentPara.appendChild(username);

        const commentText = document.createElement('span');
        commentText.ondblclick = function() { likeComment('RegularComment', reply.index); };
        commentText.textContent = " " + reply.content;
        commentPara.appendChild(commentText);

        innerDiv.appendChild(commentPara);

        const metaDiv = document.createElement('div');
        metaDiv.style.display = 'flex';
        metaDiv.style.alignItems = 'center';
        metaDiv.style.gap = '1.5em';
        metaDiv.style.color = 'gray';
        metaDiv.style.fontSize = '0.7em';
        metaDiv.style.marginTop = '-1em';

        const datePara = document.createElement('p');
        datePara.textContent = reply.date;
        metaDiv.appendChild(datePara);

        const likesText = document.createElement('b');
        likesText.id = 'numLikesTextRegularComment'+reply.index;
        likesText.style.cursor = 'pointer';
        if(reply.numLikes==0) {
            likesText.classList.add('hidden');
        }
        if(reply.numLikes==1) {
            likesText.textContent = '1 like';
        }
        else {
            likesText.textContent = reply.numLikes.toLocaleString() + ' likes';
        }
        metaDiv.appendChild(likesText);

        const replyButton = document.createElement('b');
        replyButton.style.cursor = 'pointer';
        replyButton.onclick = function() { startReplyToComment('RegularComment', reply.index); };
        replyButton.textContent = 'Reply';
        metaDiv.appendChild(replyButton);

        if(reply.isLikedByAuthor) {
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

        innerDiv.appendChild(metaDiv);

        const viewRepliesText = document.createElement('b');
        viewRepliesText.id = 'viewRepliesTextRegularComment'+reply.index;
        viewRepliesText.style.cursor = 'pointer';
        viewRepliesText.style.color = 'gray';
        viewRepliesText.style.fontSize = '0.74em';
        viewRepliesText.style.marginTop = '1em';
        viewRepliesText.onclick = function() { toggleRepliesText('RegularComment', reply.index); };
        viewRepliesText.innerHTML = `—— <span style="margin-left: 0.9em;">View replies (${reply.numReplies})</span>`;
        if(reply.numReplies==0) {
            viewRepliesText.classList.add('hidden');
        }
        innerDiv.appendChild(viewRepliesText);

        const hideRepliesText = document.createElement('b');
        hideRepliesText.id = 'hideRepliesTextRegularComment'+reply.index;
        hideRepliesText.className = 'hidden';
        hideRepliesText.style.cursor = 'pointer';
        hideRepliesText.style.color = 'gray';
        hideRepliesText.style.fontSize = '0.74em';
        hideRepliesText.style.marginTop = '1em';
        hideRepliesText.onclick = function() { toggleRepliesText('RegularComment', reply.index); };
        hideRepliesText.innerHTML = '—— <span style="margin-left: 0.9em;">Hide replies</span>';
        innerDiv.appendChild(hideRepliesText);

        mainDiv.appendChild(innerDiv);

        const blankHeartIcon = document.createElement('img');
        blankHeartIcon.id = 'blankHeartIconRegularComment'+reply.index;
        blankHeartIcon.src = '/images/blankHeart.png';
        blankHeartIcon.onclick = function() { toggleLikeComment('RegularComment', reply.index); };
        blankHeartIcon.style.height = '1em';
        blankHeartIcon.style.width = '1em';
        blankHeartIcon.style.cursor = 'pointer';
        blankHeartIcon.style.objectFit = 'contain';
        blankHeartIcon.style.position = 'absolute';
        blankHeartIcon.style.left = '93%';
        blankHeartIcon.style.top = '36%';
        mainDiv.appendChild(blankHeartIcon);

        const redHeartIcon2 = document.createElement('img');
        redHeartIcon2.id = 'redHeartIconRegularComment'+reply.index;
        redHeartIcon2.src = '/images/redHeartIcon.webp';
        redHeartIcon2.className = 'hidden';
        redHeartIcon2.onclick = function() { toggleLikeComment('RegularComment', reply.index); };
        redHeartIcon2.style.height = '1em';
        redHeartIcon2.style.width = '1em';
        redHeartIcon2.style.cursor = 'pointer';
        redHeartIcon2.style.objectFit = 'contain';
        redHeartIcon2.style.position = 'absolute';
        redHeartIcon2.style.left = '93%';
        redHeartIcon2.style.top = '36%';
        mainDiv.appendChild(redHeartIcon2);

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
        
        repliesOfComment = regularComments.filter(x=>x.idOfParentComment===targetedCommentId);

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

function deleteComment() {
    if(commentSelectedForOptions[0]==='AuthUserComment') {
        commentsMadeByAuthUser[commentSelectedForOptions[1]].isDeleted = true;
    }
    else if(commentSelectedForOptions[0]==='AuthUserReply') {
        repliesMadeByAuthUser[commentSelectedForOptions[1]].isDeleted = true;
    }
    else if(commentSelectedForOptions[0]==='RegularComment') {
        regularComments[commentSelectedForOptions[1]].isDeleted = true;
    }
    let targetedCommentId = commentSelectedForOptions[0] + commentSelectedForOptions[1];
    targetedCommentId = targetedCommentId[0].toLowerCase() + targetedCommentId.slice(1);
    const targetedComment = document.getElementById(targetedCommentId);
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

function confirmCommentEdit(commentType, commentIdx) {
    const targetedTextarea = document.getElementById('textareaForEditing'+commentType+commentIdx);
    const targetedConfirmEditButton = document.getElementById('confirmEditButton'+commentType+commentIdx);
    const targetedEditModeDiv = document.getElementById('editModeDiv'+commentType+commentIdx);
    const targetedMainDiv = document.getElementById('mainDiv'+commentType+commentIdx);
    const targetedDateText = document.getElementById('dateText'+commentType+commentIdx);
    const targetedContent = document.getElementById('content'+commentType+commentIdx);

    let targetedComment;
    let targetedHeart;
    if(commentType==='AuthUserComment') {
        targetedComment = commentsMadeByAuthUser[commentIdx];
        if(targetedComment.content!==targetedTextarea.value) {
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

    targetedTextarea.value = "";
    targetedConfirmEditButton.classList.add('hidden');
    targetedEditModeDiv.classList.add('hidden');
    targetedMainDiv.classList.remove('hidden');
}


authenticateUserAndFetchData();