import UploadPost from "./UploadPost.jsx";
import Feed from "./Feed.jsx";
import "./App.css";

alert("App.jsx está rodando ✅");
console.log("App.jsx carregado!!!");

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h2>Compartilhando Experiências</h2>

        <img className="logo" src="./public/Travel-logo.png" alt="Logo" />
      </header>

      <main className="main-content">
        <div className="upload-section">
          <UploadPost />
        </div>

        <div className="feed-section">
          <Feed />
        </div>
      </main>
    </div>
  );
}

export default App;