/**
 * Generates a random hexadecimal color.
 * @returns {string} Random hexadecimal color string.
 */
export function generateRandomHexColor(): string {
    const random = Math.random();
    const exponentPart = random.toExponential().split('-')[1];
    const exponent = exponentPart ? parseInt(exponentPart) - 1 : 0;

    // Make sure random number is between 1.0 and 0.1 to assure correct hex values.
    const adjustedRandom = random * Math.pow(10, exponent);

    const colorValue = Math.floor(adjustedRandom * (1 << 24)).toString(16);

    // Pad the hexadecimal color value with zeros if needed
    const paddedColorValue = colorValue.padStart(6, '0');

    return `#${paddedColorValue}`;
}

// Example usage:
const randomHexColor = generateRandomHexColor();
