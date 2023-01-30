/* Entry point of the program defined by package.json */

function main() {
    console.log("hello world");
}

// Invokes the main method
if (require.main === module) {
    main();
}
