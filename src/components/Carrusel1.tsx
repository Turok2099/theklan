import styles from "@/styles/animations.module.css";

export const TextMarquee = () => {
  const items = [
    "JIU JITSU BRASILEÑO",
    "•",
    "ARTES MARCIALES MIXTAS",
    "•",
    "ENTRENAMIENTO FUNCIONAL",
    "•",
    "DEFENSA PERSONAL",
    "•",
    "KICK BOXING",
    "•",
    "GRAPPLING",
    "•",
    "LUCHA OLÍMPICA",
    "•",
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap w-full bg-primary border-y border-white/10 py-3 md:py-4 relative z-20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
      <div className={`${styles.marquee} inline-block`}>
        {/* Set 1 */}
        {items.map((text, index) => (
          <span
            key={index}
            className={`
              text-lg sm:text-xl md:text-2xl font-black italic tracking-widest mx-4 inline-block text-white uppercase
              ${text === "•" ? "text-black/30 scale-150" : ""}
            `}
          >
            {text}
          </span>
        ))}
        {/* Set 2 for seamless loop */}
        {items.map((text, index) => (
          <span
            key={`dup1-${index}`}
            className={`
              text-lg sm:text-xl md:text-2xl font-black italic tracking-widest mx-4 inline-block text-white uppercase
              ${text === "•" ? "text-black/30 scale-150" : ""}
            `}
          >
            {text}
          </span>
        ))}
      </div>
      <div className={`${styles.marquee} inline-block`}>
        {/* Set 3 for seamless loop (extra coverage) */}
        {items.map((text, index) => (
          <span
            key={`dup2-${index}`}
            className={`
              text-lg sm:text-xl md:text-2xl font-black italic tracking-widest mx-4 inline-block text-white uppercase
              ${text === "•" ? "text-black/30 scale-150" : ""}
            `}
          >
            {text}
          </span>
        ))}
        {/* Set 4 for seamless loop (extra coverage) */}
        {items.map((text, index) => (
          <span
            key={`dup3-${index}`}
            className={`
              text-lg sm:text-xl md:text-2xl font-black italic tracking-widest mx-4 inline-block text-white uppercase
              ${text === "•" ? "text-black/30 scale-150" : ""}
            `}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
