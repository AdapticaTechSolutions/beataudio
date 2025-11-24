
import React, { useState } from 'react';
import { Logo } from './Logo';
import { CheckCircleIcon, LoadingSpinnerIcon, DownloadIcon } from './icons';
import type { Booking } from '../types';

interface ClientQuotePageProps {
    booking: Booking;
    onPaymentComplete: () => void;
}

export const ClientQuotePage: React.FC<ClientQuotePageProps> = ({ booking, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(booking.status === 'Confirmed');

    const handlePay = () => {
        setIsProcessing(true);
        // Simulate payment gateway
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaid(true);
            onPaymentComplete();
        }, 2000);
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    if (isPaid) {
        return (
            <div className="min-h-screen bg-lightGray flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-card text-center max-w-md w-full animate-scale-in">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-serif font-bold text-black mb-2">Booking Confirmed!</h1>
                    <p className="text-darkGray mb-6">Thank you, {booking.customerName}. Your date is officially reserved.</p>
                    <div className="bg-lightGray p-4 rounded text-left text-sm space-y-2 mb-6">
                        <p><strong>Ref ID:</strong> {booking.id}</p>
                        <p><strong>Event:</strong> {booking.eventType} on {booking.eventDate}</p>
                    </div>
                    <a href="/" className="inline-block text-primaryRed font-bold hover:underline">Return to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lightGray font-sans pb-12">
            
            {/* SCREEN HEADER - HIDDEN ON PRINT */}
            <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Logo className="h-8 md:h-10 w-auto" />
                    <div className="flex items-center gap-4">
                         <div className="text-xs md:text-sm font-semibold text-darkGray hidden md:block">
                            Quote Ref: <span className="font-mono text-black">{booking.id}</span>
                        </div>
                        <button 
                            onClick={handleDownloadPDF}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-gray-800 transition-colors"
                        >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            PDF
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT - HIDDEN ON PRINT */}
            <main className="container mx-auto px-4 mt-8 max-w-4xl no-print">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* QUOTE DETAILS */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-lg shadow-card">
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">Quotation Summary</h1>
                            
                            <div className="grid grid-cols-2 gap-6 mb-8 border-b border-mediumGray pb-8">
                                <div>
                                    <label className="text-xs uppercase text-darkGray font-bold tracking-wider">Client</label>
                                    <p className="text-lg font-semibold text-black">{booking.customerName}</p>
                                    <p className="text-sm text-darkGray">{booking.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-darkGray font-bold tracking-wider">Date</label>
                                    <p className="text-lg font-semibold text-primaryRed">{new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-darkGray font-bold tracking-wider">Venue</label>
                                    <p className="text-black">{booking.venue}</p>
                                    {booking.ceremonyVenue && <p className="text-sm text-darkGray">+ Ceremony: {booking.ceremonyVenue}</p>}
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-darkGray font-bold tracking-wider">Est. Guests</label>
                                    <p className="text-black">{booking.guestCount} Pax</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-black mb-3">Included Services</h3>
                                <ul className="space-y-2">
                                    {booking.services.map((s, i) => (
                                        <li key={i} className="flex items-center text-darkGray">
                                            <CheckCircleIcon className="w-5 h-5 text-primaryRed mr-3" />
                                            {s}
                                        </li>
                                    ))}
                                    {booking.bandRider && (
                                        <li className="flex items-start text-darkGray mt-4 pt-4 border-t border-mediumGray/50">
                                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded mr-2 mt-0.5">Note</span>
                                            <span className="text-sm italic">Includes Band Rider setup requirements.</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* PAYMENT PANEL */}
                    <div className="w-full md:w-96">
                        <div className="bg-white p-6 rounded-lg shadow-card border-t-4 border-primaryRed sticky top-24">
                            <h3 className="font-bold text-lg text-black mb-4">Payment Details</h3>
                            
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-darkGray">Total Quote</span>
                                <span className="text-xl font-bold text-black">₱{(booking.totalAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-mediumGray">
                                <span className="text-primaryRed font-semibold">Reservation Fee</span>
                                <span className="text-2xl font-bold text-primaryRed">₱1,000.00</span>
                            </div>
                            
                            <p className="text-xs text-darkGray mb-4">
                                By paying the reservation fee, you agree to our Terms of Service. The remaining balance is due on the event date.
                            </p>

                            <button 
                                onClick={handlePay}
                                disabled={isProcessing}
                                className="w-full bg-primaryRed text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 shadow-soft-red transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {isProcessing ? (
                                    <>
                                        <LoadingSpinnerIcon className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay ₱1,000 Reservation'
                                )}
                            </button>
                            
                            <div className="mt-4 flex justify-center space-x-2 grayscale opacity-50">
                                <div className="h-6 w-10 bg-gray-300 rounded"></div>
                                <div className="h-6 w-10 bg-gray-300 rounded"></div>
                                <div className="h-6 w-10 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* PRINT-ONLY LAYOUT (FORMAL PDF) */}
            <div className="print-only p-8 max-w-[210mm] mx-auto bg-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-primaryRed pb-6">
                    <div>
                         <Logo className="h-12 w-auto mb-4" />
                         <p className="text-sm text-gray-600">Manila, Philippines</p>
                         <p className="text-sm text-gray-600">bookings@beataudio.ph | +63 917 123 4567</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">QUOTATION</h1>
                        <p className="text-sm text-gray-600">Reference: <span className="font-mono font-bold text-black">{booking.id}</span></p>
                        <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Prepared For</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100">
                        <p className="text-xl font-bold text-black">{booking.customerName}</p>
                        <p className="text-gray-600">{booking.email}</p>
                        <p className="text-gray-600 mt-2">{booking.contactNumber}</p>
                    </div>
                </div>

                {/* Event Details */}
                <div className="mb-12">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Event Specifications</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                            <span className="block text-gray-500">Event Type</span>
                            <span className="font-semibold">{booking.eventType}</span>
                         </div>
                         <div>
                            <span className="block text-gray-500">Event Date</span>
                            <span className="font-semibold">{new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                         </div>
                         <div className="col-span-2">
                            <span className="block text-gray-500">Venue</span>
                            <span className="font-semibold">{booking.venue} {booking.ceremonyVenue ? `(+ Ceremony at ${booking.ceremonyVenue})` : ''}</span>
                         </div>
                         <div>
                            <span className="block text-gray-500">Guest Count</span>
                            <span className="font-semibold">{booking.guestCount} Pax</span>
                         </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="mb-12">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="py-3 font-bold text-xs uppercase tracking-wider text-gray-500">Service Description</th>
                                <th className="py-3 font-bold text-xs uppercase tracking-wider text-gray-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                 <td className="py-4 border-b border-gray-100">
                                     <p className="font-bold text-black">Beat Audio & Lights Full Production Package</p>
                                     <p className="text-sm text-gray-500 mt-1 mb-2">Professional Equipment Rental & Technical Manpower</p>
                                     <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                                         {booking.services.map((s, i) => (
                                             <li key={i}>{s}</li>
                                         ))}
                                     </ul>
                                     {booking.bandRider && (
                                         <p className="text-xs text-gray-500 italic mt-2 ml-2">* Includes technical rider provisions for live band.</p>
                                     )}
                                 </td>
                                 <td className="py-4 border-b border-gray-100 text-right align-top font-mono">
                                     ₱{(booking.totalAmount || 0).toLocaleString()}
                                 </td>
                             </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="py-4 text-right font-bold text-gray-500">Total Amount</td>
                                <td className="py-4 text-right font-bold text-2xl text-primaryRed">₱{(booking.totalAmount || 0).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-500 border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-gray-700 mb-1">Terms & Conditions</h4>
                    <p className="mb-1">1. A non-refundable reservation fee of ₱1,000.00 is required to block the date.</p>
                    <p className="mb-1">2. 50% downpayment is required 1 month before the event.</p>
                    <p className="mb-1">3. Full payment must be settled immediately after the event setup.</p>
                    <p>4. This quotation is valid for 15 days from the date of issuance.</p>
                </div>
                
                <div className="mt-16 text-center">
                    <p className="font-serif font-bold text-xl text-black">Beat Audio & Lights</p>
                    <p className="text-xs text-gray-400">Make Every Moment Unforgettable.</p>
                </div>
            </div>
        </div>
    );
};