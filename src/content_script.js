import { differenceInSeconds } from "date-fns";
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
let Notes; // Declare the Notes variable outside the function to make it accessible globally

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
//TIMER
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

// This function runs every second
async function updateTimer() {
  checkAndRunFunction();
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
}

const timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
function checkAndRunFunction() {
  const targetUrl = "https://bakeoffice.dhhmena.com/#/orderSearch";
  if (window.location.href === targetUrl) {
    PDTCalc();
  }
}

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
      const DateOrderMade = siblingElement
        .querySelector(".ng-binding")
        .textContent.split(" ")
        .slice(-2)
        .join(" ");
      const deliveryDate = document.querySelector(
        "h5.pull-left > .text-success"
      ).textContent;

      const minutes = parseInt(deliveryDate, 10);

      const minutesToAdd = Math.floor(minutes / 2) + 1;

      const halfPDT = addMinutesToTime(DateOrderMade, minutesToAdd, 0);

      function createCombinedTime(dateOrderMade, deliveryDate) {
        const combinedTime = addMinutesToTime(dateOrderMade, deliveryDate, 10);
        return combinedTime;
      }

      const combinedTime = createCombinedTime(DateOrderMade, minutes);

      const actionTime = getActionCreationTime();

      if (actionTime) {
        const comparisonResult = compareTimes(actionTime, combinedTime);
        console.log("Comparison result:", comparisonResult);
      } else {
        console.log("Action creation time not found.");
      }

      addUpdatedTimeRow(halfPDT, combinedTime);
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
    console.log("time updated.");
    const existingRow = document.getElementById(uniqueIdentifier);

    existingRow.innerHTML = `
  <div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
     Half PDT<br>
      <span class="bold" style="color: #36c6d3;" id="updatedTime">${halfPDT}</span>
    </h5>
  </div>
  <hr>
</div>
<div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
    PDT+10mins <br>
      <span class="bold" style="color: #36c6d3;" id="combinedTime">${combinedTime}</span>
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
      <span class="bold" style="color: #36c6d3;" id="updatedTime">${halfPDT}</span>
    </h5>
  </div>
  <hr>
</div>
<div>
  <div class="clearfix">
    <h5 class="pull-left" style="margin-left: 15px;">
    PDT+10mins <br>
      <span class="bold" style="color: #36c6d3;" id="combinedTime">${combinedTime}</span>
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
    console.log("New time row added.");
  } else {
    console.error("Parent element not found");
  }
}
function addMinutesToTime(timeStr, minutesToAdd, buffer) {
  // Create a Date object with the given time (assuming the date is January 1, 1970)
  const [time, period] = timeStr.split(" "); // Split into time and period (AM/PM)
  const [hours, minutes] = time.split(":").map(Number); // Split into hours and minutes

  // Convert hours to 24-hour format if needed
  let hours24 = hours;
  if (period === "PM" && hours < 12) hours24 += 12;
  if (period === "AM" && hours === 12) hours24 = 0;

  // Create a Date object and set the hours and minutes
  const date = new Date();
  date.setHours(hours24, minutes, 0, 0);

  // Add minutes
  date.setMinutes(date.getMinutes() + minutesToAdd + buffer);

  // Format the result back to the required time format (e.g., "hh:mm AM/PM")
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString([], options);
}

function getActionCreationTime() {
  // Select all rows in the table
  const rows = document.querySelectorAll("tbody tr");

  // Initialize variables to store the action times
  let nearDropOffTime = null;
  let courierLeftVendorTime = null;

  // Iterate through the rows
  rows.forEach((row) => {
    // Get the action type from the third cell (index 2)
    const actionType = row.cells[2].textContent.trim();

    // Get the creation time from the second cell (index 1)
    const creationTime = row.cells[1].textContent.trim();

    // Check if the action is "Near Drop off"
    if (actionType === "Near Drop off") {
      nearDropOffTime = creationTime;
    }

    // Check if the action is "Courier Left Vendor"
    if (actionType === "Courier Left Vendor") {
      courierLeftVendorTime = creationTime;
    }
  });

  // Return the time of "Near Drop off" if available, otherwise return the time of "Courier Left Vendor"
  if (nearDropOffTime) {
    return nearDropOffTime;
  } else if (courierLeftVendorTime) {
    return courierLeftVendorTime;
  } else {
    return null; // Return null if neither action is found
  }
}

function compareTimes(dateTimeStr, timeStr) {
  // Helper function to parse a date time string (e.g., "Apr 04, 2024 04:15 PM") into a Date object
  function parseDateTimeString(dateTimeStr) {
    // Split the date and time parts
    const [datePart, timePart] = dateTimeStr.split(" ");

    // Reconstruct the date and time in a format that Date.parse can understand
    const parsedDateTime = new Date(Date.parse(`${datePart} ${timePart}`));

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

  const dateTime1 = parseDateTimeString(dateTimeStr);
  const dateTime2 = parseTimeString(timeStr);

  // Compare the two Date objects
  if (dateTime1 && dateTime2) {
    if (dateTime1 < dateTime2) {
      return "There is late";
    } else if (dateTime1 > dateTime2) {
      return "There is no late";
    } else {
      return "There is no late";
    }
  } else {
    return "Invalid date or time format.";
  }
}
