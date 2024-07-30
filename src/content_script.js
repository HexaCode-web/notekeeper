import { differenceInSeconds } from "date-fns";
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR DECIDING THE FUNCTION TO USE
//--------------------------------------------------------------------------------------------------------------------------------------------
var currentUrl = window.location.href;
document.addEventListener("DOMContentLoaded", () => {
  if (currentUrl.includes("bakeoffice")) {
    startCheckingForElement("#orderId", (mutationsList, observer) => {
      setTimeout(() => {
        collectAndLogCustomerNumbers();
      }, 1000);
      PDTCalc();
      // saveOrder();
    });
  }
  // if (currentUrl.includes("logisticsbackoffice")) {
  //   retrieveAndLogOrders();
  //   cleanupExpiredOrders();
  // }
  if (currentUrl.includes("herocare")) {
    setInterval(BreaksTimer, 1000);
  }
});
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR SHORTCUT FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
let Notes; // Declare the Notes variable outside the function to make it accessible globally

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const focusedElement = document.activeElement;
  if (
    focusedElement &&
    (focusedElement.tagName === "TEXTAREA" ||
      focusedElement.tagName === "INPUT")
  ) {
    if (focusedElement.classList.contains("TextInput-Input")) {
      const newText = request.textToInject;
      focusedElement.value += "\n" + newText;
      focusedElement.dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
    } else {
      focusedElement.value = request.textToInject;
      focusedElement.dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
    }
  } else {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      if (textarea.classList.contains("TextInput-Input")) {
        const newText = request.textToInject;
        textarea.value += "\n" + newText;
        textarea.dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
      } else {
        textarea.value = request.textToInject;
        textarea.dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
        textarea.focus();
      }
    }
  }
});

const createNoteListContainer = (notes) => {
  // Create a <div> element to hold the list of notes
  const focusedElement = document.activeElement;
  const noteListContainer = document.createElement("ul");
  noteListContainer.style.backgroundColor = "white";
  noteListContainer.style.Color = "black";
  noteListContainer.classList.add("note-list-container");
  noteListContainer.style.position = "absolute";
  noteListContainer.style.zIndex = 9999;
  noteListContainer.style.padding = "10px";
  noteListContainer.style.boxShadow = "0 3px 10px 0 rgba(0,0,0,.2)";
  noteListContainer.style.borderRadius = "10px";
  noteListContainer.style.listStyle = "none";
  noteListContainer.style.paddingLeft = "0";
  noteListContainer.style.maxHeight = "180px";
  noteListContainer.style.width = `${focusedElement.clientWidth}px`;
  noteListContainer.style.marginTop = "10px";
  noteListContainer.style.overflowY = "auto";
  noteListContainer.style.overflowX = "hidden";

  // Add the notes to the note list container
  notes.forEach((note) => {
    const noteItem = document.createElement("li");
    const noteTitle = document.createElement("h4");
    const noteBody = document.createElement("p");
    noteTitle.style.fontWeight = "bolder";
    noteTitle.style.fontSize = "16px";
    noteTitle.style.color = "black";
    noteBody.style.color = "black";
    noteItem.style.minHeight = "60px";
    noteItem.style.cursor = "pointer";
    noteItem.style.width = "100%";
    noteItem.style.background = "#fff";
    noteItem.style.borderBottom = "1px solid rgba(0,0,0,.15)";
    noteItem.style.margin = "0 5px";
    noteItem.style.padding = "0 5px";
    noteItem.style.borderRadius = "3px";
    noteItem.addEventListener("mouseenter", () => {
      noteItem.style.background = "#f5f7f9";
    });
    noteItem.addEventListener("mouseleave", () => {
      noteItem.style.background = "#fff";
    });
    noteItem.addEventListener("click", () => {
      onClickInsert(note.text);
    });
    noteTitle.textContent = note.title;
    noteBody.textContent = note.text;
    noteItem.appendChild(noteTitle);
    noteItem.appendChild(noteBody);
    noteListContainer.appendChild(noteItem);
  });
  const distanceToBottom = getDistanceToBottomOfScreen(focusedElement);

  // Calculate the position based on the page height and focused element position
  const containerTop =
    distanceToBottom > 150 ? focusedElement.clientHeight + 20 : -180;
  noteListContainer.style.top = `${containerTop}px`;

  // Add the note list container to the document body
  focusedElement.parentNode.appendChild(noteListContainer);
};
function getDistanceToBottomOfScreen(focusedElement) {
  // Get the bounding rectangle of the active element relative to the viewport
  const elementRect = focusedElement.getBoundingClientRect();

  // Get the viewport height
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Calculate the distance from the bottom of the active element to the bottom of the screen
  const distanceToBottom = viewportHeight - elementRect.bottom;
  return distanceToBottom;
}

