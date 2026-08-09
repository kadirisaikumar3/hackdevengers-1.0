import { useEffect, useState, useRef } from "react";
import "./App.css";

const API_URL = "https://civicai-backend-2eer.onrender.com/api/issues";

const emptyForm = {
  title: "",
  description: "",
  location: "Bengaluru",
  priority: "MEDIUM",
};

function App() {
  const [form, setForm] = useState(emptyForm);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState("");

  const analysisRef = useRef(null);

  // =========================
  // LOAD ALL ISSUES
  // =========================
  const loadIssues = async () => {
    try {
      setLoadingIssues(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load civic issues.");
      }

      const data = await response.json();

      setIssues(data);

      // If an issue is already selected, refresh its data too
      if (selectedIssue) {
        const updatedSelectedIssue = data.find(
          (issue) => issue.id === selectedIssue.id,
        );

        if (updatedSelectedIssue) {
          setSelectedIssue(updatedSelectedIssue);
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        "Backend connection unavailable. Make sure Spring Boot is running on port 8081.",
      );
    } finally {
      setLoadingIssues(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadIssues();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  // =========================
  // CREATE ISSUE
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setError("Please complete the title, description and location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // Handle duplicate issue
      if (response.status === 409) {
        const duplicateMessage = await response.text();

        setError("⚠️ This issue has already been reported for this location.");

        console.warn("Duplicate issue:", duplicateMessage);
        return;
      }

      // Handle other backend errors
      if (!response.ok) {
        throw new Error("Failed to create issue.");
      }

      const createdIssue = await response.json();

      setIssues((current) => [createdIssue, ...current]);

      // Automatically show the newly created issue
      // in the AI Analysis panel.
      setSelectedIssue(createdIssue);

      setForm(emptyForm);
    } catch (err) {
      console.error(err);

      setError(
        "❌ Could not submit the issue. Please check that the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECT ISSUE
  // =========================
  const handleIssueClick = (issue) => {
    console.log("Selected issue:", issue);

    setSelectedIssue(issue);

    setForm({
      title: issue.title || "",
      description: issue.description || "",
      location: issue.location || "Bengaluru",
      priority: issue.priority || "MEDIUM",
    });

    setTimeout(() => {
      if (analysisRef.current) {
        const y =
          analysisRef.current.getBoundingClientRect().top +
          window.scrollY -
          110;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }, 100);
  };
  // =========================
  // UPDATE ISSUE STATUS
  // =========================
  const updateStatus = async (issueId, status) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${issueId}/status?status=${encodeURIComponent(status)}`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update issue status.");
      }

      const updatedIssue = await response.json();

      setIssues((current) =>
        current.map((issue) =>
          issue.id === updatedIssue.id ? updatedIssue : issue,
        ),
      );

      setSelectedIssue(updatedIssue);
    } catch (err) {
      console.error(err);

      setError("Could not update the issue status.");
    }
  };

  // =========================
  // STATISTICS
  // =========================
  const totalIssues = issues.length;

  const highPriority = issues.filter(
    (issue) => issue.priority === "HIGH",
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED",
  ).length;

  // =========================
  // PRIORITY STYLE
  // =========================
  const getPriorityClass = (priority) => {
    if (priority === "HIGH") return "priority-high";

    if (priority === "MEDIUM") return "priority-medium";

    return "priority-low";
  };

  // =========================
  // CATEGORY ICON
  // =========================
  const getCategoryIcon = (category) => {
    const normalizedCategory = String(category || "").toUpperCase();

    const icons = {
      ROADS: "🛣️",
      ROAD: "🛣️",
      WATER: "💧",
      ELECTRICITY: "⚡",
      SANITATION: "🗑️",
      STREETLIGHTS: "💡",
      STREET_LIGHTS: "💡",
      SAFETY: "🛡️",
      DRAINAGE: "🌊",
      WASTE: "♻️",
      PARKS: "🌳",
    };

    return icons[normalizedCategory] || "📍";
  };

  // =========================
  // FORMAT STATUS
  // =========================
  const formatStatus = (status) => {
    if (!status) return "Reported";

    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // =========================
  // FORMAT CATEGORY
  // =========================
  const formatCategory = (category) => {
    if (!category) return "Unknown";

    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <div className="app">
      {/* =========================
          NAVBAR
      ========================= */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">C</div>

          <div>
            <h1>
              Civic<span>AI</span>
            </h1>

            <p>Smarter cities. Faster action.</p>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI Engine Online
        </div>
      </header>

      <main className="container">
        {/* =========================
            HERO
        ========================= */}
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span>✦</span>
              AI-POWERED CIVIC PLATFORM
            </div>

            <h2>
              Turn civic problems into
              <span> action.</span>
            </h2>

            <p>
              Report an issue and let CivicAI automatically understand,
              prioritize and route it to the right department.
            </p>
          </div>

          <div className="hero-card">
            <div className="hero-icon">⚡</div>

            <div>
              <strong>AI Analysis</strong>
              <span>Instant classification & routing</span>
            </div>
          </div>
        </section>

        {/* =========================
            STATISTICS
        ========================= */}
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue">📋</div>

            <div>
              <span>Total Reports</span>
              <strong>{totalIssues}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">🚨</div>

            <div>
              <span>High Priority</span>
              <strong>{highPriority}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>

            <div>
              <span>Resolved</span>
              <strong>{resolvedIssues}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">🤖</div>

            <div>
              <span>AI Assisted</span>
              <strong>{issues.length}</strong>
            </div>
          </div>
        </section>

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* =========================
            WORKSPACE
        ========================= */}
        <section className="workspace">
          {/* =========================
              REPORT FORM
          ========================= */}
          <div className="report-panel">
            <div className="section-heading">
              <div>
                <span className="section-label">CITIZEN REPORT</span>

                <h3>Report a civic issue</h3>
              </div>

              <span className="step-badge">STEP 1</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Issue title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Large pothole on main road"
                />
              </label>

              <label>
                Describe the problem
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us what is happening and how it affects people..."
                  rows="5"
                />
              </label>

              <div className="form-grid">
                <label>
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                  />
                </label>

                <label>
                  Initial priority
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </label>
              </div>

              <button
                className="analyze-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Analyze & Report
                    <span className="arrow">→</span>
                  </>
                )}
              </button>

              <p className="form-note">
                CivicAI will classify your issue, determine priority and
                recommend the responsible department.
              </p>
            </form>
          </div>

          {/* =========================
              AI ANALYSIS
          ========================= */}
          <div className="analysis-panel" ref={analysisRef}>
            {selectedIssue ? (
              <>
                <div className="section-heading">
                  <div>
                    <span className="section-label ai-label">
                      ✦ AI ANALYSIS COMPLETE
                    </span>

                    <h3>Issue intelligence</h3>
                  </div>

                  <span className="success-badge">✓ Analyzed</span>
                </div>

                {/* ISSUE TITLE */}
                <div className="analysis-title">
                  <div className="category-icon">
                    {getCategoryIcon(selectedIssue.category)}
                  </div>

                  <div>
                    <h4>{selectedIssue.title}</h4>

                    <span>{selectedIssue.location}</span>
                  </div>
                </div>

                {/* CATEGORY + PRIORITY */}
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <span>Category</span>

                    <strong>
                      {getCategoryIcon(selectedIssue.category)}{" "}
                      {formatCategory(selectedIssue.category)}
                    </strong>
                  </div>

                  <div className="analysis-item">
                    <span>Priority</span>

                    <strong
                      className={getPriorityClass(selectedIssue.priority)}
                    >
                      {selectedIssue.priority}
                    </strong>
                  </div>
                </div>

                {/* DEPARTMENT */}
                <div className="department-card">
                  <span>RECOMMENDED DEPARTMENT</span>

                  <strong>
                    🏢{" "}
                    {selectedIssue.suggestedDepartment ||
                      "Municipal Administration Department"}
                  </strong>
                </div>

                {/* AI SUMMARY */}
                <div className="summary-box">
                  <span>AI SUMMARY</span>

                  <p>
                    {selectedIssue.aiSummary ||
                      "AI analysis summary is not available for this issue."}
                  </p>
                </div>

                {/* ACTION */}
                <div className="action-box">
                  <span>RECOMMENDED ACTION</span>

                  <p>
                    {selectedIssue.suggestedAction ||
                      "Review the reported issue and take appropriate action."}
                  </p>
                </div>

                {/* STATUS */}
                <div
                  className="status-control"
                  onClick={(event) => event.stopPropagation()}
                >
                  <span>CURRENT STATUS</span>

                  <select
                    value={selectedIssue.status || "REPORTED"}
                    onChange={(event) =>
                      updateStatus(selectedIssue.id, event.target.value)
                    }
                  >
                    <option value="REPORTED">Reported</option>

                    <option value="IN_PROGRESS">In Progress</option>

                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>
              </>
            ) : (
              /* EMPTY ANALYSIS */
              <div className="empty-analysis">
                <div className="empty-icon">✦</div>

                <h3>AI analysis will appear here</h3>

                <p>
                  Submit a civic complaint to see automatic classification,
                  priority detection and department routing.
                </p>

                <div className="analysis-features">
                  <span>✓ Smart classification</span>

                  <span>✓ Priority detection</span>

                  <span>✓ Department routing</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            RECENT REPORTS
        ========================= */}
        <section className="issues-section">
          <div className="section-heading">
            <div>
              <span className="section-label">LIVE DATA</span>

              <h3>Recent civic reports</h3>
            </div>

            <button
              className="refresh-button"
              onClick={loadIssues}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>

          {loadingIssues ? (
            <div className="loading-state">Loading civic reports...</div>
          ) : issues.length === 0 ? (
            <div className="empty-list">
              No civic reports yet. Submit the first one above.
            </div>
          ) : (
            <div className="issues-table">
              <div className="table-header">
                <span>ISSUE</span>
                <span>CATEGORY</span>
                <span>PRIORITY</span>
                <span>STATUS</span>
              </div>

              {issues.slice(0, 8).map((issue) => (
                <button
                  className={`issue-row ${
                    selectedIssue?.id === issue.id ? "selected-issue" : ""
                  }`}
                  key={issue.id}
                  type="button"
                  onClick={() => handleIssueClick(issue)}
                >
                  {/* ISSUE */}
                  <div className="issue-name">
                    <div className="mini-icon">
                      {getCategoryIcon(issue.category)}
                    </div>

                    <div>
                      <strong>{issue.title}</strong>

                      <span>{issue.location}</span>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <span className="category-text">
                    {formatCategory(issue.category)}
                  </span>

                  {/* PRIORITY */}
                  <span
                    className={`priority-pill ${getPriorityClass(
                      issue.priority,
                    )}`}
                  >
                    {issue.priority}
                  </span>

                  {/* STATUS */}
                  <span className="status-pill">
                    {formatStatus(issue.status)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            FOOTER
        ========================= */}
        <footer>
          <div>
            <strong>CivicAI</strong>

            <span>AI-powered civic issue resolution</span>
          </div>

          <span>Hack Devengers 1.0 • 2026</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
