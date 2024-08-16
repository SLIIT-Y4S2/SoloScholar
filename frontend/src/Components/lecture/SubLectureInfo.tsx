import React from 'react';

import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button } from 'antd';

const SublectureInfo: React.FC = () => {

    const handleClick = (): void => {
        const url = "http://localhost:3000/database-systems/object-relational-databases/lecture/lectureView";
        window.open(url, "_blank"); // Opens the URL in a new window/tab
    };

    return (
        <>
            <h1>Introduction</h1>

            <br />

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae libero, et qui voluptates impedit numquam ducimus quidem sequi vel dolorum ipsum, suscipit, incidunt velit totam optio molestias consectetur sint! Cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur magnam facilis ipsam impedit eveniet dolores culpa ducimus expedita pariatur laborum dignissimos eaque ipsa voluptatibus, voluptates itaque assumenda vel possimus accusantium?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti voluptatem fugit quis aperiam labore quo id. Quisquam maiores, delectus deserunt quasi, dolores fugit officiis nam, autem impedit dolore optio quas. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem dolore minima, dolorum ab enim pariatur. Deleniti, itaque quia? Minus excepturi laudantium consequatur explicabo ullam voluptatem eaque quo consequuntur beatae? Ullam!</p>
            <br />

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae libero, et qui voluptates impedit numquam ducimus quidem sequi vel dolorum ipsum, suscipit, incidunt velit totam optio molestias consectetur sint! Cum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur magnam facilis ipsam impedit eveniet dolores culpa ducimus expedita pariatur laborum dignissimos eaque ipsa voluptatibus, voluptates itaque assumenda vel possimus accusantium?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti voluptatem fugit quis aperiam labore quo id. Quisquam maiores, delectus deserunt quasi, dolores fugit officiis nam, autem impedit dolore optio quas. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem dolore minima, dolorum ab enim pariatur. Deleniti, itaque quia? Minus excepturi laudantium consequatur explicabo ullam voluptatem eaque quo consequuntur beatae? Ullam!</p>

            <Button style={{ marginTop: "20px" }} type="primary" onClick={handleClick}>
                View Lecture
            </Button>

            <Button
                type="text"
                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                disabled={true}
            >
                Completed
            </Button>
        </>
    );
};

export default SublectureInfo;
