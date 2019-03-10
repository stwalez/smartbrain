import React from 'react';

const Rank = ({ name, entries }) => {
	return (
		<div className='white f3' style={{zIndex: 1}} >
			<div className='white f3'>
				{`${name}, your current entry count is...`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
		</div>
		
		);

}
//const checkie = console.log("name is", name);
export default Rank;