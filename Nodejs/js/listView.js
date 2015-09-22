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

function addField() {
	var inputs = $("#modalTable .row").last().find("input");

	if ($(inputs).eq(0).val() !== "" && $(inputs).eq(1).val() !== "") {
		$("#modalTable .row").last().after($([
			'<div class="row">',
				'<div class="col-md-6">',
					'<input type="text" class="form-control" placeholder="Field" />',
				'</div>',
				'<div class="col-md-6">',
					'<input type="text" class="form-control" placeholder="Type" />',
				'</div>',
			'</div>'
		].join("")));
	}
}

function createTable() {
	var rows = $("#modalTable .row");
	var firstInput = $(rows).eq(0).find("input");

	if ($(firstInput).val() === "") {
		$(firstInput).addClass("red-border");
		$(firstInput).removeClass("normal-border");

		return false;
	}
	else {
		$(firstInput).addClass("normal-border");
		$(firstInput).removeClass("red-border");
	}

	for (var i = 1; i < rows.length; i++) {
		var firstInput = $(rows[i]).find("input")[0];
		var secondInput = $(rows[i]).find("input")[1];

		if ($(firstInput).val() === "" && $(firstInput).val() !== "Id") {
			$(firstInput).addClass("red-border");
			$(firstInput).removeClass("normal-border");
		}
		else {
			$(firstInput).addClass("normal-border");
			$(firstInput).removeClass("red-border");
		}

		if ($(secondInput).val() === "" ||
			($(secondInput).val() !== "Integer" &&
			$(secondInput).val() !== "Text")) {

			$(secondInput).addClass("red-border");
			$(secondInput).removeClass("normal-border");

			return false;
		}
		else {
			$(secondInput).addClass("normal-border");
			$(secondInput).removeClass("red-border");
		}
	}

	$("#modalTable").removeClass("in");
	$("#modalTable").css("display", "block");
	$("div.modal-backdrop").removeClass("in");

	return true;
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
		$("#tablesId").append($([
			'<a href="#" class="list-group-item" style="text-align: center;font-size: 22px;padding: 0px 0px;position:fixed;bottom:2px;">',
				'<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#modalTable">',
					'+',
				'</button>',
			'</a>'
		].join("")));

		$("#tablesId a:last-child").css("width", $("#tablesId").css("width"));
		$("#tablesId a:last-child button").css("width", $("#tablesId").css("width"));

		var firstItem = $("#tablesId").find("a:first-child");
		$(firstItem).addClass('active');

		$("button[data-target='#modalTable']").click(function() {
			$("#modalTable .modal-content").html($([
				'<div class="row" >',
					'<div class="col-md-6 col-md-offset-3" align="center">',
						'<input type="text" class="form-control" placeholder="Table Name" />',
					'</div>',
				'</div>',
				'<div class="row">',
					'<div class="col-md-6">',
						'<input type="text" class="form-control" placeholder="Field" />',
					'</div>',

					'<div class="col-md-6">',
						'<input type="text" class="form-control" placeholder="Type" />',
					'</div>',
				'</div>',

				'<div align="center">',
					'<button type="button" class="btn btn-default" onclick="addField(); return false;">Add</button>',
				'</div>',

				'<div class="modal-footer">',
					'<button type="button" class="btn btn-default" onclick="createTable(); return false;">Save</button>',
					'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
				'</div>'
			].join("")));
		});

		selectTable(firstItem);
	});
});