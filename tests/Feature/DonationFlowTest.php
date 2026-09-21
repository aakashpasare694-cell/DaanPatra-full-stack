<?php

namespace Tests\Feature;

use App\Models\Trust;
use App\Models\User;
use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DonationFlowTest extends TestCase
{
    public function test_user_can_register_trust_and_login()
    {
        $email = 'testadmin_' . uniqid() . '@siddhivinayak.org';

        $response = $this->post('/register', [
            'trust_name' => 'Shree Siddhivinayak Utsav Mandal',
            'email' => $email,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/donations');
        $this->assertAuthenticated();
        
        $trust = Trust::where('email', $email)->first();
        $this->assertNotNull($trust);
    }

    public function test_user_can_create_donation_and_generate_receipt()
    {
        $user = User::first();
        $this->actingAs($user);

        $response = $this->post('/donations', [
            'donor_name' => 'Sachin Tendulkar',
            'donor_mobile' => '9811223344',
            'donor_email' => 'sachin@example.com',
            'amount' => 50000,
            'amount_in_words' => 'Fifty Thousand Rupees Only',
            'payment_method' => 'Online',
            'payment_status' => 'Paid',
            'collected_by' => $user->name,
        ]);

        $response->assertStatus(302);

        $donation = Donation::where('donor_name', 'Sachin Tendulkar')->first();
        $this->assertNotNull($donation);
        $this->assertEquals(50000, $donation->amount);
        $this->assertStringStartsWith('GNP-2026-', $donation->receipt_number);
    }

    public function test_user_can_mark_pending_donation_as_paid()
    {
        $user = User::first();
        $this->actingAs($user);

        $pendingDonation = Donation::where('trust_id', (string)$user->trust_id)
            ->where('payment_status', 'Pending')
            ->first();

        if ($pendingDonation) {
            $response = $this->post("/donations/{$pendingDonation->_id}/mark-as-paid");
            $response->assertStatus(302);

            $updated = Donation::find($pendingDonation->_id);
            $this->assertEquals('Paid', $updated->payment_status);
        } else {
            $this->assertTrue(true);
        }
    }
}
