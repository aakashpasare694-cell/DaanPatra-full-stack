<?php

namespace Database\Seeders;

use App\Models\Trust;
use App\Models\User;
use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing demo collections
        Trust::truncate();
        User::truncate();
        Donation::truncate();
        Expense::truncate();

        // 1. Create Demo Trust
        $trust = Trust::create([
            'trust_name' => 'Shree Ganesha Seva Trust & Utsav Mandal',
            'email' => 'admin@ganpatitrust.org',
            'contact_number' => '+91 98765 43210',
            'address' => 'Ganesh Chowk, Station Road, Mumbai',
            'registration_number' => 'REG/MH/2026/GNP-8821',
        ]);

        $trustId = (string) $trust->_id;

        // 2. Create Demo User
        $user = User::create([
            'trust_id' => $trustId,
            'name' => 'Shri Rajesh Sharma',
            'email' => 'admin@ganpatitrust.org',
            'password' => Hash::make('password123'),
        ]);

        // 3. Create Demo Donations
        $sampleDonors = [
            ['name' => 'Ramesh Patil', 'mobile' => '9820112233', 'email' => 'ramesh.patil@example.com', 'amount' => 11000, 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Sunita Deshmukh', 'mobile' => '9892334455', 'email' => 'sunita.d@example.com', 'amount' => 5000, 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Amit Shinde'],
            ['name' => 'Vijay Kadam', 'mobile' => '9819445566', 'email' => 'vijay.kadam@example.com', 'amount' => 25000, 'method' => 'QR Code', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Mahesh Joshi', 'mobile' => '9769556677', 'email' => 'mahesh.joshi@example.com', 'amount' => 7500, 'method' => 'Cheque', 'status' => 'Pending', 'by' => 'Suresh Pawar', 'follow' => '2 Days'],
            ['name' => 'Pooja Kulkarni', 'mobile' => '9833667788', 'email' => 'pooja.k@example.com', 'amount' => 2100, 'method' => 'QR Code', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Anil More', 'mobile' => '9870778899', 'email' => 'anil.more@example.com', 'amount' => 51000, 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Sanjay Sawant', 'mobile' => '9811889900', 'email' => 'sanjay.s@example.com', 'amount' => 15000, 'method' => 'Cash', 'status' => 'Pending', 'by' => 'Amit Shinde', 'follow' => '3 Days'],
            ['name' => 'Kavita Naik', 'mobile' => '9822990011', 'email' => 'kavita.naik@example.com', 'amount' => 3500, 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Suresh Pawar'],
            ['name' => 'Prakash Jadhav', 'mobile' => '9833001122', 'email' => 'prakash.j@example.com', 'amount' => 10000, 'method' => 'QR Code', 'status' => 'Pending', 'by' => 'Rajesh Sharma', 'follow' => '1 Day'],
            ['name' => 'Deepak Bhosle', 'mobile' => '9844112233', 'email' => 'deepak.b@example.com', 'amount' => 5100, 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Amit Shinde'],
            ['name' => 'Sneha Wagh', 'mobile' => '9855223344', 'email' => 'sneha.wagh@example.com', 'amount' => 2500, 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Ganesh Surve', 'mobile' => '9866334455', 'email' => 'ganesh.surve@example.com', 'amount' => 1100, 'method' => 'QR Code', 'status' => 'Paid', 'by' => 'Suresh Pawar'],
            ['name' => 'Aarti Parab', 'mobile' => '9877445566', 'email' => 'aarti.p@example.com', 'amount' => 15000, 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Vikas Gaikwad', 'mobile' => '9888556677', 'email' => 'vikas.g@example.com', 'amount' => 8000, 'method' => 'Cash', 'status' => 'Pending', 'by' => 'Amit Shinde', 'follow' => '2 Days'],
            ['name' => 'Rohan Shinde', 'mobile' => '9899667788', 'email' => 'rohan.s@example.com', 'amount' => 50000, 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
        ];

        $donationService = new \App\Services\DonationService();

        foreach ($sampleDonors as $index => $donor) {
            $num = str_pad((string)($index + 1), 6, '0', STR_PAD_LEFT);
            $receiptNo = "GNP-2026-{$num}";
            $words = $donationService->amountToWords($donor['amount']);
            $followDate = isset($donor['follow']) ? $donationService->calculateFollowUpDate($donor['follow']) : null;

            Donation::create([
                'trust_id' => $trustId,
                'receipt_number' => $receiptNo,
                'donor_name' => $donor['name'],
                'donor_mobile' => $donor['mobile'],
                'donor_email' => $donor['email'],
                'amount' => (float) $donor['amount'],
                'amount_in_words' => $words,
                'payment_method' => $donor['method'],
                'payment_status' => $donor['status'],
                'follow_up_after_days' => $donor['follow'] ?? null,
                'follow_up_date' => $followDate,
                'collected_by' => $donor['by'],
                'donation_date' => Carbon::now()->subDays(rand(1, 15))->toDateString(),
                'paid_at' => $donor['status'] === 'Paid' ? Carbon::now()->subDays(rand(1, 15)) : null,
            ]);
        }

        // 4. Create Demo Expenses
        $sampleExpenses = [
            ['title' => 'Mandap & Eco-Friendly Decoration', 'amount' => 45000, 'cat' => 'Decoration', 'by' => 'Rajesh Sharma', 'method' => 'Online', 'desc' => 'Stage setup, flower decoration & backdrop'],
            ['title' => 'Dhol Tasha & Sound System Setup', 'amount' => 32000, 'cat' => 'Sound System', 'by' => 'Amit Shinde', 'method' => 'Online', 'desc' => 'Sound system hire for 5 festival days'],
            ['title' => 'Maha Prasad & Daily Sweets', 'amount' => 28000, 'cat' => 'Prasad', 'by' => 'Suresh Pawar', 'method' => 'Cash', 'desc' => 'Laddoo, modak and daily bhog catering'],
            ['title' => 'Volunteers & Security Staff Refreshment', 'amount' => 12500, 'cat' => 'Food', 'by' => 'Rajesh Sharma', 'method' => 'QR Code', 'desc' => 'Food packets and tea for security and volunteers'],
            ['title' => 'Temporary Festive Lighting & Genset', 'amount' => 18000, 'cat' => 'Electricity', 'by' => 'Amit Shinde', 'method' => 'Online', 'desc' => 'LED lights, generator backup & wiring'],
            ['title' => 'Visarjan Idol Transport Vehicle', 'amount' => 9500, 'cat' => 'Transport', 'by' => 'Suresh Pawar', 'method' => 'Cash', 'desc' => 'Decorated truck & crane service for immersion'],
            ['title' => 'Pandal Sanitation & Cleaning Team', 'amount' => 7000, 'cat' => 'Cleaning', 'by' => 'Amit Shinde', 'method' => 'Cash', 'desc' => 'Daily waste disposal and sanitization'],
            ['title' => 'Educational Kit Distribution for Needy Children', 'amount' => 15000, 'cat' => 'Donation / Social Work', 'by' => 'Rajesh Sharma', 'method' => 'Cheque', 'desc' => 'School notebooks and stationery bags'],
        ];

        foreach ($sampleExpenses as $exp) {
            Expense::create([
                'trust_id' => $trustId,
                'title' => $exp['title'],
                'description' => $exp['desc'],
                'amount' => (float) $exp['amount'],
                'category' => $exp['cat'],
                'expense_date' => Carbon::now()->subDays(rand(1, 10))->toDateString(),
                'paid_by' => $exp['by'],
                'payment_method' => $exp['method'],
                'notes' => 'Approved by Trust Managing Committee',
            ]);
        }
    }
}
