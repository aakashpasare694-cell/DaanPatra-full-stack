<?php

namespace App\Services\Notification;

use App\Models\Donation;

interface NotificationServiceInterface
{
    /**
     * Send donation receipt notification.
     *
     * @param Donation $donation
     * @return bool
     */
    public function sendReceipt(Donation $donation): bool;
}
