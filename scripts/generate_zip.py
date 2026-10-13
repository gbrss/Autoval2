import os
import zipfile

def create_project_zip():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    zip_path = os.path.join(base_dir, 'autoval-clon-astro.zip')
    
    exclude_dirs = {'node_modules', '.git', 'dist', '.aistudio', '__pycache__', '.vite'}
    exclude_files = {'autoval-clon-astro.zip'}
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files or file.endswith('.pyc') or file.startswith('.DS_Store'):
                    continue
                filepath = os.path.join(root, file)
                arcname = os.path.relpath(filepath, base_dir)
                zipf.write(filepath, arcname)

    print(f"Project ZIP created at: {zip_path}")
    return zip_path

if __name__ == '__main__':
    create_project_zip()
