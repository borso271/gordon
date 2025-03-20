
function formatPoints(points) {
    return points.map(point => {
      const date = new Date(point.time); // Convert seconds to milliseconds
  
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
  
      return {
        ...point,
        formattedTime: `${formattedDate} ${formattedTime}`,
      };
    });
  }

  export default formatPoints