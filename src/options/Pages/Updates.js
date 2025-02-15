import React from "react";

const Updates = () => {
  return (
    <div className="Updates">
      <h1>Here you will find all the updates for noteKeeper</h1>
      <div class="version">
        <h2>Version 3.5.1</h2>
        <div class="date">Released on: Feb 13, 2025</div>
        <ul>
          <li class="removed">
            <strong>removed:</strong> removed hurrier time frame checks and boa
            changes and time alerts
          </li>
        </ul>
      </div>
      <div class="version">
        <h2>Version 3.4.5</h2>
        <div class="date">Released on: October 21, 2024</div>
        <ul>
          <li class="added">
            <strong>modified:</strong> the silence alert will start from 45
            seconds
          </li>
        </ul>
      </div>
      <div class="version">
        <h2>Version 3.4.4</h2>
        <div class="date">Released on: October 3, 2024</div>
        <ul>
          <li class="fixed">
            <strong>Fixed:</strong> the time data don't appear sometimes on
            hurrier.
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> when going to my cases the time alerts stop.
          </li>
          <li class="removed">
            <strong>Removed:</strong> the alert that will be shown incase there
            was error loading extension
          </li>
        </ul>
      </div>
      <div class="version">
        <h2>Version 3.4.3</h2>
        <div class="date">Released on: September 29, 2024</div>
        <ul>
          <li class="added">
            <strong>Added:</strong> now alert will be shown incase there was
            error loading extension
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> close chat alert now appears after 31
            seconds.
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> alert will be sent every 20 seconds
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> sending silence alert during hold and
            question.
          </li>
        </ul>
      </div>
      <div class="version">
        <h2>Version 3.4.2</h2>
        <div class="date">Released on: September 6, 2024</div>
        <ul>
          <li class="added">
            <strong>added:</strong> moved time data form BOA to hurrier due to
            KB updates
          </li>
          <li class="added">
            <strong>added:</strong> no need to save after adding notes, as it
            gets saved automatically now.
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> close chat alert now appears after 32
            seconds.
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> only one alert will be sent per issue
            e.g:silence.
          </li>
          <li class="removed">
            <strong>Temporary removed:</strong> whether order is late or not
            till further notice
          </li>
          <li class="removed">
            <strong>Still ongoing: </strong> sending silence alert during hold
            and question.
          </li>
        </ul>
      </div>
      <div class="version">
        <h2>Version 3.3.5</h2>
        <div class="date">Released on: August 31, 2024</div>
        <ul>
          <li class="added">
            <strong>Added:</strong> activate or disable timeframe alerts
          </li>
          <li class="fixed">
            <strong>Fixed:</strong> close chat alert now appears after 35
            seconds.
          </li>
          <li class="removed">
            <strong>Still ongoing: </strong> sending silence alert during hold.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Updates;
