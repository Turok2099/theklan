"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/525613701366?text=Hola%20The%20Klan,%20quiero%20agendar%20mi%20clase%20gratis!"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      <img src="/WhatsApp.svg.png" alt="WhatsApp" width={60} />
    </a>
  );
}
