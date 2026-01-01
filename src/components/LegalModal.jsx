import React, { useEffect } from 'react';
import './LegalModal.css';

const LegalModal = ({ isOpen, type, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const content = {
        privacy: {
            title: "Privacy Policy",
            body: (
                <>
                    <p>Last updated: January 2026</p>
                    <p>Thank you for visiting my portfolio. This Privacy Policy outlines how I collect, use, and protect your information when you interact with this website.</p>

                    <h3>1. Information Collection</h3>
                    <p>I collect minimal personal information, primarily through the contact form, which may include:</p>
                    <ul>
                        <li>Your Name</li>
                        <li>Email Address</li>
                        <li>Message Content</li>
                    </ul>
                    <p>This information is voluntarily provided by you for the purpose of communication.</p>

                    <h3>2. Use of Information</h3>
                    <p>The information you provide is used solely for:</p>
                    <ul>
                        <li>Responding to your inquiries and messages.</li>
                        <li>Discussing potential projects or collaborations.</li>
                        <li>Improving the user experience of this portfolio.</li>
                    </ul>

                    <h3>3. Data Protection</h3>
                    <p>I take reasonable measures to protect your personal information from unauthorized access, loss, or misuse. However, please be aware that no method of transmission over the internet is 100% secure.</p>

                    <h3>4. Third-Party Links</h3>
                    <p>This portfolio contains links to external sites (e.g., LinkedIn, GitHub). I am not responsible for the privacy practices or content of these third-party websites.</p>

                    <h3>5. Contact</h3>
                    <p>If you have any questions regarding this Privacy Policy, please contact me at shoibsahmad@gmail.com.</p>
                </>
            )
        },
        terms: {
            title: "Terms of Service",
            body: (
                <>
                    <p>Last updated: January 2026</p>
                    <p>Welcome to my portfolio website. By accessing or using this site, you agree to comply with and be bound by the following terms.</p>

                    <h3>1. Intellectual Property</h3>
                    <p>All content on this website, including but not limited to text, code, images, projects, and designs, is my intellectual property unless otherwise stated. You may not reproduce, distribute, or use these materials for commercial purposes without my explicit written permission.</p>

                    <h3>2. Use License</h3>
                    <p>You are granted a limited, non-exclusive, and revocable license to view this website for personal, non-commercial use.</p>

                    <h3>3. Limitation of Liability</h3>
                    <p>This website is provided "as is". I make no warranties, expressed or implied, regarding the accuracy or reliability of the content. I shall not be liable for any damages arising from the use or inability to use the materials on this website.</p>

                    <h3>4. External Links</h3>
                    <p>I have not reviewed all of the sites linked to my portfolio and am not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement.</p>

                    <h3>5. Governing Law</h3>
                    <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
                </>
            )
        }
    };

    const currentContent = content[type] || { title: "", body: null };

    return (
        <div className={`legal-modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="legal-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="legal-header">
                    <h2>{currentContent.title}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="legal-body">
                    {currentContent.body}
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
