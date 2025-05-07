import React, { useState } from 'react';
import AIChat from '../components/AIChat';
import CoursePlanner from '../components/CoursePlanner'; // Import CoursePlanner
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [disableButton, setDisableButton] = useState(true);

    return (
        <div>
            <div className="dashboard-container">
                <h2>Academic Planner</h2>

                {/* Course Planner Section */}
                <CoursePlanner setDisableButton={setDisableButton} />

                {/* AI Chat Section */}
                <AIChat disableButton={disableButton} />
            </div>
        </div>
    ); 
};

export default Dashboard;
