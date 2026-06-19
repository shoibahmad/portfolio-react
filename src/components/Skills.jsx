import React, { useState } from 'react';
import './Skills.css';
import Spotlight from './ui/Spotlight';
import GitHubStats from './GitHubStats';

const Skills = () => {
    const skills = [
        {
            category: "Programming Languages",
            items: ["C Programming", "C++ Programming", "Java", "Dart", "Python", "Kotlin"]
        },
        {
            category: "Frameworks & Technologies",
            items: ["React", "Next.js", "Vite", "Flutter", "Flask", "FastAPI", "XML"]
        },
        {
            category: "Database & Tools",
            items: ["DBMS", "Firebase", "GitHub", "Linux"]
        },
        {
            category: "Other Skills",
            items: ["Research and Analytics", "English Proficiency"]
        }
    ];

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="skills" className="skills">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Technical Expertise</h2>
                    <p className="section-subtitle">A comprehensive overview of my technical skills and tools</p>
                </div>

                <Spotlight className="skills-grid">
                    {skills.map((category, index) => (
                        <div
                            key={index}
                            className="skill-category spotlight-card animate-on-scroll"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <h3>{category.category}</h3>
                            <ul>
                                {category.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Spotlight>

                {/* GitHub Live Stats */}
                <GitHubStats />
            </div>
        </section>
    );
};

export default Skills;

