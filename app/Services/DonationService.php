<?php

namespace App\Services;

use App\Models\Donation;
use Carbon\Carbon;

class DonationService
{
    /**
     * Generate unique sequential receipt number per trust.
     * Format: GNP-YYYY-XXXXXX
     */
    public function generateReceiptNumber(string $trustId): string
    {
        $year = date('Y');
        $prefix = "GNP-{$year}-";

        // Count existing donations for this trust in current year
        $count = Donation::where('trust_id', $trustId)
            ->where('receipt_number', 'LIKE', "{$prefix}%")
            ->count();

        $nextNumber = str_pad((string)($count + 1), 6, '0', STR_PAD_LEFT);
        return $prefix . $nextNumber;
    }

    /**
     * Convert numerical amount figure into English words.
     * Example: 5000 -> "Five Thousand Rupees Only"
     */
    public function amountToWords(float $amount): string
    {
        $number = (int) round($amount);
        if ($number === 0) {
            return "Zero Rupees Only";
        }

        $dictionary  = [
            0                   => 'Zero',
            1                   => 'One',
            2                   => 'Two',
            3                   => 'Three',
            4                   => 'Four',
            5                   => 'Five',
            6                   => 'Six',
            7                   => 'Seven',
            8                   => 'Eight',
            9                   => 'Nine',
            10                  => 'Ten',
            11                  => 'Eleven',
            12                  => 'Twelve',
            13                  => 'Thirteen',
            14                  => 'Fourteen',
            15                  => 'Fifteen',
            16                  => 'Sixteen',
            17                  => 'Seventeen',
            18                  => 'Eighteen',
            19                  => 'Nineteen',
            20                  => 'Twenty',
            30                  => 'Thirty',
            40                  => 'Forty',
            50                  => 'Fifty',
            60                  => 'Sixty',
            70                  => 'Seventy',
            80                  => 'Eighty',
            90                  => 'Ninety',
            100                 => 'Hundred',
            1000                => 'Thousand',
            100000              => 'Lakh',
            10000000            => 'Crore',
        ];

        $string = '';

        if ($number >= 10000000) {
            $crores = floor($number / 10000000);
            $string .= $this->amountToWordsHelper($crores, $dictionary) . ' Crore ';
            $number %= 10000000;
        }

        if ($number >= 100000) {
            $lakhs = floor($number / 100000);
            $string .= $this->amountToWordsHelper($lakhs, $dictionary) . ' Lakh ';
            $number %= 100000;
        }

        if ($number >= 1000) {
            $thousands = floor($number / 1000);
            $string .= $this->amountToWordsHelper($thousands, $dictionary) . ' Thousand ';
            $number %= 1000;
        }

        if ($number >= 100) {
            $hundreds = floor($number / 100);
            $string .= $this->amountToWordsHelper($hundreds, $dictionary) . ' Hundred ';
            $number %= 100;
        }

        if ($number > 0) {
            $string .= $this->amountToWordsHelper($number, $dictionary) . ' ';
        }

        return trim($string) . ' Rupees Only';
    }

    private function amountToWordsHelper(int $number, array $dictionary): string
    {
        if ($number < 21) {
            return $dictionary[$number];
        }

        if ($number < 100) {
            $tens = (int)(floor($number / 10) * 10);
            $units = $number % 10;
            return $dictionary[$tens] . ($units ? ' ' . $dictionary[$units] : '');
        }

        $hundreds = (int) floor($number / 100);
        $remainder = $number % 100;
        return $dictionary[$hundreds] . ' Hundred' . ($remainder ? ' ' . $this->amountToWordsHelper($remainder, $dictionary) : '');
    }

    /**
     * Compute follow-up date based on selection.
     */
    public function calculateFollowUpDate(?string $followUpAfterDays): ?string
    {
        if (!$followUpAfterDays) {
            return null;
        }

        preg_match('/\d+/', $followUpAfterDays, $matches);
        $days = isset($matches[0]) ? (int)$matches[0] : 1;

        return Carbon::now()->addDays($days)->toDateString();
    }
}
