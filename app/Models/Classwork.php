<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Classwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subject_id',
        'description',
        'status',
        'deadline',
        'score',

    ];

    public function studentClassworks()
    {
        return $this->hasMany(StudentClasswork::class, 'submission_id');
    }

    public function submissions()
    {
        return $this->hasMany(ClassworkSubmission::class, 'classwork_id');
    }

    public static function updateStatusBasedOnDeadline()
    {
        // Get all classworks where the deadline has passed
        $classworks = self::where('deadline', '<', now())
            ->where('status', '<>', 'close')
            ->get();

        // Update their status to 'closed'
        foreach ($classworks as $classwork) {
            $classwork->status = 'close';
            $classwork->save();
        }
    }


    public function subject()
{
    return $this->belongsTo(Subject::class);
}
    // Define a relationship to get students in this classwork's subject
    public function enrolledStudents()
    {
        return $this->belongsToMany(Student::class, 'classlists', 'class_id', 'student_id')
                    ->join('subjects', 'classlists.class_id', '=', 'subjects.classroom_id')
                    ->where('subjects.id', $this->subject_id)
                    ->select('students.*'); // Ensure you select students' fields
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

}