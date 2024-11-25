<?php

namespace App\Http\Controllers;

use App\Models\EnrollmetForm;
use App\Http\Requests\StoreEnrollmetFormRequest;
use App\Http\Requests\UpdateEnrollmetFormRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EnrollmetFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnrollmetFormRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EnrollmetForm $enrollmetForm)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EnrollmetForm $enrollmetForm)
    {
        //
    }

     // Fetch or create the enrollment form
     public function showOrCreate()
     {
         $form = EnrollmetForm::first();

         if (!$form) {
             $form = EnrollmetForm::create(['files' => null]);
         }

         // Add file URL to the response if the file exists
         if ($form->files) {
             $form->file_url = asset('storage/' . $form->files);
         } else {
             $form->file_url = null;
         }

         return response()->json($form);
     }


    // Update the file
    public function update(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,txt|max:5120', // Allow PDF, DOC, DOCX, TXT with max size of 5MB
        ]);

        // Check if a form exists, if not, create one
        $form = EnrollmetForm::firstOrCreate([], ['files' => null]);

        // Store the file
        if ($request->hasFile('file')) {
            // Delete the old file if it exists
            if ($form->files && Storage::exists('public/' . $form->files)) {
                Storage::delete('public/' . $form->files);
            }

            // Store the new file in the 'public' directory
            $path = $request->file('file')->store('enrollment_forms', 'public'); // Store in 'storage/app/public/enrollment_forms'

            // Update the form record with the new file path
            $form->update(['files' => $path]);
        }

        return response()->json(['message' => 'Enrollment form updated successfully.', 'form' => $form]);
    }

}
