import { differenceInSeconds } from "date-fns";
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR DECIDING THE FUNCTION TO USE
//--------------------------------------------------------------------------------------------------------------------------------------------
var currentUrl = window.location.href.toLowerCase();
function main() {
  if (currentUrl.includes("bakeoffice")) {
    startCheckingForElement("#orderId", (mutationsList, observer) => {
      watchClicks(`li[heading="Last Orders"]`);
      checkForWrapper();
      PDTCalc();
      getPreviousSMS();
    });
  }

  if (currentUrl.includes("herocare")) {
    setInterval(BreaksTimer, 1000);
  }
  if (currentUrl.includes("herocare")) {
    // addOpenKB();
    startCheckingForElement(
      '[data-testid="container-com.plugin.chat-box-view"]',
      (mutationsList, observer) => {
        checkForHold();
        checkForClosure();
        checkForQuestion();
      }
    );
    startCheckingForElement(
      '[class*="ticketList"]',
      (mutationsList, observer) => {
        markChats();
      }
    );
  }
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
  const interval = 100;
  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector(selector);
    if (targetNode) {
      clearInterval(checkInterval);
      observeElement(selector, callback);
    }
  }, interval);
}
document.addEventListener("DOMContentLoaded", main);
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR openKB function
//--------------------------------------------------------------------------------------------------------------------------------------------
const addOpenKB = () => {
  const newElement = document.createElement("div");
  newElement.style.width = "50%";
  newElement.style.margin = "auto";
  newElement.style.marginTop = "10px";
  newElement.innerHTML = `
 <div class="container" style="
    display: flex;
    gap: 20px;"><div class="searchTemplatesContainer"><div class="container"><input placeholder="Chat Label" class="ant-input inputField" type="text" value=""><div class="listContainerWrapper"></div></div></div><button  type="button" class="ant-btn button">Open KB</button></div>
  `;
  const interval = 100;
  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector('[class*="infoPanelContainer"]');
    if (targetNode) {
      clearInterval(checkInterval);
      if (targetNode.firstChild) {
        targetNode.insertBefore(newElement, targetNode.firstChild);
      } else {
        // If the parent has no children, just append the new element
        targetNode.appendChild(newElement);
      }
    }
  }, interval);
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR FreshChat FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
let Notes;

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
//FOR the notification function
//--------------------------------------------------------------------------------------------------------------------------------------------
let chatHasHold = [false, false, false];
let chatHasClosure = [false, false, false];
let chatHasQuestion = [false, false, false];
let lastNotificationTimes = {};
let activeChat = 0;

const checkForHold = () => {
  const whitelist = [
    "اضافي",
    "8",
    "5 دقائق",
    "3 دقائق",
    "3دقائق",
    "ثلاث",
    "الثانيه",
    "5دقائق",
    "البيانات",
    "لم يتم الرد ",
    "لم يرد ",
  ];
  function containsWhitelistWord(message, whitelist) {
    return whitelist.some((word) => message.includes(word));
  }
  if (containsWhitelistWord(lastAgentMessage(), whitelist)) {
    console.log(`chat ${activeChat} has hold`);

    chatHasHold[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has  no hold`);

    chatHasHold[activeChat] = false;
  }
};
const checkForQuestion = () => {
  const whitelist = ["?", "؟", " ? "];
  function containsWhitelistWord(message, whitelist) {
    return whitelist.some((word) => message.includes(word));
  }
  if (containsWhitelistWord(lastAgentMessage(), whitelist)) {
    console.log(`chat ${activeChat} has question`);

    chatHasQuestion[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has no question`);

    chatHasQuestion[activeChat] = false;
  }
};

