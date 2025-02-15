import { differenceInSeconds } from "date-fns";

//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR DECIDING THE FUNCTION TO USE
//--------------------------------------------------------------------------------------------------------------------------------------------
var currentUrl = window.location.href.toLowerCase();

let enableExtension;
let timeFrameSettings;
async function main() {
  if (
    currentUrl.includes("herocare") ||
    currentUrl.includes("bakeoffice") ||
    currentUrl.includes("localhost") ||
    currentUrl.includes("hurrier")
  ) {
    await fetchData();
  }

  if (enableExtension === false) {
    console.log("Extension is disabled");
    return;
  }
  console.log("Extension is enabled");
  // if (currentUrl.includes("hurrier")) {
  //   extractTimeChecks();
  //   // riderTimeChecks();
  // }
  if (currentUrl.includes("hurrier")) {
    const modifyDistance = localStorage.getItem("modifyDistance");
    console.log(modifyDistance);

    if (modifyDistance === "true") {
      startCheckingForElement(
        ".SideSheet-Content",
        (mutationsList, observer) => {
          const distances = document.querySelectorAll(
            'td[data-columnid="reach_to_step"]'
          );

          distances.forEach((distance) => {
            const distanceNumber = parseInt(distance.textContent, 10);

            // Check if the number is less than 5000
            if (distanceNumber < 5000) {
              // Generate a random number between 5000 and 10000
              const randomNumber =
                Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

              // Update the text content of the cell with the new random number
              distance.textContent = `${randomNumber}m`; // Add "m" if needed
              console.log(`Replaced ${distanceNumber} with ${randomNumber}`);
            }
          });
        }
      );
    }
  }
  // if (currentUrl.includes("bakeoffice")) {
  //   startCheckingForElement("#orderId", (mutationsList, observer) => {
  //     let checkInterval = setInterval(function () {
  //       let targetNode = document.querySelector(".yellow");
  //       if (targetNode) {
  //         clearInterval(checkInterval);
  //         targetNode.addEventListener("click", () => {
  //           watchClicks('li[heading="Last Orders"]');
  //           checkForWrapper();
  //           getPreviousSMS();
  //         });
  //       }
  //     }, 100);
  //     watchClicks(`li[heading="Last Orders"]`);
  //     checkForWrapper();
  //     getPreviousSMS();
  //   });
  // }

  // if (currentUrl.includes("herocare") || currentUrl.includes("localhost")) {
  //   const caseTicketElement = document.querySelector(
  //     'li[data-cy="cs-agent_side-bar-menu-Case Ticket"]'
  //   );
  //   if (caseTicketElement) {
  //     caseTicketElement.addEventListener("click", function () {
  //       checkForHold();
  //       checkForClosure();
  //       checkForQuestion();
  //       checkForRedispatch();
  //       attachRedispatchLabel();
  //     });
  //   }
  //   startCheckingForElement(
  //     '[data-testid="container-com.plugin.chat-box-view"]',
  //     (mutationsList, observer) => {
  //       //found in unUsedCode.js
  //       // getRiderName();
  //       checkForHold();
  //       checkForClosure();
  //       checkForQuestion();
  //       checkForRedispatch();
  //       attachRedispatchLabel();
  //     }
  //   );
  //   setInterval(() => {
  //     BreaksTimer(), hideEndChat();
  //   }, 1000);
  //   startCheckingForElement(
  //     '[class*="ticketList"]',
  //     (mutationsList, observer) => {
  //       markChats();
  //     },
  //     300
  //   );
  // }
  //UNDER DEVELOPMENT
  //found in unUsedCode.js
  // if (currentUrl.includes("herocare")) {
  // addOpenKB();
  // }
  //UNDER DEVELOPMENT
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
function startCheckingForElement(
  selector,
  callback,
  interval = 100,
  maxRetries = 50
) {
  let retries = 0;
  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector(selector);

    if (targetNode) {
      observeElement(selector, callback);
    }
  }, interval);
}
document.addEventListener("DOMContentLoaded", main);

