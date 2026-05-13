import Head from 'next/head';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { PracticalSecuritySection, AvailableForSection } from '../components/SecuritySection';



// Typewriter effect hook
function useTypewriter(strings, speed = 40, backSpeed = 20, loop = true) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index >= strings.length && !loop) return;
    const current = strings[index % strings.length];
    if (!deleting && subIndex < current.length) {
      setTimeout(() => setSubIndex(subIndex + 1), speed);
    } else if (deleting && subIndex > 0) {
      setTimeout(() => setSubIndex(subIndex - 1), backSpeed);
    } else if (!deleting && subIndex === current.length) {
      setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => i + 1);
    }
    setText(current.substring(0, subIndex));
  }, [subIndex, deleting, index, strings, speed, backSpeed, loop]);
  return text;
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  

  
  // Scroll animations
  const containerRef = useRef(null);

  const projects = [
    {
      title: 'Phishing Detection System',
      description: 'Automated phishing URL classifier extracting 30+ features; trained Random Forest and Logistic Regression models on a self-built live dataset achieving high-accuracy detection.',
      features: [
        'Automated phishing URL classifier',
        'Extracted 30+ URL and DOM features',
        'Trained Random Forest and Logistic Regression models',
        'Self-built live dataset for high-accuracy detection'
      ],
      tech: ['Python', 'Machine Learning', 'Scikit-learn', 'Pandas'],
      github: '#'
    },
    {
      title: 'Rakshak - AI Accident Detection',
      description: 'Real-time CV system analyzing roadside camera feeds to auto-detect vehicle accidents and trigger emergency alerts to police and ambulance services.',
      features: [
        'Real-time Computer Vision analysis',
        'Roadside camera feed processing',
        'Automatic vehicle accident detection',
        'Emergency alert triggering system'
      ],
      tech: ['Python', 'Computer Vision', 'OpenCV', 'Deep Learning'],
    },
    {
      title: 'Wake Me - Smart Alarm App',
      description: 'A smart alarm app with sleep detection, quick alarms, and advanced security features. Built with Firebase Realtime Database for seamless data sync.',
      features: [
        'Smart Sleep Detection via phone activity monitoring',
        'Quick Alarm setting with one-tap functionality',
        'Advanced Security measures to protect user data',
        'Firebase Integration for real-time database sync across devices'
      ],
      tech: ['Android', 'Java/Kotlin', 'Firebase', 'Realtime DB'],
      link: 'https://play.google.com/store/apps/details?id=makeme.aryan.makeme',
      linkLabel: 'Live on Play Store',
      image: '/logo.png'
    }
  ];

