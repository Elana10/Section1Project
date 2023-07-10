"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Updates and loads stories when site first loads. */
async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart")
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList);
}

//  * A render method to render HTML for an individual Story instance
//  * - story: an instance of Story
//  * Returns the markup for the story.
function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup");
  const hostName = story.getHostName();
  const storyPoster = story.getStoryPoster();
  const storyID = story.getStoryID();

  let idArr = []; 
  
  if(currentUser){
    for (let i=0; i<currentUser.favorites.length; i++){
      idArr.push(currentUser.favorites[i].storyId)
    }
  

    if(idArr.includes(storyID)){
      if (storyPoster === currentUser.username){
        return $(`
        <li id="${story.storyId}">
          <input type="checkbox" class="favorite-toggle" checked>
          <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
          <button class="story-delete">Delete My Post</button>
          <hr>
        </li>
        `);  
      }
      return $(`
        <li id="${story.storyId}">
          <input type="checkbox" class="favorite-toggle" checked>
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
          <hr>
        </li>
      `)
    }

    if (storyPoster === currentUser.username){
      return $(`
      <li id="${story.storyId}">
        <input type="checkbox" class="favorite-toggle">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="story-delete">Delete My Post</button>
        <hr>
      </li>
      `);  
    }

    return $(`
      <li id="${story.storyId}">
        <input type="checkbox" class="favorite-toggle">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `); 
  }

  return $(`
  <li id="${story.storyId}">
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
    <hr>
  </li>
`);

}

/** Takes list of stories, generates their HTML, and puts on page. */
function putStoriesOnPage(listToUse) {
  console.debug("putStoriesOnPage",listToUse);
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of listToUse.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Adds story to data bas and refreshes page with new story
//-saves inputs and sends to StoryList.addStory static method
//-addStory updates storyList with new Story and loads to website
//-clear story form and loads the storyList to the webpage
async function submitStory(){
  console.debug("submitStory");

  const title = $("#new-title").val();
  const author = $("#new-author").val();
  const url = $("#new-url").val();

  await StoryList.addStory(currentUser, {title,author,url})

  $storyForm.trigger("reset");
  hidePageComponents();
  putStoriesOnPage(storyList);

  currentUser = await User.loginOrUpdateViaStoredCredentials(currentUser.loginToken, currentUser.username);
}
$storyForm.on("submit", submitStory);

//Updates the API and reloads the page.
async function deleteMyPost(evt){
  console.debug("deleteMyPost");
  const ID = evt.currentTarget.parentNode.id
  await StoryList.deletePostAPI(currentUser, ID)

  getAndShowStoriesOnStart();
}
$allStoriesList.on("click",".story-delete", deleteMyPost)

//Update the API to store favorites
async function changeFavorites(evt){
console.debug("changeFavorites");
const ID = evt.currentTarget.parentNode.id
let userFavorite = false;

for(let i =0; i < currentUser.favorites.length; i++){
  if(currentUser.favorites[i].storyId === ID){
    userFavorite = true; 
    break
  }
}

if(userFavorite){
  await StoryList.removeFavoriteAPI(currentUser, ID)
}
else{
  await StoryList.addFavoriteAPI(currentUser,ID)
}

currentUser = await User.loginOrUpdateViaStoredCredentials(currentUser.loginToken, currentUser.username);

}
$allStoriesList.on("click",".favorite-toggle",changeFavorites) 