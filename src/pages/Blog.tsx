import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SEO } from "@/components/SEO";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "guida-acquisto-auto-usata-2024",
    title: "Guida Completa all'Acquisto di un'Auto Usata nel 2024",
    excerpt: "Tutto quello che devi sapere per fare un acquisto sicuro: controlli da fare, documenti necessari e come evitare le truffe più comuni.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    category: "Guide",
    author: "Marco Rossi",
    date: "15 Dicembre 2024",
    readTime: "8 min",
    featured: true,
  },
  {
    id: 2,
    slug: "auto-ibride-vs-elettriche",
    title: "Auto Ibride vs Elettriche: Quale Scegliere?",
    excerpt: "Confronto dettagliato tra tecnologie ibride e full electric. Vantaggi, svantaggi e quale conviene in base alle tue esigenze.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
    category: "Tecnologia",
    author: "Giulia Bianchi",
    date: "10 Dicembre 2024",
    readTime: "6 min",
  },
  {
    id: 3,
    slug: "manutenzione-auto-inverno",
    title: "Come Preparare la Tua Auto per l'Inverno",
    excerpt: "Checklist essenziale per affrontare la stagione fredda: batteria, pneumatici, antigelo e altri controlli fondamentali.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    category: "Manutenzione",
    author: "Alessandro Verdi",
    date: "5 Dicembre 2024",
    readTime: "5 min",
  },
  {
    id: 4,
    slug: "finanziamento-auto-migliore",
    title: "Come Ottenere il Miglior Finanziamento Auto",
    excerpt: "Strategie per negoziare tassi vantaggiosi, documenti necessari e come calcolare la rata ideale per il tuo budget.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    category: "Finanza",
    author: "Francesca Martini",
    date: "28 Novembre 2024",
    readTime: "7 min",
  },
  {
    id: 5,
    slug: "suv-compatti-migliori-2024",
    title: "I Migliori SUV Compatti del 2024: Classifica Aggiornata",
    excerpt: "Analisi dei SUV compatti più venduti e consigliati. Confronto prezzi, consumi, spazio e affidabilità.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    category: "Recensioni",
    author: "Marco Rossi",
    date: "20 Novembre 2024",
    readTime: "10 min",
  },
  {
    id: 6,
    slug: "risparmiare-carburante-consigli",
    title: "10 Consigli per Risparmiare Carburante",
    excerpt: "Tecniche di guida efficiente e manutenzione per ridurre i consumi fino al 20%. Risparmia denaro e rispetta l'ambiente.",
    image: "https://images.unsplash.com/photo-1611174743420-3d7df880ce32?w=800",
    category: "Risparmio",
    author: "Giulia Bianchi",
    date: "15 Novembre 2024",
    readTime: "4 min",
  },
];

const categories = ["Tutti", "Guide", "Tecnologia", "Manutenzione", "Finanza", "Recensioni", "Risparmio"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tutti" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedCategory !== "Tutti");

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog"
        description="Scopri guide complete, recensioni, consigli per la manutenzione e le ultime novità dal mondo dell'automotive. Tutto quello che serve per scegliere e mantenere la tua auto. Articoli aggiornati su auto usate, finanziamenti e manutenzione."
        keywords="blog auto, guide auto, consigli auto, manutenzione auto, recensioni auto, news automotive, articoli auto, guide acquisto auto"
        url="/blog"
        type="website"
      />
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Blog & News
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Consigli e Guide Auto
            </h1>
            <p className="text-muted-foreground text-lg">
              Articoli, recensioni e consigli per aiutarti a scegliere e mantenere la tua auto.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cerca articoli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === "Tutti" && !searchQuery && (
        <section className="py-8">
          <div className="container">
            <Link to={`/blog/${featuredPost.slug}`}>
              <article className="group relative grid md:grid-cols-2 gap-6 bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Leggi l'articolo
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container">
          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <article
                    className={cn(
                      "group h-full bg-card rounded-xl overflow-hidden border border-border",
                      "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                      "transition-all duration-300 hover:-translate-y-1",
                      "opacity-0 animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun articolo trovato.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
