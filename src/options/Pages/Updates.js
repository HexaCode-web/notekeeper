import React from "react";

const Updates = () => {
  return (
    <div className="Updates">
      <h1>Here you will find all the updates for noteKeeper</h1>
      <h2>Watch the below video to understand how the new system works!</h2>
      <video
        style={{ width: "70%", height: "70%" }}
        controls
        src="https://firebasestorage.googleapis.com/v0/b/reduxhttp-c9911.appspot.com/o/note%20keeper%20updates%202.3.mp4?alt=media&token=d73316a9-cee7-4171-970c-f25d2b4b87c2"
      />
    </div>
  );
};

export default Updates;
