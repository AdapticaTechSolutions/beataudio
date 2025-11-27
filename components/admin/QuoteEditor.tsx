import React, { useState, useEffect } from 'react';
import type { Booking } from '../../types';
import { bookingsApi } from '../../lib/api';

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
  const [quoteContent, setQuoteContent] = useState(booking.quoteContent || '');
  const [totalAmount, setTotalAmount] = useState(booking.totalAmount?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser.role === 'admin';

  // Track changes
  useEffect(() => {
    const originalContent = booking.quoteContent || '';
    const originalAmount = booking.totalAmount?.toString() || '';
    setHasChanges(
      quoteContent !== originalContent || 
      totalAmount !== originalAmount
    );
  }, [quoteContent, totalAmount, booking]);

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
      const updates: Partial<Booking> = {
        quoteContent: quoteContent.trim() || undefined,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        lastEditedBy: currentUser.username,
        lastEditedAt: new Date().toISOString(),
      };

      const response = await bookingsApi.update(booking.id, updates);

      if (response.success && response.data) {
        onSave(response.data);
        setShowConfirmDialog(false);
        onClose();
      } else {
        setError(response.error || 'Failed to save quote');
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primaryRed text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Edit Quote</h2>
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
              You are editing a quote as <strong>{currentUser.username}</strong>. All changes will be logged.
            </p>
          </div>

          {/* Quote Content Editor */}
          <div className="mb-6">
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
          <div className="mb-6">
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

          {/* Preview Section */}
          <div className="border-t border-mediumGray pt-6">
            <h3 className="text-lg font-bold text-black mb-3">Preview</h3>
            <div className="bg-lightGray p-4 rounded-lg">
              <p className="text-sm text-darkGray mb-2">
                <strong>Client:</strong> {booking.customerName}
              </p>
              <p className="text-sm text-darkGray mb-2">
                <strong>Event:</strong> {booking.eventType} on {new Date(booking.eventDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-darkGray mb-4">
                <strong>Total:</strong> ₱{totalAmount ? parseFloat(totalAmount).toLocaleString() : '0.00'}
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

