<?php

namespace App\Http\Controllers;

use App\Models\Trust;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $user->load('trust');
        $trust = $user->trust;

        $receiptSettings = $trust ? $trust->getReceiptSettings() : [];

        return Inertia::render('Settings/Receipt', [
            'auth' => [
                'user' => $user,
                'trust' => $trust,
            ],
            'receiptSettings' => $receiptSettings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function updateReceipt(Request $request)
    {
        $user = Auth::user();

        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only users cannot modify receipt settings.');
        }

        $trust = $user->trust;
        if (!$trust) {
            return back()->with('error', 'Trust not found.');
        }

        $validated = $request->validate([
            'header_mantra' => 'required|string|max:255',
            'trust_name' => 'required|string|max:255',
            'utsav_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'registration_number' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:50',
            'theme_color' => 'required|string|max:20',
            'show_toran' => 'required|boolean',
            'show_watermark' => 'required|boolean',
            'thank_you_note' => 'required|string|max:255',
            'footer_slogan' => 'required|string|max:255',
            'signatory_title' => 'required|string|max:255',
            'signatory_subtitle' => 'required|string|max:255',
        ]);

        $trust->receipt_settings = $validated;
        $trust->trust_name = $validated['trust_name'];
        $trust->contact_number = $validated['contact_number'];
        $trust->address = $validated['address'];
        if (!empty($validated['registration_number'])) {
            $trust->registration_number = $validated['registration_number'];
        }
        $trust->save();

        ActivityLogger::log(
            'RECEIPT_SETTINGS_UPDATED',
            "Updated receipt layout configuration & branding",
            ['theme_color' => $validated['theme_color'], 'trust_name' => $validated['trust_name']]
        );

        return back()->with('success', 'Receipt layout settings updated successfully!');
    }
}
