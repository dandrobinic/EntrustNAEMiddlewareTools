const ErrorFormFields = "Error campos obligatorios"
const ErrorUserNotFound = "Error usuario no existe"
const ErrorMachineExists = "Error ya tiene dispositivos"
const successMessage = "Se ha guardado el dispositivo correctamente"
var userAndDeviceValidated = false;
var otpToken = '';
var userInfoUUID = '';
const URL_BASE = "https://claro.us.trustedauth.com/api/web/"
// const APPLICATION_ID = "a7f87d22-b5c6-4597-8753-407c9c7d5dfd"
const APPLICATION_ID_DEV = "a7f87d22-b5c6-4597-8753-407c9c7d5dfd"
const SECRET = "R0cEFkU452RU4L71Siv_HcBszTJi2ccBehcbbE2MDhM"

// const ADMIN_APPLICATION_ID_DEV = "a7f87d22-b5c6-4597-8753-407c9c7d5dfd" // API deAdministración Dev
// const SECRET = "R0cEFkU452RU4L71Siv_HcBszTJi2ccBehcbbE2MDhM" // Shared Secret Key
const API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES = "8fce9f63-7138-401b-b655-e4673197f09f" // API de Autenticación Global (No Resource Rules)
const API_AUTENTICACION_DEV = "62e2493a-127a-478e-aec6-5978efd4045f"  // API de Autenticación Dev Geo and Machine 

$(document).ready(() => {
  /*var $machineNonce = $("#machineNonce");
  var $sequenceNonce = $("#sequenceNonce");*/
  var swfUrl = "./js/FlashLocalStore.swf"

  /*if ($machineNonce.length || $sequenceNonce.length) {
    machineSecret.setDebugOn(true);
    machineSecret.setStorageTypeExclusions('flash');
    if ($machineNonce.length) {
      machineSecret.storeMachineNonce($machineNonce.val());
    }
    if ($sequenceNonce.length) {
      machineSecret.storeSequenceNonce($sequenceNonce.val());
    }
  }*/

  machineSecret.setDebugOn(true).setStorageTypeOptions({swfUrl: swfUrl}
    ).initializeFlash(function fetchNonces(flashInitialized) {

      console.log(flashInitialized);
      var machineNonce = machineSecret.fetchMachineNonce();
      var sequenceNonce = machineSecret.fetchSequenceNonce();
      
      if (machineNonce)  $("#machineNonce").val(machineNonce);
      if (sequenceNonce) $("#sequenceNonce").val(sequenceNonce);
    })
    
})
var onloadCallback = function() {
  unableButton();
  grecaptcha.render('html_element', {
    'sitekey' : '6LeUPuUgAAAAAEFiJrzS62jFdUM2V5j8hzdK9x0Z',
    'callback' : validateRecaptcha,
  });
};
function validateRecaptcha (response){
  console.log(response);
  if(!userAndDeviceValidated)
    habilitateButton()
}
async function onSubmit() {

  $('#submit').hide()
  //$('#loading').show()
  var validate = validateForm();

  if (!validate) {
    showError(ErrorFormFields)
    setTimeout(habilitateButton, 3000)
    return false
  }

  showLoading();
  
  const token = await getToken();
  if (token == null) {
    hideLoading();
    showError("Hubo un error al autenticarse") 
    setTimeout(habilitateButton, 3000)
    return false
  }

  const userInfo = await fetchUser(token);
  userInfoUUID = userInfo.id
  if (userInfo == null || (userInfo != null && userInfo.errorCode != null) || userInfo.id == null) {
    hideLoading();
    showError(ErrorUserNotFound)
    setTimeout(habilitateButton, 3000)
    return false
  }

  const machines = await fetchMachines(userInfo.id, token);
  if (machines == null || machines.length > 0) {
    hideLoading();
    showError(ErrorMachineExists)
    setTimeout(habilitateButton, 3000)
    return false
  }

  // Create and Send OTP as MFA to user registered device in Entrust   
  const createsAndSendOtpResp = await createsAndSendOtp(token, "SMS", true);
  console.log("createsAndSendOtpResp: ",createsAndSendOtpResp);
  
  if (createsAndSendOtpResp == null || (createsAndSendOtpResp != null && createsAndSendOtpResp.errorCode != null)) {
    hideLoading();
    showError("Hubo un error al crear y enviar el OTP via SMS")
    setTimeout(habilitateButton, 3000)
    return false
  }
  console.log("OTP enviado satisfactoriamente via SMS");
  userAndDeviceValidated = true;
  otpToken = createsAndSendOtpResp.token;
  hideLoading();
  // OTP has been created and now is time for the user to introduce the code and send for validation
  showOtpInputFields();
  return {"otpToken":otpToken,"userInfoId": userInfo.id};
}
async function onSubmitOtp() {
  
  showLoading();
  // Complete OTP as MFA to user registered device in Entrust
  const completeOtpValidationResp = await completeOtpValidation(otpToken);
  if (completeOtpValidationResp == null && completeOtpValidationResp != "") {
    showError("Hubo un error validando y completando el OTP enviado")
    setTimeout(habilitateButton, 3000)
    return false
  }
  
  console.log("OTP validado satisfactoriamente");
  console.log("completeOtpValidationResp: ",completeOtpValidationResp);
  
  var fingerPrint = machineSecret.getDeviceFingerprint();
  if (fingerPrint == null && fingerPrint != "") {
    showError("Hubo un error consultando el fingerprint del dispositivo")
    setTimeout(habilitateButton, 3000)
    return false;
  }

  var fingerPrintJson = JSON.parse(fingerPrint);

  var today = new Date()
  var dateString = today.toISOString().replace(/[-T:.Z]/g, '')
  const label = `${fingerPrintJson.platform} ${fingerPrintJson.attributes.osName} ${dateString}`
  
  const token = await getToken();
  if (token == null) {
    hideLoading();
    showError("Hubo un error al autenticarse") 
    setTimeout(habilitateButton, 3000)
    return false
  }

  const machineCreate = await createMachine(userInfoUUID, fingerPrint, label, token);
  
  if (machineCreate == null || (machineCreate != null && machineCreate.machineAuthenticator == null) || (machineCreate != null && machineCreate.machineAuthenticator != null && machineCreate.machineAuthenticator.machineNonce == null)) {
    showError("Hubo un error al registrar el dispositivo")
    setTimeout(habilitateButton, 3000)
    return false
  }

  //setCookie("machineNonce", machineCreate.machineAuthenticator.machineNonce, 365);
  //setCookie("sequenceNonce", machineCreate.machineAuthenticator.sequenceNonce, 365);

  machineSecret.storeMachineNonce(machineCreate.machineAuthenticator.machineNonce);  
  machineSecret.storeSequenceNonce(machineCreate.machineAuthenticator.sequenceNonce);  
  hideLoading();
  // showUserInputFields()
  // resetAllInputFileds();
  showSuccess(successMessage)
  // setTimeout(() => {
  //   document.location.reload();
  // }, 3000);
}
function validateForm() {
  let user = $('#userId').val()
  let confirmation = $('#userMainDevice').is(':checked')
  return (user == "" ||
    user == null ||
    confirmation == null ||
    !confirmation)
    ?
    false
    :
    true;

}
function showLoading(duration){
  $('#loader').show(duration)
}
function hideLoading(duration){
  $('#loader').hide(duration)
}
function showOtpInputFields(message) {
  $('#userId').hide();
  $('#userMainDevice').hide();
  $('#userMainDeviceLabel').hide();
  $('#userTitle').hide();
  $("#userId").prop('disabled', true);
  $('#otpcodeTitle').show();
  $('#otpcode').show();
  $('#submitOtp').show();
}
function showUserInputFields(message) {
  $('#userId').show();
  $('#userMainDevice').show(); 
  $('#userMainDeviceLabel').show();
  $('#userTitle').show();
  $('#otpcodeTitle').hide();
  $('#otpcode').hide();
  $("#otpcode").prop('disabled', true);
}
function showError(message) {
  $('#submit').hide()
  $("#userId").prop('disabled', true);
  $("#userMainDevice").prop('disabled', true);
  $('#loading').hide()
  $('#errorMessageContainer').show()
  $('#errorMessage').text(message)
}
function showSuccess(message) {
  $('#submit').hide()
  $("#userId").prop('disabled', true);
  $("#userMainDevice").prop('disabled', true);
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $('#successMessageContainer').show()
  $('#successMessage').text(message)
}
function habilitateOtpButton() {
  $('#errorMessageContainer').hide()
  $('#submitOtp').show()
}
function habilitateButton() {
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $('#submit').show()
  $("#userId").prop('disabled', false);
  $('#submit').prop('disabled', false);
  $("#userMainDevice").prop('disabled', false);
}
function resetAllInputFileds() {
  document.getElementById('userId').value = '';
  document.getElementById('otpcode').value = '';
  document.getElementById('userMainDevice').checked = false;
  $("#userId").prop('disabled', false);
  $("#userMainDevice").prop('disabled', false);
}

