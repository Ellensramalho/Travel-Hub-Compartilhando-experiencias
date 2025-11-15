import UploadPost from "./components/UploadPost";
import Feed from "./components/Feed";
import "./App.css";

alert("App.js está rodando ✅");
console.log("App.js carregado!!!");

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h2>Compartilhando Experiências 📸✨</h2>
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