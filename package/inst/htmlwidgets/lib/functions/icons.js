
function generate_icon_html(data, viewBox){

	// Make icon a div
	var icon = document.createElement('div');

	// Generate svg
	var svg = document.createElement('svg');
	icon.appendChild(svg);
	svg.setAttribute('height', '100%');
	svg.setAttribute('viewBox', viewBox);
	svg.style = "fill-rule:evenodd;clip-rule:evenodd";

	// Generate path
	var path = document.createElement('path');
	svg.appendChild(path);
	path.setAttribute('d', data)
	path.style.fill  = "currentColor";

	// Style the icon
	icon.style.height  = "1em";
	icon.style.display = "inline-block";

	// Return the icon
	return(icon.outerHTML);

}

function icon_info(){
	return(
		generate_icon_html(
			'M50,1c27.044,0 49,21.956 49,49c0,27.044 -21.956,49 -49,49c-27.044,0 -49,-21.956 -49,-49c0,-27.044 21.956,-49 49,-49Zm0,12c20.421,0 37,16.579 37,37c0,20.421 -16.579,37 -37,37c-20.421,0 -37,-16.579 -37,-37c0,-20.421 16.579,-37 37,-37Zm4.146,27.185c2.289,0 4.147,1.858 4.147,4.146l0,32.969c0,2.288 -1.858,4.146 -4.147,4.146l-8.292,0c-2.289,0 -4.147,-1.858 -4.147,-4.146l0,-32.969c0,-2.288 1.858,-4.146 4.147,-4.146l8.292,0Zm-4.146,-22.739c4.828,0 8.747,3.92 8.747,8.747c0,4.828 -3.919,8.748 -8.747,8.748c-4.828,0 -8.747,-3.92 -8.747,-8.748c0,-4.827 3.919,-8.747 8.747,-8.747Z',
			'0 0 100 100'
			)
		);
}

function icon_center(){
	return(
		generate_icon_html(
			'M50,1c27.044,0 49,21.956 49,49c0,27.044 -21.956,49 -49,49c-27.044,0 -49,-21.956 -49,-49c0,-27.044 21.956,-49 49,-49Zm0,12c20.421,0 37,16.579 37,37c0,20.421 -16.579,37 -37,37c-20.421,0 -37,-16.579 -37,-37c0,-20.421 16.579,-37 37,-37Zm0,24.5c6.899,0 12.5,5.601 12.5,12.5c0,6.899 -5.601,12.5 -12.5,12.5c-6.899,0 -12.5,-5.601 -12.5,-12.5c0,-6.899 5.601,-12.5 12.5,-12.5Z',
			'0 0 100 100'
			)
		);
}

function icon_snapshot(){
	return(
		generate_icon_html(
			'M100.345,92l-80.5,0c-10.348,0 -18.75,-8.402 -18.75,-18.75l0,-37.5c0,-10.348 8.402,-18.75 18.75,-18.75l7.75,0l0,-1.174c0,-4.319 3.507,-7.826 7.827,-7.826l49.347,0c4.32,0 7.826,3.507 7.826,7.826l0,1.174l7.75,0c10.349,0 18.75,8.402 18.75,18.75l0,37.5c0,10.348 -8.401,18.75 -18.75,18.75Zm-40.345,-68.015c16.014,0 29.015,13.001 29.015,29.015c0,16.014 -13.001,29.015 -29.015,29.015c-16.014,0 -29.015,-13.001 -29.015,-29.015c0,-16.014 13.001,-29.015 29.015,-29.015Z',
			'0 0 120 100'
		)
	);
}

function icon_open(){
	return(
		generate_icon_html(
			'M59.256,13.705c-8.608,2.891 -16.411,7.342 -22.942,13.125l-15.493,0c-1.061,0 -2.079,0.421 -2.829,1.171c-0.75,0.75 -1.171,1.768 -1.171,2.829c0,10.434 0,38.394 0,48.829c0,2.209 1.79,4 4,4c13.188,0 55.204,0 68.392,0c2.209,0 4,-1.791 4,-4l0,-11.132c0.612,-0.336 1.196,-0.731 1.746,-1.187l11.349,-9.778c-0.004,9.479 -0.036,18.957 -0.095,28.436c-0.107,5.583 -4.938,10.551 -10.661,10.66c-27.023,0.169 -54.047,0.169 -81.07,0c-5.583,-0.107 -10.552,-4.938 -10.661,-10.66c-0.13,-20.502 -0.13,-41.005 0,-61.507c0.107,-5.582 4.848,-10.55 10.661,-10.661c14.924,-0.093 29.849,-0.135 44.774,-0.125Zm25.294,7.163l0,-13.698c0,-0.782 0.455,-1.492 1.166,-1.818c0.711,-0.326 1.547,-0.208 2.139,0.303c7.126,6.139 23.729,20.443 29.167,25.128c0.441,0.38 0.694,0.933 0.694,1.515c0,0.582 -0.253,1.135 -0.694,1.515c-5.438,4.685 -22.041,18.989 -29.167,25.128c-0.592,0.51 -1.428,0.628 -2.139,0.303c-0.711,-0.326 -1.166,-1.037 -1.166,-1.819l0,-14.19c-0.297,-0.046 -0.599,-0.103 -0.904,-0.17c-24.129,-5.35 -56.485,18.783 -56.485,18.783c0,0 9.282,-41.759 57.389,-40.98l0,0Z',
			'0 0 120 100'
		)
	);
}


