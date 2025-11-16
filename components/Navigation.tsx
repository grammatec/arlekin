import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  logoSrc?: string;
}

export function Navigation({ activeTab, onTabChange, logoSrc }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "dash" },
    { id: "accounts", label: "accounts" },
    { id: "templates", label: "templates" },
    { id: "history", label: "history" },
    { id: "payroll", label: "payroll" },
  ];

  return (
    <div className="relative w-full bg-white border-b border-[#d9d9d9] flex-shrink-0">
      <div className="flex items-center justify-between px-11 py-9">
        {/* Logo */}
        <div className="w-[186px] h-[63px]">
          {logoSrc ? (
            <ImageWithFallback
              src={logoSrc}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center">
              <span className="font-['Inter'] opacity-30 italic">geochannels</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-[26px] items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`text-[20px] leading-none transition-all ${
                activeTab === tab.id
                  ? "font-['Inter'] font-bold text-black underline decoration-solid [text-underline-position:from-font] [text-decoration-skip-ink:none]"
                  : "font-['Inter'] font-medium text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
