<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'trust_id',
        'name',
        'email',
        'mobile',
        'password',
        'role', // 'admin' or 'normal'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function trust()
    {
        return $this->belongsTo(Trust::class, 'trust_id', '_id');
    }

    public function isAdmin(): bool
    {
        return empty($this->role) || strtolower($this->role) === 'admin';
    }

    public function isNormal(): bool
    {
        return strtolower($this->role ?? '') === 'normal';
    }

    public function canPerformCrud(): bool
    {
        return $this->isAdmin();
    }
}
