import { Link } from "react-router-dom";

const charities = [
  {
    id: "charity_1",
    name: "Teach Golf Foundation",
    category: "Education",
    description: "Brings golf education and mentorship to underserved youth communities.",
    imageUrl: "https://images.unsplash.com/photo-1577720643272-265fb3e4c3d2?w=400"
  },
  {
    id: "charity_2",
    name: "Golf Gives Back",
    category: "Healthcare",
    description: "Funds medical research and support programs for families.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"
  },
  {
    id: "charity_3",
    name: "Green Course Initiative",
    category: "Environment",
    description: "Protects and restores natural habitats on golf courses.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
  },
  {
    id: "charity_4",
    name: "Veterans Golf Alliance",
    category: "Community",
    description: "Supports veterans through therapeutic golf programs.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400"
  }
];

export default function CharitiesPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Our Charity Partners</h1>
        <p>Every subscription supports meaningful causes. Choose the one closest to your heart.</p>
      </header>

      <section className="charities-grid">
        {charities.map((charity) => (
          <article key={charity.id} className="charity-card">
            <img src={charity.imageUrl} alt={charity.name} />
            <h3>{charity.name}</h3>
            <span className="charity-category">{charity.category}</span>
            <p>{charity.description}</p>
            <Link to="/register" className="cta">
              Support & Subscribe
            </Link>
          </article>
        ))}
      </section>

      <section className="charity-impact">
        <h2>Your Impact</h2>
        <p>
          In 2025, Drive For Good subscribers donated over $150,000 to registered charities. Your
          subscription directly supports these organizations in their mission to create positive
          change.
        </p>
      </section>
    </main>
  );
}
