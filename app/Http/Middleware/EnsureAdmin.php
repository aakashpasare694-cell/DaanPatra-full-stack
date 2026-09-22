<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->isNormal()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Access Denied: Read-only members cannot perform modifications.'], 403);
            }

            return back()->with('error', 'Access Denied: You have Read-Only access. Only Trust Admins can perform modifications.');
        }

        return $next($request);
    }
}
