<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\IncidentController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\AIController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ai/analyze', [AIController::class, 'analyzeIncident']);
    Route::post('/ai/conflict-check', [AIController::class, 'conflictCheck']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Incidents
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::post('/incidents', [IncidentController::class, 'store']);
    Route::get('/incidents/{id}', [IncidentController::class, 'show']);
    Route::put('/incidents/{id}', [IncidentController::class, 'update']);
    Route::patch('/incidents/{id}/status', [IncidentController::class, 'updateStatus']);
    Route::delete('/incidents/{id}', [IncidentController::class, 'destroy']);

    // Departments
    Route::apiResource('departments', DepartmentController::class);
});