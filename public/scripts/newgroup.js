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

function createNewGroup(x) {
    // document.getElementById("sign in");
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithPopup(provider);
    if( x === 1 ){
        const groups_x = getParameterByName('g');
        db.collection(groups_x).get().then(sub => {
            newGroupExists = sub.docs.length;
            if (newGroupExists === 0) {
                window.location.replace("404.html");
            }
        });
    }
    else{
        const newGroup = Math.random().toString(36).substring(2, 15);
        db.collection(newGroup).get().then(sub => {
            newGroupExists = sub.docs.length;
            if (newGroupExists > 0) {
                createNewGroup()
            }
            else{
                console.log("execute new group")
                window.localStorage.setItem("value1", "button");
                if (isUserSignedIn() === false){
                    signIn();
                }
                if (isUserSignedIn() === true){
                    window.location.replace(window.location.origin + "/chat.html?g=" + newGroup);
                }
            }
        });
    }
}

function isUserSignedIn() {
    return firebase.auth().currentUser;
}


function signIn() {
    // Sign into Firebase using popup auth & Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}
