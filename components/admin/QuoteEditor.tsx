import React, { useState, useEffect } from 'react';
import type { Booking } from '../../types';
import { bookingsApi } from '../../lib/api';
import { EVENT_TYPES } from '../../constants';
import { CheckCircleIcon } from '../icons';

interface QuoteEditorProps {
  booking: Booking;
  onClose: () => void;
  onSave: (updatedBooking: Booking) => void;
  currentUser: { id: string; username: string; role: string };
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({ 
  booking, 
  onClose, 
  onSave,
  currentUser 
}) => {
  // Quote fields
  const [quoteContent, setQuoteContent] = useState(booking.quoteContent || '');
  const [totalAmount, setTotalAmount] = useState(booking.totalAmount?.toString() || '');
  
  // Booking details
  const [eventType, setEventType] = useState(booking.eventType || '');
  const [eventDate, setEventDate] = useState(booking.eventDate || '');
  const [venue, setVenue] = useState(booking.venue || '');
  const [ceremonyVenue, setCeremonyVenue] = useState(booking.ceremonyVenue || '');
  const [guestCount, setGuestCount] = useState(booking.guestCount?.toString() || '');
  
  // Services
  const [serviceLights, setServiceLights] = useState(booking.serviceLights ?? booking.services?.includes('Lights') ?? false);
  const [serviceSounds, setServiceSounds] = useState(booking.serviceSounds ?? booking.services?.includes('Sounds') ?? false);
  const [serviceLedWall, setServiceLedWall] = useState(booking.serviceLedWall ?? booking.services?.includes('LED Wall') ?? false);
  const [serviceProjector, setServiceProjector] = useState(booking.serviceProjector ?? booking.services?.includes('Projector') ?? false);
  const [serviceSmoke, setServiceSmoke] = useState(booking.serviceSmoke ?? booking.services?.includes('Smoke FX') ?? false);
  const [hasBand, setHasBand] = useState(booking.hasBand ?? booking.services?.includes('Live Band') ?? false);
  const [bandRider, setBandRider] = useState(booking.bandRider || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'quote' | 'details' | 'services'>('quote');

  // Check if user is admin
  const isAdmin = currentUser.role === 'admin';

  // Track changes
  useEffect(() => {
    const original = {
      quoteContent: booking.quoteContent || '',
      totalAmount: booking.totalAmount?.toString() || '',
      eventType: booking.eventType || '',
      eventDate: booking.eventDate || '',
      venue: booking.venue || '',
      ceremonyVenue: booking.ceremonyVenue || '',
      guestCount: booking.guestCount?.toString() || '',
      serviceLights: booking.serviceLights ?? booking.services?.includes('Lights') ?? false,
      serviceSounds: booking.serviceSounds ?? booking.services?.includes('Sounds') ?? false,
      serviceLedWall: booking.serviceLedWall ?? booking.services?.includes('LED Wall') ?? false,
      serviceProjector: booking.serviceProjector ?? booking.services?.includes('Projector') ?? false,
      serviceSmoke: booking.serviceSmoke ?? booking.services?.includes('Smoke FX') ?? false,
      hasBand: booking.hasBand ?? booking.services?.includes('Live Band') ?? false,
      bandRider: booking.bandRider || '',
    };

    const current = {
      quoteContent,
      totalAmount,
      eventType,
      eventDate,
      venue,
      ceremonyVenue,
      guestCount,
      serviceLights,
      serviceSounds,
      serviceLedWall,
      serviceProjector,
      serviceSmoke,
      hasBand,
      bandRider,
    };

    setHasChanges(JSON.stringify(original) !== JSON.stringify(current));
  }, [
    quoteContent, totalAmount, eventType, eventDate, venue, ceremonyVenue, guestCount,
    serviceLights, serviceSounds, serviceLedWall, serviceProjector, serviceSmoke, hasBand, bandRider, booking
  ]);

  // Security: Require admin role
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-xl font-bold text-red-600 mb-4">Access Denied</h3>
          <p className="text-darkGray mb-4">
            Only administrators can edit quotes. Your current role: <strong>{currentUser.role}</strong>
          </p>
          <button
            onClick={onClose}
            className="w-full bg-black text-white font-bold py-2 rounded hover:bg-primaryRed transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    // Security Layer 1: Require confirmation text
    if (confirmText.toLowerCase() !== 'confirm') {
      setError('Please type "CONFIRM" to save changes');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Build services array from checkboxes
      const services: string[] = [];
      if (serviceLights) services.push('Lights');
      if (serviceSounds) services.push('Sounds');
      if (serviceLedWall) services.push('LED Wall');
      if (serviceProjector) services.push('Projector');
      if (serviceSmoke) services.push('Smoke FX');
      if (hasBand) services.push('Live Band');

      const updates: Partial<Booking> = {
        // Quote fields
        quoteContent: quoteContent.trim() || undefined,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        
        // Booking details
        eventType: eventType || undefined,
        eventDate: eventDate || undefined,
        venue: venue || undefined,
        ceremonyVenue: ceremonyVenue || undefined,
        guestCount: guestCount ? parseInt(guestCount) : undefined,
        
        // Services
        services: services.length > 0 ? services : undefined,
        serviceLights,
        serviceSounds,
        serviceLedWall,
        serviceProjector,
        serviceSmoke,
        hasBand,
        bandRider: bandRider.trim() || undefined,
        
        // Audit
        lastEditedBy: currentUser.username,
        lastEditedAt: new Date().toISOString(),
      };

      const response = await bookingsApi.update(booking.id, updates);

      if (response.success && response.data) {
        onSave(response.data);
        setShowConfirmDialog(false);
        onClose();
      } else {
        setError(response.error || 'Failed to save changes');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primaryRed text-white p-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Edit Booking & Quote</h2>
            <p className="text-sm opacity-90 mt-1">
              Booking ID: <span className="font-mono">{booking.id}</span> | Client: {booking.customerName}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 text-2xl font-bold"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-mediumGray bg-lightGray flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('quote')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'quote'
                  ? 'bg-white text-primaryRed border-b-2 border-primaryRed'
                  : 'text-darkGray hover:text-black'
              }`}
            >
              Quote Content
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'bg-white text-primaryRed border-b-2 border-primaryRed'
                  : 'text-darkGray hover:text-black'
              }`}
            >
              Event Details
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'services'
                  ? 'bg-white text-primaryRed border-b-2 border-primaryRed'
                  : 'text-darkGray hover:text-black'
              }`}
            >
              Services & Inclusions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold">⚠️ Security Notice</p>
            <p className="text-sm mt-1">
              You are editing booking details as <strong>{currentUser.username}</strong>. All changes will be logged.
            </p>
          </div>

          {/* Quote Tab */}
          {activeTab === 'quote' && (
            <div className="space-y-6">
              {/* Quote Content Editor */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Quote Content (Custom Message)
                </label>
                <textarea
                  value={quoteContent}
                  onChange={(e) => setQuoteContent(e.target.value)}
                  className="w-full border border-mediumGray rounded-lg p-4 min-h-[200px] font-sans"
                  placeholder="Enter custom quote content here. This will be displayed on the client's quote page..."
                />
                <p className="text-xs text-darkGray mt-2">
                  This content will replace the default quote display. Leave empty to use default format.
                </p>
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Total Amount (₱)
                </label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full border border-mediumGray rounded-lg p-3 text-lg font-semibold"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Event Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full border border-mediumGray rounded-lg p-3"
                  >
                    <option value="">Select Event Type</option>
                    {EVENT_TYPES.map(type => (
                      <option key={type.name} value={type.name}>{type.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-mediumGray rounded-lg p-3"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full border border-mediumGray rounded-lg p-3"
                    placeholder="Venue name and location"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Guest Count *
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full border border-mediumGray rounded-lg p-3"
                    placeholder="Number of guests"
                    min="1"
                  />
                </div>

                {/* Ceremony Venue (if wedding) */}
                {eventType === 'Weddings' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-black mb-2">
                      Ceremony Venue (Optional)
                    </label>
                    <input
                      type="text"
                      value={ceremonyVenue}
                      onChange={(e) => setCeremonyVenue(e.target.value)}
                      className="w-full border border-mediumGray rounded-lg p-3"
                      placeholder="Ceremony venue location"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-4">
                  Select Services & Inclusions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lights */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={serviceLights}
                      onChange={(e) => setServiceLights(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">Lights</span>
                  </label>

                  {/* Sounds */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={serviceSounds}
                      onChange={(e) => setServiceSounds(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">Sounds</span>
                  </label>

                  {/* LED Wall */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={serviceLedWall}
                      onChange={(e) => setServiceLedWall(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">LED Wall</span>
                  </label>

                  {/* Projector */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={serviceProjector}
                      onChange={(e) => setServiceProjector(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">Projector</span>
                  </label>

                  {/* Smoke */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={serviceSmoke}
                      onChange={(e) => setServiceSmoke(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">Smoke FX</span>
                  </label>

                  {/* Live Band */}
                  <label className="flex items-center p-4 border border-mediumGray rounded-lg cursor-pointer hover:bg-lightGray transition-colors">
                    <input
                      type="checkbox"
                      checked={hasBand}
                      onChange={(e) => setHasBand(e.target.checked)}
                      className="w-5 h-5 text-primaryRed rounded border-mediumGray focus:ring-primaryRed"
                    />
                    <span className="ml-3 font-semibold text-black">Live Band</span>
                  </label>
                </div>
              </div>

              {/* Band Rider */}
              {hasBand && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-bold text-black mb-2">
                    Band Technical Rider (Optional)
                  </label>
                  <textarea
                    value={bandRider}
                    onChange={(e) => setBandRider(e.target.value)}
                    className="w-full border border-mediumGray rounded-lg p-4 min-h-[120px]"
                    placeholder="Paste the band's technical requirements here..."
                  />
                </div>
              )}

              {/* Selected Services Summary */}
              <div className="bg-lightGray p-4 rounded-lg border border-mediumGray">
                <p className="text-sm font-bold text-black mb-2">Selected Services:</p>
                <div className="flex flex-wrap gap-2">
                  {serviceLights && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">Lights</span>}
                  {serviceSounds && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">Sounds</span>}
                  {serviceLedWall && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">LED Wall</span>}
                  {serviceProjector && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">Projector</span>}
                  {serviceSmoke && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">Smoke FX</span>}
                  {hasBand && <span className="px-3 py-1 bg-primaryRed text-white rounded-full text-sm">Live Band</span>}
                  {!serviceLights && !serviceSounds && !serviceLedWall && !serviceProjector && !serviceSmoke && !hasBand && (
                    <span className="text-darkGray italic text-sm">No services selected</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="border-t border-mediumGray pt-6 mt-6">
            <h3 className="text-lg font-bold text-black mb-3">Preview</h3>
            <div className="bg-lightGray p-4 rounded-lg">
              <p className="text-sm text-darkGray mb-2">
                <strong>Client:</strong> {booking.customerName}
              </p>
              <p className="text-sm text-darkGray mb-2">
                <strong>Event:</strong> {eventType || booking.eventType} on {eventDate ? new Date(eventDate).toLocaleDateString() : booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'TBD'}
              </p>
              <p className="text-sm text-darkGray mb-2">
                <strong>Venue:</strong> {venue || booking.venue}
              </p>
              <p className="text-sm text-darkGray mb-4">
                <strong>Total:</strong> ₱{totalAmount ? parseFloat(totalAmount).toLocaleString() : booking.totalAmount?.toLocaleString() || '0.00'}
              </p>
              {quoteContent ? (
                <div className="bg-white p-4 rounded border border-mediumGray">
                  <p className="text-sm whitespace-pre-wrap">{quoteContent}</p>
                </div>
              ) : (
                <p className="text-xs text-darkGray italic">Default quote format will be used</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-mediumGray p-6 bg-lightGray">
          {!showConfirmDialog ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-mediumGray rounded-lg font-semibold text-black hover:bg-white transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={!hasChanges || isSaving}
                className="px-6 py-2 bg-primaryRed text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Security Layer 2: Confirmation Dialog */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="font-bold text-red-800 mb-2">⚠️ Final Confirmation Required</p>
                <p className="text-sm text-red-700 mb-3">
                  To prevent accidental edits, please type <strong>"CONFIRM"</strong> below to save your changes.
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                    setError('');
                  }}
                  placeholder="Type CONFIRM here"
                  className="w-full border border-red-300 rounded p-2 font-mono"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmText('');
                    setError('');
                  }}
                  className="px-6 py-2 border border-mediumGray rounded-lg font-semibold text-black hover:bg-white transition-colors"
                  disabled={isSaving}
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || confirmText.toLowerCase() !== 'confirm'}
                  className="px-6 py-2 bg-primaryRed text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    'Confirm & Save'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

