import { router } from "expo-router";

const paywallConfig = {
  headerMainPromo: "Stay Consistent with Your Workouts",
  headerSubPromo: "Join thousands of users who have built lasting fitness habits.",
  subscriptionTitle: "App Pro",
  footerMainPromo: "The average user improves consistency by 80% with our personalized workout plans",
  footerSubPromo: "Get structured workout plans that keep you accountable and on track.",
  isClosable: true,
  showReviews: true, // Set to false to hide the testimonials section
  onPurchaseComplete: () => {
    // Handle successful payment
    router.back()
  },
}

const Testimonials = [
  {
    name: "Chris",
    text: "I've never been this consistent with my workouts. This app changed my routine!",
    rating: 5,
  },
  {
    name: "Emily",
    text: "The personalized plan kept me accountable. I've hit my fitness goals!",
    rating: 5,
  },
  {
    name: "James",
    text: "Tracking my progress kept me motivated. I feel stronger every week!",
    rating: 5,
  },
  {
    name: "Sophia",
    text: "The results speak for themselves. This app is worth every penny!",
    rating: 5,
  },
];

export { paywallConfig, Testimonials };