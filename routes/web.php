<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TrustUserController;
use Illuminate\Support\Facades\Route;

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Authenticated Protected Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/', function () {
        return redirect()->route('dashboard');
    });

    // Dashboard Route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Donations Routes
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::put('/donations/{id}', [DonationController::class, 'update'])->name('donations.update');
    Route::delete('/donations/{id}', [DonationController::class, 'destroy'])->name('donations.destroy');
    Route::post('/donations/{id}/mark-as-paid', [DonationController::class, 'markAsPaid'])->name('donations.markAsPaid');
    Route::post('/donations/{id}/send-receipt', [DonationController::class, 'sendReceipt'])->name('donations.sendReceipt');

    // Expense Routes
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::put('/expenses/{id}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

    // Reports Route
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Activity Logs Route
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Trust User Management & Roles Route
    Route::get('/users', [TrustUserController::class, 'index'])->name('users.index');
    Route::post('/users', [TrustUserController::class, 'store'])->name('users.store');
    Route::put('/users/{id}/role', [TrustUserController::class, 'updateRole'])->name('users.updateRole');
    Route::delete('/users/{id}', [TrustUserController::class, 'destroy'])->name('users.destroy');

    // Settings Module & Receipt Customizer Sub-module Routes
    Route::get('/settings/receipt', [SettingController::class, 'index'])->name('settings.receipt');
    Route::post('/settings/receipt', [SettingController::class, 'updateReceipt'])->name('settings.receipt.update');
});
