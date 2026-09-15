import { Link } from 'react-router-dom';
import { ROUTES } from '../data/routes';
import './NotFound.css';

/**
 * Catch-all route.
 *
 * Previously an unrecognised path rendered the header and footer around an
 * empty middle — the page looked broken rather than wrong. This gives the
 * visitor somewhere to go instead of a blank column.
 */
const NotFound = () => (
    <section className="notfound section" aria-labelledby="notfound-title">
        <div className="shell-narrow notfound__inner">
            <p className="notfound__code" aria-hidden="true">404</p>

            <h1 className="notfound__title" id="notfound-title">
                That page doesn&rsquo;t exist.
            </h1>

            <p className="notfound__lede">
                The link may be out of date, or the address may have a typo in it.
                Everything below is still where it should be.
            </p>

            <ul className="notfound__links">
                {ROUTES.filter((route) => route.path !== '/').map((route) => (
                    <li key={route.path}>
                        <Link to={route.path} className="notfound__link">
                            {/* The route title reads "Projects — Shoib Ahmad"; only the
                                first half belongs in a nav chip. */}
                            {route.title.split('—')[0].trim()}
                            <i className="fas fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>

            <Link to="/" className="btn btn-primary notfound__home">
                Back to the homepage
            </Link>
        </div>
    </section>
);

export default NotFound;
