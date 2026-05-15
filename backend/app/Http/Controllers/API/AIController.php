<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function analyzeIncident(Request $request)
    {
        $content = $request->input('content');
        if (!$content) {
            return response()->json(['error' => 'Content is required'], 400);
        }

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey || $apiKey === 'your_gemini_api_key_here') {
            return response()->json([
                'title' => 'Late Delivery — Customer Package Delayed 5+ Days',
                'summary' => 'A customer reported that their package has not arrived after 5 days, with tracking showing it is still at the sorting facility.',
                'type' => 'late_delivery',
                'source' => 'phone',
                'priority' => 'high',
                'tags' => ['late-delivery', 'customer-complaint', 'sorting-facility'],
                'suggested_steps' => [
                    'Locate the parcel in the sorting facility',
                    'Contact the sorting facility manager',
                    'Update the tracking system',
                    'Proactively call the customer'
                ]
            ]);
        }

        try {
            $systemPrompt = "You are a DHL incident analyst. Analyze the raw incident text and return a JSON object with these exact fields: title, summary, type (late_delivery, address_issue, damaged_parcel, system_error, customer_complaint), source (email, telegram, teams, phone, image, handwritten), priority (low, medium, high, critical), tags (array), suggested_steps (array). Return ONLY valid JSON.";
            
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
                'contents' => [['role' => 'user', 'parts' => [['text' => $content]]]],
                'generationConfig' => ['temperature' => 0.2, 'responseMimeType' => "application/json"]
            ]);

            if ($response->failed()) {
                throw new \Exception("Gemini API Error: " . $response->body());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'];
            return response()->json(json_decode($text, true));

        } catch (\Exception $e) {
            Log::error("AI Analysis Error: " . $e->getMessage());
            return response()->json(['error' => 'Failed to analyze incident'], 500);
        }
    }

    public function conflictCheck(Request $request)
    {
        $description = $request->input('description');
        $title = $request->input('title');

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey || $apiKey === 'your_gemini_api_key_here') {
            return response()->json([
                'has_conflicts' => false,
                'conflict_summary' => 'No conflicts detected in this incident report.',
                'missing_fields' => [],
                'recommendations' => ['Ensure tracking number is recorded', 'Confirm contact details']
            ]);
        }

        try {
            $systemPrompt = "You are a DHL incident analyst reviewing reports. Identify conflicts or missing info. Return JSON: has_conflicts (bool), conflict_summary (string), missing_fields (array), recommendations (array).";
            $userMessage = "Review this incident: Title: {$title}, Description: {$description}";

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
                'contents' => [['role' => 'user', 'parts' => [['text' => $userMessage]]]],
                'generationConfig' => ['temperature' => 0.2, 'responseMimeType' => "application/json"]
            ]);

            if ($response->failed()) {
                throw new \Exception("Gemini API Error: " . $response->body());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'];
            return response()->json(json_decode($text, true));

        } catch (\Exception $e) {
            Log::error("AI Conflict Error: " . $e->getMessage());
            return response()->json(['error' => 'Failed to check conflicts'], 500);
        }
    }
}
