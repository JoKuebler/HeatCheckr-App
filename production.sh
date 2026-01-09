echo "Starting build"
eas build -p ios 
echo "Build successful, submitting to App Store"
eas submit --platform ios