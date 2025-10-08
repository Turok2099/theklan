import styles from "@/styles/animations.module.css";

export const TextMarquee = () => {
  const items = [
    "BOX",
    "ARTES MARCIALES MIXTAS",
    "JIU JITSU BRASILEÑO",
    "ENTRENAMIENTO FUNCIONAL",
    "STRIKING",
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap w-full bg-red-600 py-4">
      <div className={`${styles.marquee} inline-block`}>
        {items.map((text, index) => (
          <span
            key={index}
            className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
              font-semibold mx-8 inline-block text-white
            "
          >
            {text}
          </span>
        ))}

        {items.map((text, index) => (
          <span
            key={`repeat-${index}`}
            className="
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
              font-semibold mx-8 inline-block text-white
            "
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
