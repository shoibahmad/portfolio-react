import React, { useState } from 'react';
import './ResumeDownload.css';

const ResumeDownload = () => {
    const [isOpen, setIsOpen] = useState(false);

    const resumeFormats = [
        {
            format: 'PDF',
            icon: 'fas fa-file-pdf',
            description: 'Standard format for printing and viewing',
            color: '#ef4444',
            downloadUrl: '/resume/Shoib_Ahmad_Resume.pdf'
        },
        {
            format: 'JSON Resume',
            icon: 'fas fa-file-code',
            description: 'Machine-readable format for developers',
            color: '#f59e0b',
            downloadUrl: '/resume/resume.json'
        },
        {
            format: 'Markdown',
            icon: 'fas fa-file-alt',
            description: 'Plain text format for easy editing',
            color: '#c15f3c',
            downloadUrl: '/resume/resume.md'
        }
    ];

    const handleDownload = (url, format) => {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `Shoib_Ahmad_Resume.${format.toLowerCase().replace(' ', '_')}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="resume-download-widget">
            <button 
                className="resume-download-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Download Resume"
            >
                <i className="fas fa-download"></i>
                <span>Resume</span>
            </button>

            {isOpen && (
                <>
                    <div className="resume-download-backdrop" onClick={() => setIsOpen(false)}></div>
                    <div className="resume-download-panel">
                        <div className="panel-header">
                            <h3>Download Resume</h3>
                            <button 
                                className="panel-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="panel-content">
                            <p className="panel-description">
                                Choose your preferred format to download my resume
                            </p>
                            <div className="format-options">
                                {resumeFormats.map((item, index) => (
                                    <button
                                        key={index}
                                        className="format-card"
                                        onClick={() => handleDownload(item.downloadUrl, item.format)}
                                    >
                                        <div className="format-icon" style={{ color: item.color }}>
                                            <i className={item.icon}></i>
                                        </div>
                                        <div className="format-info">
                                            <h4>{item.format}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                        <i className="fas fa-download format-download-icon"></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ResumeDownload;
