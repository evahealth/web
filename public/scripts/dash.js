// Instantiate MDC Drawer
const drawerEl = document.querySelector('.mdc-drawer');
const drawer = new mdc.drawer.MDCDrawer.attachTo(drawerEl);

// Instantiate MDC Top App Bar (required)
const topAppBarEl = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarEl);

topAppBar.setScrollTarget(document.querySelector('.main-content'));
//topAppBar.listen('MDCTopAppBar:nav', () => {
//  drawer.open = !drawer.open;
//});

function replaceTherapy() {
  document.getElementById("nevergonnagiveuup").innerHTML = "Find Therapists"
}

function replaceTutor() {
  document.getElementById("nevergonnagiveuup").innerHTML = "Find Tutors"
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

function writeToUserAccountTest(testingxkcd) {
  firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("testing").add({
    name: getUserName(),
    text: testingxkcd,
    chatid: "hi chat id goes here",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Database', error);
  });
}

function signOutOfDash() {
  firebase.auth().signOut().then(function() {
    window.location = 'https://app.evaapp.xyz';
  }).catch(function(error) {
    // An error happened.
    console.log("Sign Out Error!");
    console.log(error);
  });
}