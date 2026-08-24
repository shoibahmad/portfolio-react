import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { BASICS } from '../data/profile';
import './Contact.css';

const CHANNELS = [
    {
        icon: 'fas fa-envelope',
        label: 'Email',
        value: BASICS.email,
        href: `mailto:${BASICS.email}`
    },
    {
        icon: 'fab fa-linkedin-in',
        label: 'LinkedIn',
        value: BASICS.linkedinLabel,
        href: BASICS.linkedin
    },
    {
        icon: 'fab fa-github',
        label: 'GitHub',
        value: BASICS.githubLabel,
        href: BASICS.github
    },
    {
        icon: 'fab fa-whatsapp',
        label: 'WhatsApp',
        value: BASICS.phone,
        href: BASICS.phoneHref
    },
    {
        icon: 'fas fa-location-dot',
        label: 'Location',
        value: `${BASICS.location} — open to remote or relocation`
    }
];

const ALERT_ACCENT = '#EA580C';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const templateParams = {
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
            current_date: new Date().toLocaleString()
        };

        const autoReplyParams = {
            to_name: formData.name,
            to_email: formData.email,
            from_name: formData.name,
            message: formData.message,
            reply_to: BASICS.email
        };

        try {
            await emailjs.init('W-1fxkwC0rOyOEvqa');
            await emailjs.send('service_jo38u8b', 'template_jkspt2b', templateParams);

            // The auto-reply is a courtesy; failing to send it must not make the
            // visitor think their message did not arrive.
            try {
                await emailjs.send('service_jo38u8b', 'template_kmut55i', autoReplyParams);
            } catch (err) {
                console.error('Auto-reply failed', err);
            }

            Swal.fire({
                title: 'Message sent',
                text: "Thanks for reaching out — I'll reply within 24 to 48 hours.",
                icon: 'success',
                confirmButtonColor: ALERT_ACCENT,
                confirmButtonText: 'Close',
                timer: 3500
            });

            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: "That didn't send",
                text: `Please email me directly at ${BASICS.email} and I will pick it up there.`,
                icon: 'info',
                confirmButtonColor: ALERT_ACCENT
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact section" id="contact" aria-labelledby="contact-title">
            <div className="shell">
                <div className="section-head">
                    <span className="section-kicker">Contact</span>
                    <h2 className="section-title" id="contact-title">
                        Let&rsquo;s build something exceptional.
                    </h2>
                    <p className="section-lede">
                        Open to new opportunities, high-impact projects, and AI engineering
                        collaborations.
                    </p>
                </div>

                <div className="contact__grid">
                    <div className="contact__channels">
                        <h3 className="contact__subtitle">Direct channels</h3>
                        <p className="contact__intro">
                            An ambitious project, an open role, or an architecture question —
                            any of these are worth an email.
                        </p>

                        <ul className="contact__list">
                            {CHANNELS.map((channel) => {
                                const Inner = (
                                    <>
                                        <span className="contact__icon" aria-hidden="true">
                                            <i className={channel.icon} />
                                        </span>
                                        <span className="contact__text">
                                            <span className="label">{channel.label}</span>
                                            <span className="contact__value">{channel.value}</span>
                                        </span>
                                    </>
                                );

                                return (
                                    <li key={channel.label}>
                                        {channel.href ? (
                                            <a
                                                className="contact__item contact__item--link"
                                                href={channel.href}
                                                {...(channel.href.startsWith('http')
                                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                                    : {})}
                                            >
                                                {Inner}
                                            </a>
                                        ) : (
                                            <div className="contact__item">{Inner}</div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <form className="contact__form card" onSubmit={handleSubmit} noValidate={false}>
                        <h3 className="contact__subtitle">Send a message</h3>

                        <div className="field">
                            <label htmlFor="name">Your name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                autoComplete="name"
                                placeholder="Alex Morgan"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                placeholder="alex@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                placeholder="The project, the timeline, or just the idea."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary contact__submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending…' : 'Send message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
