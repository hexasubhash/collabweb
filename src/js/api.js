var request = require('libs').request;
var apiUrl = "/collab/";

function getUserMessages() {
	return request.get(apiUrl + "member_messages/get_new_messages");
}

function getUserLiterature() {
	return request.get(apiUrl + "literature/selected").send();
}

function getUserProjects() {
	return request.get(apiUrl + "projects/getAll").send();
}

function getContactFormModel() {
	return request.get(apiUrl + "contact_form/get").send();
}

function getEarFormModel() {
	return request.get(apiUrl + "ear_form/get").send();
}

function getRegWizardModel() {
	return request.get(apiUrl + "registration/get").send();
}

function getAllUserMessages() {
	return request.get(apiUrl + "member_messages/get_all_messages").send();
}

function getUserProfile() {
	return request.get(apiUrl + "user_profile/selected");
}

function getRegistrationModel() {
	return request.get(apiUrl + "registration/get");
}

function getUserInfo() {
	return request.get(apiUrl + "user/user_info");
}

function getSSCTerms() {
	return request.get(apiUrl + "terms/check").send();
}

function sendQuickMessage (message) {
	return request.post(apiUrl + "quickMessage/sendMessage")
		.send({message: message})
		.type('form');
}

function prepareUserApplication() {
	return request.post(apiUrl + "applications/selected").send({applications : JSON.stringify(applications)}).type('form');
}

function addAppToUser(appId) {
	return request.put(apiUrl + "applications/addAppToUser").send({applicationId : appId}).type('form');
}

function setSSCTems(checked) {
	return request.put(apiUrl + "terms/set").send({checked : checked}).type('form');
}

function removeAppFromUser(appId) {
	return request.del(apiUrl + "applications/removeAppFromUser").send({applicationId : appId}).type('form');
}

function removeLiteratureFromUser(docId) {
	return request.del(apiUrl + "literature/removeLiteratureFromUser").send({documentId : docId}).type('form');
}

function resetCaptcha() {
	return request.post(apiUrl + "contact_form/reset_captcha").send();
}

function deleteUserProfile(userProfileModel) {
	return request.post(apiUrl + "user_profile/delete").send({userProfileModel : userProfileModel}).type('form');
}

function saveContactFormModel(contactFormModel, additionalRegModel, status) {
	return request.post(apiUrl + "contact_form/save").
		send({contactFormModel : contactFormModel, additionalRegModel : additionalRegModel, status : status})
		.type('form');
}

function saveEarModel(earFormModel) {
	return request.post(apiUrl + "ear_form/save").send({earFormModel : earFormModel}).type('form');
}

function saveUserProfileModel(userProfileModel) {
	return request.post(apiUrl + "user_profile/save").send({userProfileModel : userProfileModel}).type('form');
}

function removeMessageById(messageId) {
	return request.post(apiUrl + "member_messages/del_message").send({messageId: messageId}).type('form');
}

function login(username, password) {
	return request.post(apiUrl + "user/login").send({username: username, password: password}).type('form');
}

function logout(username, password) {
	return request.post(apiUrl + "user/logout").send();
}

function deleteAllUserMessages() {
	return request.post(apiUrl + "member_messages/del_all_messages").send();
}

function resetPassword(model) {
	return request.post(apiUrl + "reset/reset_password").send({model: model}).type('form');
}

function updatePassword(model) {
	return request.post(apiUrl + "reset/update_password").send({model: model}).type('form');
}

function markMessageAsViewed(messageId) {
	return request.post(apiUrl + "member_messages/message_opend").send({messageId: messageId}).type('form');
}

function fetchCities() {
	console.log(apiUrl + "/adminregister/fetchcities");
	console.log('SUBHASHHHHH');
	return request.get(apiUrl + "/adminregister/fetchcities").send();
}


function saveRegistrationFormModel(registrationModel) {
	return request.post(apiUrl + "adminregister/saveadminuser").
		send({registrationModel : registrationModel}).type('form');
}




module.exports = {
	fetchCities : fetchCities,
	sendQuickMessage : sendQuickMessage,
	prepareUserApplication : prepareUserApplication,
	getUserMessages : getUserMessages,
	addAppToUser : addAppToUser,
	removeAppFromUser: removeAppFromUser,
	getUserLiterature: getUserLiterature,
	removeLiteratureFromUser: removeLiteratureFromUser,
	getUserProjects : getUserProjects,
	getAllUserMessages : getAllUserMessages,
	getContactFormModel : getContactFormModel,
	saveContactFormModel : saveContactFormModel,
	resetCaptcha : resetCaptcha,
	getUserProfile : getUserProfile,
	saveUserProfileModel : saveUserProfileModel,
	removeMessageById : removeMessageById,
	getRegistrationModel : getRegistrationModel,
	getUserInfo : getUserInfo,
	login : login,
	logout : logout,
	deleteUserProfile : deleteUserProfile,
	getRegWizardModel : getRegWizardModel,
	saveRegistrationFormModel : saveRegistrationFormModel,
	deleteAllUserMessages : deleteAllUserMessages,
	resetPassword : resetPassword,
	getSSCTerms : getSSCTerms,
	setSSCTems : setSSCTems,
	updatePassword : updatePassword,
	saveEarModel : saveEarModel,
	markMessageAsViewed : markMessageAsViewed,
	getEarFormModel : getEarFormModel
}
