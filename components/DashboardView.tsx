import { useState, useRef } from "react";
import { Invoice, Account } from "../types";
import { InvoiceCard } from "./InvoiceCard";
import svgPaths from "../imports/svg-p3nn7paigw";
import { ChevronDown } from "lucide-react";

interface DashboardViewProps {
  invoices: Invoice[];
  accounts: Account[];
  onViewInvoice: (invoice: Invoice) => void;
}

export function DashboardView({ invoices, accounts, onViewInvoice }: DashboardViewProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>(new Date(2025, 9, 1)); // Oct 1, 2025
  const [dateTo, setDateTo] = useState<Date>(new Date(2025, 9, 31)); // Oct 31, 2025
  const [issuedScrollPos, setIssuedScrollPos] = useState(0);
  const [nextScrollPos, setNextScrollPos] = useState(0);
  const [isDraggingIssued, setIsDraggingIssued] = useState(false);
  const [isDraggingNext, setIsDraggingNext] = useState(false);
  const issuedScrollRef = useRef<HTMLDivElement>(null);
  const nextScrollRef = useRef<HTMLDivElement>(null);
  const issuedSliderRef = useRef<HTMLDivElement>(null);
  const nextSliderRef = useRef<HTMLDivElement>(null);

  // Filter invoices based on selected accounts and date range
  const filteredInvoices = invoices.filter(inv => {
    const matchesAccount = selectedAccounts.length === 0 || selectedAccounts.includes(inv.clientName);
    const invoiceDate = new Date(inv.issueDate);
    const matchesDateRange = invoiceDate >= dateFrom && invoiceDate <= dateTo;
    return matchesAccount && matchesDateRange;
  });

  // Get upcoming invoices (Next in line)
  const upcomingInvoices = invoices.filter(inv => inv.status === 'draft').slice(0, 8);
  
  // Format date for display
  const formatDateDisplay = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const toggleAccount = (accountName: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountName)
        ? prev.filter(n => n !== accountName)
        : [...prev, accountName]
    );
  };

  // Handle scroll event to update slider position
  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setScrollPos: (val: number) => void) => {
    if (ref.current) {
      const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
      const percentage = maxScroll > 0 ? (ref.current.scrollLeft / maxScroll) : 0;
      setScrollPos(percentage);
    }
  };

  // Handle slider drag
  const handleSliderDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    sliderRef: React.RefObject<HTMLDivElement>,
    scrollRef: React.RefObject<HTMLDivElement>,
    setScrollPos: (val: number) => void,
    setIsDragging: (val: boolean) => void
  ) => {
    if (!sliderRef.current || !scrollRef.current) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startScrollPos = scrollRef.current.scrollLeft;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current || !scrollRef.current) return;
      
      const deltaX = e.clientX - startX;
      const sliderWidth = sliderRect.width;
      const percentage = deltaX / sliderWidth;
      const scrollDelta = percentage * maxScroll;
      
      scrollRef.current.scrollLeft = Math.max(0, Math.min(maxScroll, startScrollPos + scrollDelta));
      
      const newPercentage = maxScroll > 0 ? (scrollRef.current.scrollLeft / maxScroll) : 0;
      setScrollPos(newPercentage);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full bg-white h-screen flex justify-center overflow-hidden">
      <div className="max-w-[1800px] w-full h-full flex flex-col">
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Account Filters */}
        <div className="w-[225px] p-[20px] overflow-y-auto flex-shrink-0">
          <p className="font-['Inter'] text-[18px] text-black mb-3">Show by:</p>
          
          {/* Accounts List */}
          <div className="bg-white border border-[#d9d9d9] rounded-[8px] p-[10px] mb-3 max-h-[300px] overflow-y-auto">
            <p className="font-['Inter'] font-semibold text-[16px] text-[#1e1e1e] leading-[1.4] mb-2">
              accounts
            </p>
            <div className="space-y-2 mt-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-2">
                  <div
                    onClick={() => toggleAccount(account.name)}
                    className="size-[7.915px] relative cursor-pointer"
                  >
                    <svg className="block size-full" viewBox="0 0 9 9" fill="none">
                      <circle
                        cx="4.45764"
                        cy="4.45764"
                        r="3.95764"
                        fill="white"
                        stroke="#1E1E1E"
                      />
                      {selectedAccounts.includes(account.name) && (
                        <path
                          d={svgPaths.pd8b800}
                          fill="#1E1E1E"
                        />
                      )}
                    </svg>
                  </div>
                  <button
                    onClick={() => toggleAccount(account.name)}
                    className="font-['Inter'] font-medium text-[16px] leading-[35px] text-[#1e1e1e] hover:underline cursor-pointer"
                  >
                    {account.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Date From Filter */}
          <div className="bg-neutral-100 border border-[#d9d9d9] rounded-[8px] p-[12px] mb-3">
            <label className="flex items-center gap-2">
              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                from
              </span>
              <input
                type="date"
                value={dateFrom.toISOString().split('T')[0]}
                onChange={(e) => setDateFrom(new Date(e.target.value))}
                className="bg-transparent border-none outline-none font-['Inter'] font-semibold text-[14px] text-[#1e1e1e] cursor-pointer"
              />
            </label>
          </div>

          {/* Date To Filter */}
          <div className="bg-neutral-100 border border-[#d9d9d9] rounded-[8px] p-[12px]">
            <label className="flex items-center gap-2">
              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                to
              </span>
              <input
                type="date"
                value={dateTo.toISOString().split('T')[0]}
                onChange={(e) => setDateTo(new Date(e.target.value))}
                className="bg-transparent border-none outline-none font-['Inter'] font-semibold text-[14px] text-[#1e1e1e] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#d9d9d9] self-stretch flex-shrink-0" />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Issued Invoices Section */}
          <div className="mb-8">
            <p className="font-['Inter'] text-[18px] text-black mb-4">
              Issued Invoices ({formatDateDisplay(dateFrom)} - {formatDateDisplay(dateTo)})
            </p>
            
            <div className="relative">
              <div 
                ref={issuedScrollRef}
                onScroll={() => handleScroll(issuedScrollRef, setIssuedScrollPos)}
                className="overflow-x-auto px-[40px] py-[40px] scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="grid grid-rows-2 grid-flow-col gap-x-[40px] gap-y-[35px] w-max">
                  {filteredInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onView={onViewInvoice}
                    />
                  ))}
                </div>
              </div>
              
              {/* Slider controls */}
              <div className="flex items-center justify-center mt-4">
                <div 
                  ref={issuedSliderRef}
                  className="relative h-[10px] w-[864px] cursor-pointer"
                >
                  <svg className="block size-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 870 10">
                    <path d={svgPaths.p1055bf00} fill="#D9D9D9" />
                  </svg>
                  {/* Draggable circle */}
                  <div
                    onMouseDown={(e) => handleSliderDrag(e, issuedSliderRef, issuedScrollRef, setIssuedScrollPos, setIsDraggingIssued)}
                    className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                    style={{
                      left: `calc(${issuedScrollPos * 100}% - 10px)`,
                      width: '20px',
                      height: '20px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill="#07BAA4" stroke="white" strokeWidth="2" />
                      <g transform="translate(7, 7)">
                        <path d={svgPaths.p4ea6100} fill="white" transform="scale(1.2)" />
                        <path d={svgPaths.p956c980} fill="white" transform="scale(1.2)" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Dividers */}
          <div className="space-y-[7px] mb-6">
            <div className="h-px bg-[#d9d9d9]" />
            <div className="h-px bg-[#d9d9d9]" />
          </div>

          {/* Next in Line Section */}
          <div>
            <p className="font-['Inter'] text-[18px] text-black mb-4">Next in line:</p>
            
            <div className="relative">
              <div 
                ref={nextScrollRef}
                onScroll={() => handleScroll(nextScrollRef, setNextScrollPos)}
                className="overflow-x-auto px-[40px] py-[20px] pb-[40px] scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-x-[80px]">
                  {upcomingInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onView={onViewInvoice}
                    />
                  ))}
                </div>
              </div>
              
              {/* Slider controls */}
              <div className="flex items-center justify-center mt-4">
                <div 
                  ref={nextSliderRef}
                  className="relative h-[10px] w-[864px] cursor-pointer"
                >
                  <svg className="block size-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 870 10">
                    <path d={svgPaths.p1055bf00} fill="#D9D9D9" />
                  </svg>
                  {/* Draggable circle */}
                  <div
                    onMouseDown={(e) => handleSliderDrag(e, nextSliderRef, nextScrollRef, setNextScrollPos, setIsDraggingNext)}
                    className="absolute top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                    style={{
                      left: `calc(${nextScrollPos * 100}% - 10px)`,
                      width: '20px',
                      height: '20px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill="#07BAA4" stroke="white" strokeWidth="2" />
                      <g transform="translate(7, 7)">
                        <path d={svgPaths.p4ea6100} fill="white" transform="scale(1.2)" />
                        <path d={svgPaths.p956c980} fill="white" transform="scale(1.2)" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="relative h-[10px] w-[864px] mx-auto mt-8">
              <svg className="block size-full" fill="none" viewBox="0 0 870 10">
                <path d={svgPaths.p1055bf00} fill="#D9D9D9" />
                <circle cx="315.076" cy="5" r="5" fill="#07BAA4" />
                <g>
                  <path d={svgPaths.p4ea6100} fill="white" />
                  <path d={svgPaths.p956c980} fill="white" />
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom Dividers */}
          <div className="space-y-[7px] mt-8">
            <div className="h-px bg-[#d9d9d9]" />
            <div className="h-px bg-[#d9d9d9]" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
