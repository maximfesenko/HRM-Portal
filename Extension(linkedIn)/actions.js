function getProjects() {
	chrome.cookies.getAll({},function (cookie) {
		var result = [];
		var params = '';
		for (var i = 0; i < cookie.length; i++) {
			result.push({"name": cookie[i].name, "value": cookie[i].value});
			params += ';' + cookie[i].name + '=' + cookie[i].value;
		}

		params = params.substring(1);
		$.ajax({
			url: 'https://toolchain.logicline.de/jira/secure/BrowseProjects.jspa?selectedCategory=all',
			method: 'GET',
			headers: {
				'Cookie': params
			},
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function(data) {
				//console.log(data);
				var startIndex = data.indexOf('com.atlassian.jira.project.browse:projects') + 'com.atlassian.jira.project.browse:projects"]="'.length;

				var projectsLogiLine = data.substring(startIndex, data.indexOf(';', startIndex) - 1);
				projectsLogiLine = projectsLogiLine.split("\\\"").join("\"").split("\\\"").join("\"");

				var projects = [];
				$.each($.parseJSON(projectsLogiLine), function(index, value) {
					var name = value.name;
					var key = value.key;

					projects.push('<a href="/projectdetail.html?key=' + key + '&name=' + name + '" class="list-group-item" id="' + key + '">' + name + '</a>');

					/*var countOpenIssues = -1;
					var countReopenIssues = -1;
					var countInProgressIssues = -1;
					var countClosedIssues = -1;
					var countResolvedIssues = -1;*/

					var issues = {};

					/*//Open issues
					requestIssue(issues, params, 'open', key, name);

					//Reopened issues
					requestIssue(issues, params, 'reopened', key, name);

					//InProgress issues
					requestIssue(issues, params, 'inprogress', key, name);

					//Resolved issues
					requestIssue(issues, params, 'resolved', key, name);

					//Closed issues
					requestIssue(issues, params, 'closed', key, name);*/

					//Open issues
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + key + '-1?jql=project%20%3D%20' + key + '%20and%20status%20%3D%20Open',
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(projectData) {
							addProjectProgress(issues, 'open', projectData, key, name);
						}
					});

					//Reopened issues
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + key + '-1?jql=project%20%3D%20' + key + '%20and%20status%20%3D%20Reopened',
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(projectData) {
							addProjectProgress(issues, 'reopened', projectData, key, name);
						}
					});

					//InProgress issues
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + key + '-1?jql=project%20%3D%20' + key + '%20and%20status%20%3D%20"In%20Progress"',
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(projectData) {
							addProjectProgress(issues, 'inprogress', projectData, key, name);
						}
					});

					//Closed issues
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + key + '-1?jql=project%20%3D%20' + key + '%20and%20status%20%3D%20Closed',
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(projectData) {
							addProjectProgress(issues, 'closed', projectData, key, name);
						}
					});

					//Resolved issues
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + key + '-1?jql=project%20%3D%20' + key + '%20and%20status%20%3D%20Resolved',
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(projectData) {
							addProjectProgress(issues, 'resolved', projectData, key, name);
						}
					});
				});

				$("#projectsArea").append(projects.join(" "));


			},
			fail: function(data) {
				console.log("fail: ",data);
			}
		});
	});
}

function addProjectProgress(result, issueType, data, projectKey, projectName) {
	var projectIssues = $(data).find("div.navigator-content").attr("data-issue-table-model-state");

	if (projectIssues.indexOf("\&quot;")) {
		projectIssues = projectIssues.split("\&quot;").join("\"");
	}
	projectIssues = $.parseJSON(projectIssues);

	console.log("after projectIssues=",projectIssues);

	result[issueType] = projectIssues.issueTable.end;

	console.log(projectKey,"-",issueType,"=",projectIssues.issueTable.end);

	if (Object.keys(result).length == 5) {
		var countAllIssues = result.closed + result.resolved + result.inprogress + result.reopened + result.open;

		var openProgress = parseInt(((result.reopened + result.open) / countAllIssues) * 100);
		var inProgress = parseInt((result.inprogress / countAllIssues) * 100);
		var closedProgress = 100 - openProgress - inProgress;

		$("a#" + projectKey).append($([
			'<div class="progress">',
				'<div class="progress-bar progress-bar-success" role="progressbar" style="width:' + openProgress + '%">Open</div>',
				'<div class="progress-bar progress-bar-warning" role="progressbar" style="width:' + inProgress + '%">In Progress</div>',
				'<div class="progress-bar progress-bar-danger" role="progressbar" style="width:' + closedProgress + '%">Done</div>',
			'</div>'].join(" ")
		));

		/*$("a#" + projectKey).append('<span class="badge">closed: ' + result.closed + '</span>');
		$("a#" + projectKey).append('<span class="badge">resolved: ' + result.resolved + '</span>');
		$("a#" + projectKey).append('<span class="badge">in progress: ' + result.inprogress + '</span>');
		$("a#" + projectKey).append('<span class="badge">reopened: ' + result.reopened + '</span>');
		$("a#" + projectKey).append('<span class="badge">open: ' + result.open + '</span>');*/
	}
}

function requestIssue(resultIssues, cookies, issueType, projectKey, projectName) {
	var urlType = 'Open';

	switch (issueType) {
		case 'open': {
			urlType = 'Open';
		}

		case 'reopened': {
			urlType = 'Reopened';
		}

		case 'inprogress': {
			urlType = '"In%20Progress"';
		}

		case 'resolved': {
			urlType = 'Resolved';
		}

		case 'closed': {
			urlType = 'Closed';
		}
	}

	$.ajax({
		url: 'https://toolchain.logicline.de/jira/browse/' + projectKey + '-1?jql=project%20%3D%20' + projectKey + '%20and%20status%20%3D%20' + urlType,
		method: 'GET',
		headers: {
			'Cookie': cookies
		},
		success: function(projectData) {
			addProjectProgress(resultIssues, issueType, projectData, projectKey, name);
		}
	});
}