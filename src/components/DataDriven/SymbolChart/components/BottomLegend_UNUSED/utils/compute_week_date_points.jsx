
// now using the data will tell you what is the first and what is the last day in the weekly data,
// all the days you need to use...
// actually when you scale based on timepoints, that's 

const compute_week_date_points = (data,mobile) => {
   
     // Handle 1W case (last 7 days)
     let today = new Date();
     let datePoints = [];

     for (let i = 6; i >= 0; i--) {
         let date = new Date(today);
         date.setDate(today.getDate() - i);
         let day = date.getDate();
         let month = date.getMonth() + 1; // Months are 0-indexed in JS
         datePoints.push(`${day}/${month}`);
     }

     return datePoints;
   
   };
   
   export default compute_week_date_points
   





   
// you should scale based on timepoints, but in an adjusted way that take counts of what days are there and what days are not...
/*

Ok, if you use the indexes you have problems with newly added data.
On the other hand, if you use timestamps, you have the problem of the missing days or hours,
so how to solve it?
One way to solve it it for the newly added data to add a property like:

You need to solve this problem.

*/