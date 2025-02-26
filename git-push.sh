#!/bin/bash

# Define ANSI color codes for terminal output formatting
# These colors are used to make the script's output more visually informative
RED='\033[0;31m'    # Used for error messages
GREEN='\033[0;32m'  # Used for success messages
YELLOW='\033[1;33m' # Used for information and prompts
NC='\033[0m'        # No Color - resets text formatting

# Verify git repository initialization
# Checks if the .git directory exists in the current directory
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not a git repository${NC}"
    echo "Please run 'git init' first"
    exit 1
fi

# Check for uncommitted changes in the repository
# git status --porcelain provides machine-readable output
# If the output is empty, there are no changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to commit${NC}"
    exit 0
fi

# Display current git status in short format
# Shows modified, added, and deleted files
echo -e "${YELLOW}Current git status:${NC}"
git status -s

# Stage all changes in the working directory
# This adds all modified, new, and deleted files to the staging area
echo -e "\n${YELLOW}Staging all changes...${NC}"
git add .

# Prompt user for commit message preference
# Allows choosing between custom message or auto-generated message
echo -e "\n${YELLOW}Do you want to enter a custom commit message? (y/n):${NC}"
read -p "> " custom_message_choice

if [[ $custom_message_choice =~ ^[Yy]$ ]]; then
    # Handle custom commit message flow
    echo -e "\n${YELLOW}Please enter your commit message:${NC}"
    read -p "> " commit_message

    # Validate that the commit message is not empty
    if [ -z "$commit_message" ]; then
        echo -e "${RED}Error: Commit message cannot be empty${NC}"
        exit 1
    fi
else
    # Auto-generate commit message based on changes
    echo -e "\n${YELLOW}Generating commit message based on changes...${NC}"
    
    # Get list of changed files and extract primary file
    # files_changed contains status and filename of all changes
    files_changed=$(git diff --cached --name-status)
    primary_file=$(echo "$files_changed" | head -n 1 | cut -f2)  # Get first changed file
    total_files=$(echo "$files_changed" | wc -l)               # Count total changes
    
    # Generate appropriate commit message based on number of changes
    if [ $total_files -eq 1 ]; then
        # For single file changes, use specific action (Add/Update/Remove)
        case ${files_changed:0:1} in
            A) commit_message="Add ${primary_file}" ;;      # New file
            M) commit_message="Update ${primary_file}" ;;   # Modified file
            D) commit_message="Remove ${primary_file}" ;;   # Deleted file
        esac
    else
        # For multiple file changes, use a summary message
        commit_message="Update ${primary_file} and other files"
    fi
    
    # Display the generated commit message
    echo -e "${GREEN}Generated commit message:${NC}"
    echo -e "$commit_message"
fi

# Commit changes with the selected/generated message
echo -e "\n${YELLOW}Committing changes...${NC}"
git commit -m "$commit_message"

# Check for remote repository and push changes
# Verifies if 'origin' remote is configured
if git remote -v | grep -q origin; then
    echo -e "\n${YELLOW}Pushing to remote...${NC}"
    # Push to the current branch on origin
    if git push origin "$(git rev-parse --abbrev-ref HEAD)"; then
        echo -e "\n${GREEN}Successfully pushed changes!${NC}"
    else
        echo -e "\n${RED}Error: Failed to push changes${NC}"
        echo "Please check your remote repository configuration"
        exit 1
    fi
else
    # Error if no remote is configured
    echo -e "\n${RED}Error: No remote repository configured${NC}"
    echo "Please add a remote repository using 'git remote add origin <repository-url>'"
    exit 1
fi