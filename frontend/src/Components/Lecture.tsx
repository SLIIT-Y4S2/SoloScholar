import React from 'react';

type LectureProps = {
    title: string;
    duration: number;
    selectedMenuItem: string; // Add the selectedMenuItem prop
};

const Lecture: React.FC<LectureProps> = ({ title, duration, selectedMenuItem }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>Duration: {duration} minutes</p>
            <p>Selected Menu Item: {selectedMenuItem}</p> {/* Display the selected menu item */}
        </div>
    );
};

export default Lecture;