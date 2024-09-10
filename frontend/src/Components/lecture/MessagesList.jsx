import React, { useEffect, useState } from "react";
import { useAITeacher } from "../../hooks/useAITeacher";
import { generateMarkdownSlides } from "../../services/lecture.service";
import ReactMarkdown from 'react-markdown';

export const MessagesList = ({ currentSubLectureContent, currentSubLectureTopic }) => {
    const messages = useAITeacher((state) => state.messages);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const fetchSlides = async () => {
        if (currentSubLectureContent && currentSubLectureTopic) {
            setLoading(true);
            setError(null);
            try {
                const fetchedSlides = await generateMarkdownSlides(currentSubLectureTopic, currentSubLectureContent);
                setSlides(fetchedSlides);
            } catch (error) {
                setError('Failed to fetch slides. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchSlides();
    }, [currentSubLectureContent, currentSubLectureTopic]);

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    return (
        <div className="w-full" style={{ height: '660px', width:'1280px'}}>
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-4xl text-white">Loading slides...</p>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-6xl text-red-500">Error: {error}</p>
                </div>
            ) : slides.length > 0 ? (
                <div className="relative h-full">
                    <div className="absolute inset-0 bg-white p-6 overflow-y-auto">
                        <ReactMarkdown className="text-5xl max-w-none">
                            {slides[currentSlideIndex]}
                        </ReactMarkdown>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                        <button 
                            onClick={prevSlide} 
                            disabled={currentSlideIndex === 0}
                            className="px-6 py-3 bg-blue-500 text-white text-2xl rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={nextSlide} 
                            disabled={currentSlideIndex === slides.length - 1}
                            className="px-6 py-3 bg-blue-500 text-white text-2xl rounded disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-6xl font-bold text-gray-800 mb-4">Welcome to the Lecture</h2>
                    <h3 className="text-4xl font-bold text-red-600">SE3060</h3>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-4xl">No slides available</p>
                </div>
            )}
        </div>
    );
};