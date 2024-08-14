import { useAITeacher } from "../../hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
    const messages = useAITeacher((state) => state.messages);
    const playMessage = useAITeacher((state) => state.playMessage);
    const currentMessage = useAITeacher((state) => state.currentMessage);

    const classroom = useAITeacher((state) => state.classroom);

    const container = useRef();

    useEffect(() => {
        if (container.current && messages.length) {
            container.current.scrollTo({
                top: container.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages.length]);

    return (
        <div
            className={`${classroom === "default"
                ? "w-[1288px] h-[676px]"
                : "w-[2528px] h-[856px]"
                } p-8 overflow-y-auto flex flex-col space-y-8 bg-transparent opacity-80`}
            ref={container}
        >
            {messages.length === 0 && (
                <div className="h-full w-full grid place-content-center text-center">
                    <h2 className="text-8xl font-bold text-white/90 italic">
                        Database Systems


                    </h2>
                    <h2 className="text-6xl font-bold font-jp text-red-600/90 italic">
                        3 year 2 semester
                        <br />
                        SE3060

                    </h2>
                </div>
            )}
            {messages.map((message) => (
                <div key={message.id} className="flex-grow">
                    <div className="flex items-center gap-3 text-5xl font-bold text-white/90 ">
                        

                            {message.answer}
                        
                    </div>
                </div>
            ))}
        </div>
    );
};
