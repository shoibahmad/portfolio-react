import { Link } from 'react-router-dom';
import TiltCard from './ui/TiltCard';
import { RevealGroup } from './ui/Reveal';
import './Services.css';

const SERVICES = [
    {
        icon: 'fab fa-react',
        title: 'React & Next.js interfaces',
        tag: 'Frontend',
        description:
            'Production front ends on React.js, Next.js, Vite and Tailwind CSS — component architecture and state management that still holds up once the prototype becomes the product.'
    },
    {
        icon: 'fas fa-server',
        title: 'REST API backends',
        tag: 'Backend & APIs',
        description:
            'FastAPI and Django REST Framework services with asynchronous endpoints, explicit service contracts and auth flows — built to stay reliable under concurrent load.'
    },
    {
        icon: 'fas fa-brain',
        title: 'LLM integration',
        tag: 'Applied AI',
        description:
            'Gemini and Claude wired into real product workflows: prompt design, model evaluation against task-level criteria, and pipeline integration — not a chatbot bolted onto the side.'
    }
];

const Services = () => (
    <section className="services section" id="services" aria-labelledby="services-title">
        <div className="shell">
            <div className="section-head">
                <span className="section-kicker">Services</span>
                <h2 className="section-title" id="services-title">
                    Solutions engineered with precision.
                </h2>
                <p className="section-lede">
                    Three areas where the work is deep rather than broad — and where each
                    has already shipped into something people use daily.
                </p>
            </div>

            <RevealGroup className="services__grid stage" stagger={0.08}>
                {SERVICES.map((service, index) => (
                    <TiltCard className="services__card card" key={service.title} max={4}>
                        <span className="services__num" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="services__icon pop-1" aria-hidden="true">
                            <i className={service.icon} />
                        </span>

                        <span className="label services__tag">{service.tag}</span>
                        <h3 className="services__title">{service.title}</h3>
                        <p className="services__desc">{service.description}</p>
                    </TiltCard>
                ))}
            </RevealGroup>

            <div className="services__footer">
                <p className="services__footer-text">
                    Have something that fits none of these boxes? Those are usually the
                    interesting ones.
                </p>
                <Link to="/contact" className="btn btn-primary">
                    Talk it through
                </Link>
            </div>
        </div>
    </section>
);

export default Services;
