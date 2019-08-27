
function checkAppPresent(appKey,name,language,titleOption,skipOption){

      
      var requestId = "";
      var appPresent = false;
      var makeRequestId =function(length){
      var characters ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
           requestId += characters.charAt(
           Math.floor(Math.random() * charactersLength)
            );
       }
      return requestId;
      }
      makeRequestId(24)
       window.location =
                           `intent://truesdk/web_verify?requestNonce=${requestId}` +
                           `&partnerKey=${appKey}&partnerName=${name}&lang=${language}&title=${titleOption}&skipOption=${skipOption}#Intent;scheme=truecallersdk;end`;
                 
                  
      function checkAppStatus(){
            if(!document.hasFocus()){
                  appPresent = true
            }
           // console.log('123  ' + appPresent)
            
      }                     
      checkAppStatus();
      return requestId;
}


function getUserData(requestId,counter = 5,callbackUrl,duration = 3000){
      
      // Data Fields which needs to be present at Backend
      let userData = {
            email:''
      };
      if(counter===0) return 'Please Check Your Internet Connection';

    /* async function getData(){
           let response = await fetch(`${callbackUrl}/${requestId}`)
                                .then(data => data.json())
                                .then(data => {
                                    userData.email = data[0].email;
                                    userData.firstName = data[0].name.first;
                                    userData.lastName = data[0].name.last;
                                    userData.phoneNumber = data[0].phone;
                                })            
           return response;
      }
     // console.log(userData)        
       getData()
     console.log(userData)

return userData */
fetch(`${callbackUrl}/${requestId}`)
.then(data => data.json())
.then(data => {
    userData.email = data[0].email;
    userData.firstName = data[0].name.first;
    userData.lastName = data[0].name.last;
    userData.phoneNumber = data[0].phone;
})

return userData

     // return userData.phoneNumber!=''?getData() :'Something Went Wrong, Please Try again';
}
