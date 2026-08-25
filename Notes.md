### Bugs Found

- The application included a calculate total function that was not being used. This function adds a fee based off of precentage. This fee likely would cost the company lost revenue. The precentage total was also not calculated correctly when passing a numeric value like 10. I added this to the total calculation and provide the fee to the UI for clarity to the customer of the charge.

- If a payment fails, the state for payment is never set in the payment flow which fails to render the PaymentStatus component.

- Canceling a payment was not caught by the pollForCompletion function, causing payments to make the max attempts to process and ultimaetly throwing an error. I called the state to add the payment.

- The api uses a Map() to set the payments into mempory, but when redirecting 3DS the page refreshes and the item is cleared from memory. The solution is to persist this payment to local stoarge and fetch in App.tsx useEffect

- The delay with confirmPayment and the logic in the use effect for ReturnUrlHandler causes the function to be called serveral times locally due to the nature of how react handles mounting and unmounting components locally. This causes a flickering state for the errors being thrown.

#### Your approach to the Payment Status component

I wanted to have a resusable UI component for the Payment Staus, that way it is easier to handle all the cases and provides some uniformity. I used some examples of payment confirmation pages from Dribble to decide what icons and color schemes to use. Icons are implemented in using lucide

#### How you made the payment flow retry-safe

I updated the retry function to include redirect the user back to the main page of the application using the window object from the browser.

#### Any improvements you made and why

I moved all of the business logic that lived inside of the components into hooks for better separation of concerns. This tends to help (at least myself) with debugging and can allow for easier testing.

I also implemented in a state management store using Zustand, this helps keep the source of truth smaller and helps cut down on prop drilling.

I brought in tailwindcss to handle stylings, just makes life a little easier than trying to come up with class names for all the components and keep track of them all.
