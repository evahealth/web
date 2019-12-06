//Check if image has nudez
function checkNudes(nudeUrl) {
    nudeApi = "https://api.sightengine.com/1.0/check.json?models=nudity&api_user=1956623496&api_secret=XCP4Bpx89aLoaEmbdJXE&url=" + nudeUrl;
    $.get(nudeApi, function (nudesReturn) {
      console.log(nudesReturn);
        if (nudesReturn.nudity.raw > 0.69) {
          console.log("bruh moment, why you send this")
          return true;
        }
    });
  }