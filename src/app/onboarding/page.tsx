"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: "🔒",
    title: "一键确权，原创保护",
    description: "上传创意即可获得区块链存证证书，永久保存创作时间与内容",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: "🤝",
    title: "精准对接，价值变现",
    description: "AI智能匹配生产商与投资者，让你的创意快速产业化",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: "🛡️",
    title: "全程护航，维权无忧",
    description: "全网侵权监测，专业法务支持，维护您的创意权益",
    color: "from-purple-500 to-pink-600",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/");
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" onClick={handleSkip} className="text-gray-500">
          跳过
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon Animation */}
        <div
          className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center text-6xl mb-8 shadow-2xl transform transition-all duration-500 hover:scale-110`}
        >
          {slides[currentSlide].icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {slides[currentSlide].title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-xs leading-relaxed">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="pb-12 px-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-6 bg-indigo-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentSlide < slides.length - 1 ? (
            <>
              <Button variant="outline" className="flex-1" onClick={handleSkip}>
                跳过
              </Button>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleNext}>
                下一步
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
              onClick={() => router.push("/")}
            >
              立即体验
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}