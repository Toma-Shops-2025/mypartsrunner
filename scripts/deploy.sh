#!/bin/bash

# MyPartsRunner™ Deployment Script
# This script automates the deployment process for different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="MyPartsRunner"
VERSION="1.0.0"
BUILD_DIR="dist"
DEPLOY_PLATFORM=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_status "Dependencies already installed, skipping..."
    fi
}

# Function to build the application
build_app() {
    print_status "Building application..."
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        print_status "Cleaned previous build"
    fi
    
    # Build the application
    npm run build
    
    if [ -d "$BUILD_DIR" ]; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    print_success "Deployed to Vercel successfully"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    netlify deploy --prod --dir="$BUILD_DIR"
    
    print_success "Deployed to Netlify successfully"
}

# Function to deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI not found. Installing..."
        npm install -g firebase-tools
    fi
    
    # Login to Firebase (if not already logged in)
    firebase login --no-localhost
    
    # Initialize Firebase (if not already initialized)
    if [ ! -f "firebase.json" ]; then
        firebase init hosting
    fi
    
    # Deploy to Firebase
    firebase deploy --only hosting
    
    print_success "Deployed to Firebase successfully"
}

# Function to create production build for manual deployment
create_production_build() {
    print_status "Creating production build..."
    
    # Create a production-ready archive
    ARCHIVE_NAME="${APP_NAME}-${VERSION}-production.tar.gz"
    
    tar -czf "$ARCHIVE_NAME" -C "$BUILD_DIR" .
    
    print_success "Production build created: $ARCHIVE_NAME"
    print_status "You can now manually upload this archive to your hosting provider"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if npm run test 2>/dev/null; then
        print_success "Tests passed"
    else
        print_warning "No tests configured or tests failed"
    fi
}

# Function to validate environment variables
validate_env() {
    print_status "Validating environment variables..."
    
    if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
        print_warning "No environment file found. Please create .env.local with required variables."
        print_status "See env.example for required variables."
        return 1
    fi
    
    # Check for required environment variables
    if [ -f ".env.local" ]; then
        source .env.local
    elif [ -f ".env" ]; then
        source .env
    fi
    
    if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        print_error "Missing required Supabase environment variables"
        print_status "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
        return 1
    fi
    
    print_success "Environment variables validated"
    return 0
}

# Function to show help
show_help() {
    echo "MyPartsRunner™ Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --platform PLATFORM    Deployment platform (vercel|netlify|firebase|manual)"
    echo "  -t, --test                 Run tests before deployment"
    echo "  -v, --validate             Validate environment variables"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -p vercel               Deploy to Vercel"
    echo "  $0 -p netlify              Deploy to Netlify"
    echo "  $0 -p firebase             Deploy to Firebase"
    echo "  $0 -p manual               Create production build for manual deployment"
    echo "  $0 -t -p vercel            Run tests and deploy to Vercel"
    echo ""
}

# Main deployment function
main() {
    print_status "Starting MyPartsRunner™ deployment..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--platform)
                DEPLOY_PLATFORM="$2"
                shift 2
                ;;
            -t|--test)
                RUN_TESTS=true
                shift
                ;;
            -v|--validate)
                VALIDATE_ENV=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_prerequisites
    
    # Validate environment if requested
    if [ "$VALIDATE_ENV" = true ]; then
        validate_env
        if [ $? -ne 0 ]; then
            exit 1
        fi
    fi
    
    # Install dependencies
    install_dependencies
    
    # Run tests if requested
    if [ "$RUN_TESTS" = true ]; then
        run_tests
    fi
    
    # Build the application
    build_app
    
    # Deploy based on platform
    case $DEPLOY_PLATFORM in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "firebase")
            deploy_firebase
            ;;
        "manual")
            create_production_build
            ;;
        "")
            print_error "No deployment platform specified"
            show_help
            exit 1
            ;;
        *)
            print_error "Unknown deployment platform: $DEPLOY_PLATFORM"
            show_help
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@" 