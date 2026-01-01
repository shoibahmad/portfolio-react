# 🚀 Personal Portfolio Website

A modern, responsive portfolio website built with React and Vite, showcasing professional experience, projects, skills, and achievements with smooth animations and interactive UI elements.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Features

### 🎨 Modern Design
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Eye-catching transitions and scroll animations
- **Dark Theme**: Professional dark color scheme with vibrant accents
- **Glassmorphism Effects**: Modern UI with frosted glass aesthetics

### 📱 Components
- **Hero Section**: Dynamic introduction with animated text and call-to-action buttons
- **About/Profile**: Personal introduction and professional summary
- **Experience**: Interactive timeline of work experience
- **Education**: Academic background with institution details
- **Skills**: Visual skill representation with proficiency levels
- **Projects**: Showcase of key projects with descriptions and tech stack
- **Services**: Professional services offered
- **Certifications**: Display of professional certifications and achievements
- **Contact Form**: Integrated email functionality using EmailJS
- **Resume Modal**: Downloadable resume viewer

### 🎯 Interactive Features
- **Preloader**: Smooth loading animation on initial page load
- **Scroll Progress Bar**: Visual indicator of page scroll position
- **Scroll to Top Button**: Quick navigation back to top of page
- **Smooth Scrolling**: Seamless navigation between sections
- **Notification System**: SweetAlert2 integration for user feedback

---

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.0**: Latest React with hooks and modern features
- **Vite 7.2.4**: Next-generation frontend tooling for fast development
- **JavaScript (ES6+)**: Modern JavaScript features

### Libraries & Tools
- **EmailJS**: Contact form email integration without backend
- **SweetAlert2**: Beautiful, customizable alert modals
- **Font Awesome**: Comprehensive icon library
- **ESLint**: Code quality and consistency

### Deployment
- **GitHub Pages**: Free, reliable static site hosting
- **gh-pages**: Automated deployment to GitHub Pages

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio-react.git
   cd portfolio-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - Hot Module Replacement (HMR) enabled for instant updates

---

## 🏗️ Project Structure

```
portfolio-react/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Profile.jsx
│   │   ├── Experience.jsx
│   │   ├── Education.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Services.jsx
│   │   ├── Certifications.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── ResumeModal.jsx
│   │   ├── Preloader.jsx
│   │   ├── ScrollProgress.jsx
│   │   └── ScrollToTop.jsx
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
├── eslint.config.js     # ESLint configuration
└── README.md            # This file
```

---

## 🎨 Customization Guide

### Personal Information
Edit the component files in `src/components/` to update your personal information:

- **Hero.jsx**: Name, title, tagline, and social links
- **Profile.jsx**: About/bio section
- **Experience.jsx**: Work experience timeline
- **Education.jsx**: Academic credentials
- **Skills.jsx**: Technical and soft skills
- **Projects.jsx**: Portfolio projects
- **Services.jsx**: Professional services
- **Certifications.jsx**: Certificates and achievements

### Contact Form Setup (EmailJS)
1. Create a free account at [EmailJS](https://www.emailjs.com/)
2. Set up an email service and template
3. Update `Contact.jsx` with your EmailJS credentials:
   ```javascript
   const serviceID = 'your_service_id';
   const templateID = 'your_template_id';
   const publicKey = 'your_public_key';
   ```

### Styling
- **Global styles**: Edit `src/index.css`
- **Component styles**: Each component has its own CSS file (e.g., `Header.css`)
- **Colors & Theme**: Update CSS variables in `index.css`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production-ready optimized bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run deploy` | Build and deploy to GitHub Pages |

---

## 🌐 Deployment

### Deploy to GitHub Pages

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy:**
```bash
# Build and deploy in one command
npm run deploy
```

Your site will be live at:
```
https://YOUR_USERNAME.github.io/portfolio-react/
```

---

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)
- **Base Path**: Set to `/portfolio-react/` for GitHub Pages
- **Plugins**: React plugin for JSX and Fast Refresh

### ESLint Configuration
- React Hooks rules enabled
- React Refresh plugin for development
- Modern ES6+ support

---

## 📱 Responsive Breakpoints

The portfolio is optimized for the following breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🎯 Performance Optimizations

- ✅ Code splitting with React.lazy (if implemented)
- ✅ Optimized production build with Vite
- ✅ Minified and compressed assets
- ✅ Fast refresh during development
- ✅ Efficient CSS with component-scoped styles

---

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **React Team**: For the amazing React library
- **Vite Team**: For the blazing-fast build tool
- **EmailJS**: For easy email integration
- **Font Awesome**: For comprehensive icon library
- **SweetAlert2**: For beautiful alerts

---

## 📧 Contact

For any inquiries or feedback, please use the contact form on the website or reach out directly.

---

## 🔗 Links

- **Live Demo**: [https://shoibahmad.in](https://shoibahmad.in)
- **Repository**: [https://github.com/shoibahmad/portfolio-react](https://github.com/shoibahmad/portfolio-react)

---

<div align="center">
  <p>Made with ❤️ and React</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>