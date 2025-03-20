function doPost(e) {
  try {
    // Replace with your Google Drive folder ID
    var folderId = "14zQDtK1jZjzqJv7EakSGVZmXMWyoewHW";
    var folder = DriveApp.getFolderById(folderId);

    // Decode the base64 file data and create a blob
    var blob = Utilities.newBlob(Utilities.base64Decode(e.postData.contents), e.parameter.mimetype, e.parameter.filename);

    // Save the file to Google Drive
    var file = folder.createFile(blob);

    // Prepare the response
    var response = {
      status: "success",
      url: file.getUrl(),
      id: file.getId(),
    };

    // Return the response as JSON
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*", // Allow CORS
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
  } catch (error) {
    // Handle errors
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle CORS preflight requests
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*", // Allow CORS
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
}