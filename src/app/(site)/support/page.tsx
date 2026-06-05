"use client";

import { useState } from "react";
import { Heart, Coffee, QrCode, Copy, Check, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SupportPage() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const donationMethods = [
    {
      id: "dana",
      name: "DANA",
      value: "085236595907",
      icon: Coffee,
      color: "bg-blue-500",
    },
    {
      id: "saweria",
      name: "Saweria",
      value: "saweria.co/shinnra",
      icon: Heart,
      color: "bg-orange-500",
      link: "https://saweria.co/shinnra"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-danger/10 border border-danger/20 mb-2">
          <Heart className="w-8 h-8 text-danger fill-danger/20" />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          {t("support_me")}
        </h1>
        <p className="text-muted max-w-lg mx-auto leading-relaxed">
          SIKANA is a passion project built to help everyone learn Japanese faster. 
          Your support helps keep the servers running and development active.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QRIS Section */}
        <section className="bg-card border border-border rounded-[32px] p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">QRIS Payment</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-4 aspect-square flex items-center justify-center overflow-hidden">
            <img 
              src="/qrs.jpg" 
              alt="QRIS Support" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <p className="text-xs text-muted text-center leading-relaxed">
            Scan using any digital wallet (DANA, OVO, GoPay, LinkAja) or mobile banking app.
          </p>
        </section>

        {/* Other Methods */}
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-[32px] p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-warning/10 border border-warning/20">
                <Coffee className="w-5 h-5 text-warning" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Direct Support</h2>
            </div>

            <div className="space-y-4">
              {donationMethods.map((method) => (
                <div 
                  key={method.id}
                  className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-xl ${method.color} text-white`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{method.name}</h4>
                      <p className="text-xs text-muted font-mono">{method.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {method.link ? (
                      <a 
                        href={method.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-card border border-border text-muted hover:text-white hover:border-primary/30 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => copyToClipboard(method.value, method.id)}
                        className="p-2 rounded-lg bg-card border border-border text-muted hover:text-white hover:border-primary/30 transition-all relative"
                      >
                        {copied === method.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Socials */}
          <section className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 text-center space-y-4">
            <p className="text-sm text-primary font-medium">
              Don&apos;t forget to follow me on Instagram for updates!
            </p>
            <a 
              href="https://instagram.com/2.shinnra" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-white font-bold hover:text-primary transition-colors"
            >
              <span>@2.shinnra</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
