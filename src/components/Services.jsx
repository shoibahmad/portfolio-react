import React from 'react';
import './Services.css';

const Services = () => {
    const services = [
        {
            icon: "fa-mobile-screen-button",
            title: "Flutter Development",
            description: "Building high-performance, cross-platform mobile applications for iOS and Android using Flutter. specialized in beautiful UIs and smooth animations."
        },
        {
            icon: "fa-react",
            title: "React Development",
            description: "Developing dynamic, responsive, and fast-loading single-page web applications (SPAs) with modern React.js ecosystems, hooks, and state management."
        },
        {
            icon: "fa-code",
            title: "Web Development",
            description: "Full-stack web solutions utilizing modern technologies. From responsive landing pages to complex backend integrations and API development."
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
        <section id="services" className="services">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Research Interests</h2>
                    <p className="section-subtitle">Areas of technical expertise and exploration</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card research-card animate-on-scroll"
                            style={{ transitionDelay: `${index * 150}ms` }}
                            onMouseMove={handleMouseMove}
                        >
                            <div className="service-icon">
                                <i className={`fas ${service.icon}`}></i>
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            <div className="card-footer-line"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill-secondary" style={{ fill: 'var(--bg-secondary)' }}></path>
                </svg>
            </div>
        </section>
    );
};

export default Services;
