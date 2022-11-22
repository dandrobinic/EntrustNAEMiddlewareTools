const ErrorFormFields = "Error campos obligatorios"
const ErrorUserNotFound = "Error usuario no existe"
const ErrorNoMachineExists = "Error no existen maquinas registradas en Entrust"
const ErrorUserIsLocked = "Error Usuario Bloqueado"
const ErrorAccessDenied = "Acceso Denegado - No se puede reconocer el dispositivo"
const successMessage = "Se permite el acceso del usuario al sistema"
const successValidateDeviceMessage = "Su dispositivo fue validado correctamente a traves de los controles avanzados"
const URL_BASE = "https://claro.us.trustedauth.com/api/web/"
const ADMIN_APPLICATION_ID_DEV = "a7f87d22-b5c6-4597-8753-407c9c7d5dfd" // API deAdministración Dev
const SECRET = "R0cEFkU452RU4L71Siv_HcBszTJi2ccBehcbbE2MDhM" // Shared Secret Key
const API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES = "8fce9f63-7138-401b-b655-e4673197f09f" // API de Autenticación Global (No Resource Rules)
const API_AUTENTICACION_DEV = "62e2493a-127a-478e-aec6-5978efd4045f"  // API de Autenticación Dev Geo and Machine 

$(document).ready(() => {

  machineSecret.setDebugOn(true).setStorageTypeExclusions('flash');
  $("#machineNonce").val(machineSecret.fetchMachineNonce())
  $("#sequenceNonce").val(machineSecret.fetchSequenceNonce())

  // MACHINE NONCES INITIALIZAtION
  var $machineNonce = $("#machineNonce");
  var $sequenceNonce = $("#sequenceNonce");

  if ($machineNonce.length || $sequenceNonce.length) {    
    if ($machineNonce.length) {
      machineSecret.storeMachineNonce($machineNonce.val());
    }
    if ($sequenceNonce.length) {
      machineSecret.storeSequenceNonce($sequenceNonce.val());
    }
  }

  // RememberMe Checkbox input field 
  const rememberMeCheckbox = document.getElementById("rememberMe");

  // Check  if fingerprintDeviceInInUse. Check if a device fingerprint has been requested in a past authentication attempt, this will be remembered and returned here.
  if (machineSecret.isDeviceFingerprintInUse()) {
    rememberMeCheckbox.checked = true;
    const fingerprint =  machineSecret.getDeviceFingerprint()
    $("#fingerprint").val(fingerprint);
  }else{
    rememberMeCheckbox.checked = false;
    $("#fingerprint").val("");
  }

  // When RememberMe check field changes
  rememberMeCheckbox.addEventListener("change", function(){
    // Always confirm that the user doesn't want to be remembered
    if (!this.checked && $("#fingerprint").val() != "" || machineSecret.isDeviceFingerprintInUse()) {
        if (confirm ("You don't want to be remembered on this machine?")) {
            machineSecret.doNotRemember(); // Remove all aspects of machine secret information associated with the user. This would be done if the user decides not to "Remember Me" anymore 
            $("#fingerprint").val("");
        }
        else {
            this.checked = true; // turn check back on
        }
    }
    else if (this.checked && $("#fingerprint").val() == "") {
        // Collect the fingerprint data using a callback. This is because the GEO
        // location attribute is asynchronous.
        // If the user does not respond within the timeout period, the SDK will record
        // an error for the GEO location attribute.
        // const fingerPrintDevice = machineSecret.getDeviceFingerprint(
        //   // This callback is called by getDeviceFingerprint() once all the data has
        //   // been collected, or after the timeout period. Any attributes that have not
        //   // been collected within the timeout perioud are recorded as having failed
        //   // collection and will not be present in the fingerprint data or device ID
        //   function (fingerprint) {
        //     $("#fingerprint").val(fingerprint);
        //     // alert("within the callback function")
        //     var fpJson = JSON.parse(fingerprint);
        //     var geoLocation = fpJson.attributes.geoLocation;
        //     console.log(geoLocation);
        //     if (!('geoLocation' in fpJson.attributes)) {
        //         alert('GEO location will not be recorded.');
        //     }
        //   },
        // 5000); // 5000 millis = 5 seconds  

        // Collect and Get Fingerprint Device with default values
        const fingerPrintDevice = machineSecret.getDeviceFingerprint();
        $("#fingerprint").val(fingerPrintDevice);        
        if (fingerPrintDevice == null && fingerPrintDevice != "") {
          showError("Hubo un error consultando el fingerprint del dispositivo")
          return false
        }else{
          console.log("fingerPrintDevice collected: ",JSON.parse(fingerPrintDevice))
        } 
    }   
  });

  // Add a custom attribute whose collection process will be launched
  // asynchronously. Once at least one asynchronous attribute has been
  // added, the collection process must be launched with a callback function 
  // machineSecret.addDeviceAsynchronousAttribute("geoLocation", getGeoLocation);

  //** Closing PUSH Notification Blocking Overlay **//
  document.getElementById("close").addEventListener("click", function(){
    $('#overlay').fadeOut(300);
  });
  
})