const RenderNotesList = async (event) => {
  const focusedElement = document.activeElement;
  if (focusedElement.parentNode.className.includes("ant-dropdown-trigger")) {
    return;
  }
  const checkElement = document.querySelector(".note-list-container");
  if (checkElement) {
    checkElement.remove();
  }
  const result = await chrome.storage.local.get(["AdvancedMode", "Notes"]);
  if (result.AdvancedMode) {
    Notes = result.Notes;
    const input = focusedElement.value;
    if (input.includes("/")) {
      const parts = input.split("/"); // Split the string into an array using "/"
      const valueAfterLastSlash = parts[parts.length - 1];

      const matchingNotes = valueAfterLastSlash
        ? Notes.filter((oldNote) => {
            return oldNote.title
              .toUpperCase()
              .startsWith(valueAfterLastSlash.toUpperCase());
          })
        : [];
      if (matchingNotes.length > 0) {
        createNoteListContainer(matchingNotes);
      } else {
        if (checkElement) {
          checkElement.remove();
        }
      }
    }
  }
};

const handleKeyboardInput = async (event) => {
  if (document.activeElement) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.keyCode === 13
    ) {
      handleEnterInput(event);
    } else {
      RenderNotesList(event);
    }
  }
};
const handleEnterInput = (event) => {
  const focusedElement = document.activeElement;
  const checkElement = document.querySelector(".note-list-container");

  if (checkElement) {
    event.preventDefault();
    const parts = focusedElement.value.split("/"); // Split the string into an array using "/"
    const valueAfterLastSlash = parts[parts.length - 1];
    const modifiedString = focusedElement.value.replace(
      `/${valueAfterLastSlash}`,
      ""
    );

    focusedElement.value =
      modifiedString + " " + checkElement.querySelector("li p").innerHTML;
    focusedElement.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
    checkElement.parentNode.removeChild(checkElement);
  }
};
const findNearestTextAreaOrInput = (element) => {
  let sibling = element.nextElementSibling;

  // Loop through the next siblings
  while (sibling) {
    // Check if the sibling is a textarea or input element
    if (sibling.tagName === "TEXTAREA" || sibling.tagName === "INPUT") {
      return sibling;
    }
    sibling = sibling.nextElementSibling;
  }

  // If no textarea or input element found, start checking the previous siblings
  sibling = element.previousElementSibling;

  // Loop through the previous siblings
  while (sibling) {
    // Check if the sibling is a textarea or input element
    if (sibling.tagName === "TEXTAREA" || sibling.tagName === "INPUT") {
      return sibling;
    }
    sibling = sibling.previousElementSibling;
  }

  // If no textarea or input element found in both directions, return null
  return null;
};

const onClickInsert = (Note) => {
  const checkElement = document.querySelector(".note-list-container");
  const textareaOrInput = findNearestTextAreaOrInput(checkElement);

  if (textareaOrInput) {
    const parts = textareaOrInput.value.split("/"); // Split the string into an array using "/"
    const valueAfterLastSlash = parts[parts.length - 1];
    const modifiedString = textareaOrInput.value.replace(
      `/${valueAfterLastSlash}`,
      ""
    );
    textareaOrInput.value = modifiedString + " " + Note;
    textareaOrInput.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
    textareaOrInput.focus();
  }
  checkElement.remove();
};

