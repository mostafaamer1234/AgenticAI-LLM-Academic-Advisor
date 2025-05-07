import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // Ensure consistent styling
import { setupEnvironment } from '../services/apiService';

const CoursePlanner = ({ setDisableButton }) => {
    const [graduationPlan, setGraduationPlan] = useState(''); // Centralized state
    const [loading, setLoading] = useState(false);
    const [generateEnabled, setGenerateEnable] = useState(false);
    const [showInitializing, setShowInitializing] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        initializeEnvironment(file);
    };
    
    const initializeEnvironment = async (file) => {
        try {
            setShowInitializing(true)
            const formData = new FormData();
            formData.append('transcript', file); 
    
            const message = await setupEnvironment(formData); 
            console.log('Environment initialized:', message);
            setGenerateEnable(true);
            setShowInitializing(false)
        } catch (error) {
            console.error('Error initializing environment:', error);
            setGraduationPlan('An error occurred while generating the graduation plan.');
        }
    };

    const generateGraduationPlan = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/llm/generate-response', {
                user_question: 'Generate a Graduation Plan based on my major from what-if report',
            });

            setGraduationPlan(response.data.graduation_plan || 'No plan generated.');
            setDisableButton(false);
        } catch (error) {
            console.error('Error generating graduation plan:', error);
            setGraduationPlan('An error occurred while generating the graduation plan.');
        } finally {
            setLoading(false);
        }
    };
   
    return (
        <div className="planner">
            <h3>Course Planner</h3>

            {/* File Upload Section */}
            <div className="form-section">
                <label htmlFor="transcript">Upload Your Transcript (PDF):</label>
                <input
                    type="file"
                    id="transcript"
                    accept=".pdf"
                    onChange={handleFileUpload}
                />

                {/* Generate Graduation Plan Button */}
                <button onClick={generateGraduationPlan} disabled={!generateEnabled || loading}>
                    {/* {loading ? 'Generating...' : 'Generate Graduation Plan'} */}
                    {showInitializing ? 'Initializing...' : loading ? 'Generating...': 'Generate Graduation Plan'}
                </button>

                {/* Graduation Plan Output */}
                {graduationPlan && (
                    <textarea
                        readOnly
                        value={graduationPlan}
                        className="graduation-plan-output"
                        placeholder="Graduation plan will appear here..."
                    />
                )}
            </div>
        </div>
    );
};

export default CoursePlanner;