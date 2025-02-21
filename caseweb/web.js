const fs = require('fs');

// Function to convert values from different bases to decimal
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to perform Lagrange Interpolation and find constant term (c)
function lagrangeInterpolation(points) {
    let c = 0;
    let k = points.length;

    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];

        let li = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                li *= -points[j][0] / (xi - points[j][0]);
            }
        }
        c += yi * li;
    }

    return Math.round(c); // Since coefficients are integers
}

// Function to process the input JSON file and find the secret
function findSecret(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;
    let points = [];

    // Read and decode the points
    Object.keys(data).forEach(key => {
        if (!isNaN(parseInt(key))) {
            let x = parseInt(key);
            let y = decodeValue(parseInt(data[key].base), data[key].value);
            points.push([x, y]);
        }
    });

    // Ensure we take only the first k points needed for interpolation
    points = points.slice(0, k);

    // Solve for the constant term
    const secret = lagrangeInterpolation(points);
    console.log(secret);
}

// Run the function with the provided JSON file
findSecret('case2.json'); // Replace 'input.json' with the actual filename

