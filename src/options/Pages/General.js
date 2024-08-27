import React, { useState } from "react";
import Switch from "react-switch";
import Select from "react-select";

const General = () => {
  const [settings, setSettings] = useState({
    SearchInText: JSON.parse(localStorage.getItem("TextSearch")),
    DCCopy: JSON.parse(localStorage.getItem("DoubleClick")),
    InsertText: JSON.parse(localStorage.getItem("InsertText")),
    AdvancedMode: JSON.parse(localStorage.getItem("AdvancedMode")),
    BreakTimer: JSON.parse(localStorage.getItem("BreakTimer")),
    WrapNotes: JSON.parse(localStorage.getItem("WrapNotes")),
    DefaultPage: localStorage.getItem("DefaultPage"),
    // allowTimeFrame:
    //   JSON.parse(localStorage.getItem("allowTimeFrame")) === undefined
    //     ? true
    //     : JSON.parse(localStorage.getItem("allowTimeFrame")),
  });
  // console.log(
  //   settings.allowTimeFrame,
  //   JSON.parse(localStorage.getItem("allowTimeFrame"))
  // );
  const options = [
    { value: "Updates", label: "Change log" },
    { value: "Notes", label: "Notes" },
    { value: "Profile", label: "Profile" },
    { value: "Settings", label: "Settings" },
  ];

  const handleCheckboxChange = (event, name) => {
    const checked = event;

    if (name === "TextSearch") {
      setSettings((prev) => ({ ...prev, SearchInText: checked }));
      localStorage.setItem("TextSearch", checked);
    } else if (name === "DoubleClick") {
      setSettings((prev) => ({ ...prev, DCCopy: checked }));
      localStorage.setItem("DoubleClick", checked);
    } else if (name === "InsertText") {
      setSettings((prev) => ({ ...prev, InsertText: checked }));
      localStorage.setItem("InsertText", checked);
    } else if (name === "AdvancedMode") {
      setSettings((prev) => ({ ...prev, AdvancedMode: checked }));
      localStorage.setItem("AdvancedMode", checked);
      chrome.storage.local.set({ AdvancedMode: checked });
    } else if (name === "BreakTimer") {
      setSettings((prev) => ({ ...prev, BreakTimer: checked }));
      localStorage.setItem("BreakTimer", checked);
      chrome.storage.local.set({ BreakTimer: checked });
    } else if (name === "WrapNotes") {
      setSettings((prev) => ({ ...prev, WrapNotes: checked }));
      localStorage.setItem("WrapNotes", checked);
      chrome.storage.local.set({ WrapNotes: checked });
    }
    // } else if (name === "allowTimeFrame") {
    //   setSettings((prev) => ({ ...prev, allowTimeFrame: checked }));
    //   localStorage.setItem("allowTimeFrame", checked);
    //   chrome.storage.local.set({ allowTimeFrame: checked });
    // }
  };

  const handleChange = (selectedOption) => {
    localStorage.setItem("DefaultPage", selectedOption.value);
    chrome.storage.local.set({ DefaultPage: selectedOption.value });
  };

  return (
    <div className="General settings">
      <div className="ChecksWrapper">
        <div className="reorderCheckBox" title="اضافة الكلام في الموقع">
          <label>
            <span>Add Text on copy</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "InsertText");
              }}
              checked={settings.InsertText}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div>
        <div className="reorderCheckBox" title="دبل كليك لنسخ الملاحظة">
          <label>
            <span>Double click to copy</span>

            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "DoubleClick");
              }}
              checked={settings.DCCopy}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div>
        <div className="reorderCheckBox" title="بحث داخل الملاحظة">
          <label>
            <span>Search in text</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "TextSearch");
              }}
              checked={settings.SearchInText}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div>
        <div className="reorderCheckBox" title="اسلوب فريش شات">
          <label>
            <span> FreshChat Mode (BETA)</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "AdvancedMode");
              }}
              checked={settings.AdvancedMode}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div>
        <div className="reorderCheckBox" title="عداد البريكات">
          <label className="CheckWrapper" title="عداد البريكات">
            <span> Breaks Timer</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "BreakTimer");
              }}
              checked={settings.BreakTimer}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div>
        {/* <div className="reorderCheckBox">
          <label>
            <span>TimeFrame alert</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "allowTimeFrame");
              }}
              checked={settings.allowTimeFrame}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div> */}
        <div
          className="CheckWrapper"
          style={{ justifyContent: "space-between", width: "400px" }}
        >
          <span>Default page</span>
          <Select
            options={options}
            onChange={handleChange}
            placeholder="Start up page"
          />
        </div>

        {/* <div className="reorderCheckBox" title="تصغير الملاحظات">
          <label title="تصغير الملاحظات">
            <span>auto Wrap Notes</span>
            <Switch
              onChange={(Checked) => {
                handleCheckboxChange(Checked, "WrapNotes");
              }}
              checked={settings.WrapNotes}
              height={20}
              width={40}
              onColor="#8f54a0"
            />
          </label>
        </div> */}
      </div>
      {/* <div>
        <button className="button">report a bug</button>
      </div> */}
    </div>
  );
};

export default General;
