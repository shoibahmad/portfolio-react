import React, { useState, useEffect, useRef } from 'react';
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
                newHistory.push({ type: 'output', content: 'Shoib Ahmad' });
                newHistory.push({ type: 'output', content: 'Software Engineer & Full Stack Developer' });
                newHistory.push({ type: 'output', content: 'Currently pursuing MCA at Jamia Hamdard University.' });
                break;
            case 'ls projects':
                newHistory.push({ type: 'output', content: 'projects/' });
                newHistory.push({ type: 'output', content: '├── RuralHealth AI (Full Stack / AI)' });
                newHistory.push({ type: 'output', content: '├── Price Radar (Frontend)' });
                newHistory.push({ type: 'output', content: '├── Secure Eval (FastAPI / React)' });
                newHistory.push({ type: 'output', content: '└── ADR Risk Predictor (ML / Python)' });
                break;
            case 'ls skills':
                newHistory.push({ type: 'output', content: 'skills/' });
                newHistory.push({ type: 'output', content: '├── Languages : Python, Java, C++, Dart, JS' });
                newHistory.push({ type: 'output', content: '├── Frameworks: React, Next.js, Flutter, Flask, FastAPI' });
                newHistory.push({ type: 'output', content: '└── Database  : Firebase, MongoDB, SQL' });
                break;
            case 'contact':
                newHistory.push({ type: 'output', content: 'Email: shoibsahmad@gmail.com' });
                newHistory.push({ type: 'output', content: 'LinkedIn: linkedin.com/in/shoib-ahmad-788096219' });
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
