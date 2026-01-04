import React from 'react';
import './Publications.css';

const Publications = () => {
    const publications = [
        {
            title: "IU CA Cross Platform App: A Comprehensive University Management Solution",
            journal: "International Journal of Science and Advanced Technology (IJSAT)",
            year: "2025",
            authors: "Shoib Ahmad",
            link: "https://www.ijsat.org/research-paper.php?id=9262",
            status: "Published",
            date: "14/11/2025"
        }
    ];

    return (
        <section id="publications" className="publications">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Selected Publications</h2>
                    <p className="section-subtitle">Research contributions and academic papers</p>
                </div>

                <div className="publications-list">
                    {publications.map((pub, index) => (
                        <div key={index} className="publication-card animate-on-scroll">
                            <div className="pub-year">{pub.year}</div>
                            <div className="pub-content">
                                <h3 className="pub-title">
                                    <a href={pub.link} className="pub-link" target="_blank" rel="noopener noreferrer">
                                        {pub.title}
                                        <i className="fas fa-external-link-alt"></i>
                                    </a>
                                </h3>
                                <p className="pub-authors">{pub.authors}</p>
                                <div className="pub-meta">
                                    <span className="pub-journal">{pub.journal}</span>
                                    {pub.date && <span className="pub-date"><i className="far fa-calendar-alt"></i> {pub.date}</span>}
                                    <span className={`pub-status status-${pub.status.toLowerCase().replace(' ', '-')}`}>
                                        {pub.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Publications;
