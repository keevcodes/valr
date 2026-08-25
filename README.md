# Checkout & Payment Status

A React + TypeScript checkout application that allows users to review an amount, enter payment details, submit payment, complete any required authentication (3DS), and track the final status.

## Getting Started

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

## What's Here

This is a partially built checkout flow that:
- Displays an order summary with the amount to pay
- Collects payment card details
- Submits payment to a simulated payment API
- Handles payment processing states

The payment API is simulated in-browser — no backend server required. Payments will randomly succeed, fail, or require 3DS authentication to simulate real-world scenarios.

## Your Tasks

### 1. Explore & Fix

Get the app running and explore the code. You'll find bugs — some affect correctness, some affect user safety, some affect production readiness. Fix what you find. **Prioritize issues that could cause money-related problems or poor user experience during payment.**

### 2. Build Payment Status Screen

The `PaymentStatus` component is a placeholder. Build it out properly:
- Display the current payment status clearly
- Handle all possible states: `pending`, `processing`, `requires_action`, `succeeded`, `failed`, `canceled`
- Show appropriate UI for each state (not just text — icons, colors, messaging)
- For `requires_action`: provide a way to complete 3DS authentication
- For `failed`: show the error message and a retry option
- For `succeeded`: show confirmation with payment details

### 3. Build Retry-Safe Confirm Payment Flow

The current flow has issues with:
- Double-submitting payments (clicking pay twice)
- Handling in-flight request states
- Recovering after 3DS redirect

Fix these issues to create a robust payment flow that prevents duplicate charges and handles edge cases gracefully.

### 4. Improvements

Make any improvements you think are valuable. Consider:
- Accessibility (keyboard navigation, screen readers, not relying on color alone)
- Resilience (what happens if API calls fail?)
- User experience (loading states, error messages, feedback)

## Payment API

The payment API is simulated in `src/api/payments.ts`. It mimics a real payment flow:

- **createPayment** — Creates a payment, returns one of:
  - `processing` — Payment is being processed
  - `requires_action` — 3DS authentication needed (provides `redirectUrl`)
  - `failed` — Payment was declined

- **getPaymentStatus** — Polls for current payment status

- **confirmPayment** — Confirms payment after 3DS completion

Payments are stored in-memory and will be cleared on page refresh.

## Time Expectation

Spend roughly 6–8 hours. We're looking at how you approach problems, what you prioritise, and how you communicate your decisions — not perfection.

**Note:** There's intentionally more work here than can be completed perfectly. We want to see how you prioritize.

## Submission

Push your solution to a Git repository and share the link. Include a brief `NOTES.md` describing:
- What bugs you found and how you fixed them
- Your approach to the Payment Status component
- How you made the payment flow retry-safe
- Any improvements you made and why
- AI usage (how, for what and to what extent)
- Anything you'd do differently with more time
