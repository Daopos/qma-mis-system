<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $fillable = ['subject_id', 'title', 'description','questions','test_id','correct_answer','pts', 'deadline', 'status',];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class); // Assuming 'subject_id' exists on the Test model
    }


    public function submissions()
    {
        return $this->hasMany(TestSubmission::class);
    }
    // Define the relationship with identifications (if applicable)


    // Define the relationship with essays (if applicable)

}