import "./Destinations.css";
import { motion } from "framer-motion";

const destinations = [
  {
    name: "Paris",
    country: "France",
    image: "/destinations/paris.jpg",
    tags: ["Romance", "Culture", "Food"],
    rating: 4.9,
    description:
      "The city of love, art, fashion, and unforgettable architecture."
  },
  {
    name: "Tokyo",
    country: "Japan",
    image: "/destinations/tokyo.jpg",
    tags: ["Technology", "Culture", "Food"],
    rating: 4.8,
    description:
      "A vibrant blend of ultra-modern life and deep-rooted traditions."
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "/destinations/bali.jpg",
    tags: ["Beach", "Relaxation", "Nature"],
    rating: 4.7,
    description:
      "A tropical paradise known for beaches, temples, and serenity."
  },
  {
    name: "New York",
    country: "USA",
    image: "/destinations/newyork.jpg",
    tags: ["Urban", "Culture", "Shopping"],
    rating: 4.8,
    description:
      "The city that never sleeps, packed with culture and energy."
  },
  {
    name: "Santorini",
    country: "Greece",
    image: "/destinations/santorini.jpg",
    tags: ["Romance", "Beach", "Views"],
    rating: 4.9,
    description:
      "Iconic white-washed houses with breathtaking sunsets."
  },
  {
    name: "Maldives",
    country: "Maldives",
    image: "/destinations/maldives.jpg",
    tags: ["Luxury", "Beach", "Relaxation"],
    rating: 4.9,
    description:
      "Crystal-clear waters and overwater villas for luxury escapes."
  },
  {
    name: "Machu Picchu",
    country: "MPeru",
    image: "/destinations/peru.jpg",
    tags: ["History", "Adventure", "Nature"],
    rating: 4.9,
    description:
      "Ancient Incan citadel set high in the Andes Mountains - a true wonder of the world."
  },
  {
    name: "Dubai",
    country: "UAE",
    image: "/destinations/dubai.jpg",
    tags: ["Luxury", "Shopping", "Adventure"],
    rating: 4.6,
    description:
      "Futuristic architecture, luxury shopping, and desert adventures in the Arabian Gulf."
  },
  {
  name: "Delhi",
  country: "India",
  image: "/destinations/delhi.jpg",
  tags: ["History", "Culture", "Food"],
  rating: 4.5,
  description:
    "India’s capital city blending ancient monuments, bustling markets, and modern lifestyle."
},
{
  name: "Agra",
  country: "India",
  image: "/destinations/agra.jpg",
  tags: ["History", "Romance", "Architecture"],
  rating: 4.8,
  description:
    "Home to the iconic Taj Mahal, a symbol of love and Mughal architecture."
},
{
  name: "Jaipur",
  country: "India",
  image: "/destinations/jaipur.jpg",
  tags: ["Heritage", "Culture", "Architecture"],
  rating: 4.7,
  description:
    "The Pink City known for royal palaces, forts, and vibrant bazaars."
},
{
  name: "Manali",
  country: "India",
  image: "/destinations/manali.jpg",
  tags: ["Mountains", "Adventure", "Nature"],
  rating: 4.6,
  description:
    "A Himalayan retreat popular for snow activities, trekking, and scenic beauty."
},
{
  name: "Shillong",
  country: "India",
  image: "/destinations/shillong.jpg",
  tags: ["Nature", "Waterfalls", "Culture"],
  rating: 4.7,
  description:
    "The Scotland of the East, famous for waterfalls, hills, and pleasant climate."
},
{
  name: "Gangtok",
  country: "India",
  image: "/destinations/gangtok.jpg",
  tags: ["Mountains", "Culture", "Peace"],
  rating: 4.8,
  description:
    "A serene hill town offering breathtaking views of the Himalayas and monasteries."
},
{
  name: "Goa",
  country: "India",
  image: "/destinations/goa1.jpg",
  tags: ["Beach", "Nightlife", "Relaxation"],
  rating: 4.8,
  description:
    "India’s party capital known for beaches, nightlife, and Portuguese heritage."
},
{
  name: "Mumbai",
  country: "India",
  image: "/destinations/mumbai.jpg",
  tags: ["Urban", "Culture", "Entertainment"],
  rating: 4.6,
  description:
    "The financial capital of India, famous for Bollywood and vibrant city life."
},
{
  name: "Udaipur",
  country: "India",
  image: "/destinations/udaipur.jpg",
  tags: ["Romance", "Lakes", "Heritage"],
  rating: 4.9,
  description:
    "The City of Lakes, offering royal palaces and romantic sunsets."
},
{
  name: "Kerala",
  country: "India",
  image: "/destinations/kerala.jpg",
  tags: ["Backwaters", "Nature", "Wellness"],
  rating: 4.9,
  description:
    "God’s Own Country, famous for backwaters, Ayurveda, and lush greenery."
},
{
  name: "Hyderabad",
  country: "India",
  image: "/destinations/hyderabad.jpg",
  tags: ["Heritage", "Food", "Culture", "Technology"],
  rating: 4.7,
  description:
    "A vibrant city blending rich Nizami heritage, iconic monuments, world-famous biryani, and a booming IT hub."
},

{
  name: "Ooty",
  country: "India",
  image: "/destinations/ooty.jpg",
  tags: ["Hills", "Nature", "Relaxation"],
  rating: 4.6,
  description:
    "A charming hill station known for tea gardens and cool climate."
},
{
  name: "Hampi",
  country: "India",
  image: "/destinations/hampi.jpg",
  tags: ["History", "Architecture", "Culture"],
  rating: 4.8,
  description:
    "A UNESCO World Heritage Site with stunning ruins of the Vijayanagara Empire."
},
{
  name: "Varanasi",
  country: "India",
  image: "/destinations/varanasi.jpg",
  tags: ["Spiritual", "Culture", "History"],
  rating: 4.7,
  description:
    "One of the world’s oldest living cities, known for spiritual ghats and rituals."
},
{
  name: "Kolkata",
  country: "India",
  image: "/destinations/kolkata.jpg",
  tags: ["Culture", "Art", "Food"],
  rating: 4.6,
  description:
    "The cultural capital of India, rich in literature, art, and colonial history."
},
{
  name: "Bhubaneswar",
  country: "India",
  image: "/destinations/bhubaneswar.jpg",
  tags: ["Temples", "History", "Culture"],
  rating: 4.5,
  description:
    "Temple City of India with ancient architecture and spiritual heritage."
}


];

function Destinations() {
  return (
    <motion.div
      className="destinations-page"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/img6.jpg)",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="destinations-header">
        <h1>Popular Destinations</h1>
        <p>
          Explore our handpicked selection of the world’s most amazing places
        </p>
      </div>

      <div className="destinations-grid">
        {destinations.map((d, i) => (
          <motion.div
            key={i}
            className={`destination-card ${
              i % 7 === 0
                ? "card-large"
                : i % 4 === 0
                ? "card-medium"
                : "card-small"
            }`}
            style={{ backgroundImage: `url(${d.image})` }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-overlay">
              <h3>{d.name}</h3>
              <span className="country">📍 {d.country}</span>

              <p className="desc">{d.description}</p>

              <div className="tags">
                {d.tags.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>

              <div className="rating">⭐ {d.rating}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Destinations;
