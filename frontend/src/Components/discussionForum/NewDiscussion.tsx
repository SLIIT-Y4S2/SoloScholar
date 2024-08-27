
// import React, { useState } from 'react';
// import { useForumContext } from '../../provider/DiscussionForumContext';


// export default function NewDiscussion() {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     // const { createTopic, course, topic } = useForumContext();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         // const newTopic = await createTopic(title, content);
//         // history.push(`/${course}/${topic}/discussion-forum/topic/${newTopic.id}`);
//     };

//     return (
//         <div className="new-topic">
//             <h2 className="text-2xl font-semibold mb-4">Start New Topic</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">Title</label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="Topic Title"
//                         className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">Content</label>
//                     <textarea
//                         id="content"
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         placeholder="Topic Content"
//                         className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows={6}
//                     />
//                 </div>
//                 <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Create Topic</button>
//             </form>
//         </div>
//     );
// }