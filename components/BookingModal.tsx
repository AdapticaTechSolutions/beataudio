
import React, { useState, useEffect } from 'react';
import { XIcon, CheckCircleIcon, LoadingSpinnerIcon, FacebookIcon, ArrowRightIcon, LightIcon, SoundIcon, LedWallIcon, ProjectorIcon, SmokeIcon, SaveIcon, TrashIcon, HistoryIcon, DownloadIcon, ClockIcon } from './icons';
import { EVENT_TYPES } from '../constants';
import { Logo } from './Logo';
import { bookingsApi } from '../lib/api';

interface BookingModalProps {
  onClose: () => void;
}

// --- MICRO COMPONENTS ---

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  return (
    <div className="flex space-x-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i} 
          className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
            i + 1 <= current ? 'w-8 bg-primaryRed shadow-glow-red' : 'w-4 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
};

const ToggleCard: React.FC<{ 
  selected: boolean; 
  onClick: () => void; 
  title: string; 
  icon?: React.ReactNode;
  subtitle?: string;
}> = ({ selected, onClick, title, icon, subtitle }) => (
  <div 
    onClick={onClick}
    className={`
      relative group cursor-pointer p-5 rounded-xl border transition-all duration-300 ease-out
      flex items-center space-x-4
      ${selected 
        ? 'bg-primaryRed/10 border-primaryRed shadow-glow-red transform scale-[1.02]' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }
    `}
  >
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
      ${selected ? 'bg-primaryRed text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20'}
    `}>
      {icon || (selected ? <CheckCircleIcon className="w-5 h-5"/> : <div className="w-4 h-4 rounded-full border border-white/30" />)}
    </div>
    <div className="flex-1">
      <h4 className={`font-semibold text-lg ${selected ? 'text-white' : 'text-white/80'}`}>{title}</h4>
      {subtitle && <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>}
    </div>
    {selected && (
      <div className="absolute top-0 right-0 p-2">
        <div className="w-2 h-2 bg-primaryRed rounded-full shadow-[0_0_10px_rgba(217,38,38,1)] animate-pulse" />
      </div>
    )}
  </div>
);

// --- MAIN MODAL ---

export const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // State
  const [details, setDetails] = useState({
    eventType: '',
    eventDate: null as Date | null,
    guestCount: '',
    venueAddress: '',
    weddingSetup: 'Reception Only',
    ceremonyAddress: '',
    
    // Services
    serviceLights: true,
    serviceSounds: true,
    serviceLedWall: false,
    serviceProjector: false,
    serviceSmoke: false,
    hasBand: false,
    bandRider: '',
    
    // Contact
    fullName: '',
    email: '',
    celNumber: '',
    additionalNotes: ''
  });

  // Fetch booked dates from API
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await bookingsApi.getAll();
        if (response.success && response.data) {
          const confirmedDates = response.data
            .filter((b: any) => b.status === 'Confirmed')
            .map((b: any) => b.eventDate);
          setBookedDates(confirmedDates);
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };
    fetchBookedDates();
  }, []);

  // Check for draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('beat_audio_booking_draft');
    if (draft) {
      setShowDraftPrompt(true);
    }
  }, []);

  const saveDraft = () => {
    setSaveStatus('saving');
    const payload = {
      step,
      details,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('beat_audio_booking_draft', JSON.stringify(payload));
    
    // Simulate API delay for effect
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 800);
  };

  const restoreDraft = () => {
    try {
      const draft = localStorage.getItem('beat_audio_booking_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.details.eventDate) {
          parsed.details.eventDate = new Date(parsed.details.eventDate);
        }
        setDetails(parsed.details);
        setStep(parsed.step);
      }
    } catch(e) { console.error(e); }
    setShowDraftPrompt(false);
  };
  
  const discardDraft = () => {
      localStorage.removeItem('beat_audio_booking_draft');
      setShowDraftPrompt(false);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <>
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'} no-print`}>
      <div 
        className="absolute inset-0 bg-obsidian/90 backdrop-blur-xl transition-opacity" 
        onClick={handleClose}
      />
      
      <div className={`
        relative w-full max-w-7xl h-[95vh] md:h-[850px] bg-[#12141a] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10
        transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isExiting ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'}
      `}>
        
        {/* Close Button & Actions */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
            <button 
                onClick={handleClose}
                className="text-white/50 hover:text-primaryRed transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>

        {/* LEFT PANEL: The "Live Receipt" & Visuals - Only visible on steps 1-3. On Step 4, we use full width or split inside the step */}
        <div className={`hidden md:flex w-1/3 bg-gradient-to-br from-black to-[#1a1d26] flex-col p-10 border-r border-white/5 relative overflow-hidden transition-all duration-500 ${step === 4 ? 'hidden w-0 p-0 opacity-0' : 'w-1/3 opacity-100'}`}>
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primaryRed/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Your Event</h2>
            <p className="text-white/50 text-sm mb-12">Building your experience...</p>
            
            <div className="space-y-6">
              <div className={`transition-all duration-500 ${details.eventDate ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                <label className="text-xs uppercase tracking-widest text-primaryRed font-bold mb-1 block">Date</label>
                <div className="text-xl text-white font-medium">
                   {details.eventDate ? details.eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : '---'}
                </div>
              </div>

              <div className={`transition-all duration-500 delay-75 ${details.eventType ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                <label className="text-xs uppercase tracking-widest text-primaryRed font-bold mb-1 block">Type</label>
                <div className="text-xl text-white font-medium">{details.eventType || '---'}</div>
              </div>

              <div className={`transition-all duration-500 delay-100 ${details.venueAddress ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'}`}>
                <label className="text-xs uppercase tracking-widest text-primaryRed font-bold mb-1 block">Venue</label>
                <div className="text-lg text-white font-medium break-words">{details.venueAddress || '---'}</div>
              </div>
              
               <div className={`transition-all duration-500 delay-150`}>
                <label className="text-xs uppercase tracking-widest text-primaryRed font-bold mb-2 block">Configuration</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    details.serviceLights && 'Lights', 
                    details.serviceSounds && 'Audio', 
                    details.serviceLedWall && 'LED Wall',
                    details.serviceProjector && 'Projector',
                    details.hasBand && 'Live Band'
                  ].filter(Boolean).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">
                      {s}
                    </span>
                  ))}
                  {(!details.serviceLights && !details.serviceSounds) && <span className="text-white/30 text-sm italic">No services selected</span>}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-10">
               {/* Save Progress Button */}
                <button 
                  onClick={saveDraft}
                  disabled={saveStatus !== 'idle'}
                  className="flex items-center space-x-2 text-white/50 hover:text-white transition-colors text-sm mb-4 group"
                >
                    {saveStatus === 'saving' ? (
                        <LoadingSpinnerIcon className="w-4 h-4 animate-spin" />
                    ) : saveStatus === 'saved' ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                        <SaveIcon className="w-4 h-4" />
                    )}
                    <span className={saveStatus === 'saved' ? 'text-green-500' : ''}>
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved Successfully' : 'Save Progress for Later'}
                    </span>
                </button>

               <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
               <p className="text-xs text-white/40 text-center">Beat Audio & Lights</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Interaction Wizard */}
        <div className="flex-1 flex flex-col relative bg-[#12141a]">
          {/* Mobile Header */}
          <div className="md:hidden p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <span className="text-primaryRed font-bold uppercase tracking-widest text-xs">Step {step}/4</span>
                <span className="text-white/60 text-xs">{details.eventDate ? details.eventDate.toLocaleDateString() : 'Select Date'}</span>
             </div>
             <button onClick={saveDraft} className="text-white/50 hover:text-white">
                {saveStatus === 'saved' ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : <SaveIcon className="w-5 h-5" />}
             </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 relative">
             <StepIndicator current={step} total={4} />
             
             {step === 1 && <Step1_DateAndType details={details} setDetails={setDetails} onNext={nextStep} bookedDates={bookedDates} />}
             {step === 2 && <Step2_Services details={details} setDetails={setDetails} onNext={nextStep} onPrev={prevStep} />}
             {step === 3 && <Step3_Details details={details} setDetails={setDetails} onNext={nextStep} onPrev={prevStep} />}
             {step === 4 && (
               <Step4_Submission 
                 details={details} 
                 onPrev={prevStep}
                 onClose={handleClose} 
                />
             )}
          </div>
        </div>

        {/* DRAFT RESTORE OVERLAY */}
        {showDraftPrompt && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#1a1d26] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primaryRed">
                      <HistoryIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Welcome Back!</h3>
                  <p className="text-white/60 mb-8">We found a saved booking in your browser history. Would you like to resume where you left off?</p>
                  
                  <div className="space-y-3">
                      <button 
                          onClick={restoreDraft}
                          className="w-full bg-primaryRed text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105"
                      >
                          Yes, Resume Booking
                      </button>
                      <button 
                          onClick={discardDraft}
                          className="w-full bg-transparent text-white/50 font-bold py-3 px-6 rounded-full hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                          <TrashIcon className="w-4 h-4" />
                          No, Start Fresh
                      </button>
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
    
    {/* HIDDEN PRINT CONTAINER FOR SUBMISSION SUMMARY */}
    <div className="print-only p-8 max-w-[210mm] mx-auto bg-white text-black">
         <div className="flex justify-between items-start mb-8 border-b-2 border-primaryRed pb-6">
            <Logo className="h-12 w-auto" />
            <div className="text-right">
                <h1 className="text-2xl font-bold uppercase">Booking Request</h1>
                <p className="text-sm">Submission Date: {new Date().toLocaleDateString()}</p>
            </div>
         </div>
         <div className="space-y-6">
            <h2 className="font-bold text-lg border-b pb-2">Client Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                 <p><strong>Name:</strong> {details.fullName}</p>
                 <p><strong>Email:</strong> {details.email}</p>
                 <p><strong>Contact:</strong> {details.celNumber}</p>
            </div>
            
            <h2 className="font-bold text-lg border-b pb-2 mt-6">Event Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                 <p><strong>Date:</strong> {details.eventDate?.toLocaleDateString()}</p>
                 <p><strong>Type:</strong> {details.eventType}</p>
                 <p><strong>Venue:</strong> {details.venueAddress}</p>
                 <p><strong>Pax:</strong> {details.guestCount}</p>
                 <p><strong>Ceremony:</strong> {details.weddingSetup === 'Ceremony + Reception' ? `Yes, at ${details.ceremonyAddress}` : 'No'}</p>
            </div>
            
            <h2 className="font-bold text-lg border-b pb-2 mt-6">Requested Services</h2>
             <ul className="list-disc list-inside text-sm">
                 {details.serviceLights && <li>Intelligent Lighting</li>}
                 {details.serviceSounds && <li>Pro Audio System</li>}
                 {details.serviceLedWall && <li>LED Video Wall</li>}
                 {details.serviceProjector && <li>Projector & Screen</li>}
                 {details.serviceSmoke && <li>Smoke & Effects</li>}
                 {details.hasBand && <li>Live Band Setup</li>}
             </ul>
             {details.hasBand && details.bandRider && (
               <div className="mt-4 border-t pt-2">
                 <strong>Band Rider:</strong>
                 <p className="text-xs mt-1 whitespace-pre-wrap">{details.bandRider}</p>
               </div>
             )}
         </div>
         <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
             <h2 className="font-bold text-lg mb-4">Payment Verification Info</h2>
             <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
                <div>
                     <p className="font-bold text-gray-500 text-xs uppercase">Payable Amount</p>
                     <p className="text-xl font-bold text-primaryRed">₱1,000.00</p>
                </div>
                 <div>
                     <p className="font-bold text-gray-500 text-xs uppercase">Channel</p>
                     <p>Manual Transfer / GCash</p>
                </div>
             </div>
         </div>
         <p className="text-center text-xs text-gray-500 mt-12">This is a summary of your inquiry. An official quote will follow.</p>
    </div>
    </>
  );
};


