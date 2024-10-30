export class Tensor {
    constructor(data) {
        if (Array.isArray(data)) {
            this.data = data;
            this.shape = this.getShape(data);
        } else if (data instanceof Tensor) {
            this.data = data.data;
            this.shape = data.shape;
        } else {
            throw new Error('Data must be an array.');
        }
    };
    
    
    // Get the shape of the n-dimensional array
    getShape(arr) {
        const shape = [];
        let current = arr;
        while (Array.isArray(current)) {
            shape.push(current.length);
            current = current[0]; // Move to the next level
        }
        return shape;
    };

    // Get the number of dimensions
    get dimensions() {
        return this.shape.length;
    }

    // Get the size of each dimension
    get size() {
        return this.shape;
    }

    // Addition for compatible n-dimensional tensors
    static zeros(shape) {
        const totalElements = shape.reduce((a, b) => a * b, 1);
        const  Os = Array.from({length: totalElements}, () => 0);
        return new Tensor(Tensor._reshape(Os, shape));
    }

    add(other) {
        this._checkCompatibility(other);
        return this._operate(other, (a, b) => a + b);
    }

    // Subtraction for compatible n-dimensional tensors
    subtract(other) {
        this._checkCompatibility(other);
        return this._operate(other, (a, b) => a - b);
    }

    // Scalar multiplication
    scalarMultiply(scalar) {
        return this._operate(this, (a) => a * scalar);
    }

    // Private method for n-dimensional operations
    _operate(other, operation) {
        const result = this._createEmptyArray(this.shape);
        this._traverse(this.data, other.data, result, operation);
        return new Tensor(result);
    }

    // Private method for compatibility check
    _checkCompatibility(other) {
        if (this.shape.toString() !== other.shape.toString()) {
            throw new Error('Shapes must be the same for operations.');
        }
    }

    // Private method to traverse n-dimensional arrays
    _traverse(arr1, arr2, result, operation, indices = []) {
        if (Array.isArray(arr1)) {
            for (let i = 0; i < arr1.length; i++) {
                this._traverse(arr1[i], arr2[i], result, operation, indices.concat(i));
            }
        } else {
            result[indices] = operation(arr1, arr2);
        }
    }

    // Private method to create an empty array with the same shape
    _createEmptyArray(shape) {
        if (shape.length === 0) return 0; // Base case
        return Array.from({ length: shape[0] }, () => this._createEmptyArray(shape.slice(1)));
    }

    // Create a random tensor with specified dimensions
    static random(dimensions) {
        const totalElements = dimensions.reduce((a, b) => a * b, 1);
        const data = Array.from({ length: totalElements }, () => Math.random()-0.5);
        return new Tensor(Tensor._reshape(data, dimensions));
    }

    // Private method to reshape a flat array into the specified dimensions
    static _reshape(flatArray, dimensions) {
        if (dimensions.length === 1) return flatArray
        let row;
        let col;
        let base = [];
        while (dimensions.length > 0) {
            if (dimensions.length === 1) break
            row = flatArray.length/dimensions[ dimensions.length-1 ];
            col = dimensions[ dimensions.length-1 ];
            for (let i=0; i < row; i++) {
                base.push(flatArray.splice(0, col))
            }
            dimensions.pop();
            flatArray = base;
        }
        return base;
    }

    // Print the rank-n tensor
    print() {
        console.log(JSON.stringify(this.data, null, 2));
    }
}

// Usage example:
// const A = Tensor.random(2, 2, 2); // Create a random 2x2x2 tensor
// const B = Tensor.random(2, 2, 2); // Create another random 2x2x2 tensor

// const C = A.add(B);
// const D = A.subtract(B);
// const E = A.scalarMultiply(2);

// console.log("Tensor A:");
// A.print(); // Print random tensor A
// console.log("Tensor B:");
// B.print(); // Print random tensor B
// console.log("Tensor C (A + B):");
// C.print(); // Print addition result
// console.log("Tensor D (A - B):");
// D.print(); // Print subtraction result
// console.log("Tensor E (A * 2):");
// E.print(); // Print scalar multiplication result


// // Usage example:
// const A = new Tensor([
//     [[1, 2], [3, 4]],
//     [[5, 6], [7, 8]]
// ]); // 2x2x2 tensor
  
// const B = new Tensor([
// [[9, 10], [11, 12]],
// [[13, 14], [15, 16]]
// ]); // 2x2x2 tensor

// const C = A.add(B);
// const D = A.subtract(B);
// const E = A.scalarMultiply(2);

// C.print(); // Addition result
// D.print(); // Subtraction result
// E.print(); // Scalar multiplication result