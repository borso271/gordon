export const getPercentage = (totalRatings:number,count: number): number => {
    return  totalRatings ? Math.round((count / totalRatings) * 100) : 0;
  };