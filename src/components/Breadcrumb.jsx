import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbNameMap = {
        '': 'Home',
        'services': 'Services',
        'projects': 'Projects',
        'skills': 'Skills',
        'experience': 'Experience',
        'resume': 'Resume',
        'contact': 'Contact'
    };

    if (pathnames.length === 0) return null;

    return (
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <div className="container">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </Link>
                    </li>
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        const displayName = breadcrumbNameMap[name] || name;

                        return (
                            <li key={routeTo} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
                                <i className="fas fa-chevron-right breadcrumb-separator"></i>
                                {isLast ? (
                                    <span>{displayName}</span>
                                ) : (
                                    <Link to={routeTo}>{displayName}</Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumb;
