<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Trust extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'trusts';

    protected $fillable = [
        'trust_name',
        'email',
        'logo',
        'contact_number',
        'address',
        'registration_number',
        'receipt_settings',
    ];

    protected $casts = [
        'receipt_settings' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'trust_id', '_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'trust_id', '_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'trust_id', '_id');
    }

    /**
     * Get receipt settings with fallback defaults.
     */
    public function getReceiptSettings(): array
    {
        $defaults = [
            'header_mantra' => '॥ श्री गणेशाय नमः ॥',
            'trust_name' => $this->trust_name ?? 'श्री गणेश मित्र मंडळ',
            'utsav_name' => 'गणेश उत्सव 2026',
            'address' => $this->address ?? '123, लक्ष्मी नगर, पुणे - 411001, महाराष्ट्र',
            'registration_number' => $this->registration_number ?? 'Reg. No. : F/12345/PUNE/2020',
            'contact_number' => $this->contact_number ?? '+91 98765 43210',
            'theme_color' => '#7f1d1d', // Crimson Red
            'show_toran' => true,
            'show_watermark' => true,
            'thank_you_note' => 'Thank you for your generous contribution',
            'footer_slogan' => '॥ गणपती बाप्पा मोरया ॥',
            'signatory_title' => 'For SHREE GANESH MITRA MANDAL',
            'signatory_subtitle' => 'Authorized Signatory',
        ];

        return array_merge($defaults, $this->receipt_settings ?? []);
    }
}