//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR FetchingData function
//--------------------------------------------------------------------------------------------------------------------------------------------
const fetchData = async () => {
  timeFrameSettings = await chrome.storage.local.get(["allowTimeFrame"]);
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "FetchData" }, (response) => {
      localStorage.setItem(
        "closureWhiteList",
        JSON.stringify(response.Closure)
      );
      localStorage.setItem(
        "questionWhiteList",
        JSON.stringify(response.Question)
      );

      // Update enableExtension variable
      enableExtension = response.enableExtension;
      chrome.storage.sync.set({ enableExtension: response.enableExtension });

      localStorage.setItem("holdWhiteList", JSON.stringify(response.Hold));
      if (response.hideEndChat) {
        localStorage.setItem("endChatValue", "true");
      } else {
        localStorage.setItem("endChatValue", "false");
      }
      if (response.modifyDistance) {
        localStorage.setItem("modifyDistance", "true");
      } else {
        localStorage.setItem("modifyDistance", "false");
      }

      resolve(); // Resolve when done
    });
  });
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

let chatHasHold = [];
let chatHasClosure = [];
let chatHasQuestion = [];
let chatHasRedispatch = [false, false, false];
let lastNotificationTimes = {};
let activeRiders = {};
let activeChat = 0;
let holdWhiteList = JSON.parse(localStorage.getItem("holdWhiteList"));
let questionWhiteList = JSON.parse(localStorage.getItem("questionWhiteList"));
let closureWhiteList = JSON.parse(localStorage.getItem("closureWhiteList"));
function containsWhitelistWord(message, whitelist) {
  return whitelist.some((word) => message.includes(word));
}
const checkForHold = () => {
  if (containsWhitelistWord(lastAgentMessage(), holdWhiteList)) {
    console.log(`${activeChat} has hold`);
    chatHasHold[activeChat] = true;
  } else {
    console.log(`${activeChat} has  no hold`);
    chatHasHold[activeChat] = false;
  }
};

const checkForQuestion = () => {
  if (containsWhitelistWord(lastAgentMessage(), questionWhiteList)) {
    console.log(`${activeChat} has question`);
    chatHasQuestion[activeChat] = true;
  } else {
    console.log(`${activeChat} has no question`);
    chatHasQuestion[activeChat] = false;
  }
};

const checkForClosure = () => {
  if (containsWhitelistWord(lastAgentMessage(), closureWhiteList)) {
    console.log(`${activeChat} has closure`);
    chatHasClosure[activeChat] = true;
  } else {
    console.log(`${activeChat} has  no closure`);
    chatHasClosure[activeChat] = false;
  }
};
const checkForRedispatch = () => {
  const agentMessages = allAgentMessages();

  let redispatchFound = false;
  agentMessages.forEach((message) => {
    if (containsWhitelistWord(message, ["التحويل", "و تحويل", "تم تحويل "])) {
      console.log(`${activeChat} has  redispatch action`);

      redispatchFound = true;
    }
  });

  if (redispatchFound) {
    chatHasRedispatch[activeChat] = true;
  } else {
    chatHasRedispatch[activeChat] = false;
  }
};
const attachRedispatchLabel = () => {
  const chatContainer = document.querySelector(
    '[data-testid="container-com.plugin.chat-box-view"]'
  );

  if (chatContainer) {
    let label = chatContainer.querySelector(".redispatch-label");

    if (chatHasRedispatch[activeChat]) {
      if (!label) {
        label = document.createElement("div");
        label.classList.add("redispatch-label");
        label.textContent =
          "Redispatch Case detected, check Hurrier for delay sms in case redispatch";
        label.style.color = "yellow";
        label.style.textAlign = "center";
        label.style.backgroundColor = "green";
        label.style.width = "100%";
        label.style.padding = "5px";
        label.style.marginBottom = "10px";
        label.style.fontWeight = "bold";
        label.style.borderRadius = "5px";
        label.style.borderTopLeftRadius = "0px";
        label.style.borderTopRightRadius = "0px";
        label.style.position = "relative";
        chatContainer.insertBefore(label, chatContainer.firstChild);
      }
    } else {
      if (label) {
        // Remove the label if it exists and redispatch is false
        label.remove();
      }
    }
  }
};

