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
                <h2 className="section-title">Skills</h2>
                <div className="skills-grid">
                    {skills.map((category, index) => (
                        <div
                            key={index}
                            className="skill-category spotlight-card animate-on-scroll"
                            style={{ transitionDelay: `${index * 100}ms` }}
                            onMouseMove={handleMouseMove}
                        >
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

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill-secondary" style={{ fill: 'var(--bg-secondary)' }}></path>
                </svg>
            </div>
        </section>
    );
};

export default Skills;
