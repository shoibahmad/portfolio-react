import React, { useEffect, useState } from 'react';
import './GitHubStats.css';

const GITHUB_USERNAME = 'shoibahmad';

const GitHubStats = () => {
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchGitHub = async () => {
            try {
                // Fetch profile + repos in parallel
                const [profileRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
                ]);

                if (!profileRes.ok || !reposRes.ok) throw new Error('GitHub API error');

                const profileData = await profileRes.json();
                const reposData = await reposRes.json();

                setProfile(profileData);
                setRepos(reposData.slice(0, 6)); // top 6 most recently updated

                // Aggregate languages across all repos
                const langMap = {};
                reposData.forEach(repo => {
                    if (repo.language) {
                        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                    }
                });

                // Sort and take top 6
                const sorted = Object.entries(langMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6);

                const total = sorted.reduce((acc, [, v]) => acc + v, 0);
                const langWithPercent = Object.fromEntries(
                    sorted.map(([lang, count]) => [lang, Math.round((count / total) * 100)])
                );

                setLanguages(langWithPercent);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHub();
    }, []);

    // Language color map
    const langColors = {
        Python:     '#3572A5',
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Dart:       '#00B4AB',
        HTML:       '#e34c26',
        CSS:        '#563d7c',
        Java:       '#b07219',
        'C++':      '#f34b7d',
        C:          '#555555',
        Shell:      '#89e051',
        Kotlin:     '#A97BFF',
        Swift:      '#FA7343',
    };

    const getColor = (lang) => langColors[lang] || '#10B981';

    if (loading) return (
        <div className="github-loading">
            <div className="github-loading-spinner"></div>
            <span>Fetching GitHub data...</span>
        </div>
    );

    if (error) return (
        <div className="github-error">
            <i className="fab fa-github"></i>
            <p>Could not load GitHub stats. <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">View on GitHub →</a></p>
        </div>
    );

    return (
        <div className="github-stats-wrapper">

            {/* Header */}
            <div className="github-header">
                <div className="github-profile-info">
                    <img src={profile.avatar_url} alt={profile.name} className="github-avatar" />
                    <div>
                        <h3 className="github-name">{profile.name || GITHUB_USERNAME}</h3>
                        <a
                            href={profile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-username-link"
                        >
                            <i className="fab fa-github"></i> @{profile.login}
                        </a>
                    </div>
                </div>
                <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-view-btn"
                >
                    View Profile <i className="fas fa-arrow-right"></i>
                </a>
            </div>

            {/* Stat Cards */}
            <div className="github-counters">
                <div className="github-counter-card">
                    <i className="fas fa-book"></i>
                    <span className="counter-value">{profile.public_repos}</span>
                    <span className="counter-label">Repositories</span>
                </div>
                <div className="github-counter-card">
                    <i className="fas fa-users"></i>
                    <span className="counter-value">{profile.followers}</span>
                    <span className="counter-label">Followers</span>
                </div>
                <div className="github-counter-card">
                    <i className="fas fa-user-plus"></i>
                    <span className="counter-value">{profile.following}</span>
                    <span className="counter-label">Following</span>
                </div>
                <div className="github-counter-card">
                    <i className="fas fa-star"></i>
                    <span className="counter-value">
                        {repos.reduce((acc, r) => acc + r.stargazers_count, 0)}
                    </span>
                    <span className="counter-label">Total Stars</span>
                </div>
            </div>

            {/* Top Languages */}
            <div className="github-languages">
                <h4 className="github-section-title">
                    <i className="fas fa-code"></i> Top Languages
                </h4>
                <div className="lang-bar-track">
                    {Object.entries(languages).map(([lang, pct]) => (
                        <div
                            key={lang}
                            className="lang-bar-segment"
                            style={{ width: `${pct}%`, background: getColor(lang) }}
                            title={`${lang}: ${pct}%`}
                        />
                    ))}
                </div>
                <div className="lang-legend">
                    {Object.entries(languages).map(([lang, pct]) => (
                        <div key={lang} className="lang-legend-item">
                            <span className="lang-dot" style={{ background: getColor(lang) }}></span>
                            <span className="lang-name">{lang}</span>
                            <span className="lang-pct">{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contribution Heatmap via GitHub readme stats */}
            <div className="github-heatmap">
                <h4 className="github-section-title">
                    <i className="fas fa-fire"></i> Contribution Activity
                </h4>
                <div className="heatmap-img-wrapper">
                    <img
                        src={`https://github-readme-activity-graph.vercel.app/graph?username=${GITHUB_USERNAME}&theme=react-dark&bg_color=121F2A&color=10B981&line=2DD4BF&point=10B981&area=true&hide_border=true`}
                        alt="GitHub Activity Graph"
                        className="heatmap-img"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </div>

            {/* Recent Repos */}
            <div className="github-repos">
                <h4 className="github-section-title">
                    <i className="fas fa-history"></i> Recent Repositories
                </h4>
                <div className="repos-grid">
                    {repos.map(repo => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-card"
                        >
                            <div className="repo-card-top">
                                <span className="repo-name">
                                    <i className="fas fa-code-branch"></i> {repo.name}
                                </span>
                                {repo.fork && <span className="repo-fork-badge">Fork</span>}
                            </div>
                            {repo.description && (
                                <p className="repo-desc">{repo.description}</p>
                            )}
                            <div className="repo-card-footer">
                                {repo.language && (
                                    <span className="repo-lang">
                                        <span
                                            className="repo-lang-dot"
                                            style={{ background: getColor(repo.language) }}
                                        />
                                        {repo.language}
                                    </span>
                                )}
                                <span className="repo-meta">
                                    <i className="fas fa-star"></i> {repo.stargazers_count}
                                </span>
                                <span className="repo-meta">
                                    <i className="fas fa-code-branch"></i> {repo.forks_count}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default GitHubStats;
