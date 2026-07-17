const SCRIPT_SECRET = "replace-this-with-your-secret";

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");

    if (SCRIPT_SECRET && payload.secret !== SCRIPT_SECRET) {
      return jsonResponse({ success: false, error: "Unauthorized request." });
    }

    if (!payload.to || !payload.subject || !payload.html) {
      return jsonResponse({ success: false, error: "Missing to, subject, or html." });
    }

    MailApp.sendEmail({
      to: payload.to,
      subject: payload.subject,
      htmlBody: payload.html,
      replyTo: payload.replyTo || "",
      name: payload.senderName || "Luxe Salon",
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
