//db.collection("fsuhidhfudh").get().then(sub => {alert(sub.docs.length)});
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var db = firebase.firestore();

function isUserSignedIn() {
    return firebase.auth().currentUser;
}

function signInMain(chooseProvider) {
    if (chooseProvider == "google") {     // Sign into Firebase using popup auth & Google as the identity provider.
        provider = new firebase.auth.GoogleAuthProvider();
    }
    if (chooseProvider == "fb") {
        provider = new firebase.auth.FacebookAuthProvider();
    }
    if (chooseProvider == "github") {
        provider = new firebase.auth.GithubAuthProvider();
    }
    if (chooseProvider == "twitter") {
        provider = new firebase.auth.TwitterAuthProvider();
    }
    firebase.auth().signInWithPopup(provider);
}

function joeMumSignIn(passProviderA) {
    userMeme = firebase.auth().currentUser;
    if (isUserSignedIn() == true) {
        console.log("User is logged in, redirecting!");
        window.location.replace("https://app.evaapp.xyz/dashboard.html");
    } else {
        signInMain(passProviderA);
    }
}

function instaDash() {
    if (isUserSignedIn() == true) {
        console.log("User is logged in, redirecting!");
        window.location.replace("https://app.evaapp.xyz/dashboard.html");
    }
}