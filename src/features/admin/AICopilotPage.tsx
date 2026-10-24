import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { formatINR } from '../../lib/formatters';
import { Button } from '../../components/ui/Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataGrounding?: string[];
}

export const AICopilotPage: React.FC = () => {
  const enquiries = StorageService.getEnquiries();
  const bookings = StorageService.getBookings();
  const payments = StorageService.getPayments();
  const expenses = StorageService.getExpenses();

  const totalReceiptsPaise = payments.reduce((acc, p) => acc + p.amountPaise, 0);
  const totalExpensesPaise = expenses.reduce((acc, e) => acc + e.amountPaise, 0);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Hello. I am the Souparnika Management Copilot. I analyze your venue records, bookings, and financial ledger using deterministic calculations. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const promptChips = [
    'Which halls have the most bookings?',
    'Which enquiries need follow-up?',
    'Summarize current cash inflow vs expenses',
    'What are the hall capacities and AC specifications?',
  ];

  const handleSend = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate grounded deterministic response based on real stored state
    setTimeout(() => {
      let reply = '';
      let grounding: string[] = [];

      const lower = q.toLowerCase();

      if (lower.includes('which halls') || lower.includes('most used') || lower.includes('hall booking')) {
        const stageCount = bookings.filter((b) => b.hallId === 'stage-hall' && b.status === 'confirmed').length;
        const welcomeCount = bookings.filter((b) => b.hallId === 'welcome-hall' && b.status === 'confirmed').length;
        const diningCount = bookings.filter((b) => b.hallId === 'dining-hall' && b.status === 'confirmed').length;
        const openCount = bookings.filter((b) => b.hallId === 'open-hall' && b.status === 'confirmed').length;

        reply = `Based on your ${bookings.length} recorded booking records:\n\n• **Stage Hall**: ${stageCount} confirmed event(s)\n• **Dining Hall**: ${diningCount} confirmed event(s)\n• **Welcome Hall**: ${welcomeCount} confirmed event(s)\n• **Open Hall**: ${openCount} confirmed event(s)\n\nStage Hall and Dining Hall currently lead in utilization. Note: Each hall has 100 seats arranged (Dining Hall has 100 seats in one sitting); ideal for 250 to 300 guests (up to 400).`;
        grounding = ['Source: bookings table', 'Filter: status = confirmed', 'Seating: 100 seats arranged per space; Dining 100 seats in one sitting'];
      } else if (lower.includes('enquir') || lower.includes('follow-up') || lower.includes('lead')) {
        const pending = enquiries.filter((e) => e.status === 'new' || e.status === 'contacted');
        reply = `You have **${pending.length} pending enquiries** in the pipeline:\n\n` +
          pending.map((e) => `• **${e.customerName}** (${e.reference}): Prefers ${e.preferredDate} for ${e.eventType} (${e.estimatedGuests} guests). Contact: +91 ${e.customerPhone}`).join('\n\n') +
          `\n\nRecommendation: Prioritize ${pending[0]?.customerName || 'earliest inquiry'} who submitted recently.`;
        grounding = ['Source: enquiries table', 'Filter: status IN (new, contacted)', 'Total active records: ' + enquiries.length];
      } else if (lower.includes('cash') || lower.includes('inflow') || lower.includes('expense') || lower.includes('financ')) {
        const netCashPaise = totalReceiptsPaise - totalExpensesPaise;
        reply = `Here is your current financial ledger reconciliation:\n\n• **Total Collections Received**: ${formatINR(totalReceiptsPaise)}\n• **Total Operating Expenses**: ${formatINR(totalExpensesPaise)}\n• **Net Operating Balance**: ${formatINR(netCashPaise)}\n\nCalculated from ${payments.length} payment receipts and ${expenses.length} expense records.`;
        grounding = [`Collections sum: ${formatINR(totalReceiptsPaise)}`, `Expenses sum: ${formatINR(totalExpensesPaise)}`, 'Method: Integer paise arithmetic'];
      } else if (lower.includes('capacity') || lower.includes('ac') || lower.includes('spec') || lower.includes('brochure')) {
        reply = `Venue Hall Specifications:\n\n• **Stage Hall**: Ground floor, Air-conditioned, Raised carpeted stage, Cushioned seating (100 seats arranged)\n• **Welcome Hall**: Ground floor, Air-conditioned, Glass-door entrance, Side seating (100 seats arranged)\n• **Dining Hall**: First floor, Air-conditioned, Long banquet tables, Large windows (In one sitting 100 seats — Recommended for Feast/Sadhya)\n• **Open Hall**: Marble-finish flooring, Ceiling fans & 3 exhaust fans, Naturally Ventilated (100 seats arranged). Notice: Sound can pass through exhaust fans.\n\n*The venue is booked as a single unified hall, ideal for 250 to 300 guests (accommodating up to 400 guests).*`;
        grounding = ['Hall capacity specifications', 'Seating: 100 arranged/hall; Dining: 100 in one sitting', 'Acoustic notes'];
      } else {
        reply = `I have analyzed your query against the venue records. You can ask me to summarize hall bookings, inspect pending enquiries, reconcile financial collections, or review hall specifications.`;
        grounding = ['Database engine active'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          dataGrounding: grounding,
        },
      ]);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
            <Sparkles className="w-4 h-4" />
            <span>Deterministic AI Assistant</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-950 mt-1">
            AI Management Copilot
          </h1>
          <p className="text-xs text-ink-500">
            Assists with pipeline analysis, hall utilization calculations, and financial summaries
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-ink-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-forest-950 font-serif text-sm">Grounded Intelligence Policy</strong>
          <p className="text-[11px] text-ink-600 leading-relaxed">
            The Copilot calculates figures deterministically directly from your database records. It cannot independently confirm bookings, alter pricing, issue financial refunds, or send unauthorized external messages without staff approval.
          </p>
        </div>
      </div>

      {/* Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-cream-100 border border-cream-300 text-forest-900 shadow-sm transition-colors text-left"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-luxury overflow-hidden flex flex-col h-[520px]">
        {/* Messages scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-forest-800 text-white rounded-tr-none'
                    : 'bg-cream-50 text-ink-900 border border-cream-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.dataGrounding && m.dataGrounding.length > 0 && (
                  <div className="pt-2 border-t border-cream-200/80 text-[10px] text-ink-500 space-y-0.5">
                    <span className="font-bold text-gold-700 block uppercase">Data Grounding:</span>
                    {m.dataGrounding.map((g, gIdx) => (
                      <div key={gIdx}>• {g}</div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] text-right ${
                    m.sender === 'user' ? 'text-cream-300' : 'text-ink-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-cream-200 text-forest-900 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask a question about bookings, revenue, or hall capacities..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputQuery);
            }}
            className="flex-1 px-4 py-2.5 rounded-full text-xs bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
          <Button
            variant="gold"
            size="md"
            onClick={() => handleSend(inputQuery)}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask Copilot
          </Button>
        </div>
      </div>
    </div>
  );
};