//** FUNCTIONS **//

async function submitPush() {
  
  /**********************************************/
  /************* Validation Form ***************/
  /********************************************/
  $('#submit').hide()
  $('#submitPush').hide()
  $('#submitOTPviaMail').hide()
  $('#sendOtpViaSms').hide()
  $('#loading').show()
  $('#submit').hide()
  $('#loading').show()
  var validate = validateForm();

  if (!validate) {
    showError(ErrorFormFields)
    setTimeout(habilitateButton, 3000)
    return false
  }

  /**********************************************/
  /************* Validate Device ***************/
  /********************************************/
  const validateDeviceResp = await validateDevice();
  console.log("validateDeviceResp: ",validateDeviceResp);
  
  if (validateDeviceResp == null) {
    showError("Hubo un error al validar el dispositivo. Vuelva a intentarlo.")
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(validateDeviceResp.message){
    showError(validateDeviceResp.message)
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(!validateDeviceResp){
    showError(ErrorAccessDenied)
    setTimeout(habilitateButton, 3000)
    return false
  }
  $('#overlay').fadeIn(300);    
  
  // Send PUSH Notification
  const pushToken = await sendPushNotification();
  if (pushToken == null) {
      showError("Hubo un error al intentar enviar la notificación PUSH")
      setTimeout(habilitateButton, 3000)
      return false
  }
  
  // Check if PUSH Notification has a RESPONSE
  const completePushResponse = await checkPushNotificationResponse(pushToken)
  console.log(completePushResponse);
  
  if (completePushResponse == 'CONFIRM') {
    showSuccess(successMessage)
  }else if (completePushResponse == 'CANCEL' || completePushResponse == 'CONCERN' ) {
      showError("Su acceso no fue permitido.")
      setTimeout(habilitateButton, 3000)
  }else{
    showError("No se obtuvo respuesta de la notificacion PUSH.")
    setTimeout(habilitateButton, 3000)
  }
  $('#overlay').fadeOut(300);
}
async function checkPushNotificationResponse(pushToken){
  var counter = 0;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  do {
    var completePush = await completePushNotification(pushToken);
    await delay(3000)
    counter++;
  } while (completePush == "NO_RESPONSE" && counter < 150 );
  return completePush;
}
async function sendOTPviaEmail() {
  /**********************************************/
  /************* Validation Form ***************/
  /********************************************/
  $('#submit').hide()
  $('#submitPush').hide()
  $('#submitOTPviaMail').hide()
  $('#sendOtpViaSms').hide()
  $('#loading').show()
  var validate = validateForm();

  if (!validate) {
    showError(ErrorFormFields)
    setTimeout(habilitateButton, 3000)
    return false
  }

  /**********************************************/
  /************* Validate Device ***************/
  /********************************************/
  const validateDeviceResp = await validateDevice();
  console.log("validateDeviceResp: ",validateDeviceResp);
  if (validateDeviceResp == null) {
    showError("Hubo un error al validar el dispositivo. Vuelva a intentarlo.")
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(validateDeviceResp.message){
    showError(validateDeviceResp.message)
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(!validateDeviceResp){
    showError(ErrorAccessDenied)
    setTimeout(habilitateButton, 3000)
    return false
  }
  
  // Authenticate against Entrust API Admin 
  const token = await getToken();
  if (token == null) {
    showError("Hubo un error al autenticarse")
    setTimeout(habilitateButton, 3000)
    return false
  }

  
  // Create and send OTP
  const createsAndSendOtpResp = createsAndSendOtp(token, "EMAIL", "true");
  if (createsAndSendOtpResp == null || (createsAndSendOtpResp != null && createsAndSendOtpResp.errorCode != null)) {
    showError("Hubo un error al crear y enviar el OTP via EMAIL")
    setTimeout(habilitateButton, 3000)
    return false
  }

  showSuccess("OTP enviado satisfactoriamente via EMAIL");
}

async function sendOtpViaSms() {
  /**********************************************/
  /************* Validation Form ***************/
  /********************************************/
  $('#submit').hide()
  $('#submitPush').hide()
  $('#submitOTPviaMail').hide()
  $('#sendOtpViaSms').hide()
  $('#loading').show()
  var validate = validateForm();

  if (!validate) {
    showError(ErrorFormFields)
    setTimeout(habilitateButton, 3000)
    return false
  }

  /**********************************************/
  /************* Validate Device ***************/
  /********************************************/
  const validateDeviceResp = await validateDevice();
  console.log("validateDeviceResp: ",validateDeviceResp);
  
  if (validateDeviceResp == null) {
    showError("Hubo un error al validar el dispositivo. Vuelva a intentarlo.")
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(validateDeviceResp.message){
    showError(validateDeviceResp.message)
    setTimeout(habilitateButton, 3000)
    return false
  }
  if(!validateDeviceResp){
    showError("No se reconoce el dispositivo")
    setTimeout(habilitateButton, 3000)
    return false
  }

  // Authenticate against Entrust API Admin 
  const token = await getToken();
  if (token == null) {
    showError("Hubo un error al autenticarse")
    setTimeout(habilitateButton, 3000)
    return false
  }

  // Create and send OTP 
  const createsAndSendOtpResp = createsAndSendOtp(token, "SMS", "true");
  if (createsAndSendOtpResp == null || (createsAndSendOtpResp != null && createsAndSendOtpResp.errorCode != null)) {
    showError("Hubo un error al crear y enviar el OTP via SMS")
    setTimeout(habilitateButton, 3000)
    return false
  }
  showSuccess("OTP enviado satisfactoriamente via SMS");
}
// Function that uses machineSecret object to check whether the user web client is recognized by its NONCEs(machine and sequence) 
async function validateDevice() {
  
  /******************************************************/
  /************* VALIDATE USER AND MACHINES ************/
  /****************************************************/

  // Authenticate against Entrust API Admin 
  const token = await getToken();
  if (token == null) {
    showError("Hubo un error al autenticarse")
    setTimeout(habilitateButton, 3000)
    return false
  }
  
  // Get Entrust User Info 
  const userInfo = await fetchUser(token);
  if (userInfo == null || (userInfo != null && userInfo.errorCode != null) || userInfo.id == null) {
    return {
      result: false,
      message: ErrorUserNotFound
    }
  }
  
  // Get user machines registered on Entrust
  const userMachines = await fetchMachines(userInfo.id, token);
  if (userMachines.length == 0) {
    return {
      result: false,
      message: ErrorNoMachineExists
    }
  }

  /*****************************************************/
  /************* MACHINE & SEQUENCE NONCES ************/
  /***************************************************/

  // Get Machine and Sequence Nonces
  var machine = machineSecret.fetchMachineNonce();
  var sequence = machineSecret.fetchSequenceNonce();

  if (machine)  $("#machineNonce").val(machine);
  if (sequence) $("#sequenceNonce").val(sequence);

  // Validate if Machine and Sequence Nonces are present in HTML 5 storage or in Cookies
  if(machine.length && sequence.length){

    /**********************************************/
    /************* FINGERPRINT DEVICE ************/
    /********************************************/     
    
    // Collect and Get Fingerprint Device with default values
    const fingerPrintDevice = machineSecret.getDeviceFingerprint();
    $("#fingerprint").val(fingerPrintDevice);
    var fingerPrintDeviceJson = JSON.parse(fingerPrintDevice);  
    
    if (fingerPrintDevice == null && fingerPrintDevice != "") {
      showError("Hubo un error consultando el fingerprint del dispositivo")
      return false
    }else{
      console.log("fingerPrintDevice collected: ",JSON.parse(fingerPrintDevice))
    }

    /**********************************************/
    /************ AUTHENTICATE MACHINE ***********/
    /********************************************/

    const userAuthenticatorsResp = await getUserAuthenticators(machine,sequence,fingerPrintDevice);  
    console.error("userAuthenticatorsResp: ",userAuthenticatorsResp);
    if (userAuthenticatorsResp == null) {
      return {
        result: false,
        message: "Hubo un error al reconocer el dispositivo"
      }
    }
    if(userAuthenticatorsResp.status === 403){      
      return {
        result: false,
        message: ErrorAccessDenied
      }
    }    
    
    /**********************************************/
    /************ STORE MACHINE NONCES ***********/
    /********************************************/
    machineSecret.storeMachineNonce(userAuthenticatorsResp.machineAuthenticator.machineNonce);  
    machineSecret.storeSequenceNonce(userAuthenticatorsResp.machineAuthenticator.sequenceNonce);
    console.log(successValidateDeviceMessage);
    return true;
    // showSuccess(successMessage);
  }else{
      // Deny Access or send PUSH Notification for the manager to decide if user can access and register device used    
      if (confirm("MachineNonce and SequenceNonce is not present. Simulating sending PUSH Notification to manager -> ¿Do you approve user access?")) {
        
        /**********************************************/
        /************* FINGERPRINT DEVICE ************/
        /********************************************/             
        
        // Collect and Get Fingerprint Device with default values
        const fingerPrintDevice = machineSecret.getDeviceFingerprint();
        $("#fingerprint").val(fingerPrintDevice);
        var fingerPrintDeviceJson = JSON.parse(fingerPrintDevice);  
        
        if (fingerPrintDevice == null && fingerPrintDevice != "") {
          showError("Hubo un error consultando el fingerprint del dispositivo")
          return false
        }else{
          console.log("fingerPrintDevice collected: ",JSON.parse(fingerPrintDevice))
        }

        // Register new Machine Secret
        var today = new Date()
        var dateString = today.toISOString().replace(/[-T:.Z]/g, '')
        const label = `${fingerPrintDeviceJson.platform} ${fingerPrintDeviceJson.attributes.osName} ${dateString}`
        
        const machineCreate = await createMachine(userInfo.id,fingerPrintDevice,label, token);
    
        if (machineCreate == null || (machineCreate != null && machineCreate.machineAuthenticator == null) || (machineCreate != null && machineCreate.machineAuthenticator != null && machineCreate.machineAuthenticator.machineNonce == null)) {
          showError("Hubo un error al registrar el dispositivo")
          setTimeout(habilitateButton, 3000)
          return false
        }
      
        //setCookie("machineNonce", machineCreate.machineAuthenticator.machineNonce, 365);
        //setCookie("sequenceNonce", machineCreate.machineAuthenticator.sequenceNonce, 365);
        machineSecret.storeMachineNonce(machineCreate.machineAuthenticator.machineNonce);  
        machineSecret.storeSequenceNonce(machineCreate.machineAuthenticator.sequenceNonce);
        console.log(successValidateDeviceMessage);
        return true;
        // showSuccess(successMessage);
    }else {
        showError("Su acceso no fue permitido por el manager asignado")        
        setTimeout(habilitateButton, 3000)
        return false;
    }
  }
}
// This is the function called by the SDK to get the GEO location.
function getGeoLocation(attribute) {
  // Check if GEO location functionality is not avaialble on this browser
  
  if (navigator.geolocation === null) {
      machineSecret.asynchronousAttributeFail(attribute,"GEO location functionality is not avaialble on this browser");
      return;
  }
  // This will be called by the Navigator getCurrentPosition() function if the
  // user accepts the request to send the GEO location.
  var geoLocationSuccessCallback = function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      // console.log(latitude,longitude);
      machineSecret.asynchronousAttributeSet(
          attribute,
          "" + latitude + "," + longitude
      );
  };

  // This will be called by the Navigator getCurrentPosition() function if the
  // user accepts the refuses to send the GEO location.
  var geoLocationErrorCallback = function(error) {
      machineSecret.asynchronousAttributeFail(
      attribute,
      "GEO location callback failed " +
      "[code=" + error.code + "] [message=" + error.message + "]");
  }

  // This triggers the browser to pop-up a user-request for GEO location.
  // Note: this call returns immediately and the callbacks will receive the
  // user response.
  navigator.geolocation.getCurrentPosition(geoLocationSuccessCallback,geoLocationErrorCallback);
}
function validateForm() {
  let user = $('#userId').val()
  // let confirmation = $('#userMainDevice').is(':checked')
  return (user == "" ||
    user == null)
    ?
    false
    :
    true;
}
function showError(message) {
  $('#submit').hide()
  $('#submitPush').hide()
  $('#submitOTPviaMail').hide()
  $("#userId").prop('disabled', true);
  $("#userMainDevice").prop('disabled', true);
  $('#loading').hide()
  $('#errorMessageContainer').show()
  $('#errorMessage').text(message)
}
function showSuccess(message) {
  $('#submit').hide()
  $('#submitPush').hide()
  $('#submitOTPviaMail').hide()
  $('#sendOtpViaSms').hide()
  $("#userId").prop('disabled', true);
  $("#userMainDevice").prop('disabled', true);
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $('#successMessageContainer').show()
  $('#backButtonContainer').show();
  $('#successMessage').text(message)
}
function habilitateButton() {
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $('#submit').show()
  $('#submitPush').show()
  $('#submitOTPviaMail').show()
  $('#sendOtpViaSms').show()
  $("#userId").prop('disabled', false);
  $('#submit').prop('disabled', false);
  $('#submitPush').prop('disabled', false);
  $('#submitOTPviaMail').prop('disabled', false);
  $('#sendOtpViaSms').prop('disabled', false);
  $("#userMainDevice").prop('disabled', false);
}
function unableButton() {
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $("#userId").prop('disabled', false);
  $("#userMainDevice").prop('disabled', false);
  $('#submit').prop('disabled', true);
  $('#submitPush').prop('disabled', true);
  $('#submitOTPviaMail').prop('disabled', true);
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
async function getToken() {
  const url = `${URL_BASE}v1/adminapi/authenticate`
  const payload = {
    "applicationId": ADMIN_APPLICATION_ID_DEV,
    "enableWebSession": false,
    "sharedSecret": SECRET
  }

  var result = null
  try {

    var request = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(payload),
      dataType: "json"
    });
    console.log(request);


    result = `Bearer ${request.authToken}`
  } catch (error) {

    console.error(error);
    return null;
  }

  return result;
}
async function fetchUser(token) {
  const url = `${URL_BASE}v3/users/userid`
  const payload = {
    "userId": $('#userId').val()
  }

  var result = null
  try {

    result = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      dataType: "json",
      headers: {
        'Authorization': token
      }
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  return result;

}
async function fetchMachines(userId, token) {
  const url = `${URL_BASE}v1/users/${userId}/machines`

  var result = null
  try {

    result = await $.ajax({
      url: url,
      crossDomain: true,
      method: "GET",
      contentType: 'application/json; charset=utf-8',
      dataType: "json",
      headers: {
        'Authorization': token
      }
    });
    console.log("fetchMachines: ",result);
  } catch (error) {
    console.error(error);
  }

  return result;

}
async function createMachine(userId,fingerPrintDevice,label, token) {
  const url = `${URL_BASE}v1/users/${userId}/machines`
  const payload = {
    "fingerprint": fingerPrintDevice,
    "label": label
  }
  console.log(payload);

  var result = null
  try {

    result = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      dataType: "json",
      headers: {
        'Authorization': token
      }
    });
    console.log("result createMachine",result);
  } catch (error) {
    console.error(error);
  }

  return result;

}
async function getUserAuthenticators(machineNonce,sequenceNonce,fingerPrintDevice){
  console.log("machineNonce:",machineNonce);
  console.log("sequenceNonce:",sequenceNonce);
  const url = `${URL_BASE}v2/authentication/users`
  const payload = {
    "userId": $('#userId').val(),
    "applicationId":API_AUTENTICACION_DEV,
    "machineAuthenticator": {
        "machineNonce": machineNonce,
        "sequenceNonce": sequenceNonce,
        "fingerprint": fingerPrintDevice
    }
  }

  var result = null
  try {
    result = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      dataType: "json"
    });
    console.log("getUserAuthenticators() result: ",result);
  } catch (error) {
    console.error("error: ",error);
    if(error.status === 403){
      return {
        result: false,
        status: 403,
        message: ErrorAccessDenied
      }
    }
  }
  return result;
}
async function sendPushNotification(){
  // Send Entrust PUSH Notification 
  const url = `${URL_BASE}v2/authentication/users/authenticate/TOKENPUSH`
  const payload = {
    "userId": $('#userId').val(),
    "applicationId": API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES,
    "transactionDetails": [
      {
          "detail": "Tipo de Transacción",
          "value": "Alto Riesgo"
      },
      {
          "detail": "Usuario",
          "value": $('#userId').val()
      },
      {
          "detail": "Descripción",
          "value": "Aceptar la solicitud de acceso al sistema _________"
      }
    ]
  }

  var result = null
  try {
    var request = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(payload),
      dataType: "json"
    });
    console.log(request);
    result = `Bearer ${request.token}`
  } catch (error) {
    console.error(error);
    return null;
  }
  return result;
}
async function completePushNotification(pushToken){
  // complete Entrust PUSH Notification 
  const url = `${URL_BASE}v1/authentication/users/authenticate/TOKENPUSH/complete`
  const payload = {
    "applicationId": API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES
  }

  var result = null
  try {
    var result = await $.ajax({
      url: url,
      crossDomain: true,
      method: "POST",
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(payload),
      dataType: "json",
      headers: {
        'Authorization': pushToken
      }
    });
    console.log(result.status);
  } catch (error) {
    console.error(error);
    return null;
  }
  return result.status;
}
// Create and Send OTP via the input param $method and decide if OTP is returned or sent via Entrust native system using the $deliverotp param
async function createsAndSendOtp(token, method, deliverotp){
    const url = `${URL_BASE}v1/otps`
    const payload = {
      "applicationId": API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES,
      "deliverOTP": deliverotp,
      "otpDeliveryType": method,
      "userId": $('#userId').val()
    }
    var result = null
    try {
      var result = await $.ajax({
        url: url,
        crossDomain: true,
        method: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        dataType: "json",
        headers: {
          'Authorization': token
        }
      });
      console.log(result);
    } catch (error) {
      console.error(error);
      return null;
    }
    return result;
}





