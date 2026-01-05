import React from 'react';
import './SkeletonProjectCard.css';

const SkeletonProjectCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image skeleton-pulse"></div>
            <div className="skeleton-content">
                <div className="skeleton-header">
                    <div className="skeleton-title skeleton-pulse"></div>
                    <div className="skeleton-date skeleton-pulse"></div>
                </div>
                <div className="skeleton-body">
                    <div className="skeleton-text skeleton-pulse"></div>
                    <div className="skeleton-text skeleton-pulse" style={{ marginTop: '0.5rem' }}></div>
                    <div className="skeleton-text-short skeleton-pulse" style={{ marginTop: '0.5rem' }}></div>
                </div>
                <div className="skeleton-tags">
                    <div className="skeleton-tag skeleton-pulse"></div>
                    <div className="skeleton-tag skeleton-pulse"></div>
                    <div className="skeleton-tag skeleton-pulse"></div>
                </div>
                <div className="skeleton-button skeleton-pulse"></div>
            </div>
        </div>
    );
};

export default SkeletonProjectCard;
