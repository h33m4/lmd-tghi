import { Card } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

interface PhaseCardProps {
  phase: string;
  title: string;
  imageSrc: StaticImageData;
  imageAlt: string;
  items: string[];
  colorScheme?: "blue" | "purple" | "green" | "yellow" | "gray";
  reverseLayout?: boolean;
}

const PhaseCard = ({
  phase,
  title,
  imageSrc,
  imageAlt,
  items,
  colorScheme = "blue",
  reverseLayout = false,
}: PhaseCardProps) => {
  // Color scheme configurations
  const colorConfigs = {
    blue: {
      hoverBg: "hover:from-blue-50 hover:to-indigo-50",
      borderHover: "hover:border-lmh-dark-blue",
      badgeBg: "from-lmh-dark-blue to-blue-600",
      titleColor: "text-lmh-dark-blue group-hover:text-blue-600",
      imageGradient: "from-blue-100 to-indigo-100",
      glowGradient: "from-blue-400 to-purple-600",
      bulletGradient: "from-lmh-dark-blue to-blue-600",
    },
    purple: {
      hoverBg: "hover:from-purple-50 hover:to-pink-50",
      borderHover: "hover:border-lmh-blue",
      badgeBg: "from-lmh-blue to-purple-600",
      titleColor: "text-lmh-blue group-hover:text-purple-600",
      imageGradient: "from-purple-100 to-pink-100",
      glowGradient: "from-purple-400 to-pink-600",
      bulletGradient: "from-lmh-blue to-purple-600",
    },
    gray: {
      hoverBg: "hover:from-gray-50 hover:to-pink-50",
      borderHover: "hover:border-border",
      badgeBg: "from-lmh-blue to-gray-600",
      titleColor: "text-gray-500 group-hover:text-gray-600",
      imageGradient: "from-gray-100 to-gray-200",
      glowGradient: "from-gray-100 to-gray-200",
      bulletGradient: "from-gray-500 to-gray-600",
    },
    green: {
      hoverBg: "hover:from-green-50 hover:to-emerald-50",
      borderHover: "hover:border-green-600",
      badgeBg: "from-green-600 to-emerald-600",
      titleColor: "text-green-600 group-hover:text-emerald-600",
      imageGradient: "from-green-100 to-emerald-100",
      glowGradient: "from-green-400 to-emerald-600",
      bulletGradient: "from-green-600 to-emerald-600",
    },
    yellow: {
      hoverBg: "hover:from-yellow-50 hover:to-yellow-50",
      borderHover: "hover:border-yellow-600",
      badgeBg: "from-yellow-600 to-yellow-600",
      titleColor: "text-yellow-600 group-hover:text-yellow-600",
      imageGradient: "from-yellow-100 to-yellow-100",
      glowGradient: "from-yellow-400 to-yellow-600",
      bulletGradient: "from-yellow-600 to-yellow-600",
    },
  };

  const config = colorConfigs[colorScheme];
  const layoutClasses = reverseLayout
    ? "flex-col lg:flex-row-reverse"
    : "flex-col lg:flex-row";
  const textAlignClasses = reverseLayout ? "lg:text-right" : "";
  const badgePosition = reverseLayout ? "-top-3 -right-3" : "-top-3 -left-3";

  return (
    <Card
      className={`group bg-background hover:bg-gradient-to-r ${config.hoverBg} border-2 border-gray-200 ${config.borderHover} rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
    >
      <div className={`flex ${layoutClasses} items-start gap-8`}>
        <div className="flex-shrink-0 relative">
          <div
            className={`absolute -inset-4 bg-gradient-to-r ${config.glowGradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          ></div>
          <div
            className={`relative  border-none p-4 rounded-2xl group-hover:scale-105 transition-transform duration-300`}
          >
            <Image
              src={imageSrc}
              width={267}
              height={157}
              alt={imageAlt}
              className=""
            />
          </div>
          {/* <div
            className={`absolute ${badgePosition} bg-gradient-to-r ${config.badgeBg} text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg`}
          >
            {phase}
          </div> */}
        </div>
        <div className="flex-1 space-y-4">
          <h3
            className={`text-2xl font-bold ${config.titleColor} transition-colors duration-300 ${textAlignClasses}`}
          >
            {title}
          </h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  reverseLayout ? "lg:flex-row-reverse lg:text-right" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 bg-gradient-to-r ${
                    config.bulletGradient
                  } rounded-full mt-2 ${reverseLayout ? "lg:order-last" : ""}`}
                ></div>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PhaseCard;
