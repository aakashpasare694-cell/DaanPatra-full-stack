<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Expense extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'expenses';

    protected $fillable = [
        'trust_id',
        'title',
        'description',
        'amount',
        'category',
        'expense_date',
        'paid_by',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
        'expense_date' => 'date',
    ];

    public function trust()
    {
        return $this->belongsTo(Trust::class, 'trust_id', '_id');
    }
}
