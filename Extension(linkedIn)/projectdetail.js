function getURLParameter(url, name) {
	return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

$(document).ready(function() {
	var projectKey = decodeURIComponent(getURLParameter(window.location.href, 'key'));
	var projectName = decodeURIComponent(getURLParameter(window.location.href, 'name'));

	$("#detail").find("div").append($([
		'<span>',
			projectName,
		'</span>',
		'<span>',
			projectKey,
		'</span>'].join(" ")));

	chrome.cookies.getAll({},function (cookie) {
		var result = [];
		var params = '';
		for (var i = 0; i < cookie.length; i++) {
			result.push({"name": cookie[i].name, "value": cookie[i].value});
			params += ';' + cookie[i].name + '=' + cookie[i].value;
		}

		params = params.substring(1);

		$.ajax({
			url: 'https://toolchain.logicline.de/jira/browse/' + projectKey + '-1?jql=project%20%3D%20' + projectKey,
			method: 'GET',
			headers: {
				'Cookie': params
			},
			success: function(data) {
				var resultJSON = $.parseJSON($(data).find("div.navigator-content").attr("data-issue-table-model-state"));
				//console.log(resultJSON);
				//console.log(resultJSON.issueTable.issueKeys);
				//console.log(resultJSON.issueTable.issueIds);

				var tasks = [];
				var todayIssues = {};
				var yesterdatIssues = {};
				var weekIssues = {};

				$.each(resultJSON.issueTable.issueKeys, function(index, value) {
					$.ajax({
						url: 'https://toolchain.logicline.de/jira/browse/' + value,
						method: 'GET',
						headers: {
							'Cookie': params
						},
						success: function(issuePage) {
							var dateUpdate = $(issuePage).find('#datesmodule').find('.item-details').find('.dates').eq(1).find('dd').attr('title');
							//console.log(dateUpdate);
							var issueDate = new Date(dateUpdate);

							var estimate = $.trim($(issuePage).find('#tt_single_values_orig').html());
							estimate = calcTime(estimate);
							//console.log('estimate=', estimate);

							var log = $.trim($(issuePage).find('#tt_single_values_spent').html());
							log = calcTime(log);
							//console.log('logged=', log);

							var progress = 0;
							var status = '';

							if (log <= estimate) {
								if (estimate != 0) {
									status = 'fine';
									progress = parseInt(log * 100 / estimate);
								}
								else {
									progress = 100;
									status = 'does not logged';
								}
							}
							else if (log > estimate) {
								if (estimate == 0) {
									status = 'logged without estimate'
								}
								else {
									progress = parseInt(estimate * 100 / log);
									status = 'danger';

									console.log("issue=",value);
									console.log("progress=",progress);
									console.log("estimate=",estimate);
									console.log("log=",log);
								}
							}
							var d = new Date();
							var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
							//d.setDate(d.getDate() - 3);
							var diffDays = Math.round(Math.abs((issueDate.getTime() - d.getTime())/(oneDay)));
							if (diffDays == 0) {
								displayIssues(value, progress, log, estimate, status, 'todayIssues');
							}
							else if (diffDays == 1) {
								displayIssues(value, progress, log, estimate, status, 'yesterdayIssues');
							}
							else if (diffDays < 7) {
								displayIssues(value, progress, log, estimate, status, 'tasks');
							}
						}
					});
				});
			}
		});
	});
});

function calcTime(time) {
	var result = 0;
	$.each(time.split(' '), function(index, value) {
		//console.log(value);
		if (value.length > 3) {
			return 0;
		} else if (value.indexOf('w') != -1) {
			result += parseInt(value.match('/\d+/')[0]) * 40;
		}
		else if (value.indexOf('d') != -1) {
			result += parseInt(value.match(/\d+/)[0]) * 8;
		}
		else if (value.indexOf('h') != -1) {
			result += parseInt(value.match(/\d+/)[0]);
		}
		else if (value.indexOf('m') != -1) {
			result += parseInt(value.match(/\d+/)[0]) / 60;
		}
	});

	return result;
}

function displayIssues(value, progress, log, estimate, status, issueTag) {
	if (status == 'does not logged') {
		$("#" + issueTag).append($([
			'<a href="#" class="list-group-item" id="' + value + '">',
				value,
				'<div class="progress">',
					'<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">(Doesn\'t have any logs)</div>',
				'</div>',
			'</a>'].join(' ')
		));
	}
	else if (status == 'logged without estimate') {
		$("#" + issueTag).append($([
			'<a href="#" class="list-group-item" id="' + value + '">',
				value,
				'<div class="progress">',
					'<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">(' + log + 'h)</div>',
				'</div>',
			'</a>'].join(' ')
		));
	}
	else if (status == 'fine') {
		$("#" + issueTag).append($([
			'<a href="#" class="list-group-item" id="' + value + '">',
				value,
				'<div class="progress">',
					'<div class="progress-bar progress-bar-info" role="progressbar" style="width:' + progress + '%">(' + estimate + 'h)</div>',
					'<div class="progress-bar progress-bar-success" role="progressbar" style="width:' + (100 - progress) + '%">(' + (estimate - log) + 'h)</div>',
				'</div>',
			'</a>'].join(' ')
		));
	}
	else if (status == 'danger') {
		$("#" + issueTag).append($([
			'<a href="#" class="list-group-item" id="' + value + '">',
				value,
				'<div class="progress">',
					'<div class="progress-bar progress-bar-success" role="progressbar" style="width:' + progress + '%">(' + estimate + 'h)</div>',
					'<div class="progress-bar progress-bar-danger" role="progressbar" style="width:' + (100 - progress) + '%">(' + (log - estimate) + 'h)</div>',
				'</div>',
			'</a>'].join(' ')
		));
	}
}


// get worklogs
/*$.ajax({
	url: 'https://toolchain.logicline.de/jira/browse/' + value + '?page=com.atlassian.jira.plugin.system.issuetabpanels:worklog-tabpanel',
	method: 'GET',
	headers: {
		'Cookie': params
	},
	success: function(issuePage) {
		//console.log(issuePage);

		var workLogs = $(issuePage).find('.issuePanelWrapper').find('.issue-data-block');
		$.each(workLogs, function(index, value) {
			var name = $(value).find('.action-details').find('a').attr('rel');
			var date = $(value).find('.action-details').find('span.date').html();

			var spent = $(value).find('.action-body').find('dd.worklog-duration').html();
			var description = $(value).find('.action-body').find('dd.worklog-comment').find('p').html();

			console.log("name=",name);
			console.log("date=",date);
			console.log("spent=",spent);
			console.log("description=",description);
		});


		console.log('estimate =',$.trim($(issuePage).find('#tt_single_values_orig').html()));
		console.log('logged =',$.trim($(issuePage).find('#tt_single_values_spent').html()));
	}
});*/