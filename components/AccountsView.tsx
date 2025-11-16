import { useState } from "react";
import { Account } from "../types";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "./ui/button";
import svgPaths from "../imports/svg-i3nnj659kh";

interface AccountsViewProps {
  accounts: Account[];
  onEditAccount: (account: Account) => void;
  onAddAccount: () => void;
}

export function AccountsView({ accounts, onEditAccount, onAddAccount }: AccountsViewProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(
    accounts.length > 0 ? accounts[0] : null
  );
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    piEmails: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const accountFields = [
    { id: "account", label: "account:", value: selectedAccount?.name || "" },
    { id: "company", label: "company:", value: selectedAccount?.company || "შპს  მაგთიკომი" },
    { id: "taxId", label: "tax id:", value: selectedAccount?.taxId || "404924070" },
    { id: "piEmails", label: "PI email(s):", value: selectedAccount?.email || "", expandable: true },
    { id: "ccEmails", label: "cc email(s):", value: selectedAccount?.ccEmails?.join(", ") || "dali.maguro@magtico...." },
    { id: "template", label: "template:", value: "NBG usd/gel rate last day of month" },
    { id: "contractStart", label: "contract starts:", value: selectedAccount?.contractStart || "01 Jan 2021" },
    { id: "contractEnd", label: "contracts ends:", value: selectedAccount?.contractEnd || "untill stopped" },
    { id: "contract", label: "contract:", value: "url to cloud storage..." },
    { id: "piArchive", label: "PI archive:", value: "url cloud link for PI storage" },
    { id: "clientId", label: "client ID:", value: selectedAccount?.id || "31" },
  ];

  return (
    <div className="relative w-full bg-white h-full flex justify-center overflow-hidden">
      <div className="max-w-[1800px] w-full h-full flex overflow-hidden">
        {/* Left Sidebar - Account List */}
        <div className="w-[317px] p-[26px] overflow-y-auto flex-shrink-0">
          <p className="font-['Inter'] text-[20px] text-black mb-4">Show by:</p>
          
          <div className="bg-white border border-[#d9d9d9] rounded-[8px] p-[13px]">
            <p className="font-['Inter'] font-semibold text-[16px] text-[#1e1e1e] leading-[1.4] mb-2">
              accounts
            </p>
            <div className="space-y-2 mt-4">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`w-full text-left font-['Inter'] font-medium text-[16px] leading-[35px] hover:underline ${
                    selectedAccount?.id === account.id
                      ? "text-[#1e1e1e]"
                      : "text-[#1e1e1e]/70"
                  }`}
                >
                  {account.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={onAddAccount}
            className="mt-4 w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#d9d9d9] self-stretch flex-shrink-0" />

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedAccount && (
            <>
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <p className="font-['Inter'] text-[20px] text-black">
                  Account: {selectedAccount.name} (PI id : 2533000##) (created {new Date(selectedAccount.createdAt).toLocaleDateString('en-GB')})
                </p>
                <Button
                  onClick={() => onEditAccount(selectedAccount)}
                  variant="outline"
                >
                  Edit Account
                </Button>
              </div>

              <div className="flex gap-8">
                {/* Left Column - Account Details */}
                <div className="flex-1 space-y-4 max-w-[553px]">
                  {accountFields.slice(0, 6).map((field, index) => (
                    <div key={field.id}>
                      {field.expandable && expandedSections[field.id] ? (
                        <div className="bg-white border border-[#d9d9d9] rounded-[8px] p-[16px]">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-start gap-1">
                              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                                {index + 1}.
                              </span>
                              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e] flex-1">
                                {field.label}
                              </span>
                            </div>
                            <button onClick={() => toggleSection(field.id)}>
                              <ChevronUp className="w-5 h-5 text-[#1e1e1e]" />
                            </button>
                          </div>
                          <div className="font-['Inter'] text-[16px] leading-[1.4] text-[#1e1e1e] whitespace-pre-wrap pl-5">
                            dali.maguro@magticom.ge, ali.muro@magticom.ge,{"\n"}
                            dali.maguro@magticom.ge, rest@magticom.ge
                          </div>
                        </div>
                      ) : (
                        <div className="bg-neutral-100 border border-[#d9d9d9] rounded-[8px] p-[16px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 flex-1">
                              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                                {index + 1}.
                              </span>
                              <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                                {field.label}
                              </span>
                              <span className="font-['Inter'] text-[16px] leading-[1.4] text-[#1e1e1e] flex-1 text-right">
                                {field.value}
                              </span>
                            </div>
                            {field.expandable && (
                              <button onClick={() => toggleSection(field.id)}>
                                <ChevronDown className="w-5 h-5 text-[#1e1e1e]" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Column - Contract & Archive Details */}
                <div className="flex-1 space-y-4 max-w-[552px]">
                  <div className="mb-[230px]" />
                  {accountFields.slice(6).map((field, index) => (
                    <div key={field.id} className="bg-neutral-100 border border-[#d9d9d9] rounded-[8px] p-[16px]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 flex-1">
                          <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                            {index + 7}.
                          </span>
                          <span className="font-['Inter'] font-semibold text-[16px] leading-[1.4] text-[#1e1e1e]">
                            {field.label}
                          </span>
                          <span className="font-['Inter'] text-[16px] leading-[1.4] text-[#1e1e1e] flex-1 text-right">
                            {field.value}
                          </span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-[#1e1e1e]" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Preview PI */}
                  <div className="mt-8">
                    <p className="font-['Inter'] text-[20px] text-black mb-4">Preview PI:</p>
                    <div className="shadow-[6px_6px_0px_0px_rgba(0,0,0,0.25)] border border-[#d9d9d9] rounded-[8px] bg-white p-8 h-[408px] flex items-center justify-center">
                      <p className="text-gray-400">Invoice Preview</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="relative h-[10px] w-[864px] mx-auto mt-16">
                <svg className="block size-full" fill="none" viewBox="0 0 870 10">
                  <path d={svgPaths.p1055bf00} fill="#D9D9D9" />
                  <circle cx="315.076" cy="5" r="5" fill="#07BAA4" />
                  <g>
                    <path d={svgPaths.p4ea6100} fill="white" />
                    <path d={svgPaths.p956c980} fill="white" />
                  </g>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
