import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  where,
  deleteDoc,
  query,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA0C4OGS8vH2SF53BoqGsT1R0TO825pyL4",
  authDomain: "reduxhttp-c9911.firebaseapp.com",
  databaseURL: "https://reduxhttp-c9911-default-rtdb.firebaseio.com",
  projectId: "reduxhttp-c9911",
  storageBucket: "reduxhttp-c9911.appspot.com",
  messagingSenderId: "430215602167",
  appId: "1:430215602167:web:18614bfd0ec1bb05a7d8f2",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
chrome.runtime.onInstalled.addListener(() => {
  console.log("hi");
});
export const GETCOLLECTION = async (target) => {
  try {
    const cleanData = [];
    const srcData = await getDocs(collection(db, target));
    srcData.forEach((doc) => {
      const info = doc.data();
      cleanData.push(info);
    });
    return cleanData;
  } catch (error) {
    return error;
  }
};
/** 
    await GETCOLLECTION("users").then((response) => {
   cleanData = response;
});
*/

export const GETDOC = async (collection = String, id = Number) => {
  try {
    const docSnap = await getDoc(doc(db, collection, id.toString()));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  } catch (error) {
    return error;
  }
};
//      GETDOC("users", user.id).then((value) => { });
export const SETDOC = async (
  collection = String,
  id = Number,
  newValue = Object,
  New = ""
) => {
  if (New) {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
  const res = await GETDOC(collection, id);
  if (res === "Error") {
    throw new Error("No data found");
  } else {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
};
//         SETDOC("users", tempData.id, { ...tempData });

export const DELETEDOC = async (collection = String, id = Number) => {
  try {
    await deleteDoc(doc(db, collection, id.toString()));
  } catch (error) {
    return error;
  }
};
export const QUERY = async (collectionName, propertyInDB, operation, value) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(propertyInDB, operation, value)
    );

    const querySnapshot = await getDocs(q);

    const matches = [];

    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });

    return matches;
  } catch (error) {
    console.error("Error during query:", error);
    throw new Error("Error during query");
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showNotification") {
    // Ensure message.Name is used as the notification ID or generate a unique ID if not provided
    const notificationId = message.Name || `notification_${Date.now()}`;

    chrome.notifications.create(
      notificationId,
      {
        type: "basic",
        iconUrl:
          "https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/alarm-icon-2048x2048-w4u7v1ri.png?alt=media&token=a0ea8655-f0d1-483c-8a82-e416089377e9",
        title: message.title,
        message: message.message,
        priority: 2,
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
