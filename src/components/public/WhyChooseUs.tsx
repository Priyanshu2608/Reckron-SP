"use client";

import { Shield, FlaskConical, Award, Truck, HelpCircle } from "lucide-react";

interface IWhyChooseItem {
  title: string;
  description: string;
  iconName: string;
}

interface IWhyChooseProps {
  content: {
    title: string;
    items: IWhyChooseItem[];
  };
}

export default function WhyChooseUs({ content }: IWhyChooseProps) {
  // Map string names to Lucide Icon components
  const renderIcon = (name: string) => {
    const size = "w-6 h-6";
    switch (name) {
      case "Shield":
        return <Shield className={`${size} text-accent-blue`} />;
      case "FlaskConical":
        return <FlaskConical className={`${size} text-accent-blue`} />;
      case "Award":
        return <Award className={`${size} text-accent-blue`} />;
      case "Truck":
        return <Truck className={`${size} text-accent-blue`} />;
      default:
        return <HelpCircle className={`${size} text-accent-blue`} />;
    }
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">
            Our Edge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {content.title}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We maintain the highest benchmark across quality check processes, simple logistics, and honest support.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="p-8 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 text-left group"
            >
              {/* Icon container */}
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {renderIcon(item.iconName)}
              </div>

              <h3 className="font-bold text-lg text-slate-900">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
