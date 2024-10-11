#!/bin/bash

# build.sh - Compile and package script for Vaivai VSCode extension

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found. Please install Node.js and npm."
    exit 1
fi

# Check if vsce is installed
if ! command -v vsce &> /dev/null
then
    echo "vsce could not be found. Installing vsce globally..."
    npm install -g vsce
fi

# Navigate to the project root (assuming this script is in the project root)
# If it's not, adjust the path accordingly
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Compile TypeScript
echo "Compiling TypeScript..."
npm run compile

# Run tests
echo "Running tests..."
npm test

# Package the extension
echo "Packaging the extension..."
vsce package

# Check if packaging was successful
if [ $? -eq 0 ]; then
    echo "Extension packaged successfully. The .vsix file is in the current directory."
else
    echo "Packaging failed. Please check the output for errors."
    exit 1
fi

# Optional: List the contents of the directory to see the .vsix file
ls -l *.vsix

echo "Build process completed."
