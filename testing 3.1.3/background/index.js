chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showNotification") {
    // Ensure message.Name is used as the notification ID or generate a unique ID if not provided
    const notificationId = message.Name || `notification_${Date.now()}`;

    chrome.notifications.create(
      notificationId,
      {
        type: "basic",
        iconUrl: message.icon,
        title: message.title,
        message: "time frame alert",
        priority: 2,
        silent: true,
      },
      function (createdNotificationId) {
        // Set a timer to clear the notification after 5 seconds (5000 ms)
        setTimeout(function () {
          chrome.notifications.clear(createdNotificationId, function () {
            console.log("Notification closed");
          });
        }, 5000);
      }
    );

    sendResponse({ status: "notification shown" });
  }
});
