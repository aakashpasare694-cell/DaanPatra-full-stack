<?php

namespace Database\Seeders;

use App\Models\Trust;
use App\Models\User;
use App\Models\Donation;
use App\Models\Expense;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing demo collections in MongoDB Atlas
        Trust::truncate();
        User::truncate();
        Donation::truncate();
        Expense::truncate();
        ActivityLog::truncate();

        // 1. Create Demo Trust
        $trust = Trust::create([
            'trust_name' => 'Shree Ganesha Seva Trust & Utsav Mandal',
            'email' => 'admin@ganpatitrust.org',
            'contact_number' => '+91 98765 43210',
            'address' => 'Ganesh Chowk, Station Road, Mumbai - 400001',
            'registration_number' => 'REG/MH/2026/GNP-8821',
            'receipt_settings' => [
                'header_mantra' => '॥ श्री गणेशाय नमः ॥',
                'trust_name' => 'श्री गणेश मित्र मंडळ',
                'utsav_name' => 'गणेश उत्सव 2026',
                'address' => '123, लक्ष्मी नगर, पुणे - 411001, महाराष्ट्र',
                'registration_number' => 'Reg. No. : F/12345/PUNE/2020',
                'contact_number' => '+91 98765 43210',
                'theme_color' => '#7f1d1d',
                'show_toran' => true,
                'show_watermark' => true,
                'thank_you_note' => 'Thank you for your generous contribution',
                'footer_slogan' => '॥ गणपती बाप्पा मोरया ॥',
                'signatory_title' => 'For SHREE GANESH MITRA MANDAL',
                'signatory_subtitle' => 'Authorized Signatory',
            ]
        ]);

        $trustId = (string) $trust->_id;

        // 2. Create Demo Admin User (Full Access)
        $adminUser = User::create([
            'trust_id' => $trustId,
            'name' => 'Shri Rajesh Sharma (Admin)',
            'email' => 'admin@ganpatitrust.org',
            'mobile' => '9876543210',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 3. Create Demo Normal User (Read-Only Access)
        $normalUser = User::create([
            'trust_id' => $trustId,
            'name' => 'Amit Shinde (Normal Member)',
            'email' => 'user@ganpatitrust.org',
            'mobile' => '9820112233',
            'password' => Hash::make('password123'),
            'role' => 'normal',
        ]);

        // 4. Create Sample Donations
        $sampleDonors = [
            ['name' => 'Ramesh Patil', 'mobile' => '9820112233', 'email' => 'ramesh.patil@example.com', 'amount' => 11000, 'type' => 'Donation / Vargani', 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Sunita Deshmukh', 'mobile' => '9892334455', 'email' => 'sunita.d@example.com', 'amount' => 5000, 'type' => 'Donation / Vargani', 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Amit Shinde'],
            ['name' => 'Vijay Kadam', 'mobile' => '9819445566', 'email' => 'vijay.kadam@example.com', 'amount' => 25000, 'type' => 'Sponsorship (Gold / Silver / Bronze)', 'method' => 'QR Code', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Mahesh Joshi', 'mobile' => '9769556677', 'email' => 'mahesh.joshi@example.com', 'amount' => 7500, 'type' => 'Banner / Flex Advertisement', 'method' => 'Cheque', 'status' => 'Pending', 'by' => 'Suresh Pawar', 'follow' => '2 Days'],
            ['name' => 'Pooja Kulkarni', 'mobile' => '9833667788', 'email' => 'pooja.k@example.com', 'amount' => 2100, 'type' => 'Donation / Vargani', 'method' => 'QR Code', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Anil More', 'mobile' => '9870778899', 'email' => 'anil.more@example.com', 'amount' => 51000, 'type' => 'Chief Guest / VVIP Contribution', 'method' => 'Online', 'status' => 'Paid', 'by' => 'Rajesh Sharma'],
            ['name' => 'Sanjay Sawant', 'mobile' => '9811889900', 'email' => 'sanjay.s@example.com', 'amount' => 15000, 'type' => 'Stall / Food Vendor Setup Fee', 'method' => 'Cash', 'status' => 'Pending', 'by' => 'Amit Shinde', 'follow' => '3 Days'],
            ['name' => 'Kavita Naik', 'mobile' => '9822990011', 'email' => 'kavita.naik@example.com', 'amount' => 3500, 'type' => 'Donation / Vargani', 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Suresh Pawar'],
            ['name' => 'Prakash Jadhav', 'mobile' => '9833001122', 'email' => 'prakash.j@example.com', 'amount' => 10000, 'type' => 'Sponsorship (Gold / Silver / Bronze)', 'method' => 'QR Code', 'status' => 'Pending', 'by' => 'Rajesh Sharma', 'follow' => '1 Day'],
            ['name' => 'Deepak Bhosle', 'mobile' => '9844112233', 'email' => 'deepak.b@example.com', 'amount' => 5100, 'type' => 'Donation / Vargani', 'method' => 'Cash', 'status' => 'Paid', 'by' => 'Amit Shinde'],
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
                'income_type' => $donor['type'],
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

        // 5. Create Sample Expenses
        $sampleExpenses = [
            ['title' => 'Mandap & Eco-Friendly Decoration', 'amount' => 45000, 'cat' => 'Decoration', 'by' => 'Rajesh Sharma', 'method' => 'Online', 'desc' => 'Stage setup, flower decoration & backdrop'],
            ['title' => 'Dhol Tasha & Sound System Setup', 'amount' => 32000, 'cat' => 'Sound & DJ System', 'by' => 'Amit Shinde', 'method' => 'Online', 'desc' => 'Sound system hire for 5 festival days'],
            ['title' => 'Maha Prasad & Daily Sweets', 'amount' => 28000, 'cat' => 'Prasad & Bhog', 'by' => 'Suresh Pawar', 'method' => 'Cash', 'desc' => 'Laddoo, modak and daily bhog catering'],
            ['title' => 'Volunteers & Security Staff Refreshment', 'amount' => 12500, 'cat' => 'Security & CCTV', 'by' => 'Rajesh Sharma', 'method' => 'QR Code', 'desc' => 'Food packets and tea for security and volunteers'],
            ['title' => 'Temporary Festive Lighting & Genset', 'amount' => 18000, 'cat' => 'Lighting & Mandap', 'by' => 'Amit Shinde', 'method' => 'Online', 'desc' => 'LED lights, generator backup & wiring'],
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

        // 6. Seed Sample Activity Logs
        ActivityLog::create([
            'trust_id' => $trustId,
            'user_id' => (string) $adminUser->_id,
            'user_name' => $adminUser->name,
            'user_email' => $adminUser->email,
            'user_role' => 'Admin',
            'action_type' => 'TRUST_REGISTERED',
            'description' => 'Initialized Shree Ganesha Seva Trust & Utsav Mandal database in MongoDB Atlas',
            'details' => ['trust_name' => $trust->trust_name],
            'ip_address' => '127.0.0.1',
        ]);
    }
}
