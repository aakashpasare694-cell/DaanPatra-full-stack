<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TrustUserController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = Auth::user();
        $trustId = (string) $currentUser->trust_id;
        $currentUser->load('trust');

        $users = User::where('trust_id', $trustId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => (string) $u->_id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'mobile' => $u->mobile ?? 'N/A',
                    'role' => $u->isAdmin() ? 'Admin' : 'Normal User',
                    'is_admin' => $u->isAdmin(),
                    'created_at' => $u->created_at ? $u->created_at->format('d M Y, h:i A') : '',
                ];
            });

        return Inertia::render('Users/Index', [
            'auth' => [
                'user' => $currentUser,
                'trust' => $currentUser->trust,
            ],
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $currentUser = Auth::user();

        if ($currentUser->isNormal()) {
            return back()->with('error', 'Access Denied: Only Trust Admins can add new members.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile' => 'nullable|string|max:20',
            'role' => 'required|string|in:admin,normal',
            'password' => 'required|string|min:8',
        ]);

        $trustId = (string) $currentUser->trust_id;

        $newUser = User::create([
            'trust_id' => $trustId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'mobile' => $validated['mobile'] ?? null,
            'role' => strtolower($validated['role']),
            'password' => Hash::make($validated['password']),
        ]);

        ActivityLogger::log(
            'USER_CREATED',
            "Added new trust member '{$newUser->name}' with role " . strtoupper($newUser->role),
            [
                'member_id' => (string)$newUser->_id,
                'member_name' => $newUser->name,
                'member_email' => $newUser->email,
                'role' => $newUser->role,
            ]
        );

        return back()->with('success', "New trust member '{$newUser->name}' added successfully.");
    }

    public function updateRole(Request $request, $id)
    {
        $currentUser = Auth::user();

        if ($currentUser->isNormal()) {
            return back()->with('error', 'Access Denied: Only Trust Admins can modify member roles.');
        }

        $trustId = (string) $currentUser->trust_id;
        $targetUser = User::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();

        $validated = $request->validate([
            'role' => 'required|string|in:admin,normal',
        ]);

        $oldRole = $targetUser->role;
        $targetUser->role = strtolower($validated['role']);
        $targetUser->save();

        ActivityLogger::log(
            'USER_ROLE_UPDATED',
            "Changed role for '{$targetUser->name}' from {$oldRole} to {$targetUser->role}",
            [
                'member_id' => (string)$targetUser->_id,
                'member_name' => $targetUser->name,
                'new_role' => $targetUser->role,
            ]
        );

        return back()->with('success', "Role for '{$targetUser->name}' updated to " . strtoupper($targetUser->role) . ".");
    }

    public function destroy($id)
    {
        $currentUser = Auth::user();

        if ($currentUser->isNormal()) {
            return back()->with('error', 'Access Denied: Only Trust Admins can remove members.');
        }

        if ((string)$currentUser->_id === (string)$id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $trustId = (string) $currentUser->trust_id;
        $targetUser = User::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();
        
        $userName = $targetUser->name;
        $targetUser->delete();

        ActivityLogger::log(
            'USER_REMOVED',
            "Removed trust member '{$userName}'",
            ['member_id' => (string)$id, 'member_name' => $userName]
        );

        return back()->with('success', "Member '{$userName}' removed from trust.");
    }
}