const checkForClosure = () => {
  const whitelist = ["اليوم", "استطلاعًا", "بمساعدتك", "استطلاع", "المساعدة"];
  function containsWhitelistWord(message, whitelist) {
    return whitelist.some((word) => message.includes(word));
  }
  if (containsWhitelistWord(lastAgentMessage(), whitelist)) {
    console.log(`chat ${activeChat} has closure`);
    chatHasClosure[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has  no closure`);
    chatHasClosure[activeChat] = false;
  }
};

const markChats = () => {
  const activeChats = document.querySelectorAll(".ant-progress-text");
  if (activeChats.length > 0 && activeChat === 0) {
    const firstChat = activeChats[0].querySelector("div");
    if (firstChat && firstChat.id) {
      activeChat = firstChat.id;
    }
  }
  activeChats.forEach((ChatWrapper) => {
    const chat = ChatWrapper.querySelector("div");
    const parentEL = ChatWrapper.parentElement.parentElement.parentElement;

    if (!parentEL.dataset.listenerAdded) {
      parentEL.dataset.listenerAdded = "true";
      parentEL.addEventListener("click", () => {
        activeChat = chat.id;
      });
    }

    if (!chat.id) {
      chat.id = `chat${Math.floor(Math.random() * 100000)}`;
      observeElement(`#${chat.id}`, (mutationsList, observer) => {
        const time = chat.textContent.trim();
        const [minutes, seconds] = time.split(":").map(Number);
        const totalSeconds = minutes * 60 + seconds;
        const currentTime = Date.now();
        let chatStatus = chatHasHold[chat.id]
          ? 1
          : chatHasClosure[chat.id]
          ? 2
          : chatHasQuestion[chat.id]
          ? 3
          : 4;
        let waitTime =
          chatStatus === 1
            ? 10
            : chatStatus === 2
            ? 150
            : chatStatus === 3
            ? 60
            : 90;
        const maxThreshold =
          chatStatus === 1
            ? 0
            : chatStatus === 2
            ? 120
            : chatStatus === 3
            ? 30
            : 60;

        if (totalSeconds <= waitTime && totalSeconds >= maxThreshold) {
          const lastNotification = lastNotificationTimes[chat.id];
          const sameType =
            lastNotification && lastNotification.Type === chatStatus;
          const coolDownTime = sameType ? 20000 : 0;

          if (
            !lastNotification ||
            currentTime - lastNotification.currentTime > coolDownTime
          ) {
            lastNotificationTimes[chat.id] = {
              currentTime,
              Type: chatStatus,
            };

            const chatText =
              parentEL.querySelector(".ant-typography").textContent;
            const imageUrl =
              chatStatus === 1
                ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/hold%20no%20bg.png?alt=media&token=461b41e7-ba28-40fb-9a37-677dc964cfef"
                : chatStatus === 2
                ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/Close_Chat-removebg-preview%20(1).png?alt=media&token=8a4008e2-d62d-4a72-8e7a-399830b9cd1c"
                : chatStatus === 3
                ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/question%20no%20bg.png?alt=media&token=2259a230-5b96-4435-93e0-a8990d6da536"
                : "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/silence%20no%20bg.png?alt=media&token=e5b18fc6-7ef9-4b23-8c72-e1aaab0ef694";

            sendNotification(chatText, imageUrl);
          }
        }
      });
    }

    // Cleanup: If a chat is removed, delete its notification time
    const chatIds = Array.from(activeChats).map(
      (chatWrapper) => chatWrapper.querySelector("div").id
    );
    Object.keys(lastNotificationTimes).forEach((id) => {
      if (!chatIds.includes(id)) {
        delete lastNotificationTimes[id];
      }
    });
  });
};

function lastAgentMessage() {
  // Get all message containers
  const messageContainers = document.querySelectorAll(
    '[data-testid="chat-bubble"]'
  );

  // Array to hold the extracted agent messages
  let agentMessages = [];

  messageContainers.forEach((container) => {
    const senderDetailEL = container.querySelector(
      '[class*="messageDetails"] span:first-child'
    );
    if (senderDetailEL) {
      const senderDetail = senderDetailEL.textContent;
      if (senderDetail.endsWith("_Xceed")) {
        const messageContent = container.querySelector(
          '[data-testid="chat-bubble-paragraph"]'
        ).innerText;

        agentMessages.push(messageContent.trim());
      }
    }
  });

  if (agentMessages.length > 0) {
    return agentMessages[agentMessages.length - 1];
  } else {
    return "";
  }
}

const sendNotification = (message, Icon) => {
  chrome.runtime.sendMessage({
    action: "showNotification",
    title: message,
    Name: message,
    icon: Icon,
  });
  playNotificationSound(
    "https://firebasestorage.googleapis.com/v0/b/rea-test-ca2bb.appspot.com/o/message-13716.mp3?alt=media&token=9988b24c-3326-44c1-848f-684010f19309"
  );
};