const typewriterText = useTypewriter([
  '> Building the future...',
  '> Code. Create. Innovate.',
  '> Security First.',
  '> AI-Powered Solutions.',
  '> Next-Gen Development.'
], 40, 20, true);

  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let fontSize = 18;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + 'px monospace';
      ctx.fillStyle = '#2cb67d';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    let interval = setInterval(draw, 50);
    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    });
    return () => clearInterval(interval);
  }, []);

  // Lightweight cursor glow
  useEffect(() => {
    const trail = document.getElementById('cursor-trail');
    if (!trail) return;
    const handleMouseMove = (e) => {
      trail.style.left = e.clientX - 8 + 'px';
      trail.style.top = e.clientY - 8 + 'px';
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Advanced scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      
      // Parallax effect for background elements
      const scrolled = scrollPosition / window.innerHeight;
      let backgroundElements;
      try {
        backgroundElements = document.querySelectorAll('.animate-holographic-matrix');
      } catch (e) {
        backgroundElements = [];
      }
      backgroundElements.forEach((el, index) => {
        try {
          const speed = (index + 1) * 0.5;
          const yPos = scrolled * speed * 100;
          el.style.transform = `translateY(${yPos}px) rotate(${45 + index * 15 + scrolled * 10}deg)`;
        } catch (e) {
          // Ignore errors for elements that may not be visible
        }
      });
      
      // Determine current section
      const sections = ['hero', 'about', 'skills', 'projects', 'security-work', 'available', 'contact'];
      const currentSectionIndex = Math.floor(scrollPosition / window.innerHeight);
      setCurrentSection(sections[currentSectionIndex] || 'hero');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Advanced scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    let elements;
    try {
      elements = document.querySelectorAll('.scroll-reveal');
    } catch (e) {
      elements = [];
    }
    elements.forEach(el => {
      try {
        observer.observe(el);
      } catch (e) {
        // Ignore errors for elements that may not be visible
      }
    });

    return () => observer.disconnect();
  }, []);

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Content loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Aryan Walia - Full-Stack Developer</title>
        <meta name="description" content="Full-Stack Developer specializing in Android, Web, and AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Advanced Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
              />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-cyan-400 mb-2"
              >
                Initializing System
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-400"
              >
                Loading quantum interface...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

              <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white font-sans relative overflow-hidden">
        {/* Ultra Advanced 4D Background System */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Matrix Rain Canvas */}
          <canvas id="matrix-canvas" className="absolute inset-0 w-full h-full opacity-30"></canvas>
          
          {/* Dynamic Neural Network Grid */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* 3D Cyber Grid */}
          <div className="cyber-grid-container">
            <div className="cyber-grid"></div>
          </div>
          
          {/* Subtle ambient dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
          
          {/* Single lightweight cursor glow */}
          <div id="cursor-trail" className="fixed w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full pointer-events-none opacity-40 blur-sm z-50 transition-all duration-150"></div>
          
          {/* Magnetic Field Lines */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="magnetic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,255,255,0.3)"/>
                  <stop offset="50%" stopColor="rgba(138,43,226,0.3)"/>
                  <stop offset="100%" stopColor="rgba(0,255,255,0.3)"/>
                </linearGradient>
              </defs>
              <path d="M 10 10 Q 50 20 90 10 M 10 30 Q 50 40 90 30 M 10 50 Q 50 60 90 50 M 10 70 Q 50 80 90 70 M 10 90 Q 50 100 90 90" 
                    stroke="url(#magnetic)" strokeWidth="0.5" fill="none" className="animate-magnetic-field"/>
            </svg>
          </div>
        </div>
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#363636] bg-black/20 backdrop-blur-md relative z-10">
                      <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                  <g clipPath="url(#clip0_6_535)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Aryan Walia</h2>
              </div>
            </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <a href="#about" className="text-sm font-medium hover:text-cyan-400 transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#skills" className="text-sm font-medium hover:text-cyan-400 transition-colors relative group">
                Skills
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#projects" className="text-sm font-medium hover:text-cyan-400 transition-colors relative group">
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#security-work" className="text-sm font-medium hover:text-cyan-400 transition-colors relative group">
                Security
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-cyan-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#available" className="text-sm font-medium hover:text-cyan-400 transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
            <Link href="/resume" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-bold px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Resume
            </Link>
          </div>



          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>





        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#363636] border-b border-[#555]">
            <nav className="flex flex-col px-6 py-4 space-y-4">
              <a 
                href="#about" 
                className="text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#skills" 
                className="text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Skills
              </a>
              <a 
                href="#projects" 
                className="text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </a>
              <a 
                href="#security-work" 
                className="text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Security
              </a>
              <a 
                href="#available" 
                className="text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Link href="/resume" className="bg-black hover:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors w-fit">
                Resume
              </Link>
            </nav>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-6 md:px-10 py-8">
          {/* Hero Section with Slide Animations */}
          <motion.section 
            className="relative min-h-[600px] rounded-2xl overflow-hidden mb-16 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] border border-[#333] shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Enhanced Matrix code rain animation */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <canvas id="matrix-canvas" className="w-full h-full" />
            </div>
            
            {/* AI Network Grid Overlay */}
            <div className="absolute inset-0 z-5 pointer-events-none opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)`
              }}></div>
            </div>
            
            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto px-4 py-20">
              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {/* AI Brain Icon with advanced effects */}
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 animate-pulse"></div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white relative z-10">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </motion.div>
                <motion.h1 
                  className="text-white text-5xl md:text-7xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text-reveal glitch-text"
                  data-text="Aryan Walia"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Aryan Walia
                </motion.h1>
              </motion.div>
              
              <p className="text-[#adadad] text-xl md:text-2xl max-w-[700px] leading-relaxed mt-4 font-light animate-text-slide-up">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-semibold">Cybersecurity Analyst</span> & 
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-semibold"> SOC Operations</span> 
                — CEH-certified specialist building secure systems and intelligent threat detection solutions. 🛡️
              </p>
              

              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#projects" className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transition-all duration-300 ring-2 ring-cyan-400/40 hover:ring-cyan-400/80 transform hover:scale-105">
                  🔐 Explore My Work
                </a>
                <a href="#available" className="inline-block bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                  🤝 Connect With Me
                </a>

              </div>
            </div>
          </motion.section>

          {/* About Section */}
          <section id="about" className="mb-16 scroll-reveal">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[#333] shadow-xl neural-dots">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">About Me</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-gray-300">
                    I&apos;m <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-semibold">Aryan Walia</span> — a CEH-certified cybersecurity analyst and MCA candidate at NMIMS with hands-on SOC experience. I specialize in threat detection, incident response, and building secure intelligent applications.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-300">
                    My technical arsenal includes <span className="text-purple-400 font-semibold">FortiSIEM, Splunk, Python, and Cloud Platforms</span>. I am skilled in vulnerability assessment, NIST SP 800-30 risk scoring, and MITRE ATT&CK, actively targeting roles in SOC, Security Analysis, and Threat Intelligence.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#333]">
                    <h3 className="text-cyan-400 font-semibold mb-2">🎯 Current Focus</h3>
                    <p className="text-gray-300 text-sm">SOC Operations, Threat Intelligence, Security Automation</p>
                  </div>
                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#333]">
                    <h3 className="text-purple-400 font-semibold mb-2">🚀 Beyond Tech</h3>
                    <p className="text-gray-300 text-sm">Fitness enthusiast, Badminton player, Continuous Learner</p>
                  </div>
                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#333]">
                    <h3 className="text-blue-400 font-semibold mb-2">🔐 Mission</h3>
                    <p className="text-gray-300 text-sm">Defending digital assets and building resilient security infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Skills Section */}
          <section id="skills" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">🛠️ Technical Skills</h2>
            
            {/* Security */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Security</h3>
              <div className="flex flex-wrap gap-3">
                {['FortiSIEM', 'Splunk', 'Wireshark', 'Nmap', 'SOC Operations', 'Incident Response', 'Threat Hunting', 'Phishing Detection', 'Vulnerability Assessment', 'MITRE ATT&CK', 'NIST SP 800-30', 'NIST CSF 2.0', 'ICS/SCADA', 'OT Security'].map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-[#363636] hover:bg-[#555] px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-default border border-cyan-400/20"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud & Networking */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Cloud and Networking</h3>
              <div className="flex flex-wrap gap-3">
                {['Microsoft Azure', 'AWS', 'TCP/IP', 'DNS', 'HTTP/HTTPS', 'REST APIs', 'WinRM', 'Firewall Configuration'].map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-[#363636] hover:bg-[#555] px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-default border border-purple-400/20"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Development */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Development</h3>
              <div className="flex flex-wrap gap-3">
                {['Python', 'JavaScript', 'Java', 'Kotlin', 'HTML', 'CSS', 'React', 'Flask', 'Flutter', 'Firebase', 'MySQL', 'PostgreSQL', 'Git'].map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-[#363636] hover:bg-[#555] px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-default border border-green-400/20"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </section>

 {/* Main Project Section */}
<section className="mb-16 scroll-reveal">
  <h2 className="text-2xl font-bold mb-6 text-gradient-animated">🚀 Main Project</h2>
  <div className="bg-gradient-to-br from-[#363636] to-[#2a2a2a] rounded-2xl p-6 md:p-8 border border-[#555] shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm group" style={{
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  }} data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-perspective="1000">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Endpoint Security Assessment Tool</h3>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">NIST SP 800-30</span>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Built an agentless vulnerability scanner with authenticated and attacker-view modes using WinRM to assess firewall status, open ports, patch levels, and antivirus; implemented NIST SP 800-30 risk scoring mapped to NIST CSF 2.0 with structured remediation reports.
            Delivered a dual-interface system: Python GUI for SOC ops and a Flask dashboard for risk analytics.
          </p>
        </div>

     {/* Features Grid */} <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="bg-[#232323] p-4 rounded-xl border border-[#444] hover:scale-105 transition-all duration-300 cursor-pointer" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)', }}> <div className="flex items-center gap-3 mb-2"> <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"> <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/> </svg> </div> <h4 className="font-semibold text-white">Agentless Scanning</h4> </div> <p className="text-gray-400 text-sm">Authenticated & attacker-view modes via WinRM</p> </div> <div className="bg-[#232323] p-4 rounded-lg border border-[#444]"> <div className="flex items-center gap-3 mb-2"> <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center"> <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/> </svg> </div> <h4 className="font-semibold text-white">Risk Scoring</h4> </div> <p className="text-gray-400 text-sm">NIST SP 800-30 scoring mapped to NIST CSF 2.0</p> </div> <div className="bg-[#232323] p-4 rounded-lg border border-[#444]"> <div className="flex items-center gap-3 mb-2"> <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center"> <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/> </svg> </div> <h4 className="font-semibold text-white">Dual-Interface</h4> </div> <p className="text-gray-400 text-sm">Python GUI for SOC ops & Flask dashboard for analytics</p> </div> <div className="bg-[#232323] p-4 rounded-lg border border-[#444]"> <div className="flex items-center gap-3 mb-2"> <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center"> <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/> </svg> </div> <h4 className="font-semibold text-white">External Exposure</h4> </div> <p className="text-gray-400 text-sm">Port scanning and MAC/vendor detection</p> </div> </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {['Python', 'Flask', 'WinRM', 'NIST SP 800-30', 'NIST CSF 2.0', 'Vulnerability Assessment'].map((tech, index) => (
            <span key={index} className="bg-[#1a1a1a] text-xs px-3 py-1 rounded-full text-gray-300 border border-[#444]">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* App Preview Section (same) */}
      <div className="w-full md:w-80 h-64 bg-gradient-to-br from-red-500 via-gray-800 to-black rounded-2xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-900 rounded-2xl shadow-lg border border-red-500">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-white font-bold text-lg">Security Scanner</p>
          <p className="text-white/80 text-sm mt-1">NIST Compliant</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

          {/* Projects Section with Slide-Sync Skeleton Loader */}
          <section id="projects" className="mb-16 relative scroll-reveal">
            {/* Animated Gradient Bar */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-2 rounded-full bg-gradient-to-b from-[#7f5af0] via-[#2cb67d] to-[#00c6fb] animate-gradientMove" style={{zIndex:1}} />
            <h2 className="text-2xl font-bold mb-6 pl-0 md:pl-6 text-gradient-animated">Projects</h2>
            
            {/* Skeleton Loader */}
            <AnimatePresence>
              {!isContentLoaded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12 md:space-y-10"
                >
                  {[1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="flex flex-col md:flex-row gap-6 items-start bg-[#232323] border border-[#363636] rounded-2xl p-6 md:p-8"
                      style={{ minHeight: '220px' }}
                    >
                      <div className="flex-1 space-y-4">
                        <div className="h-6 bg-[#363636] rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-[#363636] rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-[#363636] rounded animate-pulse w-5/6"></div>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-6 bg-[#363636] rounded-full animate-pulse w-16"></div>
                          ))}
                        </div>
                        <div className="h-10 bg-[#363636] rounded-full animate-pulse w-32"></div>
                      </div>
                      <div className="w-full md:w-64 h-48 bg-[#363636] rounded-xl animate-pulse"></div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Actual Projects Content */}
            <AnimatePresence>
              {isContentLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12 md:space-y-10 relative z-10"
                >
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.1
                      }}
                      whileHover={{ 
                        y: -5, 
                        transition: { duration: 0.2 }
                      }}
                      className="flex flex-col md:flex-row gap-6 items-start bg-gradient-to-br from-[#232323] to-[#1a1a1a] border border-[#363636] rounded-2xl shadow-xl hover:shadow-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden group"
                      style={{ 
                        minHeight: '220px'
                      }}
                    >
                    {/* Hover overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex-1 space-y-4 relative z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                      >
                        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-600 transition-all duration-500">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">{project.description}</p>
                        
                        {/* Tech stack badges with enhanced styling */}
                        {project.tech && (
                          <motion.div 
                            className="flex flex-wrap gap-2 mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                          >
                            {project.tech.map((tech, i) => (
                              <motion.span 
                                key={i} 
                                className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-xs px-3 py-1.5 rounded-full text-gray-200 border border-[#363636] hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300 cursor-default"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 + i * 0.05 }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </motion.div>
                        )}
                        
                        {/* Features with enhanced styling */}
                        {project.features && (
                          <motion.ul 
                            className="list-none text-xs text-gray-400 space-y-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                          >
                            {project.features.map((f, i) => (
                              <motion.li 
                                key={i}
                                className="flex items-start gap-2 before:content-['▸'] before:text-cyan-400 before:font-bold before:flex-shrink-0 before:mt-0.5"
                                initial={{ opacity: 0, x: -5 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 + i * 0.05 }}
                              >
                                {f}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </motion.div>
                      {/* View Project / Custom Link button with enhanced animations */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                      >
                        {((project.github && project.github !== '#') || project.link) && (
                          <motion.a
                            href={project.link || project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-[#7f5af0] to-[#2cb67d] hover:from-[#2cb67d] hover:to-[#7f5af0] text-white font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group/btn"
                            whileHover={{ 
                              scale: 1.05, 
                              y: -2,
                              boxShadow: "0 20px 40px rgba(127, 90, 240, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{project.linkLabel || 'View on GitHub'}</span>
                            <motion.svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              initial={{ x: 0 }}
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </motion.svg>
                          </motion.a>
                        )}
                      </motion.div>
                    </div>
                    <motion.div
                      className="w-full md:w-64 h-48 bg-cover bg-center rounded-xl flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                      style={{ backgroundImage: `url(${project.image})` }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Image overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  </motion.div>
                ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Experience Timeline with Slide Animations */}
          <section id="experience" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gradient-animated">🚀 Experience Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {[
                  {
                    year: "01/2026 - Present",
                    title: "SOC Intern",
                    company: "Niveshan Technologies India Pvt. Ltd.",
                    description: "Monitored security events and performed real-time incident analysis using FortiSIEM, improving triage efficiency through structured alert workflows. Applied MITRE ATT&CK to map attacker TTPs across 10+ scenarios; supported threat hunting, log correlation, and phishing detection.",
                    icon: "🛡️"
                  },
                  {
                    year: "07/2024 - 06/2026",
                    title: "MCA - Cybersecurity",
                    company: "NMIMS University, Mumbai",
                    description: "GPA: 7.57/10",
                    icon: "🎓"
                  },
                  {
                    year: "07/2022 - 08/2022",
                    title: "Web Development Intern",
                    company: "Headway",
                    description: "Built responsive UI components for 3 brand websites using HTML and CSS with secure development standards; delivered 2 client projects on time within a 2-month engagement.",
                    icon: "💻"
                  },
                  {
                    year: "06/2021 - 06/2024",
                    title: "BCA - Web Development",
                    company: "The NorthCap University, Gurugram",
                    description: "GPA: 7.31/10",
                    icon: "🎓"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full border-4 border-[#1a1a1a] z-10"></div>
                    
                    {/* Content */}
                    <div className="ml-16 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-2xl border border-[#333] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{item.title}</h3>
                          <p className="text-cyan-400 font-medium">{item.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                      <div className="mt-3">
                        <span className="text-xs text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded-full">{item.year}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          {/* Certifications Section */}
          <section id="certifications" className="mb-16 scroll-reveal">
            <h2 className="text-2xl font-bold mb-6 text-gradient-animated">🏆 Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Certified Ethical Hacker (CEH)", issuer: "EC-Council", icon: "🛡️" },
                { title: "Fundamentals of OT Cybersecurity (ICS/SCADA)", issuer: "Udemy", icon: "🏭" },
                { title: "Cybersecurity 101", issuer: "TryHackMe", icon: "🔐" },
                { title: "Supervised Machine Learning", issuer: "Coursera", icon: "🤖" }
              ].map((cert, index) => (
                <div key={index} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#333] p-5 rounded-xl flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="text-3xl">{cert.icon}</div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{cert.title}</h3>
                    <p className="text-cyan-400 text-sm mt-1">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Practical Cybersecurity Work Section */}
          <PracticalSecuritySection />

          {/* Available For Section */}
          <AvailableForSection />

    </main>

        {/* Footer */}
        <footer className="bg-[#363636] mt-16 py-8">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_535)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6_535">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className="text-sm font-medium">Aryan Walia</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="mailto:aryanwalia7888@gmail.com" className="text-sm hover:text-gray-300 transition-colors">
                  aryanwalia7888@gmail.com
                </a>
                <span className="text-sm text-gray-400">© 2024 All rights reserved</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
