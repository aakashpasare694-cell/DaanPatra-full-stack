<?php

namespace App\Http\Controllers;

use App\Models\Trust;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            ActivityLogger::log('USER_LOGIN', "User '" . Auth::user()->name . "' logged into the trust portal");

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'trust_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create Trust first
        $trust = Trust::create([
            'trust_name' => $request->trust_name,
            'email' => $request->email,
        ]);

        // Create User associated with Trust
        $user = User::create([
            'trust_id' => (string) $trust->_id,
            'name' => 'Trust Admin',
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        Auth::login($user);

        ActivityLogger::log('TRUST_REGISTERED', "Created and registered new trust '{$trust->trust_name}'");

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            ActivityLogger::log('USER_LOGOUT', "User '" . Auth::user()->name . "' logged out");
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
