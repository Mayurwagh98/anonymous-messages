#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not a git repository${NC}"
    echo "Please run 'git init' first"
    exit 1
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to commit${NC}"
    exit 0
fi

# Show current status
echo -e "${YELLOW}Current git status:${NC}"
git status -s

# Stage all changes
echo -e "\n${YELLOW}Staging all changes...${NC}"
git add .

# Ask user preference for commit message
echo -e "\n${YELLOW}Do you want to enter a custom commit message? (y/n):${NC}"
read -p "> " custom_message_choice

if [[ $custom_message_choice =~ ^[Yy]$ ]]; then
    # Get custom commit message
    echo -e "\n${YELLOW}Please enter your commit message:${NC}"
    read -p "> " commit_message

    # Validate commit message
    if [ -z "$commit_message" ]; then
        echo -e "${RED}Error: Commit message cannot be empty${NC}"
        exit 1
    fi
else
    # Generate commit message based on changes
    echo -e "\n${YELLOW}Generating commit message based on changes...${NC}"
    
    # Get primary changed file
    files_changed=$(git diff --cached --name-status)
    primary_file=$(echo "$files_changed" | head -n 1 | cut -f2)
    total_files=$(echo "$files_changed" | wc -l)
    
    # Build commit message
    if [ $total_files -eq 1 ]; then
        # For single file changes
        case ${files_changed:0:1} in
            A) commit_message="Add ${primary_file}" ;;
            M) commit_message="Update ${primary_file}" ;;
            D) commit_message="Remove ${primary_file}" ;;
        esac
    else
        # For multiple file changes
        commit_message="Update ${primary_file} and other files"
    fi
    
    echo -e "${GREEN}Generated commit message:${NC}"
    echo -e "$commit_message"
fi

# Commit changes
echo -e "\n${YELLOW}Committing changes...${NC}"
git commit -m "$commit_message"

# Check if remote exists and push
if git remote -v | grep -q origin; then
    echo -e "\n${YELLOW}Pushing to remote...${NC}"
    if git push origin "$(git rev-parse --abbrev-ref HEAD)"; then
        echo -e "\n${GREEN}Successfully pushed changes!${NC}"
    else
        echo -e "\n${RED}Error: Failed to push changes${NC}"
        echo "Please check your remote repository configuration"
        exit 1
    fi
else
    echo -e "\n${RED}Error: No remote repository configured${NC}"
    echo "Please add a remote repository using 'git remote add origin <repository-url>'"
    exit 1
fi