document.addEventListener("keydown", handleKeyboardInput, true);
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR BREAKS TIME FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
let timeConsumed = null;
let diffSeconds = null;
let StoredTimer = await chrome.storage.sync.get(["Timer"]);
let countDown = StoredTimer.Timer
  ? StoredTimer.Timer - diffSeconds
  : 3600 - diffSeconds;
let startDate = 0;
let didTimerUpdated = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

const BreaksTimer = async () => {
  const CurrentDate = new Date();
  const result = await chrome.storage.local.get(["BreakTimer"]);

  // If the option in the extension is disabled, remove the existing timer
  if (!result.BreakTimer) {
    const header = document.querySelector(
      ".ant-layout-header.headerContainer-0-2-5"
    );
    const checkElement = header.querySelector("#countdown-container");
    if (checkElement) {
      header.removeChild(checkElement);
    }
    return;
  }

  const header = document.querySelector(
    ".ant-layout-header.headerContainer-0-2-5"
  );

  // Check if the timer is already on the screen
  const checkElement = header.querySelector("#countdown-container");

  // If the header exists and the timer is not on the screen
  if (header && !checkElement) {
    // Create a timer wrapper
    const timerSpan = document.createElement("span");
    timerSpan.id = "countdown-container";
    // Create a reset button
    const button = document.createElement("span");
    button.id = "countdown-Reset";
    button.textContent = " Reset?";
    button.style.cursor = "pointer";

    // Event listener for the reset button
    button.addEventListener("click", () => {
      StoredTimer = 3600;
      timeConsumed = 0;
      countDown = 3600;
      didTimerUpdated = false;
      diffSeconds = 0;
      startDate = 0;
      chrome.storage.sync.set({ Timer: 3600 });
    });

    // Create the timer itself
    const Timer = document.createElement("span");
    Timer.id = "countdown-Timer";
    Timer.textContent = `Break time Left:${formatTime(countDown)} mins`;

    header.appendChild(timerSpan);
    timerSpan.appendChild(Timer);
    timerSpan.appendChild(button);
  }

  // Get the status element
  const srcElement = document.querySelector(".ant-badge-status-text");

  if (srcElement) {
    // If the status element exists, get the status's text content
    const src = srcElement.textContent;
    // Format time to display it
    const formattedTime = formatTime(countDown);

    const whiteList = ["Lunch", "Short Break"];
    // If the status element's text is in the whiteList
    // the initial value of didTimerUpdated is false
    // so this will be the first if that runs when changing from anything to 'Lunch' or 'Short Break'
    if (whiteList.includes(src) === true && !didTimerUpdated) {
      // Start or resume the timer when 'Lunch' or 'Short Break' and it wasn't previously running
      didTimerUpdated = true;
      startDate = new Date();
    } else if (whiteList.includes(src) === false && didTimerUpdated) {
      // This means the status was changed from 'Lunch' or 'Short Break' to something else
      // Pause the timer when it's not 'Lunch' or 'Short Break' and it was running
      didTimerUpdated = false;
      timeConsumed = diffSeconds;
    }

    // If there were no changes in the status but changes were made to didTimerUpdated and it was true
    if (didTimerUpdated) {
      diffSeconds = timeConsumed + differenceInSeconds(CurrentDate, startDate);
      countDown = StoredTimer.Timer
        ? StoredTimer.Timer - diffSeconds
        : 3600 - diffSeconds;

      chrome.storage.sync.set({ Timer: countDown });
    }

    if (countDown === 0) {
      clearInterval(timerInterval);
    }

    if (header) {
      if (checkElement) {
        checkElement.querySelector(
          "#countdown-Timer"
        ).textContent = `Break time Left:${formattedTime} mins`;
      }
    }
  } else {
    console.log(".ant-badge-status-text not found");
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR PDTCalc FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
function PDTCalc() {
  const initialElement = document.querySelector(
    '[ng-show="order.postDatedTime>0"]'
  );

  if (initialElement) {
    const siblingElement =
      Array.from(initialElement.nextElementSibling.classList).includes(
        "col-md-12"
      ) &&
      Array.from(initialElement.nextElementSibling.classList).includes(
        "clearfix"
      )
        ? initialElement.nextElementSibling
        : null;

    if (siblingElement) {
      const DateOrderMade =
        siblingElement.querySelector(".ng-binding").textContent;
      const deliveryDate = document.querySelector(
        "h5.pull-left > .text-success"
      ).textContent;

      const minutes = parseInt(deliveryDate, 10);

      const minutesToAdd = minutes / 2;
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const halfPDT = addMinutesToTime(
        DateOrderMade,
        minutesToAdd,
        0
      ).toLocaleTimeString([], options);

      const PDT10 = createCombinedTime(DateOrderMade, minutes);
      function createCombinedTime(dateOrderMade, deliveryDate) {
        const combinedTime = addMinutesToTime(dateOrderMade, deliveryDate, 10);
        return combinedTime;
      }
      addUpdatedTimeRow(halfPDT, PDT10.toLocaleTimeString([], options));

      const actionTime = getActionCreationTime();
      if (actionTime) {
        compareTimes(actionTime, PDT10);
      } else {
        console.log("Action creation time not found.");
      }
    } else {
      console.log("Sibling element with specified class names not found.");
    }
  } else {
    console.log("Initial element not found.");
  }
}
function addUpdatedTimeRow(halfPDT, combinedTime) {
  // Define the ID or class that uniquely identifies the new row
  const uniqueIdentifier = "updatedTimeRow";
  // Check if the row with the unique identifier already exists
  if (document.getElementById(uniqueIdentifier)) {
    const existingRow = document.getElementById(uniqueIdentifier);

    existingRow.innerHTML = `
  <div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
     Half PDT<br>
      <span class="bold" style="color: #36c6d3;" id="DelaySMSTime">${halfPDT}</span>
    </h5>
  </div>
  <hr>
 </div>
 <div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
    PDT+10mins <br>
      <span class="bold" style="color: #36c6d3;" id="PDT">${combinedTime}</span>
    </h5>
  </div>
  <hr>
 </div>`;
    return; // Exit the function if the row already exists
  }

  // Create the new row HTML with a unique identifier
  const newRowHTML = `
 <div class="row" id="${uniqueIdentifier}">
 <div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
     Half PDT<br>
      <span class="bold" style="color: #36c6d3;" id="DelaySMSTime">${halfPDT}</span>
    </h5>
  </div>
  <hr>
 </div>
 <div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
    PDT+10mins <br>
      <span class="bold" style="color: #36c6d3;" id="PDT">${combinedTime}</span>
    </h5>
  </div>
  <hr>
 </div>
 </div>`;

  // Create a new div element and set its innerHTML to the new row HTML
  const newRowElement = document.createElement("div");
  newRowElement.innerHTML = newRowHTML;

  // Find the parent element where the new row will be inserted
  const parentElement = document.querySelector(".panel-body");
  if (parentElement) {
    // Append the new row as the last child of the parent element
    parentElement.appendChild(newRowElement);
  } else {
    console.error("Parent element not found");
  }
}
function addMinutesToTime(dateTimeStr, minutesToAdd, buffer) {
  // Split the date and time parts, ignoring the day of the week if present
  const parts = dateTimeStr.split(" ");
  const monthDayYear = parts.slice(0, 3).join(" ");
  const timePart = parts[3];
  const period = parts[4];

  // Reconstruct the date and time in a format that Date can understand
  const parsedDateTime = new Date(`${monthDayYear} ${timePart} ${period}`);

  if (isNaN(parsedDateTime)) {
    console.error(`Invalid date: ${dateTimeStr}`);
    return null;
  }

  // Add minutes
  parsedDateTime.setMinutes(
    parsedDateTime.getMinutes() + minutesToAdd + buffer
  );
  parsedDateTime.setSeconds(Number.isInteger(minutesToAdd) ? 0 : 30);

  // Format the result back to the required time format (e.g., "hh:mm AM/PM")

  return parsedDateTime;
}

function observeElement(selector, callback) {
  const targetNode = document.querySelector(selector);

  if (!targetNode) {
    console.error(`Element with selector "${selector}" not found.`);
    return;
  }

  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  };

  const observerCallback = function (mutationsList, observer) {
    callback(mutationsList, observer);
  };

  const observer = new MutationObserver(observerCallback);

  observer.observe(targetNode, config);
}
function startCheckingForElement(selector, callback) {
  const interval = 1000;

  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector(selector);
    if (targetNode) {
      clearInterval(checkInterval);
      observeElement(selector, callback);
    }
  }, interval);
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR LATE OWNER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
function getActionCreationTime() {
  // Select all rows in the table
  const rows = document.querySelectorAll("tbody tr");

  // Initialize variables to store the action times
  let nearDropOffTime = null;
  let courierLeftVendorTime = null;
  let NearPickup = null;

  // Iterate through the rows
  for (const row of rows) {
    // Get the action type from the third cell (index 2)
    const actionType = row.cells[2].textContent.trim();
    // Get the creation time from the second cell (index 1)
    const creationTime = row.cells[1].textContent.trim();

    // Check if the action is "Near Drop off"
    if (actionType === "Near Drop off" && nearDropOffTime === null) {
      nearDropOffTime = creationTime;
      // If needed, return immediately or break the loop
      return nearDropOffTime;
    }

    // Check if the action is "Courier Left Vendor"
    if (
      actionType === "Courier Left Vendor" &&
      courierLeftVendorTime === null
    ) {
      courierLeftVendorTime = creationTime;
      // If needed, return immediately or break the loop
      return courierLeftVendorTime;
    }

    // Check if the action is "Near Pickup"
    if (actionType === "Near Pickup" && NearPickup === null) {
      NearPickup = creationTime;
      return NearPickup;
    }
  }

  if (nearDropOffTime) {
    return nearDropOffTime;
  } else if (courierLeftVendorTime) {
    return courierLeftVendorTime;
  } else if (NearPickup) {
    return NearPickup;
  } else {
    return null; // Return null if neither action is found
  }
}

