<?php

namespace App\Services\Notification;

use App\Models\Donation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailReceiptService implements NotificationServiceInterface
{
    public function sendReceipt(Donation $donation): bool
    {
        if (empty($donation->donor_email)) {
            Log::info("Email notification skipped: No donor email for receipt #{$donation->receipt_number}");
            return false;
        }

        try {
            // Send email using Laravel Mail facade with inline html mail
            Mail::html("
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;'>
                    <div style='text-align: center; margin-bottom: 24px;'>
                        <h2 style='color: #ea580c; margin: 0;'>Shree Ganesha Seva Trust</h2>
                        <p style='color: #64748b; font-size: 14px; margin-top: 4px;'>Donation Receipt & Acknowledgment</p>
                    </div>
                    <div style='background: #fff7ed; border-left: 4px solid #f97316; padding: 16px; border-radius: 6px; margin-bottom: 20px;'>
                        <h3 style='margin: 0 0 8px 0; color: #9a3412;'>Receipt No: {$donation->receipt_number}</h3>
                        <p style='margin: 0; color: #475569;'>Date: " . date('d M Y') . "</p>
                    </div>
                    <table style='width: 100%; border-collapse: collapse; margin-bottom: 24px;'>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Donor Name:</td><td style='font-weight: bold; text-align: right;'>{$donation->donor_name}</td></tr>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Mobile:</td><td style='font-weight: bold; text-align: right;'>{$donation->donor_mobile}</td></tr>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Amount:</td><td style='font-weight: bold; text-align: right; color: #16a34a; font-size: 18px;'>₹" . number_format($donation->amount, 2) . "</td></tr>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Amount in Words:</td><td style='font-style: italic; text-align: right;'>{$donation->amount_in_words}</td></tr>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Payment Method:</td><td style='text-align: right;'>{$donation->payment_method}</td></tr>
                        <tr style='border-bottom: 1px solid #f1f5f9;'><td style='padding: 8px 0; color: #64748b;'>Payment Status:</td><td style='text-align: right;'><span style='background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: bold;'>{$donation->payment_status}</span></td></tr>
                        <tr><td style='padding: 8px 0; color: #64748b;'>Collected By:</td><td style='text-align: right;'>{$donation->collected_by}</td></tr>
                    </table>
                    <div style='text-align: center; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 16px;'>
                        <p style='margin: 0; font-weight: 500;'>Thank you for supporting our Ganpati festival and social initiatives! 🙏</p>
                    </div>
                </div>
            ", function ($message) use ($donation) {
                $message->to($donation->donor_email)
                    ->subject("Donation Receipt #{$donation->receipt_number} - Ganpati Festival Trust");
            });

            Log::info("Receipt email sent successfully for receipt #{$donation->receipt_number} to {$donation->donor_email}");
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send receipt email: " . $e->getMessage());
            return false;
        }
    }
}
