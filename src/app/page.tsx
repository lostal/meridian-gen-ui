/**
 * MERIDIAN LIVING - Home Page
 * 
 * The main interface combining the header and chat.
 * This is where the Generative UI magic happens.
 */

import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/layout/ChatInterface";

export default function HomePage() {
  return (
    <div className="h-full flex flex-col bg-[--color-cream]">
      {/* Elegant header */}
      <Header />

      {/* Main canvas - the chat interface */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
