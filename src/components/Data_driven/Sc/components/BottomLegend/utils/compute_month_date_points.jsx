
const compute_month_date_points = (seriesData,mobile) => {
    const today = new Date();
    const totalDays = 30; // Approximate a month as 30 days
    const numPoints = 6;
    const step = Math.floor(totalDays / (numPoints - 1)); // Ensure 6 evenly spaced points

    let datePoints = [];
    for (let i = numPoints - 1; i >= 0; i--) {
        let date = new Date(today);
        date.setDate(today.getDate() - i * step); // Subtract i * step days from today
        let day = date.getDate();
        let month = date.getMonth() + 1; // Months are 0-indexed in JS
        datePoints.push(`${day}/${month}`);
    }

    return datePoints;
};

export default compute_month_date_points