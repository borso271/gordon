/*

Should you treat the two lists differently?
Probably.

Given two lists historical_points, intraday_points of pointData objects like {price: some_price, other_properties}

give me a function that just return the min and max price in either of them. So you might merge them and then find the max and mix price

*/


function findMinMaxPrice(historical_points, intraday_points) {
    const allPoints = [...historical_points, ...intraday_points];
    const prices = allPoints.map(point => point.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}