function compareTimes(dateTimeStr, timeStr) {
  // Helper function to parse a date time string (e.g., "Jul 29, 2024 02:33 AM Sun") into a Date object
  function parseDateTimeString(dateTimeStr) {
    // Split the date and time parts, ignoring the day of the week
    const parts = dateTimeStr.split(" ");
    const monthDayYear = parts.slice(0, 3).join(" ");
    const timePart = parts[3];
    const period = parts[4];

    // Reconstruct the date and time in a format that Date can understand
    const parsedDateTime = new Date(`${monthDayYear} ${timePart} ${period}`);

    if (isNaN(parsedDateTime)) {
      console.error(`Invalid date: ${dateTimeStr}`);
      return null;
    }

    return parsedDateTime;
  }

  // Helper function to parse a time string (e.g., "02:52 PM") into a Date object
  function parseTimeString(timeStr) {
    const [time, period] = timeStr.split(" "); // Split into time and period (AM/PM)
    const [hours, minutes] = time.split(":").map(Number); // Split into hours and minutes

    // Convert hours to 24-hour format if needed
    let hours24 = hours;
    if (period === "PM" && hours < 12) hours24 += 12;
    if (period === "AM" && hours === 12) hours24 = 0;

    // Create a Date object and set the hours and minutes
    const date = new Date();
    date.setHours(hours24, minutes, 0, 0);

    return date;
  }

  const riderDate = parseDateTimeString(dateTimeStr);
  const PDT = timeStr;
  let result;
  if (riderDate && PDT) {
    const differenceInMillis = riderDate - PDT;
    const differenceInMinutes = Math.floor(differenceInMillis / 1000 / 60);

    if (riderDate > PDT) {
      result = `<div>
                  <div class="clearfix">
                    <h5 class="pull-left" style="margin-left: 15px;">
                      <span class="bold" style="color: red;">There is Delay by ${differenceInMinutes} minutes.</span>
                    </h5>
                  </div>
                  <hr>
                </div>`;
    } else {
      result = `<div>
                  <div class="clearfix">
                    <h5 class="pull-left" style="margin-left: 15px;">
                     <span class="bold" style="color: green;" >There is no Delay</span>
                    </h5>
                  </div>
                  <hr>
                </div>`;
    }
  } else {
    result = "Invalid date or time format.";
  }

  const updatedTimeRow = document.getElementById("updatedTimeRow");
  if (updatedTimeRow) {
    const newContent = document.createElement("div");
    newContent.innerHTML = result;
    updatedTimeRow.appendChild(newContent);
  } else {
    console.error('Element with id "updatedTimeRow" not found.');
  }
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR CUSTOMER NUMBER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------

function collectAndLogCustomerNumbers() {
  let customerNumbers = new Map();
  let rows = document.querySelectorAll(
    'table[st-safe-src="customerHistories"] tbody tr'
  );
  rows.forEach((row) => {
    let cells = row.querySelectorAll("td");
    let customerName = cells[3].textContent.trim();
    let customerNumber = cells[5].textContent.trim();
    let landlineNumber = cells[6].textContent.trim();
    if (!customerNumbers.has(customerName)) {
      customerNumbers.set(customerName, new Set());
    }
    if (customerNumber) {
      customerNumbers.get(customerName).add(customerNumber);
    }
    if (landlineNumber) {
      customerNumbers.get(customerName).add(landlineNumber);
    }
  });
  customerNumbers.forEach((numbers, name) => {
    console.log(`Customer Name: ${name}`);
    console.log("Unique Numbers:", [...numbers]);
  });
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR HIGHEST DELAY FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
// function saveOrder() {
//   const orderIdElement = document.getElementById("orderId");
//   const PDTElement = document.getElementById("PDT");

//   if (orderIdElement && PDTElement) {
//     const orderId = orderIdElement.textContent.trim();
//     const PDT = PDTElement.textContent.trim();
//     const timestamp = new Date().toISOString(); // Current time as ISO string

//     // Get existing orders from storage
//     chrome.storage.local.get("orders", (result) => {
//       const orders = result.orders || [];

//       // Add new order to the list
//       orders.push({ orderId, PDT, timestamp });

//       // Save the updated list back to storage
//       chrome.storage.local.set({ orders }, () => {
//         console.log("Order saved to chrome.storage:", {
//           orderId,
//           PDT,
//           timestamp,
//         });
//       });
//     });
//   } else {
//     console.error('Elements with IDs "orderId" or "PDT" not found.');
//   }
// }

// function retrieveAndLogOrders() {
//   chrome.storage.local.get("orders", (result) => {
//     const orders = result.orders || [];
//     if (orders.length > 0) {
//       console.log("Retrieved orders from chrome.storage:", orders);
//     } else {
//       console.log("No orders found in chrome.storage.");
//     }
//   });
// }

// function cleanupExpiredOrders() {
//   const expirationTime = 4 * 60 * 60 * 1000;
//   const now = new Date().getTime();

//   chrome.storage.local.get("orders", (result) => {
//     const orders = result.orders || [];

//     // Filter out orders older than 24 hours
//     const updatedOrders = orders.filter((order) => {
//       const orderTime = new Date(order.timestamp).getTime();
//       return now - orderTime < expirationTime;
//     });

//     // Save the updated list back to storage
//     chrome.storage.local.set({ orders: updatedOrders }, () => {
//       console.log("Expired orders cleaned up.");
//     });
//   });
// }
