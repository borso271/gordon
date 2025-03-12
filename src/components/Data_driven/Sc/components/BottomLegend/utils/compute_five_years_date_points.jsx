
const compute_five_years_date_points = (seriesData,mobile) => {
    const currentYear = new Date().getFullYear();
    
    // Generate the last 5 years in descending order
    let datePoints = [];
    for (let i = 4; i >= 0; i--) {
        datePoints.push((currentYear - i).toString());
    }

    return datePoints;
};

export default compute_five_years_date_points