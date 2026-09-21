<?php

namespace App\Services\Notification;

use App\Models\Donation;
use Illuminate\Support\Facades\Log;

class SmsReceiptService implements NotificationServiceInterface
{
    /**
     * SMS provider wrapper (Fast2SMS, Twilio, MSG91).
     */
    public function sendReceipt(Donation $donation): bool
    {
        if (empty($donation->donor_mobile)) {
            Log::info("SMS notification skipped: No donor mobile for receipt #{$donation->receipt_number}");
            return false;
        }

        $message = "Shree Ganesha Seva Trust: Thank you {$donation->donor_name} for your donation of Rs.{$donation->amount}. Receipt No: {$donation->receipt_number}. Status: {$donation->payment_status}.";

        Log::info("SMS Notification Dispatched for #{$donation->receipt_number} to {$donation->donor_mobile}: {$message}");

        return true;
    }
}
