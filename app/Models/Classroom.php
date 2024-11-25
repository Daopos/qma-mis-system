<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'grade_level',
        'adviser_id',
        'archived',
    ];

    public function classLists() {
        return $this->hasMany(ClassList::class);
    }

    public function adviser()
{
    return $this->belongsTo(Employee::class, 'adviser_id');
}

public function subjects()
{
    return $this->hasMany(Subject::class);
}

public function classlistss()
{
    return $this->hasMany(Classlist::class, 'class_id'); // Specify class_id explicitly
}
}