import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Vastra Handloom Platform</p>
        <h1>Celebrate handcrafted stories from every loom.</h1>
        <p>Discover authentic handwoven sarees, fabrics, and artisan collections in one place.</p>
        <div className="cta-row">
          <a className="primary-btn" href="#collections">Explore collections</a>
          <a className="secondary-btn" href="#about">Meet artisans</a>
        </div>
      </section>

      <section id="collections" className="info-grid">
        <article>
          <h2>Handpicked textiles</h2>
          <p>Browse premium weaves sourced directly from skilled artisans.</p>
        </article>
        <article id="about">
          <h2>Crafted with care</h2>
          <p>Every product reflects tradition, quality, and the story behind the loom.</p>
        </article>
      </section>
    </main>
  )
}

export default App
