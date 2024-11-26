<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class DatabaseBackUp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a backup of the database and stores it in the storage folder';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // File name with timestamp
        $filename = "backup-" . Carbon::now()->format('Y-m-d_H-i-s') . ".sql";
        $path = storage_path("app/backup/{$filename}");

        // Ensure the backup directory exists
        if (!is_dir(storage_path('app/backup'))) {
            mkdir(storage_path('app/backup'), 0755, true);
        }

        // Set MYSQL_PWD if needed, otherwise, skip password in the command
        if (env('DB_PASSWORD')) {
            putenv('MYSQL_PWD=' . env('DB_PASSWORD'));
        }

        // Prepare the mysqldump command for a .sql backup (no gzip compression)
        $command = sprintf(
            'mysqldump --user=%s --host=%s --port=%s --databases %s --skip-lock-tables --no-tablespaces --column-statistics=0 > %s',
            escapeshellarg(env('DB_USERNAME', 'root')), // Default to 'root' if not set
            escapeshellarg(env('DB_HOST', '127.0.0.1')),
            escapeshellarg(env('DB_PORT', 3306)),
            escapeshellarg(env('DB_DATABASE')),
            escapeshellarg($path)
        );

        // Output the command being executed (for debugging)
        $this->info("Command: $command");

        // Execute the command and capture the output
        $output = [];
        $returnVar = null;
        exec($command . ' 2>&1', $output, $returnVar);

        // Output the return code and any error messages
        $this->info("Return code: $returnVar");
        $this->info("Output: " . implode("\n", $output));

        // Handle success or failure
        if ($returnVar === 0) {
            $this->info("Backup successfully created at: {$path}");
        } else {
            $this->error("Backup failed. Error output: " . implode("\n", $output));
        }

        return $returnVar;
    }
}