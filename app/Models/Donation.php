<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Donation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'donations';

    protected $fillable = [
        'trust_id',
        'receipt_number',
        'donor_name',
        'donor_mobile',
        'donor_email',
        'amount',
        'amount_in_words',
        'payment_method',
        'payment_status',
        'follow_up_after_days',
        'follow_up_date',
        'collected_by',
        'donation_date',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'donation_date' => 'date',
        'follow_up_date' => 'date',
        'paid_at' => 'datetime',
    ];

    public function trust()
    {
        return $this->belongsTo(Trust::class, 'trust_id', '_id');
    }
}