// ----------------------------------------------------------------------
// WIZARD STEPS
// ----------------------------------------------------------------------

const Step1_DateAndType: React.FC<{
  details: any;
  setDetails: any;
  onNext: () => void;
  bookedDates: string[];
}> = ({ details, setDetails, onNext, bookedDates }) => {
  
  // Custom Mini Calendar Implementation for better design control
  const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(details.eventDate || new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const isBooked = (d: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return bookedDates.includes(dateStr);
    };

    const isSelected = (d: number) => {
        return details.eventDate?.getDate() === d && details.eventDate?.getMonth() === month && details.eventDate?.getFullYear() === year;
    };

    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-inner">
            <div className="flex justify-between items-center mb-6 text-white">
                <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors">&lt;</button>
                <span className="font-serif text-xl font-bold">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-center text-xs text-white/40 font-bold">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {blanks.map(b => <div key={`blank-${b}`} />)}
                {days.map(d => {
                    const booked = isBooked(d);
                    const selected = isSelected(d);
                    const isPast = new Date(year, month, d) < new Date(new Date().setHours(0,0,0,0));
                    
                    return (
                        <button
                            key={d}
                            disabled={booked || isPast}
                            onClick={() => setDetails({ ...details, eventDate: new Date(year, month, d) })}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200 relative group
                                ${selected ? 'bg-primaryRed text-white shadow-glow-red scale-110 z-10 font-bold' : 'bg-white/5 text-white/80 hover:bg-white/20'}
                                ${booked ? 'opacity-20 cursor-not-allowed' : ''}
                                ${isPast ? 'opacity-20 cursor-not-allowed' : ''}
                            `}
                        >
                            {d}
                            {booked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-red-500 rotate-45"></div></div>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
  };

  return (
    <div className="animate-enter-slide-up">
      <h3 className="text-3xl font-serif font-bold text-white mb-2">When is the big day?</h3>
      <p className="text-white/50 mb-8">Start by securing your date on our calendar.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
             <Calendar />
        </div>
        <div className="space-y-4">
            <label className="text-white font-bold block mb-4">What type of event is it?</label>
            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {EVENT_TYPES.map(type => (
                    <div 
                        key={type.name}
                        onClick={() => setDetails({...details, eventType: type.name})}
                        className={`
                            cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all duration-300
                            ${details.eventType === type.name 
                                ? 'bg-primaryRed text-white border-primaryRed shadow-glow-red' 
                                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10'
                            }
                        `}
                    >
                        <span className="font-semibold">{type.name}</span>
                        {details.eventType === type.name && <CheckCircleIcon className="w-5 h-5" />}
                    </div>
                ))}
                 <div 
                    onClick={() => setDetails({...details, eventType: 'Other'})}
                    className={`
                        cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all duration-300
                        ${details.eventType === 'Other' 
                            ? 'bg-primaryRed text-white border-primaryRed shadow-glow-red' 
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10'
                        }
                    `}
                >
                    <span className="font-semibold">Other / Custom</span>
                    {details.eventType === 'Other' && <CheckCircleIcon className="w-5 h-5" />}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
         <button 
            onClick={onNext}
            disabled={!details.eventDate || !details.eventType}
            className="group flex items-center bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-primaryRed hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
         >
            Next Step <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

const Step2_Services: React.FC<{
  details: any;
  setDetails: any;
  onNext: () => void;
  onPrev: () => void;
}> = ({ details, setDetails, onNext, onPrev }) => {
    
  const toggle = (key: string) => setDetails({...details, [key]: !details[key]});

  return (
    <div className="animate-enter-slide-up">
      <h3 className="text-3xl font-serif font-bold text-white mb-2">Curate the Experience</h3>
      <p className="text-white/50 mb-8">Select the equipment and talent you need.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <ToggleCard 
            title="Intelligent Lighting" 
            subtitle="Moving heads, uplights, and controllers."
            icon={<LightIcon className="w-6 h-6" />}
            selected={details.serviceLights} 
            onClick={() => toggle('serviceLights')} 
        />
        <ToggleCard 
            title="Pro Audio System" 
            subtitle="Line arrays, subs, and digital mixers."
            icon={<SoundIcon className="w-6 h-6" />}
            selected={details.serviceSounds} 
            onClick={() => toggle('serviceSounds')} 
        />
         <ToggleCard 
            title="LED Video Wall" 
            subtitle="P3 High-definition backdrop display."
            icon={<LedWallIcon className="w-6 h-6" />}
            selected={details.serviceLedWall} 
            onClick={() => toggle('serviceLedWall')} 
        />
         <ToggleCard 
            title="Projector & Screen" 
            subtitle="For AVPs and presentations."
            icon={<ProjectorIcon className="w-6 h-6" />}
            selected={details.serviceProjector} 
            onClick={() => toggle('serviceProjector')} 
        />
         <ToggleCard 
            title="Smoke & Effects" 
            subtitle="Low-lying fog, haze, or bubbles."
            icon={<SmokeIcon className="w-6 h-6" />}
            selected={details.serviceSmoke} 
            onClick={() => toggle('serviceSmoke')} 
        />
        <ToggleCard 
            title="Full Band Setup" 
            subtitle="Drum mics, amplifiers, and monitors."
            icon={<span className="font-bold text-lg">🎸</span>}
            selected={details.hasBand} 
            onClick={() => toggle('hasBand')} 
        />
      </div>

      {details.hasBand && (
          <div className="mb-8 animate-fade-in">
            <label className="text-white text-sm font-bold mb-2 block">Technical Rider (Optional)</label>
            <textarea
                value={details.bandRider}
                onChange={(e) => setDetails({...details, bandRider: e.target.value})}
                placeholder="Paste the band's technical requirements here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primaryRed focus:ring-1 focus:ring-primaryRed transition-all"
                rows={3}
            />
          </div>
      )}

      <div className="flex justify-between items-center mt-8">
         <button onClick={onPrev} className="text-white/50 hover:text-white font-semibold transition-colors">Back</button>
         <button 
            onClick={onNext}
            className="group flex items-center bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-300"
         >
            Next Step <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

const Step3_Details: React.FC<{
  details: any;
  setDetails: any;
  onNext: () => void;
  onPrev: () => void;
}> = ({ details, setDetails, onNext, onPrev }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setDetails({...details, [e.target.name]: e.target.value});
  };

  return (
    <div className="animate-enter-slide-up">
      <h3 className="text-3xl font-serif font-bold text-white mb-2">The Finer Details</h3>
      <p className="text-white/50 mb-8">Tell us where to bring the magic.</p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-white/70">Guest Count</label>
                <input 
                    type="number" 
                    name="guestCount"
                    value={details.guestCount}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:border-primaryRed focus:outline-none transition-colors placeholder-white/20"
                    placeholder="e.g. 150"
                />
            </div>
             <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-white/70">Event Venue</label>
                <input 
                    type="text" 
                    name="venueAddress"
                    value={details.venueAddress}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:border-primaryRed focus:outline-none transition-colors placeholder-white/20"
                    placeholder="Venue Name & City"
                />
            </div>
        </div>

        {/* Wedding Logic */}
        {details.eventType === 'Weddings' && (
             <div className="bg-white/5 p-6 rounded-xl border border-white/10 animate-fade-in">
                <label className="text-white font-bold mb-4 block">Wedding Configuration</label>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="weddingSetup" 
                            value="Reception Only" 
                            checked={details.weddingSetup === 'Reception Only'} 
                            onChange={handleChange}
                            className="mr-2 text-primaryRed focus:ring-primaryRed"
                        />
                        <span className="text-white">Reception Only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="weddingSetup" 
                            value="Ceremony + Reception" 
                            checked={details.weddingSetup === 'Ceremony + Reception'} 
                            onChange={handleChange}
                            className="mr-2 text-primaryRed focus:ring-primaryRed"
                        />
                        <span className="text-white">Ceremony + Reception</span>
                    </label>
                </div>
                {details.weddingSetup === 'Ceremony + Reception' && (
                    <input 
                        type="text" 
                        name="ceremonyAddress"
                        value={details.ceremonyAddress}
                        onChange={handleChange}
                        className="w-full bg-black/30 border border-white/20 rounded px-4 py-2 text-white focus:border-primaryRed focus:outline-none"
                        placeholder="Ceremony Venue Location"
                    />
                )}
             </div>
        )}

        <div className="pt-8 mt-8 border-t border-white/10">
            <h4 className="text-xl text-white font-serif font-bold mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-white/70">Full Name</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={details.fullName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:border-primaryRed focus:outline-none transition-colors placeholder-white/20"
                        placeholder="John Doe"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-white/70">Mobile Number</label>
                    <input 
                        type="tel" 
                        name="celNumber"
                        value={details.celNumber}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:border-primaryRed focus:outline-none transition-colors placeholder-white/20"
                        placeholder="0917 123 4567"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase font-bold text-white/70">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={details.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white text-lg focus:border-primaryRed focus:outline-none transition-colors placeholder-white/20"
                        placeholder="john@example.com"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
         <button onClick={onPrev} className="text-white/50 hover:text-white font-semibold transition-colors">Back</button>
         <button 
            onClick={onNext}
            disabled={!details.venueAddress || !details.fullName || !details.celNumber || !details.email}
            className="group flex items-center bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-primaryRed hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
         >
            Review & Pay <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

const Step4_Submission: React.FC<{
    details: any;
    onPrev: () => void;
    onClose: () => void;
}> = ({ details, onPrev, onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    // Persist ID for this session so it doesn't change on render
    const refId = React.useMemo(() => Math.floor(Math.random() * 899999 + 100000).toString(), []);

    const handleOpenMessenger = () => {
         const text = `Hi Beat Audio! I'd like to confirm my booking (Ref #${refId}) for ${details.eventType} on ${details.eventDate?.toLocaleDateString()}. Here is my payment proof.`;
        window.open(`https://m.me/sherwinsabater?text=${encodeURIComponent(text)}`, '_blank');
    };
    
    const handleSubmit = async () => {
        try {
            // Prepare booking data for API
            const bookingData = {
                customerName: details.fullName,
                contactNumber: details.celNumber,
                email: details.email,
                eventDate: details.eventDate?.toISOString().split('T')[0] || '',
                eventType: details.eventType,
                venue: details.venueAddress,
                ceremonyVenue: details.ceremonyAddress || undefined,
                guestCount: parseInt(details.guestCount) || 0,
                services: [
                    ...(details.serviceLights ? ['Lights'] : []),
                    ...(details.serviceSounds ? ['Sounds'] : []),
                    ...(details.serviceLedWall ? ['LED Wall'] : []),
                    ...(details.serviceProjector ? ['Projector'] : []),
                    ...(details.serviceSmoke ? ['Smoke FX'] : []),
                    ...(details.hasBand ? ['Live Band'] : []),
                ],
                bandRider: details.bandRider || undefined,
                fullName: details.fullName,
                celNumber: details.celNumber,
                venueAddress: details.venueAddress,
                weddingSetup: details.weddingSetup,
                serviceLights: details.serviceLights,
                serviceSounds: details.serviceSounds,
                serviceLedWall: details.serviceLedWall,
                serviceProjector: details.serviceProjector,
                serviceSmoke: details.serviceSmoke,
                hasBand: details.hasBand,
                additionalNotes: details.additionalNotes || undefined,
            };

            // Save to database
            const response = await bookingsApi.create(bookingData);
            
            if (response.success && response.data) {
                setIsSubmitted(true);
                localStorage.removeItem('beat_audio_booking_draft'); // clear draft
                console.log('Booking saved successfully:', response.data);
            } else {
                const errorMsg = response.error || 'Failed to save booking';
                const details = (response as any).details || '';
                console.error('Booking save error:', {
                    error: errorMsg,
                    details: details,
                    code: (response as any).code,
                    fullResponse: response
                });
                alert(`Failed to save booking: ${errorMsg}${details ? '\n\n' + details : ''}`);
            }
        } catch (error: any) {
            console.error('Error submitting booking:', error);
            alert(`An error occurred: ${error.message || 'Please try again.'}`);
        }
    };

    if (isSubmitted) {
        return (
             <div className="animate-scale-in h-full flex flex-col relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <ClockIcon className="w-10 h-10 text-yellow-500" />
                            <div className="absolute inset-0 border-2 border-yellow-500/30 rounded-full animate-pulse-slow"></div>
                        </div>
                        
                        <h3 className="text-3xl font-serif font-bold text-white mb-4">Booking Request Sent</h3>
                        <p className="text-lg text-white/70 mb-6">
                            Thank you, <span className="text-white font-bold">{details.fullName}</span>! We are reviewing your payment proof.
                            <br/>You will receive a confirmation via email or Messenger shortly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => window.print()}
                                className="flex items-center justify-center bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-300 shadow-lg"
                            >
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Summary
                            </button>
                             <button 
                                onClick={handleOpenMessenger}
                                className="flex items-center justify-center bg-[#0084FF] text-white font-bold py-3 px-6 rounded-full hover:bg-[#0072db] transition-all duration-300 shadow-lg"
                            >
                                <FacebookIcon className="w-5 h-5 mr-2" />
                                Open Messenger
                            </button>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                             <div>
                                 <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Reference ID</p>
                                 <p className="font-mono text-xl text-white tracking-widest">#{refId}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
                                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold border border-yellow-500/30">
                                     PENDING VERIFICATION
                                 </span>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <h4 className="text-white font-bold mb-4">Event Details</h4>
                                <ul className="space-y-2 text-sm text-white/70">
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Date</span>
                                        <span className="text-white font-medium">{details.eventDate?.toLocaleDateString()}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Type</span>
                                        <span className="text-white font-medium">{details.eventType}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Guests</span>
                                        <span className="text-white font-medium">{details.guestCount} Pax</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Venue</span>
                                        <span className="text-white font-medium text-right max-w-[150px] truncate">{details.venueAddress}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-white font-bold mb-4">Payment Info</h4>
                                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                    <p className="text-xs text-white/40 mb-1">Reservation Fee</p>
                                    <p className="text-xl font-bold text-primaryRed mb-3">₱1,000.00</p>
                                    
                                    <p className="text-xs text-white/40 mb-1">Payment Method</p>
                                    <p className="text-sm text-white font-medium">Bank Transfer / GCash</p>
                                    
                                    <p className="text-xs text-white/40 mt-3 italic">
                                        * Please keep your transfer receipt until verified.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                         <div className="mt-6 pt-4 border-t border-white/10">
                            <h4 className="text-white font-bold mb-2 text-sm">Services Requested</h4>
                            <div className="flex flex-wrap gap-2">
                                {details.serviceLights && <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">Lights</span>}
                                {details.serviceSounds && <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">Sounds</span>}
                                {details.serviceLedWall && <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">LED Wall</span>}
                                {details.serviceProjector && <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">Projector</span>}
                                {details.hasBand && <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">Live Band</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button 
                            onClick={onClose}
                            className="text-white/40 hover:text-white text-sm underline transition-colors"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-enter-slide-up h-full flex flex-col">
             <div className="flex justify-between items-start mb-4 md:mb-6">
                <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1 md:mb-2">Booking Summary</h3>
                    <p className="text-white/50 text-sm md:text-base">Review your details and settle the reservation fee to lock your date.</p>
                </div>
                 <button onClick={onClose} className="md:hidden text-white/50"><XIcon className="w-6 h-6"/></button>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-6 overflow-hidden min-h-0">
                {/* LEFT: RICH SUMMARY */}
                <div className="flex-1 bg-white/5 rounded-2xl p-4 md:p-6 lg:p-8 border border-white/10 overflow-y-auto custom-scrollbar flex flex-col shadow-inner min-h-0">
                    <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-white/10">
                         <div>
                            <h4 className="text-white font-serif font-bold text-2xl">Event Itinerary</h4>
                            <p className="text-primaryRed text-sm font-bold uppercase tracking-wider mt-1">Pending Reservation</p>
                         </div>
                         <div className="text-right">
                             <span className="text-xs text-white/30 uppercase tracking-widest block">Reference</span>
                             <span className="font-mono text-white/70">#{refId}</span>
                         </div>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        <section>
                            <h5 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 flex items-center">
                                Client Information
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <span className="text-white/50 text-xs block uppercase mb-1">Contact Person</span>
                                    <span className="text-white font-medium text-lg">{details.fullName}</span>
                                </div>
                                 <div>
                                    <span className="text-white/50 text-xs block uppercase mb-1">Contact Number</span>
                                    <span className="text-white font-medium text-lg">{details.celNumber}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-white/50 text-xs block uppercase mb-1">Email Address</span>
                                    <span className="text-white font-medium text-lg">{details.email}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h5 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 flex items-center">
                                Event Logistics
                            </h5>
                            <div className="bg-black/20 rounded-xl p-4 md:p-6 border border-white/5 space-y-3 md:space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-white/60 text-xs block mb-1">Date of Event</span>
                                        <span className="text-white font-bold text-lg leading-tight">
                                            {details.eventDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-white/60 text-xs block mb-1">Event Type</span>
                                        <span className="text-white font-bold text-lg">{details.eventType}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <span className="text-white/60 text-xs block mb-1">Venue / Location</span>
                                        <span className="text-white font-bold">{details.venueAddress}</span>
                                        {details.ceremonyAddress && <span className="block text-white/50 text-xs mt-1 italic">(+ Ceremony at {details.ceremonyAddress})</span>}
                                    </div>
                                     <div>
                                        <span className="text-white/60 text-xs block mb-1">Guest Attendees</span>
                                        <span className="text-white font-bold">{details.guestCount} Pax</span>
                                    </div>
                                </div>

                                {details.eventType === 'Weddings' && (
                                    <div className="pt-2 border-t border-white/5">
                                        <span className="text-white/60 text-xs block mb-1">Wedding Setup</span>
                                        <span className="text-white font-bold text-sm md:text-base">{details.weddingSetup}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h5 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 flex items-center">
                                Technical Requirements
                            </h5>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex flex-wrap gap-2">
                                     {details.serviceLights && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">Lights</span>}
                                     {details.serviceSounds && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">Audio</span>}
                                     {details.serviceLedWall && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">LED Wall</span>}
                                     {details.serviceProjector && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">Projector</span>}
                                     {details.serviceSmoke && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">Smoke FX</span>}
                                     {details.hasBand && <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white border border-white/10">Live Band</span>}
                                </div>
                                {details.hasBand && (
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 mt-2">
                                        <span className="text-white/50 text-xs block mb-2 uppercase font-bold flex items-center">
                                            <span className="w-2 h-2 bg-primaryRed rounded-full mr-2"></span>
                                            Band Technical Rider
                                        </span>
                                        <p className="text-sm text-white/80 italic font-mono whitespace-pre-wrap">
                                            {details.bandRider || "No specific rider listed."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* RIGHT: PAYMENT INSTRUCTIONS */}
                <div className="w-full lg:w-[400px] flex flex-col">
                    <div className="bg-gradient-to-b from-[#1a1d26] to-black border border-white/20 rounded-2xl shadow-2xl flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
                        <div className="p-4 md:p-6 relative z-10 min-h-0">
                            <div className="mb-4 pb-4 border-b border-white/10">
                                <h4 className="text-primaryRed font-bold text-lg md:text-xl mb-1">To Reserve</h4>
                                <p className="text-white/60 text-xs md:text-sm mb-1">Non-Refundable Reservation Fee</p>
                                <p className="text-2xl md:text-3xl font-serif font-bold text-white">₱1,000 Only</p>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-3">
                                    <div className="w-2 h-2 rounded-full bg-primaryRed mr-2"></div>
                                    <span className="text-white font-bold text-xs md:text-sm">Payment Channels</span>
                                </div>
                                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-3">
                                    Payable via Union Bank, BPI, BDO, or GCash transfer.
                                </p>

                                <div className="bg-white/5 rounded-xl border border-white/10 p-3 md:p-4 space-y-3">
                                    <div>
                                        <p className="text-[9px] md:text-[10px] text-primaryRed uppercase tracking-widest font-bold mb-1">Account Details</p>
                                        <p className="text-white/60 text-[10px] md:text-xs uppercase mb-0.5">Account Name</p>
                                        <p className="text-white font-bold text-sm md:text-base">Sherwin F. Sabater</p>
                                    </div>

                                    <div>
                                        <p className="text-white/60 text-[10px] md:text-xs uppercase mb-0.5">GCash</p>
                                        <p className="text-white font-mono font-bold text-base md:text-lg tracking-wider">0977 814 9898</p>
                                    </div>

                                    <div>
                                        <p className="text-white/60 text-[10px] md:text-xs uppercase mb-1.5">Bank Deposits</p>
                                        <div className="space-y-1 text-xs md:text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80">BPI SA</span>
                                                <span className="text-white font-mono text-[10px] md:text-xs">#3639028355</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80">BDO SA</span>
                                                <span className="text-white font-mono text-[10px] md:text-xs">#001900364148</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/80">Unionbank SA</span>
                                                <span className="text-white font-mono text-[10px] md:text-xs">#109453375959</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] md:text-xs text-white/40 italic mb-4 space-y-0.5">
                                <p>* 50% due a month before event.</p>
                                <p>* Remaining balance on the day of event.</p>
                            </div>

                            <div className="space-y-2.5">
                                <button 
                                    onClick={handleOpenMessenger}
                                    className="w-full bg-[#0084FF] hover:bg-[#0072db] text-white font-bold py-2.5 md:py-3.5 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20 group text-sm md:text-base"
                                >
                                    <FacebookIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                    Send Payment Proof
                                </button>
                                
                                <p className="text-[9px] md:text-[10px] text-center text-white/50 px-2">
                                    Send proof to <strong className="text-white">m.me/sherwinsabater</strong> with your complete event details.
                                </p>
                                
                                <div className="pt-3 mt-2 border-t border-white/10">
                                     <button 
                                        onClick={handleSubmit}
                                        className="w-full bg-primaryRed text-white font-bold py-2.5 md:py-3.5 px-4 md:px-6 rounded-xl hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 text-sm md:text-base"
                                    >
                                        Complete Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};