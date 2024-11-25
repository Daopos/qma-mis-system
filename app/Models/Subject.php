<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'teacher_id',
        'classroom_id',
        'start',
        'end',
        'day',
        'archived',
    ];

    public function classroom()
{
    return $this->belongsTo(Classroom::class);
}

public function schedules()
{
    return $this->hasMany(SubjectSchedule::class);
}

public function enrolledStudents()
{
    return $this->belongsToMany(Student::class, 'classlists', 'class_id', 'student_id')
                ->join('subjects', 'classlists.class_id', '=', 'subjects.classroom_id') // This line needs to be removed
                ->where('subjects.id', $this->subject_id);
}

public function teacher()
{
    return $this->belongsTo(Employee::class, 'teacher_id');
}

public function tests()
{
    return $this->hasMany(Test::class);
}

}
