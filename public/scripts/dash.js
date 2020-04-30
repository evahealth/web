// Instantiate MDC Drawer
const drawerEl = document.querySelector('.mdc-drawer')
const drawer = new mdc.drawer.MDCDrawer.attachTo(drawerEl)

// Instantiate MDC Top App Bar (required)
const topAppBarEl = document.querySelector('.mdc-top-app-bar')
const topAppBar = new mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarEl)

topAppBar.setScrollTarget(document.querySelector('.main-content'))
//topAppBar.listen('MDCTopAppBar:nav', () => {
//  drawer.open = !drawer.open;
//});

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.name;
}

var myUserInbox;
var inboxSectionRef;


function run() {
      //variable exists, do what you want
      console.log("Varible exists")


      function replaceTherapy() {
        document.getElementById("nevergonnagiveuup").innerHTML = "Talk Now"
        loadInbox("therapy")
      }
      
      function replaceTutor() {
        document.getElementById("nevergonnagiveuup").innerHTML = "Find Tutors"
        loadInbox("tutor")
      }
      
      function loadInbox(inboxType) {

        document.getElementById("dubaiwaslit").innerHTML = ""
      
        if (inboxType = "therapy") {
          inboxSectionRef = myUserInbox.collection("therapyInbox")
        } else
        if (inboxType = "tutor") {
          inboxSectionRef = myUserInbox.collection("tutorInbox")
        }
      
        console.log(inboxSectionRef);
      
        inboxSectionRef.orderBy("time").get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              part69 = "<li onclick='window.location.href = \"https://app.evaapp.xyz/chat.html?g="
              part0 = "\"' class='mdc-list-item mdc-ripple-upgraded grey900li' tabindex='0' style='--mdc-ripple-fg-size:360px; --mdc-ripple-fg-scale:1.7064; --mdc-ripple-fg-translate-start:57px, -178.781px; --mdc-ripple-fg-translate-end:120px, -144px; -mdc-ripple-fg-translate-start:57px, -178.781px; --mdc-ripple-fg-translate-end:120px, -144px;'><span class='mdc-list-item__graphic material-icons' aria-hidden='true' style='background-size: cover;background-image: url(\""
              part1 = "\")' eva='userprofileplaceholder'></span> <span class='mdc-list-item__text' style='color:#fafafa'><span class='mdc-list-item__primary-text' style='color:#fafafa' eva='group-name'>"
              part2 = "</span><span class='mdc-list-item__secondary-text' style='color:#F5F5F5' eva='message'>"
              part3 = "</span></span><span class='mdc-list-item__meta material-icons' aria-hidden='true' style='color:#F5F5F5'>chat</span></li>"
            
      
              newDiv = part69 + doc.data().group + part0 + doc.data().senderPic + part1 +  doc.data().name + part2 + doc.data().senderName + ": " +  doc.data().msg + part3 
      
              document.getElementById("dubaiwaslit").innerHTML = document.getElementById("dubaiwaslit").innerHTML + newDiv;
      
          });
        });
      }

    // Inbox Processing
    var myUserInbox = firebase.firestore().collection("userInbox").doc(firebase.auth().currentUser.uid)

    function signOutOfDash() {
      firebase.auth().signOut().then(function() {
        window.location = 'https://app.evaapp.xyz';
      }).catch(function(error) {
        // An error happened.
        console.log("Sign Out Error!");
        console.log(error);
      });
    }

    replaceTherapy();
    document.getElementById("nameSide").innerHTML = name;
    console.log("Display Name done loading");
    document.getElementById("imageSide").style.backgroundImage = "url(" + photoUrl + ")"
    console.log("Profile Pic done loading")
  }

  /*
function writeToUserAccountTest(testingxkcd) {
  firebase.firestore().collection("users").doc(uid).collection("testing").add({
    name: getUserName(),
    text: testingxkcd,
    chatid: "hi chat id goes here",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Database', error);
  });
}*/
/*
function areYouInOrOut() {
  //checks if the user is signed in
  if (firebase.auth().currentUser == null) {
    console.log("User logged out, redirecting to front page!");
    window.location.replace("https://app.evaapp.xyz/");
  }}
  areYouInOrOut();
  */

  // Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.

  console.log("initFirebaseAuth Started");
  firebase.auth().onAuthStateChanged( user => {
    if (user) {console.log("auth changed!");run();}
  });
}