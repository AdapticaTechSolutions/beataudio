import React, { useState, useMemo, useCallback, memo } from 'react';
import { XIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from './icons';
import { Calendar } from './Calendar';
import { BOOKINGS, EVENT_TYPES, PACKAGES, EQUIPMENT_SHOWCASE } from '../constants';
import type { Venue } from '../types';

interface BookingModalProps {
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [details, setDetails] = useState({
    guestCount: '',
    projectorOrLed: 'None',
    hasBand: false,
    bandRider: '',
    weddingSetup: 'Reception Only',
    fullName: '',
    celNumber: '',
    email: '',
    venueAddress: '',
  });

  // Memoize booked dates calculation
  const bookedDates = useMemo(() => 
    BOOKINGS
    .filter(b => b.status === 'Confirmed')
      .map(b => b.eventDate),
    []
  );

  // Memoize filtered packages to avoid recalculation on every render
  const filteredPackages = useMemo(() => {
    if (!selectedEventType) return PACKAGES;
    
    return PACKAGES.filter(pkg => {
      if (selectedEventType === 'Weddings') return pkg.name.includes('Wedding');
      if (selectedEventType === 'Corporate') return pkg.name.includes('Corporate');
      if (selectedEventType === 'Kiddie Parties') return pkg.name.includes('Kids');
      if (selectedEventType === 'Debuts') return pkg.name.includes('Debutante');
      return true;
    });
  }, [selectedEventType]);

  // Memoize package object lookup
  const packageObj = useMemo(() => 
    PACKAGES.find(p => p.name === selectedPackage),
    [selectedPackage]
  );
  
  const availableVenues = useMemo(() => packageObj?.venues || [], [packageObj]);
  const packageEquipment = useMemo(() => 
    packageObj?.equipment && packageObj.equipment.length > 0 
      ? packageObj.equipment 
      : EQUIPMENT_SHOWCASE,
    [packageObj]
  );

  // Memoize callbacks to prevent unnecessary re-renders
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const toggleVenue = useCallback((venueId: string) => {
    setSelectedVenues(prev => 
      prev.includes(venueId) 
        ? prev.filter(id => id !== venueId)
        : [...prev, venueId]
    );
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1SelectEvent 
                  nextStep={() => setStep(2)} 
          selectedEventType={selectedEventType}
          onSelectEventType={setSelectedEventType}
        />;
      case 2:
        return <Step2SelectPackage
          nextStep={() => setStep(3)}
          prevStep={() => setStep(1)}
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          packages={filteredPackages}
        />;
      case 3:
        return <Step3EquipmentShowcase
          nextStep={() => setStep(4)}
          prevStep={() => setStep(2)}
          equipment={packageEquipment.length > 0 ? packageEquipment : EQUIPMENT_SHOWCASE}
        />;
      case 4:
        return <Step4SelectVenues
          nextStep={() => setStep(5)}
          prevStep={() => setStep(3)}
          venues={availableVenues}
          selectedVenues={selectedVenues}
          onToggleVenue={toggleVenue}
        />;
      case 5:
        return <Step5DateAndContact
          nextStep={() => setStep(6)}
          prevStep={() => setStep(4)}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  bookedDates={bookedDates}
                  details={details}
                  setDetails={setDetails}
                />;
      case 6:
        return <Step6Downpayment
          nextStep={() => setStep(7)}
          prevStep={() => setStep(5)}
          email={details.email}
        />;
      case 7:
        return <Step7Confirmation email={details.email} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleBackdropClick}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border-2 border-primaryRed/20 transform transition-all duration-300 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-darkGray/50 hover:text-primaryRed transition-colors z-10"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primaryRed">Step {step} of 7</span>
              <span className="text-xs text-darkGray">{Math.round((step / 7) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-lightGray rounded-full h-2">
              <div 
                className="bg-primaryRed h-2 rounded-full transition-all duration-150"
                style={{ width: `${(step / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

// Step 1: Select Event Type - Memoized for performance
const Step1SelectEvent = memo<{
  nextStep: () => void;
  selectedEventType: string;
  onSelectEventType: (type: string) => void;
}>(({ nextStep, selectedEventType, onSelectEventType }) => {
  const handleSelect = useCallback((type: string) => {
    onSelectEventType(type);
  }, [onSelectEventType]);

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Select Your Event Type</h2>
      <p className="text-darkGray mb-8">Choose the type of event you're planning</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {EVENT_TYPES.map((event) => (
          <button
            key={event.name}
            onClick={() => handleSelect(event.name)}
            className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-150 transform hover:scale-105 ${
              selectedEventType === event.name
                ? 'border-primaryRed shadow-lg shadow-primaryRed/20'
                : 'border-mediumGray/50 hover:border-primaryRed/50'
            }`}
          >
            <div className="aspect-video relative">
              <img 
                src={event.image} 
                alt={event.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-150"
              />
              <div className={`absolute inset-0 transition-all duration-150 ${
                selectedEventType === event.name ? 'bg-primaryRed/20' : 'bg-black/40'
              }`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-bold text-lg sm:text-xl text-white drop-shadow-lg ${
                  selectedEventType === event.name ? 'text-primaryRed' : ''
                }`}>
                  {event.name}
                </span>
              </div>
              {selectedEventType === event.name && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className="w-6 h-6 text-primaryRed bg-white rounded-full" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={nextStep}
        disabled={!selectedEventType}
        className="w-full bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-150 disabled:bg-mediumGray disabled:cursor-not-allowed text-lg"
      >
        Next: Choose Package
        <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
      </button>
    </div>
  );
});
Step1SelectEvent.displayName = 'Step1SelectEvent';

// Step 2: Select Package (with venues shown) - Memoized for performance
const Step2SelectPackage = memo<{
  nextStep: () => void;
  prevStep: () => void;
  selectedPackage: string;
  onSelectPackage: (pkg: string) => void;
  packages: typeof PACKAGES;
}>(({ nextStep, prevStep, selectedPackage, onSelectPackage, packages }) => {
  const handleSelect = useCallback((pkgName: string) => {
    onSelectPackage(pkgName);
  }, [onSelectPackage]);

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Choose Your Package</h2>
      <p className="text-darkGray mb-8">Select a package and see available venues</p>

      <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            onClick={() => handleSelect(pkg.name)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-150 ${
              selectedPackage === pkg.name
                ? 'border-primaryRed bg-primaryRed/5 shadow-lg'
                : 'border-mediumGray/50 hover:border-primaryRed/50'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-32 flex-shrink-0">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-black">{pkg.name}</h3>
                  {pkg.badge && (
                    <span className="bg-primaryRed text-white text-xs font-bold px-2 py-1 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="text-darkGray text-sm mb-2">{pkg.description}</p>
                <p className="text-primaryRed font-bold mb-3">{pkg.priceRange}</p>
                
                {/* Show venues for this package */}
                {pkg.venues && pkg.venues.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-darkGray mb-2">Available Venues:</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.venues.map((venue) => (
                        <span 
                          key={venue.id}
                          className="text-xs bg-lightGray px-2 py-1 rounded text-darkGray"
                        >
                          {venue.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-150"
        >
          <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedPackage}
          className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-150 disabled:bg-mediumGray disabled:cursor-not-allowed"
        >
          Next: View Equipment
          <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
        </button>
      </div>
    </div>
  );
});
Step2SelectPackage.displayName = 'Step2SelectPackage';

// Step 3: Equipment Showcase - Memoized for performance
const Step3EquipmentShowcase = memo<{
  nextStep: () => void;
  prevStep: () => void;
  equipment: typeof EQUIPMENT_SHOWCASE;
}>(({ nextStep, prevStep, equipment }) => {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Equipment Showcase</h2>
      <p className="text-darkGray mb-8">See the professional equipment included in your package</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
        {equipment.map((item) => (
          <div
            key={item.id}
            className="border-2 border-mediumGray/50 rounded-xl overflow-hidden hover:border-primaryRed/50 transition-all duration-150"
          >
            <div className="aspect-video relative">
              <img 
                src={item.image} 
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-primaryRed uppercase">{item.category}</span>
              <h3 className="text-lg font-bold text-black mt-1">{item.name}</h3>
              <p className="text-sm text-darkGray mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-150"
        >
          <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-150"
        >
          Next: Select Venues
          <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
        </button>
      </div>
    </div>
  );
});
Step3EquipmentShowcase.displayName = 'Step3EquipmentShowcase';

// Step 4: Select Venues - Memoized for performance
const Step4SelectVenues = memo<{
  nextStep: () => void;
  prevStep: () => void;
  venues: Venue[];
  selectedVenues: string[];
  onToggleVenue: (venueId: string) => void;
}>(({ nextStep, prevStep, venues, selectedVenues, onToggleVenue }) => {
  if (venues.length === 0) {
    return (
      <div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Select Venues</h2>
        <p className="text-darkGray mb-8">No venues available for this package. You can proceed to booking.</p>
        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-300"
          >
            <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300"
          >
            Next: Date & Contact
            <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Select Your Venues</h2>
      <p className="text-darkGray mb-8">Choose one or more venues for your event</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
        {venues.map((venue) => (
          <div
            key={venue.id}
            onClick={() => onToggleVenue(venue.id)}
            className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-150 transform hover:scale-105 ${
              selectedVenues.includes(venue.id)
                ? 'border-primaryRed shadow-lg shadow-primaryRed/20'
                : 'border-mediumGray/50 hover:border-primaryRed/50'
            }`}
          >
            <div className="aspect-video relative">
              <img 
                src={venue.image} 
                alt={venue.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {selectedVenues.includes(venue.id) && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className="w-6 h-6 text-primaryRed bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-black">{venue.name}</h3>
              <p className="text-sm text-darkGray">{venue.location}</p>
              <p className="text-xs text-primaryRed mt-1">{venue.capacity}</p>
              {venue.description && (
                <p className="text-xs text-darkGray mt-2">{venue.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-150"
        >
          <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-150"
        >
          Next: Date & Contact
          <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
        </button>
      </div>
    </div>
  );
});
Step4SelectVenues.displayName = 'Step4SelectVenues';

// Step 5: Date and Contact Info
const Step5DateAndContact: React.FC<{
    nextStep: () => void;
  prevStep: () => void;
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    bookedDates: string[];
    details: any;
    setDetails: (details: any) => void;
}> = ({ nextStep, prevStep, selectedDate, onDateSelect, bookedDates, details, setDetails }) => {
    const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Please select a date from the calendar.';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setDetails({ ...details, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setDetails({ ...details, [name]: value });
        }
    };
    
    return (
        <div>
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Event Details & Contact</h2>
      <p className="text-darkGray mb-8">Provide your event date and contact information</p>

      <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                    <label className="text-sm font-bold text-darkGray block mb-2">Date of Event</label>
          <div className="bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 mb-4">
                        <p className="text-black font-semibold">{formattedDate}</p>
                    </div>
                    <Calendar
                        selectedDate={selectedDate}
                        onDateSelect={onDateSelect}
                        bookedDates={bookedDates}
                    />
                </div>

        <input 
          type="text" 
          name="venueAddress" 
          placeholder="Venue Name / Location" 
          value={details.venueAddress} 
          onChange={handleInputChange} 
          className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" 
        />
        
        <input 
          type="number" 
          name="guestCount" 
          placeholder="How many Guest Attendees" 
          value={details.guestCount} 
          onChange={handleInputChange} 
          className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" 
        />

                <div className="pt-4 border-t border-mediumGray">
          <h3 className="font-serif font-bold text-black text-xl mb-4">Your Contact Info</h3>
          <input 
            type="text" 
            name="fullName" 
            placeholder="Complete Name" 
            value={details.fullName} 
            onChange={handleInputChange} 
            className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all mb-4" 
          />
          <input 
            type="tel" 
            name="celNumber" 
            placeholder="Cellphone Number" 
            value={details.celNumber} 
            onChange={handleInputChange} 
            className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all mb-4" 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={details.email} 
            onChange={handleInputChange} 
            className="w-full bg-lightGray border-2 border-mediumGray/50 rounded-xl p-4 text-black focus:ring-2 focus:ring-primaryRed focus:border-primaryRed outline-none transition-all" 
          />
        </div>
                </div>
                
      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
          Back
        </button>
            <button 
                onClick={nextStep}
          disabled={!selectedDate || !details.fullName || !details.celNumber || !details.email}
          className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 disabled:bg-mediumGray disabled:cursor-not-allowed"
            >
          Next: Downpayment
          <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
            </button>
      </div>
        </div>
    );
};

// Step 6: Downpayment
const Step6Downpayment: React.FC<{
  nextStep: () => void;
  prevStep: () => void;
  email: string;
}> = ({ nextStep, prevStep, email }) => (
  <div>
    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Secure Your Booking</h2>
    <p className="text-darkGray mb-8">Complete your reservation with a downpayment</p>
    
    <div className="bg-gradient-to-br from-primaryRed/10 to-lightGray rounded-2xl p-6 sm:p-8 mb-8 border-2 border-primaryRed/20">
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-black">Reservation Fee</span>
        <span className="text-4xl sm:text-5xl font-bold text-primaryRed">₱1,000</span>
        </div>
        <p className="text-sm text-darkGray mb-4">
        A <strong className="text-black">non-refundable ₱1,000</strong> downpayment is required to reserve your date.
        </p>
         <p className="text-sm text-darkGray mb-6">
            50% of the balance is due one month before the event, and the remainder is due on the event day.
        </p>

      <h4 className="font-bold text-black mt-6 mb-4 text-lg">Payment Options</h4>
        <div className="text-sm text-darkGray space-y-4">
            <div>
                <p className="font-semibold text-black">GCash</p>
                <p>Sherwin F. Sabater</p>
                <p>09778149898</p>
            </div>
             <div>
                <p className="font-semibold text-black">Bank Deposit</p>
                <p><strong>BPI SA#</strong> 3639028355</p>
                <p><strong>BDO SA#</strong> 001900364148</p>
                <p><strong>Unionbank SA#</strong> 109453375959</p>
                <p>Account Name: Sherwin F. Sabater</p>
            </div>
        </div>

      <p className="text-xs text-darkGray mt-8 bg-white p-4 rounded-xl border-2 border-mediumGray/50">
            Once paid, please send your payment details to <a href="http://m.me/sherwinsabater" target="_blank" rel="noopener noreferrer" className="text-primaryRed font-bold underline">m.me/sherwinsabater</a> with your complete event details to finalize your reservation.
        </p>
    </div>

    <div className="flex gap-4">
      <button
        onClick={prevStep}
        className="flex-1 bg-white border-2 border-primaryRed text-primaryRed font-bold py-4 px-6 rounded-full hover:bg-primaryRed hover:text-white transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5 inline-block mr-2" />
        Back
      </button>
      <button
        onClick={nextStep}
        className="flex-1 bg-primaryRed text-white font-bold py-4 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300"
      >
        I Have Paid, Submit Booking
      </button>
    </div>
  </div>
);

// Step 7: Confirmation
const Step7Confirmation: React.FC<{ email: string }> = ({ email }) => (
    <div className="text-center py-8">
        <CheckCircleIcon className="w-20 h-20 text-primaryRed mx-auto mb-4" />
    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Booking Submitted!</h2>
    <p className="text-darkGray mb-4">
      Thank you! We've sent a preliminary confirmation to <strong className="text-black">{email}</strong>.
    </p>
    <p className="text-darkGray/80 text-sm">
      Your Booking ID: <strong className="text-black">BA-2025-{Math.floor(Math.random() * 10000)}</strong>
    </p>
    <p className="text-darkGray/80 text-sm mt-2">
      Your booking will be confirmed once we verify your downpayment. A coordinator will be in touch shortly.
    </p>
    </div>
);

