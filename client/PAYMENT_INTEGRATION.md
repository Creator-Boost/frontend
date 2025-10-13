# Payment Integration Guide

This document explains how to integrate the payment system with your Spring Boot backend and Stripe.

## Overview

The payment system consists of:

1. **PaymentSuccessPage** - Shows after successful payment
2. **PaymentFailurePage** - Shows after failed payment
3. **PaymentButton** - Handles payment initiation
4. **PaymentService** - API calls to backend
5. **PaymentStore** - State management for purchases

## Backend Integration

### Required Spring Boot Endpoints

Your Spring Boot backend should implement these endpoints:

```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    @PostMapping("/create-intent")
    public PaymentIntentResponse createPaymentIntent(@RequestBody CreatePaymentRequest request) {
        // Create Stripe PaymentIntent
        // Return client secret and payment intent ID
    }

    @PostMapping("/confirm")
    public PaymentResult confirmPayment(@RequestBody ConfirmPaymentRequest request) {
        // Confirm payment with Stripe
        // Update order status in database
    }

    @GetMapping("/purchases")
    public List<UserPurchase> getUserPurchases() {
        // Return user's purchase history
    }

    @PostMapping("/success")
    public PaymentResult processPaymentSuccess(@RequestBody PaymentSuccessRequest request) {
        // Handle successful payment
        // Grant access to service
    }

    @PostMapping("/failure")
    public void processPaymentFailure(@RequestBody PaymentFailureRequest request) {
        // Log payment failure
    }
}
```

### Data Models

```java
public class PaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
    // getters and setters
}

public class UserPurchase {
    private String id;
    private String serviceId;
    private String serviceTitle;
    private String packageName;
    private BigDecimal amount;
    private String status; // PENDING, COMPLETED, FAILED, REFUNDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // getters and setters
}
```

## Stripe Integration

### Frontend Integration

To integrate with Stripe, you need to:

1. **Install Stripe dependencies**:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. **Update PaymentButton component**:

```typescript
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

// In PaymentButton component:
const stripe = useStripe();
const elements = useElements();

const handlePayment = async () => {
  if (!stripe || !elements) return;

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${
        window.location.origin
      }/payment/success?service_id=${serviceId}&service_title=${encodeURIComponent(
        serviceTitle
      )}&package_name=${encodeURIComponent(packageName)}&amount=${amount}`,
    },
  });

  if (error) {
    // Handle error
  }
};
```

3. **Environment Variables**:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend Stripe Integration

```java
@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    private Stripe stripe;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount.multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
            .setCurrency(currency)
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(true)
                    .build()
            )
            .build();

        return PaymentIntent.create(params);
    }
}
```

## Usage

### 1. Service Detail Page

The `ServiceDetailPage` automatically:

- Checks if user has purchased the service
- Shows "Access Course" button for purchased services
- Shows "Continue ($X)" button for unpurchased services

### 2. Payment Flow

1. User clicks "Continue" button
2. `PaymentButton` creates payment intent
3. User is redirected to Stripe Checkout
4. After payment:
   - Success: Redirect to `/payment/success` with service details
   - Failure: Redirect to `/payment/failure` with error details

### 3. Purchase State Management

The `PaymentStore` manages:

- User's purchase history
- Purchase status for services
- Automatic UI updates based on purchase status

## Testing

### Test Payment Flow

1. Use Stripe test cards:

   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

2. Test URLs:
   - Success: `/payment/success?service_id=123&service_title=Test&package_name=Basic&amount=99`
   - Failure: `/payment/failure?service_id=123&service_title=Test&package_name=Basic&amount=99&error=Card%20declined`

### Mock Data

For development, you can mock the payment service responses:

```typescript
// In paymentService.ts - add mock flag
const MOCK_PAYMENTS = true;

if (MOCK_PAYMENTS) {
  return Promise.resolve({
    clientSecret: "pi_test_123",
    paymentIntentId: "pi_test_123",
  });
}
```

## Security Considerations

1. **Never expose secret keys** in frontend code
2. **Validate payment status** on backend before granting access
3. **Use HTTPS** for all payment-related requests
4. **Implement webhook handlers** for Stripe events
5. **Store sensitive data** securely in database

## Webhook Integration

Implement Stripe webhooks for reliable payment processing:

```java
@PostMapping("/webhook")
public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                          @RequestHeader("Stripe-Signature") String sigHeader) {
    Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

    switch (event.getType()) {
        case "payment_intent.succeeded":
            // Grant access to service
            break;
        case "payment_intent.payment_failed":
            // Handle failed payment
            break;
    }

    return ResponseEntity.ok("Success");
}
```

## Deployment

1. **Environment Variables**:

   - Production: Use live Stripe keys
   - Development: Use test Stripe keys

2. **CORS Configuration**:

   - Allow frontend domain for payment endpoints
   - Configure Stripe webhook endpoints

3. **Database**:
   - Create tables for orders and purchases
   - Implement proper indexing for performance