function unableButton() {
  $('#loading').hide()
  $('#errorMessageContainer').hide()
  $("#userId").prop('disabled', false);
  $("#userMainDevice").prop('disabled', false);
  $('#submit').prop('disabled', true);
}
async function getToken() {
  const url = `${URL_BASE}v1/adminapi/authenticate`
  const payload = {
    "applicationId": APPLICATION_ID_DEV,
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
    console.log("Cant. de maquinas registradas: ",result);
  } catch (error) {
    console.error(error);
  }

  return result;

}
async function createMachine(userId, fingerPrint, label, token) {
  const url = `${URL_BASE}v1/users/${userId}/machines`
  const payload = {
    "fingerprint": fingerPrint,
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
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  return result;

}
// Create and Send OTP via the input param $method and decide if OTP is returned or sent via Entrust native system
async function createsAndSendOtp(token, method, deliverotp){
  //Via Entrust
  if (deliverotp) {
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
      // console.log(result);
    } catch (error) {
      console.error(error);
      return null;
    }
    return result; 
  } else {
    // Via PCA
    const url = `${URL_BASE}v1/otps`
    const payload = {
      "applicationId": API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES,
      "returnOTP": true,
      "deliverOTP": false,
      "otpDeliveryType": method,
      "userId": $('#userId').val()
    }
    var otpResult = null
    try {
      var otpResult = await $.ajax({
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
      console.log("otpResult: ",otpResult);
    } catch (error) {
      console.error(error);
      return null;
    }
    return otpResult; 
  }
}
// Validate and Complete OTP authentication challenge
async function completeOtpValidation(token){
  const url = `${URL_BASE}v1/authentication/users/authenticate/OTP/complete`
  const payload = {
    "applicationId": API_AUTENTICACION_GLOBAL_NO_RESOURCE_RULES,
    "response": $('#otpcode').val()
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
//********** EXTRA FUNCTIONS *********// 
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


