<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log a system activity event.
     *
     * @param string $actionType e.g., 'DONATION_CREATED', 'EXPENSE_DELETED', 'USER_ADDED'
     * @param string $description Human-readable summary of the action
     * @param array $details Contextual data (amounts, receipt numbers, etc.)
     * @return ActivityLog|null
     */
    public static function log(string $actionType, string $description, array $details = []): ?ActivityLog
    {
        $user = Auth::user();
        if (!$user) {
            return null;
        }

        return ActivityLog::create([
            'trust_id' => (string) $user->trust_id,
            'user_id' => (string) $user->_id,
            'user_name' => $user->name ?? 'System User',
            'user_email' => $user->email ?? '',
            'user_role' => $user->isAdmin() ? 'Admin' : 'Normal User',
            'action_type' => $actionType,
            'description' => $description,
            'details' => $details,
            'ip_address' => Request::ip() ?? '127.0.0.1',
            'user_agent' => Request::header('User-Agent') ?? '',
        ]);
    }
}
