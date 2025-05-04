const textToCount = process.env.TEXT_TO_COUNT;

if (textToCount) {
    console.log(textToCount.length);
} else {
    console.error("Error: TEXT_TO_COUNT environment variable not set.");
    process.exit(1); // Exit with an error code
}