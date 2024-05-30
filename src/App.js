import { useState } from "react";
import "./App.css";
import Pdf from "./Pdf.js";

function App() {
  const [chosenCabin, setChosenCabin] = useState(0);
  const [traveller, setTraveller] = useState("");
  const [traveldate, setTraveldate] = useState(Date.now());
  const [timer, setTimer] = useState(null);

  var cabinoptions = [];
  var minuteincrement = 15;
  var cabinnumberincrement = 2;
  var starthour = 6;
  var startminute = 10;
  var startcabin = 1;
  var lastcabin = 65;
  var starttime = starthour * 60 + startminute;
  var cabinone =
    starttime - (startcabin / cabinnumberincrement) * minuteincrement;

  for (
    var cabin = startcabin;
    cabin <= lastcabin;
    cabin = cabin + cabinnumberincrement
  ) {
    var cabintime = cabinone + (minuteincrement / cabinnumberincrement) * cabin;
    cabinoptions[cabinoptions.length] = [
      cabin,
      Math.floor(cabintime / 60),
      cabintime % 60,
    ];
  }

  function changeDelay(target) {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setTraveller(target.value);
      }, 100)
    );
  }

  return (
    <div className="App">
      <div className="App-input">
        <div>
          {" "}
          <label>
            What's your name?
            <input
              defaultValue={traveller}
              onChange={(e) => changeDelay(e.target)}
            ></input>
          </label>
        </div>
        <div>
          <label>
            Which cabin do you want?
            <select
              value={chosenCabin}
              onChange={(e) => setChosenCabin(e.target.value)}
            >
              {cabinoptions.map(([number, hour, minute], i) => (
                <option value={i}>
                  {number} - {hour}:{minute}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            When are you travelling?
            <input
              type="date"
              value={new Date(traveldate).toISOString().substr(0, 10)}
              onChange={(e) => setTraveldate(e.target.valueAsNumber)}
            ></input>
          </label>
        </div>
      </div>

      <Pdf
        classname="app-pdfarea"
        hour={cabinoptions[chosenCabin][1]}
        minute={cabinoptions[chosenCabin][2]}
        cabinNumber={cabinoptions[chosenCabin][0]}
        traveller={traveller}
        date={new Date(traveldate).toLocaleDateString("en-UK", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      ></Pdf>
    </div>
  );
}

export default App;
