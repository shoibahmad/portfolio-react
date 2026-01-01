import React from 'react';
import './TechMarquee.css';

const TechMarquee = () => {
    const technologies = [
        { icon: "fa-react", name: "React" },
        { icon: "fa-python", name: "Python" },
        { icon: "fa-js", name: "JavaScript" },
        { icon: "fa-node-js", name: "Node.js" },
        { icon: "fa-html5", name: "HTML5" },
        { icon: "fa-css3-alt", name: "CSS3" },
        { icon: "fa-java", name: "Java" },
        { icon: "fa-android", name: "Android" },
        { icon: "fa-git-alt", name: "Git" },
        { icon: "fa-docker", name: "Docker" },
        { icon: "fa-aws", name: "AWS" },
        { icon: "fa-linux", name: "Linux" },
        // Duplicate for seamless loop
        { icon: "fa-react", name: "React" },
        { icon: "fa-python", name: "Python" },
        { icon: "fa-js", name: "JavaScript" },
        { icon: "fa-node-js", name: "Node.js" },
        { icon: "fa-html5", name: "HTML5" },
        { icon: "fa-css3-alt", name: "CSS3" },
        { icon: "fa-java", name: "Java" },
        { icon: "fa-android", name: "Android" },
        { icon: "fa-git-alt", name: "Git" },
        { icon: "fa-docker", name: "Docker" },
        { icon: "fa-aws", name: "AWS" },
        { icon: "fa-linux", name: "Linux" }
    ];

    return (
        <section className="tech-marquee">
            <div className="marquee-content">
                {technologies.map((tech, index) => (
                    <div key={index} className="tech-item">
                        <i className={`fab ${tech.icon}`}></i>
                        <span>{tech.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TechMarquee;
