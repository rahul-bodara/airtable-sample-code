var express = require('express');
var bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

app.use('/', express.static('public'));
app.use(cors())
app.listen(process.env.PORT || 3001);
console.log('Server files is running on port: 3001');

var Airtable = require('airtable');

// Set the Airtable configure environment
Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: 'airtable_apikey'
});
var base = Airtable.base('your_airtable_basecode');

/*
	Param[req, res]
	In request param you can pass data payload and record will be added in airtable.
	In response param, you have got the response of airtable.
*/
app.post('/createRecord', bodyParser.json(), async (req, res) => {
	base('Staff vs Software vs RTO').create(req.body, function (err, record) {
		if (err) {
			console.error(err);
			res.json({ "status": false, "status Code": 400, "message": "error while create record", "message": err });
		} else {
			res.json({ "status": true, "statusCode": 200, "message": "record create successfully" });
		}
	});
});

/*
	Param[req, res]
	In request param you can pass deleteRecord Id and record will be removed from airtable of given Id
	In response param, you have got the response of airtable.
*/
app.delete('/deleteRecord/:id', bodyParser.json(), async (req, res) => {
	base('Staff vs Software vs RTO').destroy(req.params.id, function (err, record) {
		if (err) {
			console.error(err);
			res.json({ "status": false, "status Code": 400, "message": "error while delete record", "message": err });
		} else {
			res.json({ "status": true, "statusCode": 200, "message": "record delete successfully" });
		}
	});
});

/*
	Param[req, res]
	This function will fetch all the record from airtable and give you _rawJson of data.
*/
app.get('/getSoftwareApplications', bodyParser.json(), async (req, res) => {
	let softwareApplications = [];
	base('DD: Res: Software & Applications').select({
		// maxRecords: 3,
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function (record) {
			softwareApplications.push({ "id": record._rawJson.id, "ApplicationName": record._rawJson.fields['Application Name'] });
		});
		fetchNextPage();
		res.json({ "status": true, "statusCode": 200, "message": "get software applications successfully", "data": softwareApplications });
	}, function done(err) {
		if (err) { console.error(err); return; }
	});
});

/*
	Param[req, res]
	This function will fetch all the record from airtable and give you _rawJson of data.
*/
app.get('/getStaffConfig', bodyParser.json(), async (req, res) => {
	let staffConfig = [];
	/* get StaffConfig detail */
	base('3 Staff Config').select({
		// maxRecords: 3,
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function (record) {
			staffConfig.push({ "id": record._rawJson.id, "StaffName": record._rawJson.fields['Staff Name (Text Entry)'] });
		});
		fetchNextPage();
		res.json({ "status": true, "statusCode": 200, "message": "get staff config successfully", "data": staffConfig });
	}, function done(err) {
		if (err) { console.error(err); return; }
	});
});

/*
	Param[req, res]
	This function will fetch all the record from airtable and give you _rawJson of data.
*/
app.get('/getRTO', bodyParser.json(), async (req, res) => {
	let RTO = [];
	base('DD: RTO').select({
		// maxRecords: 3,
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function (record) {
			RTO.push({ "id": record._rawJson.id, "RTO": record._rawJson.fields['RTO (Text Entry)'] });
		});
		fetchNextPage();
		res.json({ "status": true, "statusCode": 200, "message": "get RTO successfully", "totalRecord": RTO.length, "data": RTO });
	}, function done(err) {
		if (err) { console.error(err); return; }
	});
});

/*
	Param[req, res]
	This function will fetch all the record from airtable and give you _rawJson of data.
*/
app.get('/getProcessConfig', bodyParser.json(), async (req, res) => {
	let processConfig = [];
	base('4 Process Config').select({
		// maxRecords: 3,
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function (record) {
			processConfig.push(record._rawJson);
		});
		fetchNextPage();
		res.json({ "status": true, "statusCode": 200, "message": "get process config successfully", "totalRecord": processConfig.length, "data": processConfig });
	}, function done(err) {
		if (err) { console.error(err); return; }
	});
});

/*
	Param[req, res]
	This function will fetch all the record from airtable and give you _rawJson of data.
*/
app.get('/getStaffVSSoftwareVSRTO', bodyParser.json(), async (req, res) => {
	let processConfig = [];
	base('Staff vs Software vs RTO').select({
		// maxRecords: 3,
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		records.forEach(function (record) {
			processConfig.push(record._rawJson);
		});
		fetchNextPage();
		res.json({ "status": true, "statusCode": 200, "message": "get Staff vs Software vs RTO successfully", "totalRecord": processConfig.length, "data": processConfig });
	}, function done(err) {
		if (err) { console.error(err); return; }
	});
});