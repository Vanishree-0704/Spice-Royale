
function About() {
  return (
    <section className="page-container">
      <span className="eyebrow">OUR STORY</span>
      <h1 className="page-title">A Tradition of Taste</h1>

      <div className="about-layout">
        <img
          className="about-image"
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000"
          alt="Indian dishes arranged on a table"
        />
        <div>
          <h2>Welcome to Spice Royale</h2>
          <p>
            Spice Royale celebrates the rich flavours and culinary traditions
            of India. Our menu brings together comforting classics, aromatic
            biryanis, delicious vegetarian dishes and satisfying non-vegetarian
            favourites.
          </p>
          <p>
            We believe a good meal brings people together. Every dish on our
            menu is presented with care, warmth and a little royal flair.
          </p>
          <div className="stats-row">
            <div><strong>Fresh</strong><span>Ingredients</span></div>
            <div><strong>Royal</strong><span>Flavours</span></div>
            <div><strong>Made</strong><span>With Care</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
