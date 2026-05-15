<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentLog extends Model {
    protected $fillable = [
        'incident_id', 'action', 'old_status', 'new_status', 'changed_by'
    ];

    public function incident() {
        return $this->belongsTo(Incident::class);
    }

    public function changedBy() {
        return $this->belongsTo(User::class, 'changed_by');
    }
}