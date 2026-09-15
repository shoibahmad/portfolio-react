import React, { useEffect, useState } from 'react';
import './GitHubStats.css';

const GITHUB_USERNAME = 'shoibahmad';

/**
 * Cached GitHub data.
 *
 * The unauthenticated GitHub API allows 60 requests per hour *per IP*, and this
 * component made two on every single visit to /skills. Roughly thirty page views
 * an hour from one address — or one office or campus behind a shared NAT —
 * exhausted the quota, and every visitor after that got "Could not load GitHub
 * stats" instead of the panel.
 *
 * Caching the derived result makes repeat visits cost nothing, and the stale
 * fallback below means a spent quota degrades to slightly old numbers rather
 * than to an error box.
 */
const CACHE_KEY = `github-stats:${GITHUB_USERNAME}:v1`;
const CACHE_TTL = 6 * 60 * 60 * 1000; // six hours

function readCache() {
    // localStorage throws in Safari private mode and when storage is disabled;
    // a missing cache is never a reason to break the page.
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.data || typeof parsed.at !== 'number') return null;
        return { data: parsed.data, age: Date.now() - parsed.at };
    } catch {
        return null;
    }
}

function writeCache(data) {
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch {
        /* Quota exceeded or storage disabled — the app works without it. */
    }
}

/** Reduce the two API payloads to only what this panel renders. */
function shape(profileData, reposData) {
    const langMap = {};
    reposData.forEach((repo) => {
        if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    });

    const sorted = Object.entries(langMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    const total = sorted.reduce((acc, [, v]) => acc + v, 0) || 1;

    return {
        profile: {
            name: profileData.name,
            login: profileData.login,
            avatar_url: profileData.avatar_url,
            html_url: profileData.html_url,
            public_repos: profileData.public_repos,
            followers: profileData.followers,
            following: profileData.following
        },
        repos: reposData.slice(0, 6).map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            html_url: r.html_url,
            language: r.language,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            fork: r.fork
        })),
        totalStars: reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0),
        languages: Object.fromEntries(
            sorted.map(([lang, count]) => [lang, Math.round((count / total) * 100)])
        )
    };
}

const GitHubStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);

    /* The contribution graph is rendered by a third-party service that is
       currently returning 402. Hiding the <img> alone left its heading and card
       behind — an empty titled box. Tracking the failure in state lets the whole
       block drop out, and lets it reappear by itself if the service recovers. */
    const [heatmapFailed, setHeatmapFailed] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const cached = readCache();

        // Paint cached data immediately, fresh or not. A stale number beats a
        // spinner, and beats an error if the refresh then fails.
        if (cached) {
            setData(cached.data);
            setLoading(false);
        }

        // Fresh cache: nothing to do, and — the whole point — no API call.
        if (cached && cached.age < CACHE_TTL) return () => controller.abort();

        const fetchGitHub = async () => {
            try {
                const [profileRes, reposRes] = await Promise.all([
                    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
                        signal: controller.signal
                    }),
                    fetch(
                        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
                        { signal: controller.signal }
                    )
                ]);

                if (!profileRes.ok || !reposRes.ok) {
                    /* Distinguish an exhausted quota: it is temporary and says
                       nothing about the profile, so it deserves a different
                       message.

                       Not keyed on the x-ratelimit-remaining header alone.
                       Reading a custom header cross-origin requires the server
                       to list it in Access-Control-Expose-Headers, so it is
                       null whenever that is absent — and the branch would
                       silently never fire. On the public API a 403 or 429 for a
                       valid username is a quota in practice, so that is the
                       signal, with the header used only to confirm. */
                    const throttled = [profileRes, reposRes].find(
                        (r) => r.status === 403 || r.status === 429
                    );
                    const err = new Error('GitHub API error');
                    err.rateLimited =
                        Boolean(throttled) &&
                        throttled.headers.get('x-ratelimit-remaining') !== '1';
                    throw err;
                }

                const [profileData, reposData] = await Promise.all([
                    profileRes.json(),
                    reposRes.json()
                ]);

                const shaped = shape(profileData, reposData);
                writeCache(shaped);
                if (!active) return;
                setData(shaped);
                setError(false);
                setRateLimited(false);
            } catch (err) {
                if (err.name === 'AbortError' || !active) return;
                // Only surface a failure when there is nothing cached to show.
                if (!cached) {
                    setError(true);
                    setRateLimited(Boolean(err.rateLimited));
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchGitHub();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const profile = data?.profile ?? null;
    const repos = data?.repos ?? [];
    const languages = data?.languages ?? {};

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

    /* Reached only when there is no cached data to fall back on. The rate-limit
       case is called out separately because it is temporary and says nothing
       about the profile — "could not load" reads like the account is broken. */
    if (error || !profile) return (
        <div className="github-error">
            <i className="fab fa-github" aria-hidden="true"></i>
            <p>
                {rateLimited
                    ? 'GitHub caps anonymous requests per hour and that limit is currently reached. The stats return on their own shortly.'
                    : 'GitHub stats are unavailable right now.'}
            </p>
            <a
                className="github-view-btn"
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                View profile on GitHub <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
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
                    {/* Summed across every repository, not just the six shown
                        below — this previously reduced over the truncated list
                        and under-reported the total. */}
                    <span className="counter-value">{data.totalStars}</span>
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
            {!heatmapFailed && (
                <div className="github-heatmap">
                    <h4 className="github-section-title">
                        <i className="fas fa-fire"></i> Contribution Activity
                    </h4>
                    <div className="heatmap-img-wrapper">
                        <img
                            /* Themed to the page rather than to the service's dark
                               default, which rendered a near-black panel in the
                               middle of a light layout. */
                            src={`https://github-readme-activity-graph.vercel.app/graph?username=${GITHUB_USERNAME}&bg_color=FFFFFF&color=101014&line=EA580C&point=EA580C&title_color=101014&area=true&hide_border=true`}
                            alt={`${GITHUB_USERNAME} GitHub contribution activity over the last year`}
                            className="heatmap-img"
                            loading="lazy"
                            onError={() => setHeatmapFailed(true)}
                        />
                    </div>
                </div>
            )}

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
