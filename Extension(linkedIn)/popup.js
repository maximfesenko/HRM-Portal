var fullName, employeeType, currentCompany, employeeLocation, industry, listOfJobs, email, skills, profile;

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
	fullName = $(request.source).find('span.full-name').html();
	employeeType = $(request.source).find('#headline-container').find('p.title').text();
	currentCompany = $(request.source).find('#overview-summary-current li span a').html();
	employeeLocation = $(request.source).find('div#location-container').find('span.locality a').html();
	industry = $(request.source).find('div#location-container').find('dd.industry a').html();
	listOfJobs = [];

	$.each($(request.source).find('tr#overview-summary-past').find('li span a'), function(index, value) {
		listOfJobs.push($(value).html());
	});

	email = $(request.source).find('#contact-info-section').find('#email li a').html();
	skills = [];

	$.each($(request.source).find('#profile-skills li'), function(index, value) {
		if ($(value).attr('data-endorsed-item-name') != undefined) {
			skills.push($(value).attr('data-endorsed-item-name'));
		}
	});

	profile = $(request.source).find('#contact-public-url li a').html();

	message.innerText = 'full name: ' + fullName + '\n';
	message.innerText += 'employeeType: ' + employeeType + '\n';
	message.innerText += 'currentCompany: ' + currentCompany + '\n';
	message.innerText += 'employeeLocation: ' + employeeLocation + '\n';
	message.innerText += 'industry: ' + industry + '\n';
	message.innerText += 'listOfJobs: ' + listOfJobs.join(', ') + '\n';
	message.innerText += 'email: ' + email + '\n';
	message.innerText += 'skills: ' + skills.join(', ') + '\n';
	message.innerText += 'profile: ' + profile + '\n';
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
	file: "getPagesSource.js"
  }, function() {
	// If you try and inject into an extensions page or the webstore/NTP you'll get an error
	if (chrome.runtime.lastError) {
	  message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
	}
  });

}

$(document).ready(function() {
  onWindowLoad();

  $('#sendId').click(function() {
	  $.ajax({
		url: 'http://127.0.0.1:8888/addcandidate',
		method: 'POST',
		data: {
			name: fullName,
			employeeType: employeeType,
			currentCompany: currentCompany,
			employeeLocation: employeeLocation,
			industry: industry,
			listOfJobs: listOfJobs.join(', '),
			email: email,
			skills: skills.join(', '),
			profile: profile
		},
		success: function(data) {
		 	alert(data);
		}
	  });
	});
});