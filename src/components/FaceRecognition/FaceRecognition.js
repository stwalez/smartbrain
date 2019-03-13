import React from 'react';
import './FaceRecognition.css'


const FaceRecognition = ({ imageUrl, box }) => {
	//console.log(Array.isArray(box))
	return (
		
		<div className='center ma'>
			<div className="absolute mt2">
				
				<img alt='' id='inputimage' src={imageUrl} width='500px' height='auto'/>
				{box.map(boxer =>
		          <div key={`boxer${boxer.topRow}${boxer.rightCol}`}
		              className='bounding-box'
		              style={{top: boxer.topRow, right: boxer.rightCol, bottom: boxer.bottomRow, left: boxer.leftCol}}>
		          </div>
		          )				
			}
			{console.log(document.querySelector("key"))}		
			</div>
		</div>
		);
}

export default FaceRecognition;