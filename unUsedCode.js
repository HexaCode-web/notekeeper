//--------------------------------------------------------------------------------------------------------------------------------------------
//FOR openKB function
//--------------------------------------------------------------------------------------------------------------------------------------------
// const addOpenKB = () => {
//   const options = [
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/add-extra-couriers?pli=1&authuser=1",
//       label: "Large order",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/missing-wrong-items-or-order?pli=1&authuser=1",
//       label: "Missing item",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-spillage?pli=1&authuser=1",
//       label: "Spilled/Damaged",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/ask-to-re-arrange-the-orders?pli=1&authuser=1",
//       label: "Stacked order, ask for dropoff",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
//       label: "Address Change (Changed address)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
//       label: "Address Change (Incomplete address)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
//       label: "Address Change (Unable to drop off)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
//       label: "Change order details",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/rider-feedback?pli=1&authuser=1",
//       label: "Customer - Feedback",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/smoking-service?pli=1&authuser=1",
//       label: "ID check",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/unable-to-access-customer-buildingfloor?pli=1&authuser=1",
//       label:
//         "Customer - Issue accessing the premises (Cannot access the premises)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-take-the-next-action?pli=1&authuser=1",
//       label: "Customer - Issue accessing the premises (Unable to drop off)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable?pli=1&authuser=1",
//       label: "Unable to contact (Unreachable customer)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
//       label: "Unable to contact (Unreachable customer - No pin code)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
//       label: "Wrong address/pinpoint (Address is wrong)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-delivery-address-issues?pli=1&authuser=1",
//       label: "Wrong address/pinpoint (Unable to drop off)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable?pli=1&authuser=1",
//       label: "Unable to find location",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/missing-wrong-items-or-order?pli=1&authuser=1",
//       label: "Refuse to accept the order (Wrong order)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-never-ordered-from-talabat?pli=1&authuser=1",
//       label: "Refuse to accept the order (Prank order)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-changed-his-mind?authuser=1",
//       label: "Refuse to accept the order (Requested to be canceled)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-by-another-courier-duplicate-order?pli=1&authuser=1",
//       label: "Refuse to accept the order (Duplicate order)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-changed-promised-delivery-time-voucher-issues?authuser=1",
//       label: "Refuse to accept the order (Voucher issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
//       label:
//         "Refuse to accept the order (Cx is not aware of order’s modification)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-closed?pli=1&authuser=1",
//       label: "Closed",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
//       label: "Device issue",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
//       label: "Does not have order",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/vendor-refuses-to-return-the-money?pli=1&authuser=1",
//       label: "Partner - Feedback",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-access-the-vendor-premises?pli=1&authuser=1",
//       label: "Issue accessing the premises (Cannot access the premises)",
//     },

//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-cant-take-the-next-action?pli=1&authuser=1",
//       label: "Issue accessing the premises (Unable to pick up)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/late-preparation?pli=1&authuser=1",
//       label: "Late preparation",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-amount-modification?pli=1&authuser=1",
//       label: "Order modification",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-picked-up-by-another-courier?pli=1&authuser=1",
//       label: "Order taken by other rider",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-product-unavailable?pli=1&authuser=1",
//       label: "Product unavailable",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/vendor-wont-prepare-the-order?pli=1&authuser=1",
//       label: "Refuse to prepare the order",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/courier-unable-to-find-the-vendor?pli=1&authuser=1",
//       label: "Unable to locate the address",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-accident-vehicle-issue?pli=1&authuser=1",
//       label: "Accident",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/out-of-scope-cases?pli=1&authuser=1",
//       label: "Asks for order assignment",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
//       label: "App issue (Cannot see order details)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
//       label: "App issue (Cannot pick up / drop off due to a tech issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/troubleshooting?pli=1&authuser=1",
//       label: "App issue (Unable to take a break)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
//       label: "App issue (Rider / Pin code not working",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/delivery-pin-code?pli=1&authuser=1",
//       label: "App issue (Customer- Pin code not recived)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/break?authuser=1",
//       label: "Break status",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/odb?&pli=1&authuser=1",
//       label: "Break request (Regular break)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/tmp?pli=1&authuser=1",
//       label: "Break request (Temporary/paid break)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/couriers-contact-protocol?pli=1&authuser=1",
//       label: "Call back request",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/tmp?pli=1&authuser=1",
//       label: "COD issue (No change)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-payment-issues?pli=1&authuser=1",
//       label: "COD issue (Cx wants to pay only partially)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-refusal/customer-refusal-payment-issues?pli=1&authuser=1",
//       label: "COD issue (Hijacked order)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-clicked-through?pli=1&authuser=1",
//       label: "Clicked through",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/break-process/break?pli=1&authuser=1",
//       label: "End break",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/courier-accident-vehicle-issue?pli=1&authuser=1",
//       label: "Equipment issue",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/out-of-scope-cases?pli=1&authuser=1",
//       label: "Shift adjustment",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (Due to distance (Pick-up))",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (Due to distance (Drop-off))",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (JO boycott)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/bad-weather?pli=1&authuser=1",
//       label: "Not willing to do the order (Due to weather)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (Order near ending time)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (Health issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (No cash to pay for the order)",
//     },

