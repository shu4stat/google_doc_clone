import TextEditor from "./TextEditor.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 } from "uuid";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate to={`/documents/${v4()}`} />}
        />
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
