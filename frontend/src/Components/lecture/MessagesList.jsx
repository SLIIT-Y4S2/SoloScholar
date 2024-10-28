import React, { useEffect, useRef, useState } from "react";
import { useAITeacher } from "../../hooks/useAITeacher";
import { generateSlides } from "../../services/lecture.service";
import Reveal from 'reveal.js';
import { Download, Maximize } from 'lucide-react';

export const MessagesList = ({ currentSubLectureContent, currentSubLectureTopic }) => {
  const revealRef = useRef(null);
  const containerRef = useRef(null);
  const revealStylesheetRefs = useRef([]);
  const [slides, setSlides] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to dynamically load Reveal.js stylesheets
  const loadRevealStylesheets = () => {
    const stylesheets = [
      'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/league.min.css'
    ];

    stylesheets.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-reveal-stylesheet', ''); // Add identifier
      document.head.appendChild(link);
      revealStylesheetRefs.current.push(link);
    });
  };

  // Function to remove Reveal.js stylesheets
  const removeRevealStylesheets = () => {
    revealStylesheetRefs.current.forEach(link => {
      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
    });
    revealStylesheetRefs.current = [];
  };

  useEffect(() => {
    loadRevealStylesheets();

    return () => {
      // Cleanup function to remove stylesheets and destroy Reveal instance
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
      removeRevealStylesheets();
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const initializeReveal = () => {
      if (containerRef.current && !revealRef.current) {
        revealRef.current = new Reveal(containerRef.current, {
          width: 1280,
          height: 660,
          controls: true,
          progress: true,
          center: true,
          hash: true,
        });
        revealRef.current.initialize();
      }
    };

    if (slides) {
      setTimeout(initializeReveal, 0);
    }

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [slides]);

  const fetchSlides = async () => {
    if (currentSubLectureContent && currentSubLectureTopic) {
      setLoading(true);
      setError(null);
      try {
        const response = await generateSlides(currentSubLectureTopic, currentSubLectureContent);
        setSlides(response.markdownSlides || "");
      } catch (error) {
        setError('Failed to fetch slides. Please try again.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [currentSubLectureContent, currentSubLectureTopic]);

  const handleDownload = () => {
    const presentationContent = containerRef.current?.querySelector('.slides')?.innerHTML || '';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${currentSubLectureTopic || 'Presentation'}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/league.min.css">
      </head>
      <body>
        <div class="reveal">
          <div class="slides">
            ${presentationContent}
          </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/reveal.min.js"></script>
        <script>
          Reveal.initialize();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSubLectureTopic || 'presentation'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ width: '1280px', height: '660px' }}>
        <div className="text-5xl text-white">Loading slides...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ width: '1280px', height: '660px' }}>
        <div className="text-5xl text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="absolute top-4 right-4 flex gap-4 z-10">
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-lg transition-colors"
          title="Download Presentation"
        >
          <Download className="w-16 h-16" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-full shadow-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-16 h-16" />
        </button>
      </div>

      <div ref={containerRef} className="reveal" style={{ width: '1280px', height: '660px' }}>
        <div 
          className="slides"
          dangerouslySetInnerHTML={{ __html: slides }}
        />
      </div>
    </div>
  );
};

export default MessagesList;