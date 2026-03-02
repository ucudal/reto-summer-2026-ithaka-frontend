import ChatBot from '../../components/ChatBot';

export default function Page() {
  const apiBase = process.env.NEXT_PUBLIC_LANGGRAPH_URL ?? 'http://localhost:8000/api/v1';

  return (
    <main style={{ height: '100vh' }}>
      <ChatBot apiBaseUrl={apiBase} />
    </main>
  );
}
