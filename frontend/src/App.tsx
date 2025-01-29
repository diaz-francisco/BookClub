import { useState, useEffect } from "react";
import axios from "axios";
import BookSubmission from "./components/BookSubmission";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001")
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error(
          "There was an error fetching the data!",
          error
        );
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>{message}</p>
      </header>
      <BookSubmission />
    </div>
  );
}

export default App;
