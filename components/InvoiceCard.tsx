import svgPaths from "../imports/svg-p3nn7paigw";
import { Invoice } from "../types";

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onView }: InvoiceCardProps) {
  return (
    <div className="relative h-[107.156px] w-[139.339px] shrink-0">
      {/* Rounded shadow behind */}
      <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] bg-black/25 rounded-[8px]" style={{ zIndex: -1 }} />
      <div className="absolute inset-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 108">
          <path
            d={svgPaths.p3ee8efc0}
            fill="white"
            stroke="#D9D9D9"
          />
        </svg>
      </div>
      
      {/* Divider line at bottom */}
      <div className="absolute inset-[77.07%_12.43%_22.93%_0.61%]">
        <div className="absolute bottom-[-2.67px] left-0 right-[-2.2%] top-[-2.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 124 6">
            <path
              d={svgPaths.p32fad880}
              fill="#D9D9D9"
            />
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-[11.87%_8%_26.54%_8%] font-['Inter'] text-black overflow-hidden">
        <div className="text-[11px] leading-[1.3] font-bold mb-[2px] truncate">
          {invoice.clientName}
        </div>
        <div className="text-[10px] leading-[1.2] mb-[2px]">
          {invoice.invoiceNumber}
        </div>
        <div className="text-[10px] leading-[1.2]">
          {new Date(invoice.issueDate).toLocaleDateString('en-GB')}
        </div>
      </div>
      
      {/* View button */}
      <button
        onClick={() => onView(invoice)}
        className="absolute inset-[80%_auto_8%_8%] font-['Inter'] font-semibold text-[#757575] text-[10px] leading-none hover:text-black transition-colors cursor-pointer"
      >
        view
      </button>
    </div>
  );
}
