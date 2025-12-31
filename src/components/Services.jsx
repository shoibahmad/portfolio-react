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

    return (
        <section id="services" className="services">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">My Services</h2>
                    <p className="section-subtitle">Specialized technical solutions for your digital needs</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="service-icon">
                                <i className={`fas ${service.icon}`}></i>
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
