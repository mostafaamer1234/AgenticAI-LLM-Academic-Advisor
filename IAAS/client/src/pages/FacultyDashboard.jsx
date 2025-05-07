import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const FacultyDashboard = () => {
  const [majorName, setMajorName] = useState("");
  const [graphImage, setGraphImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMajorNameChange = (e) => {
    setMajorName(e.target.value);
  };

  const handleSubmit = async () => {
    if (!majorName) {
      alert("Please enter a major name before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:5000/llm/generate-major-graph",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ major_name: majorName }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGraphImage(imageUrl);
        setMessage("Graph generated successfully!");
      } else {
        setMessage("Failed to generate graph. Please try again.");
      }
    } catch (error) {
      console.error("Error generating graph:", error);
      setMessage("An error occurred while generating the graph.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dashboard-container">
        <h2>Faculty Dashboard</h2>
        <div className="form-section">
          <label htmlFor="major-name">Enter Major Name:</label>
          <input
            type="text"
            id="major-name"
            value={majorName}
            onChange={handleMajorNameChange}
            placeholder="e.g., Computer Science, B.S. (Abington)"
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate Graph"}
          </button>
          {message && <p>{message}</p>}
          {graphImage && (
            <div className="graph-container">
              <h3>Major Requirements Graph</h3>
              <img
                src={graphImage}
                alt="Major Requirements Graph"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
