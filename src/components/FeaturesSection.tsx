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
    <section className="w-full bg-gray-50 py-12 px-6 md:px-12 lg:px-24">
      {/* Título sección */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          LO QUE OFRECEMOS
        </h2>
        <div className="w-24 h-1 bg-red-600 mx-auto"></div>
      </div>

      {/* Grid de características */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Icon className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              {title}
            </h3>
            <p className="text-gray-600 text-base">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
