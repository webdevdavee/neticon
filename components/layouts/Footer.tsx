const Footer = () => {
  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <section className="flex items-center justify-between py-4 px-8 border border-background_light">
        <div className="flex items-center gap-5">
          <h2>Neticon</h2>
        </div>
        <p> &copy; {currentYear} Neticon. All rights reserved.</p>
        <p>Developer: David Okpala</p>
      </section>
    </footer>
  );
};

export default Footer;
