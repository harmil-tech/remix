import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Our Website</h1>
      <p>
        Explore our site to learn more about us. Please visit the{" "}
        <Link to="/about">About</Link> or <Link to="/contact">Contact</Link> pages for more information.
      </p>
      <p style={{ marginTop: "1rem" }}>
        You can also <Link to="/notes">add notes</Link> on our Notes page.
      </p>
      <div style={{ marginTop: "2rem" }}>
      </div>
    </div>
  );
}
