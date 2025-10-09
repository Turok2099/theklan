import {
  UserGroupIcon,
  MapPinIcon,
  CubeTransparentIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Entrenadores calificados",
      description:
        "Instructores con amplia experiencia, ambiente positivo y técnicas prácticas.",
      icon: UserGroupIcon,
    },
    {
      title: "Buena ubicación",
      description: "Colonia del Valle, fácil acceso y bien comunicada.",
      icon: MapPinIcon,
    },
    {
      title: "Espacios de entrenamiento",
      description: "Diferentes áreas para entrenar.",
      icon: CubeTransparentIcon,
    },
    {
      title: "Variedad de Disciplinas",
      description: "Contamos con diversas disciplinas de artes marciales.",
      icon: SparklesIcon,
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-16 px-3 md:px-12 lg:px-24">
      {/* Título sección */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="bg-red-600 text-white px-6 py-4 rounded-2xl mb-6 inline-block">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            LO QUE OFRECEMOS
          </h2>
        </div>
        <div className="w-32 h-1.5 bg-red-600 mx-auto mb-4"></div>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Descubre las ventajas que te esperan en The Klan
        </p>
      </div>

      {/* Grid de características */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
          >
            <div className="mb-6 p-4 bg-red-50 rounded-full group-hover:bg-red-600 transition-colors duration-300">
              <Icon className="h-12 w-12 text-red-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
