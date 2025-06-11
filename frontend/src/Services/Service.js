import axios from 'axios';

const backendUrl = import.meta.env.BACKEND_URL

// export async function askLexiBot(question) {
//   const res = await axios.post('http://127.0.0.1:8000/ask', { question });
//   return res.data.answer;
// }

// export const askLexiBot = async (question) => {
//   const res = await fetch("http://localhost:8000/ask", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ question }),
//   });

//   if (!res.ok) throw new Error("Failed to get response from LexiBot");
  
//   const data = await res.json();
//   return data; // contains { answer: "..." }
// };

export const askLexiBot = async (message, session_id,language) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: message, session_id,language }),
  });

  if (!response.ok) throw new Error("API call failed");
  return await response.json();
};