function playNotificationSound(url) {
  const audio = new Audio(url);

  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}

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
//FOR BOA BUILDING FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------
function checkForWrapper() {
  const existingWrapper = document.querySelector("#additionWrapper");

  if (existingWrapper) {
    existingWrapper.innerHTML = "";

    buildTimePanel(existingWrapper);
    buildCstPanel(existingWrapper);
  } else {
    const wrapperEL = document.createElement("div");
    wrapperEL.id = "additionWrapper";
    wrapperEL.className = "col-md-8";
    wrapperEL.style.padding = "0";

    buildTimePanel(wrapperEL);
    buildCstPanel(wrapperEL);

    document.querySelector(".portlet-body > .row").appendChild(wrapperEL);
  }

  // Add click event listener to the button
  const openLastOrdersButton = document.querySelector("#openLastOrdersButton");
  openLastOrdersButton.addEventListener("click", () => {
    const orderLogHistoryTab = document.querySelector(
      'li[heading="Order Log History"]'
    );
    const lastOrdersTab = document.querySelector('li[heading="Last Orders"]');

    if (orderLogHistoryTab) {
      orderLogHistoryTab.classList.remove("active");
    }
    if (lastOrdersTab) {
      lastOrdersTab.classList.add("active");
      lastOrdersTab.querySelector("a").click();
      lastOrdersTab.click();
    }
  });
}
const buildCstPanel = (WrapperEL) => {
  const CSTparentEL = document.createElement("div");
  CSTparentEL.id = "CSNumbers";
  CSTparentEL.className = "col-md-8";
  const panel = document.createElement("div");
  panel.className = "panel panel-primary";

  const panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";

  const panelTitle = document.createElement("h3");
  panelTitle.className = "panel-title bold clearfix";
  panelTitle.textContent = "Customer Numbers";

  panelHeading.appendChild(panelTitle);
  panel.appendChild(panelHeading);

  const panelBody = document.createElement("div");
  panelBody.className = "panel-body";
  panelBody.id = "CSNumbers-panel";
  panelBody.innerHTML = `
      <h2 style="text-align: center;">
        Open Last orders to view customer numbers
      </h2>
      <button class="btn btn-lg btn-md btn-block green-meadow ng-scope" 
      style="margin: auto;width: fit-content" id="openLastOrdersButton">
        Open Last Orders
      </button>`;
  panel.appendChild(panelBody);
  CSTparentEL.appendChild(panel);
  WrapperEL.appendChild(CSTparentEL);
};
const buildTimePanel = (WrapperEL) => {
  let ParentEL = document.createElement("div");
  ParentEL.id = "updatedTimeRow";
  ParentEL.className = "col-md-4";

  let panel = document.createElement("div");
  panel.className = "panel panel-primary";

  // Create panel heading
  let panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  let panelTitle = document.createElement("h3");
  panelTitle.className = "panel-title bold clearfix";
  panelTitle.textContent = "Time Data";
  panelHeading.appendChild(panelTitle);
  panel.appendChild(panelHeading);
  let alert = "";
  // Create panel body
  let panelBody = document.createElement("div");
  panelBody.className = "panel-body";
  if (
    document
      .querySelector(".bold.pull-right.media-object.ng-binding")
      .innerHTML.includes("UAE")
  ) {
    alert =
      "In UAE, for the Groceries not Tmart, the buffer is 30 minutes after the PDT";
  } else {
    alert = "";
  }
  // Create content for the panel
  panelBody.innerHTML = `
    <div>
      <div class="clearfix">
        <h5 class="pull-left" style="margin-left: 15px;">
          Half PDT<br>
          <br>
          <span class="bold" style="color: #36c6d3;" id="DelaySMSTime"></span>
        </h5>
      </div>
      <hr>
    </div>
    <div>
      <div class="clearfix">
        <h5 class="pull-left" style="margin-left: 15px;">
          PDT+10mins <br>
            <span id="alert">${alert}</span>
            <br>
          <span class="bold" style="color: #36c6d3;" id="PDT"></span>
        </h5>
      </div>
      <hr>
    </div>`;

  panel.appendChild(panelBody);
  ParentEL.appendChild(panel);

  // Find the parent element where the new panel will be inserted
  const parentElement = WrapperEL;

  if (parentElement) {
    parentElement.appendChild(ParentEL);
  } else {
    console.error("Parent element not found");
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
      displayTimeData(halfPDT, PDT10.toLocaleTimeString([], options));

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
function displayTimeData(halfPDT, combinedTime) {
  // Define the ID or class that uniquely identifies the new panel
  const uniqueIdentifier = "updatedTimeRow";

  // Check if the panel with the unique identifier already exists
  if (document.getElementById(uniqueIdentifier)) {
    const existingPanel = document.getElementById(uniqueIdentifier);

    // Update the existing panel content
    existingPanel.querySelector("#DelaySMSTime").textContent = halfPDT;
    existingPanel.querySelector("#PDT").textContent = combinedTime;

    return; // Exit the function if the panel already exists
  }

  // Create the new panel container with the same styles as before
  let ParentEL = document.createElement("div");
  ParentEL.id = uniqueIdentifier;
  ParentEL.className = "col-md-4";

  let panel = document.createElement("div");
  panel.className = "panel panel-primary";

  // Create panel heading
  let panelHeading = document.createElement("div");
  panelHeading.className = "panel-heading";
  let panelTitle = document.createElement("h3");
  panelTitle.className = "panel-title bold clearfix";
  panelTitle.textContent = "Time Data";
  panelHeading.appendChild(panelTitle);
  panel.appendChild(panelHeading);
  let alert = "";

  // Create panel body
  let panelBody = document.createElement("div");
  panelBody.className = "panel-body";
  if (
    document
      .querySelector(".bold.pull-right.media-object.ng-binding")
      .textContent.includes("UAE")
  ) {
    alert =
      "In UAE, for the Groceries not Tmart, the buffer is 30 minutes after the PDT";
  } else {
    alert = "";
  }
  // Create content for the panel
  panelBody.innerHTML = `
    <div>
      <div class="clearfix">
        <h5 class="pull-left" style="margin-left: 15px;">
          Half PDT<br>
          <br>
          <span class="bold" style="color: #36c6d3;" id="DelaySMSTime">${halfPDT}</span>
        </h5>
      </div>
      <hr>
    </div>
    <div>
      <div class="clearfix">
        <h5 class="pull-left" style="margin-left: 15px;">
          PDT+10mins <br>
          <span>${alert}</span>
             <br> 
          <span class="bold" style="color: #36c6d3;" id="PDT">${combinedTime}</span>
        </h5>
      </div>
      <hr>
    </div>`;

  panel.appendChild(panelBody);
  ParentEL.appendChild(panel);

  // Find the parent element where the new panel will be inserted
  const parentElement = document.querySelector("#additionWrapper");

  if (parentElement) {
    parentElement.appendChild(ParentEL);
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

const getPreviousSMS = () => {
  const Table = document
    .querySelector('[st-table="displaytaskLogHistory"]')
    .parentElement.querySelector(".tbody")
    .querySelector('[st-safe-src="orderLogs"]')
    .querySelector("tbody")
    .querySelectorAll("tr");
  for (const row of Table) {
    const Content = row.cells[4].textContent.trim();
    const DelaySMSTime = document.querySelector("#DelaySMSTime");
    if (Content.includes("delay") || Content.includes("التأخير")) {
      const warningText = document.createElement("p");
      warningText.textContent = "Delay SMS already sent";
      warningText.style.marginTop = "5px";
      warningText.style.marginBottom = "5px";
      warningText.style.color = "red";
      DelaySMSTime.appendChild(warningText);
    }
  }
};
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
                      <span class="bold" style="color: red;">There is Total Delay in delivery by ${differenceInMinutes} minutes.</span>
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

  const updatedTimeRow = document
    .getElementById("updatedTimeRow")
    .querySelector(".panel-body");
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
function watchClicks(selector) {
  const targetNode = document.querySelector(selector);
  if (targetNode) {
    // Add an event listener for the 'click' event
    targetNode.addEventListener("click", (event) => {
      setTimeout(() => {
        collectAndDisplayCustomerNumbers();
      }, 1000);
    });
  } else {
    console.error('Element with heading "Last Orders" not found.');
  }
}
function collectAndDisplayCustomerNumbers() {
  let rows = document.querySelectorAll(
    'table[st-safe-src="customerHistories"] tbody tr'
  );
  let cstData = [];

  rows.forEach((row) => {
    let cells = row.querySelectorAll("td");
    let customerName = cells[3].textContent.trim();
    let customerNumber = cells[5].textContent.trim();
    let landlineNumber = cells[6].textContent.trim();
    let country = cells[13].textContent.trim();
    let brand = cells[14].textContent.trim();

    // Add customerNumber object if it exists
    if (customerNumber) {
      cstData.push({
        customerName,
        customerNumber,
        country,
        brand,
      });
    }

    // Add landlineNumber object as customerNumber if it exists
    if (landlineNumber) {
      cstData.push({
        customerName,
        customerNumber: landlineNumber,
        country,
        brand,
      });
    }
  });

  // Remove duplicates based on all properties of the object
  let uniqueCstData = Array.from(
    new Set(cstData.map((a) => JSON.stringify(a)))
  ).map((str) => JSON.parse(str));

  updateCustomerNumbersPanel(uniqueCstData);
}

function updateCustomerNumbersPanel(customerData) {
  const targetDiv = document.querySelector("#additionWrapper");
  const panel = document.querySelector("#CSNumbers-panel");

  if (!targetDiv) {
    console.error('Element with ID "additionWrapper" not found.');
    return;
  }

  if (panel) {
    panel.innerHTML = "";
    const Table = panel.querySelector("table");
    if (Table) {
      Table.remove();
    }
  } else {
    console.error('Element with ID "CSNumbers-panel" not found.');
    return;
  }

  let table = document.createElement("table");
  table.className = "table table-bordered";
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  let headerRow = table.insertRow();
  let headers = ["Customer Name", "Numbers", "Country", "Brand"];
  headers.forEach((headerText) => {
    let th = document.createElement("th");
    th.textContent = headerText;
    th.className = "bold";
    th.style.border = "1px solid #ddd";
    th.style.padding = "8px";
    headerRow.appendChild(th);
  });

  let customerOriginalName = null;

  document.querySelectorAll("h5.pull-left").forEach((element) => {
    if (element.textContent.includes("Name")) {
      customerOriginalName =
        element.querySelector(".bold.ng-binding").textContent;
      customerOriginalName = customerOriginalName
        .replace(/\[.*?\]/g, "")
        .trim();
    }
  });

  customerData.forEach((data) => {
    let row = table.insertRow();
    let cellName = row.insertCell();
    let cellNumbers = row.insertCell();
    let cellCountry = row.insertCell();
    let cellBrand = row.insertCell();

    cellName.textContent = data.customerName;
    cellName.style.border = "1px solid #ddd";
    cellName.style.padding = "8px";
    if (customerOriginalName) {
      if (cellName.textContent === customerOriginalName) {
        cellName.style.color = "#36c6d3";
        cellName.classList.add("bold");
      } else {
        row.remove();
      }
    } else {
      console.log("Element not found");
    }
    cellCountry.textContent = data.country;
    cellCountry.style.border = "1px solid #ddd";
    cellCountry.style.padding = "8px";

    cellBrand.textContent = data.brand;
    cellBrand.style.border = "1px solid #ddd";
    cellBrand.style.padding = "8px";

    cellNumbers.style.border = "1px solid #ddd";
    cellNumbers.style.padding = "8px";

    let numbers = [data.customerNumber, data.landlineNumber].filter(Boolean);
    numbers.forEach((number) => {
      let numberSpan = document.createElement("span");
      numberSpan.innerHTML = number;
      numberSpan.style.cursor = "pointer";
      numberSpan.onclick = () => copyToClipboard(number);

      let copyButton = document.createElement("button");
      copyButton.innerHTML = '<i class="fa fa-files-o"></i>';
      copyButton.className = "btn btn-sm blue";
      copyButton.style.marginLeft = "10px";

      copyButton.onclick = () => copyToClipboard(number);

      let numberContainer = document.createElement("div");
      numberContainer.appendChild(numberSpan);
      numberContainer.style.marginTop = "10px";
      numberContainer.style.alignItems = "center";
      numberContainer.style.justifyContent = "space-between";
      numberContainer.style.display = "flex";
      numberContainer.style.width = "64%";

      numberContainer.appendChild(copyButton);

      cellNumbers.appendChild(numberContainer);
    });
  });

  panel.appendChild(table);
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)

    .catch((err) => {
      console.error("Could not copy text: ", err);
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