const markChats = () => {
  if (timeFrameSettings.allowTimeFrame === false) {
    console.log("timeFrame is disabled");
    return;
  }
  const activeChats = document.querySelectorAll('[data-testid^="ticket"]');
  if (activeChats.length === 0) {
    activeChat = 0;
  }
  if (activeChats.length === 1) {
    const firstChat = activeChats[0];
    if (firstChat && firstChat.id) {
      activeChat = firstChat.id;
    }
  }
  activeChats.forEach((ChatWrapper) => {
    if (!ChatWrapper.dataset.listenerAdded) {
      ChatWrapper.dataset.listenerAdded = "true";
      ChatWrapper.addEventListener("click", function () {
        activeChat = ChatWrapper.id;
      });
    }
    if (!ChatWrapper.id) {
      ChatWrapper.id = `chat${Math.floor(Math.random() * 100000)}`;

      activeRiders[ChatWrapper.id] = {
        riderName: ChatWrapper.querySelector(".ant-typography").textContent,
        date: new Date(),
        active: true,
      };
      chrome.storage.local.set({ activeRiders: JSON.stringify(activeRiders) });

      startCheckingForElement(
        `#${ChatWrapper.id}`,
        (mutationsList, observer) => {
          const time = ChatWrapper.querySelector(".ant-progress-text")
            .querySelector("div")
            .textContent.trim();
          const [minutes, seconds] = time.split(":").map(Number);
          const totalSeconds = minutes * 60 + seconds;
          const currentTime = Date.now();
          let chatStatus = chatHasHold[ChatWrapper.id]
            ? 1
            : chatHasClosure[ChatWrapper.id]
            ? 2
            : chatHasQuestion[ChatWrapper.id]
            ? 3
            : 4;

          let waitTime =
            chatStatus === 1
              ? 10
              : chatStatus === 2
              ? 149
              : chatStatus === 3
              ? 60
              : 135;
          const maxThreshold =
            chatStatus === 1
              ? 0
              : chatStatus === 2
              ? 120
              : chatStatus === 3
              ? 30
              : 60;

          if (totalSeconds <= waitTime && totalSeconds >= maxThreshold) {
            const lastNotification = lastNotificationTimes[ChatWrapper.id];
            const sameType =
              lastNotification && lastNotification.Type === chatStatus;

            const coolDownTime = sameType ? 15000 : 0;

            if (
              !lastNotification ||
              currentTime - lastNotification.currentTime > coolDownTime
            ) {
              lastNotificationTimes[ChatWrapper.id] = {
                currentTime,
                Type: chatStatus,
              };

              const chatText =
                ChatWrapper.querySelector(".ant-typography").textContent;
              const imageUrl =
                chatStatus === 1
                  ? "icons/hold.png"
                  : chatStatus === 2
                  ? "icons/Close_Chat.png"
                  : chatStatus === 3
                  ? "icons/question.png"
                  : "icons/Silence.png";
              sendNotification(chatText, imageUrl);
            }
          }
        }
      );
    }

    // Cleanup: If a chat is removed, delete its notification time
    const chatIds = Array.from(activeChats).map(
      (chatWrapper) => chatWrapper.id
    );
    console.log(chatIds.length);

    Object.keys(activeRiders).forEach((id) => {
      if (!chatIds.includes(id)) {
        activeRiders[id].active = false;
        chrome.storage.local.set({
          activeRiders: JSON.stringify(activeRiders),
        });
      }
    });
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
      const senderDetail = senderDetailEL.textContent.toLowerCase();

      if (senderDetail.endsWith("_xceed")) {
        let messageContent = "";

        const paragraphs = container.querySelectorAll(
          '[data-testid="chat-bubble-paragraph"]'
        );

        paragraphs.forEach((p) => {
          messageContent += p.innerText.trim() + " ";
        });

        agentMessages.push(messageContent);
      }
    }
  });

  if (agentMessages.length > 0) {
    return agentMessages[agentMessages.length - 1];
  } else {
    return "";
  }
}
function allAgentMessages() {
  const messageContainers = document.querySelectorAll(
    '[data-testid="chat-bubble"]'
  );

  let agentMessages = [];

  messageContainers.forEach((container) => {
    // Find the class that includes "container" as part of the class name
    const containerClass = Array.from(container.classList).find((className) =>
      className.includes("container")
    );

    // If a matching container class is found, proceed
    if (containerClass) {
      const computedStyle = window.getComputedStyle(container);

      const textAlign = computedStyle.textAlign;

      if (textAlign === "right") {
        let messageContent = "";

        const paragraphs = container.querySelectorAll(
          '[data-testid="chat-bubble-paragraph"]'
        );

        paragraphs.forEach((p) => {
          messageContent += p.innerText.trim() + " "; // Append each paragraph's text
        });

        agentMessages.push(messageContent.trim());
      }
    }
  });

  // Return the collected agent messages, or an empty string if none found
  if (agentMessages.length > 0) {
    return agentMessages;
  } else {
    return [];
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
//FOR hiding end chat
//--------------------------------------------------------------------------------------------------------------------------------------------
const hideEndChat = () => {
  const targetNode = document.querySelector('[data-testid="end-chat-btn"]');

  if (targetNode) {
    const endChatValue = localStorage.getItem("endChatValue");

    if (endChatValue === "true") {
      targetNode.remove();
    }
  }
};
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
          <span class="bold" style="color: #36c6d3;" id="DelaySMSTime"></span>
            For More Time Data check Hurrier
        </h5>
      </div>
    </div>
  `;

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

const extendBuffer = () => {
  if (currentUrl.includes("ae.me")) {
    return Array.from(
      document.querySelectorAll(
        ".sc-cmaqmh.kgXnBc.Tag-Label.Tag-Label--on-hold.Tag-Label--small"
      )
    ).some((node) => node.innerHTML.includes("Groceries"));
  }
  return false;
};

const getTimeDifferenceInMinutes = (orderDate, pdtDate) =>
  Math.floor((pdtDate - orderDate) / 60000);

const halveMinutesAndHandleSeconds = (totalMinutes) => ({
  halvedMinutes: Math.floor(totalMinutes / 2),
  halvedSeconds: totalMinutes % 2 === 1 ? 30 : 0,
});

const getTimeFromElement = (element) => {
  const checkTime = element.querySelector(".sc-igZIGL").textContent; // Time like "Thu 05 Sep 08:24pm"
  const timeMatch = checkTime.match(/(\d{2}):(\d{2})([ap]m)/);
  if (timeMatch) {
    return {
      hours: parseInt(timeMatch[1], 10),
      minutes: parseInt(timeMatch[2], 10),
      period: timeMatch[3],
    };
  }
  return null;
};

const convertToDateObject = (hours, minutes, period) => {
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to zero
  return date;
};

const addMinutesToDate = (date, minutes) => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

const formatTimeForHurrier = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let period = hours >= 12 ? "pm" : "am";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}${period}`;
};

const formatTimeForPDT = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes}${period}`;
};

const calculateHalfPDT = (orderTime, pdtTime) => {
  const orderDate = convertToDateObject(
    orderTime.hours,
    orderTime.minutes,
    orderTime.period
  );
  const pdtDate = convertToDateObject(
    pdtTime.hours,
    pdtTime.minutes,
    pdtTime.period
  );
  const minutesDiff = getTimeDifferenceInMinutes(orderDate, pdtDate);
  const { halvedMinutes, halvedSeconds } =
    halveMinutesAndHandleSeconds(minutesDiff);
  const halfPDTDate = new Date(orderDate);
  halfPDTDate.setMinutes(orderDate.getMinutes() + halvedMinutes);
  halfPDTDate.setSeconds(halvedSeconds); // Set seconds for half PDT
  return halfPDTDate;
};

const extractTimeChecks = () => {
  const interval = 300;
  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector(".sc-kZkypy.hSGTDP");
    if (targetNode) {
      clearInterval(checkInterval);
      const itemChecks = targetNode.querySelectorAll(".sc-dfauwV.uMHoj");
      let orderTimePlaced;

      itemChecks.forEach((item) => {
        extendBuffer();
        const checkLabel = item.querySelector(".sc-hZDbVM").textContent;
        const timeData = getTimeFromElement(item);
        if (timeData && checkLabel === "Ordered at") {
          orderTimePlaced = timeData;
        }
        if (timeData && checkLabel === "PDT") {
          const pdtTime = timeData;
          const halfPDTDate = calculateHalfPDT(orderTimePlaced, pdtTime);
          const halvedPDTTime = formatTimeForHurrier(halfPDTDate);

          const updatedDate = addMinutesToDate(
            convertToDateObject(pdtTime.hours, pdtTime.minutes, pdtTime.period),
            extendBuffer() ? 30 : 10
          );
          const updatedTime = formatTimeForPDT(updatedDate);

          displayTime(
            item.querySelector(".sc-igZIGL"),
            halvedPDTTime,
            updatedTime
          );
        }
      });
    }
  }, interval);
};

const displayTime = (originalElement, halvedTime, updatedTime) => {
  const timeChecksWrapper =
    originalElement.closest(".sc-dfauwV.uMHoj").parentElement;
  const secondWrapper = document.querySelector(
    ".sc-eqUAAy.ga-DBet.AccordionContent-Content.AccordionContent-Content--expanded.AccordionContent-Root.sc-isexnS.cHnZj"
  );

  const createTimeElement = (label, time, id) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="sc-dfauwV uMHoj" id=${id} style="margin-bottom: 50px;
        padding: 10px;
        border: 2px solid rgb(220, 220, 220);
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div class="sc-fPXMVe giIjDg Typography-Root sc-hZDbVM rkZxY" 
        style="font-weight: bolder;font-size: 20px;">${label}</div>
        <div class="sc-fPXMVe giIjDg Typography-Root sc-igZIGL kmKscO"  
         style="font-weight: bolder;font-size: 24px; color:black">${time}</div>
      </div>
    `;
    return div;
  };

  const halvedTimeElement = createTimeElement(
    "Delay SMS",
    halvedTime,
    "halfPDT"
  );
  const updatedTimeElement = createTimeElement(
    `PDT + ${extendBuffer() ? "30" : "10"}`,
    updatedTime,
    "PDT"
  );

  timeChecksWrapper.appendChild(halvedTimeElement);
  timeChecksWrapper.appendChild(updatedTimeElement);
  secondWrapper.appendChild(halvedTimeElement.cloneNode(true));
  secondWrapper.appendChild(updatedTimeElement.cloneNode(true));
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR activeRider
//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR riders timeChecks
//--------------------------------------------------------------------------------------------------------------------------------------------
const riderTimeChecks = () => {
  return new Promise((resolve, reject) => {
    const interval = 1000;
    const checkInterval = setInterval(() => {
      const targetNodes = document.querySelectorAll(".circle");

      if (targetNodes.length > 0) {
        clearInterval(checkInterval);
        const extractedData = [];

        targetNodes.forEach((delivery) => {
          let courier;
          const table = delivery.querySelector("table");

          if (!table) {
            console.log("No table found within the target node.");
            return;
          }

          const rows = table.querySelectorAll(
            'tbody[data-testid="TableBodyRoot"] tr[data-rowid]'
          );

          rows.forEach((row) => {
            const event = row
              .querySelector('td[data-columnid="event"] div span a')
              ?.textContent.trim();
            const time = row
              .querySelector('td[data-columnid="time"] span')
              ?.textContent.trim();
            courier = row
              .querySelector('td[data-columnid="courierMeta"] button')
              ?.textContent.trim();

            chrome.storage.local.get(["activeRiders"], function (result) {
              if (result.activeRiders) {
                try {
                  const FetchedActiveRiders = JSON.parse(result.activeRiders);
                  console.log(FetchedActiveRiders);

                  Object.entries(FetchedActiveRiders).forEach(
                    ([chatId, activeRider]) => {
                      console.log(courier == activeRider.riderName);
                      if (!activeRider.active) {
                        const currentDate = new Date();
                        const differenceInMs =
                          currentDate - new Date(activeRider.date);
                        const differenceInMinutes = Math.floor(
                          differenceInMs / (1000 * 60)
                        );

                        if (differenceInMinutes > 8) {
                          const updatedActiveRiders = {
                            ...FetchedActiveRiders,
                          };

                          // Use the chatId to delete the inactive rider
                          delete updatedActiveRiders[chatId];

                          // Now update the chrome storage with the new data
                          chrome.storage.local.set({
                            activeRiders: JSON.stringify(updatedActiveRiders),
                          });
                          console.log(
                            "Rider marked as inactive and deleted:",
                            chatId
                          );
                        }
                      }
                    }
                  );
                } catch (error) {
                  console.error("Error parsing activeRiders:", error);
                }
              } else {
                console.log("No activeRiders found");
              }
            });
            if (
              event !== "Dispatched" &&
              event !== undefined &&
              event !== "Courier Notified" &&
              event !== "Queued" &&
              event !== "Cancelled"
            ) {
              extractedData.push({
                time,
                event,
                courier,
              });
            }
          });
        });

        console.log(extractedData);
        resolve(extractedData); // Resolve the promise with the extracted data
      }
    }, interval);
  });
};

