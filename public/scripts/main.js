 const groups_ = getParameterByName('g');

function dashboardBack() {
  console.log("dashboardBack")
  window.location.href = "https://app.evaapp.xyz/dashboard"
}

function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
  window.location = 'https://app.evaapp.xyz';
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

var chatRoomDir = firebase.firestore().collection("rooms").doc("chat");

chatRoomDir.collection(groups_).get().then(sub => {
  newGroupExists = sub.docs.length;
  if (newGroupExists === 0) {
    ////////////////////////////////////////////////////////////////////////////////////////////////
  saveMessage('New Group Created on Eva!').then(function() {
       //Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
});

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  //Update Each user's inbox with txt:
  updateEachUsersInbox(messageText);
  // Add a new message entry to the Firebase database.
  return chatRoomDir.collection(groups_).add({
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Database : ' + messageText, error);
  });
}

//Set Query Value to 32 messages on each load:
var maxMsgQueryEachTime = 32;
var initQueryValue = 256;

//Check If array contains item
function arrayContains(needle, arrhaystack)
{
  console.log("checking if " + needle + "inside " + arrhaystack)
  arrResult = arrhaystack.indexOf(needle) > -1;
  console.log("arrResult", arrResult)
    return arrResult;
}

var metadataA = firebase.firestore().collection("rooms").doc("metadata").collection("details").doc(groups_);

//update users in room
function userInRoomUpdate() {
  //Add user to list of users inside chatroom
  //details reference location
  console.log(metadataA);

  metadataA.get().then(function(doc) {
    console.log("getFunction metadataA");
    if (doc.exists) {
        console.log("Document data:", doc.data());
        //prints out users in room existing
        console.log(doc.data().usersInRoom);

          //is user not inside chatDetails Already?
          if (arrayContains(firebase.auth().currentUser.uid, doc.data().usersInRoom) == false) {
            console.log("Adding user")
            // Atomically add userId to the "usersInRoom" array field.
            metadataA.update({
              usersInRoom: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
          });
          } else {
            console.log("User IN Field!")
          }
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    metadataA.set({usersInRoom: [firebase.auth().currentUser.uid] });
  }

})}

function updateEachUsersInbox (msgForInbox) {
   
  //read seperate collection "name" which stores usually not changing data such as the name of the room and the type, be it therapy or tutoring, or whatever
  firebase.firestore().collection("rooms").doc("metadata").collection("name").doc(groups_).get().then(function(updateDocName) {
    console.log(updateDocName.data())

  metadataA.get().then(function(updateDoc69) {
    console.log("getFunction metadataA");
    console.log(updateDoc69)
    console.log(updateDoc69.data())
    
    updateDoc69.data().usersInRoom.forEach(function(element){
      console.log("current user inbox to write to", element)

      roomPlace = "";
      
      //each user, or element update their collection
      var inboxRef = firebase.firestore().collection("userInbox").doc(element);

      console.log("chatroom type" + updateDoc69.data.type);

      if (updateDocName.data().type == "tutor") {
        console.log("type is tutor")
        roomPlace = inboxRef.collection("tutorInbox").doc(groups_)
      }

      if (updateDocName.data().type == "therapy") {
        console.log("type is therapy")
        roomPlace = inboxRef.collection("therapyInbox").doc(groups_)
      }

      var profilePicUrlSender;
      var nameSender;

      var user5483476 = firebase.auth().currentUser;

      if (user5483476 != null) {
        user5483476.providerData.forEach(function (profile) {
          console.log("Sign-in provider: " + profile.providerId);
          console.log("  Provider-specific UID: " + profile.uid);
          console.log("  Name: " + profile.displayName);
          console.log("  Email: " + profile.email);
          console.log("  Photo URL: " + profile.photoURL);
        });
      }

      //finally, write to the users inbox under the group name with the name of the chatroom, msg, senderUID, and the time of msg
      roomPlace.set({
        name: updateDocName.data().name,
        msg: msgForInbox,
        senderPic: firebase.auth().currentUser.photoURL,
        senderName: firebase.auth().currentUser.displayName,
        senderuid: firebase.auth().currentUser.uid,
        group: groups_,
        time: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

      numCallbackRuns++
    })
    let numCallbackRuns = 0
    console.log("numCallbackRuns: ", numCallbackRuns)
})})

}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  userInRoomUpdate()
  // Create the query to load the last 128 messages and listen for new ones.
  var query = chatRoomDir
      .collection(groups_)
      .orderBy('timestamp', 'desc')
      .limit(initQueryValue);
  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteMessage(change.doc.id);
      } else {
        var message = change.doc.data();
        displayMessage(change.doc.id, message.timestamp, message.name,
            message.text, message.profilePicUrl, message.imageUrl);
      }
    });
  });
}

$("#messages").scroll(function() {
  if($("#messages").scrollTop() == 0) {
      console.log("user has scrolled to the top of the chat window");
       if ($('#messages').children().length > 31) {

       }
    }
});

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {

  //Update each user's inbox saying that user sent an image:
  updateEachUsersInbox("User Sent an Image");

  // 1 - We add a message with a loading icon that will get updated with the shared image.
  chatRoomDir.collection(groups_).add({
    name: getUserName(),
    imageUrl: LOADING_IMAGE_URL,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(messageRef) {
    // 2 - Upload the image to Cloud Storage.
    var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image's URL.
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });
      });
    });
  }).catch(function(error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  });
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.firestore().collection('fcmTokens').doc(currentToken)
          .set({uid: firebase.auth().currentUser.uid});
    } else {
      // Need to request permissions to show notifications.
      requestNotificationsPermissions();
    }
  }).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    saveMessagingDeviceToken();
  }).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://evaapp.xyz/img/app/app-loading-purple.gif';

// Delete a Message from the UI.
//---------------------------------------------------------------------------------------------------------------------------------\\
//function deleteMessage(id) {
  //let div = document.getElementById(id);
   //If an element for that message exists we delete it.
   //if (div) {
     //div.parentNode.removeChild(div);
   //}
//}

function createAndInsertMessage(id, timestamp) {
  const container = document.createElement('div');
  container.innerHTML = MESSAGE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }

  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');

  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    console.error('Firebase SDK Error.')
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase
initFirebaseAuth();

// Remove the warning about timstamps change.
var firestore = firebase.firestore();
var settings = {timestampsInSnapshots: true};
firestore.settings(settings);

// Enable Firebase Performance Monitoring.
firebase.performance();

// We load currently existing chat messages and listen to new ones.
loadMessages();

$.fn.isHScrollable = function () {
  return this[0].scrollWidth > this[0].clientWidth;
};

$.fn.isVScrollable = function () {
  return this[0].scrollHeight > this[0].clientHeight;
};

$.fn.isScrollable = function () {
  return this[0].scrollWidth > this[0].clientWidth || this[0].scrollHeight > this[0].clientHeight;
};