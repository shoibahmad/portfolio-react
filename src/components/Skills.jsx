import React from 'react';
import './Skills.css';

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

    return (
        <section id="skills" className="skills">
            <div className="container">
                <h2 className="section-title">Skills</h2>
                <div className="skills-grid">
                    {skills.map((category, index) => (
                        <div key={index} className="skill-category animate-on-scroll" style={{ transitionDelay: `${index * 100}ms` }}>
                            <h3>{category.category}</h3>
                            <ul>
                                {category.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
