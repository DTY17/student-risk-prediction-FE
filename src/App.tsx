import StudentDashboard from "./components/StudentDashboard";

function App() {
  return (
    <div className="app-wrapper">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">
            Student Academic Risk Prediction System
          </span>
        </div>
      </nav>

      <main className="container py-5">
        <StudentDashboard />
      </main>
    </div>
  );
}

export default App;