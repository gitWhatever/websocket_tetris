module.exports = { 
    rand: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rotate90Deg: function (matrix) {
        var length = matrix.length;
        //i代表正方形的起始位置，i=0即（0，0），i=1即（1，1）
        for (var i = 0; i < length / 2; i++) {
            //j代表当前正方形上的一条边上的一个点。
            for (var j = i; j < length - i - 1; j++) {
                var temp = matrix[i][j];
                matrix[i][j] = matrix[length - j - 1][i];
                matrix[length - j - 1][i] = matrix[length - i - 1][length - j - 1];
                matrix[length - i - 1][length - j - 1] = matrix[j][length - i - 1];
                matrix[j][length - i - 1] = temp;
            }
        }
        return matrix;
    },
    rotateBack90Deg: function (matrix) {
        var length = matrix.length;
        //i代表正方形的起始位置，i=0即（0，0），i=1即（1，1）
        for (var i = 0; i < length / 2; i++) {
            //j代表当前正方形上的一条边上的一个点。
            for (var j = i; j < length - i - 1; j++) {
                var temp = matrix[i][j];

                matrix[i][j] = matrix[j][length - i - 1];
                matrix[j][length - i - 1] = matrix[length - i - 1][length - j - 1];
                matrix[length - i - 1][length - j - 1] = matrix[length - j - 1][i];
                matrix[length - j - 1][i] = temp;
            }
        }
        return matrix;
    },
    rotateReverse: function (matrix) {
        matrix.reverse();
        matrix.forEach(function (arr, index) {
            arr.reverse();
        });
        return matrix;
    }
}