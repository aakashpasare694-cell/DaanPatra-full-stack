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
}
