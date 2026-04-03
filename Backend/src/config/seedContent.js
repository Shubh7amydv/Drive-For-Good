// Seed data for charities, content, system config
module.exports = {
  charities: [
    {
      id: "charity_1",
      name: "Teach Golf Foundation",
      category: "Education",
      description: "Brings golf education and mentorship to underserved youth communities, building character and confidence through the game.",
      featured: true,
      events: ["Summer Youth Golf Camp", "Scholarship Awards Ceremony"],
      imageUrl: "https://images.unsplash.com/photo-1577720643272-265fb3e4c3d2?w=400"
    },
    {
      id: "charity_2",
      name: "Golf Gives Back",
      category: "Healthcare",
      description: "Funds medical research and support programs for families affected by common health conditions through golf events and donations.",
      featured: true,
      events: ["Annual Charity Tournament", "Health Awareness Week"],
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"
    },
    {
      id: "charity_3",
      name: "Green Course Initiative",
      category: "Environment",
      description: "Protects and restores natural habitats on golf courses, promoting sustainable golfing practices and biodiversity.",
      featured: false,
      events: ["Course Conservation Day", "Native Species Planting"],
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
    },
    {
      id: "charity_4",
      name: "Veterans Golf Alliance",
      category: "Community",
      description: "Supports veterans through therapeutic golf programs, rehabilitation, and community building on and off the course.",
      featured: true,
      events: ["Veterans Tribute Tournament", "Monthly Support Meetings"],
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400"
    },
    {
      id: "charity_5",
      name: "Women in Golf Empowerment",
      category: "Equality",
      description: "Advances women's participation and leadership in golf through scholarships, coaching, and professional development.",
      featured: false,
      events: ["Women's Golf Leadership Summit", "Mentorship Program"],
      imageUrl: "https://images.unsplash.com/photo-1518611505868-48a8c9b5aad8?w=400"
    },
    {
      id: "charity_6",
      name: "Junior Golf Dreams",
      category: "Youth",
      description: "Provides access to golf training, equipment, and tournaments for talented junior golfers from low-income families.",
      featured: false,
      events: ["Junior Championship", "Equipment Drive"],
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400"
    }
  ],

  platform: {
    name: "Drive For Good",
    tagline: "Track. Compete. Give Back.",
    description: "A modern golf subscription platform where every score you enter fuels monthly prize draws and supports charities you care about.",
    mission: "We believe golf is more than a game—it's a platform for community, competition, and charitable impact. Drive For Good combines your love of golf with meaningful giving, letting you compete monthly for prizes while funding causes that matter.",
    homepage: {
      hero: "Your Scores. Monthly Prizes. Real Impact.",
      subheader: "Subscribe to track your Stableford performance, enter monthly draws, and direct a portion of your subscription to the charity of your choice.",
      cta: "Start Your Subscription"
    }
  },

  draw: {
    executionDay: 1, // 1st of month
    executionTime: "14:00", // 2:00 PM
    timezone: "UTC",
    simulationVisibleToAdminOnly: true
  },

  verification: {
    acceptedFormats: ["jpg", "jpeg", "png", "pdf"],
    maxUploadSizeMb: 10,
    rejectionReasons: [
      "Proof does not show legible scores",
      "Date on proof does not match submission period",
      "Unrelated image or document",
      "Score values inconsistent with platform records",
      "Incomplete or corrupted file"
    ]
  },

  faq: [
    {
      question: "How does Drive For Good work?",
      answer: "Enter your latest 5 Stableford golf scores. Each month, we run a draw with prize pools split across 5-match, 4-match, and 3-match tiers. Winners are verified and paid out. A portion of every subscription supports your chosen charity."
    },
    {
      question: "What is Stableford scoring?",
      answer: "Stableford is a golf scoring format where you earn points based on your score relative to par: 8+ points (eagle or better), 5 points (birdie), 2 points (par), 0 points (bogey), -1 point (double bogey or worse). Valid range: 1–45 points per round."
    },
    {
      question: "How often are draws run?",
      answer: "Draws run monthly on the 1st of each month at 2:00 PM UTC. Only users with active subscriptions during the month are eligible."
    },
    {
      question: "What happens if there's no 5-match winner?",
      answer: "The 5-match prize pool (40%) rolls over to the next month's jackpot. This means jackpots can grow significantly if no one matches all 5 numbers."
    },
    {
      question: "How much of my subscription goes to charity?",
      answer: "You choose a minimum of 10% up to 100% of your subscription to go to your selected charity. You can also make independent donations beyond your subscription."
    },
    {
      question: "Can I change my charity after subscribing?",
      answer: "Yes, you can update your charity selection and contribution percentage anytime from your dashboard. Changes take effect on your next billing cycle."
    },
    {
      question: "How do I claim a prize?",
      answer: "If you win, you'll receive a notification. Upload proof of your scores from the platform. Our team reviews and approves it within 48 hours. Approved winnings are paid to your bank account within 5 business days."
    },
    {
      question: "What if I end my subscription?",
      answer: "You can cancel anytime. Your existing scores remain for historical reference, but you won't be eligible for future draws. Any pending winnings will still be processed."
    }
  ]
};
