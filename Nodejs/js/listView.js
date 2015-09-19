var tableInfo;

function changeColumns() {
	tableInfo.fields = [];

	$("#columnsId a.active").each(function(index, value) {
		tableInfo.fields.push($(value).text());
	});

	displayTable(tableInfo);
}

function displayTable(data) {
	console.log(data);
	var headers = [];
	for (var i = 0; i < data.fields.length; i++) {
		headers.push('<th>' + data.fields[i] + '</th>');
	}

	var rows = [];
	for (var i = 0; i < data.items.length; i++) {
		rows.push('<tr>');
		$.each(data.fields, function(index, value) {
			rows.push(
				'<td>' +
				((data.items[i][value] !== undefined && data.items[i][value] !== 'undefined')
					? data.items[i][value]
					: ''
				) +
				'</td>');
		});
		rows.push('</tr>');
	}

	if (rows.length === 0) {
		rows.push('<tr><td colspan="' + headers.length + '">' + $(select).text() + ' is empty.</td></tr>');
	}
	$("#listViewTableId").html($([
		'<thead>',
		'<tr>',
			headers,
		'</tr>',
		'</thead>',
		'<tbody>',
			rows,
		'</tbody>'
	].join("")));

	$('#listViewTableId').DataTable();
}

function selectTable(select) {
	$('#dropdownButtonId').html($(select).text() + '&nbsp;<span class="caret"></span>');

	$.get("/ajaxListView?name=" + $(select).text(), function( data ) {
		tableInfo = data;
		displayTable(data);

		var columns = [];
		$.each(data.fields, function(index, value) {
			columns.push(
				'<a href="#" class="list-group-item active">' + value + '</a>'
			);
		});

		$("#columnsId").html(columns.join(""));

		$("#columnsId a").click(function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			}
			else {
				$(this).addClass('active');
			}
		});

		$('#listViewTableId').DataTable();

		document.title = $(select).text();
	})
	.fail(function(data) {
		console.log(JSON.parse(data.responseText).message);
	});
}

$(document).ready(function() {
	$('#demo').BootSideMenu({
		side:"left", // left or right
		autoClose:true // auto close when page loads
	});

	$('#tabs').tab();
	var parts = location.search.substring(1).split('&');
	var parameters = {};

	for (var i = 0; i < parts.length; i++) {
		var param = parts[i].split('=');
		parameters[param[0]] = param[1];
	}
	console.log("parameters=",parameters);

	$.get("/ajaxListTables", function( data ) {
		var tables = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].indexOf('sqlite') === -1) {
				tables.push('<a href="#" class="list-group-item" onclick="selectTable(this); return false;">' + data[i] + '</a>');
				//tables.push('<li><a href="#" onclick="selectTable(this); return false;">' + data[i] + '</a></li>');
			}
		}

		$("#tablesId").append(tables.join(""));
		$("#tablesId").append('<a href="#" class="list-group-item" style="text-align: center;font-size: 22px;padding: 0px 0px;" onclick="alert(\'add table\'); return false;">+</a>');

		var firstItem = $("#tablesId").find("a:first-child");
		$(firstItem).addClass('active');

		selectTable(firstItem);
	});
});