# Build KB VoiceCart — Gemini-Powered Conversational Shopping

## Objective
Integrate a production-ready, voice-first AI shopping agent into the existing KB FASHIONS web application. Help customers find, compare and purchase clothing through short natural-language conversations instead of manually scrolling through product listings.

## Existing architecture
Preserve the current application and its established design system. Integrate with the existing Next.js/React frontend, Tailwind CSS, backend APIs, PostgreSQL database, product catalog, authentication, cart, order management and Cashfree payment integration. Inspect the repository before changing architecture.

## Customer experience
- Create a prominent "Shop by Voice" entry point.
- Support Telugu and English first, with extensible language configuration.
- Offer microphone input, text input and large tap-friendly controls.
- Use Gemini Live for low-latency voice interaction, following the current official API and authentication documentation.
- Understand product requests, natural budgets, occasions, preferred colors, size requirements and delivery constraints.
- Ask only essential follow-up questions.
- Return at most three relevant product cards initially, with product images, verified prices and concise spoken descriptions.
- Support commands such as "show cheaper", "next", "choose this", "remove this" and "go to checkout".
- Maintain shopping preferences and conversation context within the active session.
- Include easy human support and non-voice alternatives.

## Agent tools
Implement validated backend functions for product search, product details, stock and delivery checks, cart mutation, cart summaries, checkout session creation, authenticated order tracking and human support. Follow existing API conventions and database schemas.

Use Gemini function calling to select tools. The backend must execute all business actions, validate inputs, authorize the customer and return authoritative data.

## Security and payment integrity
- Keep permanent Gemini API keys on the server; follow the supported secure authentication model for browser voice sessions.
- Never let the LLM directly query or modify the database.
- Never trust model-generated prices, stock levels, discounts or payment status.
- Require explicit customer confirmation before order placement or payment initiation.
- Verify Cashfree payments through trusted backend verification and signed webhooks.
- Protect personal data, prevent duplicate mutations and enforce order ownership.
- Apply rate limits, input validation, safe error handling and audit logging.
- Never expose secrets or sensitive backend errors to the browser.

## UI requirements
Create a responsive, mobile-first conversational shopping interface using existing KB FASHIONS branding. Use large buttons, visual product cards, readable prices, optional spoken descriptions, clear listening/speaking states, retry controls and accessible feedback. Avoid excessive scrolling and unnecessary page navigation.

## Testing and deployment
Add automated tests for tool validation, product matching, stock changes, cart actions, authentication, payment failure, duplicate requests, order tracking and human handover. Test Telugu speech with real users. Measure completed purchases, latency, abandonment, customer satisfaction and cost per successful shopping session.

Deploy behind a feature flag. Begin with a limited product category and controlled group of customers. Preserve existing storefront functionality and support a quick rollback.

## Completion criteria
Deliver working code integrated with the existing repository, environment variable documentation, database/API changes where needed, automated tests, deployment instructions and a list of remaining limitations. Do not replace existing working features or claim production readiness before integration and acceptance tests pass.