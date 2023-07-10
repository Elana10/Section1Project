"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  getAndShowStoriesOnStart();
}
$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);

// When a user clicks on 'Add Story' 
// - Show add story form and hide everything else.
function navAddStory (){
  console.debug("navAddStory");
  hidePageComponents();
  $storyForm.show();
}
$navAddStory.on("click", navAddStory);

// When a user clicks on the 'My Favorites' tab
function navMyFavorites(){
  console.debug("navMyFavorites")
  hidePageComponents();

  const list = currentUser.favorites;
  putStoriesOnPage(new StoryList(list));

}
$navFavorites.on("click", navMyFavorites);

// When a user clicks on the 'My Posts' tab
function navMyPosts(){
  console.debug("navMyPosts")
  hidePageComponents();

  const list = currentUser.ownStories;
  putStoriesOnPage(new StoryList(list));
}
$navMyStories.on("click", navMyPosts)

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navFavorites.show();
  $navAddStory.show();
  $navMyStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
 