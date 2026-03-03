export default function ChatbotPage() {
  const chatbotUrl = process.env.NEXT_PUBLIC_NUEVA_POSTULACION_URL ?? 'http://localhost:3001/';

  return (
    <iframe
      src={chatbotUrl}
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Chatbot Ithaka"
      allow="microphone; clipboard-write"
    />
  );
}
