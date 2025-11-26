# MERIDIAN | Generative UI Operating System

> **Concept:** From "Search-to-Navigate" to "Intent-to-Action".

Meridian is a Bachelor's Thesis (TFG) project exploring **Generative UI** concepts applied to a vertical context: **Luxury Residential Management (Meridian Living)**.

Instead of navigating through complex menus to book facilities or manage services, the user declares an intent (e.g., *"I want to play padel tomorrow at 5 PM"*), and the system orchestrates and renders ephemeral UI components specifically tailored to that request in real-time.

## 🏗 Core Tech Stack
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **AI Engine:** Vercel AI SDK (Streaming UI & Tool Calling)
* **Validation:** Zod

## 🧠 Design Philosophy: "Analog-Modern"
The interface mimics the elegance of high-end editorial design (Serif headers, ample whitespace) combined with the fluidity of modern React state management. It aims to reduce cognitive load by presenting tools only when they are needed.

## 🚀 Key Features (In Development)
* **Liquid Interfaces:** UI components are generated on-the-fly based on LLM structured output.
* **Context Awareness:** The system understands dates, user history, and specific constraints.
* **Optimized Architecture:** Designed for low-latency models (`gpt-4o-mini`) using strict tool calling.
