import os

IGNORE = {"node_modules", ".git", ".vite"}

def print_tree(root_path, prefix=""):
    items = sorted(
        item for item in os.listdir(root_path)
        if item not in IGNORE
    )

    for i, item in enumerate(items):
        path = os.path.join(root_path, item)
        is_last = i == len(items) - 1

        print(prefix + ("└── " if is_last else "├── ") + item)

        if os.path.isdir(path):
            print_tree(
                path,
                prefix + ("    " if is_last else "│   ")
            )


print_tree(".")
