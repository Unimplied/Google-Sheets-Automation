function clearCell(){ // this function clears cell A2 before appending it with fresh data.
  
  var app = SpreadsheetApp;
  var activeSheet = app.getActiveSpreadsheet().getSheetByName("Sales report");
  activeSheet.getRange("A2:B2").clearContent();
}

function differenceOfSales(){
  var app = SpreadsheetApp;
  
  var activeSheet = app.getActiveSpreadsheet().getSheetByName("Form Responses"); // selects spreadsheet 'Form Responses' by name
  
  var sum =  activeSheet.getRange("J2").getValue();// selects value of sales total from form responses
  
  var targetSheet = app.getActiveSpreadsheet().getSheetByName("Sales report"); // selects 'Sales report' as active sheet

  targetSheet.getRange("C2").setValue(sum);// appends value of difference vs target to new sheet in cell C2
}

function differenceOfSalesPercent(){
  var app = SpreadsheetApp;
  
  var activeSheet = app.getActiveSpreadsheet().getSheetByName("Form Responses"); // selects spreadsheet 'Form Responses' by name
  
  var sum =  activeSheet.getRange("K2").getValue();// selects value of the difference as a percentage from form responses
  
  var targetSheet = app.getActiveSpreadsheet().getSheetByName("Sales report"); // selects 'Sales report' as active sheet

  targetSheet.getRange("D2").setValue(sum);// appends value of difference vs target as a percentage to new sheet in cell D2
}


function timestamp(){ // This function automatically dates the cell adjacent to the 'total sales' cell on the 'Sales report' sheet
  
  var app = SpreadsheetApp;
  
  var targetSheet = app.getActiveSpreadsheet().getSheetByName("Sales report");
  var targetCell = targetSheet.getRange("A2").offset(0,1);
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "MM/dd/yyyy");
  
  targetCell.setValue(formattedDate);
  
}

function sendOneExcelSheet(){

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var spreadsheetId = spreadsheet.getId();
var sheets = spreadsheet.getSheets();
var keepSheet = 'Sales report'; 

//Hides the other sheets
for(var i=0; i<sheets.length; i++){
Logger.log(i);
if(sheets[i].getName()!=keepSheet){
sheets[i].hideSheet(); } }

//Save as excel file
var url = 'https://docs.google.com/spreadsheets/d/'+spreadsheetId+'/export?format=xlsx';
var token = ScriptApp.getOAuthToken();
var response = UrlFetchApp.fetch(url, { headers: { 'Authorization' : 'Bearer ' + token } } );
var fileName = (spreadsheet.getName()) + '.xlsx';
var blobs = [response.getBlob().setName(fileName)];

//Email with attachment
var mailTo = 'emailhere.gmail.com', 
subject = 'This is our Output for Sales Report',
body = 'This is our daily sales report'
MailApp.sendEmail(mailTo, subject, body, {attachments: blobs});

sheets.forEach(function(s) {s.showSheet();})
}


/*function sendMail() { // this code segment was our old 

  var originalSpreadsheet = SpreadsheetApp.getActive();  // Gets the current spreadsheet
  var now = new Date(); // Time stamp information for the email
  MailApp.sendEmail("emailhere.gmail.com",
                    "Sales report",
                    "Daily sales report for day of " + now,
                    {attachments:[originalSpreadsheet]}); //attachment field; sending out google spreadsheet
}*/ 

function calcDay(){
  
  var app = SpreadsheetApp;
  var activeSheet = app.getActiveSpreadsheet().getSheetByName("Form Responses");
  
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0
  var yyyy = today.getFullYear();
  var daily_total = 0;
  
  // var today2 = new Date().toDateString(); <------ This was a test value
  
  var Avals = activeSheet.getRange("A1:A").getValues();
  var Alast = Avals.filter(String).length; // finds the length of column A

  if(dd<10) {
    dd = '0'+dd
  } 

  if(mm<10) {
    mm = '0'+mm
  } 

  today = mm + '/' + dd + '/' + yyyy; // sets date to  mm/dd/yyyy format
  today.toString();
  
  var daily_sales = 0;
  for (var i = 1; i < Alast; i = i+1){ 
    if (activeSheet.getRange(i,1).getValues().indexOf(today) > -1){   // loop compares today as a mm/dd/yyyy format string, to the value of the cell being checked
        var cell = activeSheet.getRange(i,1).offset(0,3).getValues(); // if the cell contains the current day, the cell reads the value in column C of the same row, and adds it 
        daily_total += cell;                                          // to a counter daily_total to find the total value of that day.
    } 
  }
  
  var targetSheet = app.getActiveSpreadsheet().getSheetByName("Sales report"); // selects 'Sales report' as active sheet
  targetSheet.getRange("A2").setValue(daily_total); // appends value of daily_total to new sheet in cell A2
  
 /* 
 var testCell = activeSheet.getRange(36,1).getValues().toString();
 
 Logger.log(today);  <------------ All of these are log test values.
 Logger.log(Alast);
 Logger.log(testCell);
 Logger.log(daily_total);
 Logger.log(activeSheet.getRange(3,1).getValues().indexOf(today));
 */
}