//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR Previous SMS
//--------------------------------------------------------------------------------------------------------------------------------------------
const getPreviousSMS = () => {
  const Table = document
    .querySelector('[st-table="displaytaskLogHistory"]')
    .parentElement.querySelector(".tbody")
    .querySelector('[st-safe-src="orderLogs"]')
    .querySelector("tbody")
    .querySelectorAll("tr");
  const warningText = document.createElement("p");
  for (const row of Table) {
    const Content = row.cells[4].textContent.trim();
    const DelaySMSTime = document.querySelector("#DelaySMSTime");
    if (Content.includes("delay") || Content.includes("التأخير")) {
      warningText.innerHTML = "Delay SMS already sent";
      warningText.style.marginTop = "5px";
      warningText.style.marginBottom = "5px";
      warningText.style.color = "red";
      DelaySMSTime.appendChild(warningText);
      return;
    } else {
      warningText.innerHTML = "Delay SMS not sent";
      warningText.style.marginTop = "5px";
      warningText.style.marginBottom = "5px";
      warningText.style.color = "green";
      DelaySMSTime.appendChild(warningText);
    }
  }
};
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
  //error handling
  const finalRows = table.querySelectorAll("tbody tr");
  if (finalRows.length === 1) {
    const errorHeading = document.createElement("h2");
    errorHeading.textContent =
      "There is an error, check the numbers manually or refresh the page";
    errorHeading.style.textAlign = "center";
    errorHeading.style.color = "red";
    panel.appendChild(errorHeading);
  }
  finalRows.forEach(function (row, index) {
    if (index === 0) {
      return;
    }
    const customerName = row.cells[0].textContent;
    if (customerName === customerOriginalName) {
      panel.appendChild(table);
      return;
    } else {
      const errorHeading = document.createElement("h2");
      errorHeading.textContent =
        "There is an error, check the numbers manually or refresh the page";
      document.querySelector("#CSNumbers-panel").appendChild(errorHeading);
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)

    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}
