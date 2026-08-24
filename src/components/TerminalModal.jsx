import React, { useState, useEffect, useRef } from 'react';
import { BASICS } from '../data/profile';
import './TerminalModal.css';

const TerminalModal = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', content: 'Welcome to shoib.dev terminal.' },
        { type: 'output', content: 'Type "help" to see available commands.' }
    ]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isOpen]);

    const handleCommand = (cmd) => {
        const trimmed = cmd.trim().toLowerCase();
        
        const newHistory = [...history, { type: 'input', content: cmd }];

        switch (trimmed) {
            case 'help':
                newHistory.push({ type: 'output', content: 'Available commands:' });
                newHistory.push({ type: 'output', content: '  whoami      - display short bio' });
                newHistory.push({ type: 'output', content: '  ls projects - list featured projects' });
                newHistory.push({ type: 'output', content: '  ls skills   - list technical skills' });
                newHistory.push({ type: 'output', content: '  contact     - show contact information' });
                newHistory.push({ type: 'output', content: '  clear       - clear terminal screen' });
                newHistory.push({ type: 'output', content: '  exit        - close terminal' });
                break;
            case 'whoami':
                newHistory.push({ type: 'output', content: BASICS.name });
                newHistory.push({ type: 'output', content: 'Full-Stack Engineer — React, Next.js, REST APIs, AI/LLM integration' });
                newHistory.push({ type: 'output', content: 'Final-year MCA at Jamia Hamdard University (CGPA 8.10).' });
                break;
            case 'ls projects':
                newHistory.push({ type: 'output', content: 'projects/' });
                newHistory.push({ type: 'output', content: '├── SecureEval AI (React / FastAPI) — live, daily use' });
                newHistory.push({ type: 'output', content: '├── RuralHealth AI (DRF / React) — offline-first' });
                newHistory.push({ type: 'output', content: '├── Web Sonar (FastAPI / Scrapy / Playwright)' });
                newHistory.push({ type: 'output', content: '├── TruthGuard AI (PyTorch / OpenCV)' });
                newHistory.push({ type: 'output', content: '└── Med-AI Vigi (XGBoost / Scikit-learn)' });
                break;
            case 'ls skills':
                newHistory.push({ type: 'output', content: 'skills/' });
                newHistory.push({ type: 'output', content: '├── Frontend : React.js, Next.js, Vite, Tailwind CSS' });
                newHistory.push({ type: 'output', content: '├── Backend  : FastAPI, Django REST Framework, Flask' });
                newHistory.push({ type: 'output', content: '├── AI/LLM   : Gemini, Claude API, PyTorch, Scikit-learn' });
                newHistory.push({ type: 'output', content: '├── Data     : PostgreSQL, Firestore, IndexedDB' });
                newHistory.push({ type: 'output', content: '└── Cloud    : GCP, Azure, Docker, Azure DevOps' });
                break;
            case 'contact':
                newHistory.push({ type: 'output', content: `Email: ${BASICS.email}` });
                newHistory.push({ type: 'output', content: `LinkedIn: ${BASICS.linkedinLabel}` });
                newHistory.push({ type: 'output', content: `GitHub: ${BASICS.githubLabel}` });
                newHistory.push({ type: 'output', content: `Phone: ${BASICS.phone}` });
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                onClose();
                return;
            case 'sudo':
                newHistory.push({ type: 'output', content: 'Nice try. This incident will be reported.' });
                break;
            case '':
                break;
            default:
                newHistory.push({ type: 'error', content: `command not found: ${cmd}` });
        }

        setHistory(newHistory);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="terminal-overlay" onClick={onClose}>
            <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
                <div className="terminal-header">
                    <div className="terminal-buttons">
                        <span className="close-btn" onClick={onClose}></span>
                        <span className="min-btn"></span>
                        <span className="max-btn"></span>
                    </div>
                    <div className="terminal-title">shoib@portfolio:~</div>
                </div>
                <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
                    {history.map((log, idx) => (
                        <div key={idx} className={`terminal-log ${log.type}`}>
                            {log.type === 'input' && <span className="prompt">visitor@shoib.dev:~$ </span>}
                            {log.content}
                        </div>
                    ))}
                    <div className="terminal-input-line">
                        <span className="prompt">visitor@shoib.dev:~$ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default TerminalModal;
