// Import React library to use JSX
import React from 'react'; 

// Define a functional component named Greeting
// It receives 'name' as a prop from the parent component
const Greeting = ({ name }) => { 
  // Return a div that greets the user with their name
  return <div>Hello, {name}!</div>;
};

// Export the component so it can be used in other files
export default Greeting;