//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/end-shift?pli=1&authuser=1",
//       label: "Not willing to do the order (Personal emergency/family issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (No reason/Courier refusal)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal?pli=1&authuser=1",
//       label: "Not willing to do the order (Rider is arrested/visa issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal/kw-highway-issue?authuser=1",
//       label: "Not willing to do the order (Bike rider will cross a highway)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/cases/customer-wants-to-change-to-self-pickup?pli=1&authuser=1",
//       label: "Updating status (Cx picked up the order by himself/herself)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/mantras/return-trip?pli=1&authuser=1",
//       label: "Updating status (Order has been returned back to the vendor)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-after-cancellation?pli=1&authuser=1",
//       label: "Updating status (Order has been delivered after cancellation)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/bad-weather?pli=1&authuser=1",
//       label: "Updating status (Informing order is late due to weather)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/complete-order-automatically?pli=1&authuser=1",
//       label: "Updating status (Order is completed by the system)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/order-was-delivered-by-another-courier-duplicate-order?pli=1&authuser=1",
//       label: "Updating status (Order is delivered by Vendor’s own rider)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/customer/mantras/customer-is-unreachable",
//       label: "Updating status (Waiting for the Cst/Cst is not coming outside)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/cases/late-preparation",
//       label: "Updating status (Order - packing/Sealing issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/vendor/mantras/test-orders",
//       label: "Updating status (Order is a test order)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/cases/end-shift?pli=1&authuser=1",
//       label: "Updating status (Personal/Family issue)",
//     },
//     {
//       value:
//         "https://sites.google.com/view/disp-kb-bpo/dispatching/courier/mantras/courier-refusal",
//       label: "Updating status (Health issue)",
//     },
//   ];

//   const optionsHtml = options
//     .map(
//       (option) =>
//         `<div class="dropdown-item" data-value="${option.value}" data-label="${option.label}" style="padding: 10px; cursor: pointer;">${option.label}</div>`
//     )
//     .join("");

//   const newElement = document.createElement("div");
//   newElement.style.width = "70%";
//   newElement.style.margin = "auto";
//   newElement.style.marginTop = "10px";
//   newElement.innerHTML = `
//     <div class="container" style="display: flex; gap: 20px;">
//       <div class="searchTemplatesContainer"style="width: 100%;">
//         <div class="container" style="position: relative;">
//           <div class="dropdown">
//             <input type="text" class="dropdown-search" placeholder="Search..." style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
//             <div class="dropdown-menu" style="position: absolute; top: 100%; left: 0; width: 100%; border: 1px solid #ddd; border-top: none; max-height: 200px; overflow-y: auto; background: #fff; display: none;">
//               ${optionsHtml}
//             </div>
//           </div>
//         </div>
//       </div>
//       <button type="button" class="ant-btn button" id="openKbButton" style=" background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
//         Open in KB
//       </button>
//     </div>
//   `;

//   const interval = 100;
//   const checkInterval = setInterval(() => {
//     const targetNode = document.querySelector('[class*="infoPanelContainer"]');
//     if (targetNode) {
//       clearInterval(checkInterval);
//       if (targetNode.firstChild) {
//         targetNode.insertBefore(newElement, targetNode.firstChild);
//       } else {
//         targetNode.appendChild(newElement);
//       }

//       // Add event listener to the button
//       const button = document.getElementById("openKbButton");
//       button.addEventListener("click", () => {
//         const selectedItem = document.querySelector(".dropdown-item.selected");
//         if (selectedItem) {
//           window.open(selectedItem.dataset.value, "_blank");
//         } else {
//           alert("Please select an option.");
//         }
//       });

//       // Add event listener for the search input
//       const searchInput = document.querySelector(".dropdown-search");
//       searchInput.addEventListener("input", () => {
//         const filter = searchInput.value.toLowerCase();
//         const items = document.querySelectorAll(".dropdown-item");
//         items.forEach((item) => {
//           const text = item.textContent.toLowerCase();
//           item.style.display = text.includes(filter) ? "block" : "none";
//         });
//       });

//       // Add event listener for dropdown items
//       const dropdownItems = document.querySelectorAll(".dropdown-item");
//       dropdownItems.forEach((item) => {
//         item.addEventListener("click", () => {
//           // Update input value with selected item's label
//           const input = document.querySelector(".dropdown-search");
//           input.value = item.dataset.label;

//           // Highlight the selected item
//           dropdownItems.forEach((i) => i.classList.remove("selected"));
//           item.classList.add("selected");

//           // Hide the dropdown menu
//           document.querySelector(".dropdown-menu").style.display = "none";
//         });
//       });

//       // Show dropdown menu on focus
//       const dropdownSearch = document.querySelector(".dropdown-search");
//       dropdownSearch.addEventListener("focus", () => {
//         document.querySelector(".dropdown-menu").style.display = "block";
//       });

//       // Hide dropdown menu on blur
//       dropdownSearch.addEventListener("blur", () => {
//         setTimeout(() => {
//           document.querySelector(".dropdown-menu").style.display = "none";
//         }, 100);
//       });
//     }
//   }, interval);
// };
// const getRiderName = () => {
//   const agentMessages = allAgentMessages(); // Get all agent messages
//   const riderNames = [];
//   console.log(agentMessages);
//   // Regular expression to match the name between "مرحبا" and "!"
//   const regex = /مرحبا\s+(.*?)\s*!/;

//   agentMessages.forEach((message) => {
//     if (containsWhitelistWord(message, ["شاركنا"])) {
//       // Match the name using the regular expression
//       const match = message.match(regex);

//       if (match && match[1]) {
//         const riderName = match[1].trim(); // Extract the name and trim it
//         riderNames.push(riderName); // Collect rider name
//         console.log(`Rider Name: ${riderName}`);
//       } else {
//         console.log("No name found in this message.");
//       }
//     }
//   });

//   if (riderNames.length > 0) {
//     activeRiderName = riderNames[0]; // Return all extracted rider names
//   } else {
//     console.log("No names found in any message.");
//     return [];
//   }
// };
