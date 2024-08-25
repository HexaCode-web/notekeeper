import { differenceInSeconds } from "date-fns";

//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR DECIDING THE FUNCTION TO USE
//--------------------------------------------------------------------------------------------------------------------------------------------
var currentUrl = window.location.href.toLowerCase();

let enableExtension;
async function main() {
  if (
    currentUrl.includes("herocare") ||
    currentUrl.includes("bakeoffice") ||
    currentUrl.includes("localhost")
  ) {
    await fetchData();
  }

  if (enableExtension === false) {
    console.log("Extension is disabled");
    return;
  }
  console.log("Extension is enabled");

  if (currentUrl.includes("bakeoffice")) {
    startCheckingForElement("#orderId", (mutationsList, observer) => {
      watchClicks(`li[heading="Last Orders"]`);
      checkForWrapper();
      PDTCalc();
      getPreviousSMS();
    });
  }

  if (currentUrl.includes("localhost")) {
    setInterval(() => {
      BreaksTimer(), hideEndChat();
    }, 1000);
  }
  //UNDER DEVELOPMENT
  if (currentUrl.includes("localhost")) {
    startCheckingForElement(
      '[class*="ticketList"]',
      (mutationsList, observer) => {
        markChats();
      }
    );
    // addOpenKB();
    startCheckingForElement(
      '[data-testid="container-com.plugin.chat-box-view"]',
      (mutationsList, observer) => {
        checkForHold();
        checkForClosure();
        checkForQuestion();
        checkForRedispatch();
        attachRedispatchLabel();
      }
    );
  }
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
//FOR FetchingData function
//--------------------------------------------------------------------------------------------------------------------------------------------
const fetchData = async () => {
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

      resolve(); // Resolve when done
    });
  });
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR openKB function
//--------------------------------------------------------------------------------------------------------------------------------------------
const addOpenKB = () => {
  const options = [
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/add-extra-couriers?pli=1&authuser=1",
      label: "Large order",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/missing-wrong-items-or-order?pli=1&authuser=1",
      label: "Missing item",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-spillage?pli=1&authuser=1",
      label: "Spilled/Damaged",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/ask-to-re-arrange-the-orders?pli=1&authuser=1",
      label: "Stacked order, ask for dropoff",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
      label: "Address Change (Changed address)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
      label: "Address Change (Incomplete address)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
      label: "Address Change (Unable to drop off)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
      label: "Change order details",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/rider-feedback?pli=1&authuser=1",
      label: "Customer - Feedback",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/smoking-service?pli=1&authuser=1",
      label: "ID check",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/unable-to-access-customer-buildingfloor?pli=1&authuser=1",
      label:
        "Customer - Issue accessing the premises (Cannot access the premises)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-take-the-next-action?pli=1&authuser=1",
      label: "Customer - Issue accessing the premises (Unable to drop off)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable?pli=1&authuser=1",
      label: "Unable to contact (Unreachable customer)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
      label: "Unable to contact (Unreachable customer - No pin code)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
      label: "Wrong address/pinpoint (Address is wrong)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
      label: "Wrong address/pinpoint (Unable to drop off)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable?pli=1&authuser=1",
      label: "Unable to find location",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/missing-wrong-items-or-order?pli=1&authuser=1",
      label: "Refuse to accept the order (Wrong order)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-never-ordered-from-talabat?pli=1&authuser=1",
      label: "Refuse to accept the order (Prank order)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-changed-his-mind?authuser=1",
      label: "Refuse to accept the order (Requested to be canceled)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-by-another-courier-duplicate-order?pli=1&authuser=1",
      label: "Refuse to accept the order (Duplicate order)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-changed-promised-delivery-time-voucher-issues?authuser=1",
      label: "Refuse to accept the order (Voucher issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
      label:
        "Refuse to accept the order (Cx is not aware of order’s modification)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-closed?pli=1&authuser=1",
      label: "Closed",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
      label: "Device issue",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
      label: "Does not have order",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/vendor-refuses-to-return-the-money?pli=1&authuser=1",
      label: "Partner - Feedback",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-access-the-vendor-premises?pli=1&authuser=1",
      label: "Issue accessing the premises (Cannot access the premises)",
    },

    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-take-the-next-action?pli=1&authuser=1",
      label: "Issue accessing the premises (Unable to pick up)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/late-preparation?pli=1&authuser=1",
      label: "Late preparation",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
      label: "Order modification",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-picked-up-by-another-courier?pli=1&authuser=1",
      label: "Order taken by other rider",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-product-unavailable?pli=1&authuser=1",
      label: "Product unavailable",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
      label: "Refuse to prepare the order",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/courier-unable-to-find-the-vendor?pli=1&authuser=1",
      label: "Unable to locate the address",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-accident-vehicle-issue?pli=1&authuser=1",
      label: "Accident",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/out-of-scope-cases?pli=1&authuser=1",
      label: "Asks for order assignment",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
      label: "App issue (Cannot see order details)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
      label: "App issue (Cannot pick up / drop off due to a tech issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
      label: "App issue (Unable to take a break)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
      label: "App issue (Rider / Pin code not working",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
      label: "App issue (Customer- Pin code not recived)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/break?authuser=1",
      label: "Break status",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/odb?&pli=1&authuser=1",
      label: "Break request (Regular break)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/tmp?pli=1&authuser=1",
      label: "Break request (Temporary/paid break)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/couriers-contact-protocol?pli=1&authuser=1",
      label: "Call back request",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/tmp?pli=1&authuser=1",
      label: "COD issue (No change)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-payment-issues?pli=1&authuser=1",
      label: "COD issue (Cx wants to pay only partially)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-payment-issues?pli=1&authuser=1",
      label: "COD issue (Hijacked order)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-clicked-through?pli=1&authuser=1",
      label: "Clicked through",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/break?pli=1&authuser=1",
      label: "End break",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-accident-vehicle-issue?pli=1&authuser=1",
      label: "Equipment issue",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/out-of-scope-cases?pli=1&authuser=1",
      label: "Shift adjustment",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (Due to distance (Pick-up))",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (Due to distance (Drop-off))",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (JO boycott)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/bad-weather?pli=1&authuser=1",
      label: "Not willing to do the order (Due to weather)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (Order near ending time)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (Health issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (No cash to pay for the order)",
    },

    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/end-shift?pli=1&authuser=1",
      label: "Not willing to do the order (Personal emergency/family issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (No reason/Courier refusal)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
      label: "Not willing to do the order (Rider is arrested/visa issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal/kw-highway-issue?authuser=1",
      label: "Not willing to do the order (Bike rider will cross a highway)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-wants-to-change-to-self-pickup?pli=1&authuser=1",
      label: "Updating status (Cx picked up the order by himself/herself)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/mantras/return-trip?pli=1&authuser=1",
      label: "Updating status (Order has been returned back to the vendor)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-after-cancellation?pli=1&authuser=1",
      label: "Updating status (Order has been delivered after cancellation)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/bad-weather?pli=1&authuser=1",
      label: "Updating status (Informing order is late due to weather)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/complete-order-automatically?pli=1&authuser=1",
      label: "Updating status (Order is completed by the system)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-by-another-courier-duplicate-order?pli=1&authuser=1",
      label: "Updating status (Order is delivered by Vendor’s own rider)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable",
      label: "Updating status (Waiting for the Cst/Cst is not coming outside)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/late-preparation",
      label: "Updating status (Order - packing/Sealing issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/mantras/test-orders",
      label: "Updating status (Order is a test order)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/end-shift?pli=1&authuser=1",
      label: "Updating status (Personal/Family issue)",
    },
    {
      value:
        "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal",
      label: "Updating status (Health issue)",
    },
  ];

  const optionsHtml = options
    .map(
      (option) =>
        `<div class="dropdown-item" data-value="${option.value}" data-label="${option.label}" style="padding: 10px; cursor: pointer;">${option.label}</div>`
    )
    .join("");

  const newElement = document.createElement("div");
  newElement.style.width = "70%";
  newElement.style.margin = "auto";
  newElement.style.marginTop = "10px";
  newElement.innerHTML = `
    <div class="container" style="display: flex; gap: 20px;">
      <div class="searchTemplatesContainer"style="width: 100%;">
        <div class="container" style="position: relative;">
          <div class="dropdown">
            <input type="text" class="dropdown-search" placeholder="Search..." style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
            <div class="dropdown-menu" style="position: absolute; top: 100%; left: 0; width: 100%; border: 1px solid #ddd; border-top: none; max-height: 200px; overflow-y: auto; background: #fff; display: none;">
              ${optionsHtml}
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="ant-btn button" id="openKbButton" style=" background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
        Open in KB
      </button>
    </div>
  `;

  const interval = 100;
  const checkInterval = setInterval(() => {
    const targetNode = document.querySelector('[class*="infoPanelContainer"]');
    if (targetNode) {
      clearInterval(checkInterval);
      if (targetNode.firstChild) {
        targetNode.insertBefore(newElement, targetNode.firstChild);
      } else {
        targetNode.appendChild(newElement);
      }

      // Add event listener to the button
      const button = document.getElementById("openKbButton");
      button.addEventListener("click", () => {
        const selectedItem = document.querySelector(".dropdown-item.selected");
        if (selectedItem) {
          window.open(selectedItem.dataset.value, "_blank");
        } else {
          alert("Please select an option.");
        }
      });

      // Add event listener for the search input
      const searchInput = document.querySelector(".dropdown-search");
      searchInput.addEventListener("input", () => {
        const filter = searchInput.value.toLowerCase();
        const items = document.querySelectorAll(".dropdown-item");
        items.forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(filter) ? "block" : "none";
        });
      });

      // Add event listener for dropdown items
      const dropdownItems = document.querySelectorAll(".dropdown-item");
      dropdownItems.forEach((item) => {
        item.addEventListener("click", () => {
          // Update input value with selected item's label
          const input = document.querySelector(".dropdown-search");
          input.value = item.dataset.label;

          // Highlight the selected item
          dropdownItems.forEach((i) => i.classList.remove("selected"));
          item.classList.add("selected");

          // Hide the dropdown menu
          document.querySelector(".dropdown-menu").style.display = "none";
        });
      });

      // Show dropdown menu on focus
      const dropdownSearch = document.querySelector(".dropdown-search");
      dropdownSearch.addEventListener("focus", () => {
        document.querySelector(".dropdown-menu").style.display = "block";
      });

      // Hide dropdown menu on blur
      dropdownSearch.addEventListener("blur", () => {
        setTimeout(() => {
          document.querySelector(".dropdown-menu").style.display = "none";
        }, 100);
      });
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
let chatHasRedispatch = [false, false, false];
let lastNotificationTimes = {};
let activeChat = 0;
let holdWhiteList = JSON.parse(localStorage.getItem("holdWhiteList"));
let questionWhiteList = JSON.parse(localStorage.getItem("questionWhiteList"));
let closureWhiteList = JSON.parse(localStorage.getItem("closureWhiteList"));
function containsWhitelistWord(message, whitelist) {
  return whitelist.some((word) => message.includes(word));
}
const checkForHold = () => {
  if (containsWhitelistWord(lastAgentMessage(), holdWhiteList)) {
    console.log(`chat ${activeChat} has hold`);
    chatHasHold[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has  no hold`);
    chatHasHold[activeChat] = false;
  }
};
const checkForQuestion = () => {
  if (containsWhitelistWord(lastAgentMessage(), questionWhiteList)) {
    console.log(`chat ${activeChat} has question`);
    chatHasQuestion[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has no question`);
    chatHasQuestion[activeChat] = false;
  }
};

const checkForClosure = () => {
  if (containsWhitelistWord(lastAgentMessage(), closureWhiteList)) {
    console.log(`chat ${activeChat} has closure`);
    chatHasClosure[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has  no closure`);
    chatHasClosure[activeChat] = false;
  }
};
const checkForRedispatch = () => {
  const agentMessages = allAgentMessages();

  let redispatchFound = false;
  agentMessages.forEach((message) => {
    if (containsWhitelistWord(message, ["و تحويل", "تم تحويل "])) {
      console.log(`chat ${activeChat} has  redispatch action`);

      redispatchFound = true;
    }
  });

  if (redispatchFound) {
    chatHasRedispatch[activeChat] = true;
  } else {
    console.log(`chat ${activeChat} has no redispatch action`);
    chatHasRedispatch[activeChat] = false;
  }
};
const attachRedispatchLabel = () => {
  // Find the chat container
  const chatContainer = document.querySelector(
    '[data-testid="container-com.plugin.chat-box-view"]'
  );

  if (chatContainer) {
    // Find the existing label if it exists
    let label = chatContainer.querySelector(".redispatch-label");

    if (chatHasRedispatch[activeChat]) {
      if (!label) {
        // Create the label element
        label = document.createElement("div");
        label.classList.add("redispatch-label");
        label.textContent =
          "Redispatch Action detected, check BOA for delay sms in case redispatch";

        // Style the label (you can adjust these styles as needed)
        label.style.color = "yellow";
        label.style.textAlign = "center";
        label.style.backgroundColor = "green";
        label.style.width = "100%";
        label.style.padding = "5px";
        label.style.marginBottom = "10px"; // Adjusted margin to separate from chat content
        label.style.fontWeight = "bold";
        label.style.borderRadius = "5px";
        label.style.borderTopLeftRadius = "0px"; // Adjusted margin to separate from chat content
        label.style.borderTopRightRadius = "0px"; // Adjusted margin to separate from chat content
        label.style.display = "inline-block";
        label.style.position = "relative"; // Ensure it's not fixed or absolute

        // Insert the label at the top of the chat container
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

// Call this function whenever you need to attach the label

const markChats = () => {
  const activeChats = document.querySelectorAll('[data-testid^="ticket"]');
  if (activeChats.length === 1 && activeChat === 0) {
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

      startCheckingForElement(
        `#${ChatWrapper.id}`,
        (mutationsList, observer) => {
          const time = ChatWrapper.querySelector(".ant-progress-text")
            .querySelector("div")
            .textContent.trim();
          const [minutes, seconds] = time.split(":").map(Number);
          const totalSeconds = minutes * 60 + seconds;
          const currentTime = Date.now();
          const hasUnread = ChatWrapper.querySelector('[class*="badge"]')
            ? true
            : false;
          let waitTime;

          let chatStatus = chatHasHold[ChatWrapper.id]
            ? 1
            : chatHasClosure[ChatWrapper.id]
            ? 2
            : chatHasQuestion[ChatWrapper.id]
            ? 3
            : 4;
          if (hasUnread) {
            waitTime = 90; // Default value when there are unread messages
          } else {
            waitTime =
              chatStatus === 1
                ? 10
                : chatStatus === 2
                ? 150
                : chatStatus === 3
                ? 60
                : 90;
          }
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
            const coolDownTime = sameType ? 20000 : 0;

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
                  ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/hold%20no%20bg.png?alt=media&token=461b41e7-ba28-40fb-9a37-677dc964cfef"
                  : chatStatus === 2
                  ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/Close_Chat-removebg-preview%20(1).png?alt=media&token=8a4008e2-d62d-4a72-8e7a-399830b9cd1c"
                  : chatStatus === 3
                  ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/question%20no%20bg.png?alt=media&token=2259a230-5b96-4435-93e0-a8990d6da536"
                  : "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/silence%20no%20bg.png?alt=media&token=e5b18fc6-7ef9-4b23-8c72-e1aaab0ef694";

              sendNotification(
                chatText,
                hasUnread
                  ? "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/silence%20no%20bg.png?alt=media&token=e5b18fc6-7ef9-4b23-8c72-e1aaab0ef694"
                  : imageUrl
              );
            }
          }
        }
      );
    }

    // Cleanup: If a chat is removed, delete its notification time
    const chatIds = Array.from(activeChats).map(
      (chatWrapper) => chatWrapper.id
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
  return;
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
      doucment.querySelector("#CSNumbers-panel").appendChild(errorHeading);
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
