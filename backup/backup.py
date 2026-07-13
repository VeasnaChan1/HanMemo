import os
import subprocess
import datetime

def load_env_fallback(dotenv_path):
    """Fallback .env parser if python-dotenv is not installed."""
    if os.path.exists(dotenv_path):
        with open(dotenv_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if not line or line.startswith('#') or '=' not in line:
                    continue
                key, val = line.split('=', 1)
                key = key.strip()
                val = val.strip().strip("'\"")
                # Set in os.environ if not already set
                if key and not os.environ.get(key):
                    os.environ[key] = val

# Try importing python-dotenv; if unavailable, use the fallback parser
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Load from server/.env as a fallback for local execution
server_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'server', '.env')
load_env_fallback(server_env)

def run_backup():
    # Read database credentials from environment variables (GitHub secrets or local .env)
    db_host = os.getenv('DB_HOST')
    db_port = os.getenv('PORT')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_name = os.getenv('DB_NAME')
    
    # Validate required parameters
    if not all([db_host, db_port, db_user, db_password, db_name]):
        missing = [name for name, val in [
            ('DB_HOST', db_host), ('PORT', db_port), ('DB_USER', db_user), 
            ('DB_PASSWORD', db_password), ('DB_NAME', db_name)
        ] if not val]
        raise ValueError(f"Missing required environment variables for backup: {', '.join(missing)}")
        
    # Define backup folder and filename
    backup_dir = 'backups'
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(backup_dir, f"{db_name}_{timestamp}.sql")
    
    print(f"Starting database backup for '{db_name}' from {db_host}:{db_port}...")
    
    # Build mysqldump command
    # Use standard options for safe and clean dumps
    cmd = [
        'mysqldump',
        f'--host={db_host}',
        f'--port={db_port}',
        f'--user={db_user}',
        f'--password={db_password}',
        '--single-transaction',
        '--quick',
        '--lock-tables=false',
        db_name
    ]
    
    try:
        # Run mysqldump and write output to file
        with open(backup_file, 'w', encoding='utf-8') as f:
            result = subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE, text=True, check=True)
        
        # Verify the backup file size
        file_size = os.path.getsize(backup_file)
        if file_size > 0:
            print(f"Backup file successfully generated: {backup_file} ({file_size} bytes)")
            
            # Compress the backup using gzip
            zip_file = f"{backup_file}.gz"
            import gzip
            import shutil
            with open(backup_file, 'rb') as f_in:
                with gzip.open(zip_file, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            
            # Clean up the uncompressed SQL file
            os.remove(backup_file)
            print(f"Backup compressed successfully: {zip_file}")
        else:
            raise RuntimeError("Database backup file is empty.")
            
    except subprocess.CalledProcessError as e:
        print(f"Backup failed! mysqldump output: {e.stderr}")
        if os.path.exists(backup_file):
            os.remove(backup_file)
        raise e

if __name__ == '__main__':
    run_backup()
