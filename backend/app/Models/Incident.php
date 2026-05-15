<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model {
    protected $fillable = [
        'title', 'description', 'type', 'source',
        'status', 'priority', 'department_id', 'created_by', 'attachment'
    ];

    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function logs() {
        return $this->hasMany(IncidentLog::class);
    }
}