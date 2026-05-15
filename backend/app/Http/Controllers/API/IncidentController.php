<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\IncidentLog;
use Illuminate\Http\Request;

class IncidentController extends Controller {
    public function index(Request $request) {
        $query = Incident::with(['department', 'creator']);

        if ($request->status) $query->where('status', $request->status);
        if ($request->priority) $query->where('priority', $request->priority);
        if ($request->department_id) $query->where('department_id', $request->department_id);
        if ($request->search) $query->where('title', 'like', '%'.$request->search.'%');

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:late_delivery,address_issue,damaged_parcel,system_error,customer_complaint',
            'source' => 'required|in:email,telegram,teams,phone,image,handwritten',
            'priority' => 'in:low,medium,high,critical',
        ]);

        $data = $request->only(['title','description','type','source','priority','department_id']);
        $data['created_by'] = auth()->id();
        $data['status'] = 'draft';

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $incident = Incident::create($data);

        IncidentLog::create([
            'incident_id' => $incident->id,
            'action' => 'Incident created',
            'new_status' => 'draft',
            'changed_by' => auth()->id()
        ]);

        return response()->json($incident, 201);
    }

    public function show($id) {
        return response()->json(
            Incident::with(['department', 'creator', 'logs'])->findOrFail($id)
        );
    }

    public function update(Request $request, $id) {
        $incident = Incident::findOrFail($id);
        $incident->update($request->only(['title','description','type','source','priority','department_id']));
        return response()->json($incident);
    }

    public function updateStatus(Request $request, $id) {
        $request->validate(['status' => 'required|in:draft,reviewed,resolved']);
        $incident = Incident::findOrFail($id);

        $old = $incident->status;
        $incident->update(['status' => $request->status]);

        IncidentLog::create([
            'incident_id' => $incident->id,
            'action' => 'Status updated',
            'old_status' => $old,
            'new_status' => $request->status,
            'changed_by' => auth()->id()
        ]);

        return response()->json($incident);
    }

    public function destroy($id) {
        Incident::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}