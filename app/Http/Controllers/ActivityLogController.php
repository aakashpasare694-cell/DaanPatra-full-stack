<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $trustId = (string) $user->trust_id;
        $user->load('trust');

        $search = $request->input('search');
        $actionFilter = $request->input('action_type');

        $query = ActivityLog::where('trust_id', $trustId);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'LIKE', "%{$search}%")
                  ->orWhere('user_name', 'LIKE', "%{$search}%")
                  ->orWhere('action_type', 'LIKE', "%{$search}%");
            });
        }

        if ($actionFilter && $actionFilter !== 'All') {
            $query->where('action_type', $actionFilter);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        // Get unique action types for filter dropdown
        $actionTypes = ActivityLog::where('trust_id', $trustId)
            ->distinct('action_type')
            ->get()
            ->toArray();

        return Inertia::render('ActivityLogs/Index', [
            'auth' => [
                'user' => $user,
                'trust' => $user->trust,
            ],
            'logs' => $logs,
            'actionTypes' => $actionTypes,
            'filters' => [
                'search' => $search ?? '',
                'action_type' => $actionFilter ?? 'All',
            ],
            'summary' => [
                'totalLogs' => ActivityLog::where('trust_id', $trustId)->count(),
                'todayLogs' => ActivityLog::where('trust_id', $trustId)
                    ->where('created_at', '>=', now()->startOfDay())
                    ->count(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }
}
