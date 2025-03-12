
const compute_year_date_points = (seriesData,mobile) => {
   
    // Ensure n is between 6 and 12
    n = Math.max(6, Math.min(n, 12));

    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get the current month and generate the last `n` months
    let datePoints = [];
    for (let i = n - 1; i >= 0; i--) {
        let monthIndex = (today.getMonth() - i + 12) % 12; // Ensure wrap-around for past months
        datePoints.push(monthNames[monthIndex]);
    }

    return datePoints;
};

export default compute_year_date_points