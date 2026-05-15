<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model {
    protected $fillable = ['name', 'email'];

    public function incidents() {
        return $this->hasMany(Incident::class);
    }
}