import React, { useEffect, useState } from 'react';

function Viewmarkers(){
const setstyle={height:'100vh'};
    return (
        <div style={setstyle}>
        <iframe
            title="HTML Content"
            src="../../viewmarkers.html" // Adjust the path as needed
            
            width="100%"
            height="100%"
        />
        </div>
    );
}
export default Viewmarkers;