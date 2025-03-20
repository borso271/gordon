import compute_day_date_points from "./compute_day_date_points";
import compute_week_date_points from "./compute_week_date_points";
import compute_month_date_points from "./compute_month_date_points";
import compute_year_date_points from "./compute_year_date_points";
import compute_five_years_date_points from "./compute_five_years_date_points";

const computeDatePoints = (period, data,exchange_mic,mobile=false) => {
    if (period === "1D") {
        return compute_day_date_points(data,exchange_mic,mobile);
    } else if (period === "1W") {
        return compute_week_date_points(data, mobile);
    } else if (period === "1M") {
        return compute_month_date_points(data, mobile);
    } else if (period === "1Y") {
        return compute_year_date_points(data, mobile);
    } else if (period === "5Y") {
        return compute_five_years_date_points(data, mobile);
    } else {
        throw new Error(`Invalid period: ${period}`);
    }
};

export default computeDatePoints;